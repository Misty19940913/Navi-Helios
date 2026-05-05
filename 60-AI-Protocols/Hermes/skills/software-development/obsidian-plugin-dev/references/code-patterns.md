# Obsidian Plugin Code Patterns Reference

> Condensed from `obsidian-plugin-study` — CodeMirror Extension patterns distilled from TaskNotes.

## Rule 0: Extension 必須在 main.ts 註冊

```ts
// onload() 中——忘記這行 → Extension 存在但從未被載入
this.registerEditorExtension(TaskLinkOverlay.create(plugin));
```

**徵兆：** `Decoration.widget` 在原始碼中存在、build log 有輸出，但 wikilink 就是不渲染。
**確認方法：** `grep -c 'Decoration.widget' main.js`（結果為 0 代表 Extension 從未被呼叫）。

## Rule 0b: ViewPlugin + Decoration.replace 替換 wikilink 為 inline widget

```ts
// TaskLinkOverlay.ts — ViewPlugin + Decoration.replace 完整模式
import { ViewPlugin, Decoration, type DecorationSet, type EditorView } from "@codemirror/view";
import { StateField, StateEffect } from "@codemirror/state";

const refreshEffect = StateEffect.define<void>();

const taskLinkField = StateField.define<DecorationSet>({
  create() { return Decoration.none; },
  update(decos, tr) {
    decos = decos.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(refreshEffect)) {
        decos = this.buildDecorations(tr.state);
      }
    }
    return decos;
  },
  provide: (f) => EditorView.decorations.from(f),
  buildDecorations(state) {
    const builder = new RangeSetBuilder<Decoration>();
    // 每個 wikilink: Decoration.replace({ widget: new TaskLinkWidget(...), inclusive: true })
    return builder.finish();
  }
});

export const TaskLinkOverlay = ViewPlugin.fromClass(
  class extends PluginValue {
    decorations: DecorationSet;
    constructor(readonly view: EditorView) {
      super();
      this.decorations = taskLinkField.getDefaultState();
    }
    update(update: ViewUpdate) {
      this.decorations = taskLinkField.getState(update.state);
    }
    static create(plugin: MyPlugin) {
      return [taskLinkField, ViewPlugin.fromClass(class extends PluginValue {
        constructor(readonly view: EditorView) { super(); }
        update(update: ViewUpdate) {}
      })];
    }
  }
);
```

**`inclusive: true`** 讓游標不會掉進 widget 內部。

## Rule 1: 回傳 [field, plugin] 陣列

```ts
// ❌ 錯誤 — 只回 viewPlugin
return viewPlugin;

// ✅ 正確 — StateField 透過 provide: 掛到 EditorView.decorations
return [taskLinkField, viewPlugin];
```

## Rule 2: `Decoration.line` vs `Decoration.widget` — 兩種 Widget 附加方式

```ts
// Decoration.widget — 替換/附加在特定字元位置（inline wikilink 替換用）
Decoration.widget({ widget: myWidget, side: 1 });
// side: 1 = 在 position 之後；side: -1 = 在 position 之前

// Decoration.line — 在「行末」附加 widget（不改變文字，checkbox + 按鈕用）
Decoration.line({ widget: myWidget });
// widget 自動附加在 lineInfo.to（行末位置）
```

**何時用哪個：**
- `Decoration.replace` + `Decoration.widget` → 替換 wikilink 文字為任務卡
- `Decoration.line` → 在行末附加按鈕/裝飾，不替換任何文字

## Line-End Widget: `Decoration.line` + WidgetType（TaskInstantConvertOverlay pattern）

**使用場景：** 在一行**末尾**附加一個 inline 按鈕，不替換文字。TaskInstantConvertOverlay 用這個在 checkbox 行末顯示 `+` 建立按鈕。

