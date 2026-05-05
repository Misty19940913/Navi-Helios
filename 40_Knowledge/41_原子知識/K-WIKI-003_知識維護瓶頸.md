---
title: 'K-WIKI-003: 知識維護瓶頸'
type: atomic
status: seed
tags:
- llm-wiki
- maintenance
- knowledge-base
time_created: 2026-04-26
time_modified: '2026-04-27'
parent: null
related: []
confidence: extracted
sources: "[[SRC-001]]"
used_in: []
contradictions: []
---

# K-WIKI-003: 知識維護瓶頸

> Source: [[SRC-001]]

## 維護的真正代價

維護知識庫最繁瑣的部分**不是閱讀或思考**，而是 bookkeeping：

- 更新 cross-references
- 保持摘要最新
- 記錄新數據何時與舊聲明矛盾
- 維持數十個頁面之間的一致性

## 人類為何放棄 Wiki

> 原文：「Humans abandon wikis because the maintenance burden grows faster than the value.」

維護負擔增長速度快於價值。

## LLM 的角色

LLM 的三大優勢：
1. **不會無聊**——不會因為重複性工作而疲憊
2. **不會忘記**——不會忘記更新某個 cross-reference
3. **可大規模操作**——一次可以修改 15 個檔案

維護成本趨近於零 → Wiki 得以持續運行。

## 最重要的觀念：Memex

> 原文：「The idea is related in spirit to Vannevar Bush's Memex (1945) — a personal, curated knowledge store with associative trails between documents. Bush's vision was closer to this than to what the web became. The part he couldn't solve was who does the maintenance. The LLM handles that.」

Vannevar Bush（1945）的 Memex 願景：私人、主動策劃、文檔之間的連接本身是有價值的。Web 走向了公共/被動，Bush 的願景更接近 LLM Wiki 的模式。他當年無法解決的是誰來做維護工作——LLM 補上了這個缺口。

## 應用場景

Karpathy 提到的可能應用：
- **個人**：追蹤目標、健康、心理、自我提升
- **研究**：數週或數月深入一個主題，閱讀論文、文章、報告，逐步構建全面的 wiki
- **讀書**：每讀一章歸檔，建立角色、主題、情節線的頁面，最終得到一個豐富的陪伴 wiki
- **商業/團隊**：由 LLM 維護的內部 wiki，餵入 Slack 討論、會議記錄、項目文檔、客戶來電
- **競爭分析、盡職調查、旅程規劃、課程筆記、業餘深入研究**

## 相關頁面

- [[K-WIKI-001]] — LLM Wiki 核心概念
- [[K-WIKI-002]] — 三層架構
- [[W-KNOWLEDGE-001]] — Vannevar Bush 與 Memex
