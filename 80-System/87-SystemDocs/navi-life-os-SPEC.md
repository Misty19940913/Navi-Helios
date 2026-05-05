---
title: navi-life-os Plugin 規格文件
type: SPEC
status: draft
version: 0.2
folder: 87-SystemDocs
time_created: '2026-04-27'
time_modified: '2026-04-27'
tags:
  - life-os
  - plugin
  - navi-life-os
description: Navi Life OS Obsidian Plugin 完整功能規格
parent: []
children: []
related:
  - navi-calendar
  - Navi Helios系統與HUMAN 3.0
---

# navi-life-os Plugin 規格文件

> 版本：v0.2
> 狀態：研究階段
> 最後更新：2026-04-28

---

## 版本變更日誌

| 版本 | 日期 | 變更內容 |
|------|------|---------|
| v0.1 | 2026-04-27 | 初稿：系統架構、功能規格、MVP 定義 |
| v0.2 | 2026-04-28 | 移除 Components 依賴；新增 Navi 插件體系願景；新增 §1.3 PARA 研究參考；更新 §5.3 Dataview 替代方案；新增實作原則 |

---

## 1. 系統概述

### 1.1 Plugin 身份

| 欄位 | 內容 |
|------|------|
| **Plugin ID** | `navi-life-os`（現有 `navi-calendar` 將整合進入此 Plugin） |
| **名稱** | Navi Life OS |
| **描述** | Goal→Project→Task 框架與五宮格人生領域管理，帶有 Calendar、Periodic Notes 和日常 Ritual 支援 |
| **作者** | Navi |
| **License** | MIT |
| **minAppVersion** | 0.15.0 |
| **Plugin 定位** | Navi 插件體系核心（Navi plugin ecosystem core） |
| **Plugin 生態** | navi-calendar → navi-life-os → 其他垂直插件 |
| **相依插件** | Dataview、Tasks、Templater、periodic-para（均為開源） |
| **付費插件排除** | Components（付費，本專案不使用） |

### 1.2 核心理念

> ⚠️ **Components 插件聲明**：Components 是付費插件，本專案不依賴它。所有視覺化功能以 **Dataview + 原生 Obsidian** 實作等效方案。

### 1.3 研究參考：para-sample-vault 的 Components 系統

以下為另一 vault（para-sample-vault）的 Components 功能分析，作為實作替代方案的參考起點：

| Components 功能 | 類型 | Dataview 等效方案 | 難度 |
|---|---|---|---|
| 日記 Heatmap（熱力圖） | `chart (heatmap)` | DataviewJS 渲染 canvas 或 CSS grid | ⚠️ 中 |
| 每日打卡（dailyCheck） | `dailyCheck` | 純 Markdown task list + Dataview 完成率統計 | ✅ 簡單 |
| 領域投入度圓餅圖 | `chart (pie)` | DataviewJS pie chart 或 CSS progress bar | ⚠️ 中 |
| 月/季/年統計卡 | `count` | Dataview `GROUP BY` + 任務計數 | ✅ 簡單 |
| Area 看板（kanban） | `dynamicDataView (kanban)` | Dataview `TABLE` + CSS columns | ✅ 簡單 |
| 專案列表（table/gallery） | `dynamicDataView` | Dataview `TABLE` 或 `LIST` | ✅ 簡單 |
| 日記月曆視圖 | `dynamicDataView (calendar)` | navi-calendar 原生 Calendar View | ✅ 已有 |
| 多組件儀表板（multi + layout） | `multi (column/tab/grid)` | Markdown 嵌入多個 Dataview 查詢 | ✅ 簡單 |

### 1.4 實作原則

1. **Plugin 只做 UI orchestration** — 真正查詢邏輯由 Dataview/Tasks 承擔
2. **查詢結果以 Markdown 呈現** — 所有 Dataview block 直接內嵌在 MOC 裡
3. **依賴開源插件生態，並加以客製化** — Dataview / Tasks / Templater / periodic-para 是基石，但我們透過自己的 Plugin 疊加客製化層，形成 **Navi 插件體系**
4. **不重造輪子** — 現有 navi-calendar 的 Calendar View 直接複用

