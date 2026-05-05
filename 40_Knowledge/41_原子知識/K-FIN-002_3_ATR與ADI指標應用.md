---
type: content
status: draft
tags:
  - 財務
  - 技術分析
  - 風險管理
time_created: 2026-04-10
time_modified: 2026-04-17
description: ATR 與 ADI 指標在財務 Dashboard 中的應用，用於市場波動風險與趨勢強度分析
parent: null
related: []
sources: []
used_in: []
contradictions: []
---

# ATR 與 ADI 指標應用

> [!abstract] 核心洞見 (Insight)
> ATR 衡量市場波動程度（停損參考）、ADI 判斷資金流向（趨勢確認），兩者整合可在一人公司的投資決策中實現「看盤但不盯盤」的系統化交易。

### 定義與機制 (What & How)
- **核心定義**：
  - ATR（Average True Range）平均真實區間：衡量市場波動程度
  - ADI（Accumulation/Distribution Index）累計/派發指數：衡量資金流向
- **運作機制**：
  - ATR = Σ True Range / N（N 通常為 14）
  - ADI = 累計區間內資金淨流入
  - 停損設定：價格跌破 ATR × 倍數作為動態停損

### 實踐與案例 (Action & Proof)
- **真實案例**：當 ATR 處於歷史高點（如比特幣波動期間），應降低部位規模並放寬停損；當 ADI 持續上漲且價格未見頂時，可維持或增加投資比重。
- **行動指南**：將 ATR/ADI 指標加入財務 Dashboard，每週檢視一次。當 ATR偏高 + ADI偏弱时减少投入，ATR偏低 + ADI偏強時樂觀進場。

### 知識網絡 (Connection)
- **關聯脈絡**：
  - K-FIN-002-1：財務 Dashboard 結構
  - K-FIN-002-2：FIRE 與標準普爾整合
  - [[技術分析指標]]：ATR/ADI 教學
  - [[風險管理系統]]：動態調整邏輯


## 關聯知識 (Related)

- [[K-FIN-002-1]]
- [[K-FIN-002-2]]

---

## 應用紀錄

### Input Notes
| Plan | Phase | Purpose |
|------|-------|----------|
| 投資系統建置 | Planning | 引入 ATR/ADI 指標 |

### Output Notes
| Note | Type | Created In |
|------|------|------------|