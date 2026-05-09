# T12 — Algorithm v6.3.0

> 組ID：T12
> 來源：{["Releases/v5.0.0/.claude/PAI/ALGORITHM/**/*","ALGORITHM.md"]}
> 檔案總數：14
> 採樣分析：14 個（100%）
> 優先級：高

---

## 檔案結構分析

ALGORITHM 目錄為版本化文件系統，以版本號為主軸縱向組織。所有檔案均為 Markdown 格式，分為三大類：

| 類型 | 檔案 | 規模 |
|------|------|------|
| **版本準則（Doctrine）** | `vX.Y.Z.md`（v5.7.0 / v6.0.0 / v6.1.0 / v6.2.0 / v6.3.0） | 大型（600-800行） |
| **附屬協定（Protocol）** | `ideate-loop.md`、`optimize-loop.md`、`mode-detection.md`、`target-types.md` | 中型（92-479行） |
| **參考文件（Reference）** | `parameter-schema.md`、`capabilities.md`、`eval-guide.md`、`changelog.md` | 中型（136-246行） |
| **元資料** | `LATEST`（純文字：6.3.0） | 極小（1行） |

**版本準則的內部結構高度一致**（每版皆然）：
- 第一段：`Doctrine`（閱讀優先，內部化）
- 第二段： Effort Levels（5 級的預算 / ISC 門檻 / Capability 門檻）
- 第三段： ISA 作為 System of Record 的約定
- 第四段： ISC Quality System（Granularity Test、分裂規則、Anti-criterion / Antecedent 命名慣例）
- 第五段： Execution（7 段式流程：OBSERVE → THINK → PLAN → BUILD → EXECUTE → VERIFY → LEARN）
- Voice Announcements（段轉換時的 curl 通知）

---

## 內容差異分析

### 版本演進對照表

| 面向 | v5.7.0 | v6.0.0 | v6.1.0 | v6.2.0 | v6.3.0 |
|------|--------|--------|--------|--------|--------|
| **核心機制** | ISA 為 task ISA 單一模式 | 引入 Project ISA（`<project>/ISA.md`） | 基本不變 | 引入 Ideate Loop Protocol 與 Optimize Loop Protocol 分離 | 封閉枚舉 thinking capabilities，解決 field regression |
| **ISC 門檻** | E2≥16, E3≥32, E4≥128, E5≥256 | 同左 | 同左 | 同左 | 同左 |
| **Capability 門檻** | 無（模型自選） | **新增**：E1 0-1, E2≥3, E3≥6, E4≥8(≥6 thinking+≥2 delegation), E5≥12(≥8 thinking+≥4 delegation) | 同 v6.0.0 | 同 v6.0.0 | 同 v6.0.0 |
| **Escalation Gate** | 無 | **新增**（regex 觸發，5 類觸發器，fail-open） | 同 v6.0.0 | Fast-path whitelist 白名單制（E1 專用） | 同 v6.2.0 |
| **Ideate Mode** | 無 | 無 | **新增** Ideate Loop Protocol | 同 v6.1.0 | 同 v6.2.0 |
| **Optimize Mode** | 無 | 無 | **新增** Optimize Loop Protocol | v2：新增 MAD Confidence Gating | 同 v6.2.0 |
| **Voice** | 每段 curl 通知 | 同左 | 同左 | 同左 | 同左 |
| **Forge/April** | Forge 存在 | Forge + Anvil 雙制作者 | 同 v6.0.0 | 同 v6.0.0 | 同 v6.0.0 |
| **Cato (跨廠商審計)** | 無 | E4/E5 VERIFY 階段強制 | 同 v6.0.0 | 同 v6.0.0 | 同 v6.0.0 |
| **ISC 命名** | `ISC-A-N` 雙命名空間 | 廢除 `-A-`，改為純 `ISC-N` 流水號 | 同 v6.0.0 | 同 v6.0.0 | 同 v6.0.0 |

