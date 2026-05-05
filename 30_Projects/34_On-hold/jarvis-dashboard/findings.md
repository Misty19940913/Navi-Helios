---
children: []
description: ''
folder: area
parent: []
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

# 研究發現：Dashboard 原始結構

## 完整元素對照表

### CSS 變數（:root）
```css
:root {
  --bg-primary: #0a0a0f;      /* 主背景 */
  --bg-secondary: #13131a;    /* 側邊欄/卡片 */
  --bg-tertiary: #1a1a24;     /* 按鈕/輸入框 */
  --bg-card: #1f1f2e;        /* 卡片背景 */
  --border: #2a2a3a;          /* 邊框色 */
  --text-primary: #e4e4e7;    /* 主文字 */
  --text-secondary: #a1a1aa;  /* 次文字 */
  --text-muted: #71717a;      /* 弱化文字 */
  --accent: #00d4ff;          /* 主強調色 */
  --accent-glow: rgba(0, 212, 255, 0.5);
  --green: #10b981;
  --green-glow: rgba(16, 185, 129, 0.2);
  --red: #ef4444;
  --yellow: #f59e0b;
  --purple: #a855f7;
  --blue: #3b82f6;
  --cyan: #06b6d4;
}
```

### 關鍵 class 選擇器
| class | 用途 |
|-------|------|
| `.sidebar` | 側邊欄容器 |
| `.nav-item` | 導航項目 |
| `.nav-item.active` | 當前頁面 |
| `.main` | 主內容區 |
| `.page` | 頁面容器 |
| `.page.active` | 當前顯示的頁面 |
| `.card` | 卡片容器 |
| `.card-title` | 卡片標題 |
| `.grid` | 網格布局 |
| `.grid-2` / `.grid-3` / `.grid-4` | 欄位數 |
| `.metric` | 指標容器 |
| `.metric-value` | 數值顯示 |
| `.metric-label` | 標籤文字 |
| `.system-grid` | 系統監控網格 |
| `.system-metric` | 系統監控卡片 |
| `.radial-gauge` | 圓形儀表 |
| `.radial-gauge-fill` | 儀表進度條 |
| `.activity-feed` | 活動列表容器 |
| `.activity-item` | 活動項目 |
| `.badge` | 標籤 |
| `.badge.main/.sub/.cron/.group` | 不同類型標籤 |
| `.qa-btn` | 快速操作按鈕 |
| `.status-bar` | 底部狀態列 |

### 關鍵 ID（需保留）
| ID | 用途 |
|----|------|
| `#runningAgents` | 執行中的 Agent |
| `#totalSessions` | 總會話數 |
| `#activeSessions` | 活躍會話 |
| `#todaySpend` | 今日花費 |
| `#ovSessionPct` | 使用率% |
| `#cpuCircle` / `#systemCpu` | CPU |
| `#ramCircle` / `#systemRam` | RAM |
| `#tempCircle` / `#systemTemp` | 溫度 |
| `#diskCircle` / `#systemDisk` | 磁碟 |
| `#systemUptime` | 運行時間 |
| `#systemLoad` | 負載 |
| `#systemCrashes` | 崩潰數 |

### 導航對應
```html
data-page="overview" → 📊 Overview
data-page="sessions" → 🤖 Sessions
data-page="costs" → 💰 Costs
data-page="limits" → 📈 Limits
data-page="memory" → 🧠 Memory
data-page="files" → 📁 Files
data-page="logs" → 📋 Logs
data-page="feed" → ⚡ Live Feed
data-page="security" → 🔒 Security
data-page="sys-security" → 🛡️ Sys Security
data-page="config-editor" → ⚙️ Config
data-page="docker" → 🐳 Docker
```

---

## 改造原則

### ✅ 可以修改
- CSS 變數（顏色）
- 卡片/按鈕的 background, border, box-shadow
- 字體效果（text-shadow, font-family）
- 動畫（transition, keyframes）
- hover/active 效果

### ❌ 不可修改
- HTML 結構（不能刪除區塊）
- ID 和 class 名稱（JavaScript 依賴）
- data-page 屬性（導航依賴）
- 任何帶有 `id=` 的元素

### 保留的數據來源
- server.js 提供的 API
- system-stats, session, costs 等數據
- 所有 JavaScript 函數

---

## 參考圖片元素對照

### 圖1 Rainmeter → CSS 映射
| 圖片元素 | CSS 屬性 |
|----------|----------|
| 深黑背景 | `--bg-primary: #0a0a12` |
| 霓虹青藍 | `--accent: #00ffff` |
| 圓形儀表 | `.radial-gauge` |
| 玻璃效果 | `backdrop-filter: blur()` |
| 發光邊框 | `box-shadow: 0 0 10px var(--accent-glow)` |

### 圖2 JARVIS → CSS 映射
| 圖片元素 | CSS 屬性 |
|----------|----------|
| 發光線條 | `filter: drop-shadow()` |
| 掃描線 | `background: repeating-linear-gradient()` |
| Arc Reactor | `@keyframes pulse` |
| greebles | `::before/::after` 裝飾 |

---

_Updated 2026-03-23 18:36_
