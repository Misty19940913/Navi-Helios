---
description: ''
parent: null
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
sources: []
used_in: []
contradictions: []
---

# SMC 交易概念

## 定義
Smart Money Concepts (SMC) 基於理解機構交易者的行為模式，識別市場中「聰明錢」的運作痕跡。

## 核心概念

### FVG (Fair Value Gap)
**定義**：價格快速移動時產生的暫時性價格缺口

**識別方式**：
- 上漲趨勢：中間K線的低點 < 前一K線的低點
- 下跌趨勢：中間K線的高點 > 前一K線的高點

**交易應用**：
- 價格回歸 FVG 時進場
- 目標：填補 FVG

### Order Block (OB)
**定義**：機構訂單留下的痕跡區域

**類型**：
| 類型 | 說明 |
|------|------|
| 支撐 OB | 機構大量買入的區域 |
| 阻力 OB | 機構大量賣出的區域 |

**識別**：
- 大型蠟燭後的盤整區
- 通常在結構轉變點附近

### 流動性區域 (Liquidity Zones)
**高流動性區域**：
- Stop Loss 聚集區
- 價格通常會先觸及這些區域

**低流動性區域**：
- 價格快速通過的區域
- 常形成突破或反轉

## 與 ICT 比較

| 概念 | ICT | SMC |
|------|-----|-----|
| 訂單區 | Order Block | Order Block (相同) |
| 價格缺口 | Fair Value Gap | FVG (相同) |
| 流動性 | Liquidity Sweep | Liquidity Zones |

## 實踐步驟

1. **識別結構**：繪製高點/低點
2. **尋找 FVG**：標記價格缺口
3. **定位 OB**：找出機構訂單區
4. **評估流動性**：確認流動性池位置
5. **進場**：等待價格回歸關鍵區域

## 相关文章
- [[K-TRADING-001_K4_ICT交易概念]]
- [[交易策略MOC]]

## Source
AI對話紀錄分析與截取 - ICT與SMC交易策略對話
