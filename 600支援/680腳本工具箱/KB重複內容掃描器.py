import os
import json
import re
from datetime import datetime
from difflib import SequenceMatcher

# ==========================================
# 配置路徑 (基於 Navi Helios 系統架構)
# ==========================================
VAULT_ROOT = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios"
KB_PATHS = [
    os.path.join(VAULT_ROOT, "400知識", "410原子化知識庫"),
]
LOG_DIR = os.path.join(VAULT_ROOT, "600支援", "620對話日誌")
REPORT_PATH = os.path.join(LOG_DIR, "KB重複內容報告.json")

# ==========================================
# 重複判定閾值
# ==========================================
SIMILARITY_THRESHOLD = 0.7  # 檔名相似度 70% 以上判定為疑似重複

def clean_title(title):
    """移除 [H3.0-], (English Name), .md 等雜訊以進行純淨對比"""
    # 移除 H3.0- 前綴
    title = re.sub(r'^H3\.0-', '', title)
    # 移除副檔名
    title = title.replace('.md', '')
    # 移除括號內的英文
    title = re.sub(r'\s*\([^)]*\)', '', title)
    # 移除空格與特殊符號
    title = re.sub(r'[\s\-_]', '', title)
    return title.lower()

def get_similarity(a, b):
    return SequenceMatcher(None, a, b).ratio()

def scan_duplicates():
    files_data = []
    
    # 1. 蒐集所有檔案資訊
    for kb_path in KB_PATHS:
        if not os.path.exists(kb_path):
            continue
            
        for root, dirs, files in os.walk(kb_path):
            for file in files:
                if file.endswith('.md'):
                    full_path = os.path.join(root, file)
                    clean = clean_title(file)
                    files_data.append({
                        "name": file,
                        "clean_name": clean,
                        "path": full_path,
                        "mtime": os.path.getmtime(full_path)
                    })

    # 2. 進行兩兩對比 (增量掃描邏輯可演進為記錄上次掃描時間)
    duplicates = []
    seen_pairs = set()

    for i in range(len(files_data)):
        for j in range(i + 1, len(files_data)):
            file_a = files_data[i]
            file_b = files_data[j]
            
            # 檔名完全相同雜訊清理後一致
            if file_a["clean_name"] == file_b["clean_name"]:
                similarity = 1.0
            else:
                similarity = get_similarity(file_a["clean_name"], file_b["clean_name"])
            
            if similarity >= SIMILARITY_THRESHOLD:
                # 按照修改時間排序，較新的通常是目標，較舊的是待清理
                sorted_files = sorted([file_a, file_b], key=lambda x: x["mtime"], reverse=True)
                
                duplicates.append({
                    "similarity": round(similarity, 2),
                    "target_suggested": sorted_files[0]["name"],
                    "duplicate_candidate": sorted_files[1]["name"],
                    "paths": [sorted_files[0]["path"], sorted_files[1]["path"]]
                })

    # 3. 產出報告
    report = {
        "scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_files_scanned": len(files_data),
        "potential_duplicates_count": len(duplicates),
        "details": duplicates
    }

    if not os.path.exists(LOG_DIR):
        os.makedirs(LOG_DIR)

    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=4)

    print(f"掃描完成！發現 {len(duplicates)} 組疑似重複內容。")
    print(f"詳細報告已儲存至: {REPORT_PATH}")

if __name__ == "__main__":
    scan_duplicates()
