# Findings & Decisions: 新建交易系統

## Requirements

### 核心系統定義（已確認）
- **翻倉觸發條件**：當前層利潤 = 當前層起始本金（收益率 100%）
- **翻倉操作**：利潤全部提取，本金滾入下一層
- **手數**：固定，不隨層級改變
- **本金**：每層翻倍（L1=100, L2=200, L3=400...）
- **風險**：自動減半，是正常自我調節機制，非失控

### L1 支援機制（已確認）
- **觸發門檻**：剩餘本金 < 初始本金 × 10%
- **無其他層**：用戶自己補充本金
- **有其他層**：從最高層抽調 100，不足則抽次高層，以此類推
- **通用原則**（所有層一致）：不足 10% → 暫停交易 → 剩餘本金回歸次一層級

### 系統角色定位
- **Hermes**：監控 + 回報，不下單
- **Python 策略**：負責實際下單（已完整，使用官方 MetaTrader5 Python 套件）
- **MT5**：交易平台（Demo 帳戶，真實市場行情，虛擬資金）

## Research Findings

### 問題 1：翻倉定義不清
- **原因**：我錯誤用「100→200 結果」描述，而非定義操作
- **修正**：翻倉觸發 = 層利潤 = 層起始本金（收益率 100%），利潤全提取、本金滾入下一層
- **驗證**：「帳戶總額翻倍」與「層利潤 = 起始本金」數學上等價，是同一回事

### 問題 2：風險金額失控
- **原因**：我的誤解，手數固定 × 本金翻倍 = 風險自動減半，是正常機制非失控
- **驗證**：用戶提供 L1=100/L2=200/L3=400 具體範例，確認手數 0.01 每層相同

### 問題 3：L1 支援機制有漏洞
- **原因**：原本定義不明確
- **修正**：完整定義已確認（見上方 Requirements）

### 問題 4：MetaTrader5 Python 干預能力
- **官方套件能力**：讀取報價、發送訂單、查詢持倉、歷史資料
- **限制**：無法直接控制 Python 程式本身的運行狀態（暫停/重啟/開始）
- **干預實現方式**：需透過外部工具（如 mt5-trade-split-manager REST API）

### 問題 5：Hermes 溝通介面篩選
| 專案 | 介面類型 | 干預能力 | 適合 Hermes？ |
|------|---------|---------|------------|
| metatrader-mcp-server | WebSocket | 無交易控制 | ❌ 僅報價 |
| mt5-trade-split-manager | REST API + TCP Socket | 有（safe-shutdown）| ✅ AI-Agent Friendly |
| mcp-metatrader5-server | MCP | 待確認 | 待確認 |

### 問題 6：Hermes 角色定位（更新）
- **Hermes**：監控 + 回報 + **干預**（干預僅限緊急止損 safe-shutdown）
- **警戒線觸發動作**：只發 Alert（用戶確認）

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| 翻倉觸發 = 層利潤 = 起始本金 | 用戶確認，是最精確的操作定義 |
| 利潤全提取、本金滾入下一層 | 用戶確認的翻倉操作 |
| 手數固定（本數值由用戶定義） | 用戶確認，可變動不固定 |
| 本金：L1 用戶自定義，L2+ = 前層 × 2 | 用戶確認 |
| L1/L2/L3 命名：保留原文 | 用戶確認 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| 問題 1「翻倉定義不清」是過度解讀 | 重新確認，發現「帳戶總額翻倍」與「層利潤 = 起始本金」等價 |
| 問題 2「風險失控」是我錯誤解讀 | 手數固定 × 本金翻倍 = 風險減半，是正常機制 |

## Resources
- K-TRADING MOC：`40_Knowledge/42_MOC/K-TRADING_交易與投資_MOC.md`（僅供參考框架，新系統定義不相關）
- MT5 Python API：官方 `MetaTrader5` Python 套件
- **注意**：K-TRADING-002 系列原子筆記是**舊系統資料**，不是新系統的知識基底
- mt5-trade-split-manager（GitHub: codedpro）→ REST API + TCP Socket，AI-Agent Friendly，**建議作為 Hermes 溝通介面**
- metatrader-mcp-server（GitHub: ariadng）→ WebSocket 報價，無交易控制，不適合

## Visual/Browser Findings
（無）

---
*Update this file after every 2 view/browser/search operations*