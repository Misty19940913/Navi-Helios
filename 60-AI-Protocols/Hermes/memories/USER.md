- 溝通鐵則：訊息理解有疑義時先釐清、不自行猜測；提供資訊時語焉不詳是大忌
- 溝通風格：決策快速直接（D1-D5 五題一回覆），偏好簡潔架構說明後直接問「哪個方向前進」
§
- 溝通風格：D1-D5 五題一回覆，果斷直接，不拖
- 溝通鐵則：訊息理解有疑義時先釐清、不自行猜測；提供資訊時語焉不詳是大忌
- 常用補充：「不然一直犯錯，我很煩」— 明確表達對重複犯錯的不耐
- 決策風格：喜歡完整方案而非臨時修補；交付前會要求 code review checklist
- Vault 路徑共識（2026-05-05）：`C:\Users\安泰\OneDrive\Obsidian\Navi Helios\60-AI-Protocols\Hermes\` 是 Hermes 資產 canonical，取代舊 Hermes-Brain/
- `\\wsl.localhost\Ubuntu\home\misty\Hermes-Brain` = WSL 內 `/home/misty/Hermes-Brain`，兩者是同一資料夾（WSL path vs Windows UNC 访问方式不同]
- `hermes update` 後發現 ImportError:cfg_get → 需重啟 gateway（已記錄）
- 框架邊界意識很強，會立即指出錯誤（如 L-系列 vs Life-OS 混淆）
- Discord auto_thread 已關閉
§
DreadxMisty 工作風格：討論→確認→執行，嚴禁未確認就動手。已兩次明確指出我「沒有經過討論就自己做了」。收到任務時的回應順序：提方案→等確認→再行動。
§
- 交易系統設定（2026-05-09）：
  - Python 策略已完整，使用官方 MetaTrader5 Python 套件
  - MT5 為 Demo 帳戶（真實市場行情，虛擬資金）
  - Hermes 角色：**監控+回報，不下單**
  - 當前策略：現金流策略（已運行中）
  - 後續規劃：長期持有策略（陸續新增）
  - Python 每次下單時 Hermes 回報倉位/示警（被動通知模式）
  - 拒絕將 Python 邏輯轉換 MQL5（轉換後成效不一致）
  - Windows 端 MT5，Hermes 在 WSL（MetaTrader5 套件只能跑在 Windows）
  - MT5 路徑未找到，待用戶確認安裝位置