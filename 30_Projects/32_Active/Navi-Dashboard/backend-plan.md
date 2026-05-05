# Navi-Dashboard 後端規劃

> **最後更新：2026-04-14**
---

## 📚 資料索引（Implementation 時必查）

| 項目 | 位置 | 用途 |
|------|------|------|
| **Edict（三省六部）** | https://github.com/cft0808/edict | 任務流向、Agent 分工 |
| **Mission Control** | https://github.com/builderz-labs/mission-control | Task Queue、Quality Gates |
| **Mission Control 編排** | `docs/orchestration.md` | Aegis 詳細機制 |
| **OpenClaw Control UI** | `~/.npm-global/lib/node_modules/openclaw/docs/web/control-ui.md` | 功能對照 |
| **OpenClaw Gateway API** | `~/.npm-global/lib/node_modules/openclaw/docs/gateway/` | API endpoint |
| **三省六部 Agent 定義** | `Navi Helios/60-AI-Protocols/61-管理協議/Agent/` | SOUL.md、AGENTS.md |
| **Skills 定義** | `Navi Helios/60-AI-Protocols/61-管理協議/Agent/skills/` | 專業能力定義 |

---


> **變更：Python → Node.js 標準庫（無外部依賴）**

---

## 技術選型

| 層面 | 選擇 | 理由 |
|------|------|------|
| 語言 | Node.js (ES Modules) | 與前端 React 統一 runtime |
| HTTP 框架 | Node.js 內建 `http` | 零外部依賴 |
| 即時通訊 | Server-Sent Events (SSE) | 內建 `events`，比 WebSocket 簡單 |
| 認證 | API Token | 對內部工具足夠 |
| 持久化 | JSON 檔案 | 够用，無需資料庫 |

---

## 參考儀表板系統

| 系統 | 特點 |
|------|------|
| **原生 Control UI** | 最完整：Chat、Channels、Instances、Sessions、Dreams、Cron、Skills、Nodes、Exec Approvals、Config、Debug、Logs、Update |
| **Mission Control** | 工作流引擎：Tasks Queue、Kanban、Quality Gates、Multi-agent、RBAC、Recurring Tasks |
| **Edict（三省六部）** | 奏摺流程審核、零後端、極簡 |
| **openclaw-dashboard** | 極簡、Session/成本監控 |

---

## 分頁規劃（8 頁）

| # | 分頁名 | 靈感來源 | 優先級 |
|---|--------|----------|--------|
| 1 | **Overview** | 全部 | P0 |
| 2 | **Agents** | Mission Control、Control UI | P0 |
| 3 | **Sessions** | Control UI、openclaw-dashboard | P0 |
| 4 | **Tasks** | Mission Control、Edict | P0 |
| 5 | **Logs** | Control UI | P1 |
| 6 | **Gateway** | Control UI | P1 |
| 7 | **Events** | openclaw-dashboard | P2 |
| 8 | **Settings** | Control UI | P2 |

---

# 分頁詳細規劃

---

## 1. Overview（總覽）

### 顯示資訊（彙整所有參考）

