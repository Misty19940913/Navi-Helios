# T22 — Thinking Skills

> 組ID：T22
> 來源：Packs/FirstPrinciples, Packs/RedTeam, Packs/RootCauseAnalysis, Packs/SystemsThinking
> 檔案總數：37
> 採樣分析：22 個核心檔案
> 優先級：🔴 最高

---

## 檔案結構分析

四個 Thinking Skills Pack 構成一個分層的認知工具系統，由淺入深依序為：

| Pack | 層次 | 焦點 | 方法論數量 |
|------|------|------|-----------|
| **FirstPrinciples** | L1 基礎假設挑戰 | 從假設拆解到物理重建 | 3 workflow |
| **RedTeam** | L2 對抗性驗證 | 多角度平行攻擊論點 | 2 workflow |
| **RootCauseAnalysis** | L3 結構化調查 | 事件/缺陷的根本原因分析 | 5 workflow + 2 context |
| **SystemsThinking** | L4 系統結構 | 複雜系統的行為生成結構 | 5 workflow + 3 context |

**共同結構模式：**
- 每個 Pack 都有 `src/SKILL.md` — 頂層描述與觸發條件
- 每個 Pack 都有 `src/Workflows/*.md` — 具體執行步驟
- 每個 Pack 都有 `INSTALL.md / VERIFY.md / README.md` — 標準安裝驗證
- 所有 SKILL.md 都內含「Attribution」區塊 — 說明理論來源
- 所有 SKILL.md 都內含「Integration」區塊 — 說明與其他 Skill 的協作關係

---

## 內容差異分析

### FirstPrinciples vs. RedTeam vs. RootCauseAnalysis vs. SystemsThinking

| 維度 | FirstPrinciples | RedTeam | RootCauseAnalysis | SystemsThinking |
|------|----------------|---------|------------------|-----------------|
| **核心問題** | 「這個假設是對的嗎？」 | 「這個論點能撐過攻擊嗎？」 | 「為什麼會失敗？」 | 「為什麼同樣的問題一直發生？」 |
| **方法論根源** | Elon Musk 物理推理法 | 軍事級對抗分析 | Toyota/ Ishikawa/ Reason/ Kepner-Tregoe | Meadows/ Senge/ Forrester |
| **輸出形態** | 三步框架：解構→挑戰→重建 | Steelman + 8點反論述 | 原因鏈 / 魚骨圖 / 故障樹 | 冰山模型 / 因果環圖 / 系統原型 |
| **觸發條件** | 「這是真正的限制嗎？」 | 「攻擊這個想法」 | 「根本原因是什麼？」 | 「為什麼一直發生？」 |
| **協作方向** | 為 RedTeam 與 RCA 提供假設拆解 | 攻擊 FirstPrinciples 存活下來的論點 | 餵給 SystemsThinking（當同一模式重複出現） | 輸出給 Iceberg / FindArchetype |
| **不適用於** | 事件因果鏈（用 RCA） | 網路安全滲透測試 | 結構性反饋迴圈（用 SystemsThinking） | 根本原因分析（用 RCA） |

### 四個 Pack 的 Workflow 數量差異

| Pack | Workflow 數 | 額外 Context 檔 |
|------|------------|-----------------|
| FirstPrinciples | 3 (Deconstruct, Challenge, Reconstruct) | 0 |
| RedTeam | 2 (ParallelAnalysis, AdversarialValidation) | 2 (Philosophy, Integration) |
| RootCauseAnalysis | 5 (FiveWhys, Fishbone, Postmortem, FaultTree, KepnerTregoe) | 2 (Foundation, MethodSelection) |
| SystemsThinking | 5 (Iceberg, CausalLoop, FindArchetype, FindLeverage, ConceptMap) | 3 (Foundation, Archetypes, LeveragePoints) |

---

## 核心機制

### 1. FirstPrinciples — 三步推理框架

**核心原則：** 物理優先（Physics First）。真正的限制只有來自物理現實的才是不可改變的；政策、選擇、慣例都是 soft constraint，都可以被挑戰。

**三步結構：**
```
Deconstruct  →  Challenge  →  Reconstruct
  (拆解)          (挑戰)          (重建)
```

