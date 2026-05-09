# Wikilink 失效映射修復流程（2026-05-09）

## 問題定義
MOC 內的 wikilinks 指向尚未建立的 atomic notes，但這些 atomic notes可能已以不同命名存在。

**典型命名不一致模式：**
| MOC 引用格式 | 實際 atomic note 命名 |
|---|---|
| `H3.0-*` （H3.0 MOC）| `K-HUMAN3-*` |
| `010_六商維度定義` （Arena MOC）| `K-ARENA-001_Arena系統概述` |
| `B2.1_客戶細分類型` （B2.0 MOC）| `K-BIZ-001_客戶細分類型` |

## 修復流程

### Step 1：建立 atomic notes 檔名清單
```python
from pathlib import Path
vault_root = Path("/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios")
atomic_dir = vault_root / "40_Knowledge/41_原子知識"
atomic_files = {f.stem for f in atomic_dir.rglob("*.md")}
```

### Step 2：掃描所有 MOC wikilinks 並分類
```python
import re
moc_dir = vault_root / "40_Knowledge/42_MOC"
for moc in moc_dir.glob("*.md"):
    content = moc.read_text(encoding='utf-8')
    wikilinks = re.findall(r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]', content)
    for wl in wikilinks:
        if wl not in atomic_files:
            # 嘗試映射
            mapped = try_mapping(wl, atomic_files)
```

### Step 3：建立映射表（人工判断）
對每個失效 wikilink，搜尋 atomic notes 中含相同關鍵字的檔案。
```python
# 關鍵字搜尋
keywords = ['六商', '維度', '等級', '階段', '生活方式', '錯誤轉變', '行為標記']
matches = [f for f in atomic_files if any(kw in f for kw in keywords)]
```

### Step 4：驗證映射目標存在
```python
valid_mapping = {}
for broken, target in mapping.items():
    if target in atomic_files:
        valid_mapping[broken] = target  # 有效
```

### Step 5：逐 MOC patch 修復
```python
for moc_path, replacements in patches.items():
    content = moc_path.read_text(encoding='utf-8')
    for old, new in replacements:
        content = content.replace(f'[[{old}]]', f'[[{new}]]')
    moc_path.write_text(content, encoding='utf-8')
```

## 本次修復結果
- H3.0 MOC：17 個 wikilinks → 全部直接對應 K-HUMAN3-*，無需映射
- Arena MOC：35 個確認可修復（18 個映射 + 17 個直接對應）
- B2.0 MOC：9 個全部可映射至 K-BIZ-001~019

## 核心原則
1. **先搜尋再patch** — 不先確認 target 存在就不動作
2. **映射表需完整驗證** — 每個 target 都需 `if target in atomic_files` 驗證
3. **obsidian-cli 需 API key** — 無 key 時用 direct file ops（路徑：`/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`）