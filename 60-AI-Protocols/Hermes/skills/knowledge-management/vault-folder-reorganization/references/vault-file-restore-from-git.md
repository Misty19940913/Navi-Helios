---
name: vault-file-restore-from-git
description: 從 vault-git 備份還原被刪除或未同步的檔案——當 OneDrive sync 造成 vault 與 git 不同步時使用
---

# Vault 檔案還原流程

## 徵兆
- Obsidian vault 內的 folder/檔案消失
- 但 `~/.hermes/vault-git/` 的 git 歷史有記錄
- 常見原因：OneDrive sync 競爭、未 commit 就刪除

## 還原步驟

### 1. 確認 vault-git 位置
```bash
VAULT_GIT=~/.hermes/vault-git/60-AI-Protocols
```

### 2. 查詢檔案在哪個 commit
```bash
git -C $VAULT_GIT log --all --oneline -- "60-AI-Protocols/Hermes/memory/**"
```
（注意路徑要含 `60-AI-Protocols/` 前綴，這是 repo root）

### 3. 確認目標 commit 的完整路徑
```bash
git -C $VAULT_GIT show <commit> --name-only | grep "Hermes/memory"
```
注意：`git show <commit>:` 路徑是從 repo root 開始，不是從 `./`

### 4. 還原前先確保目標資料夾存在
```bash
mkdir -p "/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/memory"
```

### 5. 從 git 抽出檔案
```bash
git -C $VAULT_GIT show <commit>:60-AI-Protocols/Hermes/memory/MEMORY.md \
  > "/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/memory/MEMORY.md"
```

## 常見錯誤

### 錯誤：路徑不含前綴
```
fatal: path 'Hermes/memory/MEMORY.md' exists, but not 'Hermes/memory/MEMORY.md'
hint: Did you mean '6834afb:60-AI-Protocols/Hermes/memory/MEMORY.md'
```
**修復**：路徑要從 repo root 寫起

### 錯誤：目標資料夾不存在
**修復**：先 `mkdir -p` 確保父資料夾存在

## 預防
- 重要結構變更（如刪除 folder）後立即 commit 到 vault-git
- 不要依賴 OneDrive sync 保持 vault-git 同步
