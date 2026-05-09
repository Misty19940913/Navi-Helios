# T10 — CLAUDE.md 路由

> 組ID：T10
> 來源：`Releases/v5.0.0/.claude/CLAUDE.md`
> 檔案總數：6（版本根目錄 CLAUDE.md × 4；skills 子目錄 CLAUDE.md × 2）
> 採樣分析：6 個
> 優先級：高

---

## 檔案結構分析

### 根目錄 CLAUDE.md（全系統行為定義）

v2.3 / v4.0.0 / v4.0.3 / v5.0.0 四個版本的根目錄 `CLAUDE.md` 結構對比：

| 版本 | 總行數 | 核心結構 |
|------|--------|---------|
| v2.3 | 83 | 安裝引導 + 人類使用說明，無 Mode 系統 |
| v4.0.0 | 65 | **Mode 系統**（NATIVE / ALGORITHM / MINIMAL）+ Context Routing |
| v4.0.3 | 65 | 與 v4.0.0 相同結構，Algorithm 版本從 v3.5.0 → v3.7.0 |
| v5.0.0 | 148 | **三倍膨脹**：Mode 系統 + Operational Rules + Context Routing 表格 + Project-Specific Rules |

### v5.0.0 新增結構（與 v4.x 差異）

```
## PAI System          ← 新增：PAI 內部系統路由表（21 項）
## {PRINCIPAL.NAME} — Identity & Voice  ← 新增：使用者身份路由（8 項）
## {PRINCIPAL.NAME} — Life Goals (Telos) ← 新增：目標路由（9 項）
## {DA_IDENTITY.NAME} ← 新增：DA 關係路由（1 項）
## {PRINCIPAL.NAME} — Work ← 新增：工作資料路由（5 項）
## Project-Specific Rules ← 新增：專案級 CLAUDE.md 繼承說明
```

### skills/CLAUDE.md（子目錄行為約束）

`skills/CLAUDE.md` 位於 `skills/` 子目錄，職責極度單一：強制所有技能操作必須透過 `CreateSkill` skill 執行，不得手動編輯 SKILL.md 或新增 Workflow/Tools/Reference 檔案。

---

## 內容差異分析

### 版本演進：兩次重大断裂

| 断裂點 | v2.3 → v4.0.0 | v4.x → v5.0.0 |
|--------|--------------|--------------|
| **Mode 系統** | 從無 → 有（NATIVE / ALGORITHM / MINIMAL） | Operational Rules 膨脹（9 條 → 11 條 + Forge auto-include） |
| **路由機制** | 從無 → `CONTEXT_ROUTING.md` 參照 | 從單一檔案 → 分類路由表（5 大類、44 個具體路徑） |
| **語音系統** | ElevenLabs 聲音選擇 | Voice notify URL `localhost:31337`（v5）+ 多 voice_id 變數 |
| **演算法綁定** | 無 | Algorithm version 從固定 → `LATEST` 指向動態讀取 |
| **長任務處理** | 無區分 | E1-E5 effort shortcuts + Forge auto-include 綁定 |
| **路徑規範** | 無 | `${PAI_DIR}`, `${HOME}`，嚴禁 hardcode `${HOME}/` |
| **web 驗證** | 無 | Interceptor 強制要求，禁用 agent-browser |
| **安裝流程** | 向導式引導 | 純自動，無人類干預流程 |

### 路由機制對比

**v4.0.0/v4.0.3** — 單一檔案參照：
```
When you need context about any of these topics,
read `~/.claude/PAI/CONTEXT_ROUTING.md` for the file path
```

**v5.0.0** — 內聯路由表（`~/.claude/CLAUDE.md` 直接內含所有路徑）：

```
PAI System: 21 個路由（DOCUMENTATION/ 底下各子系統）
{PRINCIPAL.NAME} Identity: 8 個路由（USER/ 底下身份與風格）
Telos: 9 個路由（TELOS/ 底下目標層次）
DA: 1 個路由（OUR_STORY.md）
Work: 5 個路由（FEED / BUSINESS / HEALTH / FINANCES）
```

### skills/CLAUDE.md 約束內容

| 觸發 CreateSkill | 不觸發（可直接編輯） |
|----------------|---------------------|
| 新建技能目錄 | 修正 typo |
| 新增/移除/重新命名 Workflow/Tools/Reference | 更新 gotchas 章節 |
| 編輯 SKILL.md frontmatter | 現有 References 檔案新增條目 |
| 驗證既有技能格式 | 累積 lesson 至現有 gotchas |
| 標準化 legacy 技能 | |
| 公開清潔審計 | |

---

## 核心機制

### Mode 強制分類系統

```
BEFORE ANY WORK → classify request → select ONE mode → use that format exclusively
```

| Mode | 觸發條件 | 格式複雜度 |
|------|---------|-----------|
| MINIMAL | 純肯定、評分、感謝問候 | 6 行模板 |
| NATIVE | 單步、2 分鐘以內簡單任務 | 7 行模板（含 ITERATION） |
| ALGORITHM | 多步、複雜、任何需要多檔案的任務 | 讀取 `PAI/ALGORITHM/v{VERSION}.md`，遵循該檔案格式 |

**強制輸出優先**：`No freeform output` + `Response format before questions` — 機器人必須先完成格式框架，再允許人類提問。

### Context 路由oload 機制

