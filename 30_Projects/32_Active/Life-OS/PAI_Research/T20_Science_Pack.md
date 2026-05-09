# T20 — Science Pack

> 組ID：T20
> 來源：`Packs/Science/**/*`, `Releases/v5.0.0/.claude/skills/Science/**/*`
> 檔案總數：35
> 採樣分析：14 個
> 優先級：高 — 科學方法論是 PAI 的元技能（meta-skill）

---

## 檔案結構分析

Science Pack 採用**雙發佈結構**：
- **Pack 版** (`Packs/Science/`)：終端用戶直接使用的完整版，包含 `src/` 下的完整技能碼
- **Release 版** (`Releases/v5.0.0/.claude/skills/Science/`)：與 v5.0.0 捆綁的鏡像，內容相同

兩者結構一致：

```
Science/
├── SKILL.md                    # 主入口（前端 + 觸發關鍵詞）
├── src/
│   └── SKILL.md                # 詳細技能定義（完整內容）
├── METHODOLOGY.md              # 各階段深度說明（615行）
├── Protocol.md                 # 協定介面定義（其他技能如何「實現」Science）
├── Templates.md                # 目標/假設/實驗/結果範本
├── Examples.md                 # 微/中/宏三規模的工作範例
├── INSTALL.md                  # AI 安裝向導
├── VERIFY.md                   # 安裝驗證清單
└── Workflows/
    ├── DefineGoal.md           # 目標定義工作流
    ├── GenerateHypotheses.md   # 假設生成工作流（最少3個）
    ├── DesignExperiment.md     # 實驗設計
    ├── MeasureResults.md        # 測量結果
    ├── AnalyzeResults.md       # 分析結果
    ├── Iterate.md              # 迭代
    ├── FullCycle.md            # 完整循環（Level 3 研究級）
    ├── QuickDiagnosis.md        # 快速診斷（15分鐘規則，Level 1）
    └── StructuredInvestigation.md  # 結構化調查（複雜多因素）
```

**結構特徵：**
- **分層設計**：QuickDiagnosis（Level 1）→ 標準工作流（Level 2）→ FullCycle（Level 3 研究級）
- **雙入口**：SKILL.md 是觸發入口，src/SKILL.md 是深度定義
- **協定化設計**：非服務呼叫，而是其他技能「實現」Science 協定（類似 TCP/IP 的分層哲學）

---

## 內容差異分析

### Pack 版 vs Release 版

| 特性 | Pack 版 | Release 版 |
|------|---------|-----------|
| SKILL.md | 完整內容（207行） | 鏡像相同 |
| src/SKILL.md | 詳細技能碼 | 鏡像相同 |
| README.md | Pack 包裝說明 + 安裝向導 | 無此檔 |
| Workflows/ | 完整 9 個工作流 | 完整 9 個工作流 |
| 版本標記 | `pack-id: pai-science-v1.0.0` | 無 pack-id |

### METHODOLOGY.md 結構差異

| 版本 | 行數 | 內容 |
|------|------|------|
| Pack | 615行 | 完整 Phase 0-7 深度說明，含 Example Goal Specifications |
| Release | 未讀取 | 推測相同 |

### 關鍵內容對比

| 檔案 | 核心訊息 |
|------|----------|
| **SKILL.md** | 科學方法是 универсальный 元技能；7 個核心工作流 + 2 個診斷捷徑；集成 Council/Evals/Development/RedTeam |
| **METHODOLOGY.md** | Phase 0-7 各階段深度探討；Goal Quality Checklist；Hypothesis Quality Checklist；Experiment Quality Checklist |
| **Protocol.md** | **核心洞察**：Science 不是被呼叫的服務，而是其他技能實現的協定；TypeScript 介面定義；各技能（Development/Evals/Council/Worktree/RedTeam）的 Science mapping |
| **Templates.md** | Goal/Hypothesis/Experiment/Results 四種範本，含完整版和快速版 |
| **Examples.md** | Quick Debug（TDD, 5-10分鐘）→ Feature Experiment（A/B測試, 2週）→ Prompt Iteration（Evals, 2小時） |
| **Workflows/FullCycle.md** | 研究級方法論（396行）：Research Protocol 設計 → Pre-Registration → Hypothesis + Devil's Advocate → 實驗設計（含 Power Analysis）→ 執行審計 → 統計分析 → 與 Pre-Registered Goals 比對 |
| **Workflows/QuickDiagnosis.md** | Level 1 科學（155行）：2-3 分鐘極簡流程；最小可行科學；Anti-Pattern 是「隨機試錯」vs「結構化診斷」 |

---

## 核心機制

### 1. 科學方法即元技能（Meta-Skill）

Science 不是一個被其他技能「呼叫」的服務，而是**所有技能都「實現」Science 協定**。

```
Development + Science → TDD 循環
Evals + Science → Prompt A/B 測試
Council + Science → 多角度辯論決策
Worktree + Science → 平行實驗工作流
RedTeam + Science → 32 角度壓力測試
```

### 2. 假設多元性原則（Minimum 3）

單一假設測試 = 確認偏誤。Science 強制要求：
- 最小 3 個假設
- 每個假設必須有**證偽標準**（「如果這個假設錯了，觀察到什麼？」）
- 假設必須有明確的測試代價

### 3. 規模分層

| 等級 | 循環時間 | 協定隱含程度 | 狀態管理 |
|------|----------|--------------|----------|
| **Micro** | 秒-分鐘 | 隱含（內化） | 無 |
| **Meso** | 小時-天 | 明確（卡住時 explicit） | `.science/` 目錄 |
| **Macro** | 週-月 | 正式文件化 | 全域註冊表 |
| **Meta** | 月-年 | 憲法層級 | 技能版本控制 |

