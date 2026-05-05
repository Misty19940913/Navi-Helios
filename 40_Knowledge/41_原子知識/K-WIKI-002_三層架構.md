---
title: 'K-WIKI-002: 三層架構'
type: atomic
status: seed
tags:
- llm-wiki
- architecture
time_created: 2026-04-26
time_modified: '2026-04-27'
parent: null
related: []
confidence: extracted
sources: "[[SRC-001]]"
used_in: []
contradictions: []
---

# K-WIKI-002: 三層架構

> Source: [[SRC-001]]

## 三層定義

### Layer 1：Raw Sources（原始來源）

-  curated collection of source documents
- 格式：Articles、papers、images、data files
- **不可修改**——LLM 只讀取，不改動
- 這是 source of truth

### Layer 2：The Wiki（蒸餾層）

- 由 LLM 生成的 markdown 檔案目錄
- 包含：summaries、entity pages、concept pages、comparisons、overview、synthesis
- **LLM 完全擁有這層**——創建頁面、根據新來源更新、維護 cross-references、保持一致性

### Layer 3：The Schema（操作約定）

- 一份文件（如 CLAUDE.md 或 AGENTS.md）
- 告訴 LLM：wiki 的結構、約定俗成的規範、執行工作流的步驟
- 由人類和 LLM 共同演化（co-evolve）
- 這是讓 LLM 成為紀律良好的 wiki 維護者，而不是通用聊天機器人的關鍵設定檔

## 對應到你的 Vault

```
40_Knowledge/
├── SCHEMA.md              ← Layer 3（操作約定）
├── purpose.md             ← Schema 附屬：領域目標
├── 43_Sources/            ← Layer 1（Raw Sources，不可修改）
├── 41_原子知識/            ← Layer 2（Wiki 蒸餾層）
└── 42_MOC/                ← Layer 2 延伸：查詢結果沉澱
```

## Schema 的角色

Schema 不是一次性寫完就不變的——它是 Living Document，隨著：
- 你對領域的理解加深
- 發現哪些約定有效、哪些不適配
- 工具和工作流的調整

而不斷演化。

## 相關頁面

- [[K-WIKI-001]] — LLM Wiki 核心概念
- [[K-WIKI-003]] — 知識維護瓶頸
