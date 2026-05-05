---
children: []
description: ''
folder: area
parent: []
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

# 實施資料安全防護系統計畫

## 目標
建立一套 AI 必須遵守的「防禦性執行」規範，透過精細的步驟拆解與強制性的人力確認環節，徹底杜絕資料因自動化重組而遺失的風險。

## 擬定變更

### [Component] 系統管理協議 (610 Governance)

#### [NEW] [資料清理與整合防護協議.md](file:///d:/OneDrive/Obsidian/Navi%20Helios/600支援/610管理協議/Agent/Protocols/資料清理與整合防護協議.md)
- 定義「先建後刪」的鐵律。
- 要求在刪除前提供「顯式檔案清單」供使用者審閱。
- 規定 AI 必須在刪除前自行驗證新內容的存在性。

#### [MODIFY] [AGENTS.md](file:///d:/OneDrive/Obsidian/Navi%20Helios/600支援/610管理協議/Agent/AGENTS.md)
- 在「智能協議庫」區塊加入此協議。
- 在「AI 回應原則」中加入「執行破壞性任務前必須拆解步驟並請求顯式批准」的條款。

## 驗證計畫

### 自動化驗證
- AI 每次執行清理任務時，必須在 `task.md` 中獨立列出「刪除清單確認」子項。

### 手動驗證
- 使用者審閱 `changes_summary.md` 確保所有異動與預期一致。
