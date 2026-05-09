# T06 — Hook TypeScript

> 組ID：T06
> 來源：`**/*.hook.ts`
> 檔案總數：87 個（v5.0.0: 37 個 hooks + 1 個獨立 PreToolUse script，分布在 v5.0.0/v4.0/v4.0.1/v4.1/v2.3/v2.4）
> 採樣分析：14 個代表性 hooks + HookSystem.md 文件 + lib/isa-utils.ts + handlers/
> 優先級：高（系統核心自動化骨架）

---

## 檔案結構分析

### 核心目錄架構
```
~/.claude/hooks/
├── *.hook.ts           # 35 個事件鉤子腳本（v5.0.0）
├── PreToolUse/
│   ├── AgentInvocation.hook.ts    # PreToolUse:Agent 邊界攔截
│   ├── CheckpointPerISC.hook.ts   # ISC 勾選觸發 git commit
│   └── ContextReduction.hook.sh   # Bash 工具上下文減輕
├── handlers/           # 6 個共享處理程序
│   ├── DocCrossRefIntegrity.ts     # 文件交叉引用完整性
│   ├── RebuildArchSummary.ts       # 架構摘要重建
│   ├── SystemIntegrity.ts         # 系統完整性檢查
│   ├── TabState.ts                # 終端標籤狀態
│   ├── UpdateCounts.ts            # 技能/鉤子計數更新
│   └── VoiceNotification.ts       # 語音通知
├── lib/               # 12 個共享工具庫
│   ├── hook-io.ts          # stdin 讀取 + transcript 解析
│   ├── identity.ts         # DA/Principal 身份讀取
│   ├── isa-utils.ts        # ISA/PRD 解析 + work.json 同步
│   ├── learning-utils.ts   # 學習分類
│   ├── observability-transport.ts  # 觀測數據轉發
│   ├── tab-setter.ts       # 終端標題/顏色設定
│   ├── time.ts             # ISO/PST 時間工具
│   ├── paths.ts            # PAI 路徑解析
│   └── ...
└── security/
    ├── inspectors/
    │   ├── PatternInspector.ts   # 模式比對審查
    │   ├── EgressInspector.ts   # 出口流量審查
    │   ├── RulesInspector.ts    # 規則審查
    │   └── InjectionInspector.ts # 注入攻擊審查
    ├── pipeline.ts          # 組合式審查管道
    ├── types.ts            # InspectionContext 等類型
    └── logger.ts           # 安全審查日誌
```

### Hook 事件類型覆蓋矩陣

| 事件類型 | 觸發時機 | v5.0.0 掛載數 | 代表鉤子 |
|---------|---------|--------------|---------|
| SessionStart | 新對話開始 | 3 | KittyEnvPersist, LoadContext, KVSync |
| SessionEnd | 對話終止 | 7 | WorkCompletionLearning, SessionCleanup, RelationshipMemory, UpdateCounts, IntegrityCheck, KVSync, ULWorkSync |
| UserPromptSubmit | 用戶提交提示 | 4 | PromptGuard, PromptProcessing, RepeatDetection, SatisfactionCapture |
| Stop | 主體回應完成 | 4 | LastResponseCache, ResponseTabReset, VoiceCompletion, DocIntegrity |
| PreToolUse | 工具執行前 | 7+ | SecurityPipeline, ContextReduction, SetQuestionTab, SkillGuard, AgentGuard |
| PostToolUse | 工具執行後 | 6 | ContentScanner, QuestionAnswered, ISASync, TelosSummarySync, ToolActivityTracker |
| PostToolUseFailure | 工具執行失敗 | 1 | ToolFailureTracker |
| ConfigChange | 配置變更 | 1 | ConfigAudit |
| PreCompact | 上下文壓縮前 | 1 | PreCompact |
| PostCompact | 上下文壓縮後 | 1 | RestoreContext |
| StopFailure | 回應因 API 錯誤中止 | 1 | StopFailureHandler |
| TaskCreated | 任務建立 | 1 | TaskGovernance |
| TeammateIdle | 代理隊友空閒 | 1 | TeammateIdle |
| Elicitation | 啟發事件 | 1 | ElicitationHandler |
| FileChanged | 外部檔案變更 | 1 | FileChanged |
| InstructionsLoaded | 指令載入 | 1 | InstructionsLoadedHandler |

