import pandas as pd
import numpy as np
import os
import time

# 數據加載
data_path = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_5m_Clean.parquet"

def run_advanced_backtest(df, bb_std=2.0, initial_capital=10000, lot_size=0.1):
    """
    進階回測腳本
    - initial_capital: 初始本金 (USD)
    - lot_size: 固定手數 (1標準手 = 100盎司, 0.1手 = 10盎司)
    - tp_ratio: 70% 預期利潤出場 (相對於中軌的距離)
    """
    # 1. 指標計算 (手動計算確保精確)
    sma21 = df['close'].rolling(21).mean()
    std21 = df['close'].rolling(21).std()
    df['BBM'] = sma21
    df['BBL'] = sma21 - (bb_std * std21)
    df['BBU'] = sma21 + (bb_std * std21)
    
    # KD (9, 3, 3) 
    low9 = df['low'].rolling(9).min()
    high9 = df['high'].rolling(9).max()
    rsv = (df['close'] - low9) / (high9 - low9) * 100
    df['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    # 2. 回測變數初始化
    balance = initial_capital
    equity_curve = [initial_capital]
    position = 0      # 0: 無倉, 1: 多單, -1: 空單
    entry_price = 0
    tp_price = 0
    sl_price = 0
    trades_log = []
    
    # 合約規格：黃金 1 手 = 100 盎司
    contract_size = 100 
    units = lot_size * contract_size
    
    # 逐棒模擬
    for i in range(21, len(df)):
        row = df.iloc[i]
        prev_row = df.iloc[i-1]
        
        # --- 進場邏輯 ---
        if position == 0:
            # 多單：觸及下軌後上揚 + KD 超賣 (20 附近)
            if prev_row['low'] < prev_row['BBL'] and row['close'] > row['BBL'] and row['K'] < 20:
                position = 1
                entry_price = row['close']
                # 計算目標價 (TP 為中軌距離的 70%)
                dist_to_mid = row['BBM'] - entry_price
                tp_price = entry_price + (dist_to_mid * 0.7)
                # 止損價為波段最低 (簡易模擬：前10根最低)
                sl_price = df.iloc[max(0, i-10):i]['low'].min()
                
            # 空單：觸及上軌後下降 + KD 超買 (80 附近)
            elif prev_row['high'] > prev_row['BBU'] and row['close'] < row['BBU'] and row['K'] > 80:
                position = -1
                entry_price = row['close']
                dist_to_mid = entry_price - row['BBM']
                tp_price = entry_price - (dist_to_mid * 0.7)
                sl_price = df.iloc[max(0, i-10):i]['high'].max()

        # --- 出場邏輯 (多單) ---
        elif position == 1:
            # 止盈 (中軌 70%)
            if row['high'] >= tp_price:
                pnl = (tp_price - entry_price) * units
                balance += pnl
                trades_log.append(pnl)
                position = 0
            # 止損 (預掛單觸發)
            elif row['low'] <= sl_price:
                pnl = (sl_price - entry_price) * units
                balance += pnl
                trades_log.append(pnl)
                # 此處模擬反手邏輯 (預掛空單)
                position = -1
                entry_price = sl_price
                # 反手單的 TP 為 1:1 或中軌
                tp_price = entry_price - abs(pnl/units) 
                sl_price = row['close'] # 多單進場點作為新的止損點
                
        # --- 出場邏輯 (空單) ---
        elif position == -1:
            # 止盈
            if row['low'] <= tp_price:
                pnl = (entry_price - tp_price) * units
                balance += pnl
                trades_log.append(pnl)
                position = 0
            # 止損
            elif row['high'] >= sl_price:
                pnl = (entry_price - sl_price) * units
                balance += pnl
                trades_log.append(pnl)
                # 此處模擬反手邏輯 (預掛多單)
                position = 1
                entry_price = sl_price
                tp_price = entry_price + abs(pnl/units)
                sl_price = row['close']
        
        equity_curve.append(balance)

    # 3. 績效統計
    trades_series = pd.Series(trades_log)
    if len(trades_series) == 0: return None
    
    total_pnl = balance - initial_capital
    win_rate = (trades_series > 0).mean()
    
    # 計算夏普比率 (Sharpe Ratio) - 簡易日化轉換
    daily_returns = pd.Series(equity_curve).pct_change().dropna()
    sharpe = (daily_returns.mean() / daily_returns.std()) * np.sqrt(252 * 24 * 12) if daily_returns.std() != 0 else 0
    
    # 最大回撤 (Drawdown)
    equity_pd = pd.Series(equity_curve)
    drawdown = (equity_pd.cummax() - equity_pd) / equity_pd.cummax()
    max_dd = drawdown.max()

    return {
        "本金": initial_capital,
        "手數": lot_size,
        "偏差值": bb_std,
        "最終餘額": balance,
        "總淨利": total_pnl,
        "勝率": f"{win_rate*100:.2f}%",
        "總次數": len(trades_log),
        "夏普比率": f"{sharpe:.2f}",
        "最大回撤": f"{max_dd*100:.2f}%"
    }

def main():
    if not os.path.exists(data_path):
        print("❌ 找不到數據檔")
        return
        
    df_raw = pd.read_parquet(data_path)
    # 固定回測背景：1萬美金本金，0.1手 (每點波動 $1)
    sd_to_test = 2.0
    
    print(f"📖 刑事鑑定報告：策略深度驗證")
    print(f"背景設定：本金 $10,000 | 手數 0.1 Lot | 偏差值 {sd_to_test}")
    print("-" * 40)
    
    res = run_advanced_backtest(df_raw, bb_std=sd_to_test, initial_capital=10000, lot_size=0.1)
    
    if res:
        for k, v in res.items():
            print(f"{k}: {v}")
    else:
        print("無交易紀錄")

if __name__ == "__main__":
    main()
