---
type: content
status: draft
tags:
  - 交易
  - 技術分析
  - Pine Script
time_created: 2026-04-12
time_modified: 2026-04-17
description: FVG 與 OB 是兩大核心價格行為指標，FVG 代表價格缺口回補機會，OB 代表機構大單成交區域，兩者結合可找出高勝率的進場位置。
parent: null
related: []
sources: []
used_in: []
contradictions: []
---

# FVG 與 OB 核心概念

> [!abstract] 核心洞見
> FVG（公平價格差距）識別市場失衡的回調進場點，OB（訂單區）揭示機構大單成本位置，兩者結合可精準定位機構可能護盤或收割的價格區間。

### 定義與機制 (What & How)
- **FVG (Fair Value Gap)**：相鄰兩根蠟燭之間的價格缺口
  - 多頭 FVG：low[1] > high（中間價格未被測試）
  - 空頭 FVG：high[1] < low
  - 應用：價格通常會回補 FVG，可作為回調進場參考
- **OB (Order Block)**：機構大單成交的區域
  - 多頭 OB：收盤 > 開盤 + 波段低點 + ATR 條件（機構買入區）
  - 空頭 OB：收盤 < 開盤 + 波段高點 + ATR 條件（機構賣出區）
  - 應用：作為支撐/阻力區，價格回測時可能反轉

### 實踐與案例 (Action & Proof)
- **真實案例**：比特幣從 50000 下跌至 48000 形成 FVG（5000-49500），價格反彈後回測至 49200 的 OB 區出現十字星，進場做多
- **行動指南**：在趨勢回調時優先尋找 FVG 與 OB 重疊區間，結合較小時間框架確認進場信號

### 知識網絡 (Connection)
- **與 K-TRADING-003-2 關聯**：是 Pine Script 腳本實現的技術基礎
- **與 K-TRADING-003-3 關聯**：腳本優化方向圍繞 FVG 與 OB 的識別效率


## 關聯知識 (Related)

- [[K-TRADING-003-2]]
- [[K-TRADING-003-3]]

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
