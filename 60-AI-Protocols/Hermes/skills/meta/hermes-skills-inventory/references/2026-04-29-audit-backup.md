# Skill Audit Backup — 2026-04-29

## 發現的 frontmatter 錯誤（下次新建 skill 前必讀）
1. `title:` 而非 `name:`
2. 多了非標準欄位：`type/status/version/folder/created/time_created/time_modified/parent/prerequisites/produces`
3. `trigger:` 用了 string 而非 array
4. `triggers:` 複數 — 標準是 `trigger:` 單數
5. 缺少 `required_primitives:`

## Standard Frontmatter（每個 SKILL.md 必備）
```yaml
---
name: <lowercase-hyphenated>
description: 一句話描述
trigger:
  - "..."
required_primitives:
  - 01_flow-planning
  - ...
---
```

## 2026-04-29 Split 記錄

| 原始                          | 動作   | 子 skill                             | 行數   |
| --------------------------- | ---- | ----------------------------------- | ---- |
| obsidian-plugin-dev         | 拆成 3 | obsidian-plugin-dev（主控）             | ~168 |
|                             |      | obsidian-plugin-study               | ~683 |
|                             |      | obsidian-plugin-brat-release        | ~117 |
| plugin-gap-analysis         | 拆成 2 | plugin-gap-analysis（分析）             | ~113 |
|                             |      | plugin-gap-deepening                | ~117 |
| wiki-driven-content-editing | 拆成 2 | [[wiki-driven-content-editing]]（編輯） | ~210 |
|                             |      | wiki-ingest-workflow                | ~242 |

## 新增 skill（+4）
- software-development/obsidian-plugin-brat-release
- software-development/obsidian-plugin-study
- software-development/plugin-gap-deepening
- llm-wiki-ops/wiki-ingest-workflow

## 庫存更新
hermes-skills-inventory 已更新至 2026-04-29，包含所有 split 後的 skill。