### v6.3.0 的關鍵修正（相較 v6.2.0）

根據 `changelog.md`，v6.3.0 是**thinking-capability vocabulary 的封閉枚舉修正版**：

**問題**：當 Principal 要求在 E2+ 使用特定 thinking skills 時（FirstPrinciples、IterativeDepth、ApertureOscillation 等），DA 傾向生成發明性標籤（「decomposition」、「tradeoff analysis」）而非選用真實的 canonical 名稱。

**根因**：v6.2.0 準則指向 `capabilities.md` 中的表格，但準則本身未列出封閉枚舉，且在 OBSERVE→THINK 邊界無 name-vs-table 檢查。

**修復**：
1. `v6.3.0.md` 內文中直接印出 19 個 thinking capabilities 的完整枚舉（不可虛構）
2. 在 OBSERVE→THINK 邊界新增 `name-vs-table check`

---

## 核心機制

### 1. ISA 單一共元五重身（v6 起）

ISA 是 Algorithm 的核心抽象，同時承載五種身份：

```
1. Ideal State Articulation（Deutsch hard-to-vary 說明）
2. Test Harness（ISC = 測試，含命名探針）
3. Build Verification（通過 ISC = 驗證成功）
4. Done Condition（所有 ISC 通過 = 任務完成）
5. System of Record（與 thing 共存的生命週期文檔）
```

**Project ISA**：`<project>/ISA.md`（適用於有持續身份的應用、CLI、庫）
**Task ISA**：`MEMORY/WORK/{slug}/ISA.md`（適用於一次性工作）

### 2. Effort Tier 系統（5 級）

| 等級 | 代號 | 預算 | ISC 門檻（軟） | Capability 門檻 |
|------|------|------|----------------|----------------|
| Standard | E1 | <90s | 無 | 0-1 |
| Extended | E2 | <3min | ≥16 | ≥3 |
| Advanced | E3 | <10min | ≥32 | ≥6 |
| Deep | E4 | <30min | ≥128 | ≥8（含 ≥6 thinking + ≥2 delegation） |
| Comprehensive | E5 | <120min+ | ≥256 | ≥12（含 ≥8 thinking + ≥4 delegation） |

**Capability 命名 = 約束性承諾**：選擇某 capability 必須實際透過 `Skill()` 或 `Agent()` 工具呼叫，純文字列舉屬 CRITICAL FAILURE。

### 3. 7 段式執行流程

```
OBSERVE（意圖迴聲 + 逆向工程 + 預檢閘 + 能力選擇 + ISC 撰寫）
   ↓
THINK（風險假設 + 前置 mortem + 知識檢查 + Euphoric Surprise 預測）
   ↓
PLAN（範圍規劃 + 交付清單 + 反饋諮詢 + 委派閘 + 並行性掃描）
   ↓
BUILD（根因攝入點 checkpoint + Ideate/Optimize 模式加載）
   ↓
EXECUTE（內聯驗證 mandate + CheckpointPerISC鉤子觸發）
   ↓
VERIFY（Live-Probe + Advisor 諮詢 + Cato 跨廠商審計[E4/E5] + ReRead 最終閘）
   ↓
LEARN（學習蒸餾 + phase: complete）
```

### 4. Escalation Gate（v6.0.0 新增）

位於 `UserPromptSubmit` 鉤子層，regex 驅動的五類觸發器：

| 類別 | 模式 | 最低等級 |
|------|------|---------|
| 教義影響 | `algorithm \| system prompt \| mode selection \| ...` | E4 |
| 架構定位 | `where (in\|does) (our\|the) X (live\|sit\|belong)` | E4 |
| 跨專案 | ≥2 專案名或 `MEMORY/` / `KNOWLEDGE/` 引用 | E3 |
| 軟用戶信號 | `investigate \| design \| audit \| comprehensive \| ...` | E3 |
| 困難變異論 | ≥3 命名實體 + `vs \| versus \| compared to \| tradeoff` | E4 |

