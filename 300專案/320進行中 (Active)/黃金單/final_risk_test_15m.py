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

def run_pro_backtest(ticks, timeframe='15min', mode='fixed', value=0.1, bb_std=1.7):
    # 指標對位
    c = ticks.set_index('timestamp')['BID'].resample(timeframe).ohlc()
    sma = c['close'].rolling(21).mean(); std = c['close'].rolling(21).std()
    c['BBM'] = sma; c['BBL'] = sma - (bb_std * std); c['BBU'] = sma + (bb_std * std)
    l9 = c['low'].rolling(9).min(); h9 = c['high'].rolling(9).max()
    rsv = (c['close'] - l9) / (h9 - l9) * 100
    c['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    # 指標 shift 避免未來函數
    c_sig = c[['BBL', 'BBM', 'BBU', 'K']].shift(1)
    df = pd.merge_asof(ticks, c_sig, left_on='timestamp', right_index=True).dropna()
    
    bid_arr = df['BID'].values
    bbl_arr = df['BBL'].values; bbm_arr = df['BBM'].values; bbu_arr = df['BBU'].values
    k_arr = df['K'].values
    # 轉換時間為 15 分鐘整點，用於「一棒一次」限制
    bar_id_arr = (df['timestamp'].values.astype('datetime64[m]').astype(int) // 15)
    
    balance = 10000; equity = [balance]
    pos = 0; ep = 0; tp = 0; sl = 0; units = 0
    t_low = False; t_high = False
    last_trade_bar = -1 
    
    for i in range(len(bid_arr)):
        if balance <= 1000: break 
        
        bid = bid_arr[i]
        bar_id = bar_id_arr[i]
        
        if pos == 0:
            if bid < bbl_arr[i]: t_low = True
            if bid > bbu_arr[i]: t_high = True
            
            if bar_id != last_trade_bar:
                if t_low and bid > bbl_arr[i] and k_arr[i] < 20:
                    pos = 1; ep = bid; t_low = False; last_trade_bar = bar_id
                    sl = bbl_arr[i] - 2.0; tp = ep + (bbm_arr[i] - ep) * 0.7
                elif t_high and bid < bbu_arr[i] and k_arr[i] > 80:
                    pos = -1; ep = bid; t_high = False; last_trade_bar = bar_id
                    sl = bbu_arr[i] + 2.0; tp = ep - (ep - bbm_arr[i]) * 0.7
                
                if pos != 0: 
                    sl_dist = max(abs(ep - sl), 0.5)
                    if mode == 'fixed': lots = value
                    else: 
                        lots = (balance * value) / (sl_dist * 100)
                        lots = min(max(lots, 0.01), 2.0)
                    units = lots * 100

        elif pos == 1:
            if bid >= tp: balance += (tp - ep)*units; pos = 0
            elif bid <= sl: balance += (sl - ep)*units; pos = 0 
        elif pos == -1:
            if bid <= tp: balance += (ep - tp)*units; pos = 0
            elif bid >= sl: balance += (ep - sl)*units; pos = 0
        
        if i % 300000 == 0: equity.append(balance)
        
    return {"ec": equity, "final": balance, "max_dd": ((pd.Series(equity).cummax() - pd.Series(equity)) / pd.Series(equity).cummax()).max()}

def main():
    print("🛡️ 執行黃金風險模型鑑定 (15m 時區 / 冷靜期優化版)...")
    ticks = pd.read_parquet(TICK_PATH, columns=['timestamp', 'BID']).sort_values('timestamp')
    
    scenarios = [
        {"lab": "0.1 Lot", "m": "fixed", "v": 0.1},
        {"lab": "0.2 Lot", "m": "fixed", "v": 0.2},
        {"lab": "0.3 Lot", "m": "fixed", "v": 0.3},
        {"lab": "0.5 Lot", "m": "fixed", "v": 0.5},
        {"lab": "風險 1%", "m": "risk", "v": 0.01},
    ]
    
    plt.figure(figsize=(12, 7))
    print("\n📋 15m 時區績效鑑定表 (SD 1.7):")
    print(f"{'模型':<10} | {'最終餘額':<12} | {'回撤':<8}")
    print("-" * 40)
    
    for s in scenarios:
        res = run_pro_backtest(ticks, timeframe='15min', mode=s['m'], value=s['v'])
        plt.plot(res['ec'], label=s['lab'])
        print(f"{s['lab']:<8} | ${res['final']:<11.2f} | {res['max_dd']*100:>6.1f}%")
        
    plt.axhline(y=10000, color='r', linestyle='--', alpha=0.3)
    plt.title("各手數與風險模型 (15m 時區) - 資金成長對比 (SD 1.7 / 冷靜期優化)")
    plt.ylabel("餘額 (USD)"); plt.legend(); plt.grid(alpha=0.3)
    plt.savefig(os.path.join(OUTPUT_DIR, "final_sizing_15m_analysis.png"))
    print(f"\n🖼️ 鑑定圖已存至: {os.path.join(OUTPUT_DIR, 'final_sizing_15m_analysis.png')}")

if __name__ == "__main__":
    main()
