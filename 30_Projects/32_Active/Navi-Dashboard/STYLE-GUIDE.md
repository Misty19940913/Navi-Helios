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

# Navi-Dashboard 設計風格指南

> 整理自 `jarvis-dashboard` 舊計劃的色彩系統與視覺效果，供未來參考。

---

## 🎨 色彩系統

### CSS 變數（:root）

```css
:root {
  /* 背景層次 */
  --bg-primary: #0a0a0f;      /* 主背景 */
  --bg-secondary: #13131a;      /* 側邊欄/卡片 */
  --bg-tertiary: #1a1a24;      /* 按鈕/輸入框 */
  --bg-card: #1f1f2e;          /* 卡片背景 */

  /* 邊框 */
  --border: #2a2a3a;           /* 邊框色 */

  /* 文字層次 */
  --text-primary: #e4e4e7;     /* 主文字 */
  --text-secondary: #a1a1aa;   /* 次文字 */
  --text-muted: #71717a;       /* 弱化文字 */

  /* 主強調色 */
  --accent: #00d4ff;            /* 霓虹青藍 */
  --accent-glow: rgba(0, 212, 255, 0.5);

  /* 狀態色 */
  --green: #10b981;
  --green-glow: rgba(16, 185, 129, 0.2);
  --red: #ef4444;
  --yellow: #f59e0b;
  --purple: #a855f7;
  --blue: #3b82f6;
  --cyan: #06b6d4;
}
```

### 色彩用途對照

| 色值 | 用途 |
|------|------|
| `#0a0a0f` | 深空黑底 |
| `#00d4ff` | 主強調（霓虹青藍）、按鈕、發光效果 |
| `#10b981` | 成功、在線、增長 |
| `#ef4444` | 錯誤、離線、崩潰 |
| `#f59e0b` | 警告、待處理 |
| `#a855f7` | 特殊狀態 |
| `#06b6d4` | 裝飾、次要強調 |

---

## ✨ 視覺效果

### 1. 玻璃模糊

```css
.glass {
  backdrop-filter: blur(10px);
  background: rgba(26, 26, 36, 0.8);
}
```

### 2. 發光邊框

```css
.glow-border {
  border: 1px solid var(--accent);
  box-shadow: 0 0 10px var(--accent-glow),
              0 0 20px rgba(0, 212, 255, 0.3),
              inset 0 0 10px rgba(0, 212, 255, 0.1);
}
```

### 3. 掃描線動畫

```css
.scanlines {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 212, 255, 0.03) 2px,
    rgba(0, 212, 255, 0.03) 4px
  );
  pointer-events: none;
}
```

### 4. Arc Reactor 脈動

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 20px var(--accent-glow);
  }
  50% {
    opacity: 0.7;
    box-shadow: 0 0 40px var(--accent-glow);
  }
}

.reactor {
  animation: pulse 2s ease-in-out infinite;
}
```

### 5. 文字發光

```css
.text-glow {
  color: var(--accent);
  text-shadow: 0 0 10px var(--accent-glow);
}
```

### 6. 漸層光暈

```css
.gradient-glow {
  background: radial-gradient(
    ellipse at center,
    rgba(0, 212, 255, 0.15) 0%,
    transparent 70%
  );
}
```

---

## 📐 佈局系統

### 間距規範

| 項目 | 值 |
|------|-----|
| 卡片間距（gap） | 24px |
| 卡片內距（padding） | 24px |
| 區塊下邊距（margin-bottom） | 24px |
| 側邊欄寬度（收合） | 72px |
| 側邊欄寬度（展開） | 240px |

### 卡片系統

| 項目 | 值 |
|------|-----|
| 卡片圓角 | 16px |
| 卡片最小寬度 | 240px |
| 卡片背景 | `--bg-card: #1f1f2e` |
| 卡片邊框 | `--border: #2a2a3a` |

### 網格欄位

| 類別 | 欄位數 |
|------|--------|
| grid | 自適應 |
| grid-2 | 2 欄 |
| grid-3 | 3 欄 |
| grid-4 | 4 欄 |

---

## 🗂️ 元件保留清單

> 以下 class 和 ID 不可刪除或修改名稱（JavaScript 依賴）

### 關鍵 class

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
| `.metric` | 指標容器 |
| `.metric-value` | 數值顯示 |
| `.metric-label` | 標籤文字 |
| `.system-grid` | 系統監控網格 |
| `.system-metric` | 系統監控卡片 |
| `.radial-gauge` | 圓形儀表 |
| `.radial-gauge-fill` | 儀表進度條 |
| `.activity-feed` | 活動列表容器 |
| `.badge` | 標籤 |
| `.qa-btn` | 快速操作按鈕 |
| `.status-bar` | 底部狀態列 |

### 關鍵 ID

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

---

## 🎯 JARVIS 風格關鍵詞

| 關鍵詞 | 說明 |
|--------|------|
| 深空黑底 | `--bg-primary: #0a0a0f` |
| 霓虹青藍 | `--accent: #00d4ff`` |
| 發光邊框 | `box-shadow` 搭配 `accent-glow` |
| 掃描線 | `repeating-linear-gradient` 動畫 |
| 科幻終端感 | 等寬字體 + 發光效果 |
| 玻璃效果 | `backdrop-filter: blur()` |

---

_整理自 `34_On-hold/jarvis-dashboard` — 2026-04-06_
