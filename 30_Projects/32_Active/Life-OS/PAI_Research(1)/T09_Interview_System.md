# T09 — Interview System

> 組ID：T09
> 來源：Packs/Interview/**/*, Releases/v5.0.0/.claude/skills/Interview/**/*
> 檔案總數：5
> 採樣分析：5 個（全部）
> 優先級：中

---

## 檔案結構分析

Interview Pack 的檔案結構極為精簡，是所有 Packs 中最扁平的之一：

```
Packs/Interview/
├── README.md          # 入口說明（41 行）
├── INSTALL.md         # AI 代理安裝引導（71 行）
├── VERIFY.md          # 安裝驗證清單（53 行）
└── src/
    └── SKILL.md       # 核心技能本體（150 行）

Releases/v5.0.0/.claude/skills/Interview/
└── SKILL.md           # 與 src/SKILL.md 完全相同
```

所有功能集中在 `SKILL.md` 中，無獨立的 Workflows/、Tools/、References/ 目錄。這是因為 Interview 的核心機制完全依賴兩個外部工具：`InterviewScan.ts`（掃描器）與 `TelosRenderer.ts`（渲染器），而非封裝在 Pack 內部。

---

## 內容差異分析

| 檔案 | 用途 | 核心內容 |
|------|------|---------|
| `Packs/Interview/README.md` | Pack 入口手冊 | 描述 Interview 的 phased interview 機制、安裝方式、What's Included |
| `Packs/Interview/INSTALL.md` | AI 代理安裝引導 | 5 階段 wizard（系統分析→用戶確認→備份→安裝→驗證） |
| `Packs/Interview/VERIFY.md` | 安裝後驗證清單 | 目錄存在性、frontmatter 欄位、frontmatter 邊界檢查 |
| `Packs/Interview/src/SKILL.md` | 技能本體（Pack 版） | 完整 workflow、4 階段相位定義、對話循環規則 |
| `Releases/v5.0.0/.../SKILL.md` | 技能本體（發布版） | 與 Pack 版完全相同，為 canonical 來源 |

**兩版 SKILL.md 內容完全一致**，差異僅在路徑上下文。描述字段中增加了 USE WHEN 觸發語：

> `/interview, resume interview, continue interview, start the interview, review TELOS, fill in context, what's missing in setup, conversational review, phased review, TELOS walkthrough, quarterly context refresh`

以及三個 NOT FOR 排除情境：
- 單一檔案編輯（→ 用 Telos Update workflow）
- 外部內容攝入（→ 用 Migrate）
- 身份編輯（→ 用 _PROFILE）

---

## 核心機制

### 4 階段相位系統

Interview 的核心設計是**分階段對話式訪談**，每個階段有不同的目標與對話模式：

| Phase | 覆蓋範圍 | 預設模式 | 說明 |
|-------|---------|---------|------|
| **Phase 1** | MISSION, GOALS, PROBLEMS, STRATEGIES, CHALLENGES, NARRATIVES, SPARKS, BELIEFS, WISDOM, MODELS, FRAMES | Review | 槓桿順序：MISSION 最先 |
| **Phase 2** | HEALTH, MONEY, FREEDOM, RELATIONSHIPS, CREATIVE（IDEAL_STATE） | Fill | 通常稀疏，主動填空 |
| **Phase 3** | BOOKS, AUTHORS, BANDS, MOVIES, RESTAURANTS, FOOD_PREFERENCES, LEARNING, MEETUPS, CIVIC | Mix | 按完整性動態決定 |
| **Phase 4** | CURRENT_STATE/SNAPSHOT, PRINCIPAL_IDENTITY | Light touch | 輕觸即止 |
| **Phase 9** | RHYTHMS | Deferred | 正常流程跳過 |

### 雙模式對話引擎

- **Review 模式（完整性 ≥ 80%）**：先朗讀檔案內容，再逐題提問「是否準確？是否過時？是否有遺漏？」
- **Fill 模式（完整性 < 80%）**：逐題走訪 scanner prompts，引導用戶口頭回答，DA 代為格式化寫入結構化欄位

### 外部工具依賴

| 工具 | 用途 |
|------|------|
| `InterviewScan.ts` | 掃描所有 PAI context 檔，計算各檔完整性百分比，決定進入 Review 或 Fill 模式 |
| `TelosRenderer.ts` | Phase 1  foundational 變更後，重新生成 `PRINCIPAL_TELOS.md` startup summary |

### 關鍵設計原則

1. **Phase 1 永遠優先**：即使所有檔案都是 100%，每季審查 pass 仍是必要的
2. **口語回答 → 結構化寫入**：用戶從不打字 schema，只說自然語言，DA 負責格式轉換
3. **語音確認僅在實際變更時**：避免噪音
4. **Target vs. North-Star 分類**：每個 entry 預設為 `target`，DA 會主動確認是否為 north-star 導向
5. **≥50% 改寫前必備份**：時間戳備份至 `TELOS/Backups/`
6. **停車訊號立即尊重**：`stop` / `enough` / `later` → 存檔優雅結束

---

## 關聯檔案

| 關聯檔案 | 關係 |
|---------|------|
| T11 — MEMORY System | Interview 是 MEMORY 系統的主要填充工具 |
| T13 — USER Identity | Phase 4 涉及 PRINCIPAL_IDENTITY |
| T14 — PULSE Daemon | PULSE 生命儀表板使用 Interview 進行季度上下文刷新 |
| T12 — ALGORITHM | InterviewScan.ts 屬於 TOOLS 層，依賴 ALGORITHM 的檔案結構 |
| T01 — Root Docs | 頂層 README 提及 Interview 為核心技能之一 |
| T08 — ISA System | TELOS 檔案遵循 ISA 格式規範 |

---

## 與 Life-OS 的借鑒點

### 值得借鑒的設計

**1. 分階段強制定序**
Life-OS 目前缺乏強制性的「先 foundational 再扩展」的審核順序。Interview 的 Phase 1 永不跳過設計非常值得借鑒——任何年度/季度回顧都應先從核心方向（MISSION/GOALS）出發，而非從偏好設置開始。

**2. 完整性驅動的雙模式**
`Completeness ≥ 80% → Review mode`，`< 80% → Fill mode` 這個閾值設計很實用。Life-OS 可以用類似機制：對豐富的領域（已穩定的模組）用「審視-更新」，對稀疏的領域（新興興趣）用「引導-填空」。

**3. 自然語言 → 結構化格式的翻譯層**
這個模式（用戶說白話，DA 轉換為 schema）是理想的 Human-AI 協作介面。Life-OS 的各類模板（projects、notes、areas）可以引入相同機制，讓用戶「說了就算」，而不用學習 Obsidian 的 YAML 格式。

**4. 備份-編輯-確認三步驟**
`≥50% 改寫 → 備份 → 編輯 → 語音確認` 這個流程對任何關鍵文檔編輯都是好慣例。

**5. Stop Signal 優先級**
「停下就停」看起來簡單，但其實大多數 AI 系統合併忽視了這一點，導致用戶在不想繼續時被繼續推著走。

### 可省略的部分

- Interview 的 4 階段命名（Phase 1/2/3/4/9）對 Life-OS 可能過度複雜
- InterviewScan.ts 這種全域掃描器在 Life-OS 中不需要（vault 規模差異）
- RHYTHMS deferral 暗示了能量/節奏追蹤系統，但這屬於 Phase 9，實用性存疑

---

## 檔案清單

```
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/src/SKILL.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/Interview/SKILL.md
```
