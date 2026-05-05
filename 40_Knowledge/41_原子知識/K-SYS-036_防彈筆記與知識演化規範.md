---
type: atomic
status: active
tags:
  - PKM
  - bulletproof-notes
  - Esor-Huang
  - knowledge-evolution
  - execution-driven
  - H3.0
time_created: 2026-04-30
time_modified: 2026-04-30
description: 防彈筆記與知識演化規範 (Bulletproof Notes & Evolution)——定義 Navi Helios 系統的「執行即整理」工作流。結合 Esor Huang 的防彈筆記法，確立任務導向的 PAA 結構（Project, Action, Archive），並建立從討論記錄（Inbox）向原子知識（Atomic）演化的「蒸餾流水線」。確保系統知識隨任務執行同步成長，實現「行動產生知識，知識指導行動」的閉環演進。
parent: K-SYS-智慧知識_MOC
related:
  - "[[K-SYS-032_PKM 框架整合地圖：多維知識治理 (Knowledge Framework Integration)]]"
  - "[[K-SYS-035_Hub 概念與系統定位：中央調度中樞 (System Hub & Spoke Architecture)]]"
sources:
  - "[[電腦玩物站長 Esor - 防彈筆記法實戰總集]]"
used_in:
  - "[[K-AI-004-K_Atomization Protocol：原子化拆解協議 (Knowledge Atomization)]]"
  - "[[K-AI-004-H_Role：系統架構員 (System Architect Role)]]"
contradictions: []
---

# 防彈筆記與知識演化規範 — 實現「執行即整理」的知識代謝

> [!abstract] 核心洞見 (Insight)
> **筆記不是倉庫，是行動的副產品。** 防彈筆記與知識演化規範的核心定位是系統的 **「生產線管理手冊」**。傳統整理法試圖在執行之外尋找時間整理，這往往導致「收藏家謬誤」。本規範主張 **「整理發生在執行時 (Organize while doing)」**。我們將每一場討論、每一個專案視為一個 **「任務筆記 (Project Note)」**，在其執行過程中同步記錄洞見與決策。當任務結束，透過 **「蒸餾流水線 (Distillation Pipeline)」** 將精華自動沉澱為長效的原子知識。**系統的生命力，取決於其將「過程記錄」轉化為「特定知識」的代謝速率。**

### 定義與機制 (What & How)

#### 防彈筆記核心哲學 (The Bulletproof Principles)
1. **記錄驅動目標**：不在想像中規劃，而是在實際活動中透過記錄（及時記下）與反思（碰撞舊內容）來動態微調任務指引。
2. **執行邏輯 = 整理邏輯**：資料放在哪個分類不重要，放在 **「哪個任務的哪個步驟」** 使用才是關鍵。
3. **PAA 結構優化**：
    - **P (Project)**：任務筆記。一個任務一則筆記，作為所有資訊的臨時交匯點。
    - **A (Action)**：行動流程。筆記內部按執行步驟排序。
    - **A (Archive)**：封存。任務結束後移出視線。

#### 知識演化管道 (The Evolution Pipeline)
資訊在系統中經歷以下代謝過程：
1. **捕捉 (Capture)** ⮕ 外部資訊進入 `10_Inbox` (討論記錄/臨時筆記)。
2. **審核 (Audit)** ⮕ 對 Inbox 記錄執行「蒸餾審查清單」。
3. **蒸餾 (Distill)** ⮕ 將共識內容轉化為原子筆記（Atomic Pages）。
4. **回填 (Refill)** ⮕ 更新 `time_modified` 與 WikiLinks，建立雙向關聯。

#### 蒸餾審查清單 (Distillation Checklist)
在任務結束或討論告一段落時，問以下問題：
- **是否有新的系統行為定義？** ⮕ 蒸餾至對應角色或協議筆記。
- **是否修正了既有概念？** ⮕ 更新舊有原子筆記，標註更新日期。
- **是否產生了新的待辦/待確認？** ⮕ 留在記錄中，直至轉化為共識。

#### 原子筆記更新原則 (Update Protocols)
- **擴展而非覆蓋**：新共識應以追加方式寫入，並標註 `(YYYY-MM-DD 討論更新)`，保留演化軌跡。
- **維持原子約束**：若共識範圍過大，應先拆分出新的原子筆記，而非無限膨脹單一頁面。

### 實踐與案例 (Action & Proof)
- **真實案例**：「H3.0 系列標準化」專案中的實時演化。
  - **背景**：Navi 在對話中與用戶討論了 17 個 Prompt 系列模組。
  - **執行機制 (PAA)**：
    - **P (Project)**：對話當下即是任務。所有的共識直接在對話中形成。
    - **A (Action)**：每達成一個模組的共識，AI 立即執行 `write_to_file` 標準化該原子筆記（蒸餾）。
    - **A (Archive)**：當全系列 17 個筆記完成更新，對話記錄被標記為「已處理」並移至封存區。
  - **成果**：**零額外整理成本。** 當對話結束時，系統已經完成了「從討論到資產」的完整轉換。**這就是「防彈」的本質：在行動中完成結構化。**
- **行動指南**：
  1. **拒絕無效分類**：當你產生一個新想法時，不要問「它屬於哪個領域」，問「它能推動哪個專案」。
  2. **執行「週日蒸餾任務」**：每週日由系統架構員代理（K-AI-004-H）掃描 Inbox，強制執行未完成的蒸餾動作，保持 Hub 的清空。

### 知識網絡 (Connection)
- **關聯脈絡**：本規範指導原子化協議（K-AI-004-K）的實際執行，受系統架構員（K-AI-004-H）監督，並為 PKM 整合地圖（K-SYS-032）提供動力。
- [[K-AI-004-K_Atomization Protocol：原子化拆解協議 (Knowledge Atomization)]]
- [[K-AI-004-H_Role：系統架構員 (System Architect Role)]]
- [[K-SYS-032_PKM 框架整合地圖：多維知識治理 (Knowledge Framework Integration)]]
- [[K-SYS-035_Hub 概念與系統定位：中央調度中樞 (System Hub & Spoke Architecture)]]

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
