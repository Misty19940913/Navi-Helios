# T04 — Workflows MD

> 組ID：T04
> 來源：[Packs/*/src/Workflows/*.md]
> 檔案總數：303
> 採樣分析：21
> 優先級：中

---

## 檔案結構分析

### 整體架構

Workflow 檔案分布於 `~/.hermes/Personal_AI_Infrastructure/Packs/` 下的多個 Pack 子目錄中，每個 Pack 的 `src/Workflows/` 資料夾包含該技能的所有工作流程定義。

**主要 Pack 分類：**

| Pack 類別 | 典型 Workflow 數量 | 代表性檔案 |
|-----------|-------------------|-----------|
| Thinking | Science/, BeCreative/, FirstPrinciples/, Council/, RedTeam/, IterativeDepth/ | FullCycle.md, TreeOfThoughts.md, Deconstruct.md |
| Art | Art/ | TechnicalDiagrams.md, Comics.md, Maps.md |
| Security | WebAssessment/, Recon/, PromptInjection/ | UnderstandApplication.md, VulnerabilityAnalysisGemini3.md |
| Research | Research/ | DeepInvestigation.md, StandardResearch.md, ExtractAlpha.md |
| ISA | ISA/ | Interview.md, Scaffold.md, CheckCompleteness.md |
| Telos | Telos/ | WriteReport.md, CreateNarrativePoints.md, InterviewExtraction.md |
| CreateSkill | CreateSkill/ | CreateSkill.md, ValidateSkill.md, OptimizeDescription.md |
| Evals | Evals/ | RunEval.md, CreateJudge.md, CompareModels.md |
| Ideate | Ideate/ | Dream.md, FullCycle.md, Mate.md, Steal.md |
| Fabric | Fabric/ | ExecutePattern.md, UpdatePatterns.md |
| Daemon | Daemon/ | DeployDaemon.md, ReadDaemon.md, UpdateDaemon.md |
| PAIUpgrade | PAIUpgrade/ | ResearchUpgrade.md, AlgorithmUpgrade.md, MineReflections.md |
| Investigation | OSINT/, PrivateInvestigator/ | CompanyDueDiligence.md, PeopleLookup.md, FindPerson.md |
| RedTeam | RedTeam/ | AdversarialValidation.md, ParallelAnalysis.md |
| WriteStory | WriteStory/ | BuildBible.md, WriteChapter.md, Explore.md |
| ApertureOscillation | ApertureOscillation/ | Oscillate.md |

### 檔案內容結構模式

Workflow 檔案呈現三種主要結構模式：

**模式 A：完整文件型（~60%）**
- 包含 `## Voice Notification` 區塊
- 包含 `## When to Use` / `## Anti-Triggers`
- 包含明確的步驟結構（`### Step 1`, `### Step 2`...）
- 包含輸出模板（```markdown 區塊）
- 範例：FullCycle.md (396行), DeepInvestigation.md (361行), CreateSkill.md (306行), TechnicalDiagrams.md (261行)

**模式 B：執行指南型（~25%）**
- 結構較簡潔
- 重點在於觸發條件與執行步驟
- 可能缺少完整模板
- 範例：DeployDaemon.md (45行), TreeOfThoughts.md (70行), Dream.md (67行)

**模式 C：參考整合型（~15%）**
- 主要作為他workflow的輸入或模板
- 包含大量的表格與分類定義
- 範例：ExecutePattern.md (276行含30+patterns), CompanyDueDiligence.md (272行)

---

## 內容差異分析

### 1. 複雜度光譜

```
簡單 ←————————————————————————————————————————→ 複雜

Dream (67行)          FullCycle (396行)
TreeOfThoughts (70行) DeepInvestigation (361行)  
DeployDaemon (45行)   CompanyDueDiligence (272行)
Extract (60行)        WriteReport (619行)
                      BuildBible (247行)
                      Oscillate (206行)
```

### 2. 執行模式差異

| 執行模式 | 描述 | 範例 |
|---------|------|------|
| **單次執行** | 線性步驟，完成後輸出 | TreeOfThoughts, Deconstruct, FiveWhys |
| **迴圈模式** | 支援迭代，直到滿足退出條件 | DeepInvestigation (含 Progress Check), Ideate/FullCycle |
| **並列代理** | 使用 Task 工具生成多個子代理 | Dream (3 Dreamer agents), DeepInvestigation (9-12 agents), CompanyDueDiligence (32+ agents) |
| **三階段協議** | 多 round 交互 | AdversarialValidation (Round 1: Competing → Round 2: Critique → Round 3: Synthesis) |
| **孔徑振盪** | 多 scope 視角切換 | Oscillate (Narrow → Wide → Synthesis) |

### 3. 輸入來源差異

| 來源類型 | Workflow |
|---------|----------|
| 使用者直接輸入 | 大多數 workflow |
| 檔案/目錄 | DeepInvestigation (vault/), WriteReport (artifacts/*.json), BuildBible (Interview output) |
| URL/遠程資源 | Extract (YouTube, Article), DeepInvestigation (web research) |
| 其他 workflow 產出 | WriteReport (依賴 CreateNarrativePoints artifacts), DeepInvestigation (依賴 LANDSCAPE.md, ENTITIES.md) |
| 外部工具 | RunEval (EvalServer), DeployDaemon (GitHub, Cloudflare) |

### 4. 輸出目的地差異

- **內聯輸出**：直接回傳給用戶（多數創意類 workflow）
- **檔案系統**：
  - `~/.claude/MEMORY/RESEARCH/{vault}/` (DeepInvestigation)
  - `~/.claude/MEMORY/WORK/{date}_due-diligence-{company}/` (CompanyDueDiligence)
  - `{output_dir}/report/` (WriteReport)
- **系統整合**：
  - DeployDaemon → GitHub + Cloudflare KV
  - RunEval → EvalServer/storage/evals.db
  - PAIUpgrade → Skills system

---

## 核心機制

### 1. Voice Notification 模式

幾乎所有 workflow 都包含此模式，用於通知系統當前執行的 workflow：

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running the WorkflowName workflow in the SkillName skill to do something"}' \
  > /dev/null 2>&1 &
```

此通知同時會在 workflow 內容中以文字輸出：
```
Running **WorkflowName** in **SkillName**...
```

### 2. 觸發條件與路由

Workflow 通常透過以下方式被觸發：
- **明確觸發短語**（trigger phrases）：如 `"understand this application"`, `"deploy daemon"`, `"deep investigation"`
- **意圖識別**：如 ExecutePattern 根據用戶意圖選擇 pattern
- **技能協調**：如 BuildBible 依賴 Interview 的輸出

### 3. 步進執行框架

大多數複雜 workflow 採用一致的結構：
1. **準備階段**：驗證前置條件、讀取必要檔案
2. **主要執行**：依序執行步驟（Step 1, 2, 3...）
3. **品質檢查**：驗證輸出品質
4. **進度追蹤**（如適用）：記錄已完成的部分，支援中斷後繼續

### 4. 並列代理機制

使用 `Task` 工具生成多個子代理：
```typescript
Task({
  subagent_type: "PerplexityResearcher",
  prompt: "Research prompt here...",
  // timeout可選
})
```

典型模式：
- **DeepInvestigation**：9-12 agents 並列進行景觀研究
- **CompanyDueDiligence**：32+ agents 覆蓋 business/technical/reputation 各維度
- **Dream**：3 Dreamer agents 以不同隨機子集運行

### 5. Artifact 與 Pipeline 模式

某些 workflow 形成 producer-consumer 關係：

```
Interview → BuildBible (PRD)
TELOS分析 → CreateNarrativePoints → WriteReport
Research → DeepInvestigation → Summary
```

常見 artifact 格式：
- JSON 結構化資料（findings.json, recommendations.json）
- Markdown 報告（LANDSCAPE.md, ENTITIES.md）
- 中間狀態檔案（用於支援中斷繼續）

### 6. 退出條件與品質門控

**簡單條件**：
- 完成指定步驟後終止
- 用戶明確表示完成

**複雜條件**（如 DeepInvestigation）：
- Breadth Gate：每類別至少 N 個實體
- Depth Gate：所有 CRITICAL/HIGH 實體都已研究

---

## 關聯檔案

### 技能結構關聯

Workflow 是 Skill 系統的核心組成部分：

```
SkillName/
├── SKILL.md              # 技能主檔案，定義 workflow routing
├── Workflows/
│   ├── WorkflowOne.md    # 具體 workflow 實作
│   ├── WorkflowTwo.md
│   └── ...
└── Tools/                # 可選的 CLI 工具
    └── ToolName.ts
```

SKILL.md 中的 routing table 定義觸發條件：
```markdown
## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **WorkflowOne** | "trigger phrase" | `Workflows/WorkflowOne.md` |
```

### 跨 Skill 引用

某些 Workflow 明確引用其他 Skill 的 workflow：
- Deconstruct.md → 流向 Challenge / Reconstruct
- CausalLoop.md → 可由 Art/Mermaid 渲染
- DeepInvestigation.md → 使用 Research skill 的 Templates/

### 文件依賴

- CreateSkill.md 要求先讀取 `~/.claude/PAI/DOCUMENTATION/Skills/SkillSystem.md`
- BuildBible.md 要求先讀取 `StoryLayers.md`, `StorrFramework.md`, `PressfieldFramework.md`
- WriteReport.md 要求先執行 CreateNarrativePoints 生成 artifacts

---

## 與 Life-OS 的借鑒點

### 1. 結構化工作流程設計

**借鑒價值：高**

Workflow 提供了將複雜任務分解為可管理步驟的範例。對於 Life-OS：

- 可參考 FullCycle 的科學方法框架（Phase 0-8）
- 可學習 FiveWhys 的根因分析方法
- 可採用 CausalLoop 的系統思考視角

### 2. Voice Notification 模式

**借鑒價值：中**

統一的通知機制有助於追蹤系統狀態。類似的概念可用於：
- 任務狀態變更通知
- 日程提醒整合
- 系統事件記錄

### 3. Artifact Pipeline 模式

**借鑒價值：高**

DeepInvestigation 和 WriteReport 展示的 artifact 持久化與 pipeline 概念非常適合 Life-OS：
- 研究資料的積累與複用
- 不同視角（晨間反思/團隊會議）的產出銜接
- 長期項目的進度追蹤

### 4. 並列代理探索

**借鑒價值：中**

Dream 和 DeepInvestigation 的並列代理模式可應用於：
- 同時探索多個人生方向
- 多維度自我評估
- 不同角色視角的決策分析

### 5. 觸發條件與意圖識別

**借鑒價值：高**

精確的觸發短語設計和意圖識別邏輯適用於：
- 日常任務的自動分類
- 情境感知的工作流觸發
- 自然語言介面的解析

### 6. 品質門控與退出條件

**借鑒價值：中**

Progress Check 和 Quality Gate 的概念可用於：
- 確保晨間反思達到最低品質標準
- 定義何時"充分"考慮了一個決定
- 設定項目/目標的完成標準

### 7. 三階段協議（AdversarialValidation）

**借鑒價值：低至中**

三階段（提案 → 批評 → 綜合）的模式較為複雜，但適用於：
- 重大人生決定的多方觀點審視
- 目標設定的反對意見考慮
- 策略規劃的韌性測試

### 8. 孔徑振盪（ApertureOscillation）

**借鑒價值：高**

窄義/廣義/綜合的思考框架特別適合 Life-OS：
- **窄義**：眼前的具体任務/決定
- **廣義**：長期人生目標/價值觀一致性
- **綜合**：發現日常選擇與人生方向的張力

---

## 檔案清單

以下為本次分析的 21 個代表性 Workflow 檔案：

| # | 路徑 | 行數 | 類型 |
|---|------|------|------|
| 1 | Thinking/src/Science/Workflows/FullCycle.md | 396 | 科學方法 |
| 2 | Thinking/src/BeCreative/Workflows/TreeOfThoughts.md | 70 | 創意思考 |
| 3 | Thinking/src/FirstPrinciples/Workflows/Deconstruct.md | 199 | 第一原理 |
| 4 | Ideate/src/Workflows/Dream.md | 67 | 創意生成 |
| 5 | CreateSkill/src/Workflows/CreateSkill.md | 306 | 技能創建 |
| 6 | Evals/src/Workflows/RunEval.md | 106 | 評估執行 |
| 7 | Security/src/WebAssessment/Workflows/UnderstandApplication.md | 153 | 安全評估 |
| 8 | SystemsThinking/src/Workflows/CausalLoop.md | 229 | 系統思考 |
| 9 | RootCauseAnalysis/src/Workflows/FiveWhys.md | 174 | 根因分析 |
| 10 | Research/src/Workflows/DeepInvestigation.md | 361 | 深度研究 |
| 11 | Art/src/Workflows/TechnicalDiagrams.md | 261 | 視覺創作 |
| 12 | ExtractWisdom/src/Workflows/Extract.md | 60 | 智慧提取 |
| 13 | ISA/src/Workflows/Interview.md | 84 | 訪談引導 |
| 14 | PAIUpgrade/src/Workflows/ResearchUpgrade.md | 208 | 升級研究 |
| 15 | Fabric/src/Workflows/ExecutePattern.md | 276 | 模式執行 |
| 16 | Daemon/src/Workflows/DeployDaemon.md | 45 | 部署執行 |
| 17 | Telos/src/Workflows/WriteReport.md | 619 | 報告生成 |
| 18 | Investigation/src/OSINT/Workflows/CompanyDueDiligence.md | 272 | 盡職調查 |
| 19 | RedTeam/src/Workflows/AdversarialValidation.md | 255 | 對抗驗證 |
| 20 | WriteStory/src/Workflows/BuildBible.md | 247 | 故事建構 |
| 21 | ApertureOscillation/src/Workflows/Oscillate.md | 206 | 孔徑振盪 |

---

**分析完成時間**：2026-05-08
**涵蓋範圍**：303 個 Workflow 檔案中的 21 個深度分析樣本
