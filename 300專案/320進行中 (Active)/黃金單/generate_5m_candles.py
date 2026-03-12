import pandas as pd
import os
import time

# 核心數據路徑
input_parquet = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_Ticks.parquet"
output_5m = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_5m_Clean.parquet"

def generate():
    print(f"🕯️ 正在從 Tick 證物合成 5m K 棒...")
    start_time = time.time()
    
    # 1. 載入 Tick 數據
    df = pd.read_parquet(input_parquet)
    df.set_index('timestamp', inplace=True)
    
    # 2. 執行重採樣 (Resample)
    # 我們選擇以 BID 為基準來合成 (大部份策略的標準)
    ohlc = df['BID'].resample('5min').ohlc()
    volume = df['BID'].resample('5min').count().rename('tick_volume')
    
    # 3. 合併數據
    final_5m = pd.concat([ohlc, volume], axis=1)
    
    # 4. 移除沒有交易的空 K 棒 (例如週末)
    final_5m.dropna(subset=['open'], inplace=True)
    
    # 5. 存檔
    final_5m.to_parquet(output_5m, compression='snappy')
    
    end_time = time.time()
    print(f"✅ 合成完成！")
    print(f"📊 總計 K 棒數量: {len(final_5m)} 根")
    print(f"💾 產出路徑: {output_5m}")
    print(f"⏱️ 耗時: {end_time - start_time:.2f} 秒")

if __name__ == "__main__":
    generate()