**Fail-open**：鉤子錯誤時不阻斷，靜默通過。

### 5. Ideate Mode（9 階段認知循環）

由 `ideate-loop.md` 定義，由 `Ideate` skill 接管 BUILD/EXECUTE：

```
CONSUME → DREAM → DAYDREAM → CONTEMPLATE → STEAL → MATE → TEST → EVOLVE → META-LEARN
```

參數化控制（3 層：Preset → Focus → Individual）:
- `problemConnection`（0-1）：創意與問題的連接強度
- `selectionPressure`（0-1）：淘汰壓力
- `domainDiversity`（0-1）：跨領域多樣性
- `generativeTemperature`（0-1）：夢境噪聲水平
- `mutationRate`（0-1）：進化突變強度
- `ideaVolume`（3-50）：每輪創意數量

Preset 映射：`dream`(0.05) / `explore`(0.25) / `balanced`(0.50) / `directed`(0.75) / `surgical`(0.95)

### 6. Optimize Mode（8 步驟自主循環，v2）

目標類型支援：skill / prompt / agent / code / function

**兩種評估模式**：
- **Metric Mode**：有 `metric_command` → 跑命令取數值
- **Eval Mode**：無命令 → LLM-as-judge，ISC 準則 → 二元判斷

**循環核心**：
```
ASSESS → HYPOTHESIZE → IMPLEMENT → MEASURE → EVALUATE → DECIDE → LOG → ADAPT
```

**MAD Confidence Gating**（v6.2.0 新增）：
- `MAD = median(|score_i - median(all_scores)|)`
- `confidence = |delta| / max(MAD, ε)`
- ≥2.0× → green；1.0-2.0× → yellow（marginal）；<1.0× → red（noise floor）

**Plateau Protocol**：3 級遞增干預（Level 3 可暫停並報告用戶）

**Dead Ends Ledger**：每次 revert 的方法論原因 → 冷啟動恢復燃料

### 7. 思考能力生態（19 項封閉枚舉，v6.3.0）

```
IterativeDepth / ApertureOscillation / FeedbackMemoryConsult / Advisor /
ReReadCheck / FirstPrinciples / SystemsThinking / RootCauseAnalysis /
Council / RedTeam / Science / BeCreative / Ideate / BitterPillEngineering /
Evals / WorldThreatModel / Fabric patterns / ContextSearch / ISA Skill
```

**Forge（GPT-5.4）**：E3/E4/E5 程式碼任務強制自動包含；Anvil（Kimi K2.6）：長上下文跨檔案重構時使用；兩者可並行以取更強 diff。

**Cato（GPT-5.4）**：E4/E5 VERIFY 階段強制跨廠商審計，讀 ISA + artifacts + tool-activity tail，80K token 上限。

### 8. 參數互作網絡

```
Reinforcing pairs（強化）:
  generativeTemperature↑ + domainDiversity↑ → 極度wild
  selectionPressure↑ + problemConnection↑ → 只存活實用目標導向想法
  mutationRate↑ + generativeTemperature↑ → 快速進化

Tension pairs（張力）:
  generativeTemperature↑ + selectionPressure↑ → 瘋狂生成 + 殘酷選擇（wild-but-picky）
  domainDiversity↑ + problemConnection↑ → 多元領域 + 保持目標（forced creative analogies）
  mutationRate↑ + contextCarryover↑ → 激進突變 + 完整記憶（informed metamorphosis）

Anti-patterns:
  ideaVolume↑ + selectionPressure↓ + maxCycles↑ → 無界想法池爆炸
  generativeTemperature↓ + domainDiversity↓ + mutationRate↓ → 全部常規靜態
```

---

## 關聯檔案

