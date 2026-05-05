---
children: []
description: ''
folder: area
parent: ''
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

# Obsidian 應用 MOC

這是一個關於 Obsidian 應用主題的MOC（Map of Content），彙整了多份對話紀錄分析報告，旨在提供一個系統性的檢索途徑，便於快速查閱與 Obsidian 筆記軟體的功能、插件應用，工作流程整合及知識管理實踐相關的知識與建議。

## 涵蓋的 Obsidian 應用子主題

*   **Obsidian 在人生規劃中的應用**：目標設定、進度追蹤、知識整合與規劃優化。
*   **筆記方法與工作流程**：高效使用 Obsidian 組織筆記，建立連結、以及管理專案。
*   **插件與功能拓展**：DataView、Canvas、Base 等 Obsidian 插件的應用。
*   **AI 整合應用**：ChatGPT 等 AI 工具與 Obsidian 的整合應用。

## 相關對話紀錄分析報告

- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄13_Obsidian系統優化_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄14_Obsidian DataView結構_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄22_AI與Obsidian整合_詳細]]

---

## DataView 結構與語法

### 常見錯誤：null - duration

**錯誤訊息**：
```
No implementation found for 'null - duration'
```

**原因**：`this.file.day` 不存在
- 檔名沒有日期格式（YYYY-MM-DD）
- Frontmatter 沒有 `date` 欄位

**解決方案**：
```dataview
LIST FROM "資料夾"
WHERE date >= date(today) - dur(7 days)
```

### DataView 欄位速查

| 欄位 | 說明 |
|------|------|
| `file.name` | 檔案名稱 |
| `file.day` | 檔案日期（需在檔名或 Frontmatter 有日期） |
| `file.mday` | 檔案修改時間 |
| `file.cday` | 檔案建立時間 |

### 常用查詢語法

**篩選已完成任務**：
```dataview
TASK FROM "200週期紀錄/230任務池"
WHERE status = "completed"
```

**本週新增資料**：
```dataview
LIST FROM "資料夾"
WHERE date >= date(today) - dur(7 days)
```

---

## Obsidian 筆記方法

### 筆記組織結構

| 資料夾 | 用途 |
|--------|------|
| 10_Inbox | 收集箱，新進入的資料 |
| 20_每日/每週 | 時間維度筆記 |
| 30_Projects | 專案管理 |
| 40_Knowledge | 知識庫 |
| 50_Archives | 歸檔 |

### 雙向連結應用

- Wiki 連結：`[[筆記名稱]]`
- 嵌入內容：`![[筆記名稱]]`
- 建立 MOC（Content Map）整合多筆筆記

---

## 推薦插件

| 插件 | 功能 |
|------|------|
| DataView | 資料庫式查詢 |
| Canvas | 視覺化畫布 |
| Base | 資料庫應用 |
| QuickAdd | 快速輸入 |
| Templater | 範本生成 |

---

## 相關章節

- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄13_Obsidian系統優化_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄14_Obsidian DataView結構_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄22_AI與Obsidian整合_詳細]]
