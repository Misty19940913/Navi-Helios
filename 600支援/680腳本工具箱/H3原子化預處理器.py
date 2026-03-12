import os
import re
import json

# 設定路徑 (使用絕對路徑以確保穩定性)
VAULT_ROOT = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios"
KNOWLEDGE_BASE = os.path.join(VAULT_ROOT, "400知識", "410原子化知識庫")
SOURCE_DIR = os.path.join(VAULT_ROOT, "400知識", "440影片紀錄", "H3.0")
REPORT_PATH = os.path.join(VAULT_ROOT, "600支援", "620對話日誌", "H3原子化待辦報告.json")

def get_existing_notes():
    """獲取 410 目錄下所有筆記的標題"""
    if not os.path.exists(KNOWLEDGE_BASE):
        return set()
    return {f.replace(".md", "") for f in os.listdir(KNOWLEDGE_BASE) if f.endswith(".md")}

def extract_concepts_from_file(file_path):
    """
    從來源文件提取潛在的原子化概念。
    此版本簡單掃描 ## 或 ### 標題，以及 [[wikilinks]]。
    """
    concepts = []
    if not os.path.exists(file_path):
        return concepts
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # 提取 Markdown 標題 (二級與三級)
    headers = re.findall(r'^#{2,3}\s+(.+)$', content, re.MULTILINE)
    for h in headers:
        # 清除標題中的連結符號
        clean_h = re.sub(r'\[\[|\]\]', '', h).strip()
        concepts.append(clean_h)
        
    # 提取所有的 Wikilinks (這代表可能被引用但未建立的筆記)
    wikilinks = re.findall(r'\[\[([^|\]]+)(?:\|[^\]]+)?\]\]', content)
    concepts.extend([w.strip() for w in wikilinks])
    
    return list(set(concepts))

def run_audit():
    existing = get_existing_notes()
    all_pending = {}
    
    # 掃描來源目錄
    for filename in os.listdir(SOURCE_DIR):
        if filename.endswith(".md"):
            file_path = os.path.join(SOURCE_DIR, filename)
            source_concepts = extract_concepts_from_file(file_path)
            
            # 過濾出尚未建立的概念
            # 排除一些通用筆記或已經建立的 H3.0 筆記
            pending = [c for c in source_concepts if c not in existing]
            
            if pending:
                all_pending[filename] = pending

    # 產出報告
    report = {
        "summary": {
            "total_source_files": len(all_pending),
            "status": "Success",
        },
        "details": all_pending
    }
    
    with open(REPORT_PATH, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=4)
        
    return REPORT_PATH

if __name__ == "__main__":
    result = run_audit()
    print(f"報告已產出至: {result}")