> 🎯 長期願景：Navi 插件體系以 navi-life-os 為核心，橫向擴展（navi-calendar → navi-life-os → 其他垂直插件），深度綁定開源插件的能力，最終形成一套完整的個人作業系統生態。



navi-life-os 是一套**建立在 Obsidian 上的個人作業系統**，幫助你：

- 追蹤目標（Goal）
- 管理專案（Project）
- 執行任務（Task）
- 平衡人生五大領域（Area / 五宮格）
- 記錄時間與能量（日記）
- 執行每日/每週 Ritual

### 1.5 與 navi-calendar 的關係

navi-calendar v0.3.7 的描述已經是 `"Life OS Calendar"`。本規格的目標是：**將 navi-calendar 擴展為完整的 navi-life-os plugin**，保留所有現有 calendar 功能，並新增 Life OS 執行層功能。

**整合策略：** navi-calendar 的現有程式碼與設定，成為 navi-life-os 的 `CalendarModule`。未來所有新功能都附加在同一 repo。

---

## 2. 系統架構

### 2.1 三層執行串聯

```
Goal（戰略層）
 └─ 催生
    └─ Project（戰術層）
       └─ 催生
          └─ Task（執行層）
```

- **Goal**：年度/季度目標，跨 Area、跨 Projects
- **Project**：月度/週期專案，屬於特定 Area
- **Task**：每週/每日行動，歸屬於 Project

### 2.2 Area 五宮格

| Area | HUMAN 3.0 象限 | 說明 |
|------|--------------|------|
| 職業發展 | Vocation | 職業、技能、專業成長 |
| 財務自由 | Vocation | 財務目標、投資、收入 |
| 身心健康 | Body | 健康、運動、能量管理 |
| 關係家庭 | Spirit | 家人、伴侶、朋友關係 |
| 自我成長 | Mind | 學習、閱讀、技能發展 |

### 2.3 四層時間結構

| 層 | 頻率 | 檔案類型 |
|----|------|---------|
| 戰略層 | 年度/季度 | Goal 筆記 |
| 戰術層 | 月度/週期 | Project 筆記 |
| 執行層 | 每週/每日 | Task 筆記 |
| 日常層 | 每日 | Daily 日記 |

### 2.4 Plugin 與模板的分工

| 類型 | Plugin（程式碼） | 模板（Markdown） |
|------|----------------|----------------|
| Calendar 視圖 | ✅ FullCalendar render | — |
| 任務建立/查詢 | ✅ Command + UI | — |
| Settings Tab | ✅ 設定頁面 | — |
| Ribbon 圖標 | ✅ 單擊動作 | — |
| 日記內容結構 | — | ✅ Daily.md |
| YAML Frontmatter Schema | — | ✅ 定義在模板 |
| Dataview 查詢 | — | ✅ 內嵌在 MOC |
| Area 五宮格視圖 | — | ✅ Dataview TABLE + CSS grid |

---

## 3. 功能規格

### 3.1 MVP 功能（v1.0）

#### F1: Calendar 視圖（繼承自 navi-calendar）

- Day / Week / Month / Timeline 四種視圖
- 任務整合（Tasks Plugin API）
- 農曆支援
- Mini Calendar Sidebar
- Task Hover Preview

#### F2: Periodic Note 建立

自動建立以下週期性筆記：

| 類型 | 快捷命令 | 預設位置 |
|------|---------|---------|
| Daily Note | `navi-life-os:open-daily` | `20_Life_Planning/21_Journsal/YYYY-MM-DD.md` |
| Weekly Note | `navi-life-os:open-weekly` | `20_Life_Planning/21_Journsal/YYYY-Www.md` |
| Monthly Note | `navi-life-os:open-monthly` | `20_Life_Planning/21_Journsal/YYYY-MM.md` |
| Quarterly Note | `navi-life-os:open-quarterly` | `20_Life_Planning/21_Journsal/YYYY-QN.md` |
| Yearly Note | `navi-life-os:open-yearly` | `20_Life_Planning/21_Journsal/YYYY.md` |

