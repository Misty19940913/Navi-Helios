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

def get_signals(ticks, tf='5min', bb_std=1.7):
    c = ticks.set_index('timestamp')['BID'].resample(tf).ohlc()
    sma = c['close'].rolling(21).mean(); std = c['close'].rolling(21).std()
    c['BBM'] = sma; c['BBL'] = sma - (bb_std * std); c['BBU'] = sma + (bb_std * std)
    l9 = c['low'].rolling(9).min(); h9 = c['high'].rolling(9).max()
    rsv = (c['close'] - l9) / (h9 - l9) * 100
    c['K'] = rsv.ewm(com=2, adjust=False).mean()
    return c[['BBL', 'BBM', 'BBU', 'K']].shift(1)

def run_scaling_backtest(ticks, use_5m=True, use_15m=False, bb_std=1.7):
    # 準備信號
    sig5 = get_signals(ticks, '5min', bb_std) if use_5m else None
    sig15 = get_signals(ticks, '15min', bb_std) if use_15m else None
    
    df = ticks.copy()
    if use_5m:
        df = pd.merge_asof(df, sig5, left_on='timestamp', right_index=True)
    if use_15m:
        df = pd.merge_asof(df, sig15, left_on='timestamp', right_index=True, suffixes=('_5m', '_15m') if use_5m else ('', ''))
    
    df.dropna(inplace=True)
    bid_arr = df['BID'].values
    ts_arr = df['timestamp'].values
    
    # 提取指標
    bbl5 = df['BBL_5m'].values if use_5m and use_15m else (df['BBL'].values if use_5m else None)
    bbm5 = df['BBM_5m'].values if use_5m and use_15m else (df['BBM'].values if use_5m else None)
    bbu5 = df['BBU_5m'].values if use_5m and use_15m else (df['BBU'].values if use_5m else None)
    k5 = df['K_5m'].values if use_5m and use_15m else (df['K'].values if use_5m else None)
    
    bbl15 = df['BBL_15m'].values if use_5m and use_15m else (df['BBL'].values if use_15m else None)
    bbm15 = df['BBM_15m'].values if use_5m and use_15m else (df['BBM'].values if use_15m else None)
    bbu15 = df['BBU_15m'].values if use_5m and use_15m else (df['BBU'].values if use_15m else None)
    k15 = df['K_15m'].values if use_5m and use_15m else (df['K'].values if use_15m else None)
    
    bar5_arr = (ts_arr.astype('datetime64[m]').astype(int) // 5) if use_5m else None
    bar15_arr = (ts_arr.astype('datetime64[m]').astype(int) // 15) if use_15m else None
    
    balance = 10000; equity = [balance]
    # [active, ep, tp, sl, units, last_bar, touch_low, touch_high]
    p5 = [False, 0, 0, 0, 0, -1, False, False]
    p15 = [False, 0, 0, 0, 0, -1, False, False]
    
    for i in range(len(bid_arr)):
        if balance <= 1000: break
        bid = bid_arr[i]
        
        # 5m Logic
        if use_5m:
            if not p5[0]:
                if bid < bbl5[i]: p5[6] = True
                if bid > bbu5[i]: p5[7] = True
                if bar5_arr[i] != p5[5]:
                    lots = max(round(balance / 100000, 2), 0.01)
                    if p5[6] and bid > bbl5[i] and k5[i] < 20:
                        p5[0]=True; p5[1]=bid; p5[5]=bar5_arr[i]; p5[6]=False
                        p5[3]=bbl5[i]-2.0; p5[2]=bid+(bbm5[i]-bid)*0.7; p5[4]=lots*100
                    elif p5[7] and bid < bbu5[i] and k5[i] > 80:
                        p5[0]=True; p5[1]=bid; p5[5]=bar5_arr[i]; p5[7]=False
                        p5[3]=bbu5[i]+2.0; p5[2]=bid-(bid-bbm5[i])*0.7; p5[4]=-lots*100
            else:
                # ...
                if p5[4] > 0:
                    if bid >= p5[2]: balance += (p5[2]-p5[1])*p5[4]; p5[0]=False
                    elif bid <= p5[3]: balance += (p5[3]-p5[1])*p5[4]; p5[0]=False
                else:
                    if bid <= p5[2]: balance += (p5[1]-p5[2])*abs(p5[4]); p5[0]=False
                    elif bid >= p5[3]: balance += (p5[1]-p5[3])*abs(p5[4]); p5[0]=False

        # 15m Logic
        if use_15m:
            if not p15[0]:
                if bid < bbl15[i]: p15[6] = True
                if bid > bbu15[i]: p15[7] = True
                if bar15_arr[i] != p15[5]:
                    lots = max(round(balance / 100000, 2), 0.01)
                    if p15[6] and bid > bbl15[i] and k15[i] < 20:
                        p15[0]=True; p15[1]=bid; p15[5]=bar15_arr[i]; p15[6]=False
                        p15[3]=bbl15[i]-2.0; p15[2]=bid+(bbm15[i]-bid)*0.7; p15[4]=lots*100
                    elif p15[7] and bid < bbu15[i] and k15[i] > 80:
                        p15[0]=True; p15[1]=bid; p15[5]=bar15_arr[i]; p15[7]=False
                        p15[3]=bbu15[i]+2.0; p15[2]=bid-(bid-bbm15[i])*0.7; p15[4]=-lots*100
            else:
                if p15[4] > 0:
                    if bid >= p15[2]: balance += (p15[2]-p15[1])*p15[4]; p15[0]=False
                    elif bid <= p15[3]: balance += (p15[3]-p15[1])*p15[4]; p15[0]=False
                else:
                    if bid <= p15[2]: balance += (p15[1]-p15[2])*abs(p15[4]); p15[0]=False
                    elif bid >= p15[3]: balance += (p15[1]-p15[3])*abs(p15[4]); p15[0]=False

        if i % 400000 == 0: equity.append(balance)
        
    return {"ec": equity, "final": balance, "max_dd": ((pd.Series(equity).cummax() - pd.Series(equity)) / pd.Series(equity).cummax()).max()}

def main():
    print("🚀 執行「本金比例手數」鑑定測試 (SD 1.7)...")
    ticks = pd.read_parquet(TICK_PATH, columns=['timestamp', 'BID']).sort_values('timestamp')
    
    scenarios = [
        {"lab": "5m 時區 (比例手數)", "u5": True, "u15": False},
        {"lab": "15m 時區 (比例手數)", "u5": False, "u15": True},
        {"lab": "雙時區併行 (比例手數)", "u5": True, "u15": True}
    ]
    
    plt.figure(figsize=(12, 7))
    print("\n📋 比例手數鑑定結果 ($1,000=0.01手):")
    print(f"{'策略模式':<20} | {'最終餘額':<12} | {'ROI (%)':<8} | {'最大回撤'}")
    print("-" * 60)
    
    for s in scenarios:
        res = run_scaling_backtest(ticks, use_5m=s['u5'], use_15m=s['u15'])
        roi = ((res['final'] - 10000) / 10000) * 100
        print(f"{s['lab']:<18} | ${res['final']:<11.2f} | {roi:>7.1f}% | {res['max_dd']*100:>7.1f}%")
        plt.plot(res['ec'], label=s['lab'])
        
    plt.title("本金比例手數壓力鑑定 (SD 1.7 / $1,000=0.01手)")
    plt.ylabel("餘額 (USD)"); plt.legend(); plt.grid(alpha=0.3)
    plt.savefig(os.path.join(OUTPUT_DIR, "final_scaling_summary.png"))
    print(f"\n🖼️ 鑑定圖已存至: {os.path.join(OUTPUT_DIR, 'final_scaling_summary.png')}")

if __name__ == "__main__":
    main()
