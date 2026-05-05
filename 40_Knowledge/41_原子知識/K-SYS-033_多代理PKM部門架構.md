---
type: atomic
status: active
tags:
  - Multi-Agent
  - PKM
  - agent-architecture
  - MCP
  - orchestration
  - H3.0
time_created: 2026-04-28
time_modified: 2026-04-30
description: 多代理 PKM 部門架構 (Multi-Agent Organization)——定義 Navi Helios 系統內部的數位組織設計。將 AI 角色劃分為路由、檢索、記憶、綜合、觀察與反思六大部門，透過標準化通訊協議（MCP/ACP）與編排模式，實現知識從原始捕捉到長效資產化的「認知流水線」。
parent: K-SYS-智慧知識_MOC
related:
  - "[[K-SYS-032_PKM 框架整合地圖：多維知識治理 (Knowledge Framework Integration)]]"
  - "[[K-AI-004-M_Agent Protocol Architecture：代理協議架構 (Orchestration Framework)]]"
sources:
  - "[[SRC-MultiAgent-PKM-Research-2026-03-09]]"
used_in:
  - "[[K-AI-004-A_Recipe：AGENTS.md (Central Index Recipe)]]"
  - "[[K-AI-004-J_role-coordinator (Coordinator Role)]]"
contradictions: []
---

# 多代理 PKM 部門架構 — 構建主權個人的「數位參謀部」

> [!abstract] 核心洞見 (Insight)
> **代理不是助手，而是部門。** 多代理 PKM 部門架構的核心定位是系統的 **「組織架構圖」**。在處理複雜的個人發展與知識工程時，單一 AI 工具會因為上下文過載而導致「認知退化」。透過將職能拆解為獨立的部門（如檢索部、審計部、反思部），我們建立了一套 **「認知流水線 (Cognitive Pipeline)」**。部門之間透過標準化協議進行 **「任務手遞手 (Handoff)」**。**這不僅提升了執行的精確度，更讓 AI 具備了「長期記憶」與「自我進化」的物理結構。**

### 定義與機制 (What & How)

#### 三層結構架構 (The 3-Layer Stack)
- **L1：上下文織物層 (Context Fabric)**：處理對話記憶、身份偏好與臨時任務上下文。
- **L2：編排層 (Orchestrator)**：負責任務分解、角色指派與進度監控。系統的「中央處理器」。
- **L3：知識存儲層 (Knowledge Repository)**：物理存儲空間（PARA, Zettelkasten, Sources）。系統的「硬碟」。

#### 六大核心代理部門 (The 6-Agent Departments)

| 代理角色 | 所屬部門 | 核心職責 | 隔離原則 (Isolation) |
| :--- | :--- | :--- | :--- |
| **路由器 (Router)** | 規劃控制部 | 分類請求，決定啟動 PARA 執行鏈或卡片探索鏈。 | 不直接執行具體任務。 |
| **檢索代理 (Retrieval)** | 知識資源部 | 唯讀存取權威手冊、政策與歷史事實。 | **絕對無對話記憶**，確保客觀。 |
| **記憶經理 (Memory)** | 上下文管理部 | 維護長期事實與用戶偏好，過濾情緒雜訊。 | 跨對話視窗的持久化中樞。 |
| **綜合代理 (Synthesis)** | 執行輸出部 | 結合檢索事實+記憶+當前意圖，生成最終建議。 | 為用戶直接服務的交互介面。 |
| **觀察代理 (Observer)** | 質量審計部 | 後台異步運行，將每輪對話轉化為結構化觀察日誌。 | 不介入對話，僅負責記錄。 |
| **反思代理 (Reflector)** | 知識蒸餾部 | 壓縮陳舊日誌，提煉高密度洞見，回填至原子筆記。 | 定期批次執行，非即時觸發。 |

#### 通訊與編排協議
- **MCP (Model Context Protocol)**：代理訪問外部工具（Obsidian, Shell）的標準接口。
- **ACP (Agent Communication Protocol)**：部門間傳遞「任務手稿」與「狀態回報」的私有語言。
- **手遞手協議 (Handoff)**：代理切換時必須精確傳遞：`[任務狀態] + [關鍵上下文片段] + [用戶偏好標籤]`。

### 實踐與案例 (Action & Proof)
- **真實案例**：「每週系統覆盤」的自動化協同。
  - **背景**：用戶要求進行週覆盤。
  - **執行流程**：
    1. **路由器**指派任務給**反思代理**。
    2. **反思代理**向**觀察代理**調取過去 7 天的「異步觀察日誌」。
    3. 同時向**記憶經理**調取用戶的「H3.0 進化目標」。
    4. **綜合代理**將以上資訊縫合，產出一份直擊痛點的覆盤報告，並由**記憶經理**自動更新用戶的「下週優先級」。
  - **成果**：用戶無需手動翻閱聊天記錄，系統自動完成了從「數據」到「智慧」的躍遷。**多部門架構避免了上下文爆炸。**
- **行動指南**：
  1. **執行「角色隔離」**：在 Prompt 中明確禁止檢索代理進行「建議」，強制其僅回報事實。
  2. **強化「記憶對象」**：要求記憶經理將重要對話轉化為「YAML 對象」存入 `80-System/Memory/`，而非存為散亂的文字。

### 知識網絡 (Connection)
- **關聯脈絡**：本組織架構支撐著協調者角色（K-AI-004-J）的委派邏輯，並由代理協議架構（K-AI-004-M）提供底層保障。
- [[K-AI-004-J_role-coordinator (Coordinator Role)]]
- [[K-AI-004-M_Agent Protocol Architecture：代理協議架構 (Orchestration Framework)]]
- [[K-SYS-032_PKM 框架整合地圖：多維知識治理 (Knowledge Framework Integration)]]
- [[K-SYS-004_AI驅動知識湧現]]

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
