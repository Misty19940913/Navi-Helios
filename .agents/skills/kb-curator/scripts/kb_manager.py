import os
import re
import yaml
from datetime import datetime

# ==========================================
# 配置路徑 (自動偵測對齊系統)
# ==========================================
VAULT_ROOT = r"c:\Users\安泰\OneDrive\Obsidian\Navi Helios"
KB_DIR = os.path.join(VAULT_ROOT, "400知識", "410原子化知識庫")
LOG_DIR = os.path.join(VAULT_ROOT, "600支援", "620對話日誌")

def get_yaml_block(content):
    parts = content.split('---')
    if len(parts) >= 3:
        return parts[1], '---'.join(parts[2:])
    return None, content

def audit_vault():
    if not os.path.exists(KB_DIR):
        return {}, [f"目錄不存在: {KB_DIR}"]
        
    files = os.listdir(KB_DIR)
    md_files = [f for f in files if f.endswith('.md')]
    
    # 1. 簡易重複偵測 (Skill 基礎)
    groups = {}
    for f in md_files:
        name = f[:-3]
        core_match = re.match(r'^(.+?)\s?\(.*\)$', name)
        core = core_match.group(1).strip() if core_match else name.strip()
        if core not in groups: groups[core] = []
        groups[core].append(f)
    
    dupes = {k: v for k, v in groups.items() if len(v) > 1}
    
    # 2. YAML 健康診斷
    missing_yaml = []
    for f in md_files:
        path = os.path.join(KB_DIR, f)
        try:
            with open(path, 'r', encoding='utf-8') as file:
                content = file.read()
                if not content.startswith('---'):
                    missing_yaml.append(f)
                else:
                    parts = content.split('---')
                    if len(parts) < 3:
                        missing_yaml.append(f"{f} (Malformed)")
                        continue
                    yaml_block = parts[1]
                    # 檢查核心 7 行欄位
                    fields = ['tags', 'status', 'time_create', 'time_modifie', 'subject', 'parent', 'related']
                    missing_fields = [field for field in fields if f"{field}:" not in yaml_block]
                    if missing_fields:
                        missing_yaml.append(f"{f} (缺失欄位: {', '.join(missing_fields)})")
        except:
            missing_yaml.append(f"{f} (讀取錯誤)")
            
    return dupes, missing_yaml

def standardize_yaml_content(current_yaml_str, filename=""):
    # 解析現有的 YAML 欄位
    current_values = {}
    try:
        # 嘗試用 yaml 解析器讀取，若格式太亂則回退到正則
        parsed = yaml.safe_load(current_yaml_str)
        if isinstance(parsed, dict):
            for k, v in parsed.items():
                current_values[k] = str(v)
    except:
        lines = current_yaml_str.split('\n')
        for line in lines:
            if ':' in line:
                key = line.split(':')[0].strip()
                val = ':'.join(line.split(':')[1:]).strip()
                current_values[key] = val.split('#')[0].strip()

    # 1. 狀態映射 (status)
    status = str(current_values.get('status', 'seed')).lower()
    if any(x in status for x in ['done', 'evergreen', '🌳']): status = 'evergreen'
    elif any(x in status for x in ['todo', 'doing', 'in-progress', '🌿']): status = 'in-progress'
    else: status = 'seed'

    # 2. 連結格式化 (維護 Wikilinks)
    def wrap_link(key, default):
        val = current_values.get(key, '')
        if not val or val in ['[]', '""', 'None']: 
            return f'"[[{default}]]"'
        # 確保有方括號與雙引號
        if not val.startswith('"'):
            # 處理原始 Wikilink [[link]]
            clean_val = val.strip().strip('"').strip("'")
            return f'"{clean_val}"'
        return val

    # 3. 時間補齊
    now_str = datetime.now().strftime('%Y-%m-%d')
    time_create = current_values.get('time_create', now_str)
    if 'None' in time_create or not time_create: time_create = now_str

    # 4. 標籤校準
    tags = current_values.get('tags', '[系統/知識]')

    new_yaml_lines = [
        "---",
        f"tags: {tags}",
        f"status: {status}",
        f"time_create: {time_create}",
        f"time_modifie: {now_str}",
        f"subject: {wrap_link('subject', '範疇MOC')}",
        f"parent: {wrap_link('parent', '上層連結')}",
        f"related: {wrap_link('related', '水平連結')}",
        "---"
    ]
    return "\n".join(new_yaml_lines)

if __name__ == "__main__":
    dupes, yaml_issues = audit_vault()
    if not dupes and not yaml_issues:
        print("KB 狀態良好，未發現顯著異常。")
    else:
        print("### 重複筆記組別:")
        for core, instances in dupes.items():
            print(f"- {core}: {', '.join(instances)}")
        
        print("\n### YAML 異常檔案 (前 10 個):")
        for issue in yaml_issues[:10]:
            print(f"- {issue}")
        if len(yaml_issues) > 10:
            print(f"... 以及其他 {len(yaml_issues)-10} 個異常項目。")