**共 17 種事件類型，40+ 個鉤子實例掛載在 v5.0.0 的 settings.json 中。**

---

## 內容差異分析

### 版本橫向對比（v5.0.0 / v4.0 / v2.3）

| Hook 名稱 | v5.0.0 | v4.0 | v2.3 | 演化方向 |
|-----------|---------|------|------|---------|
| SecurityValidator → SecurityPipeline | ✅ 改用 Inspector Pipeline | ✅ 存在 | ✅ SecurityValidator | 逐步升級為可組合審查鏈 |
| RatingCapture → SatisfactionCapture | ✅ 改為 SatisfactionCapture | ✅ RatingCapture | ❌ | 分離滿意度捕獲 |
| SessionAnalysis → PromptProcessing | ✅ 整合為 PromptProcessing | ❌ SessionAnalysis | ❌ | 合併為單一推理調用 |
| PRD.md → ISA.md | ✅ 完整遷移至 ISA | ✅ 支援兩者 | ❌ | PRD→ISA 品牌重塑 |
| CheckpointPerISC | ✅ 新增 | ❌ | ❌ | ISC 觸發 git commit |
| AgentInvocation | ✅ 新增 | ❌ | ❌ | 修補 SubagentStart 數據缺失 bug |
| PreCompact | ✅ 新增 | ❌ | ❌ | 壓縮前上下文保存 |
| RestoreContext | ✅ 新增 | ❌ | ❌ | 壓縮後上下文恢復 |
| StopFailureHandler | ✅ 新增 | ❌ | ❌ | API 錯誤語音通知 |

### 單一 Hook 內部變異

**PromptProcessing.hook.ts（最複雜）**
- 總行數：1075 行
- 單一推理調用輸出 5 個值：tab_title、session_name、mode、tier、mode_reason
- 包含 5 種快速路徑：明確評分、正面讚揚、系統文本、長度不足、已命名 session
- 複雜的命名隔離機制：過濾 Assistant 輸出中的 Algorithm 鷹架文字

**SecurityPipeline.hook.ts（最安全導向）**
- 組合式管道：PatternInspector(100) → EgressInspector(90) → RulesInspector(50)
- PreToolUse 同步阻塞：exit(2) 可終止工具執行
- PostToolUse 無法阻塞：只能注入警告

**WorkCompletionLearning.hook.ts（最長）**
- 378 行，完整實現學習捕獲
- 三層 fallback：ISA.md → PRD.md → META.yaml
- 學習分類：ALGORITHM / SYSTEM

---

## 核心機制

### 1. 事件驅動自動化骨架

PAI 的 Hook 系統構建於 Claude Code 原生 Hook 支援之上，將所有腳本放在 `~/.claude/hooks/` 並在 `settings.json` 中註冊。

**stdin 輸入格式（所有鉤子共用）：**
```typescript
{
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  // 事件特定欄位...
  tool_name?: string;        // PreToolUse/PostToolUse
  tool_input?: any;           // PreToolUse
  tool_output?: any;          // PostToolUse
  prompt?: string;            // UserPromptSubmit
}
```

**輸出約定（所有鉤子共用）：**
- stdout → JSON 結構（如 `{ continue: true }` 或 `hookSpecificOutput`）
- stderr → 診斷日誌
- exit(0) → 成功；少數同步阻塞鉤子 exit(2) 表示阻斷

### 2. 共享庫架構（lib/ + handlers/）