**邏輯：**
1. 檢查檔案是否已存在
2. 若存在，直接開啟
3. 若不存在，從模板建立，替換變數（`{{date}}`, `{{year}}`, `{{week}}` 等）

#### F3: Ribbon 圖標

左側欄顯示日曆圖標，單擊開啟：
1. 如果今日日記存在 → 開啟
2. 如果今日日記不存在 → 建立並開啟

#### F4: Command Palette 命令

| Command ID | 名稱 | 快捷鍵（可選） |
|-----------|------|--------------|
| `navi-life-os:open-daily` | 開啟今日日誌 | `Ctrl+Shift+D` |
| `navi-life-os:open-weekly` | 開啟本週日誌 | — |
| `navi-life-os:open-monthly` | 開啟本月日誌 | — |
| `navi-life-os:open-quarterly` | 開啟本季日誌 | — |
| `navi-life-os:open-yearly` | 開啟本年度日誌 | — |
| `navi-life-os:open-area-view` | 開啟 Area 五宮格視圖 | — |
| `navi-life-os:new-task` | 快速新增任務 | — |
| `navi-life-os:start-daily-ritual` | 開始每日 Ritual | — |
| `navi-life-os:start-weekly-review` | 開始每週覆盤 | — |

#### F5: Settings Tab

設定頁面包含以下分類：

**General**
- Plugin 開關（啟用/停用各模組）
- 語言設定

**Folders**
- Journal Folder：`20_Life_Planning/21_Journsal/`
- Task Folder：`20_Life_Planning/Task/`
- Goal Folder：`20_Life_Planning/23_Goal/`
- Area Folder：`20_Life_Planning/22_Area/`

**Templates**
- Daily Note Template：`80-System/81-Template/Daily.md`
- Weekly Note Template：（可選）
- Monthly Note Template：（可選）
- Task Template：（可選）

**Calendar（继承自 navi-calendar）**
- 預設視圖：Month / Week / Day / Timeline
- 第一天：星期日 / 星期一
- 顯示週末：是/否
- 顯示週數：是/否
- 任務顯示設定（scheduled / due / recurring）
- 顏色設定

**Ritual**
- 每日 Ritual 時間提醒（可選）

#### F6: Task 快速建立

透過 Command 或 Ribbon 建立 Task：
1. 選擇日期（預設：今天）
2. 選擇 Project（可選）
3. 輸入任務描述
4. 選擇 Priority（可選）
5. 自動寫入 Task Folder

### 3.2 Template-Only 功能（不寫入 Plugin）

這些功能繼續以模板形式存在，Plugin 不介入：

#### T1: Daily 日記內容
- 早晨能量校準
- MIT（Most Important Task）設定
- HUMAN 3.0 象限檢查
- 柳比歇夫時間日誌
- 晚間覆盤
- 深度覺察

#### T2: 每週覆盤模板
- 本週總結
- 四象限檢查
- 下週計劃

#### T3: Area 五宮格視圖
- Dataview 查詢內嵌在 Area MOC
- CSS grid / CSS columns 實作看板佈局
- DataviewJS 可選（渲染 Heatmap）

#### T4: Goal / Project MOC
- 查詢列表
- 狀態管理

### 3.3 未來功能（v1.1+）

#### F7: Area 五宮格 Dashboard
在 Plugin 內建一個 Dashboard View，顯示：
- 五宮格狀態（能量/進度）
- 本週 MIT 達成率
- Area 平衡指數

#### F8: Goal Progress Tracking
- Goal 的 Project 完成率
- Goal 的 Task 達成率
- 自動更新 Goal 筆記的 progress 欄位

#### F9: AI 整合（與 Hermes Gateway）
- 自然語言建立 Task
- 自然語言查詢 Goal 狀態
- 透過 External Plugin API 與 Hermes 通訊

#### F10: Data Export
- 匯出本週/本月回顧為 Markdown
- 匯出為 CSV（時間日誌）

---

## 4. 資料模型

### 4.1 Daily Note Frontmatter

