import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
import sys

# 強制輸出為 UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# 設定畫圖字體 (防亂碼，支援繁體)
plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei'] 
plt.rcParams['axes.unicode_minus'] = False

data_path = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_5m_Clean.parquet"
output_dir = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\results"
os.makedirs(output_dir, exist_ok=True)

def run_strategy(df, bb_std=2.0, initial_capital=10000, lot_size=0.1):
    # 指標計算
    sma = df['close'].rolling(21).mean()
    std = df['close'].rolling(21).std()
    df['BBM'] = sma
    df['BBL'] = sma - (bb_std * std)
    df['BBU'] = sma + (bb_std * std)
    
    l9 = df['low'].rolling(9).min()
    h9 = df['high'].rolling(9).max()
    rsv = (df['close'] - l9) / (h9 - l9) * 100
    df['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    # 變數
    balance = initial_capital
    ec = [initial_capital]
    pos = 0
    ep = 0
    tp = 0
    sl = 0
    pnls = []
    
    units = lot_size * 100
    
    for i in range(21, len(df)):
        r = df.iloc[i]
        pr = df.iloc[i-1]
        
        if pos == 0:
            if pr['low'] < pr['BBL'] and r['close'] > r['BBL'] and r['K'] < 20:
                pos = 1; ep = r['close']
                tp = ep + (r['BBM'] - ep) * 0.7
                sl = df.iloc[max(0, i-10):i]['low'].min()
            elif pr['high'] > pr['BBU'] and r['close'] < r['BBU'] and r['K'] > 80:
                pos = -1; ep = r['close']
                tp = ep - (ep - r['BBM']) * 0.7
                sl = df.iloc[max(0, i-10):i]['high'].max()
        elif pos == 1:
            if r['high'] >= tp: pnl = (tp - ep) * units; balance += pnl; pnls.append(pnl); pos = 0
            elif r['low'] <= sl: 
                pnl = (sl - ep) * units; balance += pnl; pnls.append(pnl)
                pos = -1; ep = sl; tp = ep - abs(pnl/units); sl = r['close']
        elif pos == -1:
            if r['low'] <= tp: pnl = (ep - tp) * units; balance += pnl; pnls.append(pnl); pos = 0
            elif r['high'] >= sl:
                pnl = (ep - sl) * units; balance += pnl; pnls.append(pnl)
                pos = 1; ep = sl; tp = ep + abs(pnl/units); sl = r['close']
        ec.append(balance)
        
    dr = pd.Series(ec).pct_change().dropna()
    sharpe = (dr.mean() / dr.std() * np.sqrt(252*24*12)) if dr.std() != 0 else 0
    max_dd = ((pd.Series(ec).cummax() - pd.Series(ec)) / pd.Series(ec).cummax()).max()
    
    return {"ec": ec, "sharpe": sharpe, "balance": balance, "max_dd": max_dd, "win_rate": (pd.Series(pnls)>0).mean(), "count": len(pnls)}

def main():
    df = pd.read_parquet(data_path)
    sds = [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
    
    all_metrics = []
    
    plt.figure(figsize=(14, 7))
    print("📈 正在執行全參數深度掃描 (1.5 ~ 2.1)...")
    
    for sd in sds:
        res = run_strategy(df.copy(), bb_std=sd)
        
        # 收集指標
        metrics = {
            "SD": sd,
            "最終淨利": res['balance'] - 10000,
            "勝率": f"{res['win_rate']*100:.1f}%",
            "交易次數": res['count'],
            "夏普比率": f"{res['sharpe']:.2f}",
            "最大回撤": f"{res['max_dd']*100:.1f}%"
        }
        all_metrics.append(metrics)
        
        # 繪製曲線
        plt.plot(res['ec'], label=f"SD={sd} (Sharpe: {res['sharpe']:.2f})", alpha=0.8)
    
    # 圖 1: 資金曲線對比
    plt.title("各偏差值 (SD) 資金增長曲線對比 (本金 $10,000 | 0.1 Lot)")
    plt.xlabel("交易 K 棒序列")
    plt.ylabel("資金餘額 (USD)")
    plt.grid(True, alpha=0.2)
    plt.legend(loc='upper left', bbox_to_anchor=(1, 1))
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "all_equity_curves.png"))
    
    # 圖 2: 夏普比率對比柱狀圖
    plt.figure(figsize=(10, 5))
    sd_labels = [str(m['SD']) for m in all_metrics]
    sharpe_vals = [float(m['夏普比率']) for m in all_metrics]
    sns.barplot(x=sd_labels, y=sharpe_vals, palette="magma")
    plt.title("各偏差值 (SD) 夏普比率對比")
    plt.savefig(os.path.join(output_dir, "sharpe_comparison.png"))
    
    # 輸出表格
    report_df = pd.DataFrame(all_metrics)
    print("\n📋 深度績效鑑定表 (SD 1.5 - 2.1):")
    print(report_df.to_string(index=False))
    
    print(f"\n✅ 報表生成完成！")
    print(f"🖼️ 全資金曲線對比圖: {os.path.join(output_dir, 'all_equity_curves.png')}")
    print(f"🖼️ 夏普比率對比圖: {os.path.join(output_dir, 'sharpe_comparison.png')}")

if __name__ == "__main__":
    main()