- **Deconstruct**：將問題拆解到「組成部分」和「基本事實」，區分「被告知的」vs「實際的」
- **Challenge**：將每個陳述分類為 HARD（物理）/ SOFT（選擇）/ ASSUMPTION（未驗證），然後攻擊非物理限制
- **Reconstruct**：只使用 HARD constraints，從零開始建立最優解

**關鍵輸出格式：**
```markdown
## Deconstruction: [Subject]
### Fundamental Truths (Irreducible)
1. [Truth 1 - cannot be decomposed further]
2. [Truth 2 - physics/math/verified fact]
### Key Gaps Identified
| Stated | Actual | Gap |
```

**與其他技能整合：**
- RedTeam 在 Phase 1 使用 FirstPrinciples/Deconstruct 來分解論點
- RedTeam 在 Phase 5 使用 FirstPrinciples/Challenge 來分類假設
- RootCauseAnalysis 用於將貢獻因素分解到基本事實
- SystemsThinking 在分解到公理後，用 SystemsThinking 來看這些公理如何互連

---

### 2. RedTeam — 32 平行代理對抗分析

**核心哲學：** 這不是為了挑剔或反對，而是找出論點邏輯中的根本缺陷——那個一旦被挑戰就會導致整個結構崩潰的假設。

**32 代理陣容：**
- **8 Engineers**：系統思考者、數據需求者、邊角案例獵人、歷史模式匹配者、複雜度現實主義者、依賴追蹤者、失敗模式分析師、技術債務會計師
- **8 Architects**：大局思考者、權衡照明者、抽象質問者、激勵映射者、二階效應追蹤者、整合悲觀主義者、可擴展性懷疑者、可逆性分析師
- **8 Pentesters**：紅隊領導、假設破壞者、賽局理論家、社會工程師、先例尋找者、防禦評估者、威脅建模者、不對稱發現者
- **8 Interns**：天真質問者、類比尋找者、反對者、常识检查者、時代精神读者、簡化倡導者、邊緣王者、惡魔實習生

**五階段協議（ParallelAnalysis）：**
1. **Decomposition**：將論點分解為 24 個原子聲明
2. **Parallel Analysis**：32 個代理同時檢查優點和缺點
3. **Synthesis**：識別趨同洞見
4. **Steelman**：建構最強版本論點（8 點，每點 12-16 字）
5. **Counter-Argument**：最強反駁（8 點，每點 12-16 字）

**AdversarialValidation（三輪協議）：**
- Round 1：三個代理產生競爭提案（Pragmatist / Idealist / Skeptic）
- Round 2：殘酷批評者對每個提案進行「什麼對了/什麼錯了/不舒服的真相」
- Round 3：協作綜合，產生單一優越解決方案

---

### 3. RootCauseAnalysis — 結構化事件調查

**五個核心 Axioms：**
1. 近端原因 ≠ 根本原因
2. 很少只有一個原因
3. 人類不是根本原因（如果人類會犯錯，系統就允許了它）
4. 可操作性是停止條件
5. RCA 是一種偏見對抗

**五個 Workflow 對應五種情境：**

| Workflow | 觸發條件 | 輸出 |
|----------|----------|------|
| **FiveWhys** | 簡單、單線索事件 | 線性/分支因果鏈 |
| **Fishbone** | 多個懷疑類別（6M / 4P） | 魚骨圖 + Pareto 分析 |
| **Postmortem** | 生產事件、安全事件 | 時間線 + 貢獻因素 + 行動項目 |
| **FaultTree** | 安全關鍵、AND/OR 邏輯 | 故障樹 + 最小割集 |
| **KepnerTregoe** | 「在這裡有效但在那裡不行」的微妙缺陷 | IS/IS-NOT 矩陣 + 區分 + 改變 |

**Swiss Cheese 模型應用（Postmortem Phase 4）：**
```
防禦層 1：CI gate — 洞：沒有負載測試
防禦層 2：Canary — 洞：對這個 deploy 沒有使用 canary
防禦層 3：Pre-deploy runbook — 洞：沒有 p99 檢查
防禦層 4：監控 — 洞：alert 評估窗口太長
事件發生於：各層洞同時對齊
```

