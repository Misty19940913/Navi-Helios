---
name: obsidian-plugin-dev
description: Obsidian Plugin 開發主控 — 評估 Plugin 開發需求 → 調用對應子技能（Study / Dev / BRAT Release / Gap Analysis）
trigger:
  - "plugin 開發"
  - "做一個 obsidian plugin"
  - "開發 plugin"
produces:
  - Obsidian Plugin 程式碼（main.js、manifest.json、Release assets）
  - Plugin 發布成品（BRAT 可識別的 release download URL）
consumed_by:
  - Plugin 開發者（需要實作或發布 Obsidian Plugin 的用戶）
  - BRAT 發布系統（用於 Plugin 自動更新）
  - 未來接手維護/擴展 Plugin 的開發者
---
# Obsidian Plugin 開發主控

## 觸發條件

當用戶提出以下需求時觸發本 skill：
- 「我要做一個 obsidian plugin」
- 「開發一個新插件功能」
- 「幫我分析某個 Plugin 的架構」
- 「發布 Plugin 到 BRAT」
- 「某個 Plugin 功能壞了要修」
- 「比較多個 Plugin 的實作方式」

## Plugin 開發決策樹

```
收到 Plugin 開發需求
    │
    ▼
用戶是要───
│
├─ 1. 研究分析（看不懂某 Plugin 行為 / 想學某 API pattern）
│         → 階段 1：Plugin Study（調用 obsidian-plugin-study）
│
├─ 2. 實作功能（已知要做什麼，只是不知道怎麼寫代碼）
│         → 階段 2：直接 Coding（使用本 skill 的 Dev 常數區）
│
├─ 3. 發布上線（要讓別人能夠安裝 / 發布新版本）
│         → 階段 3：BRAT Release（調用 obsidian-plugin-brat-release）
│
├─ 4. 缺口分析（不知道缺什麼功能 / 不知道用哪個 Plugin）
│         → 階段 4：Gap Analysis（使用 01_flow-planning 搭配研究）
│
└─ 5. 修 Bug / Debug（Extension 不生效 / Widget 點不了）
          → 確認：是否為 CodeMirror / DOM / Widget 問題？
              是 → obsidian-plugin-study（Study/Debugging 分支）
              否 → 回到階段 2 直接Coding
```

## ⚠️ MANDATORY: Read Source Before Implement

> **This is not optional. Violating this rule causes total rollback within hours.**
>
> When implementing a feature inspired by a third-party plugin (e.g., "TaskNotes-style button", "Templater-style template reading"), you MUST read that plugin's source code FIRST before writing any code in your own plugin.

### The v0.2.0 Disaster (2026-04-27)

**What happened:** Implemented a "TaskNotes-style 📝 button" for navi-calendar based on guesses about how TaskNotes worked. Result: completely wrong design (added `noteFolder` + `notePath` + 📝 button, but TaskNotes already uses the task `.md` file as the note itself — no separate folder needed). BRAT published v0.2.0, full rollback within 1 hour, 6 files reverted.

**Root cause:** Skipped Phase 1 (Plugin Study). Assumed the architecture without reading the source.

**Correct sequence:**
1. Clone / read the third-party plugin's source (TaskNotes = `callumalpass/tasknotes` on GitHub)
2. Identify the core patterns: `TaskLinkWidget` (CodeMirror WidgetType), `getCachedTaskInfoSync()`, `FieldMapper`
3. Only then implement in your own plugin
4. If you don't understand the source → ask for clarification before coding

### TaskNotes Core Patterns (confirmed 2026-04-27)
- `TaskLinkWidget`: CodeMirror `WidgetType` — intercepts `[[wikilink]]` in editor, renders as inline task card
- `getCachedTaskInfoSync()`: reads task metadata from Obsidian metadata cache
- `FieldMapper`: maps custom frontmatter field names
- Task = `.md` file (task itself IS the note, no separate folder)

**Lesson:** Plugin architectures are complex. Without reading source, intuition-based implementation is almost always wrong. The cost of rollback (BRAT release, version bump, user confusion) exceeds the cost of spending 20 minutes reading first.