```yaml
---
type: journal
folder: journal
status: active
priority: medium
tags:
  - life-os
  - life-os/daily
time_created: '2026-04-27'
time_modified: '2026-04-27'
energy: 🟢  # 🟢充沛 / 🟡平穩 / 🔴下滑 / ⚫低沉
focus: 8   # 1-10
mit: []    # Most Important Tasks
human_quadrant: Mind  # Mind/Body/Spirit/Vocation
---
```

### 4.2 Goal Frontmatter

```yaml
---
type: goal
folder: 23_Goal
status: active  # planning / active / completed / on-hold / cancelled
time_created: '2026-04-01'
time_modified: '2026-04-27'
tags:
  - life-os
  - life-os/goal
title: 2026 Q2 季度目標
description: ''
parent: []    # 上層 Goal（可選）
children: []  # 下層 Goal（可選）
related: []   # 相關筆記
area: 財務自由  # 關聯 Area
projects: []  # 催生的 Projects
截止日期: '2026-06-30'
象限: Vocation  # Mind/Body/Spirit/Vocation
progress: 0    # 0-100
---
```

### 4.3 Area Frontmatter

```yaml
---
type: area
folder: 22_Area
status: active
time_created: '2026-04-01'
time_modified: '2026-04-27'
tags:
  - life-os
  - life-os/area
areaId: 1  # 1-5，五宮格順序
title: 職業發展
象限: Vocation  # Mind/Body/Spirit/Vocation
description: ''
平衡狀態: 🟢  # 🟢均衡 / 🟡輕微失衡 / 🔴失衡
relatedGoals: []
relatedProjects: []
relatedTasks: []
---
```

### 4.4 Task Frontmatter

```yaml
---
type: task
folder: Task
status: ''  # 留空=Todo / x=Done / -=Cancelled / >=In Progress / !=Important
time_created: '2026-04-27'
time_modified: '2026-04-27'
tags:
  - life-os
  - life-os/task
title: 任務標題
description: ''
priority: high  # high / medium / low / none
due: '2026-04-30'
project: [[Project Name]]  # 歸屬 Project
goal: [[Goal Name]]        # 催生 Goal
area: 職業發展              # 關聯 Area
象限: Vocation              # Mind/Body/Spirit/Vocation
time_estimate: 60           # 分鐘
time_spent: 0              # 分鐘
energy_level: 🟢            # 所需能量
---
```

---

## 5. 整合點

### 5.1 與 Dataview 的整合

Plugin 不取代 Dataview，而是產生符合 Dataview 查詢格式的資料。

**查詢示例（在 MOC 中使用）：**

```dataview
TABLE WITHOUT ID file.link AS 任務, status AS 狀態, due AS 截止日期, priority AS 優先
FROM "20_Life_Planning/Task"
WHERE status != "x" AND status != "-"
SORT due ASC
```

```dataview
TABLE WITHOUT ID file.link AS Area, 象限, 平衡狀態
FROM "20_Life_Planning/22_Area"
WHERE type = "area"
SORT areaId ASC
```

### 5.2 與 Tasks Plugin 的整合

Plugin 讀取 Tasks Plugin 的任務語法：
- `- [ ] 待辦`
- `- [x] 已完成`
- `- [-] 已取消`

Calendar View 的任務顯示實際上是對 Tasks Plugin API 的包裝查詢。

### 5.3 視覺化替代方案（不使用 Components）

Components 是付費插件，以下是等效的原生 Obsidian + Dataview 實作方案：

#### 日記 Heatmap（熱力圖）

使用 DataviewJS 渲染 canvas，或用純 CSS grid：

```dataviewjs
// 讀取本年所有日記，計算每日字數，渲染 Heatmap
const pages = dv.pages('"20_Life_Planning/21_Journsal"')
  .where(p => p.file.name.match(/^\d{4}-\d{2}-\d{2}$/))
  .where(p => p.file.day && p.file.day.year === 2026);

const data = pages.map(p => ({
  date: p.file.day,
  words: p.file.outlinks.length + 1
})).array();

// 使用 SimpleHeat 或自繪 canvas（見 vault 內的 heatmap.css）
```

