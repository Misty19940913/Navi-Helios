---
version: 1.0.0
created: 2026-04-18T02:07:00Z
updated: 2026-04-29T01:44:00Z
type: hermes-error-pattern
folder: 60-AI-Protocols/Hermes/shared
status: active
time_created: '2026-04-18'
time_modified: '2026-04-29'
description: Hermes 常見錯誤模式與解法知識庫
parent:
  - "[[60-AI-Protocols/Hermes/index]]"
children: []
related:
  - "[[memory/_misty-errors]]"
  - "[[memory/_misty-model]]"
tags:
  - hermes
  - errors
  - patterns
---

# Hermes 錯誤模式知識庫

> 記錄 Hermes Agent 常見踩坑經驗，幫助未來遇到類似問題時提前避開。

---

## 如何讀取

Agent 啟動時**無需手動讀取**此頁面。
遇到錯誤時，直接問 Misty 或搜尋相關關鍵字即可。

想主動查閱時：
```
session_search("timeout" OR "write failed" OR "vault" OR "skill")
```

---

## 錯誤模式記錄

### [2026-04-29] `execute_code` 內的 `write_file` 不寫入磁碟

**觸發場景**：在 `execute_code` 腳本內呼叫 `write_file`（以為會寫入磁碟）

**受影響 Agents**：Hermes（多次發生）

**現象**：`write_file` 回傳成功，但磁碟上找不到檔案

**根因**：`execute_code` 是隔離的 session，`write_file` 寫入後立即結束，狀態未持久化

**正確做法**：
- Vault 寫入**必須用 standalone `write_file` 工具**，不能用 `execute_code` 內的包裝函數
- 驗證方式：寫入後立即 `find` 或 `terminal('ls')` 確認檔案確實存在

**預防**：寫入 vault 時自言自語「我正在用 write_file 寫入，而不是 execute_code 裡的函數」

---

### [2026-04-29] `skill_manage` 回傳成功但檔案未落地

**觸發場景**：用 `skill_manage create` 或 `patch` 建立 skill，完成後未驗證

**受影響 Agents**：Hermes

**現象**：`skill_manage` 回傳 `{"success": true}`，但 `find ~/.hermes/skills` 找不到檔案

**根因**：`skill_manage` 有時內部狀態不一致，回傳成功但實際寫入失敗

**正確做法**：
- 建立 skill 後**立即執行驗證**：`find ~/.hermes/skills -name "SKILL.md"`
- 發現未落地：重新執行一次 `skill_manage`，或改用 `write_file` 寫入後建立 skill entry

**驗證命令**：
```bash
find /home/misty/.hermes/skills -name "SKILL.md" -path "*skill-name*"
```

---

### [2026-04-28] `vision_analyze` 失敗時的替代處理

**觸發場景**：呼叫 `vision_analyze` 失敗（網路問題、格式不支援等）

**受影響 Agents**：Hermes

**現象**：`vision_analyze` 回傳錯誤或超時

**正確做法**：
- 嘗試 `curl` 下載圖片至本地
- 用 `python zlib` 解析 RGBA 取色
- 或使用 `mcp_firecrawl_firecrawl_scrape` 的 `screenshot` 格式截圖分析

---

## 維護說明

| 欄位 | 說明 |
|:-----|:-----|
| **新增時機** | 遇到錯誤並找到解決路徑後 |
| **自動寫入** | 錯誤解決 → 評估是否值得寫入 `_hermes-errors.md` |
| **連結** | 與 `[[memory/_misty-errors]]` 互補（Misty-errors 記錄用戶行為，此頁記錄技術錯誤）|

---

*此頁面由 Hermes 維護，最後更新：2026-04-29*
