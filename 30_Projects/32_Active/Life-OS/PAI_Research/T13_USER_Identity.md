# T13 — USER Identity

> 組ID：T13
> 來源：Releases/v5.0.0/.claude/PAI/USER/**/*
> 檔案總數：60
> 採樣分析：32 個
> 優先級：🔴 高

---

## 檔案結構分析

USER 目錄是 PAI 系統的「身份層」——儲存所有與 Principal（用戶本人）相關的私人資訊。與其他 PAI 系統目錄不同，**USER/ 永不隨 release 發布**，由 ShadowRelease.ts 在發布前以 scaffold 模板覆蓋真實內容，確保隱私。

### 啟動時載入 vs 隨需載入

**啟動時固定載入（CLAUDE.md @-import）：**
- `PAI/USER/PRINCIPAL_IDENTITY.md` — Principal 身份壓縮版
- `PAI/USER/DA_IDENTITY.md` — DA 名稱、聲音、人格
- `PAI/USER/PROJECTS/PROJECTS.md` — 專案註冊表
- `PAI/USER/TELOS/PRINCIPAL_TELOS.md` — 目標/使命/策略摘要

**隨需載入（lazy-load）：**
- 所有其餘 identity 類檔案

### 目錄佈局

```
USER/
├── PRINCIPAL_IDENTITY.md    # 啟動載入：身份壓縮版
├── DA_IDENTITY.md           # 啟動載入：DA 名稱/聲音/人格
├── ABOUTME.md               # 個人敘述
├── BASICINFO.md             # 基本資料（時區、單位、聯絡方式）
├── ARCHITECTURE.md          # 個人系統架構圖
├── RESUME.md                # 職業背景
├── CONTACTS.md              # 人脈關係
├── WRITINGSTYLE.md          # 寫作風格指紋
├── RHETORICALSTYLE.md       # 論證風格
├── OPINIONS.md              # DA 對用戶的工作觀察
├── OUR_STORY.md             # 用戶與 DA 的關係敘事
├── DEFINITIONS.md           # 用戶個人術語表
├── CORECONTENT.md           # 核心內容主題（T0/T1/T2）
├── AI_WRITING_PATTERNS.md   # AI 寫作汙點詞彙黑名單
├── FEED.md                  # 資訊來源配置
├── PRONUNCIATIONS.md        # TTS 發音糾正表
├── TECHSTACKPREFERENCES.md  # 技術棧偏好
├── ALGOPREFS.md             # Algorithm 模式偏好
├── DA/                      # DA 身份子系統
│   ├── README.md
│   ├── _presets.yaml        # 5種人格預設（efficient/friendly/creative/mentor/worker）
│   ├── _example/             # 範例 DA 身份
│   └── <da-name>/            # 用戶實際 DA（由 DAInterview.ts 生成）
├── Config/
│   ├── README.md
│   └── PAI_CONFIG.yaml       # 憑證與系統配置（env 變數參照）
├── SECURITY/
│   ├── README.md
│   └── PATTERNS.yaml         # 安全模式 v3.1（block/alert/trusted）
├── TELOS/                    # 目標系統
│   ├── PRINCIPAL_TELOS.md    # 自動彙總摘要（自動生成）
│   ├── MISSION.md
│   ├── GOALS.md
│   ├── BELIEFS.md
│   ├── STRATEGIES.md
│   ├── NARRATIVES.md
│   ├── CHALLENGES.md
│   ├── PROBLEMS.md
│   ├── BOOKS.md
│   ├── CURRENT_STATE/
│   ├── IDEAL_STATE/
│   ├── WISDOM.md
│   └── PRINCIPAL_TELOS.md
├── WORK/                     #  consultancy 日常工作
│   ├── README.md
│   ├── expenses.md
│   ├── SAMPLE_CONSULTING/
│   ├── SAMPLE_CUSTOMER/
│   └── MY_ORG/
├── BUSINESS/                  # 商業實體層
│   ├── README.md
│   ├── AOS.md
│   └── SAMPLE_COMPANY/
├── DAEMON/
│   └── README.md
├── TERMINAL/
│   └── README.md
├── SHARED/
│   ├── README.md
│   └── Spinner/
├── FLOWS/
│   └── README.md
├── PIPELINES/
│   └── README.md
└── .template-mode
```

---

## 內容差異分析

USER 目錄內所有 `.md` 檔案在本 release 中幾乎全為 **bootstrap 預設**——內含大量 `(interview)` 佔位符，代表尚未由真實用戶填寫的空模板。以下按功能分組分析：

### 身份共識層

