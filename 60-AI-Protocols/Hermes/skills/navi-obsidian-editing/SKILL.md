---
name: navi-obsidian-editing
description: Navi 公司的 Obsidian Vault 編輯協議 — 編輯舊檔案時遵守此流程
---

# Navi Obsidian 編輯協議

## 何時使用

編輯現有的 Obsidian vault 筆記時使用本協議。新建筆記不受此限。

## 編輯流程

### 步驟 0：立場與行動一致性預檢（新增，強制）

> **觸發條件**：當檔案同時包含「立場宣稱段落」與「具體行動指令」時，必須執行此預檢。

1. 列舉所有具體行動指令（識別動詞：建立、導入、更新、定義、研究、實作、蒸餾、導入）
2. 對照立場段落（通常是文件開頭或章節首的 `> **核心立場**：` block）
3. 發現矛盾時：回報衝突點，停止編輯，等待釐清

> **為什麼要做**：表面立場文字掩蓋具體行動指令的偏差很常見。讀到立場段落不代表內容一致——必須逐一對照。

### 步驟 1：複製原始檔案

在同一資料夾內複製一份原始檔案。

### 步驟 2：重新命名

命名格式：`{{原始檔名}}-{{編輯者}}`

**範例：**
```
原始：AI-Agent.md
編輯：AI-Agent-Hermes.md
```

### 步驟 3：更新 YAML frontmatter

在檔案頂部的 YAML frontmatter 中更新或新增以下屬性：

```yaml
---
version: X.Y.Z
last-editor: Hermes
time_modified: 2026-04-26T12:00:00Z
---
```

**版本格式：X.Y.Z**
- X = 大版本（breaking changes）
- Y = 小版本（新功能）
- Z = 微調（bug fixes）

### 步驟 4：寫入新內容

在新的命名檔案中寫入編輯後的內容。

## 30_Projects 狀態分流

根據專案執行狀態存入對應資料夾：

| 狀態 | 資料夾 |
|------|--------|
| 規劃中 | `31_Planning/` |
| 執行中 | `32_Active/` |
| 已完成 | `33_Done/` |
| 暫停 | `34_On-hold/` |

## 資料庫路徑

- **Obsidian Vault：** `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`
- **60 資料夾：** `60-AI-Protocols/`
- **62 資料夾：** `62-學習區/`

## 吸收的參考技能

本技能的「立場與行動一致性預檢」邏輯，源自獨立的 `document-consistency-check` skill。該 skill 的完整內容已保存至 `references/document-consistency-check.md`，可直接查閱。

## 陷阱記錄

- `references/patch-pitfalls.md` — patch tool 的截斷問題、編碼陷阱、替換計數陷阱（每次燒到時間後更新）
- `references/refactor-workflow.md` — 大規模 ID 重構時，write_file 優先於多次 patch

## 大規模重構工作流

> **觸發條件**：同時變更 5 個以上的 ID、術語或跨文件結構時，必須使用此流程。

### 正確流程（read → replace → write_file）

1. **read_file 完整讀取** 目標檔案
2. **記憶體中替換**（str.replace 或正規表達式一次性置換）
3. **write_file** 一次寫回

### 錯誤流程（不要用）

- 連續多次 `patch` 操作試圖完成大規模替換
- 每次 patch 只改一處，依序執行

### 為什麼

多次 patch 的累積問題：
- 每個 patch 都以當前磁碟狀態為準（不是上次 patch 後的狀態）
- 執行到一半時，磁碟內容與預期不符，導致後續 patch 失敗或錯誤匹配
- 一旦出錯，修復成本高過重新開始

### 驗證

重構後用計數確認（`content.count(new_id)`），確保沒有殘留舊 ID，也沒有錯誤覆蓋不應覆蓋的地方。