| 資訊 | 來源 |
|------|------|
| **Gateway 連線狀態** | Control UI — Debug > Status |
| **Gateway 版本** | Control UI — Debug > Status |
| **連線延遲（ms）** | 原生設計新增 |
| **系統健康** | Control UI — Debug > Health |
| **CPU 使用率** | 原生設計新增 |
| **記憶體使用** | Control UI — Debug > Health |
| **磁碟空間** | 原生設計新增 |
| **上線時間** | 原生設計新增 |
| **Agent 總數** | Mission Control、Control UI |
| **Online/Offline/Busy Agent 數** | Mission Control |
| **活躍 Session 數** | Control UI — Sessions |
| **任務概覽（各狀態數）** | Mission Control、Edict |
| **最近活動時間線** | Mission Control |
| **快捷操作按鈕** | Edict、Mission Control |
| **強制刷新按鈕** | Control UI |
| **成本追蹤（Token 使用）** | openclaw-dashboard |
| **錯誤/警告摘要** | Control UI — Logs |

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/gateway/status` | Gateway 連線狀態、版本、延遲 |
| GET | `/api/system/health` | CPU/記憶體/磁碟/上線時間 |
| GET | `/api/overview/summary` | 統一概覽摘要 |
| POST | `/api/system/refresh` | 強制刷新所有狀態 |

### API 回應格式

#### GET /api/gateway/status
```javascript
{
  connected: boolean,
  latency_ms: number,
  gateway_version: string,
  hostname: string,
  last_ping: string,
  error?: string
}
```

#### GET /api/system/health
```javascript
{
  hostname: string,
  uptime_seconds: number,
  cpu_percent: number,
  memory: {
    total_mb: number,
    used_mb: number,
    percent: number
  },
  disk: {
    total_gb: number,
    used_gb: number,
    percent: number
  },
  timestamp: string
}
```

#### GET /api/overview/summary
```javascript
{
  gateway: {
    connected: boolean,
    latency_ms: number,
    version: string
  },
  system: {
    cpu_percent: number,
    memory_percent: number,
    disk_percent: number,
    uptime_seconds: number
  },
  agents: {
    total: number,
    online: number,
    offline: number,
    busy: number
  },
  sessions: {
    total: number,
    active: number
  },
  tasks: {
    total: number,
    pending: number,
    in_progress: number,
    done: number,
    blocked: number
  },
  costs: {
    total_tokens_today: number,
    estimated_cost_today: number
  },
  recent_events: [
    { type: string, message: string, timestamp: string }
  ],
  last_updated: string
}
```

---

## 2. Agents（代理）

### L1/L2/L3 分層架構

根據整合後的組織架構，Agent 需要按層級分組顯示：

```
L1（規劃）
├── 太子A（專案X）
├── 太子B（專案Y）
└── 太子C（專案Z）

L2（協調層 - 雙向把關）
├── menxia（上而下：審查 L1 計劃）
└── xingbu（下而上：檢查 L3 成果）

L3（執行層 - 輪詢取任務）
├── hubu（數據/財務）
├── libu（文檔/UI）
├── bingbu（開發）
├── gongbu（運維）
├── libu_hr（人事）
└── doc-analyster/architecter/editor
```

### 顯示資訊

| 資訊 | 說明 |
|------|------|
| **Agent ID** | 唯一識別碼 |
| **Agent 名稱** | 顯示名稱 |
| **層級** | L1 / L2 / L3 |
| **特殊角色** | 太子（Princes）/ 協調者（Coordinator）/ 執行者（Executor） |
| **狀態** | Online / Offline / Busy / Polling（輪詢中）|
| **目前 Model** | 使用的 LLM 模型 |
| **Workspace 路徑** | 工作區位置 |
| **最後活躍時間** | 最近操作時間 |
| **當前 Session** | 正在處理的工作 |
| **任務獲取方式** | 輪詢（Polling）或被派發（Assigned）|
| **收到的任務數** | 總任務數 |
| **已完成的任務數** | 已完成數 |
| **錯誤次數** | 失敗任務數 |
| **Token 使用量** | 累計使用 |
| **操作** | 重啟 / 發送任務 / 啟用/停用 |

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/agents` | 所有 Agent（支援 `?layer=L1|L2|L3` 篩選）|
| GET | `/api/agents/:id` | 單一 Agent 詳情 |
| GET | `/api/agents/:id/status` | Agent 狀態 |
| GET | `/api/agents/layers` | 各層級 Agent 統計 |
| POST | `/api/agents/:id/restart` | 重啟 Agent |
| POST | `/api/agents/:id/task` | 發送任務給 Agent |
| PATCH | `/api/agents/:id` | 更新 Agent（啟用/停用） |

#### GET /api/agents
```javascript
{
  agents: [
    {
      id: string,
      name: string,
      layer: 'L1' | 'L2' | 'L3',
      role: 'prince' | 'coordinator' | 'executor',
      status: 'online' | 'offline' | 'busy' | 'polling',
      model: string,
      workspace: string,
      last_seen: string,
      current_session: string | null,
      task_fetch_mode: 'polling' | 'assigned',
      stats: {
        tasks_received: number,
        tasks_completed: number,
        errors: number,
        tokens_used: number
      },
      // L2 特殊欄位
      review_stats: {
        plans_reviewed: number,      // menxia
        plans_approved: number,
        results_checked: number,     // xingbu
        results_approved: number
      }
    }
  ],
  layers: {
    L1: { count: number, online: number },
    L2: { count: number, online: number },
    L3: { count: number, online: number }
  }
}
```