```typescript
// TaskInstantConvertOverlay.ts — 行末 widget 完整模式
const CHECKBOX_LINE_REGEX = /^(\s*(?:[-*+]|\d+\.)\s*\[\s*[ xX]?\s*\])\s+(.+)$/gm;

const instantConvertField = StateField.define<DecorationSet>({
  create() { return Decoration.none; },
  update(decos, tr) {
    decos = decos.map(tr.changes);
    return decos;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function createTaskInstantConvertOverlay(plugin: MyPlugin) {
  const viewPlugin = ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      debounceTimer: ReturnType<typeof setTimeout> | null = null;

      constructor(readonly view: EditorView) {
        this.decorations = this.buildDecorations();
      }

      update() {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.decorations = this.buildDecorations();
        }, 200);
      }

      destroy() {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
      }

      private buildDecorations(): DecorationSet {
        const docText = this.view.state.doc.toString();
        const builder = new RangeSetBuilder<Decoration>();
        CHECKBOX_LINE_REGEX.lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = CHECKBOX_LINE_REGEX.exec(docText)) !== null) {
          const [fullMatch, checkboxPart, title] = match;
          const lineInfo = this.view.state.doc.lineAt(match.index);

          const taskTitle = title.trim();
          const taskPath = `${plugin.settings.taskFolder || "tasks/"}${taskTitle}.md`;
          const existingFile = plugin.app.vault.getAbstractFileByPath(taskPath);

          if (!existingFile) {
            const widget = new CreateTaskInlineWidget(plugin, taskTitle, lineInfo.to, this.view);
            const deco = Decoration.line({ widget });  // ← 行末附加
            builder.add(lineInfo.to, lineInfo.to, deco);
          }
        }
        return builder.finish();
      }
    },
    { decorations: (v) => v.decorations }
  );

  return [instantConvertField, viewPlugin];
}

class CreateTaskInlineWidget extends WidgetType {
  constructor(
    private plugin: MyPlugin,
    private taskTitle: string,
    private lineEnd: number,
    private view: EditorView
  ) { super(); }

  toDOM(): HTMLElement {
    const wrapper = document.createElement("span");
    wrapper.className = "navi-calendar-instant-convert";
    // ... build + button DOM ...

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await this.createTask();
    });

    return wrapper;
  }

  private async createTask(): Promise<void> {
    const task = await this.plugin.taskService.createTaskAsFile({ title: this.taskTitle });
    if (!task) return;

    const currentFile = this.plugin.app.workspace.getActiveFile();
    if (!currentFile) return;

    const taskFile = this.plugin.app.vault.getAbstractFileByPath(task.path);
    if (!taskFile || !(taskFile instanceof TFile)) return;  // ← 需要 TFile import

    const wikilink = this.plugin.app.fileManager.generateMarkdownLink(
      taskFile, currentFile.path, "", this.taskTitle
    );

    const lineInfo = this.view.state.doc.lineAt(this.lineEnd);
    this.view.dispatch({
      changes: { from: lineInfo.from, to: lineInfo.to, insert: wikilink }
    });
  }

  eq(other: WidgetType): boolean {
    if (!(other instanceof CreateTaskInlineWidget)) return false;
    return other.lineEnd === this.lineEnd && other.taskTitle === this.taskTitle;
  }
  get estimatedHeight(): number { return -1; }
  get block(): boolean { return false; }  // ← Inline，非 block
}
```

**關鍵紀律：**
- 用 `Decoration.line({ widget })`，**不是** `Decoration.widget`（line 不替換文字）
- `WidgetType` 來自 `@codemirror/view`，**不是** `LineWidget`
- `lineInfo.to` = 行末 position，在那個 position add decoration
- `block: false` = inline 等級（不出發換行）
- `TFile instanceof` 需要 `import { TFile } from 'obsidian'`
- **兩套 overlay 並存**：`TaskInstantConvertOverlay`（+按鈕）+ `TaskLinkOverlay`（任務卡）可同時啟動，各自在自己管轄的 decoration 範圍內運作

---

## Widget.eq() null 比較陷阱

```ts
// ❌ 問題：refreshEffect 立即清空 → 150ms 空白閃爍
if (effect.is(refreshEffect)) return Decoration.none;

// ✅ 正確：設 flag 讓 update() 同步重建
let pendingRefresh = false;
// refreshEffect handler:
if (effect.is(refreshEffect)) { pendingRefresh = true; return; }
// update():
if (pendingRefresh) {
  pendingRefresh = false;
  this.decorations = this.buildDecorations();
} else {
  // debounced rebuild
}
```

## Inline Widget DOM 結構紀律

**所有元素都必須是 `span`**——一個 `div` 就足以讓 inline 失效。

