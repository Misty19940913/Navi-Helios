# T08 — ISA System

> 組ID：T08
> 來源：Packs/ISA/**/*, Releases/v5.0.0/.claude/skills/ISA/**/*
> 檔案總數：42
> 採樣分析：15 個（SKILL.md × 2、Workflows × 6、Examples × 3、INSTALL.md、VERIFY.md、README.md × 2）
> 優先級：高（核心元技能系統）

---

## 檔案結構分析

ISA Pack 有兩套幾乎完全相同的檔案結構：

| 位置 | 角色 |
|------|------|
| `Packs/ISA/` | 安裝交付單位（Pack 封裝） |
| `Releases/v5.0.0/.claude/skills/ISA/` |  canonical 來源（真正的技能定義） |

`Packs/ISA/README.md` 是包裝層，說明「 Built from the P5 v5.0.0 release skill」，而 `src/SKILL.md` 才是完整的技能規格。兩個 Workflows 目錄內容完全相同。

典型 ISA Pack 結構：
```
ISA/
├── INSTALL.md          # AI 安裝引導精靈
├── VERIFY.md           # 安裝後驗證清單
├── README.md           # Pack 層級概覽
└── src/
    ├── SKILL.md        # 完整技能規格（214 行）
    ├── Workflows/
    │   ├── Scaffold.md     # 從提示詞生成 ISA
    │   ├── Interview.md    # 互動式問答填補章節
    │   ├── CheckCompleteness.md  # 按 tier 評分 ISA 完整性
    │   ├── Reconcile.md    # 臨時檔案合併回主 ISA
    │   ├── Seed.md         # 從現有專案啟動 ISA
    │   └── Append.md       # 追加 Decisions/Changelog/Verification
    └── Examples/
        ├── canonical-isa.md   # 完整展示範例（BeanLine 市集）
        ├── e1-minimal.md      # E1：90 秒任務
        ├── e3-project.md      # E3：中規模專案
        └── ...（共 12 個範例，覆蓋 E1-E5 × 多領域）
```

---

## 核心機制

### ISA 本質：理想狀態載具

ISA = Ideal State Artifact，是一個「艱難變動解釋」（hard-to-vary explanation）——它用單一文件說清楚：
- 某件事物的理想狀態是什麼
- 如何驗證已達到該狀態
- 理解如何隨時間演進

適用範圍：專案、應用、程式庫、基礎設施、工作階段、藝術創作、策略決策。

### 十二章節主體（順序固定）

| # | 章節 | 用途 | 撰寫階段 |
|---|------|------|---------|
| 1 | Problem | 現在什麼壞了，使理想狀態值得追求 | OBSERVE |
| 2 | Vision |  Euphoric surprise——體驗意圖 1-5 句 | OBSERVE |
| 3 | Out of Scope | Anti-vision——明確排除的範圍 | OBSERVE |
| 4 | Principles | 基於原則（Deutsch  reach）——思考必須遵守的真理 | OBSERVE |
| 5 | Constraints | 約束條件——約束解決方案空間的不可動搖架構命令 | OBSERVE |
| 6 | Goal | 艱難變動脊椎——1-3 句命名可驗證的完成狀態 | OBSERVE |
| 7 | Criteria | ISC（理想狀態標準）——每個都是單一二元工具探針，含 `Anti:` 派生標準 | OBSERVE→EXECUTE |
| 8 | Test Strategy | 每個 ISC 的驗證方式 | OBSERVE/PLAN |
| 9 | Features | 工作分解 | PLAN |
| 10 | Decisions | 時間戳決策日誌，含死胡同 | 任何階段 |
| 11 | Changelog | 猜測/反駁/學習/標準現在——Deutsch 錯誤更正軌跡 | LEARN |
| 12 | Verification | 每個 ISC 通過的證據——引用命令輸出、檔案內容、截圖路徑 | VERIFY |

### 三 Guardrail 稅則（Principles vs Constraints vs Anti-criteria）

| Guardrail | 綁定對象 | 語氣 | 例子 |
|-----------|---------|------|------|
| Principles | 思考方式 | 渴望、可推廣 |「用戶面系統優先響應速度」 |
| Constraints | 解決方案空間 | 不可動搖 |「不使用自有密碼學——僅透過行業標準函式庫的 OAuth」 |
| Out of Scope | 願景 | 聲明性、明確 |「v1 不含移動原生應用」 |
| Anti-criteria | 測試表面 | 粒狀、可測試 |「Anti: /admin 在 v1 build 返回 200」 |

