---
type: content
status: draft
tags:
  - 投資
  - 財務
  - WACC
time_created: 2026-04-10
time_modified: 2026-04-17
description: WACC 的完整計算範例，從假設條件到最終結果的演示
parent: null
related: []
sources: []
used_in: []
contradictions: []
---

# WACC 計算範例

> [!abstract] 核心洞見 (Insight)
> WACC 計算的核心是「權重×成本」的加總，並注意債務的稅後優勢——利息可抵稅使債務成本實際上更低。

### 定義與機制 (What & How)
- **核心定義**：透過權重計算公式，將股權與債務的資本成本加權平均。
- **運作機制**：
  1. 計算股權權重 E/(E+D) × 股權成本 re
  2. 計算債務權重 D/(E+D) × 債務成本 rd × (1-T)
  3. 兩者相加即為 WACC

### 實踐與案例 (Action & Proof)
- **真實案例**：股權 200 萬（成本 10%）、債務 100 萬（利率 5%）、稅率 20%
  - 股權貢獻：66.67% × 10% = 6.67%
  - 債務貢獻：33.33% × 5% × 80% = 1.33%
  - WACC = 8%
- **行動指南**：在個人理財中，可用此公式評估不同融資成本的實際負擔，決定是否應該舉債投資。

### 知識網絡 (Connection)
- **關聯脈絡**：
  - K-FIN-001-1：WACC 公式與符號說明
  - K-FIN-001-2：WACC 應用場景與決策原則
  - [[個人財務模型]]：資本成本計算模組


## 關聯知識 (Related)

- [[K-FIN-001-1]]
- [[K-FIN-001-2]]

---

## 應用紀錄

### Input Notes
| Plan | Phase | Purpose |
|------|-------|----------|
| 財務系統建置 | Active | 計算 WACC 模組 |

### Output Notes
| Note | Type | Created In |
|------|------|------------|