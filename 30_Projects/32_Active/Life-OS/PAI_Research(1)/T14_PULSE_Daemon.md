# T14 — PULSE Daemon

> 組ID：T14
> 來源：PAI/DOCUMENTATION/Pulse/PulseSystem.md + skills/Daemon/SKILL.md
> 檔案總數：2份核心文件
> 優先級：高

---

## 檔案結構分析

### Pulse System（PULSE）

PULSE 是 PAI 的**生命儀表板（Life Dashboard）**，位於 `~/.claude/PAI/PULSE/`。

**核心定位：**「PAI 是作業系統；PULSE 是讓你看見它如何運行的介面。」

**架構：** 單一 Bun 程序，監聽 port 31337，由 launchd 管理（macOS）。

```
launchd (com.pai.pulse)
    ↓
pulse.ts（心臟跳動循環）
    ├── loadConfig() ← PULSE.toml
    ├── readState() ← state/state.json
    ├── for each enabled job:
    │   ├── isDue(schedule)?
    │   ├── circuit breaker（3次連續失敗則跳過）
    │   ├── execute（script 或 claude）
    │   ├── sentinel check
    │   ├── dispatch output（voice/telegram/ntfy/log）
    │   └── writeState()（atomic）
    └── smart sleep → loop
```

### Daemon Skill（公開數位分身）

Daemon 是**公開的數位化身系統**，由 `DaemonAggregator.ts` 從 PAI 私人資料來源匯聚，經 `SecurityFilter.ts` 過濾後生成靜態網站，部署至 Cloudflare Pages。

**兩 repo 模式：**
```
PAI SOURCES（私人）
    ↓
DaemonAggregator.ts → daemon-data.json
    ↓
SecurityFilter.ts（模式比對，非 LLM 判斷）
    ↓
~/Projects/daemon-dm/（私人內容 repo）
    ↓ deploy.sh
~/Projects/daemon/（公開 forkable 框架）
```

**與 PULSE 的關係：** 完全不同。PULSE 是本地后台監控 daemon；Daemon 是公開的個人品牌頁面系統。

---

## 核心機制

### 1. PULSE 子系統模組

| Module | Description | Source |
|--------|-------------|--------|
| **Cron** | 排程任務心跳迴圈 | `pulse.ts` |
| **Voice** | ElevenLabs TTS 語音通知 | `VoiceServer/voice.ts` |
| **Hooks** | Skill-guard / Agent-guard 驗證 | `modules/hooks.ts` |
| **Observability** | 資料 API + Observatory dashboard | `Observability/observability.ts` |
| **Telegram** | grammY polling bot | `modules/telegram.ts` |
| **iMessage** | SQLite polling bot（預設關閉）| `modules/imessage.ts` |
| **Worker** | GitHub Issues 工作輪詢 | `checks/github-work.ts` |
| **Assistant** | DA 身份、心跳、排程、成長 | `Assistant/module.ts` |
| **UserIndex** | USER/ 索引 → 驅動 `/life` dashboard | `modules/user-index.ts` |

**每個子系統在單一程序內 crash-isolated**，一個崩潰不會影響其他模組。

### 2. 工作型別

**Script Job（`type = "script"`）：**
- 執行 shell 命令，60 秒超時
- 成本：$0（使用免費 API）

**Claude Job（`type = "claude"`）：**
- 透過 `claude --print` 呼叫 Claude CLI（headless）
- 5 分鐘超時
- 成本：取決於模型（Haiku ≈ $0.001/次，Sonnet ≈ $0.02-0.03/次）

### 3. 輸出路由

| Target | Destination | Max Length |
|--------|-------------|------------|
| `voice` | ElevenLabs TTS（內部函式呼叫）| 500 chars |
| `telegram` | Telegram Bot API | 4096 chars |
| `ntfy` | ntfy.sh 推播 | 4096 chars |
| `log` | stdout | 無限制 |

### 4. Sentinel 模式