#### GET /api/agents/layers
```javascript
{
  layers: [
    {
      level: 'L1',
      label: '規劃層',
      agents: [
        { id: 'taizi', name: '太子', status: 'online', project: '專案X' }
      ]
    },
    {
      level: 'L2',
      label: '協調層',
      agents: [
        { id: 'menxia', name: '門下省', status: 'online', role: 'review' },
        { id: 'xingbu', name: '刑部', status: 'online', role: 'check' }
      ]
    },
    {
      level: 'L3',
      label: '執行層',
      agents: [...]
    }
  ]
}
```

---

## 3. Sessions（會話）

### 顯示資訊（彙整所有參考）

| 資訊 | 來源 |
|------|------|
| **Session ID** | Control UI、openclaw-dashboard |
| **關聯 Agent** | 全部 |
| **開始時間** | 全部 |
| **結束時間** | 全部 |
| **持續時間** | openclaw-dashboard |
| **訊息數量** | Control UI |
| **Token 使用（Input/Output）** | openclaw-dashboard |
| **花費（USD）** | openclaw-dashboard |
| **Model** | Control UI |
| **Thinking 模式** | Control UI |
| **Fast 模式** | Control UI |
| **訊息歷史** | Control UI |
| **操作：終止** | Control UI |
| **操作：匯出** | 原生設計新增 |

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/sessions` | 所有 Session |
| GET | `/api/sessions/:id` | 單一 Session 詳情 |
| GET | `/api/sessions/:id/messages` | Session 訊息歷史 |
| DELETE | `/api/sessions/:id` | 終止 Session |
| GET | `/api/sessions/stats` | Session 統計 |

#### GET /api/sessions
```javascript
[
  {
    id: string,
    agent_id: string,
    agent_name: string,
    started_at: string,
    ended_at: string | null,
    duration_seconds: number | null,
    message_count: number,
    token_usage: {
      input: number,
      output: number,
      cache_read: number
    },
    cost_usd: number,
    model: string,
    thinking: boolean,
    fast: boolean
  }
]
```

---

## 4. Tasks（任務）

### 任務系統核心設計（三省六部 + Mission Control 整合）

#### 任務流向

```
┌─────────────────────────────────────────────────────────────────────┐
│ 第一階段：計劃制定（多人協作）                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  太子A（戰略）────┐                                                 │
│  太子B（技術）────┼──→ 朝堂議政（討論計劃）                           │
│  太子C（財務）────┘         ↓                                       │
│                              │                                       │
│                    門下省審核（完整性、可執行性）                        │
│                              │                                       │
│                    ✅ 通過 → 尚書省派發                               │
│                    🚫 駁回 → 太子重新討論                             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 第二階段：任務執行                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  任務屬性（標註專業需求）                                             │
│  例：代碼 / 寫作 / 研究 / 法務 / 財務 / 美術                          │
│         ↓                                                          │
│  尚書省派發（根據屬性，只有具備該專業的 Agent 才能領取）               │
│         ↓                                                          │
│  六部執行（依專業分工）                                               │
│         ↓                                                          │
│  質量審查（Aegis）───→ ✅ 通過 → 交付                                │
│              └───→ 🚫 不通過 → 退回重做（最多 3 次）                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 審核機制（已驗證）

| 系統 | 審核時機 | 審核維度 | 失敗處理 |
|------|---------|---------|---------|
| **門下省（Edict）** | 計劃制定後、執行前 | 完整性、可執行性 | 打回重做 |
| **Aegis（Mission Control）** | 任務完成後 | 由 Aegis Agent 的 SOUL 定義（可客製） | 退回重做（最多 3 次） |

**關鍵發現：** Aegis 就是一個普通 Agent，審核維度由它的 SOUL 決定，不是固定的。

---

### 兩種視圖（並存）

| 視圖 | 適用場景 |
|------|---------|
| **Edict 視圖** | 監控整條審核鏈（分揀→規劃→審核→派發→執行→回奏） |
| **Kanban 視圖** | 手動任務管理、Quality Gates 審查 |

---

### Agent 專業能力定義

**定義方式：** 透過 Agent.md、SOUL.md 的設定，搭配技能（skills）來定義。

**範例專業領域：**
| 專業 | 對應 Agent |
|------|-----------|
| 代碼 | code-reviewer、programmer |
| 寫作 | content-writer、doc-editor |
| 研究 | researcher、analyster |
| 法務 | legal-advisor |
| 財務 | financial-analyst |
| 美術 | designer、artist |