### 4. Pre-Registration 原則

定義成功標準**在收集證據之前**，防止確認偏誤和移動球門柱。

### 5. 虛無假設總是存在

「也許沒有問題」或「現狀已是最優」永遠是候選假設之一。

### 6. 雙捷徑工作流

- **QuickDiagnosis**：15 分鐘規則，2-3 分鐘執行，防止在小問題上浪費時間
- **StructuredInvestigation**：複雜多因素問題的完整結構化調查

### 7. 與其他技能的雙向整合

```
Science → Evals：當遇到 prompt 優化時，直接委派 Evals
Evals → Science：3 次迭代無改善 → 升級到明確 Science 工作流
Science 協調：跨領域問題（code + prompt + research）時 explicit 協調
```

### 8. 自引用屬性

Science 可以用科學方法改進自己：追蹤實驗結果 → 提出方法論變體 → 應用變體到實際問題 → 測量學習率/成功率/迭代速度 → 更新 Science 文件

---

## 關聯檔案

| 相關類型報告 | 關係 |
|-------------|------|
| T03 — Claude Skills SKILL.md | Science 是所有技能的元技能底層 |
| T04 — Workflows MD | Science 的 Workflows 與 Workflow MD 有層級關係 |
| T17 — Council Pack | Council 實現 Science 協定，用於假設驗證 |
| T18 — Research Pack | Research 實現 Science 協定 |
| T19 — CreateSkill Pack | CreateSkill 涉及技能創作，可能與 Science 自改進相關 |
| T22 — Thinking Skills (FirstPrinciples, RedTeam, RootCauseAnalysis) | RedTeam 實現 Science 協定用於壓力測試；RootCauseAnalysis 將 Science 應用於失敗調查 |

---

## 與 Life-OS 的借鑒點

### 1. 研究文件架構的類比

Science 的分層方法論與 Life-OS 研究文件架構高度類比：

| Science 階段 | Life-OS 文件角色 |
|-------------|-----------------|
| Goal (Phase 0) | task_plan.md 的目標定義 |
| Observe (Phase 1) | findings.md 的研究背景 |
| Hypothesize (Phase 2) | findings.md 的方向參考（⬜ 未確認） |
| Experiment (Phase 3-4) | progress.md 的實驗記錄 |
| Measure (Phase 5) | progress.md 的量化指標 |
| Analyze (Phase 6) | findings.md 的確認決策 |
| Iterate (Phase 7) | task_plan.md 的下一循環 |

**關鍵借鑒**：Life-OS 的「確認門」機制（使用者明確選擇才能標記 ✅）對應 Science 的「Pre-Registration + 客觀分析」—— 防止 AI 自己決定什麼是「成功」。

### 2. Hypothesis Plurality → 多角度研究

Science 要求最少 3 個假設，避免單一路徑依賴。這對應 Life-OS 研究中的「多方向參考」（⬜ Direction Reference）—— 在確認之前，必須呈現多個選項。

### 3. 規模分層 → 研究規模適配

| Science 規模 | Life-OS 對應 |
|-------------|-------------|
| Micro（分鐘，TDD） | 單一技能/工具研究 |
| Meso（小時-天，功能驗證） | 單一 Pack 或類型報告 |
| Macro（週-月，MVP） | 完整 PAI 研究專案 |

### 4. QuickDiagnosis 捷徑 → 快速診斷模式

15 分鐘規則與 Life-OS 的「快速確認」需求類似——當研究陷入隨機試錯時，需要結構化診斷。

### 5. 自引用改進 → 研究方法論進化

Science 能用科學方法改進自己。Life-OS 研究文件架構也應該有類似的進化機制——當發現新的研究模式時，更新 `research-document-architecture` 技能本身。

### 6. Protocol 設計 vs 服務設計

Science 的核心洞察：「**不是呼叫服務，而是實現協定**」。這與 Life-OS 文件架構的原則一致——不是定義一個中央統治文件，而是每個文件「實現」自己的角色責任。

---

## 檔案清單

以下為本組採樣分析的所有檔案：

```
Packs/Science/src/SKILL.md
Packs/Science/src/METHODOLOGY.md
Packs/Science/src/Protocol.md
Packs/Science/src/Templates.md
Packs/Science/src/Examples.md
Packs/Science/README.md
Packs/Science/src/Workflows/DefineGoal.md
Packs/Science/src/Workflows/GenerateHypotheses.md
Packs/Science/src/Workflows/FullCycle.md
Packs/Science/src/Workflows/QuickDiagnosis.md
Packs/Science/INSTALL.md
Packs/Science/VERIFY.md
Releases/v5.0.0/.claude/skills/Science/SKILL.md
Releases/v5.0.0/.claude/skills/Science/METHODOLOGY.md
Releases/v5.0.0/.claude/skills/Science/Protocol.md
Releases/v5.0.0/.claude/skills/Science/Templates.md
Releases/v5.0.0/.claude/skills/Science/Examples.md
Releases/v5.0.0/.claude/skills/Science/Workflows/DefineGoal.md
Releases/v5.0.0/.claude/skills/Science/Workflows/FullCycle.md
Releases/v5.0.0/.claude/skills/Science/Workflows/QuickDiagnosis.md
Releases/v5.0.0/.claude/skills/Science/Workflows/GenerateHypotheses.md
```
