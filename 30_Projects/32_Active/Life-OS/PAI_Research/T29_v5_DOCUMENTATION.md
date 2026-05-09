# T29 — v5.0.0 DOCUMENTATION + TOOLS

> 組ID：T29
> 來源：Releases/v5.0.0/.claude/PAI/DOCUMENTATION/**/*, Releases/v5.0.0/.claude/PAI/TOOLS/**
> 檔案總數：100+
> 採樣分析：20 個 MD + 5 個 TS
> 優先級：高

---

## 檔案結構分析

### DOCUMENTATION 目錄架構

PAI v5.0.0 的 DOCUMENTATION 採用**分層子系统文件**架構，每個子系统有獨立的資料夾：

```
DOCUMENTATION/
├── ARCHITECTURE_SUMMARY.md     # 自動生成的全系統摘要
├── PAISystemArchitecture.md    # 權威架構主文件（469行）
├── PAISystemPhilosophy.md      # PAI哲學定位
├── LifeOs/
│   ├── LifeOsThesis.md        # Life OS 論文（核心宗旨）
│   └── LifeOsSchema.md        # 使用者生命資料結構規範
├── Algorithm/
│   └── AlgorithmSystem.md      # Algorithm 執行引擎
├── Skills/
│   └── SkillSystem.md          # 技能系統（1087行）
├── Hooks/
│   └── HookSystem.md           # 鉤子事件系統（1723行）
├── Memory/
│   └── MemorySystem.md         # 記憶系統（581行）
├── Security/
│   ├── SecuritySystem.md       # 安全系統 v4.0
│   ├── Architecture.md
│   ├── ThreatModel.md
│   ├── Hooks.md
│   ├── PromptInjection.md
│   └── ...
├── Observability/
│   └── ObservabilitySystem.md  # 可觀測性系統
├── Pulse/
│   ├── PulseSystem.md          # 生命儀表板系統
│   ├── DaSubsystem.md          # 數位分身子系統
│   └── TerminalTabs.md         # 終端機標籤系統
├── Agents/
│   └── AgentSystem.md          # Agent 系統
├── Delegation/
│   └── DelegationSystem.md     # 委派系統
├── Config/
│   └── ConfigSystem.md         # 配置系統
├── Isa/
│   └── IsaSystem.md            # ISA 格式系統
├── Fabric/
│   └── FabricSystem.md         # Fabric 整合系統
├── Tools/
│   ├── Tools.md               # 工具參考
│   ├── Cli.md                 # CLI 工具
│   └── CliFirstArchitecture.md # CLI-First 設計原則
├── Feed/
│   └── FeedSystem.md          # Feed 系統
├── Arbol/
│   └── ArbolSystem.md         # 雲端執行系統
├── IsaFormat.md               # ISA 格式規格書
└── Notifications/
    └── NotificationSystem.md  # 通知系統
```

### TOOLS 目錄架構

```
TOOLS/
├── pai.ts                      # 主 CLI 啟動器（770行）
├── algorithm.ts               # Algorithm 執行 CLI
├── Inference.ts               # 推論工具
├── AlgorithmPhaseReport.ts    # 演算法階段報告器（302行）
├── PipelineOrchestrator.ts    # Pipeline 協調器（361行）
├── Banner.ts / BannerRetro.ts / BannerTokyo.ts / BannerMatrix.ts / BannerNeofetch.ts / BannerPrototypes.ts  # 橫幅生成工具
├── AgentWatchdog.ts           # Agent 看門狗
├── KnowledgeGraph.ts           # 知識圖譜導航
├── MemoryRetriever.ts         # 記憶檢索（BM25）
├── SessionHarvester.ts        # 會話收割
├── KnowledgeHarvester.ts       # 知識收割
├── LearningPatternSynthesis.ts # 學習模式合成
├── FailureCapture.ts          # 失敗捕捉
├── HealthSnapshot.ts          # 健康快照
├── ForgeProgress.ts           # Forge 進度
├── PipelineMonitor.ts         # Pipeline 監控
├── CrossVendorAudit.ts        # 跨供應商審計
├── OpinionTracker.ts          # 意見追蹤
├── ActivityParser.ts          # 活動解析
├── TranscriptParser.ts       # 轉錄解析
├── YouTubeApi.ts             # YouTube API
├── DocCheck.ts / DocCheck.ts  # 文件檢查
├── MigrateScan.ts / MigrateApprove.ts  # 遷移工具
├── InterviewScan.ts / InterviewIdealState.ts  # 面試系統工具
├── DAIdentityGenerator.ts    # DA 身份生成
├── DASchedule.ts             # DA 排程
├── DAGrowth.ts               # DA 成長
├── RelationshipReflect.ts     # 關係反思
├── TlpArchive.ts             # TLP 歸檔
├── ExtractTranscript.ts / GetTranscript.ts  # 轉錄工具
├── SecretScan.ts             # 秘密掃描
├── CostTracker.ts            # 成本追蹤
├── FeatureRegistry.ts        # 功能登錄
├── Checkpoint.ts             # 檢查點
├── GenerateTelosSummary.ts   # Telos 摘要生成
├── IntegrityMaintenance.ts   # 完整性維護
├── PAILogo.ts                # PAI 標誌
├── RemoveBg.ts / AddBg.ts    # 背景處理
├── NeofetchBanner.ts         # Neofetch 風格橫幅
├── WisdomDomainClassifier.ts # 智慧領域分類
├── WisdomFrameUpdater.ts     # 智慧框架更新
├── WisdomCrossFrameSynthesizer.ts  # 智慧跨框架合成
├── ApproveCurrentStateEntries.ts  # 當前狀態審批
├── ProposeCurrentStateEntry.ts   # 當前狀態提議
├── SessionProgress.ts         # 會話進度
├── ComputeGap.ts             # 差距計算
├── GetCounts.ts              # 計數獲取
├── LoadSkillConfig.ts        # 技能配置載入
├── extract-transcript.py     # Python 轉錄提取
├── Transcribe-package.json   # 轉錄封裝配置
└── WisdomCrossFrameSynthesizer.ts  # 智慧跨框架合成
```

---

## 內容差異分析

### 核心文件對比

| 文件 | 行數 | 核心內容 | 定位 |
|------|------|---------|------|
| `PAISystemArchitecture.md` | 469 |  Founding Principles、指令層級、子系統架構、Pipeline 拓撲 | **主架構文件** — 系統的最高層次描述 |
| `SkillSystem.md` | 1087 | 技能命名規範（TitleCase/_ALLCAPS）、技能自訂系統、動態載入、標準化流程 | **最詳細的子系統文件** — 技能幾乎占據半壁江山 |
| `HookSystem.md` | 1723 | 10 種鉤子類型、Pipeline 架構、事件驅動自動化 | **最龐大的子系統文件** — 鉤子幾乎是系統神經 |
| `MemorySystem.md` | 581 | 兩層儲存架構（PAI MEMORY + Auto-Memory）、收割與檢索工具 | **記憶基礎設施** — 定義系統如何累積智慧 |
| `AlgorithmSystem.md` | 335+ | 7 階段執行引擎、ISC 品質系統、努力層級、模式選擇 | **核心執行引擎** — PAI 的心臟 |
| `ObservabilitySystem.md` | 315 | JSONL 事件來源、多目標推送、CF KV 整合、本地/遠端儀表板 | **可觀測性基礎** — 系統的眼睛 |
| `SecuritySystem.md` | 225 | 4 鉤子/5 檢察官管道、Pattern/Egress/Rules/Injection/Prompt 檢察官 | **安全防御深度** — 系統的免疫系統 |

### 工具對比

| 工具 | 行數 | 功能 | 類型 |
|------|------|------|------|
| `pai.ts` | 770 | 主 CLI — 版本管理、MCP 設定、壁紙管理、啟動器 | 系統級 |
| `AlgorithmPhaseReport.ts` | 302 | 演算法階段狀態報告（相位/標準/代理/能力） | 狀態管理 |
| `PipelineOrchestrator.ts` | 361 | Pipeline 執行 + 監控報告（YAML 驅動） | 流程協調 |
| `KnowledgeGraph.ts` | - | 知識圖譜導航（標籤/維基連結遍歷） | 檢索 |
| `MemoryRetriever.ts` | - | BM25 搜索 + LLM 壓縮記憶檢索 | 檢索 |

---

## 核心機制

### 1. 指令層級架構（Instruction Hierarchy）

PAI 的輸入鏈有 4 層，每層有不同的權威性與持久性：

```
Layer 1: SYSTEM PROMPT（最高權威，壓縮後存續）
  → PAI/PAI_SYSTEM_PROMPT.md（憲法規則）

Layer 2: CLAUDE.md（使用者上下文，壓縮後存續）
  → ~/.claude/CLAUDE.md（操作程序）

Layer 3: @IMPORTED FILES（隨 CLAUDE.md 載入，存續）
  → PRINCIPAL_IDENTITY, DA_IDENTITY, PROJECTS, PRINCIPAL_TELOS, ARCHITECTURE_SUMMARY

Layer 4: DYNAMIC CONTEXT（階段性，壓縮後消失）
  → LoadContext.hook.ts 注入（關係/學習/工作摘要）
```

**關鍵設計：** 系統提示為憲法，CLAUDE.md 為操作手冊，@IMPORT 為豐富上下文，動態上下文為階段狀態。

### 2. 安全管道（Security Pipeline v4.0）

```
PreToolUse ──► SecurityPipeline.hook.ts
               ┌────────────────────────────┐
               │ InspectorPipeline          │
               │ 1. PatternInspector (100) │──► deny (exit 2)
               │ 2. EgressInspector  (90)  │──► require_approval
               │ 3. RulesInspector   (50)   │──► alert (disabled)
               └────────────────────────────┘──► allow
```

**四類安全鉤子：** SecurityPipeline（PreToolUse）、ContentScanner（PostToolUse）、SmartApprover（PermissionRequest）、PromptGuard（UserPromptSubmit）。

### 3. 記憶雙層架構

```
PAI MEMORY (結構化/鉤子驅動)
├── KNOWLEDGE/    # 實體型知識歸檔（People/Companies/Ideas/Research）
├── WORK/         # 主要工作追蹤（ISA.md 單一真相來源）
├── LEARNING/     # 分類學習（SYSTEM/ALGORITHM/FAILURES/SYNTHESIS/SIGNALS）
├── RESEARCH/     # 代理輸出捕獲
├── SECURITY/    # 安全審計事件
├── STATE/       # 快速運行時數據
└── PAISYSTEMUPDATES/  # 變更歷史

Auto-Memory（無結構化）
└── projects/<project>/memory/  # Claude Code 原生存儲
```

### 4. 鉤子事件系統

10 種事件類型覆蓋完整生命週期：

| 事件 | 時機 | 當前鉤子數 |
|------|------|-----------|
| SessionStart | 會話開始 | 3 |
| SessionEnd | 會話結束 | 7 |
| UserPromptSubmit | 用戶提交提示 | 4 |
| Stop | 主體完成響應 | 4 |
| PreToolUse | 工具執行前 | 6 |
| PostToolUse | 工具執行後 | 5 |
| PostToolUseFailure | 工具失敗 | 1 |
| SubagentStart | 子代理啟動 | 0 |
| ConfigChange | 配置變更 | 1 |
| PreCompact | 上下文壓縮前 | 1 |

### 5. Algorithm v6.3.0 — 封閉枚舉思維能力

**重大改變：** v6.3.0 將思維能力從開放描述改為**封閉枚舉** — 必須從以下列表選擇：

```
IterativeDepth, ApertureOscillation, FeedbackMemoryConsult, Advisor,
ReReadCheck, FirstPrinciples, SystemsThinking, RootCauseAnalysis,
Council, RedTeam, Science, BeCreative, Ideate, BitterPillEngineering,
Evals, WorldThreatModel, Fabric patterns, ContextSearch, ISA
```

發明新的能力名稱（如「分解」、「權衡分析」）是**災難性失敗**。

### 6. ISA 作為系統事實來源

ISA（理想狀態人造物）是每次 Algorithm 運行的單一真相來源，包含 12 個固定章節：

Problem → Vision → Out of Scope → Principles → Constraints → Goal → Criteria → Test Strategy → Features → Decisions → Changelog → Verification

### 7. Pipeline 協調模式

`PipelineOrchestrator.ts` 實現了 YAML 驅動的 Pipeline 執行：
- 從 `PIPELINES_DIR` 載入 `.pipeline.yaml`
- 模板插值：`{{steps.foo.output.value}}`
- 動作從 `ACTIONS_DIR` 動態載入
- 進度報告到 `localhost:8765` 監控端

---

## 與 Life-OS 的借鑒點

### 1. 四層文件架構（直接適用）

PAI 的**指令層級**對應 Life-OS 的文件角色分離：
- System Prompt → `system-design.md`（權威技術規格）
- CLAUDE.md → `findings.md`（研究發現報告）
- @Imports → `task_plan.md`（路線圖）
- Dynamic Context → `progress.md`（階段日誌）

**借鑒：** 可以在 Life-OS 中建立更嚴格的「文件角色邊界」—— 如果內容在錯誤的文件中，移動它而非保留。

### 2. 雙層記憶架構

PAI 的「結構化記憶 + 無結構化自動記憶」映射到：
- **結構化** → `findings.md`、`system-design.md`（確認的決策）
- **無結構化** → `progress.md`（會話日誌）

**借鑒：** 考慮在 Life-OS 中為「臨時研究」和「確認知識」建立明確的分離邊界。

### 3. 封閉枚舉防止創意命名

PAI v6.3.0 的「封閉枚舉思維能力」模式是防止「幻覺能力名稱」的極佳機制。

**借鑒：** 在 Life-OS 中對「研究階段標記」使用封閉枚舉：⬜（未開始）→ 🟡（探索中）→ ✅（確認）→ ~~作廢~~。

### 4. 確認閘門（Confirmation Gate）

PAI 明確規定：AI 不能自己標記任務為 ✅，必須等待用戶明確確認。

**借鑒：** 在 Life-OS 中實施同樣的「確認閘門」—— 在 Task Plan 中標記 ✅ 前，必須有明確的用戶確認記錄。

### 5. 安全管道模式

PAI 的可組合檢察官管道（Pattern/Egress/Rules/Injection）模式適用於任務驗證：
- PatternInspector → 模式匹配驗證
- EgressInspector → 輸出邊界檢查
- InjectionInspector → 外部內容注入檢測

**借鑒：** 在 Life-OS 研究中，對外部來源的吸收實施類似的「注入檢測」—— 防止未經驗證的外部內容污染研究。

### 6. 版本化演算法

PAI 的 Algorithm v6.3.0 採用版本化追蹤（`LATEST` → `v6.3.0.md`）。

**借鑒：** 在 Life-OS 中對核心研究框架採用版本化—— 每個主要版本記錄變更原因和升級路徑。

### 7. 安全/效率分離

PAI 明確區分：
- `sk_live_` / `sk-ant-` 為**危險模式**（直接拒絕）
- 管道組合為**安全模式**（可配置）

**借鑒：** 在 Life-OS 研究中，「破壞性假設」和「安全研究方向」需要明確分離，防止在探索階段意外執行破壞性結論。

---

## 檔案清單

### DOCUMENTATION（採樣）
- `DOCUMENTATION/ARCHITECTURE_SUMMARY.md`
- `DOCUMENTATION/PAISystemArchitecture.md`
- `DOCUMENTATION/PAISystemPhilosophy.md`
- `DOCUMENTATION/Skills/SkillSystem.md`
- `DOCUMENTATION/Hooks/HookSystem.md`
- `DOCUMENTATION/Memory/MemorySystem.md`
- `DOCUMENTATION/Algorithm/AlgorithmSystem.md`
- `DOCUMENTATION/Observability/ObservabilitySystem.md`
- `DOCUMENTATION/Security/SecuritySystem.md`
- `DOCUMENTATION/Security/Architecture.md`
- `DOCUMENTATION/Security/ThreatModel.md`
- `DOCUMENTATION/Security/Hooks.md`
- `DOCUMENTATION/Security/PromptInjection.md`
- `DOCUMENTATION/Security/Patterns.example.yaml`
- `DOCUMENTATION/LifeOs/LifeOsThesis.md`
- `DOCUMENTATION/LifeOs/LifeOsSchema.md`
- `DOCUMENTATION/Tools/CliFirstArchitecture.md`
- `DOCUMENTATION/Tools/Cli.md`
- `DOCUMENTATION/Tools/Tools.md`
- `DOCUMENTATION/Isa/IsaSystem.md`
- `DOCUMENTATION/IsaFormat.md`
- `DOCUMENTATION/Pulse/PulseSystem.md`
- `DOCUMENTATION/Pulse/DaSubsystem.md`
- `DOCUMENTATION/Pulse/TerminalTabs.md`
- `DOCUMENTATION/Feed/FeedSystem.md`
- `DOCUMENTATION/Fabric/FabricSystem.md`
- `DOCUMENTATION/Arbol/ArbolSystem.md`
- `DOCUMENTATION/Notifications/NotificationSystem.md`

### TOOLS（採樣）
- `TOOLS/pai.ts`
- `TOOLS/AlgorithmPhaseReport.ts`
- `TOOLS/PipelineOrchestrator.ts`
- `TOOLS/KnowledgeGraph.ts`
- `TOOLS/MemoryRetriever.ts`
- `TOOLS/SessionHarvester.ts`
- `TOOLS/KnowledgeHarvester.ts`
- `TOOLS/LearningPatternSynthesis.ts`
- `TOOLS/FailureCapture.ts`
- `TOOLS/AgentWatchdog.ts`
- `TOOLS/Banner.ts`
- `TOOLS/Checkpoint.ts`
- `TOOLS/Inference.ts`
- `TOOLS/HealthSnapshot.ts`
- `TOOLS/CostTracker.ts`
- `TOOLS/FeatureRegistry.ts`
- `TOOLS/YouTubeApi.ts`
- `TOOLS/ExtractTranscript.ts`
- `TOOLS/extract-transcript.py`
- `TOOLS/Transcribe-package.json`
