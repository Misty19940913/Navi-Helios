import pandas as pd
import os
import time

# 刑事證物路徑清單
input_files = [
    r"d:\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_202406170000_202412312254.csv",
    r"d:\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_202501020005_202512310035.csv",
    r"d:\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_202601020005_202603101837.csv"
]
output_parquet = r"d:\OneDrive\Obsidian\Navi Helios\300專案\320進行中 (Active)\黃金單\data\history\XAUUSD_Ticks.parquet"

def convert():
    print(f"🚀 啟動批量轉檔程序...")
    start_time = time.time()
    
    import pyarrow as pa
    import pyarrow.parquet as pq

    writer = None
    
    try:
        for input_csv in input_files:
            if not os.path.exists(input_csv):
                print(f"⚠️ 找不到檔案: {input_csv}，跳過。")
                continue
                
            print(f"📂 正在處理: {os.path.basename(input_csv)}...")
            
            # 使用一次性讀取 (如果記憶體不足，此處會報錯，屆時再改為 chunksize)
            # 僅讀取必要欄位以節省記憶體
            df = pd.read_csv(input_csv, sep='\t', engine='c')
            
            # 1. 清理欄位名稱 (移除 < > )
            df.columns = [c.replace('<', '').replace('>', '') for c in df.columns]
            
            # 2. 合併時間戳
            df['timestamp'] = pd.to_datetime(df['DATE'].str.replace('.', '-') + ' ' + df['TIME'])
            
            # 3. 移除原始時間欄位
            df = df.drop(columns=['DATE', 'TIME'])
            
            # 4. 轉換類型節省空間
            for col in ['BID', 'ASK', 'LAST', 'VOLUME']:
                if col in df.columns:
                    df[col] = df[col].astype('float32')
            
            # 5. 寫入 Parquet
            table = pa.Table.from_pandas(df)
            if writer is None:
                # 第一次寫入，建立檔案與 Writer
                writer = pq.ParquetWriter(output_parquet, table.schema, compression='snappy')
            
            writer.write_table(table)
            print(f"✅ 子檔案處理完成。")
            
            # 釋放記憶體
            del df
            del table
            
        if writer:
            writer.close()
            
        end_time = time.time()
        print(f"🎉 全部轉檔成功！")
        print(f"📊 最終檔案: {output_parquet}")
        if os.path.exists(output_parquet):
            print(f"📉 最終檔案大小: {os.path.getsize(output_parquet) / (1024*1024):.2f} MB")
        print(f"⏱️ 總耗時: {end_time - start_time:.2f} 秒")
        
    except Exception as e:
        if writer:
            writer.close()
        print(f"❌ 轉檔過程發生錯誤: {e}")

if __name__ == "__main__":
    convert()
