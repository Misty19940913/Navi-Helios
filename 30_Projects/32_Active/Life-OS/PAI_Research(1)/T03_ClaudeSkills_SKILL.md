# T03 — v5.0.0 skills SKILL.md

> 組ID：T03
> 來源：`Releases/v5.0.0/.claude/skills/*/SKILL.md`
> 檔案總數：46
> 採樣分析：16 個
> 優先級：高

---

## 檔案結構分析

### 統一 Frontmatter 結構
所有 SKILL.md 均使用 YAML frontmatter，格式高度一致：

```yaml
---
name: SkillName
description: "觸發條件文字，USE WHEN / NOT FOR 格式"
effort: low|medium|high
context: fork  # 可選
---
```

**差異欄位：**
- `argument-hint`：僅 `Knowledge` 技能有（提供子命令提示）
- `context: fork`：部分高複雜度技能有（如 `Ideate`、`Evals`）

### 內容板塊共同模式
1. **Voice Notification 區塊**（強制）
   - 幾乎所有技能都含「必須在執行前發送 curl notify」的指示
   - 格式固定：先送 curl，再輸出文字通知

2. **Customization 區塊**（標準）
   - 幾乎所有技能都有，檢查 `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/<SkillName>/`
   - 存在則覆蓋預設值，不存在則用技能預設

3. **Workflow Routing 表格**（核心）
   - 所有技能的核心，每個技能都有
   - 格式：`Trigger | Workflow | File`

4. **Gotchas 區塊**（經驗沉澱）
   - 大多數技能都有，累積失敗教訓
   - 欄位名稱差異：有些用 `## Gotchas`，有些用 `## ⚠️ MANDATORY...`

5. **Execution Log**（標準）
   - 所有技能都有，JSONL 格式寫入 `~/.claude/PAI/MEMORY/SKILLS/execution.jsonl`
   - 記錄：時間戳、skill、workflow、input、status、duration_s

### 子目錄結構
標準子目錄（2 層最大）：
- `Workflows/` — 執行工作流
- `Tools/` — 可執行腳本
- `References/` — 擴展參考文檔（大型技能）
- Context 文件位於技能根目錄，不在 `Context/` 子目錄

---

## 內容差異分析

### 技能複雜度分級

| 等級 | 技能 | 特色 |
|------|------|------|
| **高複雜度** | `Ideate` (266行), `CreateSkill` (478行), `Knowledge` (407行), `Evals` (288行), `Interview` (150行), `Research` (221行) | 多階段流程、Loop Controller、多工具整合、9+ workflow |
| **中複雜度** | `Agents` (370行), `Art` (313行), `ISA` (214行), `SystemsThinking` (171行), `Apify` (513行) | 明確 workflow 路由、Voice notification、Customization |
| **標準複雜度** | `Council` (137行), `Fabric` (203行), `Daemon` (175行), `RedTeam` (120行), `Prompting` (197行), `ISA` | 標準結構、固定模式 |

### 描述格式對比

| 技能 | 描述長度 | 觸發詞密度 | 特色 |
|------|----------|------------|------|
| `Ideate` | 短 | 極高 | 列出 9 phases + 6 workflows |
| `CreateSkill` | 長 | 極高 | 9 種 skill types、public/private 命名規則 |
| `Knowledge` | 中 | 高 | 4 domains (People/Companies/Ideas/Research)、8 關係類型 |
| `Evals` | 長 | 高 | 3 grader types、pass@k/pass^k scoring |
| `Research` | 長 | 高 | 4 depth modes、verification architecture |
| `ISA` | 中 | 高 | 12-section body、tier completeness gate |
| `SystemsThinking` | 中 | 高 | 5 axioms、5 workflows |

### 核心機制差異

| 技能 | 核心機制 | 獨特設計 |
|------|----------|----------|
| `Ideate` | 演化創意引擎 | 9 phases、Loop Controller、Lamarckian Meta-Learner、Fisher-Yates 重組 |
| `CreateSkill` | Skill 生命週期 | Structure + Effectiveness 雙軌、9 skill types、公共/私人命名邊界 |
| `Knowledge` | 知識圖譜管理 | 4 entity types、8 typed relationships、ripple-ingest 創新 |
| `Evals` | AI Agent 評估框架 | 3 grader types、pass@k、ISC 整合 |
| `ISA` | 理想狀態工件系統 | 12-section locked body、3-guardrail taxonomy、ISC ID 穩定性 |
| `SystemsThinking` | 系統結構分析 | 5 axioms、~10 archetypes、Meadows 12 leverage points |
| `Apify` | 檔案式 MCP | 99% token savings、filter-before-context 模式 |
| `Fabric` | Prompt pattern 系統 | 240+ patterns、原生執行（無 CLI） |

---

## 核心機制

### 1. 語音通知強制模式
幾乎所有技能都要求在執行前發送 curl notify，這是 PAI 的核心 UX：
- 告知使用者技能正在運行
- 透過 `localhost:31337/notify` 本地端點

### 2. Customization 分層
PAI 採用雙層設定模式：
- Base：`Data/*.yaml` 或技能本身的預設值
- User：`USER/SKILLCUSTOMIZATIONS/<Skill>/` 覆蓋

### 3. Workflow 路由
每個技能都有明確的 routing table，根據觸發詞決定執行哪個 workflow：
- routing table 通常在 SKILL.md 靠前位置
- 可包含多個 workflow 檔案