#### 每日打卡（等效 dailyCheck）

```dataview
TABLE WITHOUT ID
  file.link AS 日期,
  length(filter(file.tasks, t => t.completed)) AS 完成,
  length(file.tasks) AS 總數,
  round(100 * length(filter(file.tasks, t => t.completed)) / length(file.tasks)) AS 完成率
FROM "20_Life_Planning/21_Journsal"
WHERE file.name = this.file.name
SORT file.name DESC
```

#### 領域投入度圓餅圖

```dataview
TABLE 
  area AS 領域,
  length(rows) AS 專案數
FROM "30_Projects"
WHERE type = "project"
GROUP BY area
```

#### 月/季/年統計卡

```dataview
TABLE WITHOUT ID
  "本月任務" AS 標籤,
  length(TABLE) AS 數量
FROM "20_Life_Planning/Task"
WHERE status != "x" AND status != "-"
WHERE due >= date(sow) AND due <= date(eow)
```

#### Area 看板視圖（等效 kanban）

```dataview
TABLE WITHOUT ID
  file.link AS 專案,
  status AS 狀態,
  area AS 領域,
  due AS 截止
FROM "30_Projects"
WHERE type = "project"
SORT status, due ASC
```

> 💡 以上查詢可直接內嵌在 Area MOC、Project MOC、Goal MOC 中，Plugin 只負責開啟這些筆記的 command。

未來（v1.1+）：Plugin 可自行實作 Dashboard View，直接渲染 DataviewJS 的查詢結果，不需要 Components。

### 5.4 與 Templater 的整合

建立 Periodic Note 時，Plugin 可以：
1. 直接使用模板內容並替換變數（自己實作）
2. 呼叫 Templater 的模板系統（如果安裝了）

建議：Plugin 自己實作變數替換，不強制依賴 Templater。

---

## 6. 設定面板（Settings Tab）

### 6.1 設定結構

```typescript
interface LifeOSSettings {
  // Folders
  journalFolder: string;           // default: "20_Life_Planning/21_Journsal/"
  taskFolder: string;              // default: "20_Life_Planning/Task"
  goalFolder: string;              // default: "20_Life_Planning/23_Goal"
  areaFolder: string;              // default: "20_Life_Planning/22_Area"

  // Templates
  dailyTemplatePath: string;      // default: "80-System/81-Template/Daily.md"
  weeklyTemplatePath: string;      // default: ""
  monthlyTemplatePath: string;     // default: ""
  quarterlyTemplatePath: string;   // default: ""
  yearlyTemplatePath: string;      // default: ""

  // Calendar (from navi-calendar)
  defaultView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  firstDayOfWeek: 0 | 1;          // 0=Sunday, 1=Monday
  showWeekends: boolean;
  showWeekNumbers: boolean;

  // Ritual
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;       // "09:00"
}
```

---

## 7. 使用者介面

### 7.1 左側欄（Ribbon）

```
[🗓️] ← 日曆圖標，單擊開啟今日日誌
```

### 7.2 Command Palette

所有命令以 `navi-life-os:` 前綴：

```
navi-life-os:open-daily
navi-life-os:open-weekly
navi-life-os:open-monthly
navi-life-os:new-task
...
```

### 7.3 Status Bar（可選）

左下角顯示：
```
📅 2026-04-27 | 🟢 充沛
```

---

## 8. 檔案結構

### 8.1 Plugin 專案結構

```
navi-life-os/
├── manifest.json              # Plugin metadata（id: navi-life-os）
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── src/
│   ├── main.ts               # Plugin 入口
│   ├── settings.ts           # Settings Tab
│   ├── calendar/             # Calendar Module（原 navi-calendar）
│   │   ├── FullCalendarView.ts
│   │   ├── MiniCalendarView.ts
│   │   ├── TaskWidget.ts
│   │   └── index.ts
│   ├── lifeos/               # Life OS 新功能
│   │   ├── commands.ts       # Command Palette 命令
│   │   ├── ribbon.ts         # Ribbon 圖標
│   │   ├── periodic-notes.ts # 週期性筆記建立
│   │   ├── task-creator.ts   # 任務建立
│   │   └── index.ts
│   ├── settings/
│   │   ├── GeneralSettings.ts
│   │   ├── FolderSettings.ts
│   │   ├── TemplateSettings.ts
│   │   └── CalendarSettings.ts
│   └── types/
│       └── index.ts          # 共用型別定義
├── styles.css                # Plugin 樣式
└── assets/
    └── icons/                # 圖標資源
```