### Tier 完成度門檻（硬性）

| Tier | 需求章節 | ISC 數量軟下限 |
|------|---------|--------------|
| E1 | Goal, Criteria | — |
| E2 | Problem, Goal, Criteria, Test Strategy | ≥16 |
| E3 | Problem, Vision, Out of Scope, Constraints, Goal, Criteria, Features, Test Strategy | ≥32 |
| E4 | 全部十二章節 | ≥128 |
| E5 | 全部十二章節 + BUILD 前執行 Interview | ≥256 |

**專案 ISA 覆蓋規則：** 任何 `<project>/ISA.md` 都需要 E3+ 結構，無論主動任務的 tier 是什麼。臨時 E1 任務不能降級它。

### ISC（理想狀態標準）

每個 ISC 是一個**單一二元工具探針**。ISC 格式：
- `[ ] ISC-N: <描述>` — 未完成
- `[x] ISC-N: <描述>` — 已通過

**分割測試（Splitting Test）**——以下情況必須分割：
- 「And」/「With」連接兩個可驗證事物
- 獨立失敗——A 部分可通過但 B 部分失敗
- 範圍詞——「全部」「每個」「完整」
- 領域邊界——跨 UI/API/data/logic
- 無可命名探針——無法說出用哪個工具驗證它

**ISC ID 穩定性規則（關鍵）：** ISC 編號**永不在編輯時重新編號**。當分割測試產生更細粒度的 ISC-7 時，保留 ISC-7 作為父項，子項變成 ISC-7.1、ISC-7.2 等。即使 ISC 被放棄，也留一個墓碑（`ISC-7: [DROPPED — see Decisions 2026-04-15]`）。這是因為 Reconcile 流程依賴穩定的 ISC ID。

### 六個 Workflows

| Workflow | 何時觸發 | 核心功能 |
|---------|---------|---------|
| **Scaffold** | `scaffold from prompt` | 從提示詞按 tier 生成新 ISA |
| **Interview** | `interview me on <path>` | 互動式問答填補章節（E5 強制） |
| **CheckCompleteness** | `check completeness of <path> at tier T` | 按 tier 評分，報告缺口 |
| **Reconcile** | `reconcile <ephemeral> → <master>` | 臨時特徵檔合併回主 ISA |
| **Seed** | `seed <project-path>` | 從現有專案 bootstrap ISA |
| **Append** | `append decision/changelog/verification` | 追加到三個僅附加章節 |

### Ephemeral 特徵檔案（關鍵創新）

當一個特徵需要在隔離上下文（Ralph Loop、Maestro）中工作時：
1. `Scaffold --ephemeral` 從主 ISA 產生一個派生視圖（僅包含該特徵相關的 Vision、Goal、Constraints、ISC、Test Strategy）
2. Worker 在臨時檔案上操作
3. 完成後，`Reconcile` 通過穩定的 ISC ID 將檢查標記、驗證證據、決策條目合併回主 ISA
4. 臨時檔案存檔至 `_ephemeral/.archive/`

**關鍵約束：** 臨時檔案是派生視圖，**永遠不是真相來源**。嚴禁從臨時檔案手動編輯主 ISA。

### CheckCompleteness 評分輸出格式

```yaml
status: pass | fail
tier: E4
required_sections:
  Problem: present
  Vision: thin          # ≤1 句
  Out of Scope: missing
  Principles: present
  ...
gaps:
  - section: Out of Scope
    severity: hard
    reason: required at E4, missing entirely
isc_quality:
  total: 24
  tier_floor: 128
  under_floor: true
  granularity_violations: 0
  anti_criteria_count: 2
  id_stability_violations: 0
```

### Append 的 Deutsch C/R/L Changelog 格式（專利創新）

```yaml
- YYYY-MM-DD | conjectured: <我們相信的>
  refuted by: <打破信念的證據>
  learned: <證據教會了我們什麼>
  criterion now: <因此新增/變更/刪除了哪個 ISC>
```

四件套格式**不可協商**。缺少任何一件都會被 Append 流程拒絕。這是避免格式漂移的守門機制。

---

## 與其他 Packs 的差異