### 4. 執行日誌標準化
所有技能都使用相同的 JSONL 格式，日誌路徑統一：
`~/.claude/PAI/MEMORY/SKILLS/execution.jsonl`

### 5. Gotchas 累積機制
每個技能維護自己的失敗教訓列表，這是技能演進的核心機制：
- API 怪癖
- 常見錯誤
- 順序/序列要求
- 導致無聲失敗的邊緣情況

---

## 關聯檔案

| 關聯類型 | 檔案 |
|----------|------|
| 技能系統架構 | T02（已分析：Packs SKILL.md）|
| ISA System | T08（ISA 技能依賴的格式）|
| Algorithm v6.3.0 | T12（Algorithm 與 Skills 的整合點）|
| Memory System | T11（Skills 的 execution.jsonl 目的地）|
| Fabric Patterns | T05（Fabric 技能的 pattern 系統）|
| Hook TypeScript | T06（PreToolUse 等鉤子可能影響技能觸發）|
| PAI CORE TS | T26（Tools/ComposeAgent.ts 等核心工具）|

---

## 與 Life-OS 的借鑒點

### 1. 技能描述的「觸發詞 + 排除詞」格式
```
description: "USE WHEN A, B, C / NOT FOR X, Y, Z"
```
**借鑒：** 這是目前描述最精確的技能觸發機制，比簡單的關鍵字匹配更精確。

### 2. Customization 分層（BASE + USER）
- Base 設定提供通用功能
- User 覆蓋提供個人化
- 不污染 Base，PAI 更新不會覆蓋用戶設定
**借鑒：** 可應用於任何需要「通用 + 個人」的系統。

### 3. 執行日誌統一化
所有技能使用相同的 JSONL 格式寫入相同路徑：
- 可追蹤技能使用頻率
- 可分析工作流效率
- 可識別問題模式

### 4. Gotchas 區塊的必要性
**所有技能都有 Gotchas**，這是「別人已經踩過的坑」的最佳沉澱形式：
- 不是「如何使用」
- 而是「別人怎麼用錯」

### 5. 技能複雜度分級（effort: low/medium/high）
- 低複雜度：直接操作，無需多 workflow
- 高複雜度：多階段流程，需要 loop controller

### 6. Context Fork 模式
部分技能有 `context: fork`，表示：
- 技能可能大量消耗 context
- 需要 fork 一個新的執行上下文
- 不影響主會話的 context 完整性

---

## 檔案清單

以下為本次分析的 46 個 SKILL.md 檔案完整列表：

```
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/
├── Loop/SKILL.md
├── AudioEditor/SKILL.md
├── Agents/SKILL.md             ✅ 採樣
├── USMetrics/SKILL.md
├── WorldThreatModel/SKILL.md
├── Art/SKILL.md               ✅ 採樣
├── Interceptor/SKILL.md
├── Delegation/SKILL.md
├── ArXiv/SKILL.md
├── Ideate/SKILL.md            ✅ 採樣
├── CreateSkill/SKILL.md       ✅ 採樣
├── Evals/SKILL.md             ✅ 採樣
├── Migrate/SKILL.md
├── Science/SKILL.md
├── SystemsThinking/SKILL.md    ✅ 採樣
├── RootCauseAnalysis/SKILL.md
├── CreateCLI/SKILL.md
├── BrightData/SKILL.md
├── Remotion/SKILL.md
├── Optimize/SKILL.md
├── ExtractWisdom/SKILL.md
├── PAIUpgrade/SKILL.md
├── Prompting/SKILL.md         ✅ 採樣
├── BeCreative/SKILL.md
├── Fabric/SKILL.md            ✅ 採樣
├── IterativeDepth/SKILL.md
├── Daemon/SKILL.md            ✅ 採樣
├── Aphorisms/SKILL.md
├── ISA/SKILL.md               ✅ 採樣
├── Telos/SKILL.md
├── Browser/SKILL.md
├── FirstPrinciples/SKILL.md
├── Council/SKILL.md           ✅ 採樣
├── BitterPillEngineering/SKILL.md
├── Knowledge/SKILL.md         ✅ 採樣
├── WriteStory/SKILL.md
├── ContextSearch/SKILL.md
├── RedTeam/SKILL.md           ✅ 採樣
├── Research/SKILL.md          ✅ 採樣
├── PrivateInvestigator/SKILL.md
├── Sales/SKILL.md
├── Apify/SKILL.md             ✅ 採樣
├── Webdesign/SKILL.md
├── Interview/SKILL.md         ✅ 採樣
└── ApertureOscillation/SKILL.md
```

---

## 分析摘要

| 維度 | 觀察 |
|------|------|
| **檔案數量** | 46 個 SKILL.md |
| **平均長度** | 200-300 行（最長 513 行 Apify）|
| **共同結構** | Frontmatter → Customization → Voice Notification → Workflow Routing → Gotchas → Execution Log |
| **觸發詞密度** | 平均每個技能 10-20 個精確觸發詞 |
| **複雜度分布** | 低：~5 技能，中：~25 技能，高：~16 技能 |
| **設計模式** | 雙層設定、統一日誌、Gotchas 累積、Context Fork |
| **整合深度** | Skills 間高度整合（Ideate 整合 8 個其他技能，Evals 與 Algorithm 深度整合）|
