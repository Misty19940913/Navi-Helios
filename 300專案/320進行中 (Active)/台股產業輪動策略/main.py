import pandas as pd
from datetime import timedelta
import os
import json

# ==========================================
# Navi Helios 總司令部：台股量能突破策略回測引擎 (做法 B)
# ==========================================
# 匯入我們的武器模組
from 觀察清單找尋 import StockScanner, api
from 進出場回測腳本 import run_advanced_backtest
from 資料倉庫 import sync_market_data

def main():
    print("=== 啟動 Navi Helios 產業輪動回測引擎 (本地快取模式) ===")
    
    # 1. 設定總體參數 (這裡就是司令部的控制台)
    target_date = '2021-03-01'           # 測試擷取點 (可任意更改)
    api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNi0wMy0xMCAwMjoyMDowOCIsInVzZXJfaWQiOiJNaXN0eSIsImVtYWlsIjoiZ2hvc3Q3NzQ5OEBnbWFpbC5jb20iLCJpcCI6IjQyLjc3LjIzMi42In0.VwrsvFwhb5NAvKV4tFfpOV-VyBvvhu91VWtANob0MpQ"
    start_cash = 1000000.0                # 初始本金: 100 萬
    position_pct = 0.10                   # 單筆部位風險: 10%
    
    # 對照組設定：(快線, 慢線)
    test_groups = [(5, 10), (7, 13)]
    
    print("\n[Step 0] 同步全市場資料至本地快取...")
    # 實施同步 (若觸發限制會自動停止並保留已下載部分)
    sync_market_data(api_token, target_date)

    print("\n[Step 1] 擷取全市場基本面並進行強勢起漲篩選...")
    try:
        print(">> 正在取得台股股票清單...")
        # 為了避開流量限制，如果 info 抓不到就用本地已有的 csv 檔名清單來模擬
        try:
            all_market_data = api.taiwan_stock_info()
            all_market_data = all_market_data[all_market_data['industry_category'] != '']
        except:
            print(">> [警告] 無法取得線上股票清單，切換至本地快取目錄讀取...")
            cached_ids = [f.replace('.csv', '') for f in os.listdir("market_data_cache") if f.endswith('.csv')]
            all_market_data = pd.DataFrame({'stock_id': cached_ids})
            
        # 解除安全鎖，執行全市場掃描
        scan_target = all_market_data
        
        print(f">> 開始全市場掃描 {len(scan_target)} 檔標的技術面與基本面條件...")
        scanner = StockScanner()
        
        # 進行掃描
        observation_list = scanner.run_weekly_scan(scan_target, target_date)
        
        if not observation_list:
            print(">> 全市場掃描完成，無符合突破條件的標的。終止回測。")
            return
            
        print(f">> 經過實戰篩選出的觀察清單 (共 {len(observation_list)} 檔): {observation_list}")
    except Exception as e:
        import traceback
        print(f"篩選名單發生錯誤: {e}")
        traceback.print_exc()
        return

    # ---
    print("\n[Step 2] 執行對照組回測打擊...")
    
    results = {} # 記錄各組績效
    
    for fast_ma, slow_ma in test_groups:
        print(f"\n---> 正在測試策略: {fast_ma}MA / {slow_ma}MA <---")
        group_logs = []
        
        for stock_id in observation_list:
            print(f"> 載入標的 {stock_id} 歷史還原日線...")
            # 抓取回測區間 (例如從 target_date 往後測半年)
            end_date_bt = (pd.to_datetime(target_date) + timedelta(days=180)).strftime('%Y-%m-%d')
            
            # 從 target_date 往前抓 30 天為了算 MA，往後抓半年為了測未來
            start_date_bt = (pd.to_datetime(target_date) - timedelta(days=30)).strftime('%Y-%m-%d')
            
            # 改用 taiwan_stock_daily 避開測試版無還原股價權限問題
            df_bt = api.taiwan_stock_daily(stock_id=stock_id, start_date=start_date_bt, end_date=end_date_bt)
            
            if df_bt.empty:
                continue
                
            # 計算該對照組所需的 MA
            df_bt['date'] = pd.to_datetime(df_bt['date'])
            df_bt = df_bt.sort_values('date').reset_index(drop=True)
            
            # FinMind API 回傳的欄位為 max / min
            if 'max' in df_bt.columns:
                df_bt = df_bt.rename(columns={'max': 'high', 'min': 'low'})
            df_bt[f'{fast_ma}MA'] = df_bt['close'].rolling(window=fast_ma).mean()
            df_bt[f'{slow_ma}MA'] = df_bt['close'].rolling(window=slow_ma).mean()
            
            # 丟入引擎
            logs, equity = run_advanced_backtest(
                df=df_bt, 
                start_cash=start_cash, 
                position_pct=position_pct, 
                fast_ma_len=fast_ma, 
                slow_ma_len=slow_ma
            )
            
            if not logs.empty:
                logs['stock_id'] = stock_id  # 補上股票代碼便於追蹤
                group_logs.append(logs)
                
            print(f"  完成 {stock_id} 回測，共產出 {len(logs)} 筆交易點位。")
        
        # 彙整這個對照組的結果
        if group_logs:
            all_logs_df = pd.concat(group_logs, ignore_index=True)
            
            # 統計勝率與損益
            trade_exits = all_logs_df.dropna(subset=['realized_pnl'])
            wins = len(trade_exits[trade_exits['realized_pnl'] > 0])
            losses = len(trade_exits[trade_exits['realized_pnl'] <= 0])
            total_trades = wins + losses
            win_rate = (wins / total_trades * 100) if total_trades > 0 else 0
            total_pnl = trade_exits['realized_pnl'].sum() if total_trades > 0 else 0
            
            results[f"{fast_ma}MA_{slow_ma}MA"] = {
                "總進場次數": len(all_logs_df[all_logs_df['action'] == 'BUY']),
                "平倉次數": total_trades,
                "勝率": f"{win_rate:.2f}%",
                "已實現總利潤": f"{total_pnl:,.0f} 元",
                "明細": all_logs_df
            }
        else:
            print("  本策略區間無交易訊號。")

    print("\n=== 對照組總結報告 ===")
    for strategy_name, info in results.items():
        print(f"策略 [{strategy_name}] | 進場: {info['總進場次數']}次 | 平倉: {info['平倉次數']}次 | 勝率: {info['勝率']} | 已實現總利潤: {info['已實現總利潤']}")
        
    print("\n* 報表可進一步輸出為 Excel 並存放至 330個人金融知識庫/ ")

if __name__ == "__main__":
    main()