```
lib/isa-utils.ts     — ISA/PRD 解析、正規表達、phaseHistory、criteria 解析
lib/hook-io.ts       — stdin 讀取超時、transcript 解析
lib/identity.ts      — settings.json 身份讀取（getDAName/getPrincipalName）
lib/tab-setter.ts    — 終端標題/顏色 kitty-control 序列
lib/observability-transport.ts — Cloudflare KV + Pulse 推送
lib/time.ts          — ISO/PST 時間
lib/paths.ts         — PAI 目錄解析

handlers/TabState.ts        — 停止後標籤狀態
handlers/VoiceNotification.ts — localhost:31337 語音通知
handlers/DocCrossRefIntegrity.ts — 文件交叉引用 + 語義漂移檢查
handlers/RebuildArchSummary.ts — 架構摘要再生
handlers/UpdateCounts.ts    — 技能/鉤子計數
handlers/SystemIntegrity.ts — 完整性檢查
```

### 3. 安全審查管道（Inspector Pipeline）

```typescript
// PatternInspector — 惡意模式比對
// EgressInspector — 出口流量審查
// RulesInspector — 自定義規則審查（已禁用，SECURITY_RULES.md 為空）
// InjectionInspector — 提示注入檢測
// PromptInspector — 用戶提示注入審查
```

**安全鉤子链：**
- PreToolUse:Bash → SecurityPipeline + ContextReduction
- PreToolUse:Write|Edit → SecurityPipeline
- PostToolUse:WebFetch → ContentScanner (InjectionInspector)
- UserPromptSubmit → PromptGuard (PromptInspector)

### 4. ISA 同步機制（核心工作流）

```
PostToolUse:Write/Edit on ISA.md
    ↓
ISASync.hook.ts 讀取 frontmatter + criteria
    ↓
syncToWorkJson() → MEMORY/STATE/work.json
    ↓
pushStateToTargets() → Cloudflare KV
pushEventsToTargets() → Pulse
    ↓
setPhaseTab() → 終端標籤變色（演算法 phase 變更時）
```

### 5. 上下文壓縮銜接（PreCompact/PostCompact）

```
PreCompact → 輸出工作上下文到 stdout（通過 compaction 保留）
PostCompact → RestoreContext → 恢復工作狀態
```

### 6. Git Checkpoint（CheckpointPerISC）

ISC `[ ]` → `[x]` 轉換時：
1. 讀取 ISA.md 解析新勾選的 ISC
2. 查詢允許清單 `~/.claude/checkpoint-repos.txt`
3. 對每個已配置 repo 執行 `git add -A && git commit`
4. 防呆：無允許清單則跳過、狀態追蹤防止重複提交

---

## 關聯檔案

| 檔案 | 關聯方式 |
|------|---------|
| T03 — v5.0.0 skills | SkillGuard HTTP 路由依賴 Skill 系統 |
| T11 — Memory System | MEMORY/ 子目錄的所有讀寫 |
| T12 — Algorithm v6.3.0 | ISA phase → tab 顏色同步 |
| T14 — PULSE Daemon | localhost:31337 語音通知、KV 同步 |
| T10 — CLAUDE.md 路由 | HookSystem.md 路由表 |

---

## 與 Life-OS 的借鑒點

### 1. 事件驅動自動化 → 模組化鉤子
Life-OS 的 Obsidian Vault 編輯流程可以借鑑此模式：針對不同操作（創建、修改、刪除）掛載不同的事件處理器，確保每個操作都有對應的自動化反應。

### 2. ISA/PRD 持久化 + 同步 → 雙寫模式
PAI 的 ISA frontmatter → work.json → KV → Pulse 同步鏈，示範了如何讓單一資訊來源（ISA.md）在多個消費者（儀表板、語音、狀態追蹤）之間保持同步。Life-OS 可考慮為每個 MOC 設計類似的「意圖追蹤」同步機制。

### 3. 組合式安全管道 → 分層驗證
SecurityPipeline 的 Pattern → Egress → Rules 三層審查鏈，適用於任何需要安全性過濾的工作流。對於敏感操作（刪除、發布），可以設計「安全預檢」鉤子。

