# T08 — ISA System

> 組ID：T08
> 來源：Packs/ISA/**/*, Releases/v5.0.0/.claude/skills/ISA/**/*
> 檔案總數：43
> 採樣分析：18 個
> 優先級：高

---

## 檔案結構分析

ISA System 的檔案呈現高度結構化的一致性，分布在兩地（`Packs/ISA/` 與 `Releases/v5.0.0/.claude/skills/ISA/`），內容幾乎完全相同。

### 目錄結構對照

```
Packs/ISA/                          Releases/v5.0.0/.claude/skills/ISA/
├── README.md                        （無）
├── INSTALL.md                       （無）
├── VERIFY.md                        （無）
├── src/SKILL.md              ←→    SKILL.md（內容完全一致，214行）
├── src/Workflows/
│   ├── Scaffold.md           ←→
│   ├── Interview.md          ←→
│   ├── CheckCompleteness.md  ←→
│   ├── Reconcile.md          ←→
│   ├── Seed.md               ←→
│   └── Append.md             ←→
└── src/Examples/
    ├── canonical-isa.md      ←→    Examples/canonical-isa.md
    ├── e1-minimal.md        ←→    Examples/e1-minimal.md
    ├── e2-backup-verify.md  ←→    Examples/e2-backup-verify.md
    ├── e2-rotate-credential.md ←→  Examples/e2-rotate-credential.md
    ├── e3-essay.md           ←→    Examples/e3-essay.md
    ├── e3-help-redesign.md  ←→    Examples/e3-help-redesign.md
    ├── e3-project.md         ←→    Examples/e3-project.md
    ├── e4-api-migration.md   ←→    Examples/e4-api-migration.md
    ├── e4-brand-identity.md  ←→    Examples/e4-brand-identity.md
    ├── e5-album.md           ←→    Examples/e5-album.md
    ├── e5-desktop-app.md     ←→    Examples/e5-desktop-app.md
    └── e5-enterprise.md      ←→    Examples/e5-enterprise.md
```

**兩地唯一差異：** `Packs/ISA/` 多了 README.md（含 pack metadata + frontmatter `pack-id: pai-isa-v1.0.0`）、INSTALL.md、VERIFY.md，這些是 Pack 封裝所需的元檔，不存在於 Release 的 skill 原生路徑。

**SKILL.md 完全一致：** 兩份 SKILL.md 均為 214 行、17056 位元組，內容相同。

---

## 核心機制

### ISA 的本質

ISA（Ideal State Artifact）是 PAI 系統中最核心的專案規格文件，扮演五重身份：
1. **理想狀態表述**（Ideal State Articulation）
2. **測試試具**（Test Harness）
3. **建構驗證**（Build Verification）
4. **完成條件**（Done Condition）
5. **系統記錄**（System of Record）

其核心哲學：一份「難以變動的解釋」——不是敘述現狀，而是定義那個不可動搖的目標狀態，並讓這個文件同時驅動建構、驗證與記錄。

### 十二區段結構（鎖定 v6.2.0）

| # | 區段 | 目的 | 撰寫階段 |
|---|------|------|----------|
| 1 | `## Problem` | 現狀痛點——為何值得追求理想狀態 | OBSERVE |
| 2 | `## Vision` |  euphoric surprise——1-5 句體驗描述 | OBSERVE |
| 3 | `## Out of Scope` | 反願景——明確排除的範圍 | OBSERVE |
| 4 | `## Principles` | 綁定思考的 substrate-independent 原則 | OBSERVE |
| 5 | `## Constraints` | 綁定解空間的不可動架構限制 | OBSERVE |
| 6 | `## Goal` | 硬脊——1-3 句可驗證的完成狀態 | OBSERVE |
| 7 | `## Criteria` | ISC（Ideal State Criteria）——每條一個二元探測工具 | OBSERVE→EXECUTE |
| 8 | `## Test Strategy` | 每個 ISC 的驗證方法 | OBSERVE/PLAN |
| 9 | `## Features` | 工作分解——滿足哪些 ISC、依賴誰、可否並行 | PLAN |
| 10 | `## Decisions` | 時間戳決策日誌，含 `refined:` 前綴 | 任何階段 |
| 11 | `## Changelog` | Deutsch C/R/L 錯誤修正軌跡 | LEARN |
| 12 | `## Verification` | 通過證據——引用的命令輸出、檔案內容、截圖路徑 | VERIFY |

