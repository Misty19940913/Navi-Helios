# Obsidian Reading Mode Injection Pattern

> 蒸餾自 navi-calendar 開發實戰（2026-04-29）。\
> 主題：如何在 Reading Mode（而非 Live Preview）中注入視覺化內容。

---

## 核心概念

Obsidian 有兩種閱讀模式：

| 模式 | API | 容器 DOM |
|------|-----|---------|
| **Live Preview**（編輯模式拆分視圖） | CodeMirror 6 Extension | `.cm-content` |
| **Reading Mode**（純閱讀） | DOM manipulation + Obsidian Component | `.markdown-preview-sizer` |

Reading Mode **沒有** CodeMirror API，必須直接操作 DOM。

---

## ReadingModeInjection 完整架構

```typescript
import { Component, MarkdownView, WorkspaceLeaf } from 'obsidian';

class ReadingModeInjectionComponent extends Component {
  private plugin: NaviCalendarPlugin;
  private scheduler: NodeJS.Timeout | null = null;
  private metadataTimers: Map<string, NodeJS.Timeout> = new Map();

  load() {
    const workspace = this.plugin.app.workspace;
    const metadataCache = this.plugin.app.metadataCache;

    const scheduleInjection = () => {
      if (this.scheduler) clearTimeout(this.scheduler);
      this.scheduler = setTimeout(() => { this.injectAllReadingModeWidgets(); }, 100);
    };

    this.registerEvent(workspace.on('layout-change', scheduleInjection));
    this.registerEvent(workspace.on('active-leaf-change', (leaf) => {
      if (leaf) injectReadingModeWidget(leaf, this.plugin);
    }));
    this.registerEvent(metadataCache.on('changed', (file) => {
      const existing = this.metadataTimers.get(file.path);
      if (existing) clearTimeout(existing);
      this.metadataTimers.set(file.path, setTimeout(() => {
        this.injectAllReadingModeWidgets();
      }, 300));
    }));

    this.injectAllReadingModeWidgets();
  }

  override onunload() {
    if (this.scheduler) clearTimeout(this.scheduler);
    this.metadataTimers.forEach(t => clearTimeout(t));
    this.metadataTimers.clear();
    this.plugin.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
      const view = leaf.view;
      if (view instanceof MarkdownView) {
        removeExistingWidgets(view.previewMode.containerEl);
      }
    });
  }

  private injectAllReadingModeWidgets(): void {
    this.plugin.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
      injectReadingModeWidget(leaf, this.plugin);
    });
  }
}

async function injectReadingModeWidget(leaf: WorkspaceLeaf, plugin: NaviCalendarPlugin): Promise<void> {
  const view = leaf.view;

  // NOTE: view.getMode() is UNRELIABLE in Live Preview. Only check instanceof.
  if (!(view instanceof MarkdownView)) return;
  if (!view.previewMode) return;

  const file = view.file;
  if (!file) return;

  const taskFolder = plugin.settings.taskFolder || "tasks/";
  if (!file.path.startsWith(taskFolder)) {
    removeExistingWidgets(view.previewMode.containerEl);
    return;
  }

  const tasks = await plugin.taskService.getAllTasks();
  const task = tasks.find(t => t.path === file.path);

  if (!task) {
    removeExistingWidgets(view.previewMode.containerEl);
    return;
  }

  try {
    removeExistingWidgets(view.previewMode.containerEl);
    const widget = createTaskCardWidget(plugin, task);
    const sizer = view.previewMode.containerEl.querySelector('.markdown-preview-sizer');
    if (!sizer) return;
    const metadataContainer = sizer.querySelector('.metadata-container');
    if (metadataContainer?.nextSibling) {
      sizer.insertBefore(widget, metadataContainer.nextSibling);
    } else {
      sizer.insertBefore(widget, sizer.firstChild);
    }
  } catch (error) {
    console.error('[ReadingModeInjection] Error:', error);
  }
}
```

**啟動方式**（在 Plugin `onload`）：
```typescript
this.addChild(new ReadingModeInjectionComponent(this));
```

---

## Critical Pitfalls

### Pitfall 1: `getMode()` 回報值不穩定

```typescript
// WRONG: Live Preview 模式 getMode() 可能回報錯誤值，導致 injection 被阻擋
if (view.getMode() !== 'preview') return;

// CORRECT: 只檢查 instanceof，getMode() 在 Live Preview 不靠譜
if (!(view instanceof MarkdownView)) return;
if (!view.previewMode) return;
```

### Pitfall 2: wikilink 路徑 vs 任務資料夾路徑不一致

```typescript
// WRONG: generateMarkdownLink 生成相對路徑wikilink
// 任務放在 "20_Life_Planning/Task/" 但 wikilink 是 "tasks/買早餐"
// → isTaskLink 用絕對路徑比對相對路徑 → 全部失敗

// CORRECT: 用 app.vault.getAbstractFileByPath 解析
function isTaskLink(wikilink: WikilinkMatch): boolean {
  const resolved = app.vault.getAbstractFileByPath(wikilink.linkPath);
  if (resolved instanceof TFile) {
    return resolved.extension === 'md';
  }
  return false;
}
```

### Pitfall 3: `.markdown-preview-sizer` 可能不存在

null check 必須做。

---

## Reading Mode vs Live Preview 對照

| 維度 | Live Preview | Reading Mode |
|------|-------------|--------------|
| API 層 | CodeMirror 6 `ViewPlugin` + `Decoration.widget` | DOM `insertBefore()` |
| 等級控制 | `block: true` in `WidgetType` | DOM 插入位置 |
| 事件穿透 | `ignoreEvent() { return false; }` | 原生 DOM 事件 |
| 銷毀觸發 | CodeMirror view destroy | Component `onunload` |
| 容錯 | CodeMirror 自動管理 | 需手動 `removeExistingWidgets` |

---

## Debug log 命名慣例

```
[plugin-name] [ReadingMode] view not MarkdownView
[plugin-name] [ReadingMode] file not in task folder: {path} vs {taskFolder}
[plugin-name] [ReadingMode] processing task file: {path}
[plugin-name] [ReadingMode] task not found for path: {path}
[plugin-name] [ReadingMode] found task: {title} status: {status}
[plugin-name] [ReadingMode] widget created, injecting...
[plugin-name] [ReadingMode] Could not find .markdown-preview-sizer
[plugin-name] [ReadingMode] injected successfully!
```

**Chrome DevTools 過濾**：`[plugin-name] [ReadingMode` 或 `[plugin-name] [Overlay`
