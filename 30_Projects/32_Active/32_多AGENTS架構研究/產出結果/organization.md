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

# 公司制度化多Agent架構 - 組織圖

## 組織層級

```
🏢 L0 - 總裁（用戶）
   │
   ├── 📋 L1 A主管（Navi）
   │      └─ 參與研究、實行計劃、下達命令
   │
   ├── 📋 L1 B主管（Advisor）
   │      └─ 向總裁匯報實作情形
   │
   ├── 💻 技術部門（TechLead）
   │      ├─ L3 DevOps → Sub-Agent（軟體開發、網站管理）
   │      └─ L3 SkillDev → Sub-Agent（技能開發）
   │
   ├── 🎬 媒體部門（MediaLead）
   │      ├─ L3 SocialMgr → Sub-Agent（自媒體經營）
   │      └─ L3 ContentCreator → Sub-Agent（內容創作）
   │
   ├── 💰 金融部門（FinanceLead）
   │      ├─ L3 MarketNews → Sub-Agent（金融消息）
   │      ├─ L3 AssetMgr → Sub-Agent（資產配置）
   │      └─ L3 TradeMonitor → Sub-Agent（交易監控）
   │
   └── 📁 文書部門（DocLead）
         ├─ L3 ObsidianMgr → Sub-Agent（Obsidian管理）
         ├─ L3 FormatSpec → Sub-Agent（文書格式）
         └─ L3 NoteTaker → Sub-Agent（筆記書寫）
```

## Agent ID 對照表

| 層級  | Agent ID     | 名稱          | 職責         |
| --- | ------------ | ----------- | ---------- |
| L1  | supervisor-a | Navi        | 研究、計劃、命令下達 |
| L1  | supervisor-b | Advisor     | 匯報實作情形     |
| L2  | tech-lead    | TechLead    | 技術部門主管     |
| L2  | media-lead   | MediaLead   | 媒體部門主管     |
| L2  | finance-lead | FinanceLead | 金融部門主管     |
| L2  | doc-lead     | DocLead     | 文書部門主管     |
