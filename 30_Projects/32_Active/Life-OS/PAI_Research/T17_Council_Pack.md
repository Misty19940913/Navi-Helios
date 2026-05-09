# T17 — Council Pack

> 組ID：T17
> 來源：Packs/Council/**/*, Releases/v5.0.0/.claude/skills/Council/**/*
> 檔案總數：9（含2個版本重疊）
> 採樣分析：9 個（100% 覆蓋）
> 優先級：7

---

## 檔案結構分析

Council Pack 是 PAI 中最小的 Pack 之一，結構高度精實，無任何子目錄套疊。共 9 個檔案，分兩處落地：

| 檔案 | Packs/ | Releases/ | 用途 |
|:---|:---:|:---:|:---|
| `SKILL.md` | ✅ | ✅ | 技能主定義（兩版本相同） |
| `README.md` | ✅ | ❌ | Pack 層級說明 |
| `INSTALL.md` | ✅ | ❌ | AI 導向安裝精靈 |
| `VERIFY.md` | ✅ | ❌ | 安裝驗證清單 |
| `CouncilMembers.md` | ✅ | ✅ | Agent 組成規則 |
| `RoundStructure.md` | ✅ | ✅ | 三輪辯論結構 |
| `OutputFormat.md` | ✅ | ✅ | 輸出格式模板 |
| `Workflows/Debate.md` | ✅ | ✅ | DEBATE 工作流 |
| `Workflows/Quick.md` | ✅ | ✅ | QUICK 工作流 |

**結構特徵：**
- `src/` 為 Pack 內部實作（SKILL.md + CouncilMembers.md + RoundStructure.md + OutputFormat.md + Workflows/）
- `README.md` 為 Pack 對外的包裝層，指向內部 `src/SKILL.md`
- 核心邏輯全在 `src/SKILL.md` 及其附屬 MD 檔，不涉及任何 TS 程式碼

---

## 內容差異分析

### Packs/Council 與 Releases/v5.0.0/.claude/skills/Council 差異

兩版本幾乎完全相同，差異僅一行：

| 檔案 | Packs 版本 | Releases 版本 |
|:---|:---|:---|
| `SKILL.md` | 137 行（含 Execution Log 段落） | 無 Execution Log（PAI 5.0.0 release 時尚未加入） |
| `README.md` | 44 行 | 無此檔 |

**結論：** Packs/Council 是 current 版（含日後新增的執行日誌），Releases 是 v5.0.0 frozen 版。

---

## 核心機制

### 定位：協作-對抗式辯論系統

Council 的核心定位是「協作-對抗」（collaborative-adversarial）——目的是透過多元觀點的相互碰撞，找出最佳路徑。與 RedTeam 的純對抗（純攻擊）不同，Council 強調：
- **可見的逐輪對話紀錄**（visible round-by-round transcripts）
- **真正的知識摩擦**（genuine intellectual friction）
- **收斂與分歧並陳**（誠實呈現仍存在的分歧）

### 兩種工作流

| | DEBATE | QUICK |
|:---|:---|:---|
| 輪數 | 3 輪（Positions → Responses → Synthesis） | 1 輪 |
| 輸出 | 完整紀錄 + Council Synthesis | 快速立場 |
| 時間 | 40-90 秒 | 15-30 秒 |
|觸發關鍵字 | council, debate, weigh options, pros and cons | quick council, sanity check |

### 自定義 Agent 組成（最關鍵設計）

**嚴禁使用內建 Agent 類型**（Architect、Designer、Engineer、PerplexityResearcher、Silas 等）。所有 Council 成員必須透過 ComposeAgent（Agents Pack 的工具）動態組成，主因為：

1. **領域專業**：每個辯論話題都需要具備該領域知識的自定義 Agent
2. **獨特聲音**：ComposeAgent 為每個成員生成獨特的 voice、personality、traits
3. **真正的分歧**：自定義 Agent 才有辦法產生有意義的知識摩擦

**四個預設視角槽位：**

| 槽位 | 目的 | 範例特質組合 |
|:---|:---|:---|
| Builder | 在該領域有實際建造經驗 | `technical,enthusiastic,systematic` |
| Skeptic | 挑戰假設、找出缺陷 | `[domain],skeptical,meticulous` |
| Pragmatist | 實作現實與取捨 | `technical,pragmatic,analytical` |
| Analyst | 數據、先例、外部證據 | `research,analytical,comparative` |