---

### 任務屬性（Task Taxonomy）

| 屬性 | 說明 | 限定領取 |
|------|------|---------|
| `code` | 程式開發 | code-reviewer, programmer |
| `writing` | 內容創作 | content-writer, doc-editor |
| `research` | 研究分析 | researcher, analyser |
| `legal` | 法務相關 | legal-advisor |
| `finance` | 財務相關 | financial-analyst |
| `design` | 美術設計 | designer, artist |
| `general` | 通用（無限制） | 任何 Agent |

---

### 顯示資訊

#### Edict 視圖

| 資訊 | 說明 |
|------|------|
| **旨意標題** | 你下達的任務 |
| **當前環節** | 分揀/規劃/審核/派發/執行/回奏 |
| **負責 Agent** | 當前環節的 Agent |
| **封駁記錄** | 門下省封駁原因 |
| **六部進度** | 各部完成狀態 |
| **回奏內容** | 任務完成後的彙總 |

#### Kanban 視圖

| 資訊 | 說明 |
|------|------|
| **任務卡片** | 標題、優先級、負責人、屬性標籤 |
| **拖曳功能** | 跨欄位拖放更新狀態 |
| **Quality Gate** | 任務需 Aegis 審核才能進下一欄 |
| **屬性標籤** | 代碼/寫作/研究... |

