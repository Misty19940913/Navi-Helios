# Task Plan：Navi Calendar Plugin

**Status**: `approved`
**Created**: 2026-04-26
**Version**: 1.0

---

## Goal

在 Obsidian 內建立一個完整的日曆插件，整合 Life OS 的 Goal → Project → Task 框架，提供日/周/月/Timeline 視圖，支援任務完全整合（讀寫、拖放、編輯）。

---

## Assumptions

### 已確認
- ✅ 插件名稱：`navi-calendar`
- ✅ 視圖類型：完整款（日/周/月 + Timeline + 迷你日曆）
- ✅ 任務整合：完全整合（讀寫 + 狀態變更 + 拖放更新）
- ✅ 主要使用情境：方便任務拖曳 + 任務編輯
- ✅ 開發起點：`obsidian-sample-plugin-master` TypeScript 源码
- ✅ 技術棧：TypeScript + Svelte + `@fullcalendar/core` + `date-fns`
- ✅ Vault 路徑：`/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`
- ✅ 日曆引擎：`@fullcalendar/core` + dayGrid/timeGrid/list/interaction/multimonth plugins

### 待驗證
- ❓ FullCalendar 與 Obsidian 的 CSS 樣式是否衝突（Phase 0 實作時驗證）
- ❓ TaskInfo 的 `blockedBy` / `isBlocked` 依賴關係在日曆 UI 如何呈現（Phase 2 決定）

---

## Scope

### 包含
- 日/周/月（`dayGridMonth` / `timeGridWeek` / `timeGridDay`）視圖
- Timeline 時間軸視圖（豎立時間線）
- 迷你日曆（側邊欄用）
- 任務完全整合：建立、讀取、編輯、刪除、拖放改日期
- 即時刷新： vault 檔案變更監聽
- 視圖狀態保存：關閉/重開保持上次視圖

### 不包含（Phase 4+ 以後）
- Google Calendar / Microsoft Calendar 同步
- 週期性整理報告
- Bases / 花園盒子整合（可擴展預留 API）

---

## Architecture

```
navi-calendar/
├── main.ts                    # Plugin entry, onload/onunload, 服務初始化
├── types.ts                   # TaskInfo, CalendarEvent, ViewState types
├── settings/
│   ├── settings.ts            # Settings tab UI (Svelte)
│   └── defaults.ts            # DEFAULT_SETTINGS
├── views/
│   ├── CalendarView.ts        # FullCalendar 日/周/月 主視圖
│   ├── TimelineView.ts         # Timeline 時間軸視圖
│   └── MiniCalendarView.ts    # 迷你月曆（側邊欄用）
├── services/
│   ├── TaskService.ts          # Task CRUD，日曆事件讀取/寫入
│   ├── ViewStateManager.ts     # 視圖狀態保存/恢復
│   ├── DateNavigationService.ts # 日期導航邏輯
│   └── NotificationService.ts
├── utils/
│   ├── dateUtils.ts           # date-fns helpers
│   ├── TaskManager.ts         # Task cache + lookups
│   └── calendarUtils.ts       # FullCalendar event 格式轉換
├── ui/
│   ├── TaskCard.svelte         # 日曆內任務卡
│   ├── TimeBlockCard.svelte   # 日程區塊卡
│   └── CalendarHeader.svelte  # 視圖切換 Header
├── modals/
│   ├── TaskCreationModal.ts   # 新建任務
│   └── TaskEditModal.ts       # 編輯 / 完成 / 刪除 任務
└── styles.css                 # 插件樣式（Shadow DOM 隔離）
```

---

## Step-by-Step Plan

### Phase 0：環境建立
| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 0.1 | 建立 `/tmp/navi-calendar-dev/` 目錄結構 | `pending` | |
| 0.2 | `npm init -y` + 安裝依賴（fullcalendar, svelte, obsidian, date-fns, typescript, esbuild） | `pending` | |
| 0.3 | 從 sample-plugin 複製 `src/` 結構並調整 | `pending` | |
| 0.4 | esbuild dev/build script 設定 | `pending` | |
| 0.5 | copy-to-vault 脚本（開發時自動同步） | `pending` | |
| 0.6 | `npm run dev` 確認編譯通過 + Obsidian reload 驗證 | `pending` | |

### Phase 1：核心日曆視圖
| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 1.1 | TaskInfo type 定義（id, title, status, priority, due, scheduled, path, recurrence） | `pending` | |
| 1.2 | TaskService：vault task 讀取 → FullCalendar event 格式轉換 | `pending` | |
| 1.3 | CalendarView：初始化 FullCalendar（dayGridMonth 預設） | `pending` | |
| 1.4 | 視圖切換：日 / 周 / 月 / 列表（按鈕切換） | `pending` | |
| 1.5 | 點擊日 → 當日日曆文件（`journal/YYYY-MM-DD.md`） | `pending` | |
| 1.6 | 點擊任務 → TaskEditModal | `pending` | |

