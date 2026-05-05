---
version: 1.0.0
created: 2026-04-29T10:30:00Z
updated: 2026-04-29T10:30:00Z
type: skill
folder: 60-AI-Protocols/Hermes/skills/workflow/pattern-pending
status: active
time_created: '2026-04-29'
time_modified: '2026-04-29'
description: Pattern 驗證機制 — 待驗證的成功 approach 不直接寫入規範，先放 pending 區經過多次確認再晉升
parent:
  - "[[60-AI-Protocols/Hermes/index]]"
children: []
related:
  - "[[../workflow/wiki-driven-content-editing]]"
  - "[[../llm-wiki-ops/vault-knowledge-distillation]]"
tags:
  - hermes
  - pattern
  - workflow
trigger:
  when: >
    發現有效的解法或 workflow，但只驗證過一次
  usage: >
    當遇到非平凡的 workflow、成功的解法可能有通用性、解決方案不是明顯眾所皆知的
  action: >
    將 approach 寫入 pattern-pending/patterns/pending/ 而非直接寫入規範
---

# Pattern Pending 機制

> 有效的成功 approach 不直接寫入規範，先放 pending 區，經過多次驗證再晉升 confirmed。

---

## 核心問題

Agent 發現一個有效的解法 → 立刻寫進規範 → 下次遇到類似問題就套用 → 但這個解法可能只對那一次有效

**Pattern Pending 的目的：防止一次成功的解法被過度推廣**

---

## 存放位置

```
60-AI-Protocols/Hermes/skills/workflow/pattern-pending/
├── patterns/
│   ├── pending/       ← 等待驗證（命名：kebab-case，如 visual-first-ui-dev.md）
│   ├── confirmed/    ← 驗證通過
│   └── rejected/     ← 驗證失敗
└── SKILL.md
```

---

## Pattern 檔案格式

```markdown
---
version: 1.0.0
created: YYYY-MM-DD
type: pattern
status: pending | confirmed | rejected
description: 簡短描述
---

# Pattern: [名稱]

## Trigger
- **When:** 什麼情境觸發
- **Type:** SUCCESS（新 approach 成功）/ ERR（錯誤的舊 approach）
- **Date:** YYYY-MM-DD

## Root Cause
為什麼舊的做法有問題（如果是 ERR 類型）

## Solution
提出什麼解法

## Verification
- [ ] 第 1 次驗證：日期 + 情境簡述
- [ ] 第 2 次驗證：日期 + 情境簡述
- [ ] 第 3 次驗證：日期 + 情境簡述

## Status
- **pending** → 等待驗證
- **confirmed** → 3 次驗證通過，可移入 confirmed/
- **rejected** → 驗證失敗，移入 rejected/
```

---

## 流程

```
發現問題 → 想出解法 → 寫入 pending/
    ↓
遇到類似情境時檢查 pending patterns
    ↓
成功 → 更新驗證記錄（+1）
    ↓
連續 3 次成功 → 移入 confirmed/
失敗 → 移入 rejected/
```

---

## 何時使用

| 情境 | 寫入 |
|------|------|
| 遇到錯誤並解決 | `_hermes-errors.md` |
| 發現新的有效 approach，但只驗證 1 次 | Pattern Pending |
| 同一 approach 連續 3 次成功 | 移入 confirmed/ |

---

## 觸發時機

當遇到以下情境時，評估是否建立 pattern：
- 發現一個非平凡的 workflow
- 成功的解法可能有通用性
- 解決方案不是明顯的、不是眾所皆知的

---

## 範例：confirmed pattern

```markdown
# Pattern: Vision Analyze 失敗時的替代處理

## Trigger
- **When:** vision_analyze 失敗（網路問題、格式不支援等）
- **Type:** SUCCESS
- **Date:** 2026-04-29

## Solution
1. curl 下載圖片至本地
2. python zlib 解析 RGBA 取色
3. 或使用 mcp_firecrawl 的 screenshot 格式截圖分析

## Verification
- [x] 2026-04-29：Discord CDN PNG 成功取色
- [x] 2026-04-29：本地 PNG 成功解析
- [x] 2026-04-29：WebP 格式 fallback 成功

## Status
confirmed
```

---

*此 skill 由 Hermes 維護。Pattern 檔案存在於 `60-AI-Protocols/Hermes/skills/workflow/pattern-pending/patterns/`*