**重要命題：4-6 個精心設計的 Agent 勝過 12 個泛用 Agent。**

### 三輪辯論結構

```
Round 1：各 Agent 從自身專業視角提出初始立場（平行執行）
Round 2：各 Agent 讀取 Round 1 並直接回應他人觀點（平行執行）
Round 3：各 Agent 識別共識、殘餘分歧、最終建議（平行執行）
→ Council Synthesis：由協調者彙整收斂點與分歧點
```

**時間優化：** 輪內平行（每輪同時呼叫所有 Agent），輪間順序。4 個 Agent × 3 輪 = 12 次呼叫，但只有 3 次順序等待。

### 依賴關係

| 依賴 | 角色 |
|:---|:---|
| Agents Pack（ComposeAgent） | 必要依賴——所有 Council 成員由此組成 |
| RedTeam | 互補——Council 協作討論後可用 RedTeam 做純對抗攻擊 |
| Research | 前置——可先收集脈絡再召開 Council |

### 執行日誌（Execution Log）

SKILL.md 末尾定義了 JSONL 格式的執行日誌寫入機制：
```bash
echo '{"ts":"ISO8601","skill":"Council","workflow":"WORKFLOW_USED","input":"SUMMARY","status":"ok|error","duration_s":SECONDS}' >> ~/.claude/PAI/MEMORY/SKILLS/execution.jsonl
```
這讓每個 Council 執行都有踪可查。

---

## 關聯檔案

| 相鄰報告 | 關係 |
|:---|:---|
| [[PAI_Research/T16_Agents_Pack\|T16 — Agents Pack]] | ComposeAgent 為 Council 的必要依賴 |
| [[PAI_Research/T22_Thinking_Skills\|T22 — Thinking Skills]] | Council 的協作-對抗模式與 SystemsThinking/RedTeam 有重疊定位 |
| [[PAI_Research/T05_Fabric_Patterns\|T05 — Fabric Patterns]] | 兩者都是「模式庫」——但 Fabric 是文本模式，Council 是多 Agent 辯論 |

---

## 與 Life-OS 的借鑒點

### 可借鑒之處

1. **多角色模擬框架**
   Council 的「自定義 Agent + 固定視角槽位 + 結構化多輪對話」模式，可移植為 Life-OS 的「多方意見徵詢」機制。例如在專案決策時，模擬「支持者、反對者、可行性分析師、風險管理師」四個角色的結構化辯論。

2. **確認-對抗區分**
   Council 明確區分「協作-對抗」（Council）與「純對抗」（RedTeam），這個區分值得引進 Life-OS 的決策流程——先多方徵詢（Council），再極限測試（RedTeam）。

3. **可見紀錄 + 明確收斂**
   Council 輸出「可見逐輪紀錄」而非隱藏的內部推理，強調「強迫共識比承認分歧更糟糕」。Life-OS 的决策日誌可借鏡此原則——不只記錄結論，也記錄分歧點。

4. **「4-6 個精心設計勝過 12 個泛用」原則**
   適用於 Life-OS 的任何多角度分析場景——強調質量而非數量。

### 不適用之處

- Council 完全依賴 Agents Pack 的 ComposeAgent 機制，屬於 PAI/CLAUDE Code 的特化功能，無法直接移植到通用環境。
- 語音通知（curl 到 localhost:31337）依賴 PULSE daemon，Life-OS 無對應機制。

---

## 檔案清單

```
~/.hermes/Personal_AI_Infrastructure/Packs/Council/
├── README.md
├── INSTALL.md
├── VERIFY.md
├── src/
│   ├── SKILL.md
│   ├── CouncilMembers.md
│   ├── RoundStructure.md
│   ├── OutputFormat.md
│   └── Workflows/
│       ├── Debate.md
│       └── Quick.md

~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/Council/
├── SKILL.md
├── CouncilMembers.md
├── RoundStructure.md
├── OutputFormat.md
└── Workflows/
    ├── Debate.md
    └── Quick.md
```

**版本差異：** Packs 版本多出 Execution Log 段落及 README.md，Releases 為 v5.0.0 frozen 快照。