| 比較對象 | 差異維度 |
|---------|---------|
| vs CreateSkill | CreateSkill 創建新技能；ISA 為任何類型的工作（專案/任務/創作）提供元框架 |
| vs Fabric | Fabric 是 Prompt 模式庫；ISA 是「完成狀態」定義系統 |
| vs Interview（ISA 自己的 Workflow） | Interview 是 ISA 內的工作流；對比 Packs/Interview 是獨立的訪談系統 |
| vs Algorithm | Algorithm 調用 ISA（OBSERVE 階段）；ISA 是 Algorithm 操作的工件 |

---

## 與 Life-OS 的借鑒點

### 可直接採用的設計

**1. 理想狀態定義的「艱難變動」原則**
Life-OS 目前有 task_plan.md、findings.md 等文件，但缺乏一個**單一文件完整定義「完成」**的機制。ISA 的十二章節結構（Problem→Verification）提供了一個可映射的框架：
- `task_plan.md` 可類比為 ISA 的 Goal + Criteria + Features
- `findings.md` 類比為 ISA 的 Problem 分析 + Decisions 日誌
- `progress.md` 類比為 ISA 的 Changelog（但 ISA 的 C/R/L 格式更有結構）

**2. ISC 概念的二元探針設計**
ISA 的每個 ISC 都是一個**可被工具驗證**的二元陳述。這與 Life-OS 當前的 task 追蹤（⬜/🟡/🔴/✅）相比，提供了更精確的完成定義。可以考慮在 task_plan.md 中引入 ISC 風格的二元探針描述。

**3. Anti-criteria 的負向驗證設計**
「Anti: X 不應該發生」作為獨立的驗證維度，這是 Life-OS 目前缺乏的。例如：「Anti: 這個文件被创建后 30 天內完全无人查看」可以作為存檔決策的觸發條件。

**4. Decisions 的時間戳日誌 + ❌ DEAD END 標記**
```
- YYYY-MM-DD HH:MM: ❌ DEAD END: Tried <X> — failed because <Y> (don't retry)
```
這種死胡同追蹤對 Life-OS 很有價值——避免在已知的失敗方向上重複投入。

**5. ID 穩定性作為合併前提**
ISA 的 Reconcile 流程基於「ISC ID 永不重新編號」——這是避免「代碼偏離規格」問題的關鍵。如果未來 Life-OS 引入多agent 並行工作，ID 穩定性同樣重要。

**6. Tier 覆蓋門檻概念**
ISA 有 E1-E5 的複雜度覆蓋，Life-OS 可以類比：簡單任務（如單一筆記整理）對應 E1；複雜的跨 vault 研究對應 E4/E5。

### 借鑒時的調整建議

- ISA 是獨立的技能系統；Life-OS 更像是一個應用 ISA 框架的「範例專案」
- ISA 的 Example 矩陣（E1-E5 × code/art/design/ops/enterprise）值得對應到 Life-OS 的任務複雜度參考
- ISA 的 Voice Notification 機制（`curl localhost:31337/notify`）是 PAI 生態專用，不適用於 Life-OS

---

## 檔案清單

以下為本報告分析的檔案完整路徑：

**Packs/ISA/**
```
Packs/ISA/INSTALL.md
Packs/ISA/README.md
Packs/ISA/VERIFY.md
Packs/ISA/src/SKILL.md
Packs/ISA/src/Workflows/Scaffold.md
Packs/ISA/src/Workflows/Interview.md
Packs/ISA/src/Workflows/CheckCompleteness.md
Packs/ISA/src/Workflows/Reconcile.md
Packs/ISA/src/Workflows/Seed.md
Packs/ISA/src/Workflows/Append.md
Packs/ISA/src/Examples/canonical-isa.md
Packs/ISA/src/Examples/e1-minimal.md
Packs/ISA/src/Examples/e3-project.md
```

**Releases/v5.0.0/.claude/skills/ISA/**（結構與 Packs/ISA/src 完全相同）
```
Releases/v5.0.0/.claude/skills/ISA/SKILL.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Scaffold.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Interview.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/CheckCompleteness.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Reconcile.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Seed.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Append.md
Releases/v5.0.0/.claude/skills/ISA/Examples/canonical-isa.md
Releases/v5.0.0/.claude/skills/ISA/Examples/e1-minimal.md
Releases/v5.0.0/.claude/skills/ISA/Examples/e3-project.md
```

**相關其他報告引用：**
- T19_CreateSkill_Pack.md（CreateSkill 是建構新技能的技能；ISA 是建構任何事物的通用框架）
- T12_ALGORITHM.md（Algorithm 在 OBSERVE 階段調用 ISA技能）