| 報告 | 關聯說明 |
|------|---------|
| **T11 — Memory System** | ISC 的持久化載體（Project ISA 寫入 `<project>/ISA.md`），checkpoint 鉤子依賴 `MEMORY/WORK/` |
| **T03 — v5.0.0 Skills SKILL.md** | `capabilities.md` 中引用的 skills（Ideate、Forge、Cato、Science 等）均為獨立的 SKILL.md 文件 |
| **T10 — CLAUDE.md Routing** | ALGORITHM MODE 的 entrance 在 CLAUDE.md 中定義（`MODE: ALGORITHM` → 讀 `ALGORITHM/LATEST` → 加載對應版本） |
| **T09 — ISA System** | ISA 格式規范（`IsaFormat.md`）定義 frontmatter contract，為 Algorithm 的核心資料交換格式 |

---

## 與 Life-OS 的借鑒點

### 可借鑒的設計

**1. ISA 思維的採用**
Algorithm 的核心收斂機制——「以可測試標準描述理想狀態」——正是 Life-OS 的 `TELOS` 四問（Objective / Goal / Key Result / Obstacle / Strategy）所欠缺的形式化。Life-OS 的 Goal setting 缺乏「可驗證的二分法探針」機制，借鑒 Algorithm 的 ISC 粒度規則（split until single binary probe）可讓每日複盤真正做到自動判定完成。

**2. 能力閾值的層級設計**
Algorithm 的 Effort Tier（E1-E5）與 Capability Floor 綁定制，是一種「問題復雜度和投入資源成正比」的剛性約定。Life-OS 目前的 Todo/Project 系統完全缺乏難度感知——任何任務無論大小都同等對待。可以設計一組「任務規模式」（micro / standard / extended / deep），依難度自動配置回顧深度。

**3. MAD 信心度量**
Optimize Loop 中的 MAD（Median Absolute Deviation）信心閾值，用於判斷變化幅度是否「高於會話噪聲」，是一種優雅的「避免過度解讀波動」機制。Life-OS 的 Habit Tracker 或 Mood Pulse 若加入此機制，可過濾掉單日情緒波動而只看有意義的趨勢。

**4. Dead Ends Ledger**
「記錄失敗假說 + 原因」作為冷啟動恢復燃料——避免重蹈覆轍。這是科學方法論（5 Whys / RootCauseAnalysis）的一種輕量實現。Life-OS 的「每週回顧」可以強制要求每次未達成目標的 KRs 寫入 `Dead Ends`，形成可查詢的失敗模式索引。

**5. ReRead Check 最終閘**
VERIFY 階段的 `ReReadCheck`：重新讀取用戶原始請求，逐條對照產出。「82% missed ask」投訴驅動的設計——82% 的失敗來自於「以為懂了但實際沒對準」。Life-OS 的「回應用戶前」若引入此機制（重新敘述用户需求並列點對照），可顯著降低溝通漏斗。

**6. Multi-Agent 生態的分工約定**
Forge / Anvil（程式碼產出）× Cato（跨廠商審計）× Advisor（決策諮詢）× 各思考能力（特定分析維度）——每個 Agent 有明確的觸發條件和职责边界。Life-OS 若建立「子系統代理生態」，需要同樣精確的触发协议，而非泛稱「AI 輔助」。

### 需要注意的

- Algorithm 的設計假設了「DA 是獨立的代理」，而 Life-OS 仍以人為主體——借鑒時需調整「AI 發起」與「人確認」的責任分配比例。
- Algorithm 的 7 段流程對日常 personal 任務過於重型——建議只提取 OBSERVE（意圖確認）和 VERIFY（交付對照）作為強制最小子集。

---

## 檔案清單

```
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/LATEST
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/changelog.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v5.7.0.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.0.0.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.1.0.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.2.0.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/v6.3.0.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/capabilities.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/eval-guide.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/ideate-loop.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/mode-detection.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/optimize-loop.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/parameter-schema.md
~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/ALGORITHM/target-types.md
```
