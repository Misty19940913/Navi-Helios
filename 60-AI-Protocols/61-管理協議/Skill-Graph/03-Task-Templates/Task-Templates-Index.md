---
tags:
- Skill-Graph
- Task-Templates
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

# Task Templates Index

## 概述

Task Templates 是 Skill Graph 的核心 — 定義每種任務類型的標準執行流程。

## 現有 Skills（27 個）

| Skill | 檔案數 | 說明 |
|-------|--------|------|
| code-reviewer | 8 | 程式碼審查 |
| ux-designer | 7 | UX 設計 |
| json-canvas | 2 | JSON Canvas |
| python-expert | 2 | Python 專家 |
| academic-researcher | 1 | 學術研究 |
| content-creator | 1 | 內容創作 |
| data-analyst | 1 | 數據分析 |
| debugger | 1 | 錯誤修復 |
| decision-helper | 1 | 決策輔助 |
| deep-research | 1 | 深度研究 |
| defuddle | 1 | 內容提取 |
| editor | 1 | 編輯 |
| email-drafter | 1 | 郵件起草 |
| fact-checker | 1 | 事實核查 |
| finance | 1 | 財務 |
| fullstack-developer | 1 | 全端開發 |
| meeting-notes | 1 | 會議記錄 |
| obsidian-bases | 1 | Obsidian Bases |
| obsidian-cli | 1 | Obsidian CLI |
| obsidian-markdown | 1 | Obsidian Markdown |
| project-planner | 1 | 專案規劃 |
| skill-vetter | 1 | 技能審查 |
| sprint-planner | 1 | Sprint 規劃 |
| strategy-advisor | 1 | 策略顧問 |
| technical-writer | 1 | 技術寫作 |
| visualization-expert | 1 | 視覺化專家 |
| skill-creator | 0 | 技能創建（空） |

---

## code-reviewer 詳細結構

```
Agent/skills/code-reviewer/
├── SKILL.md
└── rules/
    ├── code-review-best-practices.md
    ├── security-review-rules.md
    ├── performance-review-rules.md
    ├── readability-review-rules.md
    ├── testing-review-rules.md
    ├── error-handling-review-rules.md
    ├── api-design-review-rules.md
    └── documentation-review-rules.md
```

---

## ux-designer 詳細結構

```
Agent/skills/ux-designer/
├── SKILL.md
└── rules/
    ├── ux-research-methods.md
    ├── ui-design-principles.md
    ├── accessibility-guidelines.md
    ├── interaction-patterns.md
    ├── design-systems.md
    └── usability-heuristics.md
```

---

## Task Type 定義

### 程式碼審查 (Code Review)

| 屬性 | 值 |
|------|-----|
| Category | Engineering |
| Skill | code-reviewer |
| Tools | read, exec, grep |
| Verification | 8 條規則檢查清單 |
| Deliverables | 審查報告 |

### UX 設計 (UX Design)

| 屬性 | 值 |
|------|-----|
| Category | Design |
| Skill | ux-designer |
| Tools | read, write, json-canvas |
| Verification | 6 條設計原則檢查 |
| Deliverables | 設計稿、相關文檔 |

---

## 使用方式

組長在創建 sub-agent 時：
1. 查詢 Task Templates Index
2. 選擇對應的 Task Type
3. 引用對應的 Skill Profile
4. 使用標準 Prompt Template

---

*最後更新：2026-04-04*