```
span.tasknotes-plugin.tasknotes-inline-widget
  └── span.task-card.task-card--layout-inline
        └── span.task-card__main-row
              ├── span.task-card__status-dot
              ├── span.task-card__content
              │     ├── span.task-card__title
              │     │     └── span.task-card__title-text
              │     └── span.task-card__metadata
              └── div.task-card__context-menu  ← CSS 控制 display:inline-block
```

## Widget Memory Leak 預防

**WidgetType 嚴禁持有 EditorView：**

```ts
// ❌ 錯誤示範
class MyWidget extends WidgetType {
  constructor(private view: EditorView) { super(); }
  toDOM(): HTMLElement {
    const el = document.createElement('span');
    el.onclick = () => {
      this.view.dispatch({ ... }); // ← 記憶體洩漏
    };
    return el;
  }
}

// ✅ 正確：DOM CustomEvent → ViewPlugin 處理 dispatch
class MyWidget extends WidgetType {
  toDOM(): HTMLElement {
    const el = document.createElement('span');
    el.setAttribute('data-line', String(this.line));
    el.onclick = (e) => {
      el.dispatchEvent(new CustomEvent('my-action', {
        bubbles: true,
        detail: { line: this.line }
      }));
    };
    return el;
  }
}

const myPlugin = ViewPlugin.fromClass(class extends PluginValue {
  constructor(view: EditorView) {
    super();
    view.scrollDOM.addEventListener('my-action', (e) => {
      const detail = (e as CustomEvent).detail;
      view.dispatch({ /* mutation */ });
    });
  }
  destroy() {
    this.view.scrollDOM.removeEventListener('my-action', handler);
  }
});
```

## WidgetType 三元素紀律

```typescript
class TaskLinkWidget extends WidgetType {
  toDOM(): HTMLElement {
    const wrapper = document.createElement("span");
    wrapper.className = "tasknotes-plugin tasknotes-inline-widget";
    // ... build DOM ...
    return wrapper;
  }

  /** CRITICAL: return false for inline widget */
  get block(): boolean { return false; }
  get estimatedHeight(): number { return -1; }

  /** Block mousedown/click so editor focus doesn't steal from widget */
  ignoreEvent(event: Event): boolean {
    return event.type === "mousedown" || event.type === "click";
  }
}
```

## ignoreEvent + CustomEvent 缺一不可

**缺少 `ignoreEvent` → CodeMirror 在 mousedown 時就攔截，DOM click handler 永遠不執行：**

```ts
// ✅ 正確：CustomEvent 處理業務邏輯 + ignoreEvent 放行 DOM 事件
class CreateTaskInlineWidget extends WidgetType {
  toDOM(): HTMLElement { /* ... */ }
  ignoreEvent(event: Event): boolean {
    return event.type === 'mousedown'; // 阻止 CodeMirror 攔截
  }
  get estimatedHeight(): number { return -1; }
  get block(): boolean { return false; }
}
```

原理：`ignoreEvent` 控制 CodeMirror 是否在事件抵達 DOM 之前先行攔截。`mousedown` return `true`（阻止）；其他事件 return `false`（放行讓 DOM handler 收到）。

## Widget.eq() null 比較陷阱

```typescript
// ❌ 錯誤：兩個 null 會被視為相等 → widget 不重建
eq(other: WidgetType): boolean {
  const sameStatus =
    (this.taskInfo?.status ?? '') === (other.taskInfo?.status ?? '');
  return samePosition && sameStatus; // null ?? '' === null ?? '' → '' === '' → true
}

// ✅ 正確：區分「從不存在變成存在」的情況
eq(other: WidgetType): boolean {
  if (!(other instanceof TaskLinkWidget)) return false;
  const samePosition = /* ... */;
  const thisExists = this.taskInfo !== null;
  const otherExists = other.taskInfo !== null;
  if (!thisExists && !otherExists) return samePosition;
  if (thisExists !== otherExists) return false;
  return samePosition && this.taskInfo!.status === other.taskInfo!.status;
}
```

## Badge Container appendChild Bug

```typescript
// ❌ 錯誤 — appendChild() 回傳值永遠是 element（truthy），導致：
// 1. 空 badges 容器進入 DOM（佔空間）
// 2. badges 被 appended 兩次（一次明確，一次在 || 表達式）
mainRow.appendChild(badges) || true;
// 或
if (badges) { mainRow.appendChild(badges); }
```

```typescript
// ✅ 正確 — 先檢查有內容再 append
if (badges.children.length > 0) {
  mainRow.appendChild(badges);
}
```

