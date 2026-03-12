import pandas as pd
import pandas_ta as ta
import os
import numpy as np

# 數據加載
data_path = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_5m_Clean.parquet"

def run_backtest(df, bb_std=2.0):
    # --- 指標計算 (手動計算避免 Library Bug) ---
    # Bollinger Bands (21, std)
    sma21 = df['close'].rolling(21).mean()
    std21 = df['close'].rolling(21).std()
    df['BBM'] = sma21
    df['BBL'] = sma21 - (bb_std * std21)
    df['BBU'] = sma21 + (bb_std * std21)
    
    # KD (9, 3, 3) 
    # RSV = (Close - Low_9) / (High_9 - Low_9) * 100
    low9 = df['low'].rolling(9).min()
    high9 = df['high'].rolling(9).max()
    rsv = (df['close'] - low9) / (high9 - low9) * 100
    df['K'] = rsv.ewm(com=2, adjust=False).mean() # 3 週期平均
    
    # 驗證：計算 low < BBL 的次數
    # print(f"DEBUG: SD={bb_std} | Low < BBL Count: {(df['low'] < df['BBL']).sum()}")
    
    # --- 策略回測變數 ---
    balance = 100000  # 初始模擬資金
    position = 0      # 0: 無倉, 1: 多單, -1: 空單
    entry_price = 0
    total_trades = 0
    win_trades = 0
    
    # 用於預掛單與止損邏輯的變數
    lowest_low_in_wave = 0
    highest_high_in_wave = 0
    
    # 逐棒模擬 (為了精確模擬手操邏輯)
    for i in range(1, len(df)):
        row = df.iloc[i]
        prev_row = df.iloc[i-1]
        
        # --- 進場邏輯 ---
        if position == 0:
            # 多單：觸及下軌後上揚 + KD 超賣 (20 附近)
            if prev_row['low'] < prev_row['BBL'] and row['close'] > row['BBL'] and row['K'] < 20:
                position = 1
                entry_price = row['close']
                total_trades += 1
                lowest_low_in_wave = df.iloc[max(0, i-10):i]['low'].min() 
            # 空單：觸及上軌後下降 + KD 超買 (80 附近)
            elif prev_row['high'] > prev_row['BBU'] and row['close'] < row['BBU'] and row['K'] > 80:
                position = -1
                entry_price = row['close']
                total_trades += 1
                highest_high_in_wave = df.iloc[max(0, i-10):i]['high'].max()

        # --- 3. 出場邏輯 (多單) ---
        elif position == 1:
            # TP 在中軌
            if row['high'] >= row['BBM']:
                profit = (row['BBM'] - entry_price) * 100 # 假設 100 盎司
                balance += profit
                win_trades += 1
                position = 0
            # 觸發預掛空單 (止損)
            elif row['low'] <= lowest_low_in_wave:
                loss = (lowest_low_in_wave - entry_price) * 100
                balance += loss
                # 這裡應該要立刻反手做空 (簡化版我們先結算)
                position = 0
                
        # --- 4. 出場邏輯 (空單) ---
        elif position == -1:
            if row['low'] <= row['BBM']:
                profit = (entry_price - row['BBM']) * 100
                balance += profit
                win_trades += 1
                position = 0
            elif row['high'] >= highest_high_in_wave:
                loss = (entry_price - highest_high_in_wave) * 100
                balance += loss
                position = 0

    return {
        "std": bb_std,
        "final_balance": balance,
        "total_trades": total_trades,
        "win_rate": (win_trades / total_trades) if total_trades > 0 else 0
    }

def main():
    if not os.path.exists(data_path):
        print("❌ 找不到數據檔，請先執行 generate_5m_candles.py")
        return
        
    df_raw = pd.read_parquet(data_path)
    
    results = []
    print("📊 開始布林通道偏差 (SD) 參數掃描 (1.5 ~ 2.1)...")
    
    # 測試從 1.5 到 2.1 步進 0.1
    for sd in [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]:
        res = run_backtest(df_raw.copy(), bb_std=sd)
        results.append(res)
        print(f"🔹 SD: {sd:.1f} | 獲利: ${res['final_balance']-100000:>8.2f} | 勝率: {res['win_rate']*100:>5.1f}% | 交易次數: {res['total_trades']}")

    # 找出最佳參數
    best = max(results, key=lambda x: x['final_balance'])
    print("\n🏆 刑事鑑定結果：")
    print(f"最佳偏差值: {best['std']}")
    print(f"最終獲利: ${best['final_balance']-100000:.2f}")

if __name__ == "__main__":
    main()
