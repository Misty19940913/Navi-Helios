---
title: 人生 OS 使用手冊
type: system-doc
status: active
time_created: 2026-04-09
time_modified: 2026-04-27
version: 2.0
tags:
  - life-os
folder: resource
description: 人生 OS 完整操作指南（純 OS 版本）
parent: []
children: []
related: []
---

# 人生 OS 使用手冊 v2.0（純 OS 版）

> 你的第二大脑操作指南
> 適用版本：Navi Helios + Obsidian + Components 插件
> 最後更新：2026-04-27

---

## 📋 目錄

1. [系統概述](#1-系統概述)
2. [Goal → Project → Task 核心理念](#2-goal--project--task-核心理念)
3. [Area 五宮格](#3-area-五宮格)
4. [每日日記（Daily）](#4-每日日記daily)
5. [每週覆盤](#5-每週覆盤)
6. [主頁控制塔](#6-主頁控制塔)
7. [模板總覽](#7-模板總覽)
8. [常見問題](#8-常見問題)

---

## 1. 系統概述

### 1.1 什麼是人生 OS？

人生 OS 是一套建立在 Obsidian 上的**個人作業系統**，幫助你：

- 追蹤目標（Goal）
- 管理專案（Project）
- 執行任務（Task）
- 平衡人生五大領域（Area）
- 記錄時間與能量（日記）

想像一下：如果你的手機需要一個作業系統才能運作，那麼管理你的人生也同樣需要一套系統。人生 OS 就是你在 Obsidian 裡的「人生管理作業系統」。

### 1.2 系統特色

| 特色 | 說明 |
|------|------|
| **三層串聯** | Goal → Project → Task 自動連結，每個行動都能回溯源頭 |
| **五宮格 Area** | 視覺化人生五大領域，確保生活平衡 |
| **視覺化儀表板** | 首頁即時顯示所有數據，一目了然 |
| **Dataview 動態查詢** | 資料自動更新，無需手動維護統計數字 |
| **模板化流程** | 每日檢查、每週覆盤，全部有現成模板 |
| **框架嫁接** | 任何進化/提升框架都可以嫁接在 Life OS 上執行，系統不綁定特定框架 |
| **Area 平衡機制** | 確保你不會只埋頭工作而忽略健康與關係 |

### 1.3 前置需求

在開始使用人生 OS 之前，請確認你的環境已準備妥當：

| 項目 | 需求 |
|------|------|
| **Obsidian 版本** | 1.12 或更高版本 |
| **必裝插件** | Dataview、Tasks、Components、Templater（可選） |
| **檔案存放位置** | OneDrive（Windows WSL2 環境） |
| **裝置** | 建議桌上型電腦或平板，鍵盤操作更有效率 |

### 1.4 系統安裝檢查清單

如果你剛開始架設系統，逐項確認以下內容：

- [ ] Obsidian 已下載並安裝
- [ ] Vault 已連結到 OneDrive 同步資料夾
- [ ] Dataview 插件已啟用
- [ ] Tasks 插件已啟用
- [ ] Components 插件已啟用
- [ ] 所有資料夾結構已依據 1.5 節建立
- [ ] 模板檔案已放置到 `80-System/81-Template/` 目錄

### 1.5 資料夾結構

以下是你應該建立的完整資料夾架構。建議用 VS Code 或檔案總管一口氣建立完畢：

```
20_Life_Planning/
├── 21_Journal/                 ← 日記存放處
│   └── YYYY-MM-DD.md            ← 每日日記（自動產出）
├── 22_Area/                     ← 人生領域
│   ├── Area_MOC.md             ← Area 總覽頁
│   ├── 職業發展.md
│   ├── 財務自由.md
│   ├── 身心健康.md
│   ├── 關係家庭.md
│   └── 自我成長.md
├── 23_Goal/                     ← 目標管理
│   ├── Goal_MOC.md             ← Goal 總覽頁
│   └── 2026-Q2-季度目標.md     ← 具體目標
└── 30天整合行動計劃_YYYYMMDD.md

30_Projects/
├── Project_MOC.md              ← 專案總覽頁
├── 31_Planning/                ← 規劃中的專案
├── 32_Active/                  ← 執行中的專案
├── 33_Done/                     ← 已完成的專案
├── 34_On-hold/                  ← 暫停的專案
└── 35_Cancelled/                ← 已取消的專案

TaskNotes/
├── Views/                      ← 任務視圖
│   └── tasks-default.base     ← 預設任務視圖
└── ...                         ← 各任務檔案

80-System/
├── 81-Template/                ← 系統模板
│   ├── OS-每日檢查.md         ← 每日使用
│   ├── OS-每週覆盤.md         ← 每週使用
│   ├── 項目模板.md            ← 專案模板
│   ├── 任務模板.md            ← 任務模板
│   └── Daily.md               ← 完整日記模板
└── 82-components/
    └── view/
        └── 主頁.components     ← 儀表板設定

10_Inbox/                       ← 收件匣（靈感 capture）
```

### 1.6 資料流向說明

```
靈感 capture 到 10_Inbox
        ↓
判斷：這是任務？專案？還是目標？
        ↓
如果是 Task → 歸入 TaskNotes，連結到 Project
如果是 Project → 歸入 30_Projects，連結到 Goal
如果是 Goal → 歸入 23_Goal
        ↓
所有進度自動匯總到 MOC 頁面（Goal MOC、Project MOC）
        ↓
主頁儀表板讀取所有 MOC，即時顯示全貌
```

### 1.7 標籤系統

| 標籤 | 含義 |
|------|------|
| `#life-os` | Life OS 系統主要標籤，所有系統筆記都應該有 |
| `#life-os/goal` | Goal（目標）筆記 |
| `#life-os/area` | Area（人生領域）筆記 |
| `#life-os/project` | Project（專案）筆記 |
| `#life-os/task` | Task（任務）筆記 |
| `#life-os/os-template` | OS 系統模板 |

### 1.8 如何為新筆記添加標籤

在筆記的 YAML frontmatter 中新增 `tags` 陣列：

```yaml
---
title: 我的新目標
type: goal
status: active
tags:
  - life-os
  - life-os/goal
---
```

> **重要**：所有新建的 Goal、Project、Area、Task 筆記，都請記得加上對應的 `#life-os` 家族標籤，這樣才會出現在系統查詢結果中。

### 1.9 快速索引（Dataview）

#### 所有 Life OS 筆記

```dataview
TABLE WITHOUT ID file.link AS 筆記, type AS 類型, status AS 狀態
FROM ""
WHERE contains(tags, "life-os")
SORT file.path ASC
```

#### Goals（目標）

```dataview
TABLE WITHOUT ID file.link AS 目標, status AS 狀態, 截止日期 AS 截止, 象限 AS 象限
FROM "20_Life_Planning/23_Goal"
WHERE contains(tags, "life-os/goal")
SORT 截止日期 ASC
```

#### Areas（人生領域）

```dataview
TABLE WITHOUT ID file.link AS 領域, 象限 AS 象限, status AS 狀態
FROM "20_Life_Planning/22_Area"
WHERE contains(tags, "life-os/area")
SORT 象限 ASC
```

#### Projects（專案）

```dataview
TABLE WITHOUT ID file.link AS 專案, status AS 狀態, 進度 AS 進度%, goalId AS 所屬Goal
FROM "30_Projects"
WHERE contains(tags, "life-os/project")
SORT status ASC
```

#### OS 模板

```dataview
TABLE WITHOUT ID file.link AS 模板, type AS 類型
FROM "80-System/81-Template"
WHERE contains(tags, "life-os/os-template")
SORT file.name ASC
```

---

## 2. Goal → Project → Task 核心理念

### 2.1 三層結構說明

人生 OS 的核心是**單向催生關係**——上層催生下層，下層支撐上層：

```
Goal（目標）
   │
   │  ← 由 Goal 催生，一個 Goal 可以有多個 Projects
   │     Goal 是「我想去哪裡」
   ▼
Project（專案）
   │
   │  ← 由 Project 催生，一個 Project 可以有多個 Tasks
   │     Project 是「我要做什麼來到達那裡」
   ▼
Task（任務）
   │
      Task 是「我具體要執行的原子行動」
```

**用旅遊來比喻：**

- **Goal** = 你想去日本（目的地）
- **Project** = 規劃行程、訂機票、辦護照、換日幣（專案）
- **Task** = 今天打電話給航空公司、明天上網訂房、後天去銀行換日幣（任務）

你**不會**跳過 Project 直接做 Task（那樣會失去方向），也不會跳過 Goal 直接做 Project（那樣不知道為什麼要做）。

### 2.2 為什麼要這樣設計？

**問題一：避免遺忘為什麼而做**

當你埋頭處理日常任務時，時常會迷失——「我到底在忙什麼？」有了 Goal → Project → Task 串聯，你可以隨時往上回溯：

> Task（寫週報）→ Project（建立客戶管理系統）→ Goal（提升客戶滿意度）

原來寫週報不是純粹行政負擔，而是改善客戶關係的一環。

**問題二：進度透明**

當老闆問「這個 Goal 做到哪了？」你不需要猜測。開啟 Project MOC，自動計算所有 Tasks 的完成率，進度百分比一目了然。

**問題三：優先順序自動校準**

不是所有 Task 生來平等。一個連結到 Q2 最重要 Goal 的 Task，應該比一個連結到明年 Goal 的 Task 更優先。這套系統讓你**用高層級的決策，自動影響低層級的排序**。

### 2.3 Goal 目標管理

#### 2.3.1 Goal 的定義

**Goal 是你想要達成的最終狀態。**

它回答的問題是：「我想去哪裡？」而不是「我要做什麼？」

| 特性 | 說明 |
|------|------|
| **時間跨度** | 季（3 個月）或年（12 個月） |
| **方向性** | 結果導向，不是行動導向 |
| **可衡量** | 需要有明確的關鍵結果（KRs） |
| **催生者** | 催生 Projects，不催生 Tasks |

#### 2.3.2 Goal 的狀態

| 狀態 | 顏色 | 意義 | 適用時機 |
|------|------|------|----------|
| `planning` | 🟡 黃色 | 規劃中 | 還在構思，尚未正式啟動 |
| `active` | 🟢 綠色 | 執行中 | 已經開始，正在推進 |
| `completed` | ✅ 綠色打勾 | 已完成 | 達成了目標 |
| `on-hold` | ⏸️ 暫停 | 暫停 | 因為某些原因暫時停止 |
| `cancelled` | ❌ 紅色叉 | 取消 | 放棄或重新定向 |

#### 2.3.3 如何建立 Goal（完整步驟）

**步驟 1：確認你的年度方向**

在建立 Goal 之前，先問自己：
- 今年我最想要達成的 1-3 件事是什麼？
- 哪件事如果達成，會讓我覺得這一年很值得？

**步驟 2：前往 Goal 資料夾**

在檔案總管中打開：`20_Life_Planning/23_Goal/`

**步驟 3：新建 Goal 檔案**

按 `N`，選擇「新建筆記」，命名格式：
- `2026-Q2-目標名稱.md`（季度目標）
- `2026-年度目標名稱.md`（年度目標）

**步驟 4：複製 Goal 模板**

```markdown
---
title: 目標名稱
type: goal
status: planning
計劃編號: G-2026-Q2-001
截止日期: 2026-06-30
area: career
象限: Vocation
relatedProjects:
  - 
tags:
  - life-os
  - life-os/goal
---

# 目標名稱

## 🎯 目標描述

我到底想要什麼？用一句話具體描述。

## 📊 關鍵結果（KRs）

這些是用來衡量「目標是否達成」的具體指標。

- [ ] KR1：_______________
- [ ] KR2：_______________
- [ ] KR3：_______________

## 📅 時間規劃

- 起始日：2026-04-01
- 里程碑 1：_______________
- 里程碑 2：_______________
- 截止日：2026-06-30

## 🔗 催生的 Projects

這個 Goal 會催生以下 Projects：

- [[Project 1]]
- [[Project 2]]

## 💡 為什麼這個目標重要？

（描述這個目標背後的驅動力，讓你在低潮時能找回方向）

## 📝 備註

（其他需要記錄的資訊）
```

**步驟 5：填寫並將狀態改為 `active`**

當你完成規劃，將 `status: planning` 改為 `status: active`。

#### 2.3.4 Goal 的組成要素

每個完整的 Goal 應該包含：

```
┌─────────────────────────────────────────┐
│  Goal 必備要素                           │
├─────────────────────────────────────────┤
│  ✅ 目標描述（一句話說清楚你要什麼）      │
│  ✅ 關鍵結果 KRs（3-5 個可衡量的指標）    │
│  ✅ 截止日期（什麼時候要達成）            │
│  ✅ Area 連結（屬於哪個人生領域）         │
│  ✅ 象限標記（HUMAN 3.0 象限）            │
│  ✅ relatedProjects（催生的 Projects）    │
│  ✅ 為什麼重要（驅動力的源頭）             │
└─────────────────────────────────────────┘
```

#### 2.3.5 Goal YAML 欄位說明

| 欄位 | 說明 | 範例 |
|------|------|------|
| `title` | 目標名稱，會顯示在 MOC 查詢中 | `2026 Q2 我的目標` |
| `type` | **固定值**，必須是 `goal` | `goal` |
| `status` | 當前狀態 | `active` |
| `計劃編號` | 唯一識別碼，格式 `G-YYYY-Qn-NNN` | `G-2026-Q2-001` |
| `截止日期` | 目標截止日，格式 `YYYY-MM-DD` | `2026-06-30` |
| `area` | 對應 Area（見 3.1 節） | `career` |
| `象限` | HUMAN 3.0 象限 | `Vocation` |

### 2.4 Project 專案管理

#### 2.4.1 Project 的定義

**Project 是達到 Goal 的具體手段。**

它回答的問題是：「我要做什麼專案來達到那個目標？」而不是「目標本身是什麼」。

| 特性 | 說明 |
|------|------|
| **時間跨度** | 月（1-3 個月）到季（3-6 個月） |
| **方向性** | 行動導向，具體可執行 |
| **可交付** | 有明确的產出或里程碑 |
| **催生者** | 被 Goal 催生，催生 Tasks |

#### 2.4.2 Project 的狀態

與 Goal 相同（planning / active / completed / on-hold / cancelled）。

#### 2.4.3 Project 與 Goal 的關係

```
一個 Goal
    │
    ├── Project A ──── Task 1, Task 2, Task 3
    │
    ├── Project B ──── Task 4, Task 5
    │
    └── Project C ──── Task 6
```

**規則：**
- 一個 Goal 可以有多個 Projects ✓
- 一個 Project 只能屬於一個 Goal ✓
- Project 完成 → Goal 進度推進

#### 2.4.4 如何建立 Project（完整步驟）

**步驟 1：確認要支撐哪個 Goal**

在建立 Project 之前，先確認它連結到哪個 Goal（例如 `G-2026-Q2-001`）。

**步驟 2：在對應資料夾建立檔案**

根據 Project 當前狀態，選擇對應資料夾：
- 還在規劃 → `30_Projects/31_Planning/`
- 正式執行 → `30_Projects/32_Active/`
- 已完成 → `30_Projects/33_Done/`

**步驟 3：複製 Project 模板**

```markdown
---
title: Arena 系統建構
type: project
status: active
goalId: G-2026-Q2-001
areaId: career
進度: 0
階段: Phase 1 - 教材整理
tags:
  - life-os
  - life-os/project
---

# Arena 系統建構

## 📋 專案概述

（用 2-3 句話描述這個專案做什麼）

## 🎯 專案目標

與 Goal [[Goal 標題]] 對齊。

## 📌 階段規劃

### Phase 1：（名稱）
- [ ] 子任務 1
- [ ] 子任務 2

### Phase 2：（名稱）
- [ ] 子任務 3
- [ ] 子任務 4

## 📊 進度追蹤

| 日期 | 進度 | 里程碑 |
|------|------|--------|
| 2026-04-01 | 0% | 專案啟動 |
| 2026-04-15 | 25% | （填入） |
| 2026-05-01 | 50% | （填入） |
| 2026-06-30 | 100% | 專案完成 |

## 🔗 連結的 Tasks

- [[Task 1]]
- [[Task 2]]

## 📝 備註

（風險、假設、依賴關係）
```

**步驟 4：填寫並更新進度**

隨著 Task 完成，更新 `進度` 欄位的數字。

#### 2.4.5 Project YAML 欄位說明

| 欄位 | 說明 | 範例 |
|------|------|------|
| `title` | 專案名稱 | `Arena 系統建構` |
| `type` | **固定值**，必須是 `project` | `project` |
| `status` | 當前狀態 | `active` |
| `goalId` | 連結到 Goal 的**計劃編號**（不是標題） | `G-2026-Q2-001` |
| `areaId` | Area ID | `career` |
| `進度` | 完成百分比，數字 0-100 | `35` |
| `階段` | 目前所處階段 | `執行中` |

#### 2.4.6 進度追蹤查詢

在 `Project_MOC.md` 中，自動查詢所有 Projects：

```markdown
```dataview
TABLE WITHOUT ID 
  file.link AS 專案,
  進度 AS 進度%,
  goalId AS Goal,
  階段 AS 階段
FROM "30_Projects"
WHERE status = "active"
SORT 進度 DESC
```
```

### 2.5 Task 任務管理

#### 2.5.1 Task 的定義

**Task 是不可再分割的原子行動。**

它回答的問題是：「我今天/這週具體要做的這件事是什麼？」

| 特性 | 說明 |
|------|------|
| **時間跨度** | 通常在一天內可以完成 |
| **可執行** | 明確的動作，知道怎麼開始 |
| **有產出** | 做完會有一個明確的結果 |
| **可追蹤** | 會被記錄在 TaskNotes 中 |

#### 2.5.2 Task 的狀態

| 狀態 | 意義 | 顏色 |
|------|------|------|
| `todo` | 待執行 | ☐ 空白方框 |
| `in-progress` | 正在執行 | 🔄 旋轉中 |
| `done` | 已完成 | ✅ 打勾 |
| `cancelled` | 取消 | ❌ 叉 |

#### 2.5.3 Task 的組成

每個 Task 筆記應該包含：

```
┌─────────────────────────────────────────┐
│  Task 必備要素                           │
├─────────────────────────────────────────┤
│  ✅ 任務標題（一句話說清楚做什麼）        │
│  ✅ 狀態（todo / in-progress / done）    │
│  ✅ 父母連結（parents，連結到 Project）   │
│  ✅ goalId（與 Project 一致）            │
│  ✅ areaId（對應 Area）                   │
│  ✅ 象限（HUMAN 3.0 象限）                │
│  ✅ 建立日期（time_start）                 │
│  ✅ 預估耗時（预估耗时）                   │
│  ✅ 執行步驟（具體怎麼做）                 │
│  ✅ 產出描述（做完會得到什麼）            │
│  ⚠️ 拖延反思（可選，如果延後了記原因）    │
└─────────────────────────────────────────┘
```

#### 2.5.4 如何建立 Task

**方式一：使用主頁快捷按鈕**

在主頁下方點擊 `[+ 新建 Task]`，系統會在 TaskNotes 資料夾建立新檔案。

**方式二：使用快速鍵**

1. 按 `Ctrl+N` 新建筆記
2. 在 `TaskNotes/` 資料夾建立
3. 使用任務模板（`任務模板.md`）

**方式三：使用 Templater 插件（如果已安裝）**

設定一個快速鍵（如 `Ctrl+T`）觸發任務模板，自動帶入 YAML frontmatter。

#### 2.5.5 Task 實戰範例

**不好的 Task 定義：**
> 「處理 Arena 內容」← 太模糊，不知道要產出什麼

**好的 Task 定義：**
> 「Arena S1 - 完成第一章節的 Markdown 教材整理，產出不少於 2000 字的結構化內容」← 清楚知道要做什麼、產出什麼

#### 2.5.6 Task 完成流程

```
建立 Task（status: todo）
    ↓
開始執行（status: in-progress）
    ↓
完成 Task（status: done）
    ↓
更新 Project 進度（重新計算 Tasks 完成率）
    ↓
自動反映在 Project MOC 查詢結果中
```

#### 2.5.7 Task YAML 欄位說明

| 欄位 | 說明 | 範例 |
|------|------|------|
| `type` | **固定值**，必須是 `task` | `task` |
| `status` | 任務狀態 | `todo` |
| `parents` | 連結到所屬 Project（使用 wiki link） | `[[Arena 系統建構]]` |
| `goalId` | 與所屬 Project 一致 | `G-2026-Q2-001` |
| `projectId` | 留空或填 Project ID | `（留空）` |
| `areaId` | Area ID | `career` |
| `象限` | HUMAN 3.0 象限 | `Vocation` |
| `time_start` | 建立日期 | `2026-04-09` |
| `预估耗时` | 預計花費小時數 | `4` |

### 2.6 Goal、Project、Task 與 Area 的關係

```
         Area（横切所有 Goals）
              │
    ┌─────────┼─────────┐
    │         │         │
💼 職業   💰 財務   ❤️ 健康
    │         │         │
 Goal-A   Goal-B   Goal-C
    │         │         │
 Project-A  Project-B  Project-C
    │         │         │
 Task-1    Task-X    Task-Y
```

每個層級都會標記自己的主要 Area。這不是為了複雜，而是讓你能在任何時刻回答這個問題：

> 「我這週的時間，有沒有失衡？」

---

## 3. Area 五宮格

### 3.1 五大 Area 總覽

Area 是橫切所有 Goals 和 Projects 的**人生維度**，確保你不會失衡。

| Area 名稱 | Area ID | HUMAN 象限 | 核心問題 |
|-----------|---------|-----------|---------|
| 💼 職業發展 | `career` | Vocation | 我如何創造價值與收入？ |
| 💰 財務自由 | `finance` | Vocation | 我的財務是否越來越自由？ |
| ❤️ 身心健康 | `health` | Body | 我的身體與心理是否健康？ |
| 👥 關係家庭 | `relation` | Spirit | 我與重要的人的關係如何？ |
| 🌱 自我成長 | `growth` | Mind | 我是否持續學習與進化？ |

### 3.2 Area ID 與名稱對照表

| Area 名稱 | Area ID | 預設象限 |
|-----------|---------|---------|
| 職業發展 | `career` | Vocation |
| 財務自由 | `finance` | Vocation |
| 身心健康 | `health` | Body |
| 關係家庭 | `relation` | Spirit |
| 自我成長 | `growth` | Mind |

### 3.3 Area 的用途

Area 不是用來催生 Projects 的，而是用來**分類和平衡**。

**你可以這樣理解：**
- Goal 和 Project 是「我要去哪裡」和「我要做什麼」
- Area 是「我是否活得夠完整」

**不平衡的徵兆：**

當你發現一段時間內：
- 只有 `career` 和 `finance` 有 Goals/Projects/Tasks → 你可能在過度燃燒
- 只有 `health` 有產出，但 `career` 完全停滯 → 你可能需要重新校準
- 所有 Area 都是空白 → 你可能缺乏方向

### 3.4 Area 與其他層級的關係

```
Goal
  ├── area: career           ← 主要 Area（必填）
  ├── area: finance          ← 次要 Area（可選）
  │
  └── Project
        ├── areaId: career  ← 主要 Area（必填）
        │
        └── Task
              ├── areaId: career  ← 主要 Area（必填）
              └── 象限: Vocation   ← HUMAN 3.0 象限（必填）
```

### 3.5 Area 平衡檢查（每週覆盤時使用）

打開 `Area_MOC.md`，會看到自動查詢：

```markdown
```dataview
TABLE WITHOUT ID 
  file.link AS Area,
  象限,
  (length(relatedGoals) + length(relatedProjects)) AS 連結數量
FROM "20_Life_Planning/22_Area"
WHERE type = "area"
SORT 象限 ASC
```
```

在每週覆盤時，手動檢查這週的 Tasks 分佈：

> 「這週我做了 20 個 Tasks，其中：
> - Vocation（職業+財務）：15 個
> - Body（健康）：2 個
> - Spirit（關係）：1 個
> - Mind（成長）：2 個
>
> 這符合我想要的平衡嗎？」

### 3.6 Area MOC 頁面內容

每個 Area 的 MOC 頁面應該包含：

- 該 Area 的 Dataview 查詢（顯示所有連結的 Goals 和 Projects）
- Area 的核心目標描述
- 該 Area 目前的進度摘要
- 該 Area 的待處理 Tasks

### 3.7 Area YAML 欄位說明

```yaml
---
title: 職業發展              # Area 顯示名稱
type: area                   # 固定值
status: active               # active / archived
areaId: career               # 唯一 ID：career / finance / health / relation / growth
象限: Vocation                # Mind / Body / Spirit / Vocation
created: 2026-04-09          # 建立日期
relatedGoals: []             # 連結到此 Area 的 Goals
relatedProjects: []           # 連結到此 Area 的 Projects
description: |                # Area 描述
  這個 Area 涵蓋所有與職業發展相關的目標和專案，
  包括工作任務、技能學習與職業規劃。
tags:
  - life-os
  - life-os/area
---
```

### 3.8 Area 的五個可以修改嗎？

**可以，但建議初期維持這五個。**

如果你決定修改：

| 選項 | 說明 |
|------|------|
| **新增 Area** | 例如新增「休閒娛樂」或「精神信仰」 |
| **合併 Area** | 例如將「職業發展」與「財務自由」合併為「事業與財富」 |
| **修改名稱** | 例如將「身心健康」改為「健康與能量」 |
| **修改 Area ID** | 例如將 `health` 改為 `wellness` |

**重要：修改 Area ID 後，必須同步更新所有連結的 Goals、Projects 和 Tasks 的 `area` / `areaId` 欄位。**

建議使用 VS Code 的「在所有檔案中取代」功能，一次更新完畢。

---

## 4. 每日日記（Daily）

### 4.1 每日 OS 檢查 ritual

人生 OS 的每日使用分為三個階段：

```
早晨（5 分鐘）→ 工作時段（不中斷）→ 晚間（5 分鐘）
```

### 4.2 早晨 ritual（5 分鐘）

**目標：設定當天的方向和能量狀態**

```
1. 建立或打開當天日記
   路徑：20_Life_Planning/21_Journal/2026-04-09.md

2. 插入 OS-每日檢查.md 模板內容

3. 填寫能量校準
   🟢 綠色（High Energy）：可以處理困難任務
   🟡 黃色（Normal）：處理一般任務，避免高難度
   🔴 紅色（Low）：只做最低限度的事，別勉強
   ⚫ 黑色（Danger）：休息優先，不要工作

4. 設定今日 MIT
   問自己：「如果今天只能完成一件事，那是什麼？」
   把答案寫在「今日 MIT」欄位。

5. 選擇象限
   今天你要專注在哪個象限？
   - Mind（學習）
   - Body（健康）
   - Spirit（關係）
   - Vocation（產出）

6. 開始工作
   先做 MIT，不要先處理 email 或訊息。
```

### 4.3 工作時段原則

| 原則 | 說明 |
|------|------|
| **時間盒（Time-blocking）** | 為每個 Task 分配固定的時間區塊 |
| **單一任務** | 一個時間只做一件事，不要多工 |
| **關閉通知** | 執行期間關閉所有訊息通知 |
| **Capture 靈感** | 有任何新想法，立即寫到 `10_Inbox/`，不要打斷工作 |
| **完成後標記** | Task 完成後，立即將 status 改為 `done` |

### 4.4 晚間 ritual（5 分鐘）

**目標：回顧、記錄、預備明天**

```
1. 回顧今日 MIT
   - 完成了嗎？
   - 如果沒有，原因是什麼？
   - 這個任務是否應該移到明天？

2. 記錄學到的功課
   「今天學到了什麼？」
   「有什麼可以改進的？」

3. 更新明日 MIT
   「明天最重要的 ONE THING 是什麼？」

4. 簡單整理 TaskNotes
   確保今天的 Tasks 都已正確標記狀態。

5. 關機
   這不是失敗，而是结束一天的方式。
```

### 4.5 OS-每日檢查.md 模板內容

```markdown
---
title: {{date}} 每日檢查
type: daily-check
date: {{date}}
tags:
  - life-os
  - life-os/os-template
---

# {{date}} 每日檢查

## 🌅 早晨檢查

### 能量校準
今天能量等級：🟢 / 🟡 / 🔴 / ⚫

### 今日 MIT（Most Important Task）
今天最重要的 ONE THING：
________________________________

### 象限選擇
今天專注在哪個象限？
- Mind（學習/閱讀）
- Body（健康/運動）
- Spirit（關係/情感）
- Vocation（工作/產出）

## 📋 今日執行清單

### 連結到 Goals 的 Tasks
-

### 其他 Tasks
-

## 🌙 晚間檢查

### MIT 完成情況
- [ ] 完成 / [ ] 未完成
- 未完成原因：

### 學到的功課
-

### 明日 MIT
-

### 明日象限
-
```

### 4.6 常見問題：不知道今天該做什麼？

如果早上沒有方向，按以下順序檢查：

1. **看主頁的 MITs 區** → 有沒有明顯的優先任務
2. **看 Project MOC** → 哪個 Project 的 Tasks 最緊急
3. **看 Goal MOC** → 哪個 Goal 快到截止日期了
4. **看 Area MOC** → 哪個 Area 被長期忽略了

---

## 5. 每週覆盤

### 5.1 覆盤時間建議

| 選項 | 時間 | 優點 |
|------|------|------|
| A | 週日晚上 19:00-20:00 | 為新的一週做好心理準備 |
| B | 週一早晨 08:00-08:30 | 用清晰的大脑開始新週 |

建議：選擇一個固定時間，寫入你的日曆，形成習慣。

### 5.2 覆盤步驟（完整版，約 20-30 分鐘）

**步驟 1：打開覆盤模板（5 分鐘）**

打開 `80-System/81-Template/OS-每週覆盤.md`，或建立新檔：
`20_Life_Planning/21_Journal/2026-W15-覆盤.md`

**步驟 2：本週產出總結（5 分鐘）**

```
本週（4/6 - 4/12）產出：

| 日期 | 主要產出 |
|------|----------|
| 週一 | 完成 Arena S1 教材第 1-3 章 |
| 週二 | 完成 Arena S1 教材第 4-5 章 |
| 週三 | 建立 AI 訪談模板初版 |
| 週四 | 運動 2 次（達成）|
| 週五 | 審閱用戶訪談記錄 3 篇 |
| 週六 | （休息/家庭日）|
| 週日 | 本週覆盤 |
```

**步驟 3：四象限檢查（5 分鐘）**

使用 Dataview 或手動統計，計算本週 Tasks 在各象限的分佈：

```
本週 Tasks 總數：18

Mind（學習/成長）：  3 個 ████████░░░░░░░░░░  16%
Body（健康）：       2 個 █████░░░░░░░░░░░░░  11%
Spirit（關係）：     1 個 ███░░░░░░░░░░░░░░░   5%
Vocation（工作）：  12 個 ███████████████████ 67%
```

**步驟 4：Goals 進度檢查（3 分鐘）**

打開 Goal MOC，查詢所有 active Goals：

```
Goal 1: G-2026-Q2-001「Arena 系統建構」
  進度：35% → 上週 25%，提升了 10%
  狀態：🟢 正常

Goal 2: G-2026-Q2-002「財務系統建立」
  進度：12% → 上週 10%，提升了 2%
  狀態：🟡 需要關注（落後）
```

**步驟 5：Projects 進度檢查（3 分鐘）**

檢查所有 active Projects 的 `進度` 欄位是否有更新。

**步驟 6：Area 平衡評估（3 分鐘）**

問自己這三個問題：

> 問題 1：「這週我在每個 Area 的實際投入是多少？」
> 問題 2：「有沒有哪個 Area 被完全忽略了？」
> 問題 3：「這個分配符合我目前的優先順序嗎？」

如果發現失衡，寫下調整方向：

```
Area 失衡調整：
- 健康（Body）被嚴重忽略 → 下週至少安排 3 次運動
- 關係（Spirit）幾乎沒有投入 → 週末安排一次家人聚餐
```

**步驟 7：下週優先事項（5 分鐘）**

```
下週（4/13 - 4/19）優先事項：

🎯 Top 3 Tasks（必須完成）：
1. 完成 Arena S1 教材全部章節
2. 發布本週社群內容（3 篇）
3. 外匯交易系統策略回測

📋 其他计划：
- 建立 Project 2 的第一個 Task
- 安排一次一對一會議

⚠️ 風險與假設：
- 如果 S1 教材來不及完成，需要調整 Goal 截止日期
- 交易系統回測需要穩定的網路環境
```

### 5.3 OS-每週覆盤.md 模板內容

```markdown
---
title: 每週覆盤 - {{date}}
type: weekly-review
week: "{{date}}"
date: {{date}}
tags:
  - life-os
  - life-os/os-template
---

# 每週覆盤 - {{date}}

## 1️⃣ 本週產出總結

### 完成的事項
-

### 未完成的事項
-

## 2️⃣ 四象限投入分析

| 象限 | Tasks 數 | 百分比 |
|------|---------|--------|
| Mind | | |
| Body | | |
| Spirit | | |
| Vocation | | |

## 3️⃣ Goals 進度檢查

| Goal | 上週進度 | 本週進度 | 變化 | 狀態 |
|------|---------|---------|------|------|
| | | | | |

## 4️⃣ Projects 進度檢查

| Project | 上週進度 | 本週進度 | 變化 |
|--------|---------|---------|------|
| | | | |

## 5️⃣ Area 平衡評估

**問題 1：** 這週我在每個 Area 的實際投入是多少？
回答：

**問題 2：** 有沒有哪個 Area 被完全忽略了？
回答：

**問題 3：** 這個分配符合我目前的優先順序嗎？
回答：

**調整方向：**
-

## 6️⃣ 本週學習與洞察

**學到的功課：**
-

**新的洞察：**
-

## 7️⃣ 下週優先事項

### 🎯 Top 3（必須完成）
1.
2.
3.

### 📋 其他计划
-

### ⚠️ 風險與假設
-

---

*覆盤時間：20 分鐘*
*覆盤日期：{{date}}*
```

---

## 6. 主頁控制塔

### 6.1 儀表板設計理念

主頁是你每天使用 Obsidian 時的第一個畫面。它的設計理念是：

> **「看一眼，就知道今天該做什麼。」**

不需要到處找，只需要看首頁。

### 6.2 儀表板區塊說明

```
┌──────────────────────────────────────────────────────────────────┐
│  [🏠 Home]  [📋 Goals]  [📁 Projects]  [✅ Tasks]  [📅 日記]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  🕐 12:43                                     📊 今日概覽          │
│  📅 2026-04-09                               Goals: 3 (2 active)  │
│                                              Tasks: 12 (3 today)  │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ╔═══════════╗  ╔═══════════╗  ╔═══════════╗  ╔═══════════╗    ╔═╗
│  ║ 💼 職業   ║  ║ 💰 財務   ║  ║ ❤️ 健康   ║  ║ 👥 關係   ║    ║🌱║
│  ║  發展     ║  ║  自由     ║  ║  身心     ║  ║  家庭     ║    ║成║
│  ║           ║  ║           ║  ║           ║  ║           ║    ║長║
│  ║ 🟢 2/5    ║  ║ 🟡 1/3    ║  ║ 🔴 0/2    ║  ║ 🟢 1/1    ║    ║  ║
│  ╚═══════════╝  ╚═══════════╝  ╚═══════════╝  ╚═══════════╝    ╚═╝
│                                                                   │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                    │
│  🎯 Goals 追蹤              │  ⭐ 本週 MITs                       │
│  ────────────────────────  │  ────────────────────────────────   │
│                            │                                    │
│  🟢 G-2026-Q2-001          │  🔴 完成 Arena S1 教材整理          │
│     截止：2026-06-30       │     （連結到 Arena 系統建構）        │
│     進度：35%              │                                    │
│                            │  🟡 審閱 3 篇用戶訪談紀錄           │
│  🟢 G-2026-Q2-002          │     （連結到 AI 訪談優化）          │
│     截止：2026-05-31       │                                    │
│     進度：12%              │  ☐ 運動 2 次                        │
│                            │     （連結到 Q2 健康目標）         │
│  🟡 G-2026-Q3-003          │                                    │
│     截止：2026-09-30       │                                    │
│     進度：5%               │                                    │
│                            │                                    │
├────────────────────────────┴────────────────────────────────────┤
│                                                                   │
│  [+ 新建 Goal]  [+ 新建 Project]  [+ 新建 Task]  [📅 今日日記]   │
│                                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│               📅 四月 2026                                       │
│    一     二     三     四     五     六     日                   │
│   4/1    4/2    4/3    4/4    4/5    4/6    4/7                   │
│   4/8    4/9*  4/10   4/11   4/12   4/13   4/14                   │
│                ↑                                                 │
│          4/9 有 3 個 Tasks                                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 6.3 首頁各區塊用途

| 區塊 | 用途 |
|------|------|
| 左側時鐘 + 日期 | 提醒你當下時間，協助時間盒（Time-blocking） |
| 中間五大 Area 宮格 | 快速查看每個人生領域的狀態 |
| 右側統計數量 | 一眼掌握 Goal 數、Task 數 |
| Goals 追蹤 | 查看所有進行中的目標及截止日期 |
| 本週 MITs | 本週最重要的 1-3 件任務 |
| 快速新建區 | 點擊即建立對應類型的筆記 |
| 日曆視圖 | 視覺化一段時間內的任務分佈 |

### 6.4 Area 卡片詳解

每個 Area 卡片是一個**快速入口**，包含：

| 元素 | 說明 |
|------|------|
| Area 圖示 | 💼💰❤️👥🌱 對應五大 Area |
| Area 名稱 | 顯示中文名稱 |
| 進度指示 | `🟢 X/Y` = 已完成 X 個，總共 Y 個 Goals/Projects |
| 點擊行為 | 點擊卡片會跳转到對應的 Area MOC 頁面 |

**卡片顏色含義：**

| 顏色 | 含義 |
|------|------|
| 🟢 綠色 | 該 Area 有正在執行的內容，進度良好 |
| 🟡 黃色 | 該 Area 有內容，但可能需要關注 |
| 🔴 紅色 | 該 Area 幾乎沒有投入，需要注意平衡 |
| ⚫ 灰色 | 該 Area 目前沒有連結的 Goals/Projects |

### 6.5 Goals 追蹤區詳解

自動顯示：
- 所有 `status = "active"` 的 Goals
- 截止日期（已排序，快到的在上面）
- 進度百分比
- 狀態顏色指示

### 6.6 本週 MITs 區詳解

MIT = **Most Important Tasks**（最重要的事）

這個區塊手動設定或自動抓取：
- 連結到本週到期 Goal 的 Tasks
- 你自己標記為 `🔴` 高優先的 Tasks

---

## 7. 模板總覽

所有系統模板都存放在 `80-System/81-Template/` 目錄下。

### 7.1 模板列表

| 模板檔案 | 路徑 | 用途 | 使用頻率 |
|---------|------|------|---------|
| OS-每日檢查.md | 80-System/81-Template/ | 每日早晨/晚間使用 | 每天 |
| OS-每週覆盤.md | 80-System/81-Template/ | 每週覆盤使用 | 每週 |
| 項目模板.md | 80-System/81-Template/ | 建立新 Project | 每個新專案 |
| 任務模板.md | 80-System/81-Template/ | 建立新 Task | 每個新任務 |
| Daily.md | 80-System/81-Template/ | 完整版日記模板 | 可選 |
| Goal 模板 | 20_Life_Planning/23_Goal/ | 建立新 Goal | 每個新目標 |

### 7.2 任務模板.md 內容

```markdown
---
title: 任務名稱
type: task
status: todo
parents:
  - "[[Project 名稱]]"
goalId: G-2026-Q2-001
projectId: 
areaId: career
象限: Vocation
time_start: {{date}}
time_done:
实际耗时: 
tags:
  - life-os
  - life-os/task
---

# 任務名稱

## 任務描述

（用一句話描述這項任務要做什麼）

## 執行步驟

1.
2.
3.

## 產出

-

## 拖延反思（可選）

（如果這項任務被延後，記錄原因）
```

### 7.3 項目模板.md 內容

```markdown
---
title: 專案名稱
type: project
status: active
goalId: G-2026-Q2-001
areaId: career
進度: 0
階段: Phase 1 - 開始
tags:
  - life-os
  - life-os/project
---

# 專案名稱

## 📋 專案概述

（用 2-3 句話描述這個專案做什麼）

## 🎯 專案目標

與 Goal [[Goal 標題]] 對齊。

## 📌 階段規劃

### Phase 1：（名稱）
- [ ] 子任務 1
- [ ] 子任務 2

### Phase 2：（名稱）
- [ ] 子任務 3
- [ ] 子任務 4

## 📊 進度追蹤

| 日期 | 進度 | 里程碑 |
|------|------|--------|
| YYYY-MM-DD | 0% | 專案啟動 |
| YYYY-MM-DD | 100% | 專案完成 |

## 🔗 連結的 Tasks

-

## 📝 備註

（風險、假設、依賴關係）
```

### 7.4 Daily.md 完整日記模板

```markdown
---
title: {{date}} 日記
type: journal
date: {{date}}
dayOfWeek: {{dayOfWeek}}
tags:
  - life-os
  - life-os/journal
---

# {{date}} 日記

## 📅 基本資訊

- 日期：{{date}}
- 星期：{{dayOfWeek}}
- 能量等級：🟢 / 🟡 / 🔴 / ⚫

## 🌅 早晨檢查

### 能量校準
今天能量等級：🟢 / 🟡 / 🔴 / ⚫

### 今日 MIT
今天最重要的 ONE THING：_______________

### 象限選擇
- Mind（學習/閱讀）
- Body（健康/運動）
- Spirit（關係/情感）
- Vocation（工作/產出）

## 📋 今日執行

### 連結到 Goals 的 Tasks
-

### 其他 Tasks
-

## 📊 今日產出

-

## 🌙 晚間檢查

### MIT 完成情況
- [ ] 完成 / [ ] 未完成

### 學到的功課
-

### 明日 MIT
-

### 明日象限
-
```

---

## 8. 常見問題

### Q1: Goal 和 Project 有什麼不同？

| 維度 | Goal | Project |
|------|------|---------|
| 回答的問題 | 「我想去哪裡？」 | 「我要做什麼來到達那裡？」 |
| 時間跨度 | 季或年 | 月到季 |
| 導向 | 結果導向 | 行動導向 |
| 催生/被催生 | 被催生 Projects | 被 Goal 催生，催生 Tasks |

**實例：**
- **Goal**：在 2026 Q2 前建立 Arena 系統的基本框架
- **Project 1**：完成 Arena S1-S4 教材整理（催生 20+ Tasks）
- **Project 2**：建立 AI 訪談流程（催生 10+ Tasks）
- **Project 3**：建立內容產出流程（催生 15+ Tasks）

### Q2: 一個 Goal 可以有多個 Projects 嗎？

**可以，而且這是常態。**

一個有意義的 Goal 通常需要多個專案來支撐：

```
Goal：建立財務自由基礎
  │
  ├── Project 1：自動化自媒體內容流程
  │     └── 催生 Tasks：建立模板、規劃內容行事曆等
  │
  ├── Project 2：外匯交易系統優化
  │     └── 催生 Tasks：策略回測、風險模型建立等
  │
  └── Project 3：建立被動收入論述
        └── 催生 Tasks：研究案例、撰寫文章等
```

### Q3: Task 和一般待辦事項有什麼不同？

**Task 是有結構的、會被追蹤的原子行動。**

| 維度 | Task（人生 OS） | 一般待辦事項 |
|------|----------------|-------------|
| 連結到 Project | ✅ 必填 | ❌ 沒有 |
| 連結到 Goal | ✅ 透過 Project 繼承 | ❌ 沒有 |
| 記錄在統一位址 | ✅ TaskNotes | ❌ 散落各處 |
| 有執行步驟 | ✅ 清楚定義 | ❌ 可能模糊 |
| 有預估耗時 | ✅ 欄位記錄 | ❌ 沒有 |

**核心差異**：當你完成一個 Task，你知道它如何推進了你的 Project 和 Goal。普通待辦事項做不到這一點。

### Q4: 如何快速新建 Task？

**方式一：使用主頁快捷按鈕**

在主頁下方點擊 `[+ 新建 Task]`，系統會在 TaskNotes 資料夾建立新檔案。

**方式二：使用快速鍵**

1. 按 `Ctrl+N` 新建筆記
2. 在 `TaskNotes/` 資料夾建立
3. 使用任務模板（`任務模板.md`）

**方式三：使用 Templater 插件（如果已安裝）**

設定一個快速鍵（如 `Ctrl+T`）觸發任務模板，自動帶入 YAML frontmatter。

### Q5: 系統資料會自動備份嗎？

**理論上會。**

因為 vault 存放於 OneDrive，OneDrive 會自動同步。但這**不是完整的版本控制**。

**建議的備份策略：**

| 備份方式 | 頻率 | 說明 |
|---------|------|------|
| OneDrive 自動同步 | 即時 | 防止硬碟故障 |
| Git 版本控制 | 每週一次 | 記錄變更歷史，可以回溯 |

**使用 Git 的好處：**
- 可以看到每次修改的 diff
- 可以回溯到任何一個時間點
- 可以建立分支嘗試新結構

### Q6: Dataview 查詢不顯示結果，怎麼辦？

當查詢沒有回傳任何結果，按以下順序檢查：

**檢查 1：YAML frontmatter 欄位名稱**

```yaml
# 錯誤：欄位名稱不一致
Status: Active    ← 大寫 S

# 正確：完全一致
status: active    ← 小寫 s，值也要小寫
```

**檢查 2：檔案路徑是否正確**

```dataview
# 錯誤：路徑不存在
FROM "20_Life_Planning/Goal"

# 正確：確認資料夾名稱
FROM "20_Life_Planning/23_Goal"
```

**檢查 3：查詢條件的值是否匹配**

```dataview
# 查詢中寫
WHERE status = "active"

# 但檔案中寫
status: Active    ← 值是大寫 Active，不匹配
```

**檢查 4：確認 type 欄位正確**

```dataview
# 如果查詢 Goals，確認 type = "goal"
WHERE type = "goal"

# 如果 type 是 "goal-note" 或其他，就查不到
```

### Q7: 如何刪除一個不再需要的 Goal / Project / Task？

**千萬不要直接刪除檔案。** 這樣會失去歷史追蹤，而且可能破壞連結。

**正確的做法：**

1. **改變狀態為 `cancelled`（推薦）**

```yaml
# 在 YAML frontmatter 中
status: cancelled
```

2. **移動到封存資料夾**

將檔案移動到 `70_Archives/` 下的對應子資料夾：
- `70_Archives/Goals/`
- `70_Archives/Projects/`
- `70_Archives/Tasks/`

3. **在 MOC 中註解掉該筆查詢**

在 Dataview 查詢中加入條件，排除 cancelled 狀態：
```dataview
WHERE status != "cancelled"
```

### Q8: 如何知道系統是否正常運作？

每週在 MOC 頁面檢查 Dataview 查詢是否正常回傳結果。如果查詢結果與預期不符，參考 Q6 進行除錯。

### Q9: 如果 Goal 逾期了怎麼辦？

Goal 逾期不代表失敗，有兩種處理方式：

**選項 1：延長截止日期**

如果 Goal 仍然有意義，只是需要更多時間：
1. 更新 `截止日期` 欄位到新的日期
2. 在 Goal 筆記中記錄原因
3. 保持 `status: active`

**選項 2：標記為完成並建立新的 Goal**

如果 Goal 的時機已經過去：
1. 將 `status` 改為 `completed`
2. 在 Goal 筆記中記錄實際達成了什麼
3. 建立新的 Goal（可能是下一季的同一個方向）

---

## 附錄：YAML 欄位速查

### A.1 Goal YAML

```yaml
---
title: 目標名稱              # 顯示名稱
type: goal                  # 固定值，區分筆記類型
status: active              # planning / active / completed / on-hold / cancelled
計劃編號: G-2026-Q2-001    # 唯一識別碼，格式：G-年份-Q季度-編號
截止日期: 2026-06-30        # 目標截止日，格式：YYYY-MM-DD
area: career                # career / finance / health / relation / growth
象限: Vocation              # Mind / Body / Spirit / Vocation
relatedProjects:            # 這個 Goal 催生的 Projects（可為空）
  - 
tags:
  - life-os
  - life-os/goal
---
```

### A.2 Project YAML

```yaml
---
title: 專案名稱              # 顯示名稱
type: project               # 固定值
status: active              # planning / active / completed / on-hold / cancelled
goalId: G-2026-Q2-001       # 連結到 Goal 的計劃編號（必填）
areaId: career              # career / finance / health / relation / growth
進度: 35                     # 完成百分比，數字 0-100
階段: Phase 1 - 教材整理    # 目前所處階段名稱
tags:
  - life-os
  - life-os/project
---
```

### A.3 Task YAML

```yaml
---
title: 任務名稱              # 顯示名稱
type: task                   # 固定值
status: todo                 # todo / in-progress / done / cancelled
parents:                     # 連結到所屬 Project（使用 wiki link）
  - "[[Arena 系統建構]]"
goalId: G-2026-Q2-001       # 與所屬 Project 的 goalId 一致
projectId:                   # 留空或填 Project ID
areaId: career               # career / finance / health / relation / growth
象限: Vocation               # Mind / Body / Spirit / Vocation
time_start: 2026-04-09        # 建立日期
time_done:
实际耗时:                     # 完成後填入實際耗時
tags:
  - life-os
  - life-os/task
---
```

### A.4 Area YAML

```yaml
---
title: 職業發展              # Area 顯示名稱
type: area                   # 固定值
status: active               # active / archived
areaId: career               # 唯一 ID：career / finance / health / relation / growth
象限: Vocation                # Mind / Body / Spirit / Vocation
created: 2026-04-09          # 建立日期
relatedGoals: []             # 連結到此 Area 的 Goals
relatedProjects: []           # 連結到此 Area 的 Projects
description: |                # Area 描述
  這個 Area 涵蓋所有與職業發展相關的目標和專案，
  包括工作任務、技能學習與職業規劃。
tags:
  - life-os
  - life-os/area
---
```

---

## 附錄：狀態值速查

### Goal / Project 狀態

| status 值 | 意義 | 建議顏色 |
|-----------|------|---------|
| `planning` | 規劃中 | 🟡 |
| `active` | 執行中 | 🟢 |
| `completed` | 已完成 | ✅ |
| `on-hold` | 暫停 | ⏸️ |
| `cancelled` | 取消 | ❌ |

### Task 狀態

| status 值 | 意義 | 建議符號 |
|-----------|------|---------|
| `todo` | 待執行 | ☐ |
| `in-progress` | 執行中 | 🔄 |
| `done` | 已完成 | ✅ |
| `cancelled` | 取消 | ❌ |

---

*手冊建立者：Larvis*
*日期：2026-04-27*
*版本：2.0（純 OS 版）*
*備註：v2.0 移除所有 Arena 內容，重新組織為 8 章結構，YAML version 升至 2.0。*