### 8.2 Vault 資料夾結構

```
Navi Helios/
├── 20_Life_Planning/
│   ├── 21_Journsal/          # Daily/Weekly/Monthly Notes
│   ├── 22_Area/               # Area 筆記
│   │   ├── Area_MOC.md
│   │   ├── 職業發展.md
│   │   ├── 財務自由.md
│   │   ├── 身心健康.md
│   │   ├── 關係家庭.md
│   │   └── 自我成長.md
│   ├── 23_Goal/               # Goal 筆記
│   │   └── Goal_MOC.md
│   ├── 24_Arena-Integration/  # Arena 銜接（可選）
│   ├── Task/                  # Task 筆記
│   └── Life-OS-MOC.md         # Life OS 總覽
├── 30_Projects/               # Project 筆記
│   └── Project_MOC.md
├── 80_System/
│   ├── 81_Template/          # 模板檔案
│   │   ├── Daily.md
│   │   ├── OS-每週覆盤.md
│   │   ├── 項目模板.md
│   │   └── 任務模板.md
│   └── 87_SystemDocs/         # 系統文件
│       ├── 人生OS使用手冊.md
│       └── navi-life-os-SPEC.md
└── .obsidian/
    └── plugins/
        └── navi-life-os/      # Plugin 安裝位置
```

---

## 9. 開發技術

### 9.1 技術棧

| 項目 | 選擇 | 理由 |
|------|------|------|
| 語言 | TypeScript | 型別安全，生態完整 |
| 建置工具 | esbuild | 速度快，設定簡單 |
| UI 框架 | 原生 Obsidian API | MVP 不需要 React |
| 日曆函式庫 | FullCalendar | navi-calendar 已使用 |
| 日期處理 | moment.js 或 date-fns | 跨語言日期計算 |
| 測試 | Jest | 單元測試 |

### 9.2 關鍵 Obsidian API

```typescript
// 生命周期
onload(): void
onunload(): void

// UI 組件
addRibbonIcon(icon: string, title: string, callback: (evt: MouseEvent) => void): void
addCommand(command: Command): void
addSettingTab(tab: SettingTab): void
addStatusBarItem(): HTMLElement

// 資料
loadData(): Promise<any>
saveData(data: any): Promise<void>

// 檔案操作
app.vault.create(path: string, content: string): Promise<TFile>
app.vault.modify(file: TFile, content: string): Promise<void>
app.vault.delete(file: TFile): Promise<void>
app.vault.getAbstractFileByPath(path: string): TAbstractFile

// 視圖
registerView(type: string, viewCreator: (leaf: WorkspaceLeaf) => View): void

// Metadata
app.metadataCache.getFirstLinkpathDest(linkpath: string, sourcePath: string): TFile | null
```

---

## 10. Navi 插件體系擴展策略

### 10.1 生態藍圖

```
階段一（v1.0 — MVP）
├── navi-calendar ──→ 整合進入 navi-life-os
│   └── CalendarModule
└── 完成核心週期性筆記 + Ribbon + Commands

階段二（v1.1 — 執行層）
├── Goal Progress Tracking（Goal 的專案/任務達成率）
├── Area Dashboard（Dataview + CSS 實作五宮格視圖）
└── Task Quick-create（增強的任务建立 flow）

階段三（v1.2+ — 生態擴展）
├── navi-life-os（核心，橫向整合所有模組）
├── navi-content-os（內容創作垂直插件）
└── navi-finance-os（財務追蹤垂直插件，可選）
```

### 10.2 橫向擴展原則

當要新增一個垂直領域（如 finance、health）時：

