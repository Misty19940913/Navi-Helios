---
name: 08_logging
description: 記錄執行成功/失敗事件
trigger: "需要記錄操作日誌"時觸發
prerequisites: []
produces:
  - cards
  - journal
  - vault-duplicate-finder
  - vault-gap-analyzer
  - content-audit
  - narrative-refactor
  - wiki-driven-content-editing
  - llm-wiki
  - hermes-cross-device-sync
  - obsidian-plugin-dev
---

# 08_logging

## Description

記錄執行成功/失敗事件

## Workflow

1. 捕捉操作結果
2. 格式化日誌內容
3. 寫入日誌檔案
4. 維護日誌完整性

## Errors

errors.json: ./errors.json
