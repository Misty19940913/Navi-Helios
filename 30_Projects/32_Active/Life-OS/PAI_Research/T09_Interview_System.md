# T09 — Interview System

> 組ID：T09
> 來源：Packs/Interview/**/*, Releases/v5.0.0/.claude/skills/Interview/**/*
> 檔案總數：5
> 採樣分析：5 個（完整分析）
> 優先級：8（核心系統）

---

## 檔案結構分析

Interview Pack 的結構極為精簡，是 PAI 生態系中最小的 Pack 之一：

```
Packs/Interview/
├── INSTALL.md       # AI Agent 安裝引導精靈
├── README.md        # 入口說明
├── VERIFY.md        # 安裝驗證清單
└── src/
    └── SKILL.md     # 主要技能定義（含完整 Workflow）

Releases/v5.0.0/.claude/skills/Interview/
└── SKILL.md         # 與 src/SKILL.md 內容完全相同
```

**共同結構模式：**
- 每個檔案都是獨立入口：INSTALL.md 面向 AI Agent 安裝、README.md 面向人類使用者、src/SKILL.md 定義實際技能
- Pack 版本與 Release 版本共存——Pack 版本用於實際安裝、Release 版本是發布時的快照
- **無 Workflows/ 子目錄**：Interview 技能的全部邏輯都在 SKILL.md 的 Workflow 章節中定義

---

## 內容差異分析

### Pack 版 vs Release 版 SKILL.md

| 維度 | Packs/Interview/src/SKILL.md | Releases/v5.0.0/.claude/skills/Interview/SKILL.md |
|:---|:---|:---|
| **檔案大小** | 8,607 bytes | 8,607 bytes |
| **內容** | 完全相同 | 完全相同 |
| **Frontmatter** | `name: Interview`, `pack-id: pai-interview-v1.0.0`, `author: danielmiessler` | 完全相同 |

**結論：** 兩版本內容完全一致，Release 版是發布快照，無功能差異。

### 與其他 Pack 的結構差異

| Pack 對比 | Interview | ISA Pack | Agents Pack |
|:---|:---|:---|:---|
| **目錄深度** | 2 層（Pack → src → SKILL.md） | 更深（有多層子系統） | 更深（有 src/Workflows/ 等） |
| **檔案總數** | 5 | ~50 | ~50 |
| **SKILL.md Workflows 數** | 整合在單一檔案中 | 多個子技能 | 多個子技能 |
| **INSTALL.md 對象** | AI Agent（Claude Code） | AI Agent | AI Agent |
| **VERIFY.md 存在** | ✅ 獨立驗證檔 | 可能內嵌 | 可能內嵌 |

**Interview 是最扁平的 Pack**：沒有子目錄結構，沒有獨立的 Workflow 檔案，所有技能邏輯內嵌於單一 SKILL.md。

---

## 核心機制

### 技能觸發條件

```
USE WHEN:
/interview
resume interview
continue interview
start the interview
review TELOS
fill in context
what's missing in setup
conversational review
phased review
TELOS walkthrough
quarterly context refresh

NOT FOR:
- 單一檔案編輯（用 /Telos Update workflow）
- 外部內容攝入（用 /migrate）
- 身份編輯（用 /_PROFILE）
```

### 四階段訪談架構

**Phase 1 — Foundational TELOS（階段 1，優先級最高）**
```
MISSION → GOALS → PROBLEMS → STRATEGIES → CHALLENGES → 
NARRATIVES → SPARKS → BELIEFS → WISDOM → MODELS → FRAMES
```
- **模式**：Review（檔案通常已有內容）
- **關鍵規則**：即使分數 100%，仍要逐項走過——「foundational context is never actually done」

**Phase 2 — IDEAL_STATE（階段 2）**
```
HEALTH → MONEY → FREEDOM → RELATIONSHIPS → CREATIVE
```
- **模式**：Fill（通常內容稀疏）
- **排除**：RHYTHMS（歸 Phase 9）

**Phase 3 — Preferences（階段 3）**
```
BOOKS → AUTHORS → BANDS → MOVIES → RESTAURANTS → 
FOOD_PREFERENCES → LEARNING → MEETUPS → CIVIC
```
- **模式**：Mixed（取決於完整度）

**Phase 4 — Current State（階段 4）**
```
CURRENT_STATE/SNAPSHOT → PRINCIPAL_IDENTITY
```
- **模式**：Light touch（輕觸）

**Phase 9 — RHYTHMS（延後）**
- 正常流程中跳過

### 雙模式運作邏輯

| 模式 | 觸發條件 | 運作方式 |
|:---|:---|:---|
| **Fill Mode** | 完整度 < 80% | 逐題walk through prompts，寫入結構化槽位 |
| **Review Mode** | 完整度 ≥ 80% | 先讀檔案內容濃縮摘要給 Principal，再逐題問「still accurate? / outdated? / missing? / sharpen?」 |

完整度由 `InterviewScan.ts` 工具計算。

### InterviewScan.ts 掃描器

```bash
bun ~/.claude/PAI/TOOLS/InterviewScan.ts          # 全域掃描
bun ~/.claude/PAI/TOOLS/InterviewScan.ts --file <NAME>  # 單一檔案掃描
```

