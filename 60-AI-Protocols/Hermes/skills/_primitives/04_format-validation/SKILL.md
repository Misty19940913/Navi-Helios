---
name: 04_format-validation
description: 根據規格驗證輸出格式
trigger: "需要驗證格式正確性"時觸發
prerequisites: []
produces:
  - content-audit
  - obsidian-plugin-dev
---

# 04_format-validation

## Description

根據規格驗證輸出格式

## Workflow

1. 載入格式規格
2. 比對輸出結果
3. 標記差異項目
4. 產生驗證報告

## Errors

errors.json: ./errors.json
