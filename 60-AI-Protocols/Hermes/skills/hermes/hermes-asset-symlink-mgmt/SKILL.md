---
name: hermes-asset-symlink-mgmt
description: WSL/NTFS 環境下 Hermes 資產（SOUL/AGENTS/memories/skills）symlink 的建立與重建標準程序
triggers:
  - 使用者變更 Hermes 資產路徑
  - symlink 異常（FileNotFoundError）
  - hermes update 後記憶讀取失敗
---

# Hermes Asset Symlink Management

> WSL/NFTS 環境下 Hermes 資產（SOUL/AGENTS/memories/skills）的 symlink 建立與重建標準程序。

## 典型場景

將 Hermes 資產從舊路徑迁移到新 canonical 路徑後，需重建 `~/.hermes/` 下的所有 symlinks。

## 標準程序

### Step 0: 確認新舊路徑

```bash
# 新 canonical 路徑（vault）
NEW_CANONICAL="/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/"

# 驗證目標存在
ls "$NEW_CANONICAL/SOUL.md"
ls "$NEW_CANONICAL/memories/"
ls "$NEW_CANONICAL/skills/"
```

### Step 1: 備份現有 symlinks 狀態

```bash
ls -la ~/.hermes/ | grep -E "SOUL|memories|skills"
```

### Step 2: 刪除舊 symlinks

⚠️ **NTFS gotcha**: WSL 中 `rm symlink` 在 NTFS mount 上可能追蹤到目標並刪除之。**刪除後立即驗證目標是否存在**，不等壞了再補救。

```bash
rm -v ~/.hermes/SOUL.md ~/.hermes/memories ~/.hermes/skills

# 立即驗證 — 目標檔案還在不在？
ls "$NEW_CANONICAL/SOUL.md"    # must still exist
```

### Step 3: 重新建立 symlinks

```bash
ln -sv "$NEW_CANONICAL/SOUL.md"   ~/.hermes/SOUL.md
ln -sv "$NEW_CANONICAL/memories"  ~/.hermes/memories
ln -sv "$NEW_CANONICAL/skills"    ~/.hermes/skills
```

### Step 4: 驗證

```bash
# 確認是 symlink 不是 stub
file ~/.hermes/SOUL.md
ls -la ~/.hermes/ | grep -E "SOUL|memories|skills"

# 確認可讀取
wc -l ~/.hermes/SOUL.md
wc -l ~/.hermes/memories/MEMORY.md
ls ~/.hermes/skills/ | head -3
```

## 故障排除

| 症狀 | 原因 | 修復 |
|------|------|------|
| `ln: failed to create symbolic link: File exists` | stub 殘留（`rm` 失敗但留了空檔） | `rm -v /path/to/stub` 確認刪乾淨 |
| `memories/memories` 巢狀 symlink | `memories` 是目錄，在其內又建了 symlink | 確認上層是目錄還是 symlink：`file ~/.hermes/memories` |
| `No such file or directory` 讀取失敗 | 目標路徑中某一層不存在 | 確認完整路徑每層 |
| symlink 指向目標 but `ls` 看不到內容 | NTFS symlink 在 WSL 的行為差異 | 用 `readlink -f` 追蹤終點 |
| AGENTS.md 更新後行為沒變 | AGENTS.md 從 CWD 發現，vault 版本被 hermes-agent/ 內的覆蓋 |見下方「AGENTS.md CWD 陷阱」章節 |

## AGENTS.md CWD 陷阱（2026-05-05）

### 問題
`AGENTS.md` 不是從 `HERMES_HOME` 發現，而是從 **gateway CWD** 發現。Gateway CWD = `~/.hermes/hermes-agent/`，剛好有 Hermes 自己的開發指南（35KB），**覆蓋 vault 版本**。

### 驗證
```bash
head -3 ~/.hermes/hermes-agent/AGENTS.md
# "Hermes Agent - Development Guide" → 錯（讀到 Hermes 自己的）
# "協調者身份" → 對（vault 版本）
```

### 修復
vault AGENTS.md 是 canonical。每次更新 vault 版本後，**必須同步到 hermes-agent/**：
```bash
cp "/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/AGENTS.md" \
   ~/.hermes/hermes-agent/AGENTS.md
```

或使用腳本（推薦）：
```bash
~/.hermes/scripts/sync-agents.sh
```

### 為何 SOUL.md 不受影響
SOUL.md 有 engine 級特殊待遇：從 `HERMES_HOME/SOUL.md` 載入，不走 CWD 機制。AGENTS.md 沒有這個待遇。

### 腳本位置
`~/.hermes/scripts/sync-agents.sh`（已建立）

## NTFS Symlink 特殊行為

WSL 中對 NTFS 分區（`/mnt/c/`）的 symlink 行為：
- `rm symlink` 可能追蹤到目標並刪除之（不是只刪 symlink 本身）
- **預防**：刪除前 `file /path/to/symlink` 確認是 `symbolic link` 而非 stub
- **事後驗證**：刪除後立即 `ls <target>` 確認目標還在

## 觸發時機

- 用户變更 Hermes 資產 canonical 路徑時
- `hermes update` 或 gateway 重啟後 symlinks 異常
- 任何 `FileNotFoundError` 找不到 SOUL/memories/skills 時
