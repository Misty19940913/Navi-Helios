# T07 — Packs 安裝驗證文件

> 組ID：T07
> 來源：Packs/*/INSTALL.md, Packs/*/VERIFY.md, Packs/*/README.md
> 檔案總數：214（含 INSTALL/VERIFY/README）
> 採樣分析：13 個 Pack（Agents, Art, Science, CreateSkill, ISA, Interview, Fabric, Delegation, Research 等）
> 優先級：8

---

## 檔案結構分析

PAI 的 Pack 安裝驗證系統是全系統中最標準化的子系統之一。幾乎每個 Pack 都遵循完全一致的三檔頭結構：

### 三檔頭模式（所有 Pack 通用）

每個 Pack 的根目錄都有三個標準檔案，構成完整的安裝生命週期：

| 檔案 | 角色 | 對象 |
|:---|:---|:---|
| `INSTALL.md` | 安裝嚮導 | AI Agent 執行 |
| `VERIFY.md` | 驗證清單 | AI Agent 確認 |
| `README.md` | 自我說明 | 人類使用者 |

這是一個專為 AI Agent 自動化設計的系統——INSTALL.md 的主要讀者是 Claude Code，不是人類使用者。

### 統一的五階段安裝流程

所有 Pack 的 INSTALL.md 都遵循完全相同的五階段結構：

```
Phase 1: System Analysis     → 檢查現有狀態（技能是否存在？）
Phase 2: Confirm with User  → 詢問使用者確認（衝突處理、依賴選項）
Phase 3: Backup (if needed)  → 備份現有技能（timestamp 命名）
Phase 4: Install            → 複製 src/ → ~/.claude/skills/{Name}/
Phase 5: Verify             → 執行 VERIFY.md 中的檢查清單
```

差異只在 Phase 2 的問題數量（簡單 Pack 1-2 個問題，複雜 Pack 如 Agents 有 3 個問題）。

### Frontmatter 統一格式

所有 Pack 的 SKILL.md 都使用一致的 YAML frontmatter：

```yaml
name: {PackName}
pack-id: pai-{packname}-v1.0.0
version: 1.0.0
author: danielmiessler
description: {一句話描述，100-300字}
type: skill
platform: claude-code
source: PAI v5.0.0
```

### VERIFY.md 標準結構

驗證流程也是完全模板化的：

```bash
# 1. 目錄存在性檢查
[ -d "$SKILL_DIR" ]            && echo "OK" || echo "MISSING"

# 2. SKILL.md 存在性檢查
[ -f "$SKILL_DIR/SKILL.md" ]   && echo "OK" || echo "MISSING"

# 3. 子目錄結構檢查（資訊性）
[ -d "$SKILL_DIR/Workflows" ]  && echo "OK" || echo "INFO no Workflows/"

# 4. Frontmatter 語法檢查
head -1 "$SKILL.md" | grep -q "^---" && echo "OK frontmatter" || echo "ERROR"

# 5. 必要欄位檢查
grep -q "^name:" "$SKILL.md" && echo "OK has name" || echo "ERROR missing name"
grep -q "^description:" "$SKILL.md" && echo "OK has description" || echo "ERROR missing description"
```

---

## 內容差異分析

不同複雜度的 Pack 在 INSTALL.md 中有顯著差異：

### 簡單型（Art, Science, CreateSkill, ISA, Interview）

這些 Pack 的 INSTALL.md 極為精簡，核心流程都是：
- 系統分析（檢查是否存在）
- 備份（如有舊版）
- `cp -R src/ ~/.claude/skills/{Name}/`
- 驗證

沒有互動式問題，沒有依賴檢查，沒有進階選項。

### 複雜型（Agents）

Agents 是唯一採用「巫師式」（Wizard-style）安裝的 Pack，Phase 1 的系統分析包含 6 項檢查，Phase 2 有 3 個 `AskUserQuestion` 問題：

| 問題 | 觸發條件 | 選項 |
|:---|:---|:---|
| 衝突解決 | 現有 Agents 技能存在 | Backup & Replace / Replace Without Backup / Abort |
| 工具依賴 | — | Yes, install (推薦) / Skip for now |
| 最終確認 | — | Yes, install / Show me what will change / Cancel |

Agents 還有 TodoWrite 追蹤進度（4 個步驟），其他 Pack 都沒有。

### Research Pack（居中型）

Research 採用類似 Agents 的巫師流程，但問題較少（2個），有 Phase 1.1 詳細系統分析，有 TodoWrite，但沒有「Show me what will change」這類進階選項。

### Pack 之間的核心差異對比

| 維度 | 簡單型（Art等） | 居中型（Research） | 複雜型（Agents） |
|:---|:---|:---|:---|
| Phase 1 分析 | 基本 [ -d ] 檢查 | 詳細命令輸出 | 6項檢查 + 環境分析 |
| 問題數量 | 0 | 2 | 3 |
| TodoWrite | 無 | 有 | 有 |
| 衝突處理 | 自動 backup | 自動 backup | 問使用者 |
| 依賴檢查 | 無 | Bun 檢查 | Bun 檢查 + node_modules |
| 進階選項 | 無 | 無 | "Show me what will change" |
| 成功訊息 | 文字 | 文字 | 格式化功能列表 |
| 故障排除 | 無 | 無 | 有（常見問題章節） |

---

## 核心機制

### AI 輔助安裝的設計哲學

INSTALL.md 的寫作對象是 AI Agent，不是人類使用者。這解釋了為什麼：
- 所有命令都是 bash 片段，可以直接貼進 terminal
- 所有決策點都有 `AskUserQuestion` JSON 格式
- 進度追蹤用 `TodoWrite` 格式
- 備份策略是「先斬後奏」——偵測到衝突就詢問

### 版本管理策略

安裝時的版本綁定透過 `pack-id` 和 `version` frontmatter 欄位實現。升級時舊版被備份到 `~/.claude/skills/{Name}.backup-{timestamp}/`，而不是覆寫，保留 rollback 能力。

### 使用者自訂層（SKILLCUSTOMIZATIONS）

這是一個關鍵的擴展設計：每個 Pack 的使用者自訂內容存在：
```
~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/{PackName}/
```

這個目錄**永遠不會被安裝流程觸碰**，是對抗安裝覆寫的防線。Pack 更新時使用者自訂內容不受影響。

### 依賴分層

Pack 的依賴分為三層：
1. **無依賴**：純 MD 文件型 Pack（如 Art, Science）
2. **Bun 依賴**：有 TypeScript 工具的 Pack（如 Agents，需要 `bun install`）
3. **外部服務依賴**：需要特定伺服器运行的 Pack（如 Agents 的 ElevenLabs 語音服務）

依賴檢查是「資訊性」的——即使依賴未滿足，技能檔案仍被視為「已安裝」，只是部分功能不可用。

---

## 關聯檔案

| 相關報告 | 關係 |
|:---|:---|
| [[T02_Packs_SKILL\|T02 — Packs SKILL.md]] | Pack 的技能定義，安裝後的路由目標 |
| [[T06_Hooks_TS\|T06 — Hooks TypeScript]] | 技能觸發鉤子，Pack 啟用的底層機制 |
| [[T03_ClaudeSkills_SKILL\|T03 — .claude/skills SKILL.md]] | 安裝目的地（~/.claude/skills/）的技能定義 |
| [[T16_Agents_Pack\|T16 — Agents Pack]] | 複雜安裝的典型範例 |
| [[T60_Installation_Analysis\|T60 — 安裝流程分析]] | 安裝系統的整體串聯分析 |

---

## 與 Life-OS 的借鑒點

### 1. 檔案角色分離（安裝/驗證/說明三分離）

PAI 的 INSTALL/VERIFY/README 三分法與 Life-OS 的 Document Role 概念高度共鳴。INSTALL.md 是「執行腳本」，VERIFY.md 是「驗收標準」，README.md 是「靜態說明」——每個檔案只有一個角色，絕不混雜。

**Life-OS 現狀：** 目前沒有專門的安裝驗證文件。Life-OS 的技能安裝是 ad-hoc 的，沒有標準化的驗收流程。

**借鑒：** 考慮為 Life-OS 的每個技能建立對應的 `INSTALL.md` 和 `VERIFY.md`，讓 AI Agent 能夠自動化安裝與驗收。

### 2. 使用者自訂層的隔離設計

SKILLCUSTOMIZATIONS 機制是一個優雅的「基底覆寫」模式：系統更新時使用者改動不受影響，且自訂層的路徑是約定俗成的（`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/`）。

**借鑒：** Life-OS 可以建立類似的「使用者覆寫層」機制，讓安裝腳本永遠跳過特定目錄，確保使用者自訂內容的持久性。

### 3. 安裝流程的階段化設計

五階段（分析→確認→備份→安裝→驗證）是一個可移植的安裝流程模板。每一階段的輸出是下一階段的輸入，階段之間有明確的狀態轉移。

**借鑒：** 這個模板可以直接用於 Life-OS 的任何技能安裝流程。

### 4. 衝突處理的策略選擇

簡單型 Pack 採用「自動備份」，複雜型 Pack（Agents）讓使用者選擇。這提供了一個漸進式複雜度設計的參考。

**借鑒：** Life-OS 的安裝流程可以根據 Pack 複雜度採用不同的衝突策略，而非一刀切。

---

## 檔案清單

以下為採樣分析的檔案（13 個 Pack）：

```
~/.hermes/Personal_AI_Infrastructure/Packs/Agents/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Agents/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Agents/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Art/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Art/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Art/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Science/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Science/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Science/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/ISA/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/ISA/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/ISA/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interview/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Fabric/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Fabric/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Delegation/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Delegation/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Research/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Thinking/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Thinking/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Thinking/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Loop/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Loop/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Loop/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/AudioEditor/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/AudioEditor/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/AudioEditor/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/USMetrics/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/USMetrics/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/USMetrics/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/WorldThreatModel/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/WorldThreatModel/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/WorldThreatModel/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Delegation/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Delegation/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Delegation/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Ideate/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Ideate/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Ideate/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Scraping/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Scraping/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Scraping/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Evals/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Evals/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Evals/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Migrate/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Migrate/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Migrate/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Security/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Security/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Security/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/SystemsThinking/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/SystemsThinking/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/SystemsThinking/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/RootCauseAnalysis/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/RootCauseAnalysis/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/RootCauseAnalysis/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateCLI/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateCLI/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateCLI/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/BrightData/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/BrightData/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/BrightData/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Remotion/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Remotion/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Remotion/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Optimize/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Optimize/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Optimize/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/ExtractWisdom/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/ExtractWisdom/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/ExtractWisdom/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Media/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Media/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Media/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Investigation/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Investigation/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Investigation/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Prompting/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Prompting/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Prompting/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/README.md
```

---

## 研究備註

- T07 完成了對 PAI 安裝驗證系統的全面分析
- 總計 214 個安裝相關檔案，涵蓋 42+ 個 Pack
- 所有 Pack 遵循統一的三檔頭結構和五階段安裝流程
- Agents Pack 是唯一採用完整巫師式對話安裝的複雜案例
