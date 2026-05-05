---
title: Arena 追蹤系統建構 - 研究發現
type: findings
status: draft
folder: 32_Active/Arena
time_created: '2026-04-14'
time_modified: '2026-04-14'
tags:
  - Arena
  - Life-OS
  - 追蹤系統
  - 研究發現
related: []
children: []
parent: []
---

# Arena 追蹤系統建構 - 研究發現

**日期**：2026-04-14
**狀態**：研究完成，等待整合至 task_plan.md

---

## 一、Arena 與 Life OS 的關係研究

### 1.1 Arena 是框架，Life OS 是工具

Arena 是一套人生轉變框架，包含：
- Stage 1：認識自己（四象限 + 價值觀 + 驅動力 + 障礙風險 + 技能探索）
- Stage 2：規劃目標（大目標 → 前置條件審核 → 階段拆解）
- Stage 3：策略規劃（路徑設計 → 資源盤點 → 行動計劃 → 季度計劃）
- Stage 4：迭代執行（PDCA → 階段調整 → 回 Stage 1）

Life OS 是 Arena 的系統化工具層，提供：
- Goal → Project → Task 的執行串聯
- Area 五宮格的人生維度平衡機制
- 主頁 Components 的視覺化控制塔
- OS-每日檢查/OS-每週覆盤的日常 Ritual

### 1.2 整合的關鍵原則

| 原則 | 說明 |
|------|------|
| Arena 為框架 | 所有追蹤都要服務 Arena 的進化目標 |
| Life OS 為工具 | 不改變 Life OS 結構，只連結 Arena 功能 |
| 數據流向一致 | 每日 → 每週 → 每季 → 每年的數據串聯 |
| 低門檻進場 | 追蹤不能成為負擔，必須有 Ritual 支援 |

---

## 二、進化追蹤機制研究

### 2.1 進化追蹤的核心價值

Arena 與 HUMAN 3.0 的最大差異是「持續追蹤」：

| 系統 | 性質 | 產出 |
|------|------|------|
| HUMAN 3.0 | 一次性評估 | 快照 |
| Arena | 持續追蹤 | 連續影片 |

進化追蹤讓 Arena 能做到：
1. **捕捉謊言**：嘴上說的重要 vs 實際做的
2. **識別模式**：重複出現的阻礙原因
3. **深化理解**：每次訪談都比上一次更了解你
4. **調整建議**：根據實際行為調整下次計劃

### 2.2 進化追蹤的數據來源

| 數據類型 | 來源 | 頻率 |
|----------|------|------|
| 維度分數 | HUMAN_3.0 評估報告 | 每30天 |
| 四象限能量 | OS-每日檢查 | 每天 |
| 任務完成率 | TaskNotes | 每週 |
| 專案進度 | Project MOC | 每季 |
| 障礙模式 | 每次訪談的障礙記錄 | 每30天 |

### 2.3 進化比較的三個維度

| 維度 | 比較內容 | 產出 |
|------|---------|------|
| 絕對比較 | 本次 vs 上次 | 分數/等級變化 |
| 相對比較 | 說的 vs 做的 | 完成率、差距 |
| 模式比較 | 這次 vs 過去幾次 | 趨勢、模式識別 |

---

## 三、日程追蹤研究

### 3.1 OS-每日檢查現況

現有 OS-每日檢查.md 包含：
- 能量校準（🟢/🟡/🔴/⚫）
- 今日 MIT
- HUMAN 3.0 象限選擇
- 晚間覆盤

### 3.2 需要新增的追蹤欄位

| 欄位 | 用途 | 格式 |
|------|------|------|
| 任務完成度 | 連結 TaskNotes | % |
| 能量趨勢 | 每週彙整 | ↑/→/↓ |
| MIT 完成率 | 衡量聚焦程度 | ✅/❌ |

### 3.3 Components 建議

建議在主頁 Components 新增「每日進化」面板：
- 今日能量分數
- 本週任務完成率
- 與上週比較趨勢

---

## 四、任務追蹤研究

### 4.1 TaskNotes 現況

TaskNotes 現有結構：
- tasks-default.base：預設任務視圖
- 已整合 life-os/task 標籤過濾

### 4.2 需要新增的連結