**行動強度層級（由強到弱）：**
1. Eliminate（消除）：完全移除做錯事的能力
2. Force function（強制函數）：要求另一個步驟阻止錯誤路徑
3. Automation（自動化）：用檢查替換人類警覺
4. Simplify（簡化）：減少做錯的方法
5. Standardize（標準化）：讓正確方式成為默認
6. Training（培訓）：教育人們關於風險
7. Reminder（提醒）：郵件、海報、文件

---

### 4. SystemsThinking — 複雜系統的結構分析

**核心公理：**
1. 行為是由結構產生的
2. 事件是可見的；結構不是
3. 反饋迴圈是基本單位
4. 高槓桿干預通常是反直覺的
5. 你不能優化系統的一部分——只能改善整個系統

**冰山模型（Iceberg）：**
```
Layer 1 — EVENTS（事件）：發生了什麼？（水面上，反應式）
Layer 2 — PATTERNS（模式）：一段時間內的趨勢？（水面下，適應式）
Layer 3 — STRUCTURES（結構）：什麼反饋迴圈/激勵/延遲產生模式？（中期，生成式）
Layer 4 — MENTAL MODELS（心智模型）：什麼假設讓這個結構感覺正確？（最深，變革式）
干預槓桿：隨著下降而增加
```

**Donella Meadows 的 12 個槓桿點（由弱到強）：**
```
LP 12: 常數、參數、數字（最弱）
LP 11: 緩衝區大小
LP 10: 物質 stocks 和 flows 的結構
LP 9: 延遲長度
LP 8: 負（平衡）反饋迴圈的強度
LP 7: 正（增強）反饋迴圈的增益
LP 6: 訊息流結構——誰有資訊訪問權
LP 5: 系統規則——激勵、懲罰、約束
LP 4: 自我組織的權力
LP 3: 系統目標
LP 2: 產出系統的心智模型/範式
LP 1: 超越範式的能力（最強）
```

**十個系統原型（System Archetypes）：**
1. Fixes That Fail（修復失敗）
2. Shifting the Burden（轉移負擔）
3. Limits to Growth（增長極限）
4. Tragedy of the Commons（公地悲劇）
5. Escalation（升級）
6. Success to the Successful（成功走向成功）
7. Drifting Goals（目標漂移）
8. Growth and Underinvestment（增長與投資不足）
9. Accidental Adversaries（意外對手）
10. Policy Resistance（政策抵制）

---

## 關聯檔案

| 相關報告 | 關係說明 |
|----------|----------|
| T01 Root Docs | 這些 Thinking Skills 的存在證明 PAI 是一個以「認知紀律」為核心的系統 |
| T03 v5.0.0 Skills SKILL.md | 這些 Thinking Skills 是在 v5.0.0 釋出時的技能生態系統的一部分 |
| T04 Workflows MD | Thinking Skills 的 Workflows MD 是這四個 Pack 的核心產出 |
| T05 Fabric Patterns | Fabric 的 Pattern 系統可能整合了這些 Thinking 方法 |
| T26 PAI CORE TS | 如果存在認知引擎（Cognitive Engine），這些是它的工具箱 |

---

## 與 Life-OS 的借鑒點

### 1. 系統化思維工具箱

Life-OS 是一個複雜的個人作業系統，可以從這四個 Pack 中獲得的方法論包括：

| 問題類型 | 對應工具 |
|----------|----------|
| 「這個假設是對的嗎？」 | FirstPrinciples/Challenge |
| 「為什麼這個決定一直出問題？」 | RootCauseAnalysis/FiveWhys |
| 「為什麼同樣的問題一直發生？」 | SystemsThinking/Iceberg |
| 「這個論點能撐過攻擊嗎？」 | RedTeam/ParallelAnalysis |
| 「兩個方案哪個更好？」 | RedTeam/AdversarialValidation |
| 「複雜專案為什麼延遲？」 | SystemsThinking/CausalLoop |
| 「資源為什麼一直不夠用？」 | SystemsThinking/Archetypes（Tragedy of the Commons）|

### 2. 認知分工模型

這四個 Pack 構成一個分工明確的認知工廠：

