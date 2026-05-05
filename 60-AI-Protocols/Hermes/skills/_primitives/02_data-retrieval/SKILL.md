---
name: 02_data-retrieval
description: 從 vault、網路、API 獲取資料
trigger: "需要查詢資料"時觸發
prerequisites: []
produces:
  - content-audit
  - wiki-driven-content-editing
  - llm-wiki
---

# 02_data-retrieval

## Description

從 vault、網路、API 獲取資料

## Workflow

1. 識別資料來源
2. 執行查詢操作
3. 驗證資料完整性
4. 格式化輸出結果

## Errors

errors.json: ./errors.json
