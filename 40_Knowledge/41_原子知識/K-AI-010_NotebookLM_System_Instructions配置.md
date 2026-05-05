---
type: atomic
status: active
tags:
  - AI
  - NotebookLM
  - Prompt
  - H3.0
time_created: 2026-04-30
time_modified: 2026-04-30
description: NotebookLM System Instructions 的配置方法與配置維度，實現對 AI 輸出品質的精確掌控。
parent: K-AI-004-0_Prompt-System-MOC
related: []
sources: []
used_in: []
contradictions: []
---

# NotebookLM System Instructions 配置方法

> [!abstract] 核心洞見 (Insight)
> NotebookLM 的系統指令 (System Instructions) 是控制「數位分身」行為的最高準則。憑藉其支援高達 10,000 字元的超大容量，用戶可以為其注入極其詳盡的角色背景、決策邏輯與風格禁令，從而將 AI 從單純的「回答者」轉變為具備「領域專家思維」的專屬智囊。

### 定義與機制 (What & How)

#### 核心配置維度
為了最大化發揮 NotebookLM 的檢索與推理能力，系統指令應覆蓋以下三個關鍵維度：

| 維度 | 核心職責 | 關鍵要素 |
|------|----------|----------|
| **角色定義 (Identity)** | 確立 AI 的「思考基底」。 | 專業領域（如：產品經理）、性格特色、第一性原理。 |
| **任務目標 (Objective)** | 明確 AI 的「主要工作」。 | 提取洞見、交叉比對、矛盾識別、行動建議。 |
| **風格與限制 (Constraint)** | 定義輸出物的「最終形態」。 | 指定語言（繁體中文）、輸出格式（Markdown 表格）、語氣禁忌。 |

#### 注入邏輯
- **高 Context 密度**：利用長字數優勢，將 `SOUL.md` 或 `K-AI-004` 中的核心邏輯直接移植。
- **動態引導**：在指令中加入：「如果來源中沒有答案，請根據我的歷史立場進行推理，但必須註明這屬於推理而非原始事實。」

### 實踐與案例 (Action & Proof)
- **真實案例**：在處理「跨領域商業研究」時，用戶為 NotebookLM 配置了「批判性思維師」的角色，並在指令中明確要求：「**強制搜尋**來源中關於『潛在風險』的描述，若資料源中未提及，請主動提出 3 個基於行業常識的質疑。」這使得 AI 的回答從「平淡的摘要」轉變為「具備對抗性的決策分析」。
- **行動指南**：
  1. **指令分層**：將指令分為「身份層」、「邏輯層」、「格式層」，用標題號分隔以利 AI 解析。
  2. **遞歸優化**：每當 AI 產出不理想的回應時，將錯誤點反向寫入指令的「限制」區塊中。

### 知識網絡 (Connection)
- **關聯脈絡**：本配置方法是 NotebookLM 運作的靈魂，與 Master Notebook（K-AI-009）結合提供內容基礎，並受 Prompt Taxonomy（K-AI-004-1）的結構規範影響。
- [[K-AI-009_NotebookLM_Master_Notebook]]
- [[K-AI-004-1_prompt-taxonomy]]
- [[K-AI-011_NotebookLM來源合併技巧]]

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
