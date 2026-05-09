# T13 — USER Identity

> 組ID：T13
> 來源：Releases/v5.0.0/.claude/PAI/USER/**/*
> 檔案總數：58
> 採樣分析：18 個
> 優先級：高

---

## 檔案結構分析

USER 目錄是 PAI 的**身份層**（Identity Layer），所有檔案在每次 session 啟動時由 `CLAUDE.md` 的 `@` 引用載入，使 DA 在開機時即了解用戶是誰、在做什麼。

### 目錄架構

```
PAI/USER/
├── PRINCIPAL_IDENTITY.md    # 用戶本人身份压縮版（啟動時載入）
├── DA_IDENTITY.md           # DA 的名字、聲音、人格（啟動時載入）
├── ABOUTME.md               # 自我描述
├── BASICINFO.md             # 基本資料（名字、時區、語言、單位）
├── ARCHITECTURE.md          # 個人基礎設施架構圖
├── PROJECTS/                # 專案登記處（含路由別名）
├── TELOS/                   # 目標/使命/策略/挑戰
│   ├── PRINCIPAL_TELOS.md   # 上述TELOS的汇总摘要（啟動時載入）
│   ├── MISSION.md / GOALS.md / STRATEGIES.md
│   ├── PROBLEMS.md / CHALLENGES.md / BELIEFS.md
│   ├── NARRATIVES.md / BOOKS.md / WISDOM.md
│   └── CURRENT_STATE/ / IDEAL_STATE/ / PRINCIPAL_TELOS.md
├── WORK/                    # 工作領域
│   ├── expenses.md / RESUME.md
│   ├── SAMPLE_CONSULTING/ / SAMPLE_CUSTOMER/ / MY_ORG/
│   └── BUSINESS/SAMPLE_COMPANY/ / AOS.md
├── Config/PAI_CONFIG.yaml   # 憑證與設定鑰匙
├── SECURITY/PATTERNS.yaml   # 安全模式
├── DA/                      # DA 身份配置系統
│   ├── _example/identity.yaml / identity.md / README.md
│   ├── _presets.yaml         # 5種人格預設（efficient/friendly/creative/mentor/worker）
│   └── README.md
├── WRITINGSTYLE.md          # 寫作風格指紋
├── RHETORICALSTYLE.md       # 論證風格
├── AI_WRITING_PATTERNS.md   # AI寫作需避免的模式
├── CORECONTENT.md           # 核心內容主題（T0/T1/T2 + 次要主題）
├── OPINIONS.md              # DA對如何與用戶合作的觀察
├── OUR_STORY.md             # 用戶與DA的關係史
├── DEFINITIONS.md           # 用戶的標準術語詞典
├── FEED.md                  # 資訊來源
├── PRONUNCIATIONS.md        # DA需要正確發音的詞
├── CONTACTS.md              # 人脈
├── RESUME.md                # 職業履歴詳情
├── ALGOPREFS.md             # 演算法偏好
├── TECHSTACKPREFERENCES.md  # 技術棧偏好
├── TERMINAL/                # 終端相關
├── Daemon/                  # Daemon相關
├── SHARED/                  # 共享資源
├── PIPELINES/               # 流水線
├── FLOWS/                   # 流程
├── SKILLCUSTOMIZATIONS/     # 技能客製化
└── ACTIONS/                # 行動
```

---

## 核心機制

### 1. 啟動加載協議（Bootstrap Loading）

USER 目錄的檔案透過 `CLAUDE.md` 的 `@` 引用在每次 session 開始時自動注入。核心的5個身份檔案構成**最小啟動集**：
- `PRINCIPAL_IDENTITY.md` — 用戶本人
- `DA_IDENTITY.md` — DA 身份（名字、聲音、人格）
- `PROJECTS/PROJECTS.md` — 專案登記
- `TELOS/PRINCIPAL_TELOS.md` — 目標使命摘要
- `Config/PAI_CONFIG.yaml` — 憑證設定

### 2. DA Identity 系統

DA 不只是通用 AI，而是**被賦予人格的數位分身**。其身份由以下構成：

- **名字 + 顯示名**：`DA_IDENTITY.md` 中定義，替換所有 `{DA_IDENTITY.NAME}` 等變量
- **聲音**：`voice_id` 指向 ElevenLabs 的語音（main: Rachel #21m00Tcm4TlvDq8ikWAM，algorithm: Adam #pNInz6obpgDQGcFmaJgB）
- **人格特質量化**：通过 `_presets.yaml` 中的 12 維度雷達圖（enthusiasm/energy/expressiveness/resilience/composure/optimism/warmth/formality/directness/precision/curiosity/playfulness）
- **自主邊界**：`can_initiate` vs `must_ask` 清單定義了 DA 能主動做什麼 vs 必須先請求
- **關係框架**：Principal（用戶）/ Dynamic（peer）— 是同儕非下屬