### 三類守則鑑別

| 類型 | 綁定對象 | 語氣 | 例子 |
|------|----------|------|------|
| **Principles** | 思考方式 | 渴望性、可泛化 | 「用戶面系統優先響應速度」 |
| **Constraints** | 解空間 | 不可動、協商性 | 「不自己寫密碼學——只用 OAuth 業界標準庫」 |
| **Out of Scope** | 願景範圍 | 宣告性、明確 | 「v1 不含行動原生 App」 |
| **Anti-criteria** | 測試表面 | 顆粒化、可測試 | 「Anti: /admin 在 v1 build 返回 200」 |

### 等級完整度門檻（HARD gate）

| 等級 | 必需區段 |
|------|----------|
| E1 | Goal, Criteria |
| E2 | Problem, Goal, Criteria, Test Strategy |
| E3 | Problem, Vision, Out of Scope, Constraints, Goal, Criteria, Features, Test Strategy |
| E4 | 全部 12 區段 |
| E5 | 全部 12 區段 + BUILD 前必須執行 Interview workflow |

專案 ISA（`<project>/ISA.md`）強制最低 E3，不受主動任務等級影響。

### 六個 Workflows

| Workflow | 觸發情境 | 核心功能 |
|----------|----------|----------|
| **Scaffold** | 「scaffold」「create」「generate」、Algorithm OBSERVE | 從 prompt 生成新 ISA，輸出至 `MEMORY/WORK/{slug}/ISA.md` |
| **Interview** | 「interview me」「fill in」「deepen」、E5 強制 | 適應性一對一問答，逐步填充各區段 |
| **CheckCompleteness** | 「check」「audit」「score」、Algorithm OBSERVE/VERIFY | 評分 ISA 是否滿足等級門檻，輸出 pass/fail + gap report |
| **Reconcile** | 「reconcile」「merge ephemeral → master」 | 確定性合併——依 ISC ID 鍵將暫時 feature file 合併回 master ISA |
| **Seed** | 「seed」「bootstrap from this repo」 | 從現有 repository（README、code structure、git commits）引導生成 draft ISA |
| **Append** | 「append decision/changelog/verification」 | 規範寫入 Decisions/Changelog/Verification 三個 append-only 區段 |

### ISC 穩定性規則（核心中的核心）

- **ID 永不改號**：當 Splitting Test 產生更細顆粒的 ISC 時，保留父 ID，新增 `ISC-7.1`、`ISC-7.2`
- **DROPPED ISC 留墓碑**：`- [ ] ISC-N: [DROPPED — see Decisions YYYY-MM-DD]`
- **Reconcile 依賴穩定 ID**：暫時 feature file 的合併以 ID 為鍵；改號會導致合併靜默失敗

### Ephemeral Feature File 機制（支撐 Ralph Loop / Maestro 模式）

```
Scaffold (--ephemeral) → MEMORY/WORK/{slug}/_ephemeral/<feature>.md
     ↓
  Worker agent 操作暫時檔案
     ↓
Reconcile → 合併回 master ISA
     ↓
Archive → _ephemeral/.archive/
```

**原則**：暫時檔案是衍生視圖，不是真理來源；嚴禁從暫時檔案反向修改 master。

### Changelog 的 Deutsch C/R/L 格式

```yaml
- YYYY-MM-DD | conjectured: <我們曾相信的>
  refuted by: <打破這個信念的證據>
  learned: <證據教會我們什麼>
  criterion now: <因此新增/修改/刪除了哪個 ISC>
```