1. **Plugin 層**：新建獨立 plugin，繼承 navi-life-os 的設定結構
2. **Template 層**：在對應 `30_Projects/` 或 `20_Life_Planning/` 下建立資料夾
3. **Dataview 層**：與 navi-life-os 共享同一查詢語法
4. **不重複**：Plugin 各自獨立，但共享 vault 資料結構

### 10.3 開源插件客製化層

| 開源插件 | 我們的客製化疊加 |
|---------|--------------|
| **Dataview** | 自訂查詢模板（Goal 達成率、Area 統計）封裝進 Plugin |
| **Tasks** | 任務建立 command 統一封裝，設定預設值 |
| **Templater** | 變數替換由 Plugin 自己實作，不依賴 |
| **periodic-para** | 我們的日記格式（能量/象限/MIT）取代預設模板 |

---

## 11. periodic-para 整合方式

navi-life-os **整合 periodic-para** 而非取代它：

### 11.1 periodic-para 提供的功能

- 自動建立 Daily / Weekly / Monthly / Quarterly / Yearly Note
- 自動路徑管理
- 自動模板填充

### 11.2 我們的差異化

| 功能 | periodic-para 預設 | navi-life-os 客製化 |
|------|-----------------|-----------------|
| 日記路徑 | `Journal/daily/YYYY-MM-DD.md` | `20_Life_Planning/21_Journsal/YYYY-MM-DD.md` |
| 日記模板 | 空白或簡單模板 | Daily.md（能量校準/MIT/柳比歇夫/晚間覆盤） |
| 任務語法 | 無 | Tasks Plugin 語法（`- [ ]`） |
| Area 關聯 | 無 | frontmatter `area: [[AreaName]]` |
| HUMAN 象限 | 無 | frontmatter `human_quadrant` |

### 11.3 整合策略

**建議（兩種模式可選）：**

**模式 A（推薦）：Plugin 完全自己實作**
- 不依賴 periodic-para
- Plugin 自己處理路徑、模板變數、日期計算
- 好處：完全掌控，不受第三方影響

**模式 B：與 periodic-para 共存**
- periodic-para 負責建立空白週期性筆記
- 我們的模板確保內容結構正確
- 需要額外設定 periodic-para 的模板路徑

> ⚠️ 模式 A 是長期推薦方向。模式 B 可作為過渡。

---

## 12. Migration Guide（從 navi-calendar 遷移）

### 12.1 遷移前提

- 已有 `navi-calendar` v0.3.7 安裝並啟用
- vault 中已有 `navi-calendar` 的資料

### 12.2 遷移步驟

**Step 1：備份**
```bash
cp -r ~/.obsidian/plugins/navi-calendar ~/.obsidian/plugins/navi-calendar.backup
```

**Step 2：停用 navi-calendar**
在 Obsidian Community Plugins 中停用 `navi-calendar`

**Step 3：安裝 navi-life-os**
將新的 navi-life-os plugin 安裝到 `.obsidian/plugins/navi-life-os/`

**Step 4：遷移設定**
Plugin 啟動後，設定面板中：
- 確認 Journal Folder 路徑
- 確認 Calendar 設定（view、firstDayOfWeek 等）
- 確認 Ribbon 行為

**Step 5：驗證**
- [ ] 開啟今日日誌（Ribbon 單擊）
- [ ] `navi-life-os:open-daily` 命令正常
- [ ] Calendar 視圖正常顯示
- [ ] 既有日曆資料完整

**Step 6：解除安裝 navi-calendar（確認無問題後）**
- 從 `.obsidian/plugins/` 刪除 `navi-calendar` 資料夾

### 12.3 回滾方式

```bash
# 停止 navi-life-os
rm -rf ~/.obsidian/plugins/navi-life-os

# 恢復 navi-calendar
cp -r ~/.obsidian/plugins/navi-calendar.backup ~/.obsidian/plugins/navi-calendar
```

---

## 13. 驗收標準（MVP 完成條件）

### 13.1 MVP 定義

v1.0 完成標準：以下所有項目都必須通過

#### 功能驗收

