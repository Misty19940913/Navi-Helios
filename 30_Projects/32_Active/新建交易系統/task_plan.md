# Task Plan: 新建交易系統

## Goal
建立一個由 Hermes 監控+回報（被動通知模式）的加密貨幣永續合約交易系統，底層使用 MetaTrader 5。

## Current Phase
Phase 2

## Phases

### Phase 1: 知識萃取與定義確認
- [x] 確認翻倉機制定義（觸發條件 = 利潤 = 起始本金）
- [x] 確認手數與風險關係（固定手數 × 本金翻倍 = 風險減半）
- [x] 確認 L1 支援機制（10% 餘額門檻 + 跨層抽調）
- [x] 確認 L1/L2/L3 命名（保留原文）
- [x] 確認最大錯誤次數 → **沒有這個概念**（舊系統殘留，已移除）
- [x] 確認 ADI × ATR → **沒用到**（舊系統資料，已移除）
- [x] 確認各層起始本金（L1 用戶自定義，L2+ = 前層 × 2）
- **Status:** complete

### Phase 2: 系統架構設計
- [x] 確認 Python 策略與 Hermes 的溝通介面（mt5-trade-split-manager REST API）
- [x] 定義「監控+回報」的操作邊界（Alert 通知為主）
- [x] 定義 Hermes 干預能力（緊急止損時可觸發 safe-shutdown）
- [x] 確認警戒線系統（70% / 40% / 10%，觸發時只發 Alert）
- [ ] 繪製系統架構圖
- **Status:** in_progress

### Phase 3: 新系統原子筆記建立
- [ ] （Phase 3 需重新定義：不再基於 K-TRADING-002）
- **Status:** pending

### Phase 4: 實作與測試
- [ ] （待 Phase 2/3 完成後再討論）
- **Status:** pending

## Key Questions
1. L1/L2/L3 中文命名 → 保留 L1/L2/L3（用戶確認）
2. L1 起始本金 → 用戶自定義，L2+ = 前一層 × 2（用戶確認）
3. ADI × ATR → **沒用到**，K-TRADING-002 系列是舊系統資料，不是知識（用戶確認）
4. 是否有「最大錯誤次數」概念？→ **待確認：用戶未提及此概念**

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| 翻倉觸發 = 層利潤 = 層起始本金 | 用戶確認，等價於「帳戶總額翻倍」但定義更精確 |
| 利潤全提取，本金滾入下一層 | 用戶確認 |
| 手數固定，本金每層翻倍 | 風險自動減半，正常機制非失控 |
| 10% 餘額觸發，跨層抽調 100 補足 L1 | 用戶確認的 L1 支援機制 |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| 無 | - | - |

## Notes
- Hermes 角色：監控 + 回報，不下單
- Python 策略：負責實際下單（已完整）
- MT5：Demo 帳戶，真實市場行情，虛擬資金