四段式結構是強制的，缺一不可。Append workflow 會拒絕不完整的 C/R/L 條目。

### ISC Splitting Test（顆粒度規則）

每個 ISC 必須滿足「一個二元工具探測」原則。滿足以下任一條件時應拆分：

| 測試 | 拆分時機 |
|------|----------|
| And/With 連接 | 連接兩個可驗證事物 |
| 獨立失敗 | Part A 可通過而 B 失敗 |
| 範圍詞 | 「所有」「每個」「完整」→ 列舉 |
| 領域邊界 | 跨 UI/API/data/logic → 每邊界一個 |
| 無可命名探測 | 說不出哪個工具能驗證它 |

### Examples 分類矩陣

12 個 Examples 覆蓋 Effort × Domain：

| 等級 | Code | Art（需 Antecedent） | Design | Ops | Enterprise |
|------|------|---------------------|--------|-----|------------|
| E1 | e1-minimal | | | | |
| E2 | e2-backup-verify | | | e2-rotate-credential | |
| E3 | e3-project | e3-essay | e3-help-redesign | | |
| E4 | e4-api-migration | | e4-brand-identity | | |
| E5 | e5-desktop-app | e5-album | | | e5-enterprise |

---

## 內容差異分析

### Packs/ISA vs Releases/ISA

| 檔案 | Packs 有 | Releases 有 | 差異 |
|------|----------|-------------|------|
| README.md | ✅ 有（含 pack-id frontmatter） | ❌ 無 | Pack 包裝層差異 |
| INSTALL.md | ✅ 有 | ❌ 無 | Pack 安裝向導 |
| VERIFY.md | ✅ 有 | ❌ 無 | Pack 驗證清單 |
| SKILL.md | ✅ 完全一致 | ✅ 完全一致 | 無差異 |
| Workflows/ | ✅ 完全一致 | ✅ 完全一致 | 無差異 |
| Examples/ | ✅ 完全一致 | ✅ 完全一致 | 無差異 |

### ISA Examples 實例差異

| Example | 等級 | 主題 | ISC 數 | 特色 |
|---------|------|------|--------|------|
| canonical-isa.md | E5 | BeanLine 咖啡 marketplace | 38 | 完整 12 區段 + 真實感 Decisions（含 ❌ DEAD END）× 4 + C/R/L × 4 |
| e1-minimal.md | E1 | `--no-color` CLI flag | 4 | 僅 Goal + Criteria；Out of Scope 等全省略 |
| e5-enterprise.md | E5 | Beacon Health Alliance HIPAA 患者入口 | 68 | 多機構、多區域、FHIR 整合、71 個 Anti-criteria 覆蓋合規面 |

### 同一 Example 的 E5 等級 ISC 數量爭議

canonical-isa.md 的 footer comment 坦率承認：
> 「ISC count 38 is below the E5 floor of 256 — show-your-math: the work surface is genuinely smaller than enterprise scope; the marketplace pattern is well-bounded and over-decomposing into 256 ISCs would manufacture probes that don't reflect real verification needs.」

這是一個有意識的設計取捨——ISA 的作者承認了地板數字的虛胖問題。

---

## 與 Life-OS 的借鑒點

### 直接適用的設計

1. **ISA 格式作為專案心臟**
   Life-OS 的每個 project 筆記幾乎都有 `## Goal`（目標），但從未有過如此嚴格的完整度門檻與 ISC 機制。可以借鑒「Problem → Vision → Goal → Criteria」的區段鏈，特別是 `Out of Scope` 與 `Anti-criteria` 的設計，能有效防止專案範圍蔓延。

2. **ISC 的二元探測原則**
   「每個 ISC 是一個工具可以探測的二元狀態」——這個原則可以應用於 Life-OS 的任務完成判定。一個 task 不是「做完了」而是「有沒有通過這個具體探測」。