| 連結 | 指向 | 用途 |
|------|------|------|
| goalId | Goal MOC | 目標追蹤 |
| projectId | Project MOC | 專案追蹤 |
| areaId | Area MOC | 人生維度追蹤 |

### 4.3 每週覆盤的進化功能

現有 OS-每週覆盤.md 需要新增：
- 上週 vs 本週進化比較表
- 任務完成率趨勢
- 障礙模式識別摘要

---

## 五、專案追蹤研究

### 5.1 Project MOC 現況

Project MOC 已建立，包含：
- 專案狀態追蹤
- 與 Goal 的連結（goalId）
- 進度追蹤

### 5.2 季度追蹤的新增需求

112_季度計劃模板 已建立，包含：
- 季度目標設定
- 季度資源配置
- 季度里程碑（Q1-Q4）
- 季度回顧與進化比較

### 5.3 需要連結的數據

| 數據 | 來源 | 連結方式 |
|------|------|---------|
| 四維度分數 | HUMAN_3.0 報告 | 手動填入 |
| 任務完成率 | TaskNotes Dataview | Dataview 查詢 |
| 障礙模式 | 進化追蹤報告 | 引用 |

---

## 六、Components 整合研究

### 6.1 主頁 Components 現況

主頁 Components 已建構：
- Area 五宮格
- Goals 追蹤
- 本週 MITs
- dateProgress × 5
- Countdown × 3

### 6.2 需要新增的 Components

| Component | 內容 | 優先級 |
|-----------|------|--------|
| 進化追蹤面板 | 四維度進化趨勢圖 | 高 |
| 任務完成率面板 | 每週任務數據 | 中 |
| 季度進度面板 | 季度里程碑追蹤 | 中 |
| 能量趨勢面板 | 每週能量數據 | 低 |

### 6.3 Dataview 查詢優化建議

```dataview
-- 每週任務完成率
TABLE WITHOUT ID file.link AS 任務, status, 完成度, projectId
FROM "TaskNotes"
WHERE contains(tags, "life-os/task") AND date(time_create) >= date(today) - 7
SORT status ASC

-- 四維度進化趨勢（需要手動維護）
TABLE WITHOUT ID date, Mind, Body, Spirit, Vocation
FROM "20_Life_Planning/HUMAN_3.0_評估報告_模板"
WHERE type = "evaluation"
SORT date ASC
```

---

## 七、風險評估

### 7.1 數據過載風險

**風險**：追蹤過多數據，用戶感到負擔
**應對**：
- 只追蹤影響決策的關鍵指標
- 設計「一頁總覽」功能
- 設定追蹤上限

### 7.2 系統複雜度風險

**風險**：Arena 與 Life OS 重疊，系統過於複雜
**應對**：
- 明確 Arena 是框架，Life OS 是工具
- 不改變 Life OS 結構
- 專注在連結而非新建

### 7.3 使用者堅持度風險

**風險**：追蹤系統成為壓力，用戶放棄使用
**應對**：
- 設計「最低可行追蹤」（每週5分鐘）
- 預設 Ritual 降低進入門檻
- 正向回饋機制（進化可視化）

---

## 八、相關檔案索引

| 檔案 | 路徑 | 說明 |
|------|------|------|
| 090_AI訪談流程 | Arena框架/ | 訪談流程，含價值觀/驅動力/障礙 |
| 096_技能探索訪談 | Arena框架/ | Stage 2 技能探索 |
| 110_行動計劃模板 | Arena框架/ | 30天行動計劃 |
| 112_季度計劃模板 | Arena框架/ | 季度計劃（新建）|
| HUMAN_3.0_評估報告_模板 | 20_Life_Planning/ | 進化追蹤報告（已更新）|
| OS-每日檢查 | 80-System/81-Template/ | 每日追蹤 |
| OS-每週覆盤 | 80-System/81-Template/ | 每週覆盤 |
| Area_MOC | 20_Life_Planning/22_Area/ | Area 平衡追蹤 |
| Goal_MOC | 20_Life_Planning/23_Goal/ | 目標追蹤 |
| Project_MOC | 30_Projects/ | 專案追蹤 |
| 主頁.components | 80-System/82-components/view/ | 視覺化控制塔 |

---

*研究完成者：Larvis*
*日期：2026-04-14*
*版本：v1.0*
