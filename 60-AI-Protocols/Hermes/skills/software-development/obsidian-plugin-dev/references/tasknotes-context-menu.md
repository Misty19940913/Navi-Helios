# TaskNotes TaskContextMenu + DateContextMenu Pattern

> Distilled from session 20260429_122457 — navi-calendar TaskContextMenu implementation based on TaskNotes.

## Architecture Overview

```
TaskContextMenu.ts     ← 263 lines — 7 功能主選單
DateContextMenu.ts     ← 168 lines — 日期 submenu 產生器
```

## TaskContextMenu 7 大功能

```typescript
// TaskLinkWidget.ts 的 ⋮ 按鈕 onClick 呼叫
showAtMouseEvent(e: MouseEvent): void {
  const menu = new Menu();
  this.addStatusSubmenu(menu);          // 1. Status submenu
  this.addPrioritySubmenu(menu);        // 2. Priority submenu
  this.addDueDateSubmenu(menu);         // 3. Due Date submenu
  this.addScheduledDateSubmenu(menu);   // 4. Scheduled Date submenu
  menu.addSeparator();
  menu.addItem(item =>                 // 5. Open Note
    item.setTitle("Open Note").setIcon("file-text")
      .onClick(() => this.openNote()));
  menu.addItem(item =>                 // 6. Copy Title
    item.setTitle("Copy Title").setIcon("clipboard")
      .onClick(() => this.copyTitle()));
  menu.addSeparator();
  menu.addItem(item => {               // 7. Archive/Unarchive
    item.setTitle(isArchived ? "Unarchive" : "Archive")
      .setIcon(isArchived ? "archive" : "archive")
      .onClick(() => this.toggleArchive());
  });
  menu.showAtMouseEvent(e, { x: e.clientX, y: e.clientY });
}
```

### Status Submenu Pattern

```typescript
// (item as any).setSubmenu() — stub 中未定義，需 any cast
menu.addItem((item) => {
  item.setTitle("Status");
  (item as any).setSubmenu();
  const sub = (item as any).submenu;
  // status circles: todo, in-progress, done, cancelled
  STATUSES.forEach(s => {
    sub.addItem((subItem: any) => {
      subItem.setTitle(s.label).setIcon(s.icon);
      subItem.onClick(() => this.updateStatus(s.id));
    });
  });
});
```

### DateContextMenu 分類結構

```typescript
// DateContextMenu.ts — 三分類日期選項
getDateOptions(): DateOption[] {
  return [
    // increment：增減量
    { label: "+1 day",   value: d(1),  category: "increment" },
    { label: "+2 days",  value: d(2),  category: "increment" },
    { label: "-1 day",   value: d(-1), category: "increment" },
    { label: "+1 week",  value: d(7),  category: "increment" },
    { label: "-1 week",  value: d(-7), category: "increment" },

    // basic：固定基準日
    { label: "Today",      value: d(0), category: "basic" },
    { label: "Tomorrow",   value: d(1), category: "basic" },
    { label: "This Week",  value: this.thisWeekMonday(), category: "basic" },
    { label: "Next Week", value: this.nextWeekMonday(), category: "basic" },

    // weekday：週一~週日（本週一為基準）
    { label: "週一", value: this.weekdayOffset(0), category: "weekday" },
    { label: "週二", value: this.weekdayOffset(1), category: "weekday" },
    // ...
  ];
}
```

## Obsidian TypeScript Stub 限制

**`Menu.setSubmenu()` 在 stub 中未定義** — 需用 `(item as any)` 呼叫：

```typescript
// ❌ 編譯錯誤 — stub 沒有 submenu 屬性
item.setSubmenu();

// ✅ 正確 — any cast 繞過 stub
(item as any).setSubmenu();
const sub = (item as any).submenu;
```

## Badge Append Bug

**問題代碼：**
```typescript
// ❌ 錯誤 — appendChild() 回傳值永遠 truthy（返回 element），導致每次執行
mainRow.appendChild(badges) || true; // badges 無論是否為空都 append
if (badges) { mainRow.appendChild(badges); } // 重複 append
```

**正確做法：**
```typescript
// ✅ 先檢查有內容再 append
if (badges.children.length > 0) {
  mainRow.appendChild(badges);
}
```

## 補充：Reminder Badge 漏掉的 icon

TaskNotes 的 reminder badge（鬧鐘 icon）漏實作了：

```typescript
// 漏掉：setIcon(bell) — 對應 TaskNotes 的 reminder badge
if (task.reminder) {
  const badge = document.createElement('span');
  badge.addClass('task-card__badge', 'task-card__badge--reminder');
  setIcon(badge, 'bell');  // ← 這行漏了
  badges.appendChild(badge);
}
```