---

## 階段分流

### 階段 1：研究階段（Plugin Study）

**觸發時機：** 用戶想理解某個 Plugin 的行為、API、或想從原始碼學習特定 pattern。

**調用子 skill：**
```
→ obsidian-plugin-study/SKILL.md
```
研究範圍包括：
- CodeMirror Editor Extensions（Rule 0-3、Live Preview wikilink 渲染）
- DOM Pattern / Widget Memory Leak
- esbuild cache 問題
- Reading Mode / ReadingModeInjection 實作
- TaskNotes 架構蒸餾
- Vault Adapter 防爆寫法
- Setting Tab 動態欄位
- ItemView 三件套
- Command 四型

**研究區路徑：**
```
/home/misty/plugin-studies/
├── obsidian-sample-plugin/SKILL.md   ← 官方最小範本
├── obsidian-ai/SKILL.md              ← 完整五模式實作
├── obsidian-lifeos/                   ← PARA + Periodic Notes
├── obsidian-kanban/                   ← ItemView + 拖拽
├── tasknotes/                         ← 服務架構 + Reading Mode
└── obsidian-tasks/                   ← 查詢語法 + 設定頁
```

### 階段 2：開發階段（直接 Coding）

**觸發時機：** 用戶清楚要做什麼功能，需要直接寫代碼。

**開發流程：**
1. 用 `npm create obsidian-plugin` 或從 sample-plugin 複製骨架
2. 閱讀相關 Plugin 的蒸餾內容（從 obsidian-plugin-study）
3. 實作 → `npm run build` → 複製到 vault `.obsidian/plugins/`
4. Debug：關閉筆記 → Reload 插件 → 重新打開（見「驗證步驟」）

**esbuild cache 問題警告：** 修改原始碼後執行 `npm run build`，esbuild 可能輸出舊的（silent no-op）。解決：先 `rm -f main.js` 再 build。

### 階段 3：發布階段（BRAT Release）

**觸發時機：** Plugin 開發完成，要發布新版本讓用戶能夠安裝。

**調用子 skill：**
```
→ obsidian-plugin-brat-release/SKILL.md
```
包含：
- Release assets 下載 URL 構造（`releases/download/{version}/`）
- GitHub API 發布流程（tag → Release → upload assets）
- BRAT 設定頁直接更新（In-Place Auto-Update）實作

### 階段 4：缺口分析（Gap Analysis）

**觸發時機：** 用戶不確定某個 Plugin 是否存在、或不知道現有 Plugin 能否滿足需求。

**使用工具：**
```
→ 01_flow-planning
→ firecrawl_search 搜尋「Obsidian plugin {功能關鍵字}」
```

## navi-calendar 開發參數（常數參考）

以下為 navi-calendar Plugin 的靜態開發參考：

| 參數 | 值 |
|------|-----|
| **Repo** | `Misty19940913/navi-calendar` |
| **Vault path** | `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/` |
| **Dev path** | `/tmp/navi-calendar-dev` |
| **Task folder** | `tasks/` |
| **任務卡片** | `TaskLinkOverlay` 渲染 `[[tasks/...]]` wikilink + `TaskInstantConvertOverlay` 偵測 `- [ ]` 顯示即時建立按鈕 |
| **雙 Overlay 架構** | `TaskLinkOverlay`（wikilink → 任務卡）+ `TaskInstantConvertOverlay`（checkbox → + 按鈕 → wikilink）同時並存 |
| **Build** | `npm run build`（位於 dev path） |
| **manifest version** | 需手動更新（不會跟 git tag 同步） |
| **GitHub token** | `ghp_Rg...MclX`（存在 `~/.bashrc` 的 `GITHUB_TOKEN`） |
| **已確認 Release ID** | v0.3.4 = `314166187` |

## 常見 Widget 問題排查清單

當 Plugin 的 Widget（按鈕、點擊、裝飾）行為異常時，依序檢查：