無需上報時輸出 sentinel 值，完全抑制調度：
- `NO_ACTION` — GitHub 無新 PR
- `NO_URGENT` — 郵件無緊急郵件
- `NO_EVENTS` — 行事曆無即將到來事件
- `HEARTBEAT_OK` — 系統健康

### 5. Daemon 安全過濾

`SecurityFilter.ts` 是**確定性程式碼層級過濾**（非 LLM 判斷）：
- 結構性排除：CONTACTS、FINANCES、HEALTH、OUR_STORY、OPINIONS
- 模式匹配剷除：名字、路徑、憑證、內部引用
- 失敗設為封閉（預設排除）

---

## PULSE.toml 格式

```toml
[voice]
enabled = true
voice_id = "<YOUR_ELEVENLABS_VOICE_ID>"

[telegram]
enabled = true

[imessage]
enabled = false

[observability]
enabled = true

[hooks]
enabled = true

[[job]]
name = "calendar-reminder"
schedule = "*/10 * * * *"
type = "script"
command = "bun run checks/calendar.ts"
output = "voice"
enabled = true

[[job]]
name = "morning-brief"
schedule = "0 7 * * *"
type = "claude"
prompt = "Prepare a morning brief..."
model = "sonnet"
output = "voice"
enabled = true
```

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計

1. **Cron 驅動的每日健康檢查**
   PULSE 的 `health.ts` 每 5 分鐘檢查網站狀態，`email.ts` / `calendar.ts` 定期報告。Life-OS 若建立「系統每日巡檢」的 cron 腳本，可作為 vault 健康度的被動監控層。

2. **Sentinel 抑制無效通知**
   「沒有值得上報的就不報告」的設計哲學，直接適用於 Life-OS 的「每日總結」機制——若當日無實質變化，應抑制輸出以避免噪音。

3. **Circuit Breaker（熔斷機制）**
   3次連續失敗自動跳過並持續警告，是防止錯誤狀態無限迴圈的好設計。Life-OS 若引入「技能執行連續失敗 → 自動暫停」的機制，可避免錯誤技能持續消耗資源。

4. **UserIndex 驅動 Dashboard**
   `UserIndex` 模組監看 USER/ 目錄變化並即時更新 dashboard，是「檔案變化 → 系統反應」的直接範本。Life-OS 可對應建立「vault 變化追蹤 → 每日摘要生成」的模組。

5. **Daemon 的雙 Repo 架構**
   公開框架與私人內容分離，是「分享模板但保護隱私」的典範。Life-OS 的「研究完成後創建新 Vault」策略與此精神相通。

### 不宜照搬的部分

- **macOS launchd綁定** — Life-OS 基於 Obsidian，無 launchd
- **Bun runtime** — Life-OS 目前以 Python/shell 為主
- **Cloudflare Pages 部署** — Daemon 是公開網站，Life-OS 是本地 vault
- **ElevenLabs TTS** — 語音通知對 Life-OS 非必要功能

---

## 關聯檔案

- **T13 — USER Identity**：USER 目錄是 PULSE UserIndex 的上游資料來源
- **T15 — DA Identity**：DA 是 PULSE Assistant 模組的核心身份載體
- **T30 — Install & Verify System**：PULSE 本身是系統級元件，其安裝驗證屬於系統整合範疇

---

## 檔案清單

1. `~/.claude/PAI/DOCUMENTATION/Pulse/PulseSystem.md`
2. `~/.claude/PAI/DOCUMENTATION/Pulse/DaSubsystem.md`
3. `~/.claude/PAI/PULSE/pulse.ts`
4. `~/.claude/PAI/PULSE/pulse-unified.ts`
5. `~/.claude/PAI/skills/Daemon/SKILL.md`
6. `~/.claude/PAI/skills/Daemon/Workflows/UpdateDaemon.md`
7. `~/.claude/PAI/skills/Daemon/Workflows/DeployDaemon.md`
8. `~/.claude/PAI/skills/Daemon/Tools/DaemonAggregator.ts`
9. `~/.claude/PAI/skills/Daemon/Tools/SecurityFilter.ts`
10. `~/.claude/PAI/skills/Daemon/Docs/SecurityClassification.md`
