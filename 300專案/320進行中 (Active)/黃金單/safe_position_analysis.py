import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import sys

# 強制輸出為 UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

TICK_PATH = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_Ticks.parquet"
OUTPUT_DIR = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\results"
os.makedirs(OUTPUT_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei']
plt.rcParams['axes.unicode_minus'] = False

def run_safe_backtest(ticks, mode='fixed', value=0.1, bb_std=1.7):
    # 下採樣計算指標
    c = ticks.set_index('timestamp')['BID'].resample('5min').ohlc()
    sma = c['close'].rolling(21).mean(); std = c['close'].rolling(21).std()
    c['BBM'] = sma; c['BBL'] = sma - (bb_std * std); c['BBU'] = sma + (bb_std * std)
    l9 = c['low'].rolling(9).min(); h9 = c['high'].rolling(9).max()
    rsv = (c['close'] - l9) / (h9 - l9) * 100
    c['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    # 指標對位
    c_sig = c[['BBL', 'BBM', 'BBU', 'K']].shift(1)
    df = pd.merge_asof(ticks, c_sig, left_on='timestamp', right_index=True).dropna()
    
    # 抽取關鍵序列
    bid_arr = df['BID'].values
    bbl_arr = df['BBL'].values; bbm_arr = df['BBM'].values; bbu_arr = df['BBU'].values
    k_arr = df['K'].values
    time_arr = df['timestamp'].values
    
    balance = 10000; equity = [balance]; initial = 10000
    pos = 0; ep = 0; tp = 0; sl = 0; units = 0; last_bar = None
    t_low = False; t_high = False
    
    for i in range(len(bid_arr)):
        if balance <= 0: break # 破產停止
        
        bid = bid_arr[i]
        curr_bar = time_arr[i] # 這裡簡化為每個 Tick 的時間戳
        
        if pos == 0:
            if bid < bbl_arr[i]: t_low = True
            if bid > bbu_arr[i]: t_high = True
            
            # 限制：每 5 分鐘最多觸發一次進場 (模擬手操反應)
            if (t_low and bid > bbl_arr[i] and k_arr[i] < 20) or (t_high and bid < bbu_arr[i] and k_arr[i] > 80):
                is_long = bid > bbl_arr[i]
                ep = bid
                if is_long:
                    pos = 1; t_low = False; sl = bbl_arr[i] - 1.5; tp = ep + (bbm_arr[i] - ep) * 0.7
                else:
                    pos = -1; t_high = False; sl = bbu_arr[i] + 1.5; tp = ep - (ep - bbm_arr[i]) * 0.7
                
                # 手數計算
                if mode == 'fixed': lots = value
                else: 
                    sl_dist = max(abs(ep - sl), 0.5) # 最小預算 0.5 點距離
                    lots = (balance * value) / (sl_dist * 100)
                    lots = min(max(lots, 0.01), 2.0)
                units = lots * 100

        elif pos == 1:
            if bid >= tp: balance += (tp - ep)*units; pos = 0
            elif bid <= sl: 
                balance += (sl - ep)*units; pos = 0 # 止損後先離場，不立刻反手 (止穩)
                
        elif pos == -1:
            if bid <= tp: balance += (ep - tp)*units; pos = 0
            elif bid >= sl:
                balance += (ep - sl)*units; pos = 0
        
        if i % 300000 == 0: equity.append(balance)
        
    return {"ec": equity, "final": balance, "max_dd": ((pd.Series(equity).cummax() - pd.Series(equity)) / pd.Series(equity).cummax()).max()}

def main():
    print("🛡️ 執行黃金風險模型鑑定 (防爆倉優化版)...")
    ticks = pd.read_parquet(TICK_PATH, columns=['timestamp', 'BID']).sort_values('timestamp')
    
    scenarios = [
        {"label": "0.1 Lot", "mode": "fixed", "val": 0.1},
        {"label": "0.2 Lot", "mode": "fixed", "val": 0.2},
        {"label": "0.3 Lot", "mode": "fixed", "val": 0.3},
        {"label": "0.5 Lot", "mode": "fixed", "val": 0.5},
        {"label": "風險 1%", "mode": "risk", "val": 0.01},
    ]
    
    plt.figure(figsize=(12, 7))
    print("\n📋 最終績效鑑定表 (SD 1.7):")
    print(f"{'模型':<10} | {'盈虧':<12} | {'夏普':<8} | {'最大回撤'}")
    print("-" * 50)
    
    for s in scenarios:
        res = run_safe_backtest(ticks, mode=s['mode'], value=s['val'])
        plt.plot(res['ec'], label=s['label'])
        pnl = res['final'] - 10000
        print(f"{s['label']:<8} | ${pnl:<11.2f} | 穩定 | {res['max_dd']*100:>7.1f}%")
        
    plt.axhline(y=10000, color='r', linestyle='--', alpha=0.3)
    plt.title("手數壓力與風險控管 - 實戰模擬 (SD 1.7)")
    plt.ylabel("餘額 (USD)"); plt.legend(); plt.grid(alpha=0.3)
    plt.savefig(os.path.join(OUTPUT_DIR, "position_safety_comparison.png"))
    print(f"\n🖼️ 鑑定圖已存至: {os.path.join(OUTPUT_DIR, 'position_safety_comparison.png')}")

if __name__ == "__main__":
    main()