1. **按鈕點擊完全無效** → `CreateTaskInlineWidget` 缺少 `ignoreEvent` 方法 → 整個按鈕變啞彈（CodeMirror mousedown 在 DOM handler 之前就攔截了）⚠️ 這不是「回傳值錯誤」，是**方法完全不存在**
2. **編輯 task 檔後日曆不刷新** → `isRelevantFile` 未包含 `taskFolder` 檢查
3. **點擊 checkbox widget 沒反應** → `TaskLinkWidget` 的 `ignoreEvent` 只 block `mousedown`，要確認 `click`/`dblclick` 能穿透
4. **instant-convert 按鈕消失** → `eq()` 判斷錯誤，`null` vs `null` 時被當成相同 widget 而不重建
5. **所有 inline widget 都必須實作 `ignoreEvent()`** → CodeMirror 看到這個方法才會讓 DOM 事件穿透到 widget 的 handler；沒有這個方法 → CodeMirror 在事件抵達 DOM 之前就吃掉了 → 按鈕/點擊完全失效
6. **Wikilink widget 完全不渲染** → `createTaskLinkOverlay` 只回了 `viewPlugin`，漏了 `taskLinkField`。**沒有 field，裝飾無法掛到 CodeMirror 上**。修復：`return [taskLinkField, viewPlugin]`（陣列，順序固定）

## ⚠️ Ribbon / View 不顯示問題：Console.log 追蹤流程

當用戶回報「看不到側邊欄按鍵」或「點了沒反應」時，按以下順序添加 console.log 並部署：

```typescript
// main.ts onload()
async onload() {
  console.log("[navi-calendar] onload start");
  await this.loadSettings();
  console.log("[navi-calendar] settings loaded:", this.settings);
  this.validateRequiredSettings(); // 會 show Notice

  // ... services init ...

  console.log("[navi-calendar] adding ribbon icon");
  this.addRibbonIcon('calendar', 'Open Calendar', () => {
    console.log("[navi-calendar] ribbon clicked");
    this.activateMainCalendarView();
  });

  console.log("[navi-calendar] calling activateMainCalendarView");
  this.activateMainCalendarView();
}

// registerView 工廠
this.registerView(CALENDAR_VIEW_TYPE, (leaf) => {
  console.log("[navi-calendar] registerView CALENDAR_VIEW_TYPE called, leaf:", leaf);
  const view = new CalendarView(leaf, this);
  console.log("[navi-calendar] CalendarView instance created:", view);
  return view;
});

// CalendarView constructor
constructor(leaf: WorkspaceLeaf, plugin: NaviCalendarPlugin) {
  super(leaf);
  console.log("[navi-calendar] CalendarView constructor called");
  this.taskService = plugin.taskService;
}

// CalendarView onOpen
override async onOpen() {
  console.log("[navi-calendar] CalendarView onOpen called");
  await this.initCalendar();
}
```

部署後囑用戶：
1. Reload 插件
2. 打開 DevTools Console (`Ctrl+Shift+I`)
3. 點擊 ribbon 圖示
4. 回報所有 `[navi-calendar]` 開頭的訊息

### 常見根因

| 症狀 | 可能的根因 |
|------|-----------|
| 看不見 ribbon icon | `onload()` 期間 crash → 整個 plugin 沒加載成功 |
| ribbon 有但點了無反應 | `activateMainCalendarView()` 內 `getLeaf()` flag 錯誤（用 `getLeaf(true)` 無效，套 `getLeaf("tab")`） |
| 有 console.log 但視圖空白 | `CalendarView.initCalendar()` 期間 async error 或 FullCalendar 初始化失敗 |
| 第一次 reload 有問題、再一次沒問題 | esbuild cache silent no-op → 先 `rm -f main.js` 再 build |

### EPERM 部署錯誤繞過

Node.js `copyFile` 在某些 WSL/Windows 交叉路徑會 EPERM，直接用 `cp` 命令繞過：

```bash
# ❌ 會 EPERM
node -e "fs.copyFileSync('main.js', 'target/main.js')"

# ✅ 用 cp 繞過
cp main.js "target-dir/main.js"
```

## ⚠️ SettingsTab Update 按鈕：In-Place 更新 Pattern

