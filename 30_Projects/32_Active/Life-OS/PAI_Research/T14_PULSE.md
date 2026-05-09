# T14 — PULSE Daemon

> 組ID：T14
> 來源：`Releases/v5.0.0/.claude/PAI/PULSE/**/*`
> 檔案總數：58（核心模組 + checks + Observability + Assistant + MenuBar）
> 採樣分析：13 個核心檔案
> 優先級：🔴 核心系統

---

## 檔案結構分析

PULSE 是 PAI 生態系的核心長期運行 daemon，架構為**單一程序、多模組插件系統**。目錄結構：

```
PULSE/
├── pulse.ts              # 單一程序主入口（新版，含 DA/Assistant）
├── pulse-unified.ts      # 單一程序主入口（舊版）
├── pulse-old.ts          # 歷史版本保留
├── PULSE.toml            # 設定檔（cron jobs + 模組開關）
├── lib.ts                # 共享設施工具（cron matching、state I/O、dispatch、spawn）
├── setup.ts              # Worker provisioning 腳本
├── com.pai.pulse.plist   # macOS launchd 服務定義
├── manage.sh             # 服務管理脚本
├── start-pulse.sh       # 啟動脚本
├── lib/
│   ├── sanitize.ts       # 輸入淨化與注入攻擊分析
│   ├── messages-db.ts    # iMessage SQLite 查詢
│   ├── imessage-send.ts  # iMessage 發送（AppleScript）
│   ├── conversation.ts   # 對話歷史持久化
│   └── ...
├── modules/
│   ├── hooks.ts          # Hook 驗證伺服器（skill-guard、agent-guard）
│   ├── imessage.ts        # iMessage chatbot 模組
│   ├── telegram.ts        # Telegram bot 模組
│   ├── wiki.ts            # Wiki 查詢模組
│   ├── syslog.ts          # Syslog 接收模組
│   └── user-index.ts      # 使用者索引
├── checks/               # Script-type cron jobs（健康檢查、空氣品質、GitHub 等）
├── VoiceServer/
│   └── voice.ts           # ElevenLabs TTS + macOS 通知模組
├── Observability/        # Next.js Dashboard（Life Dashboard）
│   └── out/              # 編譯後的靜態輸出
├── Performance/
│   └── cost-aggregator.ts # API 成本追蹤
├── Assistant/            # DA 子系統
│   └── checks/           # heartbeat / tasks / diary / growth jobs
└── MenuBar/             # macOS Menu Bar 應用（Swift）
    ├── PulseMenuBar.swift
    ├── icon.png
    └── install.sh
```

---

## 核心機制

### 1. 單一程序架構（Unified Daemon）

`pulse.ts` 是單一 Bun 程序，透過**條件式動態載入**插件化模組。每個模組都是 class 或工廠函式，由主程序統一呼叫：

```
Pulse 主程序
  ├── HTTP 伺服器（Bun.serve，單一 port 31337）
  │     ├── /healthz, /api/pulse/health  → 健康檢查
  │     ├── /notify, /voice             → Voice 模組
  │     ├── /hooks/*                    → Hook 模組
  │     ├── /api/wiki/*                 → Wiki 模組
  │     ├── /assistant/*                → DA 模組
  │     ├── /api/performance/*          → 效能模組
  │     ├── /api/syslog/*               → Syslog 模組
  │     └── /dashboard/*, /api/*        → Observability 模組（Next.js）
  ├── Cron 心跳迴圈（每分鐘結算一次）
  │     └── 根據 crontab 排程執行 jobs
  └── Long-running 子系統（supervised 自動重啟）
        ├── Telegram polling（grammY）
        └── iMessage polling（SQLite）
```

**關鍵設計： Supervisor 模式**。當 Telegram/iMessage 子系統崩潰，會在 30 秒後自動重啟，而不 kill 主程序。

### 2. Cron 排程引擎（lib.ts）

自幹的 5 格 cron 解析器（`minute hour day month weekday`），實作於 `lib.ts:parseField()` + `matchesCron()`：

```typescript
// 支援語法：
*           // 任意值
*/5         // 每 5 單位
1,30        // 具體值
1-30        // 範圍
```

**isDue() 防重複**：同一分鐘內不執行兩次（`Math.floor(now / 60000) > Math.floor(lastRun / 60000)`）。

### 3. 輸出 dispatch 系統（lib.ts:dispatch）

Job 完成後根據 `output` 設定分發至多個目標：

