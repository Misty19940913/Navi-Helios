---
name: navi-bases-spec
description: 針對 Navi Helios 系統設計的 Bases (.base) 生成執行規範。
parent_skill: '[[600支援/610管理協議/skills/obsidian-bases/SKILL]]'
type: content
folder: area
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
parent: []
children: []
related: []
domain: []
---

# NAVI-BASES 執行規範 (v1.0)

當使用 [[600支援/610管理協議/skills/obsidian-bases/SKILL]] 建立資料庫檢視時，必須強制遵守以下執行邏輯，以符合 Misty 的超級個體知識管理標準。

## 1. 核心原則：精確過濾 (Precision Filtering)
*   **不含副檔名**：在 `order` 或 `formulas` 中引用檔名時，優先使用 `file.basename`。
*   **動態排程**：所有涉及日期的 Bases，必須包含計算「剩餘天數」或「過期狀態」的 `formula`。
*   **排除無關項**：預設必須過濾掉已歸檔 (`#系統/存檔`) 或排除非 Markdown 檔案（除非是資源收集）。

## 2. 座標與屬性規範 (Property Spec)
*   **欄位命名**：`properties` 的 `displayName` 必須使用繁體中文。
*   **關鍵屬性**：
    *   `status`: 狀態 (inbox, todo, doing, done, waiting)。
    *   `due`: 截止日期。
    *   `quadrant`: HUMAN 3.0 四象限。

## 3. NAVI 專屬公式 (Standard Formulas)
```yaml
formulas:
  # 剩餘天數 (Days to Deadline)
  days_left: 'if(due, (date(due) - today()).days, "")'
  
  # 狀態圖示 (Visual Status)
  status_icon: 'if(status == "done", "✅", if(status == "doing", "🔥", if(status == "waiting", "⏳", "💤")))'
```

## 4. 預設檢視邏輯 (View Logic)
*   **看板優先**：若是任務管理類，首個檢視建議為 `table` 並按 `status` 分組 (`groupBy`)。
*   **卡片佈局**：若是知識庫 (`#系統/知識`)，建議使用 `cards` 檢視，並顯示標籤與最後修改時間。

## 5. 輸出語言規範
*   所有的 `View Name`、`Column Title` 必須強制輸出為**繁體中文**。
