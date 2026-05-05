---
type: tool-guide
status: active
tags:
  - obsidian
  - pkm
  - dataview
  - query-language
  - automation
  - H3.0
time_created: 2026-04-09
time_modified: 2026-04-30
description: DataView 語法——Obsidian 知識庫自動化的核心引擎，透過類 SQL 的查詢語言，實現筆記屬性的動態篩選、關聯展示與系統化治理。
parent: K-BIZ_商業與電商_MOC
related: []
sources:
  - "AI 對話紀錄分析與截取 - Obsidian DataView 結構對話"
used_in:
  - "[[K-SYS-032_PKM框架整合地圖]]"
contradictions: []
---

# DataView 語法 — 知識庫的自動化引擎

> [!abstract] 核心洞見 (Insight)
> 筆記不是死掉的檔案，而是 **「動態的數據點」**。DataView 的價值在於將 Obsidian 從一個純文字編輯器轉化為一個具備 **「湧現能力 (Emergence)」** 的個人資料庫。透過定義良好的 YAML 屬性（如：status, type, tags），DataView 能夠在海量筆記中自動抓取關聯點，實現「一次寫入，多處顯示」。掌握 DataView 語法，就是掌握了知識庫從「收藏」轉向「治理」的關鍵鑰匙。

### 定義與機制 (What & How)

#### 核心定義
DataView 是 Obsidian 最強大的插件之一，它提供了一套類 SQL 的查詢語言，允許用戶根據筆記的元數據 (Metadata) 進行列表 (LIST)、表格 (TABLE)、任務 (TASK) 或日曆 (CALENDAR) 的展示。

#### 基本語法結構 (Query Structure)
```dataview
TABLE status as "狀態", time_created as "建立日期"
FROM "40_Knowledge/41_原子知識"
WHERE type = "atomic" AND status = "active"
SORT time_created DESC
LIMIT 10
```

#### 常用內部欄位 (Implicit Fields)
| 欄位 | 說明 | 實戰用途 |
|----------|----------|------------|
| `file.name` | 檔案標題。 | 預設展示標籤。 |
| `file.day` | 檔案日期（從標題或 `date` 屬性提取）。 | 製作日誌匯總。 |
| `file.mday` | 最後修改日期。 | 追蹤「過期」需要更新的知識。 |
| `file.outlinks` | 該筆記指出的鏈接。 | 檢查知識網絡的連通性。 |
| `file.tags` | 該筆記包含的所有標籤。 | 多維度篩選。 |

#### 常見錯誤與對策 (Troubleshooting)
- **Error: `null - duration`**：
    - **原因**：嘗試對不存在的日期進行減法運算。
    - **對策**：使用 `WHERE date` 確保欄位存在，或使用 `date(today)` 強制轉換類型。
- **欄位無顯示**：
    - **對策**：使用 `default(field, "N/A")` 確保在欄位缺失時仍有預設輸出，防止表格排版崩潰。

### 實踐與案例 (Action & Proof)
- **真實案例**：Navi Helios 知識庫的「待辦原子化清單」。
  - **背景**：庫中有數百個 `status: seed` 的原始筆記，需要逐一重構為 `status: active`。
  - **DataView 實作**：
    ```dataview
    LIST FROM "40_Knowledge/41_原子知識"
    WHERE status = "seed"
    SORT file.mday ASC
    ```
  - **成果**：這個動態清單被放置在 MOC 地圖的最上方，確保創作者每次打開庫時都能第一時間看到「最需要處理的知識點」，實現了 **「任務驅動型學習」**，而非漫無目的的筆記。
- **行動指南**：
  1. **建立「最近修改」儀表板**：在你的 Homepage 放置一個顯示最近 10 篇修改筆記的 DataView，幫助你快速進入工作流。
  2. **自動化索引 MOC**：不要手動維護 MOC 鏈接，改用 `LIST FROM [[#]]` 語法讓子筆記自動「報到」。

### 知識網絡 (Connection)
- **關聯脈絡**：本語法為 PKM 框架（K-SYS-032）提供技術支撐，受原子化協定（K-AI-004-K）的屬性定義規範，並應用於各領域的 MOC 地圖。
- [[K-SYS-032_PKM框架整合地圖]]
- [[K-AI-004-K_atomization-protocol]]
- [[K-SYS-009_知識湧現架構]]
- [[K-SYS-036_防彈筆記與知識演化規範]]

---

## 應用紀錄

### Input Notes
<!-- 此筆記被哪些計劃調用 -->

| Plan | Phase | Purpose |
|------|--------|---------|

### Output Notes
<!-- 此筆記關聯的新筆記 -->

| Note | Type | Created In |
|------|------|----------|
