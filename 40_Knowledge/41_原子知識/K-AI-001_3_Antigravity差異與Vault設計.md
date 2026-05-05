---
type: framework
status: active
tags:
  - AI
  - Antigravity
  - MCP
  - RAG
  - system-design
  - H3.0
time_created: 2026-04-10
time_modified: 2026-04-30
description: Antigravity vs MCP：能力邊界與 Vault 設計 (Capability Boundaries)——解析「增強檢索 (RAG)」與「工具調用 (Tool-Calling/MCP)」在本質上的差異。並以此為基礎，定義一套適配 AI 原生操作的 Obsidian Vault 結構，實現從 Personal Knowledge 到 Personal OS 的躍遷。
parent: K-AI_人工智慧系統_MOC
related: []
sources:
  - "[[Antigravity Developer Documentation]]"
used_in:
  - "[[K-AI-001-1_MCP 基礎概念 (MCP Fundamentals)]]"
  - "[[K-SYS-032_PKM框架整合地圖]]"
contradictions: []
---

# Antigravity vs MCP — 從「讀取知識」到「重構現實」的權力邊界

> [!abstract] 核心洞見 (Insight)
> **RAG 是「博覽群書的書生」，MCP 是「手握重權的將軍」。** Antigravity（作為代理）與 MCP 的核心差異在於 **「寫入權限 (Write Access)」** 與 **「執行能力 (Actionability)」**。傳統的 RAG (檢索增強生成) 僅能將你的 Vault 作為參考資料（你問，它答）；而整合了 MCP/Antigravity 工具集的代理，能直接在你的物理現實（文件、代碼、終端）中留下痕跡（你說，它做）。**超級個體的目標，是將 Vault 從一個「靜態博物館」重構為一個「AI 原生控制台」。**

### 定義與機制 (What & How)

#### 能力維度對比 (The Dimensional Shift)

| 維度 | 傳統 RAG (如 Smart Connections) | Antigravity / MCP 代理 |
| :--- | :--- | :--- |
| **本質** | 語義搜尋 + 總結 | 意圖識別 + 工具調用 |
| **角色** | 增強型搜尋引擎 | 自主行動代理 (Agent) |
| **讀寫權限** | 唯讀 (Read Only) | **讀寫並行 (Read & Write)** |
| **反饋閉環** | 被動回答後結束 | 主動修改、運行、修復、反饋 |
| **核心目標** | 消除「遺忘」 | 消除「摩擦」與「勞動」 |

#### AI-Native Vault 設計原則
為了讓 AI 能高效「理解」並「操作」知識庫，Vault 結構必須從「主題導向」轉向「功能與狀態導向」：
1. **`/80-System` (系統層)**：定義人生操作系統（Life OS）的底層協議與 MOC。AI 的 **「說明書」**。
2. **`/40-Knowledge` (原子層)**：標準化的原子知識塊。AI 的 **「長期記憶」**。
3. **`/20-Project` (執行層)**：正在進行的具體任務。AI 的 **「當前工作空間」**。
4. **`/00-Inbox` (快取層)**：待處理的碎片與自動採集。AI 的 **「輸入端」**。

### 實踐與案例 (Action & Proof)
- **真實案例**：針對「個人獲利模式 (BMY)」的深度處理。
  - **場景 A (RAG)**：用戶問：「我筆記裡關於 BMY 的定義是什麼？」AI 檢索並回答。任務結束。
  - **場景 B (Antigravity/MCP)**：用戶說：「分析我目前的『兔子食品』專案，對照 BMY 框架找出 3 個缺失要素，並直接在專案目錄下生成一份《優化建議書.md》。」
  - **執行過程**：AI 讀取 BMY 筆記 -> 讀取專案文件 -> 進行推理 -> **調用 `write_to_file` 工具** -> 用戶確認 -> 物理生成文件。
  - **成果**：用戶省去了 1 小時的寫作時間。他明白：**「我不僅要 AI 知道我的想法，我要 AI 直接替我封裝我的想法。」**
- **行動指南**：
  1. **建立 `/90-Agent` 目錄**：存放你專屬的系統指令 (System Prompts)，讓 AI 在進入你的 Vault 時知道自己的角色。
  2. **執行「自動化標準化」**：讓 AI 掃描一個舊文件目錄，並要求它「將所有內容按新模板轉換並存入 `/40-Knowledge`」。

### 知識網絡 (Connection)
- **關聯脈絡**：本比較界定了 MCP 系列（K-AI-001）的實踐邊界，引導至 Agentic Workflow（K-AI-005），並指導 PKM 框架的重構（K-SYS-032）。
- [[K-AI-001-1_MCP 基礎概念 (MCP Fundamentals)]]
- [[K-AI-001-2_MCP + Obsidian 運作架構 (MCP-Obsidian Architecture)]]
- [[K-AI-005_Agentic Workflow (代理工作流)]]
- [[K-SYS-032_PKM框架整合地圖]]

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
