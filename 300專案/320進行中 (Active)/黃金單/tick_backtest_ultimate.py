import pandas as pd
import numpy as np
import os
import time
import sys

# 強制輸出為 UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# 數據路徑
tick_path = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_Ticks.parquet"
output_dir = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\results"

def run_tick_backtest(initial_capital=10000, lot_size=0.1, bb_std=1.7):
    print(f"🕵️ 啟動 Tick 級別極限回測 (SD={bb_std})...")
    start_all = time.time()

    # 1. 載入 3000 萬筆 Tick 數據 (僅讀取 BID 用於計算與執行)
    print("📂 載入原始 Tick 證物中...")
    ticks = pd.read_parquet(tick_path, columns=['timestamp', 'BID'])
    ticks.sort_values('timestamp', inplace=True)
    
    # 2. 計算 5m 指標 (預先合成指標，再 Map 回 Tick)
    print("🕯️ 指標同步對位中 (BB & KD)...")
    # 先做 5m 蠟燭圖來算指標
    c5 = ticks.set_index('timestamp')['BID'].resample('5min').ohlc()
    # BB (21, std)
    sma = c5['close'].rolling(21).mean()
    std = c5['close'].rolling(21).std()
    c5['BBM'] = sma
    c5['BBL'] = sma - (bb_std * std)
    c5['BBU'] = sma + (bb_std * std)
    # KD (9,3,3)
    l9 = c5['low'].rolling(9).min()
    h9 = c5['high'].rolling(9).max()
    rsv = (c5['close'] - l9) / (h9 - l9) * 100
    c5['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    # 將 5m 指標結果 Map 回去給 3000 萬筆 Tick (使用 merge_asof 進行最精準對位)
    # 讓每個 Tick 看到的是「剛結束的那一根指標值」，避開未來函數
    c5_signals = c5[['BBL', 'BBM', 'BBU', 'K']].shift(1) # 重要：只能看已完成的指標
    ticks = pd.merge_asof(ticks, c5_signals, left_on='timestamp', right_index=True)
    ticks.dropna(inplace=True)
    
    # 3. 核心循環：模擬實盤逐跳執行
    print("⚙️ 開始逐跳模擬 (這可能需要點時間)...")
    balance = initial_capital
    pos = 0 # 0:無, 1:多, -1:空
    ep = 0; tp = 0; sl = 0
    units = lot_size * 100
    pnls = []
    equity = [initial_capital]
    
    # 刑事筆記：為了速度，我們將數據轉為 Numpy 處理
    bid_arr = ticks['BID'].values
    bbl_arr = ticks['BBL'].values
    bbm_arr = ticks['BBM'].values
    bbu_arr = ticks['BBU'].values
    k_arr = ticks['K'].values
    
    touched_bbl = False
    touched_bbu = False
    
    # 改進：記錄這波的高低點
    last_10_low = ticks['BBL'].values # 簡化：止損用指標帶作參考
    
    for i in range(len(bid_arr)):
        bid = bid_arr[i]
        
        if pos == 0:
            # 進場監控
            if bid < bbl_arr[i]: touched_bbl = True
            if bid > bbu_arr[i]: touched_bbu = True
            
            # 多單：觸及後彈回 + KD 超賣
            if touched_bbl and bid > bbl_arr[i] and k_arr[i] < 20:
                pos = 1; ep = bid; touched_bbl = False
                tp = ep + (bbm_arr[i] - ep) * 0.7
                sl = bbl_arr[i] - 1.0 # 寬容止損：低於下軌 1 美金
            # 空單
            elif touched_bbu and bid < bbu_arr[i] and k_arr[i] > 80:
                pos = -1; ep = bid; touched_bbu = False
                tp = ep - (ep - bbm_arr[i]) * 0.7
                sl = bbu_arr[i] + 1.0
                
        elif pos == 1:
            if bid >= tp:
                pnl = (tp - ep) * units; balance += pnl; pnls.append(pnl); pos = 0
            elif bid <= sl:
                pnl = (sl - ep) * units; balance += pnl; pnls.append(pnl)
                # 反手
                pos = -1; ep = sl; tp = ep - abs(pnl/units); sl = ep + 2.0
                
        elif pos == -1:
            if bid <= tp:
                pnl = (ep - tp) * units; balance += pnl; pnls.append(pnl); pos = 0
            elif bid >= sl:
                pnl = (ep - sl) * units; balance += pnl; pnls.append(pnl)
                # 反手
                pos = 1; ep = sl; tp = ep + abs(pnl/units); sl = ep - 2.0
        
        # 每 10 萬筆紀錄一次資金，節省繪圖壓力
        if i % 100000 == 0:
            equity.append(balance)

    end_all = time.time()
    
    # 4. 產出報告
    pnls_s = pd.Series(pnls)
    final_pnl = balance - initial_capital
    win_rate = (pnls_s > 0).mean() if not pnls_s.empty else 0
    
    print("\n✅ Tick 級別鑑定完成！")
    print(f"⏱️ 運算耗時: {end_all - start_all:.2f} 秒")
    print("-" * 40)
    print(f"最終資產: ${balance:.2f}")
    print(f"總淨利: ${final_pnl:.2f}")
    print(f"勝率: {win_rate*100:.2f}%")
    print(f"總成交筆數: {len(pnls)}")
    
    # 儲存資金曲線數據
    pd.DataFrame({"equity": equity}).to_parquet(os.path.join(output_dir, "tick_equity_curve.parquet"))

if __name__ == "__main__":
    run_tick_backtest()
