---
type: tool-guide
status: active
tags:
  - trading
  - pine-script
  - tradingview
  - automation
  - algotrading
  - H3.0
time_created: 2026-04-09
time_modified: 2026-04-30
description: Pine Script 基礎——TradingView 專用策略開發語言指南，涵蓋語法結構、核心函數、風險管理模組與自動化交易策略實踐。
parent: K-BIZ_商業與電商_MOC
related: []
sources:
  - "AI 對話紀錄分析與截取 - Pine Script 技術分析對話"
used_in:
  - "[[K-TRADING-003_2_PineScript腳本功能]]"
contradictions: []
---

# Pine Script 基礎 — 交易自動化的數位筆記

> [!abstract] 核心洞見 (Insight)
> 交易系統的本質是 **「概率的執行器」**。Pine Script 的價值不在於預測未來，而在於 **「消除人性」**。透過將模糊的交易直覺轉化為精確的代碼邏輯，你能夠在毫秒間執行策略，並進行跨越數年的歷史回測 (Backtesting)。在 Pine Script 的世界裡，「虧損」只是代碼中的一個變量，而「穩定獲利」則是系統不斷修正後的統計必然。

### 定義與機制 (What & How)

#### 核心定義
Pine Script 是 TradingView 平台開發的專用腳本語言。它具備輕量、易學、雲端執行的特性，專為金融市場的指標開發與自動化策略執行而設計。

#### 標準語法結構 (Basic Architecture)
```pinescript
//@version=5
strategy("趨勢策略", overlay=true)

// 1. 參數設定 (Inputs)
fastLen = input.int(20, "快線週期")
slowLen = input.int(50, "慢線週期")

// 2. 指標計算 (Calculations)
maFast = ta.sma(close, fastLen)
maSlow = ta.sma(close, slowLen)

// 3. 視覺化 (Visuals)
plot(maFast, color=color.blue)
plot(maSlow, color=color.red)

// 4. 進出場邏輯 (Conditions)
if (ta.crossover(maFast, maSlow))
    strategy.entry("多單", strategy.long)

if (ta.crossunder(maFast, maSlow))
    strategy.close("多單")
```

#### 核心函數速查
| 類別 | 常用函數 | 生理功能 |
|----------|----------|------------|
| **移動平均** | `ta.sma`, `ta.ema`, `ta.rma` | 平滑價格波動，識別趨勢。 |
| **信號捕捉** | `ta.crossover`, `ta.crossunder` | 捕捉金叉/死叉等關鍵轉折點。 |
| **策略執行** | `strategy.entry`, `strategy.exit` | 管理訂單開倉、止損與止盈。 |
| **指標計算** | `ta.rsi`, `ta.macd`, `ta.atr` | 衡量動能、波動度與超買超賣。 |

#### 風險管理模組 (Risk Management)
```pinescript
// 動態止損設定：使用 ATR 兩倍作為止損空間
atrVal = ta.atr(14)
stopPrice = strategy.position_avg_price - (atrVal * 2)
strategy.exit("止損", "多單", stop=stopPrice)
```

### 實踐與案例 (Action & Proof)
- **真實案例**：一名「兼職美股交易員」的轉型過程。
  - **初期困境**：因為上班無法時刻看盤，常錯過最佳買點，且情緒受波動影響，導致亂砍單。
  - **自動化實踐**：他將其擅長的「20/50 均線趨勢策略」寫成 Pine Script 腳本。
  - **成果**：透過 TradingView 的警示 (Alert) 功能，訊號出現時手機自動推播，且回測顯示該策略在過去 3 年的納斯達克市場具備 58% 的勝率。這讓他從「盯盤焦慮」轉向了 **「數據驅動的決策」**。
- **行動指南**：
  1. **先回測，再實盤**：利用 TradingView 的「策略測試器」觀察最大回撤 (Max Drawdown)，確保你的心理能承受該壓力。
  2. **模組化開發**：將常用的「風險控制邏輯」寫成獨立函數，在不同策略中復用，減少 Bug。

### 知識網絡 (Connection)
- **關聯脈絡**：本基礎為 SMC 交易概念（K-TRADING-002）提供技術實現工具，受營利公式（K-BIZ-031）的期望值邏輯引導，並應用於智慧理財系統中。
- [[K-TRADING-001_K4_ICT交易概念]]
- [[K-TRADING-002_K5_SMC交易概念]]
- [[K-TRADING-003_1_FVG與OB核心概念]]
- [[K-BIZ-081_商業運作三大槓桿]]

---

## 應用紀錄

### Input Notes
<!-- 此筆記被哪些計劃調用 -->

| Plan | Phase | Purpose |
|------|--------|---------|

### Output Notes
<!-- 此筆記關聯的新筆記 -->

| Note | Type | Created In |
|------|------|----------|