```
FirstPrinciples（假設拆解）
    ↓ 為 RedTeam 提供「硬約束 vs 軟約束」的地圖
RedTeam（對抗性攻擊）
    ↓ 找出存活下來的論點
RootCauseAnalysis（結構化調查）
    ↓ 當同一模式重複時，昇級到
SystemsThinking（系統結構）
    ↓ 產出冰山分析、因果環圖、槓桿點
```

這個分工模型適用於 Life-OS 的任何複雜決策流程。

### 3. 文件責任模型借鑒

RootCauseAnalysis 的「Swiss Cheese Model」和「行動強度層級」可以直接應用於 Life-OS 的錯誤預防：

```
防禦層 1：計畫檢查清單
防禦層 2：每日回顧
防禦層 3：每週反思
防禦層 4：月度複查

行動強度：
- Eliminate：自動化檢查（最強）
- Reminder：事後提醒（最弱）
```

### 4. 可複製的觸發條件語法

每個 Skill 的 SKILL.md 都有一個精確的觸發條件列表。這種語法可以借鑽到 Life-OS 的技能觸發系統中：

```
USE WHEN first principles, fundamental truths, challenge assumptions,
is this a real constraint, rebuild from scratch

USE WHEN red team, attack idea, counterarguments, critique,
stress test, devil's advocate, find weaknesses

USE WHEN root cause, RCA, 5 whys, fishbone, postmortem,
incident analysis, why did this happen

USE WHEN systems thinking, causal loop, feedback loops,
archetypes, leverage points, iceberg model
```

---

## 檔案清單

### FirstPrinciples Pack（7 檔）
- Packs/FirstPrinciples/INSTALL.md
- Packs/FirstPrinciples/README.md
- Packs/FirstPrinciples/VERIFY.md
- Packs/FirstPrinciples/src/SKILL.md
- Packs/FirstPrinciples/src/Workflows/Reconstruct.md
- Packs/FirstPrinciples/src/Workflows/Challenge.md
- Packs/FirstPrinciples/src/Workflows/Deconstruct.md

### RedTeam Pack（7 檔）
- Packs/RedTeam/INSTALL.md
- Packs/RedTeam/README.md
- Packs/RedTeam/VERIFY.md
- Packs/RedTeam/src/Integration.md
- Packs/RedTeam/src/Philosophy.md
- Packs/RedTeam/src/SKILL.md
- Packs/RedTeam/src/Workflows/AdversarialValidation.md
- Packs/RedTeam/src/Workflows/ParallelAnalysis.md

### RootCauseAnalysis Pack（13 檔）
- Packs/RootCauseAnalysis/INSTALL.md
- Packs/RootCauseAnalysis/README.md
- Packs/RootCauseAnalysis/VERIFY.md
- Packs/RootCauseAnalysis/src/Foundation.md
- Packs/RootCauseAnalysis/src/MethodSelection.md
- Packs/RootCauseAnalysis/src/SKILL.md
- Packs/RootCauseAnalysis/src/Workflows/FaultTree.md
- Packs/RootCauseAnalysis/src/Workflows/FiveWhys.md
- Packs/RootCauseAnalysis/src/Workflows/Fishbone.md
- Packs/RootCauseAnalysis/src/Workflows/KepnerTregoe.md
- Packs/RootCauseAnalysis/src/Workflows/Postmortem.md

### SystemsThinking Pack（10 檔）
- Packs/SystemsThinking/INSTALL.md
- Packs/SystemsThinking/README.md
- Packs/SystemsThinking/VERIFY.md
- Packs/SystemsThinking/src/Archetypes.md
- Packs/SystemsThinking/src/Foundation.md
- Packs/SystemsThinking/src/LeveragePoints.md
- Packs/SystemsThinking/src/SKILL.md
- Packs/SystemsThinking/src/Workflows/CausalLoop.md
- Packs/SystemsThinking/src/Workflows/ConceptMap.md
- Packs/SystemsThinking/src/Workflows/FindArchetype.md
- Packs/SystemsThinking/src/Workflows/FindLeverage.md
- Packs/SystemsThinking/src/Workflows/Iceberg.md
