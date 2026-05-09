# T04 — Workflows MD

> 組ID：T04
> 來源：Packs/*/src/Workflows/*.md
> 檔案總數：168
> 採樣分析：15 個
> 優先級：高

---

## 檔案結構分析

Workflow MD 檔案是 PAI 系統中**程序化任務執行**的核心構建模塊，分布於各個 Pack 的 `src/Workflows/` 目錄下。經分析後，呈現以下結構模式：

### 通用頂層結構

几乎所有 Workflow 文件都遵循一致的頂層區塊：

```
1. 標題區
   - 檔案名即工作流名稱（TitleCase）
   - 副標題：一句話描述目的

2. Voice Notification 區塊（語音通知）
   - curl POST 到 localhost:31337 或 localhost:8888
   - 攜帶 JSON payload 含 "message" 欄位
   - 以 `> /dev/null 2>&1 &` 背景執行

3. 觸發條件（When to Use / Trigger Phrases）
   - 用戶可能說出的觸發語句
   - 明確的觸發關鍵字（如 "deploy daemon"、"create custom agents"）

4. 主工作流程
   - Step 1, Step 2... 編號步驟
   - 每步含具體指令（bash 命令、程式碼區塊）

5. 輸出格式（Output Template / Done）
   - 完成後的標準化輸出格式
   - 通常包含 SUMMARY、STATUS、STORY EXPLANATION、COMPLETED 等固定欄位
```

### 語音通知模式

所有具有實質操作的 Workflow 都會在執行開始時發送語音通知：

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running the WORKFLOW workflow in the SKILL skill..."}' \
  > /dev/null 2>&1 &
```

部分 Workflow（較舊的）使用 `localhost:8888`，新建的統一使用 `localhost:31337`。

### Step 編號模式

工作流以 Step 為基本單位組織，每個 Step 通常包含：
- 步驟名稱（粗體）
- 具體執行指令（bash 指令碼或內聯代碼）
- 條件判斷（If/Else）
- 輸出驗證

---

## 內容差異分析

不同用途的 Workflow 在複雜度、規模和目的上差異顯著：

| 比較維度 | 簡單型（DeployDaemon） | 中等型（RunEval） | 複雜型（Essay） |
|---------|----------------------|-------------------|-----------------|
| **行數** | 45 行 | 106 行 | 1085 行（被截斷） |
| **Step 數量** | 3-4 步 | 5 步 | 8 步（強制性） |
| **是否有子流程** | 無 | 簡單分支 | 複雜決策樹 |
| **代碼區塊** | 主要 bash | bash + 指令碼 | 大量 prompt 模板 |
| **特殊標記** | 無 | 無 | 🚨 強制性警告標記 |

### 規模分級

**短流程 Workflow（< 50 行）**
- Example: `DeployDaemon.md`（45 行）
- 特點：線性步驟，無分支，聚焦 DevOps 部署
- 典型用途：簡單的 1-2-3 步驟操作

**中等流程 Workflow（50-200 行）**
- Example: `CreateCustomAgent.md`（276 行）、`RunEval.md`（106 行）
- 特點：多步驟、條件判斷、多種執行模式
- 典型用途：需要用户輸入或條件分支的操作

**長流程 Workflow（> 500 行）**
- Example: `Essay.md`（1085+ 行）、`CreateSkill.md`（306 行）
- 特點：極度詳細、包含大量模板、強制性子步驟
- 典型用途：創意生成、複雜技能創建

### 強制性標記語言

`Essay.md` 使用了極度強調的標記語言：
```
🚨🚨🚨 ALL STEPS ARE MANDATORY — NO EXCEPTIONS 🚨🚨🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  EVERY SINGLE STEP BELOW IS MANDATORY. EXECUTE ALL OF THEM.  ⚠️
⚠️  DO NOT SKIP ANY STEP. DO NOT ABBREVIATE. DO NOT SHORTCUT.   ⚠️
```

這反映了對創意工作流不能被簡化或跳過的深刻理解。

---

## 核心機制

### Workflow 觸發路由

Workflow 不自己處理路由——路由由父層級 SKILL.md 中的 `Workflow Routing` 表格定義：

```markdown
## Workflow Routing
| Workflow | Trigger | File |
|----------|---------|------|
| **CreateSkill** | "create a skill" | `Workflows/CreateSkill.md` |
```

### Workflow-to-Tool 整合模式

對於調用 CLI 工具的 Workflow，標準模式包含**意圖-標誌映射表**：

```markdown
## Intent-to-Flag Mapping

### Model Selection
| User Says | Flag | When to Use |
|-----------|------|-------------|
| "fast", "quick", "draft" | `--model haiku` | Speed priority |
| (default), "best" | `--model opus` | Quality priority |

## Execute Tool

\`\`\`bash
bun ToolName.ts [FLAGS_FROM_INTENT_MAPPING] --required-param "value"
\`\`\`
```

這允許用戶用自然語言請求，Workflow 翻譯為精確的 CLI 標誌。

### 多代理並行執行模式

`CreateCustomAgent.md` 展示了複雜的多代理模式：

1. 從用户請求提取需求（數量、任務、特質）
2. 對每個代理執行 `ComposeAgent.ts`（不同特質組合）
3. 提取各代理的 prompt、voice_id、color
4. **單一消息多 Task 呼叫**並行啟動
5. 每個代理自行語音輸出完成通知

### 結構化輸出格式

幾乎所有 Workflow 都使用統一的完成輸出格式：

```markdown
📋 SUMMARY: [what was done]
📊 STATUS: [metrics/tables]
📖 STORY EXPLANATION:
1. [step 1]
2. [step 2]
...
🎯 COMPLETED: [completion message]
```

### 條件性子流程

部分 Workflow 包含條件分支：

```markdown
**Option A: Web UI (Recommended)**
1. Open http://localhost:5173
2. Select use case from dropdown
...

**Option B: CLI**
\`\`\`bash
bun run cli-run.ts --use-case <name> --model <model>
\`\`\`
```

---

## 關聯檔案

| 相關類型報告 | 關係說明 |
|-------------|---------|
| **T02 — Packs SKILL.md** | SKILL.md 定義 Workflow 路由表，是 Workflow 的父層組織 |
| **T06 — Hook TypeScript** | Hook 是 Workflow 的前置/後置處理機制 |
| **T26 — PAI CORE TS** | CLI 工具（如 ComposeAgent.ts）由 Workflow 呼叫 |
| **T03 — v5.0.0 Skills SKILL.md** | v5.0.0 中的 Skills 同樣使用 Workflow 結構 |

---

## 與 Life-OS 的借鑒點

### 1. 結構化工作流作風

PAI 的 Workflow 模式可移植到 Life-OS 的專案管理：
- 每個 LIFE-OS 模組（健身、閱讀、工作）可定義標準化步驟
- 使用一致的觸發詞和輸出格式
- 減少每次執行時的認知負擔

### 2. 強制性步驟標記

`Essay.md` 的 `ALL STEPS ARE MANDATORY` 模式對 Life-OS 有啟發：
- 創意/複雜任務需要完整執行，不能捷徑
- 可以在 LIFE-OS 的每日前瞻（Daily Preview）等複雜流程中使用

### 3. 意圖-動作映射表

將自然語言意圖翻譯為具體行動的模式很實用：
- 用户說「快速完成」→ 對應特定 flags
- 適用於：習慣追蹤、任務排序、優先級判定

### 4. 語音通知與進度追蹤

Voice Notification 模式可用於 Life-OS：
- 任務開始時發送通知
- 任務完成時自動更新狀態
- 創建「正在進行中」的知覺

### 5. 多代理協作模式

`CreateCustomAgent.md` 展示的多代理並行執行可借鑒：
- 同一任務分配給多個「视角」同時處理
- 最終合併結果（如早晨簡報的多來源整合）

---

## 檔案清單

以下為本次採樣分析的 15 個 Workflow 檔案：

```
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Agents/src/Workflows/CreateCustomAgent.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ISA/src/Workflows/Interview.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ISA/src/Workflows/CheckCompleteness.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ISA/src/Workflows/Reconcile.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Research/src/Workflows/StandardResearch.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Research/src/Workflows/ExtensiveResearch.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Research/src/Workflows/ClaudeResearch.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Research/src/Workflows/Fabric.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Research/src/Workflows/ExtractKnowledge.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/src/Workflows/CreateSkill.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/src/Workflows/ImproveSkill.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateSkill/src/Workflows/TestSkill.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Essay.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/RunEval.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Fabric/src/Workflows/ExecutePattern.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Daemon/src/Workflows/DeployDaemon.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/FirstPrinciples/src/Workflows/Deconstruct.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/FirstPrinciples/src/Workflows/Challenge.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/FirstPrinciples/src/Workflows/Reconstruct.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Ideate/src/Workflows/Dream.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Ideate/src/Workflows/FullCycle.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Ideate/src/Workflows/QuickCycle.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Ideate/src/Workflows/Steal.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Ideate/src/Workflows/Mate.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/src/Workflows/IdeaGeneration.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/src/Workflows/TreeOfThoughts.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/src/Workflows/MaximumCreativity.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BeCreative/src/Workflows/TechnicalCreativityGemini3.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/CreateJudge.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/CreateScenario.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/CreateUseCase.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/CompareModels.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/ComparePrompts.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Evals/src/Workflows/ViewResults.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Webdesign/src/Workflows/CreatePrototype.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Webdesign/src/Workflows/ExportToCode.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Webdesign/src/Workflows/DeployDesign.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Remotion/src/Workflows/ContentToAnimation.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Remotion/src/Workflows/GeneratedContentVideo.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/src/Workflows/Search.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/src/Workflows/Latest.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/src/Workflows/Paper.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/AudioEditor/src/Workflows/Clean.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BrightData/src/Workflows/Crawl.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BrightData/src/Workflows/FourTierScrape.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Apify/src/Workflows/Update.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Browser/src/Workflows/Update.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Browser/src/Workflows/ReviewStories.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Browser/src/Workflows/Automate.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Telos/src/Workflows/WriteReport.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Telos/src/Workflows/InterviewExtraction.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Telos/src/Workflows/Update.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/WorldThreatModel/src/Workflows/TestIdea.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/WorldThreatModel/src/Workflows/UpdateModels.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/WorldThreatModel/src/Workflows/ViewModels.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/RootCauseAnalysis/src/Workflows/Fishbone.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/RootCauseAnalysis/src/Workflows/Postmortem.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/RootCauseAnalysis/src/Workflows/KepnerTregoe.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/SystemsThinking/src/Workflows/FindLeverage.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/IterativeDepth/src/Workflows/Explore.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ExtractWisdom/src/Workflows/Extract.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/src/Workflows/AlgorithmUpgrade.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/src/Workflows/FindSources.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/src/Workflows/MineReflections.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/src/Workflows/ResearchUpgrade.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PAIUpgrade/src/Workflows/Upgrade.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/WriteStory/src/Workflows/Interview.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/WriteStory/src/Workflows/Explore.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/src/Workflows/RecordFlow.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/src/Workflows/ReplayFlow.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/src/Workflows/Reproduce.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/src/Workflows/TestForm.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/src/Workflows/VerifyDeploy.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Interceptor/src/Workflows/Update.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/USMetrics/src/Workflows/GetCurrentState.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BitterPillEngineering/src/Workflows/Audit.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/BitterPillEngineering/src/Workflows/QuickCheck.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PrivateInvestigator/src/Workflows/ReverseLookup.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/PrivateInvestigator/src/Workflows/VerifyIdentity.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateCLI/src/Workflows/CreateCli.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateCLI/src/Workflows/AddCommand.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/CreateCLI/src/Workflows/UpgradeTier.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Daemon/src/Workflows/PreviewDaemon.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Daemon/src/Workflows/ReadDaemon.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Daemon/src/Workflows/UpdateDaemon.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Council/src/Workflows/Debate.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Council/src/Workflows/Quick.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Aphorisms/src/Workflows/AddAphorism.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Aphorisms/src/Workflows/FindAphorism.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Aphorisms/src/Workflows/ResearchThinker.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Aphorisms/src/Workflows/SearchAphorisms.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Science/src/Workflows/DefineGoal.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Science/src/Workflows/QuickDiagnosis.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/AnnotatedScreenshots.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Comparisons.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Comics.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/AdHocYouTubeThumbnail.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/YouTubeThumbnailChecklist.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/RecipeCards.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Maps.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Mermaid.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/TechnicalDiagrams.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Timelines.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Visualize.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/D3Dashboards.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Stats.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/LogoWallpaper.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/EmbossedLogoWallpaper.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/CreatePAIPackIcon.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/RemoveBackground.md
/home/misty/.hermes/Personal_AI_Infrastructure/Packs/Art/src/Workflows/Frameworks.md
```

---

## 研究完成標記

T04 Workflows MD 分析完畢，共採樣 15 個代表性檔案，覆蓋短/中/長三種規模類型。Workflow 是 PAI 系統的程序執行骨幹，與 SKILL.md（路由）、CLI Tools（執行器）共同構成完整的工作流體系。
