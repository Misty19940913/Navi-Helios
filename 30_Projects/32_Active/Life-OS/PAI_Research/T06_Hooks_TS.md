# T06 — Hook TypeScript

> 組ID：T06
> 來源：`**/*.hook.ts`
> 檔案總數：37（v5.0.0 hooks 目錄）
> 採樣分析：15 個
> 優先級：High

---

## 檔案結構分析

v5.0.0 的 Hook 系統採用 **事件驅動 + stdin/stdout JSON 協定**架構：

### 共同結構模式

```typescript
#!/usr/bin/env bun
/**
 * [HookName].hook.ts — [One-line purpose]
 *
 * TRIGGER: [EventName] (matcher: [ToolNames])
 * [Other metadata]
 */

import { ... } from './lib/...';

interface HookInput {
  session_id: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  // ... event-specific fields
}

// Read stdin JSON
let input: any;
try {
  input = JSON.parse(readFileSync(0, 'utf-8'));
} catch { process.exit(0); }

async function main() {
  // Guard clauses — early exit if conditions not met
  // Core logic
  // stdout JSON response (continue: true/false, or hookSpecificOutput)
}

main().catch(...).finally(() => {
  console.log(JSON.stringify({ continue: true }));
  process.exit(0);
});
```

### 觸發事件分類

| 觸發事件 | 含義 | 代表鉤子 |
|---------|------|---------|
| `PreToolUse` | 工具執行前 | SecurityPipeline, ContainmentGuard, PromptGuard |
| `PostToolUse` | 工具執行後（成功） | ISASync, ContentScanner, CheckpointPerISC |
| `PostToolUseFailure` | 工具執行後（失敗） | ToolFailureTracker |
| `Stop` | 對話結束 | DocIntegrity, RelationshipMemory, PreCompact |
| `PreCompact` | 上下文壓縮前 | PreCompact |
| 事件鉤（command-only） | ConfigChange | ConfigAudit |

### 基礎設施（lib/）

| 檔案 | 職責 |
|------|------|
| `isa-utils.ts` | ISA/PRD 解析、frontmatter 讀寫、criteria 正則、W/B/O 分類 |
| `hook-io.ts` | Stop 鉤子的 stdin 讀取（含 timeout）、transcript 解析 |
| `paths.ts` | PAI_DIR / Claude 目錄路徑解析、expandPath 展開 |
| `containment-zones.ts` | Z1-Z4 containment 區域判斷 |
| `observability-transport.ts` | 推送狀態/事件到外部觀測端點 |
| `tab-setter.ts` |演算法階段標籤顏色設定 |
| `time.ts` | ISO timestamp、PST 元件 |

---

## 內容差異分析

### 安全類鉤子

| 鉤子 | 觸發 | 機制 |
|------|------|------|
| `SecurityPipeline.hook.ts` | PreToolUse (Bash/Write/Edit/MultiEdit) | InspectorPipeline (Pattern→Egress→Rules 三級) |
| `ContainmentGuard.hook.ts` | PreToolUse (Edit/Write/MultiEdit) | 寫入隔離區（Z1-Z4）外的身份字串時阻擋（exit 2） |
| `ContentScanner.hook.ts` | PostToolUse (WebFetch/WebSearch) | InjectionInspector — 檢測 prompt injection |
| `ConfigAudit.hook.ts` | ConfigChange | 檔案 diff 比對快照，寫入 config-changes.jsonl |
| `PromptGuard.hook.ts` | PreToolUse | 未知（待讀取） |

### 工作同步類鉤子

| 鉤子 | 觸發 | 核心功能 |
|------|------|---------|
| `ISASync.hook.ts` | PostToolUse (Write/Edit) on ISA/PRD | 讀取 ISA frontmatter → 同步到 work.json → 推送觀測事件 → 更新 tab 顏色 |
| `CheckpointPerISC.hook.ts` | PostToolUse (Write/Edit) on ISA | ISC `[ ]`→`[x]` 過渡時自動 git commit（需 allowlist） |
| `DocIntegrity.hook.ts` | Stop | 系統檔案變更時執行跨引用完整性檢查 |

### 觀測/學習類鉤子

