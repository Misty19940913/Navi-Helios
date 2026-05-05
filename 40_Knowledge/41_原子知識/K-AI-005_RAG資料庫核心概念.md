---
type: atomic
status: active
tags:
  - AI
  - RAG
  - 知識管理
  - H3.0
time_created: 2026-04-30
time_modified: 2026-04-30
description: RAG（檢索增強生成）的核心概念，包含向量資料庫運作原理與語義搜尋技術棧。
parent: K-AI-004-0_Prompt-System-MOC
related: []
sources: []
used_in: []
contradictions: []
---

# RAG 資料庫核心概念

> [!abstract] 核心洞見 (Insight)
> RAG（Retrieval-Augmented Generation）是讓 AI 具備「外部長期記憶」的技術框架。它透過將本地知識向量化，實現了超越關鍵字匹配的「語義搜尋」，讓 AI 能夠基於用戶的歷史沉澱進行精確回答，解決了 LLM 幻覺與知識滯後問題。

### 定義與機制 (What & How)

#### 核心價值
**語義搜尋 + 啟發式知識生成**。RAG 不只是找資料，而是將找到的相關片段作為上下文餵給 LLM，產出具備事實根據的回答。

#### 運作流程
1. **輸入 (Query)**：使用者輸入問題（如：「我對『具身認知』的看法有何演變？」）。
2. **向量化 (Embedding)**：系統將問題轉換為數學向量。
3. **檢索 (Retrieval)**：向量資料庫以相似度演算法（如 Cosine Similarity）找出最相關的 3-5 段筆記片段。
4. **生成 (Generation)**：將檢索到的片段作為 Context 併入 Prompt，由 LLM 生成最終回答。

#### 技術與儲存
- **向量資料庫 (Vector DB)**：專門儲存文本 Embedding 的資料庫（如：Qdrant, Chroma）。
- **特點**：
  - 支援「概念匹配」：即使沒出現關鍵字，只要語義相近也能被搜尋到。
  - 隨資料增長進化：語料庫越豐富，AI 的回答越具備個人特色。

#### H3.0 技術棧推薦
| 元件 | 推薦工具 | 職責 |
|------|----------|------|
| **來源層** | Obsidian | 提供原始 Markdown 筆記。 |
| **管道層** | n8n | 處理資料切片 (Chunking) 與自動化同步。 |
| **模型層** | Ollama / Gemini | 執行 Embedding 生成與文本回答。 |
| **儲存層** | Qdrant | 執行高速向量比對與儲存。 |

### 實踐與案例 (Action & Proof)
- **真實案例**：當用戶詢問「我去年關於『反脆弱』的筆記有哪些？」時，RAG 能跳過標題不含該詞但內容相關的筆記（如關於「波動獲益」的隨筆），並整合出一份包含時序變化的總結報告，實現了跨年度的知識喚醒。
- **行動指南**：
  1. **優化切片**：確保筆記原子化（K-AI-004-K），過長的筆記會導致 Embedding 向量偏移，降低檢索精度。
  2. **混合檢索**：建議結合 MCP 的標籤過濾（K-AI-004_RAG與MCP查詢模式差異），先縮小範圍再進行語義比對。

### 知識網絡 (Connection)
- **關聯脈絡**：本筆記定義了檢索的技術原理，與 MCP 核心概念（K-AI-006）互補，並在 RAG×MCP 串接架構（K-AI-007）中實現工程化落地。
- [[K-AI-004_RAG與MCP查詢模式差異]]
- [[K-AI-006_MCP資料庫核心概念]]
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
