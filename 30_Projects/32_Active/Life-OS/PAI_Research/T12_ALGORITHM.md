# T12 — Algorithm v6.3.0

> 組ID：T12
> 來源：Releases/v5.0.0/.claude/PAI/ALGORITHM/**
> 檔案總數：15（含多版本歷史）
> 採樣分析：10 個核心檔案
> 優先級：高

---

## 檔案結構分析

Algorithm 系統的檔案構成一個高度模組化的版本化指令集，採多版本並存設計：

| 檔案 | 性質 | 角色 |
|------|------|------|
| `LATEST` | 純文字 | 單一版本指針（當前：6.3.0），無其他冗餘 |
| `v6.3.0.md` | 主 doctrine | 當期執行準則——演算法此刻該做什麼 |
| `v6.2.0.md` | 歷史版本 | 保留，供回滾用 |
| `v6.1.0.md` | 歷史版本 | 保留 |
| `v6.0.0.md` | 歷史版本 | 保留 |
| `v5.7.0.md` | 歷史版本 | 早期版本存檔 |
| `v5.x.md` | 歷史版本 | v5.0.0 起的多個版本 |
| `changelog.md` | 歷史文本 | 所有版本變更的完整考古學 |
| `ideate-loop.md` | 子協定 | ideate 模式的九階段認知引擎 |
| `mode-detection.md` | 檢測邏輯 | E-level 覆蓋、ideate/optimize/fast-path 模式識別 |
| `target-types.md` | 目標分類 | optimize 模式的五種目標類型 |
| `parameter-schema.md` | 參數系統 | 完整的參數三層架構（Preset → Focus → Individual） |
| `optimize-loop.md` | 子協定 | optimize 模式的雙重評估模式（metric/eval） |
| `capabilities.md` | 能力引用 | 19 種 thinking capabilities 的封閉列舉 |
| `eval-guide.md` | 評估指南 | LLM-as-judge 的三問題測試框架 |

**結構特徵：**
- Doctrine 與 History 完全分離——v6.3.0.md 只寫「現在怎麼做」，changelog.md 寫「為什麼變」
- 版本隔離：每個 vX.Y.Z.md 是完整自足的 doctrine，不依賴其他版本
- 回滾機制：改 LATEST + CLAUDE.md 引用即可，hooks 只解析 frontmatter 不解析版本號

---

## 內容差異分析

### 版本演進邏輯

從 v5.0.0 到 v6.3.0 的發展不是功能新增，而是「收緊」——BPE（Bit-Part Education）原則主導，每次版本都移除裝飾性冗餘：

| 版本 | 主要變化 |
|------|---------|
| v5.0.0 | BPE 壓縮：移除 ISC count floors、capability counts、category percentages |
| v5.1.0 | 新增：CheckpointPerISC hook（per-step durability） |
| v5.2.0 | 恢復：per-tier ISC count floors（E2+ 16/32/128/256） |
| v5.3.0 | 移除：ISC category tags `[F]/[S]/[B]/[N]/[E]/[A]` bracket 標記 |
| v5.4.0 | 新增：Learning Router 統一寫入路徑 |
| v5.5.0 | 移除：`ISC-A-N` 雙重命名空間，anti-criterion 僅保留 `Anti:` prefix |
| v6.0.0 | 框架轉移：PRD → ISA；新增 EscalationGate；capability floors 恢復 |
| v6.1.0 | 強化：thinking-capability floor 從 soft 升級為 HARD |
| v6.2.0 | 擴展：ISA 五段 → 十二段；新增 ISA Skill（六 workflows） |
| v6.3.0 | 封閉列舉：thinking capabilities 詞彙表固化，phantom capability = CRITICAL FAILURE |

### ideate-loop.md vs optimize-loop.md

兩者都是 Algorithm 的子模式，但結構迥異：

| 維度 | ideate-loop | optimize-loop |
|------|-------------|---------------|
| 核心引擎 | 九階段認知（CONSUME→DREAM→DAYDREAM→CONTEMPLATE→STEAL→MATE→TEST→EVOLVE→META-LEARN） | 實驗性優化（ASSESS→HYPOTHESIZE→IMPLEMENT→MEASURE→EVALUATE→DECIDE→LOG→ADAPT） |
| 參數系統 | 九個參數（problemConnection、selectionPressure 等） | 四個參數（stepSize、regressionTolerance 等） |
| 評估方式 | 排名候選（Feasibility、Novelty、Impact、Elegance） | 雙模式：metric（數值）vs eval（LLM-as-judge pass rate） |
| 終止條件 | Meta-Learner 決定 | plateau protocol + maxIterations |
| 學習提取 | 領域組合有效性、參數調整洞見 | Dead Ends ledger + 學習寫入 MEMORY/LEARNING/ |

### capabilities.md 的封閉列舉設計（v6.3.0 重大發現）

v6.3.0 的核心改變：thinking capabilities 不再是開放列表，而是**封閉列舉**：

```
IterativeDepth, ApertureOscillation, FeedbackMemoryConsult, Advisor,
ReReadCheck, FirstPrinciples, SystemsThinking, RootCauseAnalysis,
Council, RedTeam, Science, BeCreative, Ideate, BitterPillEngineering,
Evals, WorldThreatModel, Fabric patterns, ContextSearch, ISA
```

**關鍵規則：**
- 名稱必須完全匹配（verbatim）——`FirstPrinciples` ✓ vs `first-principles decomposition` ✗
- 每個 capability 必須出現在 `🏹 CAPABILITIES SELECTED` 的輸出中，且以 **粗體名稱** 開頭
- 引擎新增 **Capability-Name Audit Gate**：在 OBSERVE→THINK 邊界自動審計，任何 phantom 都觸發 CRITICAL FAILURE

---

## 核心機制

### 1. 七階段主循環

```
OBSERVE → THINK → PLAN → BUILD → EXECUTE → VERIFY → LEARN
  1/7      2/7     3/7      4/7       5/7      6/7      7/7
```

每個階段有強制開頭動作（voice curl + ISA frontmatter 更新）和強制終止動作（Summary block）。

### 2. ISA 作為單一真相來源

ISA（Ideal State Artifact）同時是五個東西：
1. 理想狀態表述（Deutsch hard-to-vary explanation）
2. 測試工具（ISCs = tests + named probes）
3. 建構驗收（通過 ISCs = 已構建）
4. 完成條件（所有 ISCs 通過 = 完成）
5. 系統記錄（專案級 ISA 位於 `<project>/ISA.md`；任務級 ISA 位於 `MEMORY/WORK/{slug}/ISA.md`）

### 3. Tier 完整度門（HARD gate）

| Tier | 必須章節 |
|------|---------|
| E1 | Goal + Criteria |
| E2 | + Problem + Test Strategy |
| E3 | + Vision + Out of Scope + Constraints + Features |
| E4 | 全部十二章節 |
| E5 | 全部十二章節 + Interview workflow |

### 4. ISC 質量系統

ISC（Ideal State Criterion）必須通過 Splitting Test：
- `And`/`With` 連接兩個可驗證事物 → 拆分
- 獨立失敗（A 過 B 失敗可能）→ 拆分
- 範圍詞（all/every/complete）→ 枚舉
- 跨域邊界（UI/API/data/logic）→ 分離
- **無可命名探針** → 必須拆分

### 5. 雙重驗證學說（Verification Doctrine）

Rule 1：Live-Probe（用戶可見 artifact 必須用工具驗證）
Rule 2：Commitment-Boundary Advisor Calls（Extended+ 的多步 ISA 在承諾前呼叫 Advisor）
Rule 3：Deliverable Manifest 對照

### 6. Mode 分類器

由 Sonnet 分類器在 `UserPromptSubmit` 時運行，寫入 additionalContext：
```
MODE: MINIMAL | NATIVE | ALGORITHM
TIER: E1 | E2 | E3 | E4 | E5
REASON: <one sentence>
SOURCE: classifier | fail-safe
```

Fail-safe：超時/錯誤 → ALGORITHM E3（保守默認）。

---

## 關聯檔案

| 檔案 | 關係 |
|------|------|
| `T11_MEMORY_System.md` | ISA 的兩種 home——MEMORY/WORK/ 供 task ISA，Memory System 供長期記憶 |
| `T10_CLAUDE_Routing.md` | Algorithm entry point——CLAUDE.md 的 MANDATORY FIRST ACTION 指向 ALGORITHM/LATEST |
| `T03_ClaudeSkills_SKILL.md` | ISA Skill 是獨立的 skill（~/.claude/skills/ISA/），含六個 workflows |
| `T04_Workflows.md` | Ideate/Optimize 作為 sub-protocol 需要各自的 workflow 定義 |
| `T08_ISA_System.md` | ISA System 是 Algorithm 的核心 data model |

---

## 與 Life-OS 的借鑒點

### 值得借鑒的設計

**1. 版本化設計（Algorithm 的版本哲學）**
Algorithm 的版本不是「功能開關」，而是「語境快照」——每個 vX.Y.Z.md 是完整、可獨立運行的 doctrine，LATEST 指針解決了「當前版本是什麼」的問題。Life-OS 的文件系統目前缺乏這種版本意識。

**2. 回滾機制**
單一指針（LATEST）+ 單一引用點（CLAUDE.md）+ hooks 不解析版本號（只解析 frontmatter）= 物理上不可能版本漂移。遷移命令永遠是原子性的三行。

**3. BPE 收斂原則**
演算法從 v5 到 v6 不是功能膨脹，而是約束收緊——每次版本都移除多餘的表示層（tags、count floors、category percentages），保留操作層。這與 Life-OS 的「document role 是神聖的」原則高度共鳴。

**4. 封閉列舉 + 審計 gate**
v6.3.0 的 phantom capability = CRITICAL FAILURE 機制，防止了在能力選擇上的自我安慰。對於 Life-OS 的 task_plan.md 狀態標記（⬜/🟡/🔴/✅），這個模式提示：當狀態不是嚴格由外部事件觸發時，AI 容易自我標記。

**5. 子協定分離**
ideate-loop.md 和 optimize-loop.md 是獨立的協議文件，不是 doctrine 的附錄。這種「核心簡單、擴展分離」的架構讓學習曲線更平坦。

### 需要注意的設計

**1. T4.4 模式風險**
Algorithm 依賴 `phase: complete` 和 ISC 的 `[ ]`→`[x]` 狀態轉換來記錄完成。如果 context compaction 發生在狀態寫入之前，任務會被標記為完成但無實際內容。Algorithm 的解決方案是 CheckpointPerISC hook——每個狀態轉換即時寫入磁盤。

**2. 確認門（Confirmation Gate）**
Algorithm 的 ISA 有 HARD tier completeness gate，但「確認」本身依賴用戶的 explicit confirmation——在沒有 user 存在的 cron 環境中，這個 gate 無法正常運作。這解釋了為什麼 T4.4 模式（AI-only synthesis）在 cron job 中是已知的失敗模式。

---

## 檔案清單

1. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/LATEST`
2. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.3.0.md`
3. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/changelog.md`
4. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.2.0.md`
5. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.1.0.md`
6. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.0.0.md`
7. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v5.7.0.md`
8. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/ideate-loop.md`
9. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/mode-detection.md`
10. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/target-types.md`
11. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/parameter-schema.md`
12. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/optimize-loop.md`
13. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/capabilities.md`
14. `~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/eval-guide.md`