### Phase 2：任務完全整合
| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 2.1 | TaskCreationModal：在日曆上新建任務（自動填入點擊日期） | `pending` | |
| 2.2 | TaskEditModal：編輯 / 完成 / 刪除 任務 | `pending` | |
| 2.3 | 拖放任務到新日期 → 更新 `due` frontmatter | `pending` | 核心需求 |
| 2.4 | 拖放邊緣調整時間 → 更新 `scheduled` + 時間 | `pending` | |
| 2.5 | 即時刷新：vault 檔案變更監聽 → 日曆自動 refresh | `pending` | |
| 2.6 | 視圖狀態保存/恢復（上次視圖 + 日期） | `pending` | |

### Phase 3：Timeline 時間軸
| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 3.1 | TimelineView：以 `timeGrid` 為基礎的垂直時間軸 | `pending` | 核心需求 |
| 3.2 | 支援 `startTime` / `endTime` 的時間區塊 | `pending` | |
| 3.3 | 從 CalendarView 切換到 TimelineView | `pending` | |

### Phase 4：Mini 日曆
| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 4.1 | MiniCalendarView：側邊欄用迷你月曆 | `pending` | |
| 4.2 | 點擊迷你日曆日期 → 跳到主日曆視圖 | `pending` | |

### Phase 5：強化功能
| Step | Description | Status | Notes |
|------|-------------|--------|-------|
| 5.1 | 循環任務渲染（`recurrence` → FullCalendar rrule） | `pending` | |
| 5.2 | 任務狀態色彩（due/overdue/scheduled 視覺化） | `pending` | |
| 5.3 | Today Column 寬度（參考 TaskNotes `todayColumnWidthMultiplier`） | `pending` | |

---

## Files

| File | Role | Change Type |
|------|------|-------------|
| `.obsidian/plugins/navi-calendar/` | 插件根目錄 | new |
| `src/main.ts` | Plugin entry | new |
| `src/types.ts` | TaskInfo types | new |
| `src/views/CalendarView.ts` | FullCalendar 主視圖 | new |
| `src/views/TimelineView.ts` | Timeline 視圖 | new |
| `src/views/MiniCalendarView.ts` | 迷你日曆 | new |
| `src/services/TaskService.ts` | Task CRUD + 轉換 | new |
| `src/services/ViewStateManager.ts` | 視圖狀態 | new |
| `src/modals/TaskCreationModal.ts` | 新建任務 | new |
| `src/modals/TaskEditModal.ts` | 編輯/完成/刪除 | new |
| `src/utils/dateUtils.ts` | date-fns helpers | new |
| `src/ui/TaskCard.svelte` | 任務卡 UI | new |
| `src/styles.css` | 樣式 | new |

---

## Risks & Tradeoffs

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| FullCalendar CSS 與 Obsidian 衝突 | Medium | High | Shadow DOM 隔離；CSS `!important` 覆寫 |
| Vault 路徑含空格導致路徑問題 | Low | High | 全部路徑用引號，`normalizePath()` |
| 大量任務時效能問題 | Medium | Medium | TaskManager cache + debounce render（5秒策略） |
| 循環任務 RFC 5545 rrule 解析複雜 | Low | Medium | 先做簡單 recurrence，逐步支援 |
| TaskNotes 架構借鏡太重 | High | Medium | 只取 CalendarView.ts + TaskService.ts 核心，砍掉 Filter/Sync Service |

---

## Open Questions

| # | Question | Owner | Answer | Status |
|---|----------|-------|--------|--------|
| 1 | 任務 `blockedBy` 依賴在日曆上如何呈現？（阻擋圖示 / 灰色鎖定） | user | | open |
| 2 | 點擊日當日日曆文件時，要不要在同個視圖打開另一個面板？ | user | | open |
| 3 | 預設日曆文件路徑？（`journal/YYYY-MM-DD.md` 或其他） | user | | open |

---

## 技術決策記錄

1. **日曆引擎**：使用 `@fullcalendar/core` + 5 plugins — TaskNotes 已驗證可行
2. **UI 框架**：Svelte — 所有日曆插件都用，生態成熟
3. **TaskInfo 模型**：取 TaskNotes 簡化版，移除 Google/M365 sync 相關欄位
4. **Shadow DOM**：日曆 UI 隔離 Obsidian 全域樣式
