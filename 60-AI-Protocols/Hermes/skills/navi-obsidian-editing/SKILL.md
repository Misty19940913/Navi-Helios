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

## 陷阱記錄

- `references/patch-pitfalls.md` — patch tool 的截斷問題、編碼陷阱、替換計數陷阱（每次燒到時間後更新）
