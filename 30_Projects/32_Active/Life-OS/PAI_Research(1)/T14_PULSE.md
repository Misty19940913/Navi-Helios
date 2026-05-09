# T14 — PULSE Daemon

> 組ID：T14
> 來源：Releases/v5.0.0/.claude/PAI/PULSE/**/*
> 檔案總數：310
> 採樣分析：12 個核心檔案
> 優先級：高

---

## 檔案結構分析

PULSE 是一個以 Bun 為執行環境的長期運行 Daemon，採用模組化架構。核心採用 TOML 設定檔驅動，結合 TypeScript 形態的模組系統。

**目錄組織：**

| 目錄 | 職責 |
|------|------|
| `checks/` | Job 腳本（health.ts, life-morning-brief.ts 等） |
| `lib/` | 共享設施工具（cron matching、state I/O、output dispatch） |
| `modules/` | 通訊模組（telegram.ts、iMessage、hooks、wiki、syslog） |
| `VoiceServer/` | ElevenLabs TTS + macOS 通知模組 |
| `Performance/` | 成本追蹤 + 工具失敗率分析 API |
| `GitHub/` | GitHub App 整合 + Issue/PR 工作流 |
| `Arbol/` | 樹狀工作追蹤模組 |
| `state/` | DaemonState、cursor、conversations 等持久化狀態 |
| `logs/` | 各模組的聊天日誌 |
| `certs/` | mkcert 生成的 TLS 憑證 |
| `*.ts` | 主程式（pulse.ts、setup.ts、run-job.ts、manage.sh） |

**關鍵檔案職責對照：**

| 檔案 | 職責 |
|------|------|
| `pulse.ts` | 主 Daemon — HTTP 伺服器（31337）、Job 排程器、模組生命週期管理 |
| `lib.ts` | Cron 解析、State I/O（atomic write-to-tmp + rename）、Output Dispatch（voice/telegram/email/ntfy/log）、Process Spawning（script + claude） |
| `setup.ts` | Worker provisioning 腳本（互動式，引導完成 30 分鐘內從零到 Worker） |
| `run-job.ts` | 手動觸發特定 Job 的工具 |
| `manage.sh` | 部署腳本（daemonize、launchd service） |

---

## 內容差異分析

### Job 腳本差異

| 腳本 | 類型 | 成本 | 輸出邏輯 |
|------|------|------|----------|
| `checks/health.ts` | script | $0 | HTTP HEAD → 失敗才 output |
| `checks/life-morning-brief.ts` | script | $0 | 讀 GOALS/SPARKS/CURRENT → 有內容才 output |

**health.ts 特色：** 零 AI 成本，純 HTTP HEAD 探測，可透過 `PAI_PULSE_HEALTH_SITES` 環境變數配置站點。失敗輸出格式：`Site health alert:\n{name}: DOWN ({error})\n`。

**life-morning-brief.ts 特色：** 讀取 `~/.claude/PAI/USER/TELOS/` 下的結構化 Markdown，解析頂部 3 個目標（G1/G2/G3）、隨機 Spark、下一個動作，組合為語音敘述。

### 通訊模組差異

| 模組 | 協定 | 訊息處理 | 計費策略 |
|------|------|----------|----------|
| `telegram.ts` | Telegram Bot API（grammY polling） | Streaming 回覆 + 漸進編輯 | ANTHROPIC_API_KEY 刪除 → OAuth |
| `imessage.ts` | macOS Messages.db（SQLite polling） | 全功能 SDK session | 同上 |
| `modules/voice.ts` | ElevenLabs TTS + AppleScript | 情緒標記 + 發音規則 | N/A（純 output） |
| `modules/syslog.ts` | UDP 5514 | RFC3164 + CEF 解析 → JSONL | N/A |

### 關鍵設計差異：Telegram vs iMessage

**Telegram** (`settingSources: ["user", "project"]`)：
- 明確排除 `local` 以避免 CLAUDE.md 的 ALGORITHM 格式規則干擾
- 有 `TELEGRAM MODE OVERRIDE` system prompt 覆寫，禁用格式標記、強制自然對話
- Streaming 漸進編輯（`editMessageText`），減少等待感知

