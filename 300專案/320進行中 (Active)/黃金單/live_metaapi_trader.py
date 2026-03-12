import os
import json
import requests
import time
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# --- 刑事配置：證物與通訊設定 ---
config = {
    'MT5_TOKEN': os.getenv('MT5_TOKEN'),
    'MT5_ACCOUNT_ID': os.getenv('MT5_ACCOUNT_ID', "3d39912e-4ab7-419f-96f3-c1ca5cd19ae1"),
    'MT5_REGION': os.getenv('MT5_REGION', "new-york")
}

# 讀取 .env 增補
if os.path.exists('.env'):
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line:
                key, value = line.strip().split('=', 1)
                if not config.get(key): config[key] = value

TOKEN = config.get('MT5_TOKEN')
ACCOUNT_ID = config.get('MT5_ACCOUNT_ID')
REGION = config.get('MT5_REGION')
SYMBOL = "XAUUSD"
BASE_URL = f"https://mt-client-api-v1.{REGION}.agiliumtrade.ai/users/current/accounts/{ACCOUNT_ID}"
HEADERS = {"auth-token": TOKEN}

# 策略參數
BB_STD = 1.7
RECOVERY_RATIO = 0.7
BASE_SCALING = 100000 # $1,000 = 0.01 Lot ($100,000 = 1.0 Lot)
MAGIC_5M = 50505
MAGIC_15M = 151515

class MetaApiClient:
    @staticmethod
    def get_candles(timeframe, limit=50):
        url = f"{BASE_URL}/historical-candles/{SYMBOL}/{timeframe}"
        params = {"limit": limit}
        try:
            resp = requests.get(url, headers=HEADERS, params=params)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"🚨 抓取 {timeframe} K線失敗: {e}")
            return None

    @staticmethod
    def get_account_stat():
        try:
            resp = requests.get(BASE_URL, headers=HEADERS)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"🚨 抓取帳戶狀態失敗: {e}")
            return None

    @staticmethod
    def get_positions():
        try:
            url = f"{BASE_URL}/positions"
            resp = requests.get(url, headers=HEADERS)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"🚨 抓取持倉失敗: {e}")
            return []

    @staticmethod
    def send_trade(action, volume, sl, tp, magic, comment):
        url = f"{BASE_URL}/trade"
        payload = {
            "symbol": SYMBOL,
            "action": action, # "ORDER_TYPE_BUY" or "ORDER_TYPE_SELL"
            "volume": float(volume),
            "stopLoss": float(round(sl, 2)),
            "takeProfit": float(round(tp, 2)),
            "magic": int(magic),
            "comment": comment
        }
        try:
            resp = requests.post(url, headers=HEADERS, json=payload)
            resp.raise_for_status()
            return resp.json()
        except Exception as e:
            print(f"🚨 下單執行失敗: {e}")
            return None

class DualStrategist:
    def __init__(self, tf_str):
        self.tf = tf_str
        self.last_bar_time = ""
        self.touched_low = False
        self.touched_high = False

    def process_logic(self, api, balance, magic):
        candles = api.get_candles(self.tf)
        if not candles: return

        df = pd.DataFrame(candles)
        # 計算指標 (BB 21, SD 1.7)
        sma = df['close'].rolling(21).mean()
        std = df['close'].rolling(21).std()
        df['BBL'] = sma - (BB_STD * std)
        df['BBU'] = sma + (BB_STD * std)
        df['BBM'] = sma
        
        # KD (9, 3, 3)
        l9 = df['low'].rolling(9).min()
        h9 = df['high'].rolling(9).max()
        rsv = (df['close'] - l9) / (h9 - l9) * 100
        df['K'] = rsv.ewm(com=2, adjust=False).mean()
        
        latest = df.iloc[-1]
        current_bid = latest['close'] # REST API 中常態以 Close 為參考
        bar_time = latest['time']
        
        # 檢查持倉 (避免重複進場)
        all_pos = api.get_positions()
        my_pos = [p for p in all_pos if int(p.get('magic', 0)) == magic]
        
        if len(my_pos) == 0:
            # 觸碰邏輯
            if current_bid < latest['BBL']: self.touched_low = True
            if current_bid > latest['BBU']: self.touched_high = True
            
            # 冷靜期: 一根 K 棒只玩一次
            if bar_time != self.last_bar_time:
                lots = max(round(balance / BASE_SCALING, 2), 0.01)
                
                # 多單: 觸底+彈回+K<20
                if self.touched_low and current_bid > latest['BBL'] and latest['K'] < 20:
                    tp = current_bid + (latest['BBM'] - current_bid) * RECOVERY_RATIO
                    sl = latest['BBL'] - 2.0
                    print(f"🎯 {self.tf} 準備進場 [BUY] | Lots: {lots} | TP: {tp:.2f}")
                    res = api.send_trade("ORDER_TYPE_BUY", lots, sl, tp, magic, f"Helios_{self.tf}")
                    if res: 
                        self.last_bar_time = bar_time
                        self.touched_low = False
                
                # 空單: 觸頂+彈回+K>80
                elif self.touched_high and current_bid < latest['BBU'] and latest['K'] > 80:
                    tp = current_bid - (current_bid - latest['BBM']) * RECOVERY_RATIO
                    sl = latest['BBU'] + 2.0
                    print(f"🎯 {self.tf} 準備進場 [SELL] | Lots: {lots} | TP: {tp:.2f}")
                    res = api.send_trade("ORDER_TYPE_SELL", lots, sl, tp, magic, f"Helios_{self.tf}")
                    if res:
                        self.last_bar_time = bar_time
                        self.touched_high = False

def main():
    if not TOKEN:
        print("❌ 錯誤：找不到 MT5_TOKEN。")
        return

    print("🦅 Navi Helios 實盤執法官 (MetaApi 版) 啟動...")
    print(f"📍 座標: {REGION} | 帳號: {ACCOUNT_ID}")
    
    api = MetaApiClient()
    st5 = DualStrategist("5m")
    st15 = DualStrategist("15m")
    
    try:
        while True:
            # 1. 獲取帳戶餘額 (用於比例手數計算)
            acc = api.get_account_stat()
            if acc:
                balance = acc.get('balance', 1000)
                # 2. 輪詢策略
                st5.process_logic(api, balance, MAGIC_5M)
                st15.process_logic(api, balance, MAGIC_15M)
            
            # 定時巡邏 (每分鐘檢查一次，因為是 5m/15m 策略)
            # 如果需要更即時，可以調低 sleep
            time.sleep(30)
            
    except KeyboardInterrupt:
        print("\n🛑 執法終止。")

if __name__ == "__main__":
    main()
