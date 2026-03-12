import pandas as pd
import numpy as np
from FinMind.data import DataLoader
from datetime import timedelta
import os

# 保留測試用 API Key
api = DataLoader("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNi0wMy0xMCAwMjoyMDowOCIsInVzZXJfaWQiOiJNaXN0eSIsImVtYWlsIjoiZ2hvc3Q3NzQ5OEBnbWFpbC5jb20iLCJpcCI6IjQyLjc3LjIzMi42In0.VwrsvFwhb5NAvKV4tFfpOV-VyBvvhu91VWtANob0MpQ")

class StockScanner:
    def __init__(self):
        self.observation_list = []

    def filter_fundamentals(self, data):
        """
        第一層：硬性財務過濾 
        條件：月營收年增率 (YoY)、營業利益率、稅後淨利率皆須為正
        """
        if data.empty or 'revenue_yoy' not in data.columns:
            return data
            
        mask = (data['revenue_yoy'] > 0) & \
               (data['operating_margin'] > 0) & \
               (data['net_profit_margin'] > 0)
        return data[mask]

    def filter_institutions(self, data):
        """
        第二層：法人籌碼過濾 
        條件：外資與投信近一週必須為買超狀態，並依買超排名
        """
        if data.empty or 'institutional_net_buy' not in data.columns:
            return data
            
        mask = data['institutional_net_buy'] > 0
        return data[mask].sort_values(by='institutional_rank', ascending=True)

    def calculate_macd(self, df, fast_period=12, slow_period=26, signal_period=9):
        """ 計算 MACD 相關指標 """
        ema_fast = df['close'].ewm(span=fast_period, adjust=False).mean()
        ema_slow = df['close'].ewm(span=slow_period, adjust=False).mean()
        df['MACD'] = ema_fast - ema_slow
        df['MACD_signal'] = df['MACD'].ewm(span=signal_period, adjust=False).mean()
        df['MACD_osc'] = df['MACD'] - df['MACD_signal']
        return df

    def check_technical_position(self, daily_data):
        """
        第三層：技術面位階診斷
        1. 出量狀態：成交量大於 1,000 張
        2. 量增條件：今日成交量 > 過去 5 日平均成交量的 1.5 倍
        3. 多頭排列：股價在 5MA、20MA、60MA 之上
        4. 斜率向上：20MA 斜率向上 (今日 20MA > 昨日 20MA)
        5. MACD：柱狀體(OSC)由負轉正 (昨日 OSC < 0 且 今日 OSC >= 0)
        """
        if len(daily_data) < 60:
            return False
            
        # 計算移動平均線與均量
        daily_data['5MA'] = daily_data['close'].rolling(window=5).mean()
        daily_data['20MA'] = daily_data['close'].rolling(window=20).mean()
        daily_data['60MA'] = daily_data['close'].rolling(window=60).mean()
        daily_data['5MA_Volume'] = daily_data['Trading_Volume'].rolling(window=5).mean()
        
        # 計算 MACD
        daily_data = self.calculate_macd(daily_data)

        last_d = daily_data.iloc[-1]
        prev_d = daily_data.iloc[-2]

        # 條件 1: 出量狀態 (大於 1000 張 = 1000000 股)
        # 注意：FinMind 的 Trading_Volume 單位通常是「股」
        is_enough_volume = last_d['Trading_Volume'] >= 1000000

        # 條件 2: 量增起漲 (成交量 > 5日均量 1.5 倍)
        is_breakout_volume = last_d['Trading_Volume'] > (last_d['5MA_Volume'] * 1.5)

        # 條件 3: 多頭排列 (股價 > 5MA > 20MA > 60MA 或 單純只看 股價都在這三條線之上)
        # 依據你的要求：股價必須在 5MA、20MA、60MA 之上
        is_bull_trend = (last_d['close'] > last_d['5MA']) and \
                        (last_d['close'] > last_d['20MA']) and \
                        (last_d['close'] > last_d['60MA'])

        # 條件 4: 斜率向上 (月線 20MA 向上)
        is_20ma_upward = last_d['20MA'] > prev_d['20MA']

        # 條件 5: MACD 柱狀體大於零 (OSC > 0)，表示處於多頭動能
        is_macd_positive = last_d['MACD_osc'] > 0

        return is_enough_volume and is_breakout_volume and is_bull_trend and is_20ma_upward and is_macd_positive

    def get_stock_data(self, stock_id, target_date):
        # 1. 優先嘗試從本地快取讀取
        cache_path = os.path.join("market_data_cache", f"{stock_id}.csv")
        
        if os.path.exists(cache_path):
            daily_data = pd.read_csv(cache_path)
            # 過濾日期區間確保不包含未來資料
            daily_data['date'] = pd.to_datetime(daily_data['date'])
            daily_data = daily_data[daily_data['date'] <= pd.to_datetime(target_date)]
        else:
            # 2. 本地無資料才抓取 API (保底邏輯)
            start_date = (pd.to_datetime(target_date) - timedelta(days=150)).strftime('%Y-%m-%d')
            try:
                daily_data = api.taiwan_stock_daily(stock_id=stock_id, start_date=start_date, end_date=target_date)
            except:
                return pd.DataFrame()
        
        if daily_data.empty:
            return pd.DataFrame()
            
        daily_data['date'] = pd.to_datetime(daily_data['date'])
        daily_data = daily_data.sort_values(by='date').reset_index(drop=True)

        # 統一處理 FinMind 回傳的開高低收欄位名稱 (max/min 轉 high/low)
        if 'max' in daily_data.columns:
            daily_data = daily_data.rename(columns={'max': 'high', 'min': 'low'})

        return daily_data

    def run_weekly_scan(self, all_market_data, target_date):
        """
        執行全面掃描流程 (拔除產業過濾，直接全市場過濾)
        """
        # 確保觀察清單不會一直累積
        self.observation_list = []

        # 1. 基本面初篩
        print("  正在進行第一層篩選：基本面三率過關...")
        passed_fundamental = self.filter_fundamentals(all_market_data)
        
        # 2. 法人籌碼篩選
        print("  正在進行第二層篩選：法人買超資金認證...")
        passed_institutions = self.filter_institutions(passed_fundamental)
        
        # 3. 技術面與動能確認
        total_targets = len(passed_institutions)
        print(f"  正在進行第三層篩選：技術面型態過濾 (剩餘 {total_targets} 檔待測)...")
        
        count = 0
        for stock_id in passed_institutions.get('stock_id', []):
            d_data = self.get_stock_data(stock_id, target_date)
            if not d_data.empty and self.check_technical_position(d_data):
                self.observation_list.append(stock_id)
            
            count += 1
            if count % 20 == 0:
                print(f"    已掃描: {count}/{total_targets}...")
        
        return self.observation_list  # 取消取前 10 名的硬限制，所有符合條件皆突破