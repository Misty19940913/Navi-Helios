---
name: 03_format-parsing
description: 轉換資料格式（JSON/YAML/MD/HTML等）
trigger: "需要解析或轉換格式"時觸發
prerequisites: []
produces:
  - vault-duplicate-finder
  - vault-gap-analyzer
  - narrative-refactor
  - wiki-driven-content-editing
  - llm-wiki
  - obsidian-plugin-dev
---

# 03_format-parsing

## Description

轉換資料格式（JSON/YAML/MD/HTML等）

## Workflow

1. 識別來源格式
2. 解析資料結構
3. 轉換為目標格式
4. 驗證轉換結果

## Errors

errors.json: ./errors.json
