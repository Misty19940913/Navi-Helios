---
type: content
status: draft
tags:
  - 交易
  - 技術分析
  - Pine Script
  - 程式開發
time_created: 2026-04-12
time_modified: 2026-04-17
description: Pine Script v6 實現的 FVG 與 OB 指標腳本，提供多時間框架支持、可自訂參數與視覺化繪製，是自動化價格行為分析的工具基礎。
parent: null
related: []
sources: []
used_in: []
contradictions: []
---

# Pine Script 腳本功能

> [!abstract] 核心洞見
> 透過 Pine Script v6 將 FVG 與 OB 指標程式化，實現多時間框架同時分析與自動視覺化繪製，大幅提升價格行為分析的效率與客觀性。

### 定義與機制 (What & How)
- **多時間框架支持**：最多支援 3 個更高時間框架的同時分析，可自訂顏色與透明度
- **關鍵參數**：
  - higherTF1/2/3：三個更高時間框架選擇
  - lookback：支撐/阻力回溯週期
  - atrMultiplier：ATR 閾值乘數
  - opacityInput：透明度設定 (0-100)
- **腳本特性**：
  - 視覺化：自動繪製 FVG 區間與 OB 區域
  - 計算：自動識別 FVG 與 OB 條件，ATR 波動過濾

### 實踐與案例 (Action & Proof)
- **真實案例**：在 15 分鐘圖設定 1H/4H/D 三個時間框架，腳本自動在圖上標註各時間框架的 FVG（虛線區間）與 OB（實線區塊），一目瞭然
- **行動指南**：根據交易標的與風格選擇合適的時間框架組合，調整 ATR 倍數過濾雜訊

### 知識網絡 (Connection)
- **與 K-TRADING-003-1 關聯**：腳本實現 FVG 與 OB 的計算邏輯
- **與 K-TRADING-003-3 關聯**：腳本優化方向包括繪製範圍、多時間框架效率與警報功能


## 關聯知識 (Related)

- [[K-TRADING-003-1]]
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
