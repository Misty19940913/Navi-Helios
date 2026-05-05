---
children: []
description: ''
folder: area
parent: []
related: []
status: draft
tags: []
time_created: '2026-04-09'
time_modified: '2026-04-09'
type: content
---

## 🚀 智能模組更新版本

### 1\. Telegram 啟動 n8n

- **功能** ：你在 Telegram 私聊 Bot，輸入指令（如 `/process` ），n8n 嘗試抓取當日 Inbox 標記並執行流程。
- **實作節點** ：
	- Telegram Trigger（Webhook 模式） [github.com +13 n8n.io +13 n8n.io +13](https://n8n.io/workflows/4856-configure-telegram-bot-webhooks-with-form-automation/?utm_source=chatgpt.com) [github.com +1 lune.dev +1](https://github.com/Chris1606/n8n_telegram?utm_source=chatgpt.com) [n8n.io +15 docs.n8n.io +15 community.n8n.io +15](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.telegramtrigger/?utm_source=chatgpt.com)
	- Trigger → HTTP Request（入選收件區筆記）
	- Ollama 處理標記分類 → 更新 YAML metadata
	- 更新 Obsidian md 檔案 & 推送行動建議到今日日記

---

### 2\. 筆記分類與更新任務

- **步驟** ：
	1. Obsidian Post Webhook 插件 → 觸發 n8n Webhook [github.com +7 n8n.io +7 community.n8n.io +7](https://n8n.io/workflows/3763-chat-with-your-email-history-using-telegram-mistral-and-pgvector-for-rag/?utm_source=chatgpt.com) [duntools.com +8 forum.obsidian.md +8 n8n.io +8](https://forum.obsidian.md/t/new-plugin-post-webhook-send-notes-to-any-webhook-endpoint/92647?utm_source=chatgpt.com)
	2. n8n 解析 `--- frontmatter ---` → 提取內容
	3. Ollama 與分類 Prompt 分析內容 → 判定 `type` （靈感/專案/日記）
	4. 插入／更新 YAML： `tags:`, `date:`, `type:` 例如:
	5. 若 `type: inspiration` → 再由 AI 提取「可能的行動任務」並插入當日日記尾部

---

### 🔧 完整 Docker Compose

---

### 📈 n8n 工作流程範本

#### A. Telegram Trigger → 啟動分類流程

- Trigger Node（Telegram）
- HTTP Request Node → 讀取 Obsidian Inbox.md via REST API 或 Webhook 觸發內容
- Ollama Model Node：
- GitHub/REST API Node → 更新 Obsidian 檔案 YAML
- If type=inspiration → Ollama for action tasks提案
- Append to Today Journal via REST endpoint

#### B. Post Webhook → 即時分類

- Trigger → 欄位抽取 → 相同 Ollama prompt
- Write back md

---

### 💡 模組價值與可擴展性

- 完全依靠 Telegram 指令啟動，隨時操控
- Inbox 中資料自動分類＋行動建議生成，讓檔案永不凌亂
- 今日行動清單永遠帶建議，讓系統持續運行
