# Vault 交易知識結構現況（2026-05-08）

## 發現：Ghost Notes 問題

**現象**：MOC 中有條目，但磁碟上沒有實際檔案。

```
K-TRADING-001-1 → MOC 有，磁碟無
K-TRADING-001-2 → MOC 有，磁碟無
K-TRADING-001-3 → MOC 有，磁碟無
K-TRADING-002-1 → MOC 有，磁碟無
K-TRADING-002-2 → MOC 有，磁碟無
K-TRADING-002-3 → MOC 有，磁碟無
K-TRADING-003-1 → MOC 有，磁碟無
K-TRADING-003-2 → MOC 有，磁碟無
K-TRADING-003-3 → MOC 有，磁碟無
```

**原因**：來源文檔（SRC-014、SRC-029）知識已被「萃取至 K-TRADING-00X 系列」，但原子化動作只更新了 MOC index，未實際建立ノート檔案。

**驗證方法**：
```bash
# 檢查 MOC 中引用的檔案是否真的存在
# 從 MOC 取出 wiki link → 逐一 read_file 驗證
```

**原則**：做 vault 知識研究時，先驗證 MOC 條目 vs 磁碟存在性的對照關係，再開始閱讀內容。否則會浪費時間嘗試讀取不存在的檔案。

---

## K-TRADING 知識地圖（MOC 描述 vs 磁碟現況）

| MOC 條目 | 描述 | 磁碟狀態 |
|----------|------|----------|
| K-TRADING-001-1 | ICT 七大核心概念 | ⚠️ 不存在 |
| K-TRADING-001-2 | ICT 與 SMC 差異 | ⚠️ 不存在 |
| K-TRADING-001-3 | 流動性抓取訂單區反轉策略 | ⚠️ 不存在 |
| K-TRADING-002-1 | 三層部位分類 | ⚠️ 不存在 |
| K-TRADING-002-2 | 風險計算核心邏輯 | ⚠️ 不存在 |
| K-TRADING-002-3 | 風險控制原則與輸入欄位 | ⚠️ 不存在 |
| K-TRADING-003-1 | FVG 與 OB 核心概念 | ⚠️ 不存在 |
| K-TRADING-003-2 | PineScript 腳本功能 | ⚠️ 不存在 |
| K-TRADING-003-3 | 腳本潛在優化 | ⚠️ 不存在 |
| K-TRADING-001 | 投資標的比較 | ✅ 未知 |
| K-TRADING-002 | ETF 完整指南 | ✅ 未知 |
| K-TRADING-003 | 股票投資基礎 | ✅ 未知 |
| K-TRADING-004 | 海龜交易法 | ✅ 未知 |
| K-TRADING-005 | 混沌交易法 | ✅ 未知 |
| K-TRADING-006 | 被動投資 | ✅ 未知 |

---

## 用戶交易背景（來自 vault）

- 身份：刑事警察 → 全職交易者（幣圈/股票）
- 700萬 → -600萬：高槓桿操作教訓
- 交易風格：ICT/SMC 框架、短線技術分析、永續合約高槓桿（50x-150x）
- PineScript 能力：有，見 K-TRADING-003-2
- 風控框架：三層部位 × ADI 聯動、全倉 80% 警示線、ATR 波動判斷加倉

---

## 實際有效的來源檔案

| 檔案 | 內容層次 | 可用性 |
|------|----------|--------|
| `SRC-014_ICT、SMC.md` | 來源 Raw | ✅ 尚在，可重新蒸餾 |
| `SRC-029_永續合約長期持有策略.md` | 來源 Raw | ✅ 尚在，可重新蒸餾 |
| `K-FIN_財務管理_MOC.md` | MOC index | ✅ 可參考格式 |
| `K-TRADING_交易與投資_MOC.md` | MOC index | ✅ 可參考格式，但條目多數 ghost |
| `K-TRADING-002_3 風險控制原則`（描述） | MOC 內文 | ⚠️ 描述存在，內容片段：`名稱部位×ADI聯動、全倉80%警示線、ATR波動判斷加倉；輸入欄位：實際總資金×最大槓桿倍數×ADI×ATR×當前持倉` |