---

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/tasks` | 任務列表（支援視圖篩選） |
| POST | `/api/tasks` | 建立任務 |
| GET | `/api/tasks/:id` | 單一任務詳情 |
| PATCH | `/api/tasks/:id` | 更新任務 |
| DELETE | `/api/tasks/:id` | 刪除任務 |
| GET | `/api/tasks/stats` | 任務統計 |
| GET | `/api/tasks/flow` | Edict 任務流向視圖 |
| GET | `/api/tasks/edict/:agent` | 指定 Agent 的任務 |
| GET | `/api/tasks/skills` | Agent 專業能力列表 |
| GET | `/api/tasks/taxonomy` | 任務屬性 taxonomy |
| GET | `/api/tasks/queue` | Task Queue（L3 輪詢領取）|
| GET | `/api/tasks/queue/:id/claim` | Agent 領取任務 |
| GET | `/api/tasks/approvals` | 皇上待確認列表（計劃/成果）|
| POST | `/api/tasks/approvals/:id/approve` | 皇上批准 |
| POST | `/api/tasks/approvals/:id/reject` | 皇上駁回 |
| GET | `/api/agents/layers` | 各層級 Agent 統計 |

#### GET /api/tasks（通用格式）
```javascript
{
  tasks: [
    {
      id: string,
      title: string,
      description: string,
      status: 'blocked' | 'queued' | 'in_progress' | 'review' | 'done' | 'paused',
      priority: 'low' | 'medium' | 'high',
      assignee: string | null,
      tags: string[],  // 任務屬性：code, writing, research...
      created_at: string,
      updated_at: string,
      due_date: string | null,
      // 任務依賴
      depends_on: string[] | null,  // 前置任務 ID 列表，null 表示獨立任務
      blocked_reason: string | null, // 當 status='blocked' 時顯示
      // Edict 擴展欄位
      edict_flow: {
        current_stage: '分揀' | '規劃' | '審核' | '皇上確認' | '派發' | '執行' | 'L2檢查' | '皇上確認' | '回奏',
        history: [{ stage: string, agent: string, timestamp: string, note: string }]
      },
      // Quality Gate 擴展欄位
      quality_gate: {
        required: boolean,
        status: 'pending' | 'approved' | 'rejected',
        attempts: number,
        feedback: string | null
      },
      history: [{ action: string, from: string, to: string, timestamp: string }]
    }
  ],
  view: 'kanban' | 'edict',
  pagination: { page: number, per_page: number, total: number }
}
```

#### GET /api/tasks/flow（Edict 流向視圖 - 六環）
```javascript
{
  flow_stages: [
    { stage: '規劃', agent: '太子A/B/C', tasks: number, status: string, details: {...} },
    { stage: 'L2審查', agent: 'menxia', tasks: number, status: string, rejected: number, rejection_reasons: string[] },
    { stage: '皇上確認', tasks: number, status: 'pending_approval' | 'approved' | 'rejected' },
    { stage: '派發', agent: 'shangshu', tasks: number, status: string, queue_status: 'open' | 'closed' },
    { stage: '執行', agents: ['hubu', 'libu', ...], tasks: number, status: string, polling_status: {...} },
    { stage: 'L2檢查', agent: 'xingbu', tasks: number, status: string, rejected: number },
    { stage: '皇上確認', tasks: number, status: 'pending_approval' | 'approved' | 'rejected' },
    { stage: '回奏', tasks: number, status: string }
  ],
  pending_tasks: number,
  completed_tasks: number,
  rejected_tasks: number
}
```

#### 新增：任務佇列視圖（L3 輪詢）
```javascript
{
  queue: [
    {
      id: string,
      title: string,
      attributes: ['code', 'writing', 'research'],
      priority: 'high' | 'medium' | 'low',
      assigned_to: string | null,  // null = 等待領取
      fetched_by: string[],         // 輪詢中的 Agent
      created_at: string,
      status: 'queued' | 'in_progress' | 'done' | 'blocked'
    }
  ],
  stats: {
    queued: number,
    in_progress: number,
    done: number,
    by_attribute: {
      code: number,
      writing: number,
      research: number,
      finance: number,
      general: number
    }
  }
}
```

#### 新增：皇上最終確認任務列表
```javascript
{
  pending_approvals: [
    {
      type: 'plan' | 'result',
      task_id: string,
      title: string,
      submitted_by: string,       // 太子A/B/C 或 六部
      submitted_at: string,
      summary: string,
      requires_action: 'approve' | 'reject'
    }
  ],
  approved_today: number,
  rejected_today: number
}
```

#### GET /api/tasks/skills（Agent 專業能力）
```javascript
{
  agents: [
    {
      id: string,
      name: string,
      skills: ['code', 'writing', 'research'],
      specialization: string,
      max_capacity: number
    }
  ]
}
```

#### GET /api/tasks/taxonomy（任務屬性）
```javascript
{
  categories: [
    { id: 'code', label: '代碼', eligible_agents: ['code-reviewer', 'programmer'] },
    { id: 'writing', label: '寫作', eligible_agents: ['content-writer', 'doc-editor'] },
    { id: 'research', label: '研究', eligible_agents: ['researcher', 'analyster'] },
    { id: 'legal', label: '法務', eligible_agents: ['legal-advisor'] },
    { id: 'finance', label: '財務', eligible_agents: ['financial-analyst'] },
    { id: 'design', label: '美術', eligible_agents: ['designer', 'artist'] },
    { id: 'general', label: '通用', eligible_agents: '*' }
  ]
}
```

---

### 任務依賴（Task Dependencies）

#### 設計原則

| 任務類型 | `depends_on` | 行為 |
|----------|--------------|------|
| **獨立任務** | `[]` 或 `null` | 直接進入 Queue，可被 L3 領取 |
| **依賴任務** | `[task_id, ...]` | 等待所有前置任務完成後，才進入 Queue |

#### Backend 邏輯

```javascript
function canBeQueued(task) {
  // 獨立任務：直接可領取
  if (!task.depends_on || task.depends_on.length === 0) {
    return true;
  }
  
  // 依賴任務：檢查所有前置任務
  return task.depends_on.every(depId => {
    const dep = getTask(depId);
    return dep && dep.status === 'done';
  });
}

function getBlockedReason(task) {
  if (!task.depends_on || task.depends_on.length === 0) {
    return null;
  }
  
  const pending = task.depends_on.filter(depId => {
    const dep = getTask(depId);
    return !dep || dep.status !== 'done';
  });
  
  return '等待：' + pending.map(id => {
    const dep = getTask(id);
    return `${dep?.title || id} (${dep?.status || 'unknown'})`;
  }).join(', ');
}
```

#### API 欄位

| 欄位 | 類型 | 說明 |
|------|------|------|
| `depends_on` | `string[] \| null` | 前置任務 ID 列表，null 表示獨立任務 |
| `blocked_reason` | `string \| null` | 當 `status='blocked'` 時顯示等待原因 |
| `status` | `'blocked'` | 當有前置任務未完成時 |

#### Task Queue API（只返回可領取的任務）

```javascript
GET /api/tasks/queue