**iMessage** (`settingSources: ["user", "project", "local"]`)：
- 全功能 CLAUDE.md 發現（包括 local 專案）
- 會話持久化（cursor.json）、對話歷史（conversations.json）
- 嚴格的注入攻擊防御（`analyzeForInjection`）

---

## 核心機制

### 1. Cron 排程引擎（lib.ts）

純 TypeScript 實現，支援完整 5 欄位 cron 表達式：
```
parseField() → 解析 *, /, -, , 組合
matchesCron() → 比對目前時間與表達式
isDue() → 附加「每分鐘最多一次」防重複保護
```

### 2. State I/O（lib.ts）

```
readState() / writeState()
└── Bun.write(tmp) + rename() — 原子寫入，保護進度
```

### 3. Output Dispatch（lib.ts）

```
dispatch() → Promise.allSettled(targets.map(dispatchSingle))
  ├─ voice:    fetch http://localhost:31337/notify
  ├─ telegram: Bot API sendMessage
  ├─ email:    gws gmail +send
  ├─ ntfy:     POST https://ntfy.sh/{topic}
  └─ log:      (無操作)
Sentinel 抑制：NO_ACTION, NO_URGENT, NO_EVENTS, HEARTBEAT_OK → 跳過 dispatch
```

### 4. Claude Spawning（lib.ts）

**計費 Bug 修復軌跡：**
- 移除 `--bare` flag（強制 ANTHROPIC_API_KEY 認證，繞過 OAuth 訂閱）
- 刪除 `ANTHROPIC_API_KEY` from env（bun 自動加載 `.env`，SDK 會優先使用 API key）
- `--tools ''` + `--setting-sources ''` 保持輕量子程序

### 5. Claude SDK Session（telegram.ts / imessage.ts）

```typescript
// Streaming 回應收集
for await (const message of conversation) {
  if (msg.type === "stream_event" && msg.event.delta.type === "text_delta") {
    fullText += msg.event.delta.text
    // 漸進編輯 Telegram 訊息
    if (now - lastEditTime >= editIntervalMs) {
      await ctx.api.editMessageText(chatId, messageId, displayText)
    }
  }
  if (msg.type === "result") {
    lastSessionId = msg.session_id  // 用於下次 resume
  }
}
```

### 6. Wiki 模組（modules/wiki.ts）

完整文件管理系統，支援：
- 全文檢索（MiniSearch）
- Wikilink 追蹤 + Backlink 索引
- Bookmarks CSV 解析（RFC 4180 相容）
- 攝取：DOCUMENTATION、KNOWLEDGE、ALGORITHM、SKILLS、HOOKS、ARBOL

### 7. Performance 模組（Performance/module.ts）

觀測三層數據：
```
SESSION_COSTS → session-costs.jsonl（每 session 成本）
TOOL_ACTIVITY → tool-activity.jsonl（工具調用計數）
TOOL_FAILURES → tool-failures.jsonl（失敗記錄）
```
支撐 `/api/performance/cost`、`/api/performance/failures`、`/api/performance/summary`、`/api/performance/anthropic-cost` 四個端點。

### 8. Syslog 模組（modules/syslog.ts）

UDP 5514 接收，支援兩種格式：
- **RFC3164**：`CEF:Version|Device Vendor|...`
- **CEF**：`CEF:Version|Device Vendor|...`

日誌輪轉閾值：50 MB。

### 9. Voice 模組（modules/voice.ts）

**3-tier 語音設定解析：**
```
Tier 1: caller 提供 voice_settings → pass-through
Tier 2: caller 提供 voice_id → 查 settings.json daidentity.voices
Tier 3: 都沒有 → 使用 daidentity.voices.main 預設
```

**13 種情緒預設：** excited、celebration、insight、creative、success、progress、investigating、debugging、learning、pondering、focused、caution、urgent。情緒改變 stability 和 similarity_boost 參數。