| 目標 | 機制 |
|------|------|
| `voice` | HTTP POST 到 `localhost:31337/notify` |
| `telegram` | 直接呼叫 Telegram Bot API |
| `ntfy` | POST 到 `ntfy.sh/${topic}` |
| `email` | 呼叫 `gws gmail +send` |
| `log` | 僅寫入日誌 |

**Sentinel 抑制**：`NO_ACTION`、`NO_URGENT`、`NO_EVENTS`、`HEARTBEAT_OK` 這四個輸出會直接跳過 dispatch，不發通知。

### 4. 計費安全機制（Critical）

`pulse.ts` 和 `lib.ts` 在啟動時主動刪除 `ANTHROPIC_API_KEY`：

```typescript
delete process.env.ANTHROPIC_API_KEY
```

這是因為 April 2026 帳單事故（$498.45）：若 API Key 存在於環境中，`claude` CLI 和 SDK 會優先使用 API Key 計費，而非 OAuth 訂閱。刪除後再呼叫 `spawnClaude()`，確保使用訂閱制計費。

`telegram.ts` 和 `imessage.ts` 也各自刪除一次，形成**縱深防禦**。

### 5. Hook 驗證系統（modules/hooks.ts）

Pulse 內建 HTTP hook 端點，供 Claude Code 的 `PreToolUse` 事件呼叫：

- **skill-guard**（`/hooks/skill-guard`）：阻擋 `keybindings-help` 等已知假阳性 skill
- **agent-guard**（`/hooks/agent-guard`）：對背景 agent 附加 watchdog；對前景 agent 發出警告

### 6. Telegram 模組（modules/telegram.ts）

使用 `grammy` 輪詢，架構：

```
Telegram 消息抵達
  → Auth middleware（檢查 user ID 是否允許清單）
  → sanitize() + injection 分析
  → 查詢 conversationStore 取最近 5 組對話
  → 組合 prompt（歷史 + 新消息）
  → claude-agent-sdk query() streaming
  → 漸進式編輯回覆（每 800ms 更新一次 Telegram 消息）
  → 持久化對話
```

**關鍵：settingSources 排除 "local"**（`["user", "project"]`），避免觸發 CLAUDE.md 的 Algorithm 格式和 voice notify curl。

**CRITICAL TELEGRAM MODE OVERRIDE**：在 systemPrompt 中明確覆寫所有格式規則，強制自然對話、禁 emoji 標頭、禁演算法格式。

### 7. iMessage 模組（modules/imessage.ts）

架構類似 Telegram，但資料來源不同：

```
~/Library/Messages/chat.db（SQLite）
  → getNewMessages(lastRowId)
  → 權限控制（allowed_handles）
  → sanitize() + injection 分析
  → claude-agent-sdk query()
  → AppleScript 發送回覆
```

**Cursor 持久化**：每次處理完更新 `cursor.json`（lastRowId），重啟後從中斷處繼續。首次執行時從最新訊息 ID 開始，確保不回溯歷史。

### 8. Voice 模組（VoiceServer/voice.ts）

3 層語音設定解析優先序：

```
Tier 1：呼叫端直接傳 voice_settings → 直接使用
Tier 2：呼叫端傳 voice_id → 查 settings.json daidentity.voices[id]
Tier 3：都沒有 → 使用 daidentity.voices.main
```

**13 種情緒疊加層**（EMOTIONAL_PRESETS）：從 emoji marker（如 💡 insight、🎉 celebration）映射到 ElevenLabs 的 stability + similarity_boost 參數，微調語音情感。

**13 種發音規則**（pronunciations.json）：regex 替換不正確的發音。

### 9. PULSE.toml 結構

```toml
[voice]     enabled = true
[telegram]  enabled = true
[imessage]  enabled = false
[observability] enabled = true, dashboard_dir = "Observability/out"
[performance] enabled = true
[hooks]     enabled = true, blocked_skills = ["keybindings-help"]
[syslog]    enabled = true, port = 5514
[da]        enabled = true, primary = "kai", heartbeat_schedule = "*/30 * * * *"

[[job]]
name = "healthcheck"
schedule = "*/5 * * * *"
type = "script"
command = "bun run checks/health.ts"
output = "ntfy"
enabled = true
```

Jobs 類型：`script`（直接執行命令，零 AI 成本）vs `claude`（呼叫 `claude --print`，有 token 成本）。

### 10. DA 子系統（Assistant/）

Pulse 包含一個 DA（Digital Assistant）子系統，於 `pulse.ts:da.*` 設定後啟用，由獨立的 `Assistant/checks/` cron jobs 驅動：