| 鉤子 | 觸發 | 輸出 |
|------|------|------|
| `RelationshipMemory.hook.ts` | Stop | 解析 session，提取 W/B/O 關係備註 → `MEMORY/RELATIONSHIP/YYYY-MM/` |
| `ToolFailureTracker.hook.ts` | PostToolUseFailure | 寫入 `tool-failures.jsonl` |
| `PreCompact.hook.ts` | PreCompact | 輸出 handover markdown 到 stdout（保留穿過壓縮邊界） |
| `TelosSummarySync.hook.ts` | Stop（推測） | 待分析 |

### 代理類鉤子

| 鉤子 | 職責 |
|------|------|
| `AgentInvocation.hook.ts` | subagent 啟動追蹤 |
| `TeammateIdle.hook.ts` | 代理空閒檢測 |
| `SmartApprover.hook.ts` | 審批邏輯 |

---

## 核心機制

### 1. ISA（Ideal State Artifact）系統

v5.0.0 的工作追蹤核心。ISA.md = PRD.md 的重新命名。

```
MEMORY/WORK/<slug>/
├── ISA.md（或 PRD.md）
└── .checkpoint-state.json
```

**isa-utils.ts 關鍵功能：**
- `parseFrontmatter()` — 解析 YAML frontmatter
- `parseCriteriaList()` — 解析 `- [x] ISC-N: description` 格式的 criteria
- `CRITERIA_HEADING_RE` — 統一正則，支援 `## Criteria`、`## ISC Criteria`、`## IDEAL STATE CRITERIA` 等 7 種歷史變體
- `syncToWorkJson()` — 將 ISA frontmatter + criteria 同步到 work.json
- `appendPhase()` — 階段歷史追蹤（OBSERVE→THINK→PLAN→BUILD→EXECUTE→VERIFY→LEARN→COMPLETE）
- `parseCapabilities()` — 解析 `🏹 CAPABILITIES SELECTED` 區塊

### 2. CheckpointPerISC — ISC 觸發的 Git 提交

```typescript
// 觸發：ISA.md 中 ISC 從 [ ] 變為 [x]
// 讀取允許清單 ~/.claude/checkpoint-repos.txt
// 對每個已注册 repo 執行：
git add -A
git commit -m "ISC-<N> (<slug>): <description>" --no-verify --no-gpg-sign
```

**安全設計：**
- 失敗關閉：任何錯誤都 emit `{continue: true}` + exit 0，不會讓 session 崩潰
- 不執行破壞性 git 操作（no reset/revert/checkout/branch -D/clean/push --force）
- 冪等：`.checkpoint-state.json` 追蹤已提交的 ISC

### 3. SecurityPipeline — 三級檢查器鏈

```typescript
const pipeline = new InspectorPipeline([
  createPatternInspector(),  // 模式比對
  createEgressInspector(),  // 出口流量檢查
  createRulesInspector(),   // 規則引擎
]);
```

**響應類型：**
- `deny` → exit 2（阻擋）
- `require_approval` → 輸出 `{hookSpecificOutput: {permissionDecision: 'ask'}}`
- `alert` → stderr 警告
- `allow` → 繼續

### 4. PreCompact Handover

在上下文壓縮前輸出結構化 handover note：
```markdown
# Pre-Compaction Handover
*Captured: <ISO timestamp>*

## Active Work
**Task:** ...
**Directory:** ...
**Status:** ...
**Started:** ...

### ISA Summary
（前 40 行）

### Files Modified
- ...

### Key Decisions
- ...
```

### 5. RelationshipMemory W/B/O 分類

- **W (World)** — 客觀事實
- **B (Biographical)** — DA 第一人稱敘述
- **O (Opinion)** — 偏好/信念（帶 confidence）

---

## 關聯檔案

| 檔案 | 關聯說明 |
|------|---------|
| `T04_Workflows.md` | Workflow 是 Hook 的消費方 |
| `T11_MEMORY_System.md` | Hook 直接操作 MEMORY 目錄結構 |
| `T12_ALGORITHM.md` | ISASync 同步 ISA ↔ Algorithm 狀態 |
| `T26_PAI_CORE_TS.md` | Hook 系統與 PAI Core 的整合點 |

---

## 與 Life-OS 的借鑒點

### 1. 事件驅動鉤子架構

PAI Hook = Life-OS 的「觸發器」概念。每個鉤子有：
- 明確的觸發事件（PreToolUse/PostToolUse/Stop/PreCompact）
- 輸入協定（stdin JSON）
- 輸出協定（stdout JSON + stderr 診斷）
- 失敗策略（幾乎都是 `process.exit(0)` — 永遠不阻斷 session）

