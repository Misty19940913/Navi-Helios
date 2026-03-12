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
plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei']
plt.rcParams['axes.unicode_minus'] = False

def run_sizing_backtest(ticks, mode='fixed', value=0.1, bb_std=1.7):
    # 預算指標
    c = ticks.set_index('timestamp')['BID'].resample('5min').ohlc()
    sma = c['close'].rolling(21).mean()
    std = c['close'].rolling(21).std()
    c['BBM'] = sma; c['BBL'] = sma - (bb_std * std); c['BBU'] = sma + (bb_std * std)
    l9 = c['low'].rolling(9).min(); h9 = c['high'].rolling(9).max()
    rsv = (c['close'] - l9) / (h9 - l9) * 100
    c['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    c_sig = c[['BBL', 'BBM', 'BBU', 'K']].shift(1)
    df = pd.merge_asof(ticks, c_sig, left_on='timestamp', right_index=True).dropna()
    
    bid_arr = df['BID'].values
    bbl_arr = df['BBL'].values; bbm_arr = df['BBM'].values; bbu_arr = df['BBU'].values
    k_arr = df['K'].values
    
    balance = 10000; equity = [balance]
    pos = 0; ep = 0; tp = 0; sl = 0; units = 0
    t_low = False; t_high = False
    
    for i in range(len(bid_arr)):
        bid = bid_arr[i]
        if pos == 0:
            if bid < bbl_arr[i]: t_low = True
            if bid > bbu_arr[i]: t_high = True
            
            if (t_low and bid > bbl_arr[i] and k_arr[i] < 20) or (t_high and bid < bbu_arr[i] and k_arr[i] > 80):
                is_long = bid > bbl_arr[i]
                ep = bid
                if is_long:
                    pos = 1; t_low = False
                    sl = bbl_arr[i] - 1.5 # 寬一點的止損
                    tp = ep + (bbm_arr[i] - ep) * 0.7
                else:
                    pos = -1; t_high = False
                    sl = bbu_arr[i] + 1.5
                    tp = ep - (ep - bbm_arr[i]) * 0.7
                
                # --- 手數計算 (關鍵) ---
                sl_dist = abs(ep - sl)
                if mode == 'fixed':
                    lots = value
                elif mode == 'risk':
                    # 每次止損本金 1% (假設初始 1萬，就是 100 USD)
                    risk_amt = balance * value 
                    lots = risk_amt / (sl_dist * 100)
                    lots = min(max(lots, 0.01), 2.0) # 限制最小 0.01，最大 2.0 手避免極端
                
                units = lots * 100

        elif pos == 1:
            if bid >= tp: balance += (tp - ep)*units; pos = 0
            elif bid <= sl: balance += (sl - ep)*units; pos = -1; ep = sl; tp = ep - abs(sl-ep); sl = ep + 2.0
        elif pos == -1:
            if bid <= tp: balance += (ep - tp)*units; pos = 0
            elif bid >= sl: balance += (ep - sl)*units; pos = 1; ep = sl; tp = ep + abs(sl-ep); sl = ep - 2.0
        
        if i % 250000 == 0: equity.append(balance)
        
    return {"ec": equity, "final": balance, "max_dd": ((pd.Series(equity).cummax() - pd.Series(equity)) / pd.Series(equity).cummax()).max()}

def main():
    print("🕵️ 執行黃金手數壓力鑑定...")
    ticks = pd.read_parquet(TICK_PATH, columns=['timestamp', 'BID']).sort_values('timestamp')
    
    scenarios = [
        {"label": "固定 0.1 Lot (保守)", "mode": "fixed", "val": 0.1},
        {"label": "固定 0.3 Lot (進取)", "mode": "fixed", "val": 0.3},
        {"label": "固定 0.5 Lot (激進)", "mode": "fixed", "val": 0.5},
        {"label": "單筆風險 1% (職業)", "mode": "risk", "val": 0.01},
        {"label": "單筆風險 2% (極限)", "mode": "risk", "val": 0.02},
    ]
    
    plt.figure(figsize=(12, 7))
    print("\n📋 績效鑑定結果 (SD 1.7):")
    print(f"{'策略模型':<20} | {'最終資產':<12} | {'最大回撤':<8}")
    print("-" * 50)
    
    for s in scenarios:
        res = run_sizing_backtest(ticks, mode=s['mode'], value=s['val'])
        plt.plot(res['ec'], label=f"{s['label']}")
        print(f"{s['label']:<18} | ${res['final']:<11.2f} | {res['max_dd']*100:>7.1f}%")
        
    plt.title("不同手數與風險管理模型 - 資金成長對比 (SD 1.7)")
    plt.ylabel("餘額 (USD)"); plt.legend(); plt.grid(alpha=0.3)
    plt.savefig(os.path.join(output_dir, "sizing_comparison.png"))
    print(f"\n🖼️ 對比圖已存至: {os.path.join(output_dir, 'sizing_comparison.png')}")

if __name__ == "__main__":
    main()
