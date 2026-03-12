import os
import re

# ==========================================
# 配置
# ==========================================
VAULT_ROOT = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios"
MAPPING = {
    "元類型 (Metatypes)": "H3.0-複合型態",
    "H3.0-元類型": "H3.0-複合型態",
    "人生指南針": "人生指南針 (Life Compass)",
    "奧德賽計畫": "奧德賽計畫 (Odyssey Plan)",
    "工作觀(Workview)": "工作觀 (Workview)",
    "棘手問題": "棘手問題 (Wicked Problems in Life Design)",
    "生活觀(Lifeview)": "生活觀 (Lifeview)",
    "競爭性動態": "競爭性動態(Rivalrous Dynamics)",
    "設計思考": "設計思考 (Design Thinking in Life Design)",
    "金錢的三個等級": "H3.0-金錢三大等級",
    "回退機制 (Regression Mechanics)": "H3.0-退行機制",
    "數位產品矩陣 (Product Ladder)": "數位產品矩陣 (Digital Product Matrix)",
    "生活目標理論": "生命目標理論",
    "生涯設計 1": "生涯設計",
    "四小時工作制的十個法則 (The 10 Laws of Deep Work)": "四小時深度工作法則 (Deep Work Laws)",
    "金字塔原則 (The Pyramid Principle in Content)": "說服型金字塔原則 (The Persuasive Pyramid Principle)"
}

def migrate_links():
    # 建立正則表達式，處理 [[Note]], [[Note|Alias]], [[Note#Section]]
    # 排除 .md 副檔名在連結中的情形 (Obsidian 通用)
    
    print("開始執行全金庫連結遷移...")
    
    count_files = 0
    count_replacements = 0
    
    for root, dirs, files in os.walk(VAULT_ROOT):
        # 排除系統目錄
        if any(x in root for x in ['.git', '.obsidian', '.agents', '.gemini']):
            continue
            
        for file in files:
            if file.endswith('.md') or file.endswith('.canvas'):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    for candidate, target in MAPPING.items():
                        # 處理 [[Candidate]]
                        pattern = re.compile(r'\[\[' + re.escape(candidate) + r'(\|?.*?\#?.*?)\]\]')
                        new_content, n = pattern.subn(r'[[' + target + r'\1]]', new_content)
                        count_replacements += n
                        
                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        count_files += 1
                except Exception as e:
                    print(f"處理檔案時出錯 {file}: {e}")

    print(f"連結遷移完成！共修改 {count_files} 個檔案，執行 {count_replacements} 次替換。")

def delete_candidates():
    print("開始刪除冗餘檔案...")
    kb_dir = os.path.join(VAULT_ROOT, "400知識", "410原子化知識庫")
    for candidate in MAPPING.keys():
        file_path = os.path.join(kb_dir, candidate + ".md")
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"已刪除: {candidate}.md")
            except Exception as e:
                print(f"刪除失敗 {candidate}.md: {e}")
        else:
            print(f"跳過 (不存在): {candidate}.md")

if __name__ == "__main__":
    migrate_links()
    delete_candidates()