| ID | 功能 | 驗收方式 |
|----|------|---------|
| V1 | Calendar 視圖正常顯示 | 打開月度視圖，日曆正確渲染，沒有 JS 錯誤 |
| V2 | Ribbon 單擊開啟/建立今日日誌 | 單擊圖標，今日日記存在或已建立 |
| V3 | `navi-life-os:open-daily` 命令 | Command Palette 輸入，執行後今日日誌正確開啟 |
| V4 | `navi-life-os:open-weekly` 命令 | 執行後本週日誌正確開啟（YYYY-Www 格式） |
| V5 | `navi-life-os:open-monthly` 命令 | 執行後本月日誌正確開啟（YYYY-MM 格式） |
| V6 | `navi-life-os:new-task` 命令 | 建立新任務，正確寫入 Task 資料夾，frontmatter 正確 |
| V7 | Settings Tab 正常顯示 | 所有設定分類正常渲染，設定可儲存 |
| V8 | Plugin 不報錯 | Console 無 `Uncaught` 錯誤 |

#### 資料驗收

| ID | 項目 | 驗收方式 |
|----|------|---------|
| V9 | 既有日曆資料完整 | navi-calendar 的舊日曆資料仍可正常讀取 |
| V10 | Daily 模板正確應用 | 新建的 Daily Note 包含能量校準/MIT/柳比歇夫區塊 |
| V11 | Dataview 查詢正常 | Goal MOC / Area MOC 的 Dataview TABLE 正常渲染 |

### 13.2 測試矩陣

| 環境 | 預期結果 |
|------|---------|
| 全新 vault（無任何設定） | Plugin 正常啟動，設定使用預設值 |
| 已有 navi-calendar 資料的 vault | 資料完整遷移，功能全部正常 |
| 同時安裝 periodic-para | 兩者不衝突，各自正常運作 |

### 13.3 發布前檢查清單

- [ ] 所有 V1-V11 測試通過
- [ ] 三種環境測試矩陣全部通過
- [ ] `manifest.json` 版本號為 `1.0.0`
- [ ] README.md 已更新（功能說明 + 安裝方式）
- [ ] Git tag 已打好：`git tag v1.0.0`

---

## 14. 詞彙表

| 術語 | 定義 |
|------|------|
| **Goal** | 戰略層目標，跨 Area、跨 Projects，通常是年度或季度 |
| **Project** | 戰術層專案，屬於特定 Area，有明確里程碑 |
| **Task** | 執行層任務，歸屬於 Project，具體可執行的行動 |
| **Area** | 人生領域，長期需要維持標準的範疇（5個：職業/財務/健康/關係/成長） |
| **五宮格** | Area 的五宮格視覺化，呈現人生維度平衡 |
| **Periodic Note** | 週期性筆記：日/週/月/季/年日記 |
| **Ritual** | 每日/每週固定執行的儀式化行為（如早晨設定 MIT） |
| **MIT** | Most Important Task，每日最重要的一件事 |
| **HUMAN 3.0** | 四象限框架：Mind/Body/Spirit/Vocation |
| **PARA** | Projects/Areas/Resources/Archives，另一種個人信息管理方法 |
| **Navi 插件體系** | 以 navi-life-os 為核心，橫向擴展的 Obsidian 插件生態 |
| **CalendarModule** | navi-life-os 中負責日曆視圖的子模組（原 navi-calendar 整合而來） |

---

## 15. 參考資料

- [Obsidian Plugin API Documentation](https://docs.obsidian.md/Plugins/API)
- [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [navi-calendar (現有)](file:///mnt/c/Users/安泰/OneDrive/Obsidian/Navi%20Helios/.obsidian/plugins/navi-calendar/)
- [periodic-para (YiBing Lin)](https://github.com/quanru/obsidian-example-LifeOS) — 2024 Obsidian Gems of the Year 第三名
- [PARA Method — Forte Labs](https://fortelabs.com/blog/para/)
- [Dataview Plugin](https://blacksmithgu.github.io/obsidian-dataview/)
- [Tasks Plugin](https://obsidian-tasks-group.github.io/obsidian-tasks/)
- [Templater Plugin](https://silentvoid13.github.io/Templater/)