// 回應：只包含 status='queued' 的任務（已解除 blocked）
{
  queue: [
    {
      id: string,
      title: string,
      depends_on: string[] | null,
      attributes: string[],
      priority: 'high' | 'medium' | 'low',
      assigned_to: string | null,
      fetched_by: string[],
      created_at: string
    }
  ],
  stats: {
    queued: number,
    in_progress: number,
    blocked: number,
    by_attribute: {...}
  }
}
```

#### 定義依賴（由 L1/zhongshu 在規劃時設定）

```javascript
// 建立任務時指定依賴
POST /api/tasks
{
  title: string,
  description: string,
  depends_on: ['task-id-1', 'task-id-2'],  // 可選
  attributes: ['code'],
  priority: 'medium'
}
```

#### 循環依賴檢測（Backend 防止）

```javascript
function detectCircularDependency(taskId, visited = new Set()) {
  if (visited.has(taskId)) {
    return true;  // 循環依賴
  }
  
  const task = getTask(taskId);
  if (!task.depends_on) return false;
  
  visited.add(taskId);
  
  for (const depId of task.depends_on) {
    if (detectCircularDependency(depId, visited)) {
      return true;
    }
  }
  
  return false;
}
```

---

## 5. Logs（日誌）

### 顯示資訊（彙整所有參考）

| 資訊 | 來源 |
|------|------|
| **日誌 ID** | Control UI |
| **時間戳** | 全部 |
| **等級（Debug/Info/Warn/Error）** | 全部 |
| **來源** | Control UI |
| **訊息** | 全部 |
| **Metadata** | Control UI |
| **即時 tail** | Control UI |
| **篩選（等級、來源、關鍵字）** | Control UI |
| **匯出功能** | Control UI |
| **操作：清除** | 原生設計新增 |

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/logs` | 日誌列表（支援分頁、篩選） |
| GET | `/api/logs/:id` | 單一日誌詳情 |
| GET | `/api/logs/stream` | SSE 即時 tail |
| DELETE | `/api/logs` | 清除日誌 |
| GET | `/api/logs/stats` | 日誌統計 |

#### GET /api/logs
```javascript
{
  logs: [
    {
      id: string,
      timestamp: string,
      level: 'debug' | 'info' | 'warn' | 'error',
      source: string,
      message: string,
      metadata: object | null
    }
  ],
  pagination: {
    page: number,
    per_page: number,
    total: number,
    total_pages: number
  }
}
```

---

## 6. Gateway（網關）

### 顯示資訊（彙整所有參考）

| 資訊 | 來源 |
|------|------|
| **Gateway 版本** | Control UI |
| **連線狀態** | 全部 |
| **延遲** | 原生設計新增 |
| **Config 檢視** | Control UI |
| **Config 編輯** | Control UI |
| **Security Audit** | Control UI |
| **Channel Bindings** | Control UI |
| **綁定地址** | Control UI |
| **Auth 模式** | Control UI |
| **允許的 channel** | Control UI |
| **Plugin 狀態** | Control UI |
| **操作：重啟 Gateway** | Control UI |
| **操作：套用 Config** | Control UI |
| **操作：韌體更新** | Control UI |

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/gateway/status` | Gateway 狀態 |
| GET | `/api/gateway/config` | 完整 Config |
| PATCH | `/api/gateway/config` | 更新 Config |
| POST | `/api/gateway/config/apply` | 套用 Config 並重啟 |
| GET | `/api/gateway/security` | Security Audit |
| GET | `/api/gateway/channels` | Channel Bindings |
| GET | `/api/gateway/plugins` | Plugin 狀態 |
| POST | `/api/gateway/restart` | 重啟 Gateway |
| GET | `/api/gateway/health` | 健康檢查 |

---

## 7. Events（事件）

### 顯示資訊（彙整所有參考）

| 資訊 | 來源 |
|------|------|
| **即時 SSE 事件流** | openclaw-dashboard |
| **事件類型** | 全部 |
| **事件時間** | 全部 |
| **事件資料** | 全部 |
| **事件歷史** | openclaw-dashboard |
| **事件統計** | 原生設計新增 |
| **篩選（類型、來源）** | 原生設計新增 |
| **圖表化呈現** | 原生設計新增 |

### 事件類型

| 事件名 | 說明 |
|--------|------|
| `gateway:connected` | Gateway 連線 |
| `gateway:disconnected` | Gateway 斷線 |
| `agent:online` | Agent 上線 |
| `agent:offline` | Agent 離線 |
| `agent:busy` | Agent 忙碌 |
| `session:new` | 新 Session |
| `session:end` | Session 結束 |
| `task:created` | 任務建立 |
| `task:updated` | 任務更新 |
| `task:deleted` | 任務刪除 |
| `system:health` | 健康異常 |
| `error` | 系統錯誤 |

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/events/stream` | SSE 即時事件流 |
| GET | `/api/events/history` | 事件歷史 |
| GET | `/api/events/stats` | 事件統計 |