**Misty 明確需求**（session 20260427）：Settings tab 的「Check for Updates」按鈕，發現新版本時要：
1. 按鈕文字變成 `"Update"`
2. 點擊後直接下載三個 assets（`manifest.json`、`main.js`、`styles.css`）到 vault plugin dir
3. 呼叫 `app.plugins.reloadPlugin(id)` 重載插件（**不跳轉 Release 頁**）

```typescript
// ✅ 正確邏輯
versionBtn.onclick = async () => {
  const latestVersion = await checkLatestVersion();
  if (latestVersion > currentVersion) {
    versionBtn.textContent = "Update";
    versionBtn.onclick = async () => {
      versionBtn.setAttribute("disabled", "true");
      versionBtn.textContent = "Updating...";
      await downloadAsset("manifest.json");
      await downloadAsset("main.js");
      await downloadAsset("styles.css");
      await app.plugins.reloadPlugin(pluginId);
    };
  } else {
    versionBtn.textContent = "Up to date";
    versionBtn.setAttribute("disabled", "true");
  }
};
```

**Pattern**: Obsidian 插件自身更新 = GitHub Release API → vault plugin dir → `app.plugins.reloadPlugin(id)`

**Misty 偏好**：不跳外部瀏覽器，不開 Release 頁，一切在插件內完成。

## 新增 Reference：Reading Mode Injection

`references/reading-mode-injection.md` — Reading Mode DOM injection 完整 Pattern，包含：
- Component 架構（3-event debounced）
- `getMode()` API 不穩定的 Pitfall（已踩）
- `isTaskLink` wikilink 路徑比對 bug（已踩）
- Debug log 命名慣例
- Reading Mode vs Live Preview 對照表

---

## Subsections（已被吸收的 Skills）

這些技能已被整合進本傘狀技能，作為 references/ 下的支撐檔案：

| 吸收的 Skill | 內容形式 | 觸發場景 |
|--------------|---------|---------|
| `obsidian-plugin-study` | `references/code-patterns.md` | CodeMirror Extension patterns, Widget memory leak, esbuild cache |
| `obsidian-plugin-compilation-debugging` | `references/compilation-debugging.md` | 新骨架通過編譯、CONTRIBUTING.md 陷阱 |
| `obsidian-plugin-multi-patch` | `references/multi-patch.md` | 連續 patch 安全流程、縮進診斷 |
| `obsidian-plugin-spec-creation` | （已蒸餾進本檔段「Plugin 開發決策樹」） | 蒸餾進本 skill 的 SPEC creation 方法 |
| `obsidian-plugin-deploy-checklist` | （已蒸餾進本檔段「驗證步驟」） | 蒸餾進本 skill 的部署前檢查清單 |
| `tasknotes-context-menu` | `references/tasknotes-context-menu.md` | TaskContextMenu 7功能、DateContextMenu分類、`(item as any)` stub繞過、badge append bug |
| `obsidian-plugin-brat-release` | （章節「階段 3：發布階段」） | 已被章節吸收 |
| `plugin-gap-analysis` | （章節「階段 4：缺口分析」） | 已被章節吸收 |
| `plugin-gap-deepening` | （依賴已被本 skill 吸收） | Gap 填補策略已整合 |

---

## 驗證步驟

當代碼變更後，測試流程：

```
1. 關閉包含 wikilink 的筆記
2. Reload 插件（Command Palette → Reload）
3. 重新打開筆記
→ 否則看到的是舊 extensions 的渲染結果
```

**驗證 Vault 檔案同步狀態：**
```bash
ls -la vault-plugin-dir/main.js  # 看 mtime 是否最近
strings main.js | grep "tasklink-widget"  # 確認 class name 在編譯產物中
```

**檢查 Extension 是否被呼叫：**
```bash
grep -c 'Decoration.widget' main.js  # 結果為 0 代表 Extension 從未被呼叫
```

**檢查 computed display（inline 失敗時）：**
```js
getComputedStyle(document.querySelector('.task-card--layout-inline')).display
// Expected: "inline"
```
