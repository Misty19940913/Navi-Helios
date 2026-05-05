---
type: atomic
status: active
tags:
  - AI
  - MCP
  - 任務管理
  - H3.0
time_created: 2026-04-30
time_modified: 2026-04-30
description: MCP（Metadata Control Pool）結構化資料庫的核心理念，強調主動定義與精確過濾。
parent: K-AI-004-0_Prompt-System-MOC
related: []
sources: []
used_in: []
contradictions: []
---

# MCP 資料庫核心概念

> [!abstract] 核心洞見 (Insight)
> MCP（Metadata Control Pool）是知識系統中的「導航軌跡」。與 RAG 的模糊語義檢索不同，MCP 專注於透過 YAML 元資料進行「主動定義」與「精確過濾」，是驅動自動化工作流（如：進度統計、任務排程）的邏輯引擎。

### 定義與機制 (What & How)

#### 核心定義
MCP 本質上是建立在 Markdown YAML Frontmatter 之上的**結構化資訊池**。它將筆記視為具備特定屬性的「物件」，而非僅僅是文字區塊。

#### 核心功能與應用
- **任務排程**：透過篩選 `scheduled: today` 欄位，自動生成每日行動清單。
- **進度過濾**：精確篩選出所有 `type: project` 且 `status: active` 的項目，排除無關噪音。
- **自動化觸發**：結合 n8n 或腳本，偵測特定屬性（如：`type: inspiration`）的增量，自動轉發至靈感處理工作流。

#### 儲存與組織方式
- **Metadata 驅動**：核心資訊儲存在 YAML 區塊中。
- **資料格式**：在 Obsidian 中表現為屬性 (Properties)，可輕鬆轉換為 JSON 或 CSV 供外部系統調用。

#### 核心特點
- **精確掌控**：用戶對資料的分類具備絕對的主動權。
- **邏輯穩定**：適合進行統計、求和、過濾等數學或邏輯運算。
- **侷限性**：不具備「模糊概念」的理解能力，無法處理「找尋語氣相似的筆記」等任務。

### 實踐與案例 (Action & Proof)
- **真實案例**：在執行「自媒體月度回顧」時，用戶不需要手動翻閱筆記。MCP 引擎自動過濾出 `tags: #media` 且 `time_created` 在本月範圍內的所有筆記，並提取其中的 `engagement_rate` 數值進行平均計算，產出一份客觀的數據報告。
- **行動指南**：
  1. **維持元資料純度**：堅持使用「七行 YAML 規範」（K-SYS-002），確保每個原子知識都具備可過濾性。
  2. **標籤層級化**：使用 `#media/ig` 而非單純的 `#ig`，增加 MCP 過濾的層級維度。

### 知識網絡 (Connection)
- **關聯脈絡**：本筆記定義了精確查詢的技術原理，與 RAG 核心概念（K-AI-005）互補，共同構成 RAG×MCP 串接架構（K-AI-007）的雙底層。
- [[K-AI-004_RAG與MCP查詢模式差異]]
- [[K-AI-005_RAG資料庫核心概念]]
- [[K-AI-007_RAG×MCP技術串接架構]]

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
