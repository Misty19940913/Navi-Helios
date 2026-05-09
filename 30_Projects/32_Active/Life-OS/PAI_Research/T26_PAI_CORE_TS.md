# T26 — PAI CORE TypeScript

> 組ID：T26
> 來源：Releases/v5.0.0/.claude/hooks/, Packs/*/src/SKILL.md 的 TypeScript 工具
> 檔案總數：2152（Hook TS + Pack Tools TS）
> 採樣分析：7 個核心 Hook 檔案
> 優先級：🔴 最高

---

## 檔案結構分析

PAI CORE TypeScript 可分為兩大類：

### Hook 系統（`hooks/*.hook.ts`）

40+ 個 Hook 檔案，每個 Hook 對應一個 Claude Code 生命週期事件。Hook 接收 JSON payload（stdin），執行副作用操作，透過 stdout 輸出結構化指令。

**Hook 類型分布：**

| 類別 | Hook 檔案 |
|------|----------|
| Prompt 處理 | `PromptProcessing.hook.ts`, `InstructionsLoadedHandler.hook.ts` |
| Tab 管理 | `ResponseTabReset.hook.ts`, `TelosSummarySync.hook.ts` |
| Context 管理 | `RestoreContext.hook.ts`, `CheckpointPerISC.hook.ts`, `LastResponseCache.hook.ts` |
| 學習系統 | `WorkCompletionLearning.hook.ts`, `RelationshipMemory.hook.ts`, `Learning.hook.ts` |
| 品質管控 | `IntegrityCheck.hook.ts`, `DocIntegrity.hook.ts`, `SmartApprover.hook.ts` |
| 失敗處理 | `StopFailureHandler.hook.ts`, `ToolFailureTracker.hook.ts`, `RepeatDetection.hook.ts` |
| 內容分析 | `ContentScanner.hook.ts`, `FileChanged.hook.ts`, `AgentInvocation.hook.ts` |
| 觀測上報 | `pushStateToTargets`（跨 Hook 共用）|

**Lib 共享模組（`hooks/lib/`）：**

| 檔案 | 角色 |
|------|------|
| `hook-io.ts` | 統一 stdin 讀取 + transcript 解析（150ms delay 等待磁碟寫入）|
| `identity.ts` | 單一身份載入器——從 settings.json 讀取 DA/Principal 身份，含快取 |
| `isa-template.ts` | ISA（Ideal State Artifact）模板生成器——v4.1 規範，含 ISC 最低數量指引 |
| `containment-zones.ts` | Containment Zone 邊界定義 |
| `tab-setter.ts` | Tab 標題/狀態寫入 |
| `output-validators.ts` | 輸出驗證器 |
| `change-detection.ts` | 變更檢測 |
| `observability-transport.ts` | 觀測資料轉送（HTTP/Cloudflare KV）|
| `isa-utils.ts` | ISA 工具函式 |
| `learning-readback.ts` | 學習回讀 |
| `learning-utils.ts` | 學習工具 |
| `log-rotation.ts` | 日誌輪轉 |
| `time.ts` | 時間工具 |
| `paths.ts` | 路徑工具 |
| `notifications.ts` | 通知工具 |

### TypeScript 工具（`Tools/*.py` 的對應實作）

| 工具 | 語言 | 角色 |
|------|------|------|
| `BackupRestore.ts` | TypeScript | 備份/還原系統 |
| `validate-protected.ts` | TypeScript | 受保護配置驗證 |

---

## 核心機制

### Hook 輸入/輸出協定

**輸入（stdin JSON）：**
```typescript
interface HookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
  last_assistant_message?: string;
  // Hook-specific fields
}
```

**輸出（stdout JSON）：**
```typescript
// 指令類
{ "instructions": [{ "type": "Read", "path": "..." }] }
// 狀態類
{ "hookSpecificOutput": { "hookEventName": "...", "additionalContext": "..." } }
// 混用
{ "instructions": [...], "hookSpecificOutput": {...} }
```

### PromptProcessing.hook.ts 詳細分析

這是 PAI 系統最複雜的 Hook 之一（1075 行），負責：
1. **Tab 標題**：確定了從 prompt 提取動詞 gerund 形式作為標題
2. **Session 命名**：多種策略——問題檢測、縮寫識別、動作動詞 anchor
3. **模式識別**：MINIMAL/NATIVE/ALGORITHM 模式分類（Haiku 推斷）
4. **雜訊過濾**：完整的 NOISE_WORDS Set（300+ 停用詞）、PROFANITY_WORDS Set
5. **鎖定機制**：檔案鎖防止並發寫入 session-names.json

**命名策略優先級：**
- Strategy -1：問題檢測（「Where are pet stores?」→ Research Pet Stores）
- Strategy 0：縮寫/專有名詞優先（PAI、TUI、API）
- Strategy 1：動作動詞 anchor（「Fix」+ 後續 4 個內容詞）

### identity.ts 單一身份載入

從 `~/.claude/settings.json` 讀取，而非 markdown 檔案——這是 PAI 系統的**程式化身份來源**：

```json
{
  "daidentity": {
    "name": "Hermes",
    "fullName": "Hermes Agent",
    "color": "#3B82F6",
    "mainDAVoiceID": "voice-id",
    "voice": VoiceProsody,
    "personality": VoicePersonality,
    "startupCatchphrase": "{name} here, ready to go."
  },
  "principal": {
    "name": "Misty",
    "pronunciation": "MIS-ti",
    "timezone": "Asia/Taipei"
  },
  "observability": {
    "targets": [{ "type": "http", "url": "http://localhost:31337" }]
  }
}
```

支援新舊格式相容（`daidentity.voice` vs `daidentity.voices.main`）。

### isa-template.ts 的 ISC 系統

ISC（Ideal State Criteria）是最小檢核清單，根據 effort 等級有不同的數量要求：

| 等級 | ISC 最低 | ISC 目標 |
|------|---------|---------|
| TRIVIAL | 2 | 2-4 |
| QUICK | 4 | 4-8 |
| STANDARD | 8 | 8-16 |
| EXTENDED | 16 | 16-32 |
| ADVANCED | 24 | 24-48 |
| DEEP | 40 | 40-80 |
| COMPREHENSIVE | 64 | 64-150 |

---

## 與 Life-OS 的借鑒點

### 1. Hook 系統 → 事件驅動的品質閘
PAI 的 Hook 系統是事件驅動的品質管制閘——每個重要生命週期事件都可以插入檢查點。Life-OS 可借鑒此模式，在重要操作前後插入鉤子。

### 2. identity.ts → 統一身分管理
所有身份資訊集中在 settings.json，透過單一載入器讀取——避免散落在各個 Hook 中重複解析。Life-OS 的使用者身份、系統身份也應有單一來源。

### 3. isa-template.ts 的 ISC 系統 → 量化驗證標準
每個工作項目的驗證標準數量根據工作複雜度調整（2→150）。Life-OS 也應有類似的「驗證標準數量指引」。

### 4. NOISE_WORDS Set → 意圖識別的負面清單
300+ 停用詞的集合，用於從 user prompt 中過濾掉無意義的詞，只保留實質內容。這可用於意圖識別和關鍵字提取。

### 5. 檔案鎖定的並發控制 → 共享狀態的寫入保護
session-names.json 的寫入有完整的鎖定機制——防止多個 Hook 並發寫入導致資料損壞。

---

## 關聯檔案

- T11 — Memory System（Hook 與 Memory 的互動）
- T12 — Algorithm v6.3.0（Hook 觸發的演算法流程）
- T14 — PULSE Daemon（觀測資料上報）
- T15 — DA Identity（DA 身份系統）
- T26 報告本身是 PAI CORE TS 的入口

---

## 檔案清單（分析樣本）

```
Releases/v5.0.0/.claude/hooks/PromptProcessing.hook.ts
Releases/v5.0.0/.claude/hooks/lib/hook-io.ts
Releases/v5.0.0/.claude/hooks/lib/identity.ts
Releases/v5.0.0/.claude/hooks/lib/isa-template.ts
Releases/v5.0.0/.claude/hooks/lib/observability-transport.ts
Releases/v5.0.0/.claude/hooks/lib/tab-setter.ts
Releases/v5.0.0/.claude/hooks/lib/output-validators.ts
Tools/BackupRestore.ts
Tools/validate-protected.ts
Tools/README.md
```
