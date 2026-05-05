---
type: content
folder: area
status: done
tags:
- 系統/支援
time_created: 2025-09-11
time_modified: 2026-04-10
description: Obsidian 筆記 YAML 屬性規範
parent: []
children: []
related: []
---

# YAML 屬性建置指南

```yaml
# ===== 機器可讀規範（供 obsidian-yaml-checker 使用）=====
rules_version: "2.0"

# 通用必填欄位（所有類型都需要）
required_fields:
  - type
  - status
  - tags
  - time_created
  - time_modified
  - description
  - parent
  - related

# Type 專屬必填欄位（type 作為 key）
required_fields_by_type:
  task:
    - priority
    - time_start
    - time_end
  project:
    - project_phase
    - priority
    - time_start
    - time_end
  journal: []
  content: []
  rules: []
  knowledge/atomic: []
  knowledge/entity: []
  knowledge/concept: []
  knowledge/comparison: []

# 允許的值
allowed_values:
  type:
    - journal
    - project
    - content
    - rules
    - knowledge/atomic
    - knowledge/entity
    - knowledge/concept
    - knowledge/comparison
  status:
    - seed
    - growing
    - mature
    - stale
    - wait
    - paused
    - draft
    - active
    - done
  priority:
    - high
    - medium
    - low
  project_phase:
    - plan
    - execute
    - done
    - paused

# 欄位修正對照（null 表示刪除）
field_corrections:
  system_level: null      # 刪除
  folder: null            # 刪除
  parents: parent
  children: null         # 刪除
  related_files: related
  aliases: description
  publish_date: time_published
  time_create: time_created
  modifieTime: time_modified
  slug: null
  areas: null
  domain: null           # 刪除

# 允許的 callout 類型
allowed_callouts:
  - note
  - warning
  - abstract
  - info
  - tip
  - success
  - question
  - danger
  - bug
  - example
  - quote
```
