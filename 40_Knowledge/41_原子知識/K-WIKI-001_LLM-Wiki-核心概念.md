---
title: 'K-WIKI-001: LLM Wiki 核心概念'
type: atomic
status: seed
tags:
- llm-wiki
- knowledge-base
- rag
time_created: 2026-04-26
time_modified: '2026-04-27'
parent: null
related: []
confidence: extracted
sources: "[[SRC-001]]"
used_in: []
contradictions: []
---

# K-WIKI-001: LLM Wiki 核心概念

> Source: [[SRC-001]]

## 定義

LLM Wiki 是一種使用 LLM 構建和維護的個人知識庫模式。核心是讓 LLM 在原始來源和用戶之間建立一個**結構化的、可持續更新的 wiki 層**。

## 與 RAG 的根本差異

| | RAG | LLM Wiki |
|---|---|---|
| 每次回答 | 從頭閱讀原始文件 | 直接讀已維護好的 wiki |
| 知識積累 | 無，每次重新推導 | 有，持續複合 |
| 矛盾處理 | 每次隨機發現 | 已預先標記 |
| 複雜問題 | 需要即時綜合多份文件 |  cross-references 已在 wiki 中 |

> 原文：「Ask a subtle question that requires synthesizing five documents, and the LLM has to find and piece together the relevant fragments every time. Nothing is built up.」

## 核心主張

**Wiki 是持續複合的 artifact（artifact = 人造物、成果）。**

- cross-references 已經在那裡
- 矛盾已經被標記
- 綜合已經反映所有攝入的內容
- Wiki 隨著每次來源添加和每次提問變得越來越豐富

## 人機分工

- **人類負責**：策劃來源、引導分析、問好問題、思考意義
- **LLM 負責**：所有繁瑣的 bookkeeping——總結、跨頁面引用、歸檔、記帳

## 為何有效

人類放棄 wiki 是因為維護負擔增長速度快於價值。LLM 不會無聊、不會忘記更新 cross-reference、可以一次修改 15 個檔案。

## 相關頁面

- [[K-WIKI-002]] — 三層架構
- [[K-WIKI-003]] — 知識維護瓶頸
