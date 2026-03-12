import pandas as pd
import numpy as np
import os
import time
import matplotlib.pyplot as plt
import seaborn as sns
import sys
from fpdf import FPDF

# 強制輸出為 UTF-8 避免亂碼
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# 常量設定
TICK_PATH = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_Ticks.parquet"
OUTPUT_DIR = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\results"
FONT_PATH = r"C:\Windows\Fonts\msjh.ttc"
os.makedirs(OUTPUT_DIR, exist_ok=True)

plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei']
plt.rcParams['axes.unicode_minus'] = False

def run_tick_core(ticks, timeframe='5min', bb_std=2.0):
    """核心 Tick 級別回測邏輯"""
    # 1. 預算 5m/15m 指標
    c = ticks.set_index('timestamp')['BID'].resample(timeframe).ohlc()
    sma = c['close'].rolling(21).mean()
    std = c['close'].rolling(21).std()
    c['BBM'] = sma
    c['BBL'] = sma - (bb_std * std)
    c['BBU'] = sma + (bb_std * std)
    l9 = c['low'].rolling(9).min()
    h9 = c['high'].rolling(9).max()
    rsv = (c['close'] - l9) / (h9 - l9) * 100
    c['K'] = rsv.ewm(com=2, adjust=False).mean()
    
    # 對位到 Tick (不看未來)
    c_sig = c[['BBL', 'BBM', 'BBU', 'K']].shift(1)
    df_merged = pd.merge_asof(ticks, c_sig, left_on='timestamp', right_index=True)
    df_merged.dropna(inplace=True)
    
    # 轉 Numpy 提速
    bid_arr = df_merged['BID'].values
    bbl_arr = df_merged['BBL'].values
    bbm_arr = df_merged['BBM'].values
    bbu_arr = df_merged['BBU'].values
    k_arr = df_merged['K'].values
    
    # 回測狀態
    balance = 10000
    pos = 0; ep = 0; tp = 0; sl = 0; pnls = []
    equity = [10000]
    units = 10 # 0.1 Lot = 10 盎司
    
    t_low = False; t_high = False
    
    for i in range(len(bid_arr)):
        bid = bid_arr[i]
        
        if pos == 0:
            if bid < bbl_arr[i]: t_low = True
            if bid > bbu_arr[i]: t_high = True
            
            if t_low and bid > bbl_arr[i] and k_arr[i] < 20:
                pos = 1; ep = bid; t_low = False
                tp = ep + (bbm_arr[i] - ep) * 0.7
                sl = bbl_arr[i] - 1.0 # 寬容止損
            elif t_high and bid < bbu_arr[i] and k_arr[i] > 80:
                pos = -1; ep = bid; t_high = False
                tp = ep - (ep - bbm_arr[i]) * 0.7
                sl = bbu_arr[i] + 1.0
                
        elif pos == 1:
            if bid >= tp: pnl = (tp - ep)*units; balance += pnl; pnls.append(pnl); pos = 0
            elif bid <= sl:
                pnl = (sl - ep)*units; balance += pnl; pnls.append(pnl)
                pos = -1; ep = sl; tp = ep - abs(pnl/units); sl = ep + 2.0
        elif pos == -1:
            if bid <= tp: pnl = (ep - tp)*units; balance += pnl; pnls.append(pnl); pos = 0
            elif bid >= sl:
                pnl = (ep - sl)*units; balance += pnl; pnls.append(pnl)
                pos = 1; ep = sl; tp = ep + abs(pnl/units); sl = ep - 2.0
        
        if i % 200000 == 0: equity.append(balance)
        
    ec_ser = pd.Series(equity)
    dr = ec_ser.pct_change().dropna()
    sharpe = (dr.mean() / dr.std() * np.sqrt(252 * 24 * 60)) if dr.std() != 0 else 0
    max_dd = ((ec_ser.cummax() - ec_ser) / ec_ser.cummax()).max()
    
    return {"final_balance": balance, "win_rate": (pd.Series(pnls)>0).mean(), "count": len(pnls), "sharpe": sharpe, "max_dd": max_dd, "equity_curve": equity}