v5.0.0 `@`-import 啟動上下文（始終可用）：
```
@PAI/USER/PRINCIPAL_IDENTITY.md
@PAI/USER/DA_IDENTITY.md
@PAI/USER/PROJECTS/PROJECTS.md
@PAI/USER/TELOS/PRINCIPAL_TELOS.md
@PAI/DOCUMENTATION/ARCHITECTURE_SUMMARY.md
```

這些 `@`-imported 檔案繞過路由系統，直接嵌入啟動上下文。路由表用於「需要時加載」的額外上下文。

### Operational Rules 治理

11 條無例外規則，分為三類：

| 類別 | 規則數 | 關鍵約束 |
|------|--------|---------|
| 語言/工具強制 | 2 | bun/bunx 永遠、TypeScript 永遠 |
| 路徑規範 | 1 | `${PAI_DIR}` / `${HOME}`，禁 `${HOME}/` |
| 子處理序 | 1 | 禁 inline `claude` 處理序（CLAUDECODE env 衝突） |
| 輸出格式 | 3 | Markdown 純度、Plan means stop、Build over ask |
| 驗證優先 | 3 | 實際瀏覽器驗證（Interceptor）、重現問題後修復 |
| 上下文壓縮 | 1 | `rtk gain` 節省 tokens |
| 推論工具 | 1 | `bun TOOLS/Inference.ts`，禁直接 import SDK |
| 評價/問候 | 2 | Algorithm 例外規則 |
| Effort 捷徑 | 1 | `/e1`-`/e5` 覆蓋自動檢測 |
| Forge 自動包含 | 1 | E3/E4/E5 coding tasks 強制併入 Forge |

### Project-Specific Rules 繼承

當 Claude Code session 在包含專屬 `CLAUDE.md` 的目錄啟動時，該專案 `CLAUDE.md` 與全局 `.claude/CLAUDE.md` 合併，專案規則覆蓋全局 invariant。這是 Claude Code 原生行為，PAI 文件化了此約定。

---

## 關聯檔案

| 關聯報告 | 關聯邏輯 |
|---------|---------|
| **T11 — Memory System** | v5.0.0 路由表中 Memory System 佔 21 個 PAI System 路由席位之一 |
| **T12 — Algorithm v6.3.0** | ALGORITHM MODE 依賴 Algorithm version 檔案；v5.0.0 綁定 v6.x（待確認） |
| **T03 — v5.0.0 skills SKILL.md** | skills/ 子目錄的 `CLAUDE.md` 約束 CreateSkill 技能創建流程 |

---

## 與 Life-OS 的借鑒點

### 1. Mode 分類驅動的格式紀律

PAI 的 NATIVE / ALGORITHM / MINIMAL 三模強制分類 + 固定輸出格式，是一個高度結構化的回應約束系統。Life-OS 目前依賴研究文件架構區分職責（findings / task_plan / progress / system-design），但缺乏類似 Mode 的「入口分類」機制。

**借鑒**：在 Life-OS 的研究啟動階段，可引入簡單的「意圖分類」步驟（研究意圖 / 實作意圖 / 諮商意圖），觸發不同的處理模板。

### 2. Operational Rules 的零例外約束

PAI 的 11 條 Operational Rules 每一條都有 `Zero Exceptions` 標記，且每條都是具體、可驗證的行為約束（如 `bun/bunx always. Never npm/npx. Zero exceptions.`）。

**借鑒**：Life-OS 的 research-document-architecture 技能同樣有「確認門」等關鍵約束，但目前依賴技能文件而非強制代碼化。可參考 PAI 的 Operational Rules 格式，將關鍵約束寫得更直接、更不可繞過。

### 3. 路由表的層次化設計

v5.0.0 的路由表按「系統 / 身份 / 目標 / 關係 / 工作」五層組織，每層都有明確的檔案路徑對應。這與 Life-OS 的「4 文件 × 5 階段」矩陣有相似的結構化野心。

**借鑒**：Life-OS 的路由邏輯目前散落在各文件，沒有類似 PAI 路由表的首要查找點。可在 `AGENTS.md` 或獨立的 `context-routing.md` 中建立 Life-OS 的路由表。

### 4. Context 壓縮的公開化

PAI 將 `rtk gain`（PreToolUse hook 改寫 Bash 節省 60-90% tokens）列為 Operational Notes，提高了系統 token 消耗的可觀測性。

**借鑒**：當 Life-OS 實現上下文壓縮機制時，應將其寫入系統文件並公開節省比例，而非當作黑箱。

### 5. Effort Shortcuts 的意圖導向分級

`/e1`-`/e5` 讓使用者用 effort 等級影響系統行為深度，而非指定輸出格式。

**借鑒**：Life-OS 研究任務的複雜度差異極大，可參考 effort shortcuts 設計一個輕量級的「研究深度指示器」，讓 cron job 或研究者快速調整分析深度。

---

## 檔案清單

| 檔案路徑 | 版本 |
|---------|------|
| `~/.hermes/Personal_AI_Infrastructure/Releases/v2.3/.claude/CLAUDE.md` | v2.3 |
| `~/.hermes/Personal_AI_Infrastructure/Releases/v4.0.0/.claude/CLAUDE.md` | v4.0.0 |
| `~/.hermes/Personal_AI_Infrastructure/Releases/v4.0.3/.claude/CLAUDE.md` | v4.0.3 |
| `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/CLAUDE.md` | v5.0.0 |
| `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/CLAUDE.md` | v5.0.0 |
| `~/.hermes/Personal_AI_Infrastructure/Releases/v4.0.0/.claude/skills/Art/Tools/CLAUDE.md` | v4.0.0 |
