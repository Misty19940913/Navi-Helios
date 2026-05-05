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

## Rule 2: Inline widget 用 `Decoration.widget({ side: 1 })`

```ts
// ❌ 錯誤
Decoration.line({ widget: myWidget });

// ✅ 正確
Decoration.widget({ widget: myWidget, side: 1 });
// side: 1 = 在 position 之後；side: -1 = 在 position 之前
```

## Rule 3: Debounce + refresh effect 不要 race

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

```ts
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
