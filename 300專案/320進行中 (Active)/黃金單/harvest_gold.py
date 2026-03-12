import os
import csv
import json
import requests
import time
from datetime import datetime, timedelta

# 1. 變數對位 (嘗試從 .env 讀取)
TOKEN = os.getenv('MT5_TOKEN')
ACCOUNT_ID = os.getenv('MT5_ACCOUNT_ID', "3d39912e-4ab7-419f-96f3-c1ca5cd19ae1")
REGION = os.getenv('MT5_REGION', "new-york")

# 手動解析 .env (如果存在且環境變數尚未設定)
if not TOKEN and os.path.exists('.env'):
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line:
                k, v = line.strip().split('=', 1)
                if k == 'MT5_TOKEN': TOKEN = v
                if k == 'MT5_ACCOUNT_ID': ACCOUNT_ID = v
                if k == 'MT5_REGION': REGION = v

SYMBOL = "XAUUSD"
PERIOD = "1m"  # 下載 1 分鐘 K 棒，方便後續合成 5 分鐘或更長時區

def harvest():
    # 設定時間軸：從一年前到現在
    end_date = datetime.now()
    start_date = end_date - timedelta(days=365)
    current_start = start_date.strftime('%Y-%m-%dT%H:%M:%S.000Z')
    
    headers = {"auth-token": TOKEN}
    # Candle API
    base_url = f"https://mt-client-api-v1.{REGION}.agiliumtrade.ai/users/current/accounts/{ACCOUNT_ID}/historical-candles/{SYMBOL}/{PERIOD}"
    
    output_path = f"XAUUSD_{PERIOD}_1y.csv"
    
    print(f"🚀 開始收割 {SYMBOL} 一年份數據 (起點: {current_start})")
    print(f"💾 採用增量寫入模式：每 1000 筆即時同步至 {output_path}")

    # 初始化 CSV 標頭
    file_exists = os.path.isfile(output_path)
    total_count = 0

    with open(output_path, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['time', 'open', 'high', 'low', 'close', 'tickVolume', 'spread', 'volume'])
        if not file_exists:
            writer.writeheader()

        while True:
            try:
                params = {"startTime": current_start, "limit": 1000}
                response = requests.get(base_url, headers=headers, params=params)
                
                if response.status_code != 200:
                    print(f"❌ API 錯誤 ({response.status_code}): {response.text}")
                    break
                    
                data = response.json()

                if not data or len(data) == 0:
                    print("🏁 已無更多數據可供抓取。")
                    break

                # 排除可能與最後一筆重複的數據 (如果 API 回傳包含 startTime)
                # 這裡直接寫入，因為我們 startTime 加了 1 秒，通常不會重複
                writer.writerows(data)
                f.flush() # 強制寫入硬碟，確保安全
                
                total_count += len(data)
                
                # 更新進度
                last_time_str = data[-1]['time']
                print(f"📦 已抓取並存檔 {total_count} 筆... (目前進度: {last_time_str})")

                # 解析時間以計算下一次起點
                # 注意 API 回傳格式可能是 2024-03-10T00:00:00.000Z
                try:
                    last_time_dt = datetime.strptime(last_time_str, '%Y-%m-%dT%H:%M:%S.%fZ')
                except ValueError:
                    # 有些 API 回傳沒有毫秒
                    last_time_dt = datetime.strptime(last_time_str, '%Y-%m-%dT%H:%M:%SZ')

                current_start = (last_time_dt + timedelta(seconds=1)).strftime('%Y-%m-%dT%H:%M:%S.000Z')

                if last_time_dt >= end_date - timedelta(minutes=10):
                    break
                
                # 避免觸發 API 頻率限制
                time.sleep(0.2)

            except Exception as e:
                print(f"❌ 診斷出錯: {e}")
                break

    print(f"✅ 收割完成！總計 {total_count} 筆數據，存於: {output_path}")

if __name__ == "__main__":
    harvest()
