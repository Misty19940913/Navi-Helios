import pandas as pd
import numpy as np
import math

def run_advanced_backtest(df, start_cash=1000000.0, position_pct=0.10, fast_ma_len=5, slow_ma_len=10):
    """
    執行 自訂快慢均線 進出場 + 3% 止損 + 跌破快線賣一半，跌破慢線全賣 策略
    df: 包含 'open', 'high', 'low', 'close', 'date'，以及對應變數名稱的均線 (例如 '5MA', '10MA' 或 '7MA', '13MA') 的還原股價資料
    position_pct: 每筆交易預設投入總資金的 10%
    """
    fast_ma_col = f'{fast_ma_len}MA'
    slow_ma_col = f'{slow_ma_len}MA'
    cash = start_cash
    position_shares = 0       # 持有股數
    entry_price = 0.0         # 平均進場成本
    avg_cost_per_share = 0.0  # 包含手續費的每股均價(用於算真實損益)
    trade_logs = []
    equity_curve = []         # 資產曲線紀錄
    
    # 策略參數
    SL_PCT = 0.03         # 止損 3%
    TP_PCT = 0.03         # 停利 3%
    FEE_RATE = 0.001425   # 手續費 (券商基本費率)
    TAX_RATE = 0.003      # 交易稅 (台股賣出時收取)

    # 模擬變數：紀錄這筆單是否已經停利過一半
    tp_half_done = False

    for i in range(1, len(df)):
        current_date = df['date'].iloc[i]
        
        c_open = df['open'].iloc[i]
        c_high = df['high'].iloc[i]
        c_low = df['low'].iloc[i]
        c_close = df['close'].iloc[i]
        
        # 今日MA
        ma_fast = df[fast_ma_col].iloc[i]
        # 需確保外部傳入 df 時包含慢線
        if slow_ma_col in df.columns:
            ma_slow = df[slow_ma_col].iloc[i]
            prev_ma_slow = df[slow_ma_col].iloc[i-1]
        else:
            # 容錯處理：若未抓取慢線，暫以快線替代防呆
            ma_slow = ma_fast
            prev_ma_slow = df[fast_ma_col].iloc[i-1]
        
        # 昨日資訊 (為避免前瞻偏差，進出場決策須依賴昨日資訊，於今日執行)
        prev_ma_fast = df[fast_ma_col].iloc[i-1]
        prev_close = df['close'].iloc[i-1]
        
        has_exited_today = False

        # --- 2. 持股中的判斷 (事件驅動：優先檢查停損 / 停利) ---
        if position_shares > 0:
            sl_price = entry_price * (1 - SL_PCT)
            tp_price = entry_price * (1 + TP_PCT)
            
            # A. 停損機制 (觸價停損，保護本金)
            if c_low <= sl_price:
                # 若開盤就跳空跌破，以開盤價成交；否則以停損價成交
                exec_price = min(c_open, sl_price)
                revenue = position_shares * exec_price
                cost_fee = max(20, math.floor(revenue * FEE_RATE))
                cost_tax = math.floor(revenue * TAX_RATE)
                
                net_revenue = revenue - cost_fee - cost_tax
                realized_pnl = net_revenue - (avg_cost_per_share * position_shares)
                cash += net_revenue
                trade_logs.append({'date': current_date, 'action': 'STOP_LOSS', 'price': exec_price, 'shares': -position_shares, 'reason': '觸發-3%停損', 'realized_pnl': realized_pnl})
                position_shares = 0
                has_exited_today = True

            # B. 趨勢出場機制 1：跌破慢線 (全數出場)
            elif (not has_exited_today) and (prev_close < prev_ma_slow):
                exec_price = c_open
                revenue = position_shares * exec_price
                cost_fee = max(20, math.floor(revenue * FEE_RATE))
                cost_tax = math.floor(revenue * TAX_RATE)
                
                net_revenue = revenue - cost_fee - cost_tax
                realized_pnl = net_revenue - (avg_cost_per_share * position_shares)
                cash += net_revenue
                trade_logs.append({'date': current_date, 'action': f'EXIT_ALL_{slow_ma_col}', 'price': exec_price, 'shares': -position_shares, 'reason': f'昨日破{slow_ma_col}_今日全數賣出', 'realized_pnl': realized_pnl})
                position_shares = 0
                has_exited_today = True

            # C. 趨勢出場機制 2：跌破快線 (出場一半)
            elif (not has_exited_today) and (prev_close < prev_ma_fast) and (not tp_half_done):
                # 今日開盤價賣出一半
                exec_price = c_open
                sell_shares = position_shares // 2
                
                if sell_shares > 0:
                    revenue = sell_shares * exec_price
                    cost_fee = max(20, math.floor(revenue * FEE_RATE))
                    cost_tax = math.floor(revenue * TAX_RATE)
                    
                    net_revenue = revenue - cost_fee - cost_tax
                    realized_pnl = net_revenue - (avg_cost_per_share * sell_shares)
                    cash += net_revenue
                    trade_logs.append({'date': current_date, 'action': f'EXIT_HALF_{fast_ma_col}', 'price': exec_price, 'shares': -sell_shares, 'reason': f'昨日破{fast_ma_col}_今日賣出一半', 'realized_pnl': realized_pnl})
                    position_shares -= sell_shares
                    tp_half_done = True

        # --- 1. 進場邏輯 ---
        # 條件：無部位，今日未執行出場，昨日收盤站上昨日快線，且昨日快線大於前日快線 (確保向上)
        if position_shares == 0 and not has_exited_today and i >= 2:
            prev2_ma_fast = df[fast_ma_col].iloc[i-2]
            
            if prev_close > prev_ma_fast and prev_ma_fast > prev2_ma_fast:
                # 動態部位計算：總資產的 10%
                current_equity = cash + position_shares * c_close
                invest_amount = current_equity * position_pct
                
                exec_price = c_open
                # 換算可買股數 (實務上台股為1000股一張，此處以最小單位"股"計算，若有零股需求)
                buy_shares = math.floor(invest_amount / exec_price)
                invest_cost = buy_shares * exec_price
                cost_fee = max(20, math.floor(invest_cost * FEE_RATE))
                
                if cash >= (invest_cost + cost_fee) and buy_shares > 0:
                    cash -= (invest_cost + cost_fee)
                    position_shares = buy_shares
                    entry_price = exec_price
                    avg_cost_per_share = (invest_cost + cost_fee) / buy_shares
                    tp_half_done = False
                    
                    trade_logs.append({'date': current_date, 'action': 'BUY', 'price': exec_price, 'shares': buy_shares, 'reason': f'昨日站上向上{fast_ma_col}_今日進場'})

        # --- 結算每日總資產 ---
        current_equity = cash + position_shares * c_close
        equity_curve.append({'date': current_date, 'cash': cash, 'position_value': position_shares * c_close, 'total_equity': current_equity})

    df_logs = pd.DataFrame(trade_logs)
    df_equity = pd.DataFrame(equity_curve)
    
    return df_logs, df_equity