# T07 — Packs 安裝驗證

> 組ID：T07
> 來源：Packs/*/INSTALL.md, Packs/*/VERIFY.md, Packs/*/README.md
> 檔案總數：214（INSTALL + VERIFY + README × 45 packs + 子目錄）
> 採樣分析：13 個 Pack（Thinking, Agents, ArXiv, Loop, Art, Security, Science, Fabric, CreateSkill, Evals, Remotion, Migrate, Packs/README.md）
> 優先級：高 — 安裝驗證系統是 PAI 生態的核心基礎設施

---

## 檔案結構分析

PAI 的 Pack 安裝驗證系統有高度標準化的三層結構，幾乎所有 Pack 都遵循完全一致的模式。

### 標準三層檔案

| 檔案 | 位置 | 功能 |
|---|---|---|
| `INSTALL.md` | Pack 根目錄 | AI 安裝精靈的執行腳本（對 AI 說「Install the X pack」即可觸發） |
| `VERIFY.md` | Pack 根目錄 | 安裝後的人工確認清單 |
| `README.md` | Pack 根目錄 | Pack 索引：元資料 + 簡介 + 指向 src/SKILL.md |
| `src/SKILL.md` | src/ 目錄 | 實際技能定義（所有功能邏輯在此） |

### INSTALL.md 統一結構（5 階段精靈）

所有 INSTALL.md 都遵循完全相同的 5 階段模板：

```
Phase 1: System Analysis
  → 檢查 ~/.claude/skills/{PackName} 是否已存在
  → 檢查系統必備條件（各 Pack 略有不同）

Phase 2: User Confirmation
  → 透過 AskUserQuestion 询问：「是否安裝？」「是否備份現有版本？」
  → 常見衝突策略：backup / replace / abort

Phase 3: Backup（條件執行）
  → 若 Phase 1 發現已存在，建立 timestamped backup
  → 格式：~/.claude/skills/{PackName}.backup-{timestamp}/

Phase 4: Install
  → cp -R src/ → ~/.claude/skills/{PackName}/
  → 部分 Pack（如 Agents）有額外工具鏈處理（如 bun install）

Phase 5: Verify
  → 執行 VERIFY.md 中的檢查命令
  → 確認成功後告知用戶
```

### VERIFY.md 統一結構（4 區塊）

```
1. File Verification（檔案驗證）
   → Bash 命令確認 ~/.claude/skills/{PackName}/ 目錄存在
   → Bash 命令確認 SKILL.md 存在

2. Optional Substructure（可選子目錄）
   → Workflows/、Tools/、References/ 等（資訊性，非強制）

3. Frontmatter Check（前題檢查）
   → 驗證 SKILL.md 含有效 YAML frontmatter
   → 確認有 name: 和 description: 欄位

4. Functional Test（功能測試）
   → 告知重啟 Claude Code
   → 說明觸發關鍵字（USE WHEN）
```

### README.md 統一結構

每個 Pack 的 README.md 都是「封面索引頁」，包含：
- YAML frontmatter（name, pack-id, version, author, description, type, platform, source）
- 一段 description 摘要（與 frontmatter description 相同）
- Installation 段落（說明 AI-assisted install 的觸發語句）
- What's Included 段落（簡列目錄結構）
- Source 段落（指向 PAI v5.0.0 原始發布位置）
- License 段落（幾乎全部 MIT）

---

## 內容差異分析

不同 Pack 的安裝驗證系統在以下維度有差異：

### Pack 規模與複雜度差異

| Pack | 規模 | 特殊之處 |
|---|---|---|
| **Agents** | 大型（60+ 工具檔） | Phase 1 系統分析最詳細：檢查 Bun runtime、ElevenLabs voice server（localhost:8888）、自訂 traits 目錄 |
| **Security** | 超大型（5 子網域） | 獨有 5-subdomain 結構（Recon、WebAssessment、PromptInjection、SECUpdates、AnnualReports）；Phase 1 檢查 60+ 檔案；支援 nmap、ffuf 外部工具 |
| **Thinking** | 中型（7 thinking modes） | Phase 1 檢查 7 個子目錄是否存在；INSTALL.md 最長（340 行） |
| **Migrate** | 特殊（6 階段） | 獨有 Phase 6：Summary + /interview 推薦；含 UNCLEAR 目的地處理邏輯 |
| **ArXiv / Loop / Art** | 微型（最精簡） | 71 行 INSTALL.md、53-54 行 VERIFY.md；無特殊依賴 |

### 衝突處理策略差異

| Pack | 備份策略 | 衝突時行為 |
|---|---|---|
| Thinking | 始終備份 | 進入 backup 目錄 |
| Agents | 詢問用戶 | backup / replace / abort 三選一 |
| Security | 始終備份 | 替換並告知子網域路由 |
| 大多數 Pack | 詢問用戶 | backup / 直接覆蓋 |

### 依賴檢查差異

| Pack | 外部依賴 |
|---|---|
| Agents | Bun runtime, ElevenLabs server (localhost:8888) |
| Security | nmap, ffuf, bun, python3 |
| Remotion | Bun + Remotion CLI (bunx remotion render) |
| 大多數 Pack | 無外部依賴（standalone） |

### VERIFY.md 差異

| Pack | 額外驗證 |
|---|---|
| Thinking | 驗證 7 個子目錄 + 26 個 Workflow 檔 + 8 個 YAML frontmatter |
| Security | 驗證 6 個 SKILL.md（top + 5 subdomain）+ 11 個 Recon tools + 3 個 AnnualReports tools |
| Agents | 驗證 12 個 Context 檔 + Tools 目錄的 TypeScript 工具 |
| 標準 Pack | 僅驗證頂層 SKILL.md |

---

## 核心機制

### AI-Assisted Installation（AI 輔助安裝）

PAI 的核心理念：**用自然語言驅動安裝**。用戶只需對 AI 說：
```
"Install the Thinking pack from PAI/Packs/Thinking/"
```
AI 閱讀 INSTALL.md 並執行 5 階段精靈，整個過程無需用戶查看任何技術文件。

**關鍵設計原則：**
- 安裝腳本是給 AI 看的，不是給人類看的
- 所有決策點都通過 `AskUserQuestion` 询问用戶
- 備份是默認行為，防止數據丟失
- 驗證是安裝的最後一步，確保完整性

### 雙重目的地結構

每個 Pack 有兩個「入口」：
1. **Pack-level README.md** = 給人類的入口（描述性）
2. **src/SKILL.md** = 給 AI 的入口（機器可執行）

這種設計讓人類用戶可以閱讀了解每個 Pack 的用途，而 AI agent 直接執行 src/SKILL.md 中的技能定義。

### 觸發詞路由（USE WHEN）

每個 SKILL.md 的 frontmatter 包含 `use_when` 關鍵字陣列，AI agent 根據用戶輸入自動匹配最適合的 Pack。例如 Thinking Pack 的觸發詞包括「decompose from first principles」、「be creative」等。

---

## 關聯檔案

| 相關報告 | 關聯說明 |
|---|---|
| T01_Root_Docs.md | PLATFORM.md 中定義了 Pack 生態系統的整體架構 |
| T02_Packs_SKILL.md | 各 Pack 的 src/SKILL.md 詳細功能定義 |
| T04_Workflows.md | Pack 中的 Workflow 目錄結構 |
| T06_Hooks_TS.md | TypeScript 工具（部分 Pack 如 Agents、Security 的核心邏輯） |

---

## 與 Life-OS 的借鑒點

### 1. 雙層入口設計

PAI 的 Pack-level README（面向人類）+ src/SKILL.md（面向 AI）設計，可以用於 Life-OS 的「人類可讀索引 + 機器可執行定義」模式。例如：
- 一個 `01_Projects/專案索引.md` 給人類瀏覽
- 一個 `01_Projects/.project-definitions.json` 給 AI agent 執行

### 2. 標準化安裝驗證流程

5 階段安裝精靈（System Analysis → User Confirmation → Backup → Install → Verify）是高度可復用的模式。Life-OS 可以為每個「系統變更」建立類似的檢查清單：
- Phase 1 相當於「變更前健康檢查」
- Phase 3 相當於「變更前快照/備份」
- Phase 5 相當於「變更後驗證」

### 3. 信心閾值分類（Migrate Pack 模式）

Migrate Pack 的三層信心閾值（≥70% 自動批准、40-70% 確認、<40%  walk-through）是一個很實用的決策框架。Life-OS 可以用於：
- 自動分類收到的資訊（高信心 → 直接入庫，中等 → 人工確認，低 → 深入審查）
- 自動化的日/週/月回顧決策

### 4. Provenance（溯源）系統

Migrate Pack 在每個 commit 都附加 HTML 註釋形式的 provenance（來源追蹤）。Life-OS 可以為每個來自外部的摘錄建立「引入來源標記」，追蹤「這條資訊來自哪裡、何時引入」。

---

## 檔案清單

以下為本次分析的所有檔案路徑：

```
~/.hermes/Personal_AI_Infrastructure/Packs/Thinking/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Thinking/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Thinking/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Agents/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Agents/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Agents/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Loop/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Loop/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Loop/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Art/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Art/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Art/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Security/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Security/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Security/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Science/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Science/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Science/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Fabric/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Fabric/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Fabric/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Evals/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Evals/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Evals/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Remotion/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Remotion/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Remotion/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/Migrate/INSTALL.md
~/.hermes/Personal_AI_Infrastructure/Packs/Migrate/VERIFY.md
~/.hermes/Personal_AI_Infrastructure/Packs/Migrate/README.md
~/.hermes/Personal_AI_Infrastructure/Packs/README.md
```