**發音規則：** `pronunciations.json` 支援術語自訂，透過 `\b{term}\b` regex 邊界匹配。

### 10. Setup provisioning（setup.ts）

目標：30 分鐘從零到 AI Employee。步驟：
1. 讀 DA_IDENTITY.md 取 worker 名稱
2. GitHub App 建立嚮導（產生 PEM、installation ID）
3. Telegram Bot 建立
4. 產生 PULSE.toml + .env
5. mkcert 本地 HTTPS 憑證（pai hostname + 系統信任）
6. launchd service 安裝
7. Health check

---

## 關聯檔案

- **T13 USER Identity** — PULSE 讀取 `USER/DA_IDENTITY.md` 獲取 worker 身份
- **T11 Memory System** — PULSE 的 `MEMORY/OBSERVABILITY` 寫入成本/失敗數據
- **T12 Algorithm** — `settingSources` 排除 local CLAUDE.md 以避免 ALGORITHM 格式衝突
- **T03 v5.0.0 Skills** — `settingSources` 差異：telegram 排除 local，iMessage 包含 local

---

## 與 Life-OS 的借鑒點

### 1. Pulse 的 Job 系統值得移植
```
// 設計概念對應 Life-OS
Job { name, schedule, type: script|claude, command|prompt, output: [...], enabled }
↓
Life-OS 可用类似结构做「定期任務」：
{ trigger: cron("0 9 * * *"), action: read(GOALS.md), output: voice }
```

### 2. TOML 設定驅動的 Module 載入
PULSE 用 `PULSE.toml` + `modules/syslog.ts` 被 `pulse.ts` 動態 require 的模式，適合 Life-OS 的「被動式技能發現」機制。

### 3. Atomic State I/O
`writeState()` 的 `Bun.write(tmp) + rename()` 模式適合 Life-OS 的進度追蹤，避免崩潰導致狀態損壞。

### 4. Sentinel 抑制模式
`NO_ACTION`、`NO_URGENT` 等 sentinel 讓 job 可自行決定是否需要上報，減少無效通知。Life-OS 的晨間簡報可類似：沒有實質內容時安靜跳過。

### 5. Output Dispatch 抽象
統一的 `dispatch(output, target[])` 支援多元輸出（voice/telegram/email/ntfy/log），未來 Life-OS 可參考此模式支援多通知管道。

### 6. Claude Session Resume
`telegram.ts` / `imessage.ts` 保留 `lastSessionId` 並在下次查詢時傳入 `resume` 參數，實現對話上下文連續性。對長期對話至關重要。

### 7. Streaming 回應 + 漸進編輯
在 Telegram 中使用 `editMessageText` 漸進更新回應，減少等待焦慮。對 Voice 輸出場景有特殊價值。

---

## 檔案清單（採樣分析）

```
PAI/PULSE/lib.ts                          — 共享設施工具（Cron/State/Dispatch/Spawn）
PAI/PULSE/pulse.ts                        — 主 Daemon（未全文讀取，依賴 lib.ts 的已知介面）
PAI/PULSE/checks/health.ts                — 網站健康檢查腳本
PAI/PULSE/checks/life-morning-brief.ts    — 晨間語音簡報腳本
PAI/PULSE/modules/hooks.ts                — Skill/Agent Guard HTTP Hook 驗證
PAI/PULSE/modules/wiki.ts                 — Wiki 文檔 + 全文檢索系統
PAI/PULSE/modules/imessage.ts              — iMessage SDK 對話模組
PAI/PULSE/modules/telegram.ts             — Telegram Bot SDK 對話模組
PAI/PULSE/modules/syslog.ts               — UDP Syslog 攝取模組
PAI/PULSE/Performance/module.ts           — 成本追蹤 + 工具失敗率 API
PAI/PULSE/VoiceServer/voice.ts           — ElevenLabs TTS + 情緒預設系統
PAI/PULSE/setup.ts                        — Worker  provision 互動式安裝腳本
PAI/PULSE/run-job.ts                      — 手動觸發 Job 工具
```