class PDFReport(FPDF):
    def header(self):
        self.set_font('msjh', 'B', 16)
        self.cell(0, 10, self.report_title, align='C')
        self.ln(10)
    def footer(self):
        self.set_y(-15); self.set_font('msjh', '', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def generate_report(timeframe_name, label):
    print(f"\n🚀 正在產生 {label} Tick 級別鑑定報告...")
    # 只讀一次原始數據節省時間
    ticks = pd.read_parquet(TICK_PATH, columns=['timestamp', 'BID'])
    ticks.sort_values('timestamp', inplace=True)
    
    sds = [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
    all_res = []
    
    plt.figure(figsize=(12, 6))
    for sd in sds:
        print(f"  - 測試 SD: {sd}")
        res = run_tick_core(ticks, timeframe=timeframe_name, bb_std=sd)
        all_res.append({"SD": sd, "Profit": res['final_balance']-10000, "WinRate": f"{res['win_rate']*100:.1f}%", 
                        "Trades": res['count'], "Sharpe": f"{res['sharpe']:.2f}", "MaxDD": f"{res['max_dd']*100:.1f}%", 
                        "sharpe_val": res['sharpe']})
        plt.plot(res['equity_curve'], label=f"SD={sd}")
    
    # 存曲線圖
    plt.title(f"{label} 資金曲線對比")
    plt.legend(loc='best', fontsize='small')
    plt.grid(alpha=0.3)
    ec_img = os.path.join(OUTPUT_DIR, f"equity_{label}.png")
    plt.savefig(ec_img)
    plt.close()
    
    # 存夏普圖
    plt.figure(figsize=(10, 5))
    sns.barplot(x=[str(x['SD']) for x in all_res], y=[x['sharpe_val'] for x in all_res], palette="magma")
    plt.title(f"{label} 夏普比率分布")
    sh_img = os.path.join(OUTPUT_DIR, f"sharpe_{label}.png")
    plt.savefig(sh_img)
    plt.close()
    
    # PDF
    pdf = PDFReport()
    pdf.report_title = f"Navi Helios {label} Tick 極限鑑定報告"
    pdf.add_font('msjh', '', FONT_PATH); pdf.add_font('msjh', 'B', FONT_PATH)
    pdf.add_page()
    
    pdf.set_font('msjh', 'B', 14); pdf.cell(0, 10, '1. 全參數深度績效鑑定表', align='L'); pdf.ln(10)
    pdf.set_font('msjh', '', 10)
    col_w = 31
    for h in ["SD", "淨利(USD)", "勝率", "成交數", "夏普", "回撤"]: pdf.cell(col_w, 10, h, 1)
    pdf.ln()
    for r in all_res:
        pdf.cell(col_w, 10, str(r['SD']), 1)
        pdf.cell(col_w, 10, f"${r['Profit']:.2f}", 1)
        pdf.cell(col_w, 10, r['WinRate'], 1)
        pdf.cell(col_w, 10, str(r['Trades']), 1)
        pdf.cell(col_w, 10, r['Sharpe'], 1)
        pdf.cell(col_w, 10, r['MaxDD'], 1)
        pdf.ln()
    
    pdf.add_page()
    pdf.set_font('msjh', 'B', 14); pdf.cell(0, 10, '2. 資金曲線對比圖', align='L'); pdf.ln(10)
    pdf.image(ec_img, x=10, y=None, w=190)
    
    pdf.ln(10)
    pdf.cell(0, 10, '3. 夏普比率對比圖', align='L'); pdf.ln(10)
    pdf.image(sh_img, x=10, y=None, w=190)
    
    pdf_file = os.path.join(OUTPUT_DIR, f"Report_Tick_{label}.pdf")
    pdf.output(pdf_file)
    print(f"✅ {label} 報告完成！路徑: {pdf_file}")

if __name__ == "__main__":
    generate_report('5min', '5m_Timeframe')
    generate_report('15min', '15m_Timeframe')