---

## 8. Settings（設定）

### 設計原則

Settings 頁面直接管理 `openclaw.json` 設定，提供視覺化介面。

### 可視化管理的設定（stored in openclaw.json）

| 設定類別 | 可調整項目 |
| --------------- | --------------------------- |
| Agents | 新增/刪除/修改 Agent、模型、Workspace |
| Channels | 連接設定、Webhook、頻道配置 |
| Gateway | bind、port、trustedProxies |
| Providers | API Keys（需加密顯示）、Provider 設定 |
| Plugins | 插件啟用/停用、設定 |
| Agents Defaults | timeoutSeconds、預設模型 |

### 安全性設計

| 措施 | 說明 |
| ------ | ----------------------- |
| 讀取時遮蔽 | API keys 顯示為 ****，不暴露明文 |
| 寫入時驗證 | 每個設定有 Schema 驗證，防止錯誤格式 |
| 危險操作標記 | 改 Gateway bind 需要額外確認 |
| 重啟檢測 | 某些設定改完需要重啟 Gateway，會提示 |
| 操作日誌 | 誰、什麼時間、改了什麼設定 |

### 實作範圍

```
Settings 分頁
├── 一般設定（主題、語言等）
├── Agents 管理（新增/修改/刪除 Agent）
├── Channels 管理（新增/修改頻道）
├── Gateway 設定（bind、port、security）
├── Providers（API Keys 管理）
└── Plugins（插件管理）
```

### API Endpoints

| Method | Endpoint | 說明 |
|--------|----------|------|
| GET | `/api/settings` | 取得所有設定（遮蔽敏感資料）|
| PATCH | `/api/settings` | 更新設定 |
| GET | `/api/settings/themes` | 可用主題列表 |
| POST | `/api/settings/reset` | 重置為預設 |
| GET | `/api/settings/schema/:category` | 取得指定類別的 Schema |
| POST | `/api/settings/validate` | 驗證設定格式 |

#### GET /api/settings
```javascript
{
  general: {
    theme: 'dark' | 'light',
    language: string,
    timezone: string,
    refresh_interval_ms: number
  },
  agents: [
    { id, name, model, workspace, status }
  ],
  channels: [
    { id, type, config, enabled }
  ],
  gateway: {
    bind: string,
    port: number,
    trustedProxies: string[]
  },
  providers: [
    { name, has_key: boolean, last_used: string }
  ],
  plugins: [
    { name, enabled, config }
  ],
  defaults: {
    timeoutSeconds: number,
    defaultModel: string
  }
}
```

#### PATCH /api/settings
```javascript
// Request body
{
  category: 'agents' | 'channels' | 'gateway' | 'providers' | 'plugins' | 'defaults',
  action: 'create' | 'update' | 'delete',
  data: { ... }  // 根據 category 不同而異
}
```

---

## 實作階段

### Phase 1：Overview（系統概覽）🔄 實作中
- [x] `GET /api/gateway/status` ✅
- [ ] `GET /api/system/health`
- [ ] `GET /api/overview/summary`
- [ ] `POST /api/system/refresh`
- [ ] SSE 連線狀態更新

### Phase 2：Agents（代理）
- [ ] Agent 列表與狀態
- [ ] Agent 詳情
- [ ] Agent 重啟
- [ ] 發送任務

### Phase 3：Sessions（會話）
- [ ] Session 列表
- [ ] Session 詳情
- [ ] 訊息歷史
- [ ] 終止 Session

### Phase 4：Tasks（任務）
- [x] 任務 CRUD ✅ 已實作
- [ ] 任務統計
- [ ] 任務歷史

### Phase 5：Logs（日誌）
- [ ] 日誌列表
- [ ] 日誌詳情
- [ ] SSE tail
- [ ] 清除日誌

