# Navi-Dashboard Backend

Node.js 標準庫後端服務，零外部依賴。

## 快速開始

```bash
# 安裝依賴（無，純標準庫）
npm install

# 啟動服務
npm start

# 開發模式（自動重啟）
npm run dev
```

## 環境變數

| 變數 | 預設值 | 說明 |
|------|--------|------|
| `PORT` | 7892 | 服務端口 |
| `HOST` | 0.0.0.0 | 監聽地址 |
| `OPENCLAW_HOST` | 127.0.0.1 | OpenClaw Gateway 主機 |
| `OPENCLAW_PORT` | 18789 | OpenClaw Gateway 端口 |
| `LOG_LEVEL` | INFO | 日誌級別 (DEBUG, INFO, WARN, ERROR) |

## API 端點

### OpenClaw 代理

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/gateway/status` | Gateway 狀態 |
| GET | `/api/agents` | Agent 列表 |
| GET | `/api/agents/:id/status` | 單一 Agent 狀態 |
| GET | `/api/sessions` | Session 列表 |
| GET | `/api/sessions/:id` | 單一 Session 詳情 |

### 任務管理

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/tasks` | 任務列表 |
| POST | `/api/tasks` | 建立任務 |
| PATCH | `/api/tasks/:id` | 更新任務 |
| DELETE | `/api/tasks/:id` | 刪除任務 |

### 即時事件

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | `/api/events/stream` | SSE 事件流 |
| GET | `/api/events/health` | 系統健康狀態 |

## 即時事件 (SSE)

連接 `/api/events/stream` 接收以下事件：

```javascript
// Agent 上線/離線
{ type: 'agent:online', data: {...}, time: '...' }
{ type: 'agent:offline', data: {...}, time: '...' }
{ type: 'agent:status', data: {...}, time: '...' }

// 任務變更
{ type: 'task:create', data: {...}, time: '...' }
{ type: 'task:update', data: {...}, time: '...' }
{ type: 'task:delete', data: {...}, time: '...' }
```

## 目錄結構

```
backend/
├── src/
│   ├── routes/
│   │   ├── agents.js    # OpenClaw 代理
│   │   ├── tasks.js     # 任務 CRUD
│   │   └── events.js    # SSE 事件流
│   ├── services/
│   │   ├── openclaw.js  # OpenClaw Gateway 客戶端
│   │   └── taskStore.js # 任務持久化
│   ├── utils/
│   │   └── logger.js    # 日誌工具
│   └── index.js         # 入口
├── data/
│   └── tasks.json       # 任務資料
├── package.json
└── README.md
```

## 技術棧

- **Runtime**: Node.js >= 18
- **HTTP**: Node.js 內建 `http`
- **持久化**: JSON 檔案
- **即時通訊**: Server-Sent Events (SSE)
- **依賴**: 零（純標準庫）

## License

MIT