掃描器職責：
1. 計算每個目標檔案的完整度百分比
2. 根據完整度決定 Review 或 Fill 模式
3. 按 Phase 順序排列（Phase 1 永遠優先於 Phase 2）
4. 輸出摘要供 Principal 決策下一步

### TelosRenderer.ts 再生器

```bash
bun ~/.claude/PAI/TOOLS/TelosRenderer.ts 2>/dev/null || true
```

在 Phase 1 foundational 變更後執行，重新生成 `PRINCIPAL_TELOS.md`，確保未來 session 立即接收到更新。

### 對話循環規則（Critical）

1. **一次一題**：永遠不一次問多個問題
2. **Principal 說自然語言，DA 格式化**：Principal 不接觸 schema，直接口語/打字回答
3. **Voice 確認只在實際變更時**：節省通知頻寬
4. **立即尊重停止信號**：「enough」/「stop」/「later」→ 立即存檔並結束
5. **Target/North-Star 分類**：每個 target 條目建立後問一次「這是具體可達成目標還是北星導向？」

### 備份策略

```
當rewrite ≥50% 的檔案時：
→ 先備份到 TELOS/Backups/FILENAME-YYYYMMDD-HHMMSS.md
→ 再執行多軌編輯
```

### 語音通知

每個主要階段過渡都透過 curl 發送語音通知：
```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Starting the interview. Scanning phases first."}'
```

---

## 與 Life-OS 的借鑒點

### 1. 四階段覆盤架構（直接適用）

| PAI Phase | 對應 Life-OS 概念 |
|:---|:---|
| Phase 1: TELOS Foundations | **立場與方向** — MISSION, GOALS, PROBLEMS, STRATEGIES |
| Phase 2: IDEAL_STATE | **願景映射** — HEALTH, MONEY, FREEDOM, RELATIONSHIPS, CREATIVE |
| Phase 3: Preferences | **偏好庫** — BOOKS, AUTHORS, TOOLS, METHODS |
| Phase 4: Current State | **現況快照** — 定期同步 |

**Life-OS 可採納**：將 quarterly review 流程正規化為四階段結構，每階段有明確的完成標準與模式區分。

### 2. Review vs Fill 雙模式（可適配）

```
完整度 ≥ 80% → Review 模式（現有內容審視）
完整度 < 80%  → Fill 模式（引導式填空）
```

**Life-OS 可採納**：用於判斷何時該「快速審視」vs「完整重建」。例如：某領域 vault 進度 > 80% 時用 review flow；< 50% 時用 fill flow。

### 3. 停止信號優先（重要）

> "Respect stop signals. 'Enough' / 'stop' / 'later' → save progress, end gracefully."

**Life-OS 可採納**：研究 session 應隨時可中斷，已完成的內容自動保存（vault 本身已是持久化）。

### 4. Backup before rewrite（防止資料損失）

> "If about to rewrite ≥50% of a file, save timestamped backup to TELOS/Backups/ first."

**Life-OS 可採納**：在執行大規模重構前，先備份舊版到 dated backup 檔。

### 5. 單一工具鏈依賴（InterviewScan.ts, TelosRenderer.ts）

這兩個 Tool 位於 `~/.claude/PAI/TOOLS/`，Interview 技能只是這兩個工具的調用層。這種「小型技能 + 共享工具」的模式適合 Life-OS 借鑒。

---

## 關聯檔案

- **T08 — ISA System**：Interview 是基於 ISA format 的應用技能，依賴 TELOS 檔案結構（ISA 的一種）
- **T11 — Memory System**：Interview 維護的 Principal context 是 Memory system 的輸入
- **T13 — USER Identity**：PRINCIPAL_IDENTITY.md 是 Phase 4 的審核對象
- **T12 — Algorithm**：Algorithm mode 中可能調用 Interview 來刷新 context

---

## 檔案清單

| 檔案路徑 | 用途 |
|:---|:---|
| `Packs/Interview/INSTALL.md` | AI Agent 安裝引導 |
| `Packs/Interview/README.md` | 入口說明 |
| `Packs/Interview/VERIFY.md` | 安裝驗證清單 |
| `Packs/Interview/src/SKILL.md` | 主要技能定義 |
| `Releases/v5.0.0/.claude/skills/Interview/SKILL.md` | Release 快照（與 src 版本相同） |

---

## 研究備註

**異常發現：** T09 Interview System 的實際檔案數（5個）遠低於索引估計（~50個）。這是因為：
1. Interview 是功能內聚的技能，不像其他 Pack 有大量 Pattern 或 Workflow 附屬檔案
2. 主要邏輯全部內嵌於單一 SKILL.md
3. 依賴的 Tool 檔案（InterviewScan.ts, TelosRenderer.ts）位於 PAI/TOOLS/ 而非 Pack 內部

**下次研究時可驗證：** 確認 `~/.claude/PAI/TOOLS/InterviewScan.ts` 和 `~/.claude/PAI/TOOLS/TelosRenderer.ts` 的實際內容（T29 v5.0.0 DOCUMENTATION 涵蓋）。
