---
type: atomic
status: active
tags:
  - AI
  - NotebookLM
  - 技巧
  - H3.0
time_created: 2026-04-30
time_modified: 2026-04-30
description: 突破 NotebookLM 50 個來源限制的實戰技巧，包含文件合併與進階上傳方法。
parent: K-AI-004-0_Prompt-System-MOC
related: []
sources: []
used_in: []
contradictions: []
---

# NotebookLM 來源合併技巧

> [!abstract] 核心洞見 (Insight)
> NotebookLM 的 50 個來源上限是「文件數量」而非「字數」限制。透過結構化合併與間接上傳路徑，用戶可以突破實體檔案數量的桎梏，將數百篇原子筆記整合進單一筆記本，實現更高密度的知識關聯與檢索效率。

### 定義與機制 (What & How)

#### 核心挑戰
NotebookLM 每個筆記本最多僅能存放 50 個獨立來源（Source）。對於具備數百篇原子筆記的 Navi Helios 系統來說，直接導入會造成資訊碎片化，且部分來源因字數過少（如低於 500 字）而導致 AI 解析權重不足。

#### 突破限制的方法

##### 1. 結構化合併 (Structural Merging)
- **邏輯**：將同一主題（如：某個 MOC 下的所有筆記）合併為一個大型的 `.md` 或 `.pdf` 文件。
- **工具**：利用 Python 腳本或 Shell 指令執行 `cat *.md > consolidated_knowledge.md`。
- **優點**：AI 能在單一 Context 內建立更強的長程連結。

##### 2. 間接上傳繞過 (Indirect Upload)
- **場景**：直接上傳圖像常因「包含人臉」或「內容審核」被退回。
- **技巧**：將資訊先貼入 Google Doc 並添加解釋文字，再從雲端硬碟匯入 NotebookLM。此法可有效降低審核機制對非敏感圖像的誤殺。

### 實踐與案例 (Action & Proof)
- **真實案例**：在進行「2025 全年交易紀錄回顧」時，用戶原本擁有 200 份每日小結。若分開上傳，至少需建立 4 個筆記本，且無法跨筆記本比對。透過使用 Python 腳本將其按季度合併為 4 個大型檔案，成功在單一筆記本內實現了全年度的盈虧趨勢分析與情緒關聯。
- **行動指南**：
  1. **維持標題號**：合併時確保保留原始筆記的標題與 WikiLink，方便 AI 在回答中回溯原始出處。
  2. **檔案命名**：合併後的檔案應命名為 `[主題]_Consolidated_YYYYMMDD` 以利版本管理。

### 知識網絡 (Connection)
- **關聯脈絡**：本技巧為 Master Notebook（K-AI-009）的建構提供了物理路徑的優化，並為聯動工作流（K-AI-012）提供高密度的資料基礎。
- [[K-AI-009_NotebookLM_Master_Notebook]]
- [[K-AI-010_NotebookLM_System_Instructions配置]]
- [[K-AI-012_NotebookLM×Gemini聯動工作流]]

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
