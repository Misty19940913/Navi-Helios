import pandas as pd
from FinMind.data import DataLoader
from datetime import datetime, timedelta
import time
import os

# ==========================================
# Navi Helios 資料倉庫：全市場日線本地快取器
# ==========================================

CACHE_DIR = "market_data_cache"

def sync_market_data(api_token, target_date, days_back=200):
    """
    一次性抓取全市場股票資料並存入本地 CSV
    """
    api = DataLoader(api_token)
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)
        
    print(f"--- 啟動全市場資料同步 (基準日: {target_date}) ---")
    
    # 1. 取得所有股票清單 (加入容錯)
    try:
        all_stocks = api.taiwan_stock_info()
        all_stocks = all_stocks[all_stocks['industry_category'] != '']
    except Exception as e:
        print(f">> [警告] 無法更新股票清單 (API 限制): {e}")
        return CACHE_DIR
    
    start_date = (pd.to_datetime(target_date) - timedelta(days=days_back)).strftime('%Y-%m-%d')
    
    # 預先取得已快取的檔案清單
    cached_files = os.listdir(CACHE_DIR)
    
    success_count = 0
    total_count = len(all_stocks)
    
    for index, row in all_stocks.iterrows():
        stock_id = row['stock_id']
        file_path = os.path.join(CACHE_DIR, f"{stock_id}.csv")
        
        # 簡單的快取檢測：如果檔案存在且修改時間是今天，就跳過
        if f"{stock_id}.csv" in cached_files:
            file_mtime = datetime.fromtimestamp(os.path.getmtime(file_path)).date()
            if file_mtime == datetime.now().date():
                success_count += 1
                continue

        try:
            # 抓取日線資料
            df = api.taiwan_stock_daily(
                stock_id=stock_id, 
                start_date=start_date, 
                end_date=target_date
            )
            
            if not df.empty:
                df.to_csv(file_path, index=False)
                success_count += 1
                
            # 每抓 10 檔印一次進度
            if success_count % 10 == 0:
                print(f"  進度: {success_count}/{total_count} ({row['stock_name']})")
                
            # 為了避開 API 頻率限制，實施微小延遲
            time.sleep(0.1) 
            
        except Exception as e:
            if "upper limit" in str(e).lower():
                print(f"\n[警報] 觸發 API 流量上限。已同步 {success_count} 檔。請稍後再繼續。")
                break
            print(f"無法同步 {stock_id}: {e}")

    print(f"--- 同步結束。有效快取總數: {success_count} ---")
    return CACHE_DIR