## Vault Adapter 讀取 API 差異（2026-04-27）

**問題:** `journalTemplatePath = "80-System/81-Template/Daily"`（無副檔名）→ `ensureDailyNote` 回 fallback 而非模板內容。

**兩個不同的 API，行為不一致：**

| API | 行為 | 需求 |
|-----|------|------|
| `app.vault.adapter.read(path)` | filesystem-level read | 需完整檔名（含 `.md`）|
| `app.vault.getAbstractFileByPath(path)` | vault abstraction | vault-relative 路徑，有時找不到檔案 |

**修復（統一寫法）：**

```typescript
// 1. 先補副檔名（如果路徑沒有）
let templatePath = templateSetting;
if (!templatePath.endsWith('.md')) {
  templatePath = templatePath + '.md';
}

// 2. 用 adapter.read() 讀（跟 createTaskAsFile 一致）
try {
  const content = app.vault.adapter.read(templatePath);
  // ...
} catch {
  // fallback
}
```

**Lesson:** 所有模板讀取統一用 `adapter.read()` + 自動補 `.md`。不要混用 `getAbstractFileByPath`。

---

## Wikilink 路徑解析核心 Pattern

**問題：** 日記筆記中的 `[[tasks/買早餐]]` wikilink 在 Live Preview 不渲染。

**真正根因：** wikilink 是相對路徑，`getFirstLinkpathDest` 才能正確解析。

```typescript
private resolveWikilink(linkPath: string, sourcePath: string): string | null {
  let cleanPath = linkPath;
  const pipeIdx = linkPath.indexOf("|");
  if (pipeIdx !== -1) {
    cleanPath = linkPath.substring(0, pipeIdx); // 處理 [[path|alias]]
  }
  const file = plugin.app.metadataCache.getFirstLinkpathDest(cleanPath, sourcePath);
  if (file instanceof TFile) {
    return file.path; // "20_Life_Planning/Task/買早餐.md"
  }
  return null;
}
```

## esbuild Cache 問題（silent no-op build）

**徵兆：** `main.js` 的 timestamp 和 content-length 完全不變，終端顯示 build 成功但新 Symbol 在產物中找不到。

**解決：** 先刪除輸出檔再 build：
```bash
rm -f main.js && npx esbuild src/main.ts --bundle --platform=node \
  --external:obsidian --external:electron --external:@codemirror/* \
  --external:@lezer/* --format:cjs --target:es2018 \
  --outfile=main.js --minify
```

**驗證方法：** build 完成後立刻檢查 `main.js` 的 timestamp 是否為「現在」，並用 `strings main.js | grep -c "NewSymbolName"` 確認新符號在產物中。

## 多視圖插件架構 Pattern

```typescript
// main.ts - 定義兩種 view type
export const LIFE_CALENDAR_MAIN_VIEW = "lifeos-calendar-main";
export const LIFE_CALENDAR_SIDEBAR_VIEW = "lifeos-calendar-sidebar";

// registerView - 三種視圖
this.registerView(LIFE_CALENDAR_MAIN_VIEW, (leaf) =>
  new LifeOSCalendarView(leaf, this, false)  // false = 主視圖
);
this.registerView(LIFE_CALENDAR_SIDEBAR_VIEW, (leaf) =>
  new LifeOSCalendarView(leaf, this, true)    // true = 側邊欄視圖
);
```

## EventCache 統一事件索引

```typescript
class EventCache extends EventEmitter {
  on(event: "update", callback: UpdateViewCallback): void;
  populate(): Promise<void>;           // 從各 source 填充
  updateEventWithId(id: string, event): Promise<void>;
  deleteEvent(id: string): Promise<void>;
  resync(): void;
}
```

## 常見 Widget 問題排查清單

1. **按鈕點擊完全無效** → `CreateTaskInlineWidget` 缺少 `ignoreEvent` 方法
2. **編輯 task 檔後日曆不刷新** → `isRelevantFile` 未包含 `taskFolder` 檢查
3. **點擊 checkbox widget 沒反應** → `TaskLinkWidget` 的 `ignoreEvent` 只 block `mousedown`，要確認 `click`/`dblclick` 能穿透
4. **instant-convert 按鈕消失** → `eq()` 判斷錯誤，`null` vs `null` 時被當成相同 widget 而不重建