| Job | Schedule | 用途 |
|-----|----------|------|
| `assistant-heartbeat` | `*/30 * * * *` | HAHAI 存活心跳 |
| `assistant-tasks` | `* * * * *` | 每分鐘任務檢查 |
| `assistant-diary` | `0 23 * * *` | 日記寫入 |
| `assistant-growth` | `0 4 * * 0` | 每週成長回顧 |

### 11. Observability Dashboard

`Observability/out/` 是一個編譯後的 Next.js 靜態應用，用於呈現生命作業儀表板（Life Dashboard）。由 `pulse.ts` 直接 serve（`/dashboard/*` 路由），不需單獨程序。

---

## 內容差異分析

### pulse.ts vs pulse-unified.ts

| 面向 | pulse.ts（新） | pulse-unified.ts（旧） |
|------|----------------|------------------------|
| 行數 | 551 | 430 |
| 目錄命名 | `PULSE/` | `Pulse/` |
| 預設 Port | 31337 | 8686 |
| DA 模組 | ✅ 有（Assistant） | ❌ 無 |
| Performance 模組 | ✅ 有 | ❌ 無 |
| Syslog 模組 | ✅ 有 | ❌ 無 |
| Observability 路徑 | 多了 `/_next/` 和 `/favicon.ico` | 標準 Next.js |
| 健康端點 | `/api/pulse/health` + `/healthz` | `/health` |
| BIND_ALL | ✅ 有 `PAI_PULSE_BIND_ALL=1` 選項 | ❌ 無 |

`pulse.ts` 是完整版，`pulse-unified.ts` 可能是過渡期中保留的簡化版。

### launchd plist 差異

| 檔案 | Label | 路徑 |
|------|-------|------|
| `com.pai.pulse.plist` | `com.pai.pulse` | 主 daemon |
| `MenuBar/com.pai.pulse-menubar.plist` | `com.pai.pulse-menubar` | Menu Bar 附屬程式 |

Menu Bar App 單獨由自己的 launchd agent 啟動，**不在 pulse.ts 內部 spawn**，避免重複圖示。

---

## 與 Life-OS 的借鑒點

### ✅ 可借鑒

1. **單一程序 + 模組化插件架構**：Pulse 的 `loadModules()` + 條件式動態載入模式非常值得借鑒。Life-OS 的 daemon（如果有的話）可以採用相同模式，每個功能（habit tracking、review、sync）作為插件而非 monolith。

2. **3 層設定解析（TOML → 預設值 → 環境變數）**：Voice 模組的 3-tier 解析策略（caller > voice_id > main），可應用於 Life-OS 各模組的設定繼承。

3. **計費安全刪除 API Key**：直接刪除 `ANTHROPIC_API_KEY` 的模式，簡單粗暴但有效，適用於任何 CLI/SDK 混用場景。

4. **Supervisor 自動重啟**：當子系統（Telegram/iMessage）崩潰時隔離重啟，不影響主程序。這對 Life-OS 的外部整合（Habitica API、Notion sync）很有價值。

5. **Cursor + 狀態持久化**：iMessage 模組的 `lastRowId` cursor 模式，可借鑒用於「中斷後從斷點繼續」的長期任務。

6. **情緒語音疊加（Emotional Presets）**：13 種情緒映射到語音參數，是將「元資料」轉譯為「呈現參數」的好範例，可借鑒用於 Life-OS 的「情緒狀態 → 輸出風格」。

7. **Dispatch 抑制（Sentinel）**：`NO_ACTION` 等 sentinel 輸出模式，可借鑒用於抑制無意義的通知。

### ⚠️ 警戒線

1. **硬編碼 Port 31337**：`localhost:31337` 在 `lib.ts:dispatch()` 和 `setup.ts:healthCheck()` 都有直接引用。若 Port 變更需要同步修改多處。

2. **ANTHROPIC_API_KEY 刪除位置散落**：需在每個使用 SDK 的模組（pulse.ts、lib.ts、telegram.ts、imessage.ts）各自刪除一次，是重複也是風險——新模組可能忘記加。

3. **Secrets 於 .env 明文**：Worker 設定產生的 `.env` 內容直接寫入，Bot Token 等 secrets 純依賴系統檔案權限，無加密。

---

## 關聯檔案

- **T11 — Memory System**：PULSE 的 `memory-consolidation` job 依賴 `SessionHarvester.ts` 和 `LearningPatternSynthesis.ts`（屬於 T11 範疇）
- **T12 — Algorithm**：Telegram/ iMessage 的 systemPrompt 明確排除 Algorithm 格式（這是刻意的）
- **T08 — ISA System**：DA 子系統（Assistant/）的 config 格式可能與 ISA System 有關
- **T09 — Interview System**：Pulse 的 notification-governor job 是 P1 interview 的產物