| 檔案 | 內容狀態 | 核心佔位符 |
|------|---------|-----------|
| `PRINCIPAL_IDENTITY.md` | Bootstrap | Name: "User", Career Essence: (interview), Worldview: (interview), Key Positions: (interview) |
| `ABOUTME.md` | Bootstrap | Name: "User", Interests/Background: (interview) |
| `BASICINFO.md` | Bootstrap | Pronouns/Location/Email/Profile: (interview), Hours/Deep Focus Windows: (interview) |
| `DA_IDENTITY.md` | 部分填充 | Name: "PAI", Color: #3B82F6, Voice IDs 已設定, Personality 已描述 |

### 寫作與論證層

| 檔案 | 內容狀態 | 核心佔位符 |
|------|---------|-----------|
| `WRITINGSTYLE.md` | Bootstrap | Voice fingerprint/patterns prefer/avoid: (interview) |
| `RHETORICALSTYLE.md` | Bootstrap | Argumentation moves I make/avoid: (interview) |
| `AI_WRITING_PATTERNS.md` | **已填充（部分）** | P0-P2 AI 汙點詞黑名單已預填（非佔位）|
| `CORECONTENT.md` | Bootstrap | T0/T1/T2 primary themes: (interview) |
| `DEFINITIONS.md` | Bootstrap | 個人術語表: (interview) |
| `PRONUNCIATIONS.md` | 部分填充 | Acronym "PAI" → "pie" or "P-A-I" 已預填 |

### 目標與信念層

| 檔案 | 內容狀態 | 核心佔位符 |
|------|---------|-----------|
| `PRINCIPAL_TELOS.md` | Bootstrap + 自動生成 | M0-M2 missions, G0-G2 goals, P0-P1 problems, S0-S1 strategies 皆為範例 |
| `MISSION.md` | Bootstrap | M0-M2: 純範例 |
| `GOALS.md` | Bootstrap | G0-G2: 純範例 |
| `BELIEFS.md` | Bootstrap | 4 個系統思維範例信念 |

### 隱私與安全層

| 檔案 | 內容狀態 | 重要性 |
|------|---------|--------|
| `Config/PAI_CONFIG.yaml` | 部分填充 | paths/principal/da 已預設，API key env 名稱已設定 |
| `SECURITY/PATTERNS.yaml` | **已填充（完整）** | v3.1，156行，安全模式已實作（非佔位）|

### DA 人格子系統

| 檔案 | 內容狀態 | 重要性 |
|------|---------|--------|
| `DA/_presets.yaml` | **已填充（完整）** | 5 種人格預設，12 維度 trait 數值 |
| `DA/_example/identity.yaml` | Bootstrap | 範例 DA 身份格式 |
| `DA/README.md` | 說明文件 | DAInterview.ts 使用指南 |

### 工作與商業層

| 檔案 | 內容狀態 |
|------|---------|
| `WORK/README.md` | Bootstrap 說明 |
| `BUSINESS/README.md` | Bootstrap 說明 |
| `BUSINESS/AOS.md` | Bootstrap |

---

## 核心機制

### 1. 身份共識建立流程（Bootstrap → Interview）

USER/ 設計為**渐进式填充**：

```
Bootstrap 預設（出廠）
    ↓
/run interview（或直接編輯）
    ↓
PRINCIPAL_IDENTITY.md 等被 Rewrite
    ↓
DA 每次 session 啟動讀取最新狀態
```

所有 bootstrap 檔案頂部都有相同標記：`> Bootstrap default — functional before interview. Run /interview to personalize.` 這個設計確保系統**在用戶填寫前就能正常運作**，只是缺乏個人化細節。

### 2. TELOS 自動彙總系統

`PRINCIPAL_TELOS.md` 不是直接編輯的檔案，而是由 `bun PAI/TOOLS/GenerateTelosSummary.ts` 自動從 `TELOS/*.md` 彙總生成。這確保 TELOS 的壓縮視圖（Mission/Goals/Problems/Strategies/Narratives/Beliefs）與各子檔案保持同步。

### 3. 安全模式（PATTERNS.yaml）

這是 USER/ 中最完整的已實現機制：

- **設計哲學**：Targeted 模式，block catastrophic ops silently、alert on suspicious、fail closed on missing config
- **block patterns**：磁碟毀滅（`dd if=/dev/zero`、`diskutil eraseDisk`）、遞迴刪除關鍵目錄（`~/.claude`、`PAI/`、`~/Projects`）、API key 外洩偵測（Stripe/Anthropic/OpenAI keys）、鉤子刪除偵測
- **alert patterns**：git force push、hard reset、SQL DROP、terraform destroy、環境變數傾倒
- **trusted patterns**：playwright-cli、agent-browser、PAI release rebuild
- **路徑權限**：zeroAccess（完全禁止）、alertAccess（alert後允許）、confirmAccess（需確認）、readOnly（唯讀）、noDelete（禁止刪除）

### 4. DA 人格 Trait 系統

