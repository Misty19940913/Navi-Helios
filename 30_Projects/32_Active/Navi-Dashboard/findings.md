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

# 研究發現：Navi-Dashboard

---

## 1. Dashboard 市場研究

### 1.1 Edict（三省六部）
- **URL：** https://github.com/cft0808/edict
- **Stars：** 14,183 ⭐（最高）
- **更新：** 2026-04-04
- **授權：** MIT
- **後端：** Python 標準庫，零外部依賴
- **前端：** React + Vite

**優點：**
- 架構內建 QA 審核（門下省強制把關）
- 零依賴後端，極度穩定
- 朝堂議政功能（多 Agent 實時討論，皇帝干預）
- 任務流完整：旨意→太子→中書→門下→尚書→六部
- 奏摺存檔系統

**缺點：**
- Agent 固定綁死（11 個官職硬編碼）
- 任務流固定，無法自定義流程
- 無法動態擴充 Agent 數量

---

### 1.2 builderz-labs/Mission Control
- **URL：** https://github.com/builderz-labs/mission-control
- **Stars：** 3,764
- **更新：** 2026-04-03
- **授權：** MIT
- **後端：** Next.js + SQLite
- **前端：** Next.js

**優點：**
- 32 個面板（最豐富）
- Multi-gateway 適配（OpenClaw/CrewAI/LangGraph/AutoGen）
- RBAC 三級權限（Viewer/Operator/Admin）
- Skills Hub 對接 ClawdHub
- 101 個 REST API endpoints

**缺點：**
- 安裝複雜（pnpm 權限問題、Next.js 版本衝突）
- 維護成本較高

---

### 1.3 tugcantopaloglu/openclaw-dashboard
- **URL：** https://github.com/tugcantopaloglu/openclaw-dashboard
- **Stars：** 605
- **更新：** 2026-03-17
- **授權：** MIT
- **後端：** 純 Node.js（`node server.js`，無需 npm install）
- **前端：** Vanilla JS + HTML

**優點：**
- 極簡部署，零依賴
- Session 管理、Rate Limit 監控、費用分析
- Memory 檢視器
- 系統健康（CPU/RAM/磁碟/溫度）
- Dark/Light 模式

**缺點：**
- 純監控，沒有任務管制
- Stars 最少

---

### 1.4 橫向比較

| 維度 | Edict | builderz | tugcantopaloglu |
|------|:-----:|:-------:|:---------------:|
| Stars | ⭐14k | ⭐3.7k | ⭐605 |
| 任務管制 | ✅ | ✅ | ❌ |
| 審核流程 | ✅三省 | ❌ | ❌ |
| 面板數 | 10 | 32 | 15+ |
| 零依賴後端 | ✅ | ❌ | ✅ |
| 動態擴充 | ❌ | ✅ | ✅ |
| MIT 授權 | ✅ | ✅ | ✅ |

---

## 2. JARVIS 風格參考

### 2.1 Marvel JARVIS 視覺特徵

- **主色：** 深空黑底 + 藍光/金色光暈
- **字體：** 等寬字體（Mono），科幻終端感
- **動畫：** 光暈脈動、掃描線、數據流動
- **圖示：** 幾何圖形、環形進度條、全息投影感

### 2.2 鋼鐵人風格 Dashboard 配色

從 Edict 和 Mission Control 來看，深色主題是標配：

| 用途 | 色碼 |
|------|------|
| 主背景 | `#0a0e17` |
| 次背景 | `#111827` |
| 主色（藍光）| `#60a5fa` |
| 強調色（金色）| `#f59e0b` |
| 文字 | `#e5e7eb` |

### 2.3 技術實現
- 純 HTML + CSS（CSS 變量管理主題）
- 或 React + Tailwind（組件化）
- 無需大型框架

---

## 3. 技術棧分析

### 3.1 為什麼 Python 純標準庫？

| Python 標準庫 | Node.js built-in |
|-------------|-----------------|
| http.server | http |
| json/dataclass | JSON |
| subprocess | child_process |
| pathlib/os | fs/path/os |
| hashlib/hmac | crypto |

**選擇 Python 純標準庫的原因：**
- 與三省六部（Edict）一致
- 極度穩定，零依賴
- 部署簡單（任何 Python 環境都能跑）

---

## 4. 現有系統狀態（2026-04-08）

### 4.1 OpenClaw Agents（18 個）
- navi, larvis, doc-leader, doc-analyster, doc-architecter, doc-editor, trader
- taizi, zhongshu, menxia, shangshu, hubu, libu, bingbu, xingbu, gongbu, libu_hr, zaochao

### 4.2 運行中的服務
| 服務 | Port | 狀態 |
|------|------|------|
| OpenClaw Gateway | 18789 | ✅ 運行中 |
| Edict 看板（三省六部）| 7891 | ✅ 運行中 |

---

*最後更新：2026-04-08*
