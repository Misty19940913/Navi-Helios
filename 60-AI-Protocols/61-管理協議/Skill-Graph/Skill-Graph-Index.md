---
tags:
- Skill-Graph
- 索引
type: index
status: active
time_created: 2026-04-04
time_modified: 2026-04-04
folder: resource
description: ''
parent: []
children: []
related: []
---

# Skill Graph

## 願景

讓每個 Agent（組長）在創建 sub-agent 時，能快速找到對應的 Profile 和執行指引。

## 資料來源統計

| Repository | MD 檔案數 | 類型 |
|------------|-----------|------|
| agency-agents-main | 84 | Agent Profiles |
| proactivity | 10 | System Skill |
| self-improving-agent | 10 | System Skill |
| code-reviewer | 8 | Skill |
| ux-designer | 7 | Skill |
| json-canvas | 2 | Skill |
| python-expert | 2 | Skill |
| agent-memory | 2 | System Skill |
| advanced-skill-creator | 4 | Skill |
| 其他（各1個）| 93 | Skill |
| **總計** | **151** | |

---

## agency-agents-main 細項

| 子資料夾 | 檔案數 |
|----------|--------|
| strategy | 16 |
| marketing | 11 |
| engineering | 8 |
| testing | 8 |
| design | 7 |
| specialized | 7 |
| support | 6 |
| spatial-computing | 6 |
| project-management | 5 |
| examples | 4 |
| product | 3 |
| coordination | 0 |

---

## Skill Graph 結構

```
Skill-Graph/
├── Skill-Graph-Index.md           ← 本頁
├── 01-System-Skills/             ← 系統技能索引
├── 02-Agent-Profiles/            ← Agent Profiles 索引
└── 03-Task-Templates/            ← 任務模板索引
```

---

## 運作方式

```
組長收到任務
        ↓
查詢 Skill Graph（哪個部門/Task Type）
        ↓
引用對應的 Agent Profile
        ↓
使用現有 prompt template 創建 sub-agent
```

---

## 相關資源

- [Agent/skills](../Agent/skills/) - Agent Profile 定義來源
- [Knowledge-Graph](../AI-Config/Knowledge-Graph-管理框架.md) - 知識管理
- [OpenViking](../AI-Config/claw-System/OpenViking-記憶檢索系統.md) - 記憶檢索

---

*最後更新：2026-04-04*