`_presets.yaml` 定義 12 維度 trait（enthusiasm/energy/expressiveness/resilience/composure/optimism/warmth/formality/directness/precision/curiosity/playfulness），範圍 0-100。這些數值在 DAInterview.ts 中以滑桿形式呈現給用戶，生成 `DA_IDENTITY.yaml` 和 `DA_IDENTITY.md`。

### 5. AI Writing Patterns 汙點檢測

`AI_WRITING_PATTERNS.md` 已預填 P0（Credibility killers）和 P1（Obvious AI smell）層級黑名單，包括：
- P0：`"I hope this helps"`、`"Feel free to..."`、`"In conclusion..."`
- P1：`"Here's the thing..."`、`"Not just X — Y"`、`"Let's dive in"`

這個黑名單由 `_WRITING` skill 的 rewrite + detect 模式讀取，在生成內容時過濾。

### 6. Privacy 保障

USER/ 是一個**永不發布的私人目錄**：
- ShadowRelease.ts 在發布前刪除整個 USER/ tree
- 僅 overlay generic scaffolds 作為安裝模板
- 用戶的真實身份、職業、人脈、商業資訊保留在本地

---

## 關聯檔案

| 報告 | 關聯說明 |
|------|---------|
| T12 — ALGORITHM.md | Algorithm mode 依賴 PRINCIPAL_TELOS.md 做決策優先排序 |
| T15 — DA_IDENTITY.md | DA_IDENTITY.md 位於 USER/ 頂層，T15 專門研究 DA Identity 子系統 |
| T14 — PULSE Daemon | Pulse 讀取 USER/ 中的工作偏好來驅動 Life Dashboard |
| T11 — MEMORY System | MEMORY/SECURITY/ 路徑在 USER/SECURITY/PATTERNS.yaml 中定義 |
| T10 — CLAUDE Routing | CLAUDE.md 的 @-import 表定義了 USER/ 的啟動載入邊界 |

---

## 與 Life-OS 的借鑒點

### 1. 四文件角色分離原則

PAI USER/ 的設計與 Life-OS Research Document Architecture 的**角色分離哲學**高度共鳴：

| PAI USER/ 角色 | Life-OS 對應 | 都是 |
|---|---|---|
| `PRINCIPAL_TELOS.md` | `task_plan.md` | 目標/任務追蹤 |
| `PRINCIPAL_IDENTITY.md` + 各子檔 | `findings.md` | 一次性深度內容 |
| Session logs（分散各處）| `progress.md` | 歷史/日誌 |
| `Config/PAI_CONFIG.yaml` + `SECURITY/PATTERNS.yaml` | `system-design.md` | 技術規格/配置 |

TELOS 子檔案（MISSION/GOALS/BELIEFS/STRATEGIES）對應 Life-OS 的**多視角目標分解**——每個维度單獨維護，自動彙總成壓縮版。

### 2. Privacy 的物理隔離

USER/ 的「永不發布」設計是 Life-OS vault 隱私原則的硬體級對應。建議 Life-OS 也參考這個模式：對極敏感的 life document（財務、健康）使用 `.gitignore` + separate backup，而非依賴 vault 內的 permission 設定。

### 3. 漸進式填充架構

`(interview)` 佔位符 + Bootstrap 預設的兩層結構，讓系統從第一天就能運作，而非等待完整填寫。這適用於 Life-OS 的新項目初始化：先給 scaffold project structure + 預填所有 section header，具體內容逐步填充。

### 4. 安全模式的 targeted 哲學

`PATTERNS.yaml` 的 block/alert/trusted 三層設計比「全部阻止」更精準。Life-OS 的文件破壞預防（如意外刪除、覆寫）可借鑽：定義「災難性操作」的黑名單（如 `rm -rf` 在特定目錄），其餘正常放行。

### 5. Trait 系統的量化人格

DA 的 12 維度 trait（0-100 分）是將「風格偏好」量化為可直接查表的結構。Life-OS 的「內容風格」和「協作偏好」若能類似量化（如：concise=85/100、technical=70/100），則 agent 的內容生成品質會更穩定。

---

## 檔案清單

```
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/README.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/PRINCIPAL_IDENTITY.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/ABOUTME.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/BASICINFO.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/ARCHITECTURE.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/CORECONTENT.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/WRITINGSTYLE.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/RHETORICALSTYLE.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/OPINIONS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/OUR_STORY.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DEFINITIONS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/PRONUNCIATIONS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/AI_WRITING_PATTERNS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/FEED.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/RESUME.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/CONTACTS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/TECHSTACKPREFERENCES.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/ALGOPREFS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA_IDENTITY.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/README.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_presets.yaml
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_example/identity.yaml
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_example/identity.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/DA/_example/README.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/Config/PAI_CONFIG.yaml
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/Config/README.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/SECURITY/PATTERNS.yaml
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/SECURITY/README.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/TELOS/PRINCIPAL_TELOS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/TELOS/MISSION.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/TELOS/GOALS.md
/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/USER/TELOS/BELIEFS.md
```