### 3. DA/_presets.yaml — 五種人格預設

| 預設 | 特質描述 | 典型場景 |
|------|---------|---------|
| efficient | 快速精準，最少閒聊 | 高壓交易環境 |
| friendly | 溫暖鼓勵，會話式 | 日常陪伴 |
| creative | 想像力豐富，探索性 | 頭腦風暴 |
| mentor | 深思教學導向，耐心 | 指導場景 |
| worker | 背景代理，任務聚焦 | 批處理工作 |

每種預設有 12 個維度的 0-100 數值配置。

### 4. TELOS 目標系統

TELOS（Telos = 目的/終點）是 PAI 的**目標對齊層**：
- **Mission**：高層使命（如「幫助一百萬人做出更好決策」）
- **Goals**：可衡量目標（含時間節點與數值指標）
- **Problems**：正在解決的核心問題
- **Strategies**：策略原則（如「先發布爛版本再迭代」）
- **Narratives**：身份叙事（「我構建將權力從機構轉移到個人的工具」）
- **Challenges**：個人挑戰（如「我開始的專案比完成的更多」）
- **Beliefs**：核心思維模型

`PRINCIPAL_TELOS.md` 是從各子檔案自動汇总的摘要文件，用 `bun PAI/TOOLS/GenerateTelosSummary.ts` 重新生成。

### 5. 隱私保護機制

USER 目錄是 PAI 中**最隱密的私人區**。發布（ShadowRelease）會刪除整個 USER 目錄並替換為通用 scaffold，確保用戶真實身份不上線。

### 6. DA Interview 系統

透過 `/interview` 對話式引導用戶逐步填充所有 scaffold 檔案。過程是可中断、可恢复的遞增操作。DAInterview.ts 工具支援快速設定中使用 `_presets.yaml` 的人格預設。

---

## 與 Life-OS 的借鑒點

### 身份層的分離設計
PAI 的 USER 目錄清晰區分了「用戶身份」（PRINCIPAL_IDENTITY）與「AI身份」（DA_IDENTITY），這種**雙身份模型**可應用於 Life-OS 的「操作者」與「AI助手」關係。

### TELOS 的 Goal-Centric 設計
目標系統從MISSION → GOALS → STRATEGIES → CHALLENGES 的層層落實，以及自動汇总工具的設計，是 Life-OS 現有目標追蹤系統可以深化的方向。

### 寫作風格指紋
WRITINGSTYLE.md + AI_WRITING_PATTERNS.md 的組合（正面引導 + 負面排除）比 Life-OS 現有的寫作風格定義更結構化，可借鑽。

### 人格預設的量化框架
`_presets.yaml` 的 12 維度量化系統提供了一個**可比較的人格空間**，可用於在 Life-OS 中建立不同場景下的 AI 助手角色切換。

---

## 關聯檔案

- **T11 — Memory System**：USER 目錄是 Memory System 的上游輸入源
- **T12 — ALGORITHM**：ALGORITHM 使用 PRINCIPAL_TELOS 來優先排序任務
- **T14 — PULSE**：PULSE Daemon 監控 USER 目標的達成進度
- **T15 — DA_IDENTITY**：DA_IDENTITY.md 是 USER/DA_IDENTITY.md 的鏡像（同一檔案）

---

## 檔案清單（分析樣本）

1. `PAI/USER/README.md`
2. `PAI/USER/PRINCIPAL_IDENTITY.md`
3. `PAI/USER/DA_IDENTITY.md`
4. `PAI/USER/ABOUTME.md`
5. `PAI/USER/BASICINFO.md`
6. `PAI/USER/ARCHITECTURE.md`
7. `PAI/USER/DA/_example/identity.yaml`
8. `PAI/USER/DA/_presets.yaml`
9. `PAI/USER/RESUME.md`
10. `PAI/USER/TELOS/PRINCIPAL_TELOS.md`
11. `PAI/USER/WRITINGSTYLE.md`
12. `PAI/USER/CORECONTENT.md`
13. `PAI/USER/RHETORICALSTYLE.md`
14. `PAI/USER/OPINIONS.md`
15. `PAI/USER/OUR_STORY.md`
16. `PAI/USER/DEFINITIONS.md`
17. `PAI/USER/FEED.md`
18. `PAI/USER/PRONUNCIATIONS.md`
