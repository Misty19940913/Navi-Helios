# Area：Navi Calendar Plugin 開發

> 蒸餾自 2026-04-27 ~ 2026-04-29 session 叢集（plugin-studies + navi-calendar code review）

---

## 現況

| 項目 | 值 |
|------|-----|
| Repo | `Misty19940913/navi-calendar` |
| Dev path | `~/plugin-studies/navi-calendar` ⚠️ 不再放 `/tmp` |
| Task folder | `tasks/` |
| GitHub token | `ghp_Rg...MclX`（在 `~/.bashrc` 的 `GITHUB_TOKEN`） |
| Release ID | v0.3.4 = `314166187` |
| Latest commit | `c210ba8`（單擊日期顯示選單）|

---

## 技術棧

- Obsidian Plugin API
- FullCalendar：`@fullcalendar/core`, `daygrid`, `timegrid`, `list`, `interaction`, `multimonth`
- `date-fns`：日期處理
- esbuild 編譯：`node esbuild.config.mjs production`

---

## ⚠️ Critical：esbuild Cache 導致 Silent No-op Build

**問題：** `npm run build` 顯示成功，但 `main.js` 內容不變，新功能部署後看不到效果。

**根本原因：**
`tsc -noEmit --skipLibCheck && node esbuild.config.mjs production` 組合下，TypeScript 只做類型檢查不產生輸出，esbuild 看到「所有輸入時間戳都早於已存在輸出」，直接返回 success 但不寫入。

**修復方法：**
```bash
# 先刪輸出檔再 build
rm -f main.js && npm run build

# 或修改 package.json
"build": "rm -f main.js && tsc -noEmit --skipLibCheck && node esbuild.config.mjs production"
```

**驗證方法：**
```bash
# 檢查 mtime 是否為「現在」
ls -la main.js

# 確認新符號在產物中
strings main.js | grep -c "NewSymbolName"
```

---

## Current Architecture

```
src/
├── main.ts                  ← NaviCalendarPlugin (627行)
├── modals/
│   ├── TaskCreationModal.ts ← 150行，無 Action Bar
│   └── TaskEditModal.ts     ← 142行，無 Dependencies UI
├── views/
│   ├── CalendarView.ts      ← FullCalendar 主視圖（504行）
│   ├── MiniCalendarView.ts  ← 34行，Phase 4 placeholder
│   └── TimelineView.ts     ← Timeline 視圖
├── services/
│   └── TaskService.ts      ← 645行，CRUD + parsing
└── types.ts                 ← 173行
```

---

## 已定義但未實作的功能

| 功能 | types.ts 定義 | TaskService 實作 |
|------|--------------|-----------------|
| `blockedBy: string[]` | ✅ | ❌ `parseTaskLine()` 只解析成空陣列 |
| `blockedByDependency` | ✅ | ❌ 未使用 |
| `TaskDependency` (reltypes) | ✅ | ❌ 未使用 |
| `projects?: string[]` | ✅ | ❌ |
| MiniCalendarView | — | Phase 4，尚未實作 |
| CodeMirror Live Preview | — | Phase 2，Reading mode processor 單獨處理 |

---

## TaskInfo types.ts 現況

```typescript
interface TaskInfo {
  title: string;
  path: string;
  status: string;
  due?: string;
  scheduled?: string;
  start?: string;
  priority?: string;
  blockedBy: string[];
  blockedByDependency?: TaskDependency[];  // 有定義
  projects?: string[];                      // 有定義
  subtasks?: string[];
  recurrence?: string;
}
```

---

## 已知的 WikiLink 渲染失敗問題

**`readTaskInfoFromFile()` wikilink 渲染失敗：**
- WikiLinks `[[tasks/買早餐]]` 在 Live Preview 無法渲染 task card
- 根本原因：檢查 `fm.type === "task"` 或 `fm.tags.includes("task")`，若 frontmatter 缺少這些就返回 `null`
- 修復方向：使用 `TaskService.getAllTasks()` 做路徑匹配，而非純 frontmatter 檢測

