import os
import json
import requests
from datetime import datetime, timedelta

# 刑事診斷：確保變數正確注入
config = {
    'MT5_TOKEN': os.getenv('MT5_TOKEN'),
    'MT5_ACCOUNT_ID': os.getenv('MT5_ACCOUNT_ID'),
    'MT5_REGION': os.getenv('MT5_REGION')
}

# 如果環境變數不存在，嘗試從 .env 讀取
if os.path.exists('.env'):
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                if not config.get(key):
                    config[key] = value

TOKEN = config.get('MT5_TOKEN')
ACCOUNT_ID = config.get('MT5_ACCOUNT_ID', "3d39912e-4ab7-419f-96f3-c1ca5cd19ae1")
REGION = config.get('MT5_REGION', "new-york")

def fetch_xauusd_one_year():
    end_time = datetime.now()
    start_time = end_time - timedelta(days=365)
    
    # 建立本地證物室
    os.makedirs('./data/history', exist_ok=True)
    file_path = './data/history/XAUUSD_5m_1y.json'
    
    if not TOKEN:
        print("❌ 錯誤：找不到 MT5_TOKEN 環境變數。請在 PowerShell 執行：$env:MT5_TOKEN = \"你的Token\"")
        return

    all_candles = []
    current_start = start_time
    
    print(f"🕵️ 刑事診斷：啟動一年數據收割任務 (從 {start_time.strftime('%Y-%m-%d')} 到 {end_time.strftime('%Y-%m-%d')})")

    while current_start < end_time:
        url = f"https://mt-client-api-v1.{REGION}.agiliumtrade.ai/users/current/accounts/{ACCOUNT_ID}/historical-candles/XAUUSD/5m"
        headers = {"auth-token": TOKEN}
        params = {
            "startTime": current_start.strftime('%Y-%m-%dT%H:%M:%S.000Z'),
            "limit": 1000
        }
        
        try:
            response = requests.get(url, headers=headers, params=params)
            response.raise_for_status()
            candles = response.json()
            
            if not candles:
                break
                
            all_candles.extend(candles)
            
            # 更新下一次抓取的起點 (最後一根 K 線的時間)
            last_time_str = candles[-1]['time']
            # MetaApi 回傳時間格式範例: 2024-03-10T12:00:00.000Z
            # 使用 .partition('.') 處理毫秒部分，確保 strptime 格式一致
            last_time = last_time_str.replace('Z', '')
            if '.' in last_time:
                last_time = last_time.split('.')[0]
            
            current_start = datetime.strptime(last_time, '%Y-%m-%dT%H:%M:%S') + timedelta(minutes=5)
            
            print(f"📋 已收割 {len(all_candles):>6} 根 K 線... (最後時間點: {last_time_str})")
            
            # 頻率限制與收尾檢查
            if len(candles) < 1000:
                break
                
        except Exception as e:
            print(f"🚨 現場勘驗失敗：{str(e)}")
            break

    # 存檔至證物室
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(all_candles, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 任務完成！總計收割 {len(all_candles)} 根 K 線，證物已存：{file_path}")

if __name__ == "__main__":
    fetch_xauusd_one_year()
