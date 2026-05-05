---
children: []
description: ''
folder: area
parent: ''
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

# 交易策略 MOC

這是一個關於交易策略主題的MOC（Map of Content），彙整了多份對話紀錄分析報告，旨在提供一個系統性的檢索途徑，便於快速查閱與金融市場交易策略相關的知識與應用。

## 涵蓋的交易策略子主題

*   **ICT 交易策略**：Inner Circle Trader 的市場結構、公平價格差距、訂單區、流動性獵取等概念。
*   **SMC (Smart Money Concepts) 交易策略**：基於機構交易行為的訂單區、流動性區域、FVG 與 OB 等概念。
*   **Pine Script 實作**：TradingView 自動化交易策略程式開發。
*   **永續合約交易策略**：合約交易與風險管理。

## 相關對話紀錄分析報告

- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄3_ICT與SMC交易策略_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄4_Pine Script技術分析_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄16_永續合約交易策略_詳細]]

---

## ICT 核心概念

### 市場結構
- **高點/低點**：價格波動的关键转折点
- **結構轉變**：價格突破关键支撑/阻力后的趋势变化
- **公平價格差距 (FVG)**：价格快速波动产生的真空区

### 訂單區 (Order Block)
- 大型机构建仓区域
- 通常出现在明显的高低点附近
- 訂單區被突破後常形成强劲趋势

### 流動性獵取 (Liquidity Sweep)
- 价格寻找流动性池（Stop Loss 聚集区）
- 机构出货前的价格清洗

---

## SMC 核心概念

### FVG (Fair Value Gap)
- 快速上涨/下跌后形成的價格缺口
- 價格回歸 FVG 時常出现交易机会

### OB (Order Block)
- 与 ICT 訂單區概念相似
- 机构订单留下的痕迹

### 流动性区域
- 高流动性区域：Stop Loss 聚集区
- 低流动性区域：价格快速波动区域

---

## Pine Script 基礎

### 基本結構
```pinescript
//@version=5
strategy("我的策略", overlay=true)

// 定義進場條件
longCondition = ta.crossover(ta.sma(close, 14), ta.sma(close, 28))
if (longCondition)
    strategy.entry("多單", strategy.long)

// 定義離場條件
shortCondition = ta.crossunder(ta.sma(close, 14), ta.sma(close, 28))
if (shortCondition)
    strategy.close("多單")
```

### 常用函數
| 函數 | 功能 |
|------|------|
| `ta.sma()` | 簡單移動平均 |
| `ta.ema()` | 指數移動平均 |
| `ta.crossover()` | 上穿訊號 |
| `ta.crossunder()` | 下穿訊號 |
| `strategy.entry()` | 進場信號 |
| `strategy.exit()` | 離場信號 |

---

## 風險管理原則

### 倉位計算
- 單筆風險不超過帳戶 1-2%
- 計算公式：倉位 = 帳戶餘額 × 風險% ÷ 止損距離

### 止損設置
- 固定止損：固定點數止損
- 技術止損：依據支撐/阻力位

### 風險回報比
- 最小 1:2（止損100點 / 獲利200點）
- 優化目標 1:3 或更高

---

## 相關章節

- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄3_ICT與SMC交易策略_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄4_Pine Script技術分析_詳細]]
- [[30_Projects/AI對話紀錄分析與截取/產出結果/分析報告/對話記錄16_永續合約交易策略_詳細]]