---

## blockedBy YAML 註釋陷阱

```typescript
// ❌ 錯誤 — # 在 array 元素中被當作 YAML 註釋
lines[i] = `${m[1]}${key}: [${value.map((item) => \`#${item}\`).join(', ')}]`;

// ✅ 正確 — 包含 # 的字串要引號
lines[i] = `${m[1]}${key}: [${value.map((item) => \`"#${item}"\`).join(', ')}]`;
// 輸出: blockedBy: ["#task/abc", "#task/def"]
```

---

## deleteTaskEnhanced 未被呼叫

`TaskService` 有 `deleteTaskEnhanced()`，能正確清理 `blockedBy`/`blocking`/`subtasks` 引用。但 `TaskEditModal.delete()` 和 command handler 都呼叫的是一般的 `deleteTask()`，遺留 orphan 參照。

---

## Task ID 格式

```
{path}:{lineNumber}
```

例：`tasks/買早餐.md:3`

---

## Status 設定

```typescript
{
  " ": { symbol: " ", label: "Todo" },
  "x": { symbol: "x", label: "Done" },
  ">": { symbol: ">", label: "In Progress" },
  "!": { symbol: "!", label: "Cancelled" }
}
```

---

## Emoji Indicators

| 用途 | Emoji |
|------|-------|
| Due date | 📅 |
| Scheduled | ⏰ |
| High priority | 🔴 |
| Medium priority | 🟡 |
| Low priority | 🟢 |
| Urgent | 🟣 |

---

## 已建立但未完成

| 項目 | 狀態 |
|------|------|
| `src/kanban/TaskKanbanView.ts` | 已建立但未完整實作 |
| `task_plan.md` (739行) | 存在但落後於現狀 |
| WikiLink 渲染修復 | 已知但未實作 |
| `deleteTaskEnhanced()` 全面替換 | 已知但未實作 |

---

## 實驗發現（confirmed patterns）

|| Pattern | 驗證次數 | 檔案 |
|---------|---------|------|
| esbuild cache silent no-op → 先 `rm -f main.js` | 2+ | areas/navi-calendar.md |
| Widget DOM 全用 `span` | 3+ | areas/rendering.md |
| CustomEvent + ViewPlugin 解耦合 | 3+ | areas/rendering.md |
| `[field, plugin]` 回傳陣列 | 2+ | areas/rendering.md |
| Component + registerEvent (reading mode) | 2+ | areas/rendering.md |
| blockedBy YAML # 引用問題 | 1 | session 20260429 |

---

## [SESSION_20260426_174703] Phase 0+1+2 完成部署，用戶抱怨看不見 ribbon

### 完成狀態
- 部署至 Vault：`.obsidian/plugins/navi-calendar/`（main.js 325KB, manifest.json, styles.css）
- 已實作：日/周/月/列表視圖、CRUD、拖放調整、AI Command System、Settings Tab、Open Direction、即時刷新
- Phase 3/4（Timeline/Mini）為占位

### 用戶需求確認
- 功能選項：C（完整款：日/周/月 + Timeline + 迷你日曆）
- 整合深度：③（完全整合：讀寫 + 狀態變更 + 拖放更新 + AI 操作）
- blockedBy 依賴：使用者「不太了解」，需後續補充
- 點擊日期開啟位置：預設新 Split（右側），設定頁面提供 3 種選項
- 日曆文件路徑：不預設，要求使用者輸入

### 用戶抱怨看不見側邊欄按鍵
- 需在 Obsidian 中 reload + 打開 DevTools Console (`Ctrl+Shift+I`) 檢查 console.log 追蹤
- 添加了 onload → validateRequiredSettings → activateMainCalendarView → CalendarView constructor → onOpen 的 console.log

### 關鍵教訓
- EPERM 錯誤：Node.js copyFile 在某些情況有 permission issue → 改用直接 `cp` 命令繞過
- Vault 含空格路徑需引號：`"/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/"`
