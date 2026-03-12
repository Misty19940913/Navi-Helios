import pandas as pd
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
import sys
from fpdf import FPDF

# 強制輸出為 UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# 設定畫圖字體
plt.rcParams['font.sans-serif'] = ['Microsoft JhengHei'] 
plt.rcParams['axes.unicode_minus'] = False

data_path = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_5m_Clean.parquet"
output_dir = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\results"
font_path = r"C:\Windows\Fonts\msjh.ttc" # 微軟正黑體

def run_strategy(df, bb_std=2.0, initial_capital=10000, lot_size=0.1):
    sma = df['close'].rolling(21).mean()
    std = df['close'].rolling(21).std()
    df['BBM'] = sma
    df['BBL'] = sma - (bb_std * std)
    df['BBU'] = sma + (bb_std * std)
    l9 = df['low'].rolling(9).min()
    h9 = df['high'].rolling(9).max()
    rsv = (df['close'] - l9) / (h9 - l9) * 100
    df['K'] = rsv.ewm(com=2, adjust=False).mean()
    balance = initial_capital
    ec = [initial_capital]
    pos = 0; ep = 0; tp = 0; sl = 0; pnls = []
    units = lot_size * 100
    for i in range(21, len(df)):
        r = df.iloc[i]; pr = df.iloc[i-1]
        if pos == 0:
            if pr['low'] < pr['BBL'] and r['close'] > r['BBL'] and r['K'] < 20:
                pos = 1; ep = r['close']; tp = ep + (r['BBM'] - ep) * 0.7; sl = df.iloc[max(0, i-10):i]['low'].min()
            elif pr['high'] > pr['BBU'] and r['close'] < r['BBU'] and r['K'] > 80:
                pos = -1; ep = r['close']; tp = ep - (ep - r['BBM']) * 0.7; sl = df.iloc[max(0, i-10):i]['high'].max()
        elif pos == 1:
            if r['high'] >= tp: pnl = (tp - ep) * units; balance += pnl; pnls.append(pnl); pos = 0
            elif r['low'] <= sl: pnl = (sl - ep) * units; balance += pnl; pnls.append(pnl); pos = -1; ep = sl; tp = ep - abs(pnl/units); sl = r['close']
        elif pos == -1:
            if r['low'] <= tp: pnl = (ep - tp) * units; balance += pnl; pnls.append(pnl); pos = 0
            elif r['high'] >= sl: pnl = (ep - sl) * units; balance += pnl; pnls.append(pnl); pos = 1; ep = sl; tp = ep + abs(pnl/units); sl = r['close']
        ec.append(balance)
    dr = pd.Series(ec).pct_change().dropna()
    sharpe = (dr.mean() / dr.std() * np.sqrt(252*24*12)) if dr.std() != 0 else 0
    max_dd = ((pd.Series(ec).cummax() - pd.Series(ec)) / pd.Series(ec).cummax()).max()
    return {"ec": ec, "sharpe": sharpe, "balance": balance, "max_dd": max_dd, "win_rate": (pd.Series(pnls)>0).mean(), "count": len(pnls)}

class PDF(FPDF):
    def header(self):
        self.set_font('msjh', 'B', 16)
        self.cell(0, 10, 'Navi Helios 策略績效鑑定報告', align='C')
        self.ln(10)
    def footer(self):
        self.set_y(-15)
        self.set_font('msjh', '', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

def main():
    df_raw = pd.read_parquet(data_path)
    sds = [1.5, 1.6, 1.7, 1.8, 1.9, 2.0, 2.1]
    all_metrics = []
    
    plt.figure(figsize=(12, 6))
    for sd in sds:
        res = run_strategy(df_raw.copy(), bb_std=sd)
        all_metrics.append({
            "SD": sd, "Profit": res['balance']-10000, "WinRate": f"{res['win_rate']*100:.1f}%",
            "Trades": res['count'], "Sharpe": f"{res['sharpe']:.2f}", "MaxDD": f"{res['max_dd']*100:.1f}%"
        })
        plt.plot(res['ec'], label=f"SD={sd}")
    
    plt.title("各偏差值資金增長曲線對比")
    plt.legend(loc='best')
    ec_path = os.path.join(output_dir, "pdf_equity_curve.png")
    plt.savefig(ec_path)
    
    # PDF 生成
    pdf = PDF()
    pdf.add_font('msjh', '', font_path)
    pdf.add_font('msjh', 'B', font_path)
    pdf.add_page()
    
    pdf.set_font('msjh', 'B', 14)
    pdf.cell(0, 10, '1. 深度詳情鑑定表', 0, 1)
    
    pdf.set_font('msjh', '', 10)
    # Table Header
    col_width = 30
    headers = ["SD", "淨利 (USD)", "勝率", "次數", "夏普", "回撤"]
    for h in headers: pdf.cell(col_width, 10, h, 1)
    pdf.ln()
    
    for m in all_metrics:
        pdf.cell(col_width, 10, str(m['SD']), 1)
        pdf.cell(col_width, 10, f"${m['Profit']:.2f}", 1)
        pdf.cell(col_width, 10, m['WinRate'], 1)
        pdf.cell(col_width, 10, str(m['Trades']), 1)
        pdf.cell(col_width, 10, m['Sharpe'], 1)
        pdf.cell(col_width, 10, m['MaxDD'], 1)
        pdf.ln()
    
    pdf.ln(10)
    pdf.set_font('msjh', 'B', 14)
    pdf.cell(0, 10, '2. 視覺化鑑定結果', 0, 1)
    pdf.image(ec_path, x=10, y=None, w=190)
    
    pdf_output = os.path.join(output_dir, "Strategy_Report.pdf")
    pdf.output(pdf_output)
    print(f"✅ PDF 報告已生成: {pdf_output}")

if __name__ == "__main__":
    main()