3. **Tier Completeness Gate**
   任務複雜度決定文件深度——E1 只需 Goal + Criteria，E5 需要全部 12 區段。Life-OS 可以建立類似的「快速任務 vs 深度專案」的門檻機制，不需要每件事都寫完整規格。

4. **Decisions 日誌 + Changelog C/R/L**
   記錄「做了什麼決定、為什麼、什麼時候推翻了」是長期專案知識管理的核心。Life-OS 目前沒有這個機制，這是個高價值借鑒。

5. **Seed Workflow 從 README 引導**
   給一個 existing repository 就自動生成 draft ISA——這個想法類似「從現有專案文件反向建構規範」，對 Life-OS 的 legacy 專案整理很有用。

### 需要調整才能適用的設計

1. **ISC 顆粒度對日常任務過重**
   E2 的最低地板是 16 個 ISCs。Life-OS 的日常 5 分鐘任務顯然不需要這個量級。可以簡化為「2-4 個快速 Criteria」而非全文嚴格 12 區段。

2. **Anti-criteria 的安全屬性**
   PAI 的 Anti-criteria 大量用於安全審計（HIPAA、BAA、隱私），Life-OS 的應用場景不需要這個密度，但「防止範圍蔓延」這個用途仍適用。

3. **Voice Notification 前置要求**
   每個 workflow 都要求先發 curl 通知——這是針對 PAI 的 DA 語音系統設計的，Life-OS 沒有這個系統，需要移除或替換為適合的通知機制。

### 最值得移植到 Life-OS 的三個概念

1. **Out of Scope 明確聲明**（比 TODO 更精確）：明確說「這個版本不做什麼」比泛泛的 TODO list 更能防止範圍蔓延
2. **C/R/L Changelog**：每次認知升級都有「曾相信什麼→被什麼反駁→學到什麼→現在的標準是什麼」的軌跡
3. **Tier 分級文件深度**：小任務用輕量格式，大專案用完整格式，而不是對所有任務一視同仁

---

## 關聯檔案

- **T07 — Packs 安裝驗證**：ISA Pack 本身的安裝驗證流程（INSTALL.md + VERIFY.md）
- **T03 — v5.0.0 skills SKILL.md**：ISA 在 Release 中的原生形式
- **T04 — Workflows MD**：所有 Packs 的 Workflows 集合，ISA 是其中之一
- **T12 — ALGORITHM.md**：ISA 與 Algorithm 的深度整合——Algorithm 在 OBSERVE/PLAN/LEARN 階段調用 ISA
- **T09 — Interview System**：Interview workflow 與 ISA Interview workflow 的對照
- **T11 — Memory System**：ISA 檔案路徑 `MEMORY/WORK/{slug}/ISA.md` 的來源

---

## 檔案清單

```
Packs/ISA/INSTALL.md
Packs/ISA/README.md
Packs/ISA/VERIFY.md
Packs/ISA/src/SKILL.md
Packs/ISA/src/Workflows/Append.md
Packs/ISA/src/Workflows/CheckCompleteness.md
Packs/ISA/src/Workflows/Interview.md
Packs/ISA/src/Workflows/Reconcile.md
Packs/ISA/src/Workflows/Seed.md
Packs/ISA/src/Workflows/Scaffold.md
Packs/ISA/src/Examples/canonical-isa.md
Packs/ISA/src/Examples/e1-minimal.md
Packs/ISA/src/Examples/e5-enterprise.md
Releases/v5.0.0/.claude/skills/ISA/SKILL.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Append.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/CheckCompleteness.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Interview.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Reconcile.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Seed.md
Releases/v5.0.0/.claude/skills/ISA/Workflows/Scaffold.md
Releases/v5.0.0/.claude/skills/ISA/Examples/canonical-isa.md
Releases/v5.0.0/.claude/skills/ISA/Examples/e1-minimal.md
Releases/v5.0.0/.claude/skills/ISA/Examples/e5-enterprise.md
```
