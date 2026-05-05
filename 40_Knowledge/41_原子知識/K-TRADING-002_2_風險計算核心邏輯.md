---
type: content
status: draft
tags:
  - 加密貨幣
  - 交易策略
  - 風險管理
  - 計算
time_created: 2026-04-12
time_modified: 2026-04-17
description: 加密貨幣風險管理系統的核心計算模組，包含 ADI 動態縮放、總名義上限、各層上限計算、建倉補倉金額公式與加倉條件判斷。
parent: null
related: []
sources: []
used_in: []
contradictions: []
---

# 風險計算核心邏輯

> [!abstract] 核心洞見
> 透過 ADI 趨勢強度驅動的動態縮放機制，讓風險曝險與市場趨勢強度聯動，在強趨勢時放大部位、在震盪時收縮風險，實現智能化的風險控制。

### 定義與機制 (What & How)
- **ADI 動態縮放**：公式 E = 0.6 + 0.4 × (ADI / 100)，ADI 越高（趨勢越強）可用額度越大
- **總有名上限**：Max_Notional_Total = N_base × Leverage × E，根據風險基準資金與槓桿倍數計算
- **各層上限**：按 L/C/T 比例分配總名義上限
- **建倉金額**：Entry_Size = N_current × 10% × E，首次進場使用當前資金的 10%
- **補倉金額**：Add_Size = N_current × 5% × E，加倉使用當前資金的 5%
- **加倉條件**：價格回撤 >= ATR × 設定倍數時允許加倉

### 實踐與案例 (Action & Proof)
- **真實案例**：ADI = 80 時，E = 0.6 + 0.4 × 0.8 = 0.92，若 N_current = 10000，槓桿 10 倍，則建倉金額 = 10000 × 10% × 0.92 = 920U
- **行動指南**：將計算公式寫入交易工具或 Excel，定期更新 ADI 與 ATR 數值，系統化執行進場決策

### 知識網絡 (Connection)
- **與 K-TRADING-002-1 關聯**：計算邏輯支撐三層部位的資金分配
- **與 K-TRADING-002-3 關聯**：輸入欄位（ADI、ATR、資金）用於公式計算


## 關聯知識 (Related)

- [[K-TRADING-002-1]]
- [[K-TRADING-002-3]]

---

## 應用紀錄

### Input Notes
<!-- 此筆記被哪些計劃調用 -->

| Plan | Phase | Purpose |
|------|-------|---------|

### Output Notes
<!-- 此筆記關聯的新筆記 -->

| Note | Type | Created In |
|------|------|----------|