**借鑒：Life-OS 的自動化腳本可以採用類似的事件分類**

### 2. ISA 追蹤系統

`MEMORY/WORK/<slug>/ISA.md` + `work.json` 的雙寫架構：
- ISA.md 是 human-readable 的工作軌跡
- work.json 是 machine-readable 的狀態聚合
- ISASync 鉤子自動保持兩者同步

**借鑒：Life-OS 的 task-plan.md / progress.md 雙軌可以進一步自動化同步**

### 3. ContainmentGuard — 資訊隔離

Z1-Z4 containment zones：
```
Z1: USER/**
Z2: settings*.json
Z3: PAI/MEMORY/**
Z4: skills/_*
```

鉤子阻擋將敏感身份字串寫入隔離區外的檔案。

**借鑒：Life-OS 的隱私分級（公開/內部/個人）可以對應實體隔離區**

### 4. CheckpointPerISC — 決策快照

每個 ISC 完成時自動 git commit，主題格式：
```
<ISC-id> (<slug>): <description>
```

**借鑒：T4.x 完成時自動 commit 到對應 repo，保留完整決策歷史**

### 5. 觀測日誌標準化

所有觀測事件寫入 `MEMORY/OBSERVABILITY/`：
- `tool-failures.jsonl`
- `config-changes.jsonl`
- `subagent-events.jsonl`

統一格式：ISO timestamp + event type + session_id + 具體內容。

**借鑽：Life-OS 的 session log（progress.md）可以對應這種結構化日誌**

---

## 檔案清單

### 主要 Hook 檔（v5.0.0）

```
hooks/AgentInvocation.hook.ts
hooks/CheckpointPerISC.hook.ts
hooks/ConfigAudit.hook.ts
hooks/ContainmentGuard.hook.ts
hooks/ContentScanner.hook.ts
hooks/ContextReduction.hook.sh
hooks/DocIntegrity.hook.ts
hooks/ElicitationHandler.hook.ts
hooks/FileChanged.hook.ts
hooks/ISASync.hook.ts
hooks/InstructionsLoadedHandler.hook.ts
hooks/IntegrityCheck.hook.ts
hooks/KVSync.hook.ts
hooks/KittyEnvPersist.hook.ts
hooks/LastResponseCache.hook.ts
hooks/LoadContext.hook.ts
hooks/PreCompact.hook.ts
hooks/PromptGuard.hook.ts
hooks/PromptProcessing.hook.ts
hooks/QuestionAnswered.hook.ts
hooks/RelationshipMemory.hook.ts
hooks/RepeatDetection.hook.ts
hooks/ResponseTabReset.hook.ts
hooks/RestoreContext.hook.ts
hooks/SatisfactionCapture.hook.ts
hooks/SecurityPipeline.hook.ts
hooks/SessionCleanup.hook.ts
hooks/SetQuestionTab.hook.ts
hooks/SmartApprover.hook.ts
hooks/StopFailureHandler.hook.ts
hooks/TaskGovernance.hook.ts
hooks/TeammateIdle.hook.ts
hooks/TelosSummarySync.hook.ts
hooks/ToolActivityTracker.hook.ts
hooks/ToolFailureTracker.hook.ts
hooks/UpdateCounts.hook.ts
hooks/VoiceCompletion.hook.ts
hooks/WorkCompletionLearning.hook.ts
```

### 支援模組

```
hooks/handlers/DocCrossRefIntegrity.ts
hooks/handlers/RebuildArchSummary.ts
hooks/handlers/SystemIntegrity.ts
hooks/handlers/TabState.ts
hooks/handlers/UpdateCounts.ts
hooks/handlers/VoiceNotification.ts
hooks/lib/change-detection.ts
hooks/lib/containment-zones.ts
hooks/lib/hook-io.ts
hooks/lib/identity.ts
hooks/lib/isa-template.ts
hooks/lib/isa-utils.ts
hooks/lib/learning-readback.ts
hooks/lib/learning-utils.ts
hooks/lib/log-rotation.ts
hooks/lib/notifications.ts
hooks/lib/observability-transport.ts
hooks/lib/output-validators.ts
hooks/lib/paths.ts
hooks/lib/tab-constants.ts
hooks/lib/tab-setter.ts
hooks/lib/time.ts
```
