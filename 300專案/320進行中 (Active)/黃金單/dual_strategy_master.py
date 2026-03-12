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

def run_dual_backtest(ticks, mode='fixed', value=0.1, bb_std=1.7):
    # 下採樣與指標對位
    sig5 = get_signals(ticks, '5min', bb_std)
    sig15 = get_signals(ticks, '15min', bb_std)
    
    df = pd.merge_asof(ticks, sig5, left_on='timestamp', right_index=True)
    df = pd.merge_asof(df, sig15, left_on='timestamp', right_index=True, suffixes=('_5m', '_15m'))
    df.dropna(inplace=True)
    
    bid_arr = df['BID'].values
    ts_arr = df['timestamp'].values
    
    # 指標對位
    bbl5 = df['BBL_5m'].values; bbm5 = df['BBM_5m'].values; bbu5 = df['BBU_5m'].values; k5 = df['K_5m'].values
    bbl15 = df['BBL_15m'].values; bbm15 = df['BBM_15m'].values; bbu15 = df['BBU_15m'].values; k15 = df['K_15m'].values
    
    bar5_arr = (ts_arr.astype('datetime64[m]').astype(int) // 5)
    bar15_arr = (ts_arr.astype('datetime64[m]').astype(int) // 15)
    
    # 變數初期化
    balance = 10000; equity = [balance]
    pos5 = [False, 0, 0, 0, 0, -1, False, False]
    pos15 = [False, 0, 0, 0, 0, -1, False, False]
    
    for i in range(len(bid_arr)):
        if balance <= 1000: break
        bid = bid_arr[i]
        bar5 = bar5_arr[i]; bar15 = bar15_arr[i]
        
        # --- 5m 控制單元 ---
        if not pos5[0]:
            if bid < bbl5[i]: pos5[6] = True # touched_low
            if bid > bbu5[i]: pos5[7] = True # touched_high
            if bar5 != pos5[5]: # Cold down
                if pos5[6] and bid > bbl5[i] and k5[i] < 20:
                    pos5[0]=True; pos5[1]=bid; pos5[5]=bar5; pos5[6]=False
                    pos5[3]=bbl5[i]-2.0; pos5[2]=bid+(bbm5[i]-bid)*0.7
                    # 風險 1% 計算 (5m)
                    sl_dist = max(abs(pos5[1] - pos5[3]), 0.5)
                    lots = value if mode == 'fixed' else (balance * value) / (sl_dist * 100)
                    pos5[4]=min(max(lots, 0.01), 2.0)*100
                elif pos5[7] and bid < bbu5[i] and k5[i] > 80:
                    pos5[0]=True; pos5[1]=bid; pos5[5]=bar5; pos5[7]=False
                    pos5[3]=bbu5[i]+2.0; pos5[2]=bid-(bid-bbm5[i])*0.7
                    sl_dist = max(abs(pos5[1] - pos5[3]), 0.5)
                    lots = value if mode == 'fixed' else (balance * value) / (sl_dist * 100)
                    pos5[4]=-min(max(lots, 0.01), 2.0)*100
        else: # 5m 持倉
            if pos5[4] > 0: # 多
                if bid >= pos5[2]: balance += (pos5[2]-pos5[1])*pos5[4]; pos5[0]=False
                elif bid <= pos5[3]: balance += (pos5[3]-pos5[1])*pos5[4]; pos5[0]=False
            else: # 空
                if bid <= pos5[2]: balance += (pos5[1]-pos5[2])*abs(pos5[4]); pos5[0]=False
                elif bid >= pos5[3]: balance += (pos5[1]-pos5[3])*abs(pos5[4]); pos5[0]=False
        
        # --- 15m 控制單元 ---
        if not pos15[0]:
            if bid < bbl15[i]: pos15[6] = True
            if bid > bbu15[i]: pos15[7] = True
            if bar15 != pos15[5]:
                if pos15[6] and bid > bbl15[i] and k15[i] < 20:
                    pos15[0]=True; pos15[1]=bid; pos15[5]=bar15; pos15[6]=False
                    pos15[3]=bbl15[i]-2.0; pos15[2]=bid+(bbm15[i]-bid)*0.7
                    # 風險 1% 計算 (15m)
                    sl_dist = max(abs(pos15[1] - pos15[3]), 0.5)
                    lots = value if mode == 'fixed' else (balance * value) / (sl_dist * 100)
                    pos15[4]=min(max(lots, 0.01), 2.0)*100
                elif pos15[7] and bid < bbu15[i] and k15[i] > 80:
                    pos15[0]=True; pos15[1]=bid; pos15[5]=bar15; pos15[7]=False
                    pos15[3]=bbu15[i]+2.0; pos15[2]=bid-(bid-bbm15[i])*0.7
                    sl_dist = max(abs(pos15[1] - pos15[3]), 0.5)
                    lots = value if mode == 'fixed' else (balance * value) / (sl_dist * 100)
                    pos15[4]=-min(max(lots, 0.01), 2.0)*100
        else: # 15m 持倉
            if pos15[4] > 0:
                if bid >= pos15[2]: balance += (pos15[2]-pos15[1])*pos15[4]; pos15[0]=False
                elif bid <= pos15[3]: balance += (pos15[3]-pos15[1])*pos15[4]; pos15[0]=False
            else:
                if bid <= pos15[2]: balance += (pos15[1]-pos15[2])*abs(pos15[4]); pos15[0]=False
                elif bid >= pos15[3]: balance += (pos15[1]-pos15[3])*abs(pos15[4]); pos15[0]=False
                
        if i % 400000 == 0: equity.append(balance)
        
    return {"ec": equity, "final": balance, "max_dd": ((pd.Series(equity).cummax() - pd.Series(equity)) / pd.Series(equity).cummax()).max()}

def main():
    print("⚔️ 啟動 5m + 15m 雙時區併行鑑定測試...")
    ticks = pd.read_parquet(TICK_PATH, columns=['timestamp', 'BID']).sort_values('timestamp')
    
    lots = [0.1, 0.2, 0.3, 0.5]
    res_list = []
    
    plt.figure(figsize=(12, 7))
    print("\n📋 雙時區併行全數據紀錄 (SD 1.7):")
    print(f"{'策略組合':<22} | {'最終餘額':<12} | {'獲利 ROI':<10} | {'最大回撤'}")
    print("-" * 75)
    
    for lot in lots:
        res = run_dual_backtest(ticks, mode='fixed', value=lot)
        roi = ((res['final'] - 10000) / 10000) * 100
        label = f"5m(0.1)+15m({lot})" if lot == 0.1 else f"雙時區各 {lot} Lot"
        print(f"{label:<22} | ${res['final']:<11.2f} | {roi:>7.1f}% | {res['max_dd']*100:>7.1f}%")
        plt.plot(res['ec'], label=label)

    # 新增：雙時區各自 1% 風險測試
    res_risk = run_dual_backtest(ticks, mode='risk', value=0.01)
    roi_risk = ((res_risk['final'] - 10000) / 10000) * 100
    label_risk = "雙時區各自 1% 風險"
    print(f"{label_risk:<22} | ${res_risk['final']:<11.2f} | {roi_risk:>7.1f}% | {res_risk['max_dd']*100:>7.1f}%")
    plt.plot(res_risk['ec'], label=label_risk, linewidth=2, linestyle='--')
        
    plt.title("5m & 15m 雙時區併行壓力鑑定 (SD 1.7)")
    plt.ylabel("資金餘額 (USD)"); plt.legend(); plt.grid(alpha=0.3)
    plt.savefig(os.path.join(output_dir, "dual_timeframe_comparison.png"))
    print(f"\n🖼️ 鑑定圖已存至: {os.path.join(output_dir, 'dual_timeframe_comparison.png')}")

if __name__ == "__main__":
    main()
