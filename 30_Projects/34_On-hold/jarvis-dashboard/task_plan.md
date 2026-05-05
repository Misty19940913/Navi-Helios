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

# JARVIS Dashboard 改造計畫

## 目標
將 openclaw-dashboard 改造成 JARVIS/Rainmeter 風格儀表板，保留所有原始功能。

---

## 原始 Dashboard 分析

### 頁面結構（12頁）
| ID | 頁面名稱 |
|----|----------|
| overview | Overview |
| sessions | Sessions |
| costs | Costs |
| limits | Limits |
| memory | Memory |
| files | Files |
| logs | Logs |
| feed | Live Feed |
| security | Security |
| sys-security | Sys Security |
| config-editor | Config |
| docker | Docker |

### 側邊導航（12項）
📊 Overview | 🤖 Sessions | 💰 Costs | 📈 Limits | 🧠 Memory | 📁 Files | 📋 Logs | ⚡ Live Feed | 🔒 Security | 🛡️ Sys Security | ⚙️ Config | 🐳 Docker

---

## ===== 第一階段：排版優先 =====

## Phase 1: 區塊排版調整

### 目標
調整區塊的大小、位置、間距、欄位配置。此階段不修改顏色。

### 1.1 側邊欄寬度調整

#### 現狀
- 寬度：72px（收起）/ 240px（展開）

#### 選項
| 選項 | 收起寬度 | 展開寬度 | 說明 |
|------|----------|----------|------|
| A | 72px | 240px | 維持現狀 |
| B | 60px | 200px | 較窄 |
| C | 80px | 280px | 較寬 |

**待 Boss 確認**

---

### 1.2 區塊欄位配置（Overview 頁面）

#### 現狀
| 區塊 | 欄位數 |
|------|--------|
| Top Metrics | 3欄 |
| System Health | 6欄 |
| Services/Cron | 2欄 |
| Quick Actions | 2欄 |
| Tailscale | 2欄 |
| Lifetime/Activity | 2欄 |
| Recent Activity | 2欄 |
| Daily Spend/Memory | 2欄 |
| Git Activity | 1欄 |
| Token Breakdown | 2欄 |
| Session Timeline | 1欄 |
| Claude/Gemini Usage | 2欄 |

#### 選項（每個區塊可獨立調整）
| 選項 | 欄位數 | 說明 |
|------|--------|------|
| A | 維持現狀 | 不變 |
| B | 減少 | 2欄 → 1欄 |
| C | 增加 | 2欄 → 3欄 |

**待 Boss 確認每個區塊的欄位數**

---

### 1.3 間距調整

#### 現狀
- 卡片間距（gap）：24px
- 卡片內距（padding）：24px
- 區塊下邊距（margin-bottom）：24px

#### 選項
| 項目 | 現在 | 選項A | 選項B |
|------|------|-------|-------|
| gap | 24px | 16px | 32px |
| padding | 24px | 20px | 28px |
| margin-bottom | 24px | 16px | 32px |

**待 Boss 確認**

---

### 1.4 卡片圓角

#### 現狀
- border-radius: 16px

#### 選項
| 選項 | 值 | 說明 |
|------|-----|------|
| A | 16px | 維持現狀 |
| B | 8px | 較方 |
| C | 24px | 較圓 |
| D | 0px | 完全方角 |

**待 Boss 確認**

---

### 1.5 卡片大小調整

#### 選項
| 項目 | 現在 | 選項A | 選項B |
|------|------|-------|-------|
| min-width | 240px | 200px | 300px |
| max-width | auto | - | - |

**待 Boss 確認**

---

### 1.6 區塊順序調整

#### 現狀（由上而下）
1. Top Metrics（3欄）
2. System Health（6欄）
3. Services Status
4. Cron Jobs
5. Quick Actions
6. Tailscale Status
7. Lifetime Stats
8. Activity Streak
9. Recent Activity
10. Daily Spend
11. Memory Files
12. Git Activity
13. Token Breakdown
14. Session Timeline
15. Claude Usage
16. Gemini Usage

#### 調整選項
- 可以移動區塊順序
- 可以合併區塊
- 可以隱藏區塊

**待 Boss 確認是否要調整順序**

---

### Phase 1 待確認清單

- [ ] 側邊欄寬度（選項A/B/C）
- [ ] 每個區塊的欄位配置
- [ ] 間距（gap/padding/margin）選項
- [ ] 卡片圓角大小
- [ ] 卡片大小
- [ ] 區塊順序是否要調整

---

## ===== 第二階段：基礎配色 =====

## Phase 2: 基礎配色

### 目標
只改變顏色，不改大小、形狀、排版。

### 內容
- CSS 變數配色（#00FFFF）
- 側邊欄背景
- 卡片背景
- 文字發光效果

---

## ===== 第三階段：元件美化 =====

## Phase 3: 導航系統

### 內容
- nav-item hover/active 效果
- 圖標發光
- 狀態指示器

## Phase 4: 儀表板美化

### 內容
- Metrics 數值發光
- System Health 卡片美化
- 圓形儀表美化

## Phase 5: 列表美化

### 內容
- Activity 列表美化
- Quick Actions 按鈕美化
- Badge 標籤美化

---

## ===== 第四階段：視覺效果 =====

## Phase 6: 視覺效果

### 內容
- 掃描線動畫
- 角落裝飾
- Arc Reactor 效果

---

## ===== 第五階段：測試發布 =====

## Phase 7: 測試與發布

### 內容
- 功能測試
- 響應式檢查
- Git commit & publish

---

## 技術資訊

| 項目 | 值 |
|------|-----|
| 本地路徑 | /home/misty/openclaw-dashboard/index.html |
| 測試網址 | http://localhost:7000 |
| 備份 | index.html.backup-2026-03-23 |

---

## 當前狀態
**Phase 1**: 等待 Boss 確認排版選項

---

_Updated 2026-03-23 18:54_
