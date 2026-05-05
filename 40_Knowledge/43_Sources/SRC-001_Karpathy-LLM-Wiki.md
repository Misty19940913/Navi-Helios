---
title: SRC-001 Karpathy LLM Wiki
type: source
folder: 43_Sources
status: active
tags:
  - llm-wiki
  - source
  - karpathy
time_created: 2026-04-27
time_modified: 2026-04-27
parent:
  - 60_Shared/03_Project-Wikis/llm-wiki-research/index
related:
  - SRC-002_openclaw-llm-wiki-admin
  - SRC-003_sdyckjq-lab-v3.3
source_url: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
author: Andrej Karpathy
date: 2026-04-04
version: "1.0"
confidence: extracted
---

# SRC-001：Karpathy LLM Wiki

## 基本資訊

| 欄位 | 值 |
|------|-----|
| 作者 | Andrej Karpathy |
| 日期 | 2026-04-04 |
| URL | https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f |
| 類型 | Gist 概念文檔 |
| 語言 | 英文 |
| 版本 | 1.0 |

## 核心理念

> Most people's experience with LLMs and documents looks like RAG... The idea here is different. Instead of just retrieving from raw documents at query time, the LLM incrementally builds and maintains a persistent wiki.

**不是 RAG，是編譯。** 知識編譯一次，持續複利累積。

## 三層架構

```
Raw Sources  →  Immutable collection of source documents
     ↓
Wiki         →  LLM-generated markdown files (summaries, entity pages, concept pages, comparisons, overview, synthesis)
     ↓
Schema       →  CLAUDE.md / AGENTS.md defining structure and workflows
```

## 三個核心操作

### Ingest
Drop a new source into raw collection, tell LLM to process it:
1. LLM reads source
2. Discusses takeaways
3. Writes summary page
4. Updates index
5. Updates relevant entity/concept pages
6. Appends log entry

> A single source might touch 10-15 wiki pages.

### Query
Ask questions against the wiki. LLM searches relevant pages, reads them, synthesizes answer with citations. Good answers can be filed back into the wiki as new pages.

### Lint
Periodically health-check the wiki:
- Contradictions
- Stale claims superseded by new sources
- Orphan pages
- Missing cross-references
- Data gaps

LLM suggests new questions and sources to investigate.

## 兩個關鍵檔案

| 檔案 | 用途 |
|------|------|
| `index.md` | Content-oriented catalog, organized by category, LLM updates on every ingest |
| `log.md` | Append-only chronological record (## [2026-04-02] ingest \| Article Title) |

## Optional CLI / Tools

- **qmd** — local search engine for markdown (BM25/vector + LLM re-ranking, CLI + MCP server)
- **Obsidian Web Clipper** — browser extension for converting web articles to markdown
- **Ctrl+Shift+D** — download images locally
- **Obsidian graph view** — visualize wiki shape
- **Marp** — slide decks
- **Dataview** — frontmatter queries

## Why This Works

> The tedious part is the bookkeeping — cross-references, summaries, contradictions, consistency. Humans abandon wikis because maintenance burden grows faster than value. LLMs don't get bored, don't forget, and can touch 15 files in one pass. The wiki stays maintained because the cost of maintenance is near zero.

## 與其他來源的差異

| 維度 | 本來源 | openclaw | sdyckjq-lab v3.3 |
|------|--------|----------|-------------------|
| 類型 | Gist 概念文檔 | Skill 定義 | 完整生產系統 |
| 工作流 | 3 | 4 | 9 |
| 腳本 | 0 | 0 | 20+ |
| 快取 | 無 | 無 | 有 |
| Confidence 標籤 | 無 | 無 | 有 |

## 精華摘錄

> You never (or rarely) write the wiki yourself — the LLM writes and maintains all of it. You're in charge of sourcing, exploration, and asking the right questions.
