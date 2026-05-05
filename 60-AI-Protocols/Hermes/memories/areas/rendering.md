# Area：CSS/Rendering 除錯

> 蒸餾自 2026-04-27 ~ 2026-04-29 session 叢集（tasknotes 原始碼研究 + navi-calendar code review）

---

## 核心發現：Inline Widget 必須全用 `span`

**錯誤假設 1：`div` 可以透過 CSS `display: inline` 變成 inline。**

實際：`div` 即使設 `display: inline`，仍保留 block 特性（`width: 100%` 行為）。CodeMirror 的 `block` attribute 只影響裝飾層級，DOM 元素本身必須是 `span` 才能讓 CSS `display: inline !important` 完全生效。

**正確模式（TaskNotes inline widget）：**
```typescript
class TaskLinkWidget extends WidgetType {
  toDOM(): HTMLElement {
    const wrapper = document.createElement("span");  // ← 不是 div
    wrapper.className = "tasknotes-plugin tasknotes-inline-widget";
    const card = document.createElement("span");     // ← 不是 div
    card.className = "task-card task-card--layout-inline";
    // 內部元素全部 span
    return wrapper;
  }
  get block(): boolean { return false; }        // inline 信號
  get estimatedHeight(): number { return -1; } // -1 = inline 信號
  ignoreEvent(event: Event): boolean {
    return event.type === "mousedown" || event.type === "click";
  }
}
```

**必備 CSS：**
```css
.task-card--layout-inline { display: inline !important; }
.task-card__main-row { display: inline !important; }
.task-card__metadata { display: inline-block; } /* 唯一可 inline-block */
```

---

## 錯誤假設 2：Widget 可以持有 EditorView 參考

**實際：WidgetType 持有 EditorView = 記憶體洩漏根源。**

```typescript
// ❌ 錯誤 — EditorView 持有 widget，widget 又持有 EditorView = 循環參考
class MyWidget extends WidgetType {
  constructor(private view: EditorView) { super(); }
}

// ✅ 正確 — CustomEvent + ViewPlugin 解耦合
class MyWidget extends WidgetType {
  toDOM(): HTMLElement {
    const el = document.createElement("span");
    el.onclick = (e) => {
      el.dispatchEvent(new CustomEvent("my-action", {
        bubbles: true,
        detail: { /* payload */ }
      }));
    };
    return el;
  }
  ignoreEvent(event: Event): boolean { return event.type === "mousedown"; }
}
```

---

## 錯誤假設 3：裝飾擴充回傳 plugin 就够了

**實際：Editor extension 必須回傳 `[field, plugin]` 陣列。**

```typescript
// ❌ 錯誤 —裝飾不會渲染
return viewPlugin;

// ✅ 正確 — StateField 透過 EditorView.decorations 提供裝飾
return [taskLinkField, viewPlugin];
```

---

## 錯誤假設 4：Reading Mode 用同樣的 CodeMirror 機制

**實際：Reading Mode（Live Preview）沒有 CodeMirror，需要用 `Component` + `registerEvent()`。**

```typescript
// Reading Mode requires Component lifecycle management
class ReadingModeProcessor extends Component {
  constructor(private plugin: MyPlugin) { super(); }

  onload() {
    this.registerEvent(
      this.plugin.app.metadataCache.on("changed", (file) => {
        // debounce per file with 500ms timer
      })
    );
  }
}

// Component has no this.app — store plugin reference in constructor
```

---

## 錯誤假設 5：`eq()` 裡的 null 比較沒問題

**實際：`null === null` 在 `eq()` 會導致即時轉換按鈕消失。**

```typescript
// ❌ 錯誤 — 兩個 null widget 被視為相等，裝飾不會重建
eq(other: TaskLinkWidget | null): boolean {
  if (other === null) return true; // 永遠通過
}

// ✅ 正確 — 區分「不存在」和「存在但同樣狀態」
eq(other: TaskLinkWidget | null): boolean {
  if (other === null) return false; // 不存在 → 需要重建
  return this.status === other.status; // 存在時才比對狀態
}
```

---

## Inline Widget `Decoration.widget` 語法

```typescript
// 行末按鈕（Convert to TaskNote）
Decoration.widget({ widget: myWidget, side: 1 });
// side: 1 = 行後；side: -1 = 行前

// block vs inline 判斷
block: true + estimatedHeight > 0  → block widget
block: false + estimatedHeight: -1 → inline widget
```

---

## navi-calendar Plugin Debugging 額外發現

| 問題 | 原因 |
|------|------|
| `blockedBy` frontmatter 定義了但未實作 | `parseTaskLine()` 只解析成空陣列 |
| MiniCalendarView | 標記 Phase 4，尚未實作 |
| CodeMirror Live Preview 整合 | Phase 2，Reading mode processor 單獨處理 |
| esbuild cache 導致 silent no-op | 需先 `rm -f main.js` 再 build |
| Dev source 在 `/tmp` 已消失 | 永遠放 `~/plugin-studies/` 並 commit GitHub |

---

## confirmed patterns

| Pattern | 驗證次數 | 檔案 |
|---------|---------|------|
| 全 span inline widget | 3+ | `areas/rendering.md` |
| CustomEvent + ViewPlugin 解耦合 | 3+ | `software-development/obsidian-plugin-study/SKILL.md` |
| `[field, plugin]` 回傳陣列 | 2+ | `obsidian-plugin-study` |
| Component + registerEvent (reading mode) | 2+ | 同上 |
| `eq()` null → return false | 1 | session 20260429 |