### 4. PreCompact 上下文保存 → 壓縮邊界保護
任何長對話系統都會遇到上下文截斷問題。PreCompact 的搶救模式——將工作狀態輸出到 stdout 通過截斷邊界——是防止長程任務丟失的優雅解法。

### 5. Hook + Handler 分層 → 關注點分離
Hook 本身只做：讀 stdin → 分派。Handler 專注：執行核心邏輯。這讓 Hook 可以快速退出（不阻斷主流程），而 Handler 在背景執行重工作。

### 6. 觀測可觀測性 → 事件日誌
所有鉤子產生的結構化事件（subagent-events.jsonl、tool-failures.jsonl、config-changes.jsonl）形成完整的系統活動審計跟蹤。Life-OS 應為所有關鍵操作（日程標記、任務完成、興趣領域變更）建立類似的事件日誌。

---

## 檔案清單

### 分析的 Hook 腳本（v5.0.0）
1. `AgentInvocation.hook.ts` — Subagent 生命週期追蹤
2. `CheckpointPerISC.hook.ts` — ISC 勾選觸發 Git 提交
3. `ConfigAudit.hook.ts` — 配置變更審計
4. `ContentScanner.hook.ts` — 提示注入檢測（PostToolUse）
5. `DocIntegrity.hook.ts` — 文件交叉引用 + 架構摘要重建
6. `ISASync.hook.ts` — ISA frontmatter → work.json 同步
7. `PreCompact.hook.ts` — 壓縮前上下文保存
8. `PromptProcessing.hook.ts` — 提示分類 + 標籤命名 + 模式識別
9. `RelationshipMemory.hook.ts` — 關係記憶捕獲
10. `SecurityPipeline.hook.ts` — 安全審查管道
11. `StopFailureHandler.hook.ts` — API 錯誤語音通知
12. `WorkCompletionLearning.hook.ts` — 工作完成學習捕獲

### 分析的支援庫
13. `hooks/lib/isa-utils.ts` — ISA/PRD 解析核心工具庫
14. `PAI/DOCUMENTATION/Hooks/HookSystem.md` — Hook 系統完整文檔

### 版本對照 Hooks
15. `v4.0.0/hooks/RatingCapture.hook.ts` — 演進前身
16. `v4.0.0/hooks/SecurityValidator.hook.ts` — 演進前身
17. `v4.0.0/hooks/QuestionAnswered.hook.ts` — 跨版本一致

### 完整 Hook 列表（v5.0.0）
```
AgentInvocation.hook.ts        ConfigAudit.hook.ts
CheckpointPerISC.hook.ts       ContentScanner.hook.ts
ContainmentGuard.hook.ts       DocIntegrity.hook.ts
ElicitationHandler.hook.ts     FileChanged.hook.ts
ISASync.hook.ts                InstructionsLoadedHandler.hook.ts
IntegrityCheck.hook.ts         KVSync.hook.ts
KittyEnvPersist.hook.ts        LastResponseCache.hook.ts
LoadContext.hook.ts            PreCompact.hook.ts
PromptGuard.hook.ts            PromptProcessing.hook.ts
QuestionAnswered.hook.ts       RelationshipMemory.hook.ts
RepeatDetection.hook.ts        ResponseTabReset.hook.ts
RestoreContext.hook.ts         SatisfactionCapture.hook.ts
SecurityPipeline.hook.ts       SessionCleanup.hook.ts
SetQuestionTab.hook.ts         SmartApprover.hook.ts
StopFailureHandler.hook.ts     TaskGovernance.hook.ts
TeammateIdle.hook.ts           TelosSummarySync.hook.ts
ToolActivityTracker.hook.ts    ToolFailureTracker.hook.ts
UpdateCounts.hook.ts            VoiceCompletion.hook.ts
WorkCompletionLearning.hook.ts
```
