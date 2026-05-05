---
type: atomic
status: active
tags:
  - AI
  - RAG
  - MCP
  - n8n
  - 自動化
  - H3.0
time_created: 2026-04-30
time_modified: 2026-04-30
description: n8n + Ollama + Qdrant 串接 RAG 與 MCP 的技術架構與工作流，實現語義理解與結構化回饋。
parent: K-AI-004-0_Prompt-System-MOC
related: []
sources: []
used_in: []
contradictions: []
---

# RAG × MCP 技術串接架構

> [!abstract] 核心洞見 (Insight)
> RAG 與 MCP 的串接是個人知識作業系統的「閉環路徑」。RAG 負責處理「非結構化語義」的理解與提取，MCP 提供「結構化元資料」的定位與更新。兩者結合，使系統不僅能回答「我想過什麼」，更能主動發問「我該為此做什麼」。

### 定義與機制 (What & How)

#### 技術棧 (H3.0 Stack)
| 技術 | 核心職責 | 角色屬性 |
|------|----------|----------|
| **Obsidian** | 作為資料源（MCP 儲存）與最終交互介面。 | 展示與編輯層。 |
| **n8n** | 負責資料流轉、Trigger 偵測與 API 調度。 | 邏輯調度層。 |
| **Ollama** | 執行本地語義分析、分類與內容生成。 | 認知計算層。 |
| **Qdrant** | 儲存向量資料，並執行混合檢索（Vector + Metadata）。 | 儲存檢索層。 |

#### 標準三步工作流

##### 1. 資料統整 (Ingestion)
- **切片注入**：利用 n8n 將 `.md` 檔案進行原子化切片，並將 YAML 屬性（如 tags, status）作為附加 Metadata 寫入 Qdrant。
- **混合索引**：確保每筆向量不僅包含正文，還具備可供 MCP 過濾的結構化標籤。

##### 2. 意圖解析 (Intent Mapping)
- **模糊轉精確**：當收到問題（如：「找找我去年寫過但沒執行的靈感」）時，Ollama 解析出搜尋意圖：
  - `Vector Search`: "靈感", "未執行"。
  - `Metadata Filter`: `type: inspiration` AND `status: seed` AND `time_created < 2025-01-01`。

##### 3. 智能回饋 (Response Loop)
- **上下文合成**：RAG 回傳最相關的片段，並包含其 YAML Context。
- **行動建議**：AI 產出回答並附加行動按鈕（如：「發現一條關於『AI 工作流』的舊靈感，是否立即開啟 310 專案規劃？」）。

#### 進階演進：主動推播 (Proactive Reflection)
- **遺忘偵測**：系統每週自動掃描 RAG 資料庫，找出與當前熱門標籤相關、但已超過 3 個月未被引用的舊筆記，並推送「舊識喚醒」摘要。
- **自動狀態更新**：當 RAG 發現某個概念已在多個新專案中被實踐，可主動建議修改原始 MCP 筆記的 `status`。

### 實踐與案例 (Action & Proof)
- **真實案例**：在處理「跨年覆盤」時，RAG×MCP 聯動系統自動調取了所有 `status: seed` 的靈感筆記，並與當年度已完成的 `status: completed` 專案進行比對。它成功發現了 3 個原本被判定為「失敗」的點子，實際上已在另一個專案中以不同形式「隱性成功」，從而修正了用戶對自我的負面偏差。
- **行動指南**：
  1. **元資料一致性**：在 n8n 寫入 Qdrant 前，強制執行 YAML 格式校準，防止因欄位命名不一導致的過濾失效。
  2. **混合評分**：將語義相似度與 MCP 定義的「權重（score）」相乘，實現更精確的「價值優先檢索」。

### 知識網絡 (Connection)
- **關聯脈絡**：本架構是 RAG（K-AI-005）與 MCP（K-AI-006）的工程實踐層，受查詢模式差異（K-AI-004_RAG與MCP查詢模式差異）的邏輯指導。
- [[K-AI-004_RAG與MCP查詢模式差異]]
- [[K-AI-005_RAG資料庫核心概念]]
- [[K-AI-006_MCP資料庫核心概念]]

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