### Phase 6：Gateway（網關）
- [ ] Config 檢視/編輯
- [ ] Security Audit
- [ ] Channel Bindings
- [ ] Plugin 狀態

### Phase 7：Events（事件）
- [x] SSE 事件流 ✅ 已實作（部分）
- [ ] 事件歷史
- [ ] 事件統計

### Phase 8：Settings（設定）
- [ ] GET /api/settings（遮蔽敏感資料）
- [ ] PATCH /api/settings（更新設定）
- [ ] GET /api/settings/themes
- [ ] POST /api/settings/reset
- [ ] GET /api/settings/schema/:category
- [ ] POST /api/settings/validate
- [ ] Schema 驗證機制
- [ ] 危險操作二次確認
- [ ] 設定變更日誌

---

*規劃日期：2026-04-13*
*更新日期：2026-04-14（完整資訊彙整）*

---

## 參考系統詳細架構（已驗證）

### 資料索引

| 來源 | Repo / 文件位置 | 關鍵資料 |
|------|----------------|---------|
| **Edict（三省六部）** | https://github.com/cft0808/edict | 任務流向、Agent 角色分工 |
| **Mission Control** | https://github.com/builderz-labs/mission-control | Task Queue、Quality Gates |
| **Mission Control 編排** | `builderz-labs/mission-control/docs/orchestration.md` | Aegis 詳細機制 |
| **OpenClaw 原生** | 本地 `~/.npm-global/lib/node_modules/openclaw/docs/` | Control UI 功能、Gateway API |

---

### Edict（三省六部）

**Repo:** https://github.com/cft0808/edict

**任務流向（來源：Edict README）：**
```
皇上（你）→ 太子分揀 → 中書省規劃 → 門下省審核 → 尚書省派發 → 六部執行 → 回奏
```

| 角色 | Agent | 功能 | 來源 |
|------|-------|------|------|
| 皇上 | 你 | 下達旨意 | README |
| 太子 | taizi | 分揀：閒聊直接回 / 旨意才建任務 | README |
| 中書省 | zhongshu | 接旨 → 規劃 → 拆解子任務 | README |
| 門下省 | menxia | 審議方案 → 准奏 / 封駁 | README |
| 尚書省 | shangshu | 派發任務 → 協調六部 → 彙總回奏 | README |
| 六部 | hubu/libu/bingbu/xingbu/gongbu | 各司其職執行 | README |

**特點：**
- 零後端（純前端 API proxy）
- 任務審核流程完整（可封駁）
- 適合你只下指令、Agent 自動完成的場景

**重要文件：**
- README: https://github.com/cft0808/edict

---

### Mission Control

**Repo:** https://github.com/builderz-labs/mission-control

**任務系統（來源：README）：**
- Task Queue + Kanban Board（6 欄位）
- Quality Gates（Aegis 審核系統）
- Multi-agent Workflows
- RBAC（Viewer/Operator/Admin）
- Natural Language Scheduling
- Recurring Tasks

**適用場景：** 需要精細控制、多 Agent 協作的複雜專案

**重要文件：**
- README: https://github.com/builderz-labs/mission-control
- Orchestration Docs: https://github.com/builderz-labs/mission-control/blob/main/docs/orchestration.md

---

### Aegis 質量審查機制（來源：orchestration.md）

**Repo:** https://github.com/builderz-labs/mission-control/blob/main/docs/orchestration.md

**流程：**
```
in_progress → review → Aegis Agent 審查 → APPROVED → done
                                    └→ REJECTED → 退回重做（附 feedback）
                                    └→ 最多 3 次
                                    └→ 3 次失敗 → failed
```

**關鍵：Aegis 就是一個普通 Agent，審核維度由它的 SOUL 決定，不是固定的。**

---

### OpenClaw 原生 Control UI（來源：本地文檔）

**路徑：** `~/.npm-global/lib/node_modules/openclaw/docs/`

**功能：**
- Chat、Channels、Instances、Sessions、Dreams、Cron、Skills、Nodes、Exec Approvals、Config、Debug、Logs

**重要文件：**
- Control UI: `~/.npm-global/lib/node_modules/openclaw/docs/web/control-ui.md`
- Gateway Health: `~/.npm-global/lib/node_modules/openclaw/docs/gateway/health.md`

