---
title: Sources Index
description: 所有來源的索引，43_Sources 的入口
created: 2026-04-26
updated: 2026-04-27
---

# Sources Index

## 格式規範

每個來源檔案命名：`SRC-{流水號}_{標題}.md`

例如：`SRC-001_Karpathy-LLM-Wiki.md`

---

## Sources

| ID | 標題 | 作者 | 類型 | 攝入日期 | 狀態 |
|----|------|------|------|----------|------|
| SRC-001 | Karpathy LLM Wiki | Andrej Karpathy | article/gist | 2026-04-27 | ✓ 已蒸餾 |
| SRC-002 | openclaw llm-wiki-admin | mebusw | skill | 2026-04-27 | ✓ 已蒸餾 |
| SRC-003 | sdyckjq-lab llm-wiki-skill v3.3 | sdyckjq-lab | skill | 2026-04-27 | ✓ 已蒸餾 |
| SRC-004 | B-自我身份目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已蒸餾 |
| SRC-005 | B2-商業模式畫布目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已蒸餾 |
| SRC-006 | H3.0-元系統目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已蒸餾 |
| SRC-007 | W-智慧價值目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已蒸餾 |
| SRC-008 | K-SYS-知識管理目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已蒸餾 |
| SRC-009 | K-SELF-自我成長目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已格式化清理 |
| SRC-010 | K-BIZ-商業電商目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已格式化清理 |
| SRC-011 | L-人生設計目錄（41_原子知識） | — | source | 2026-04-26 | ✓ 已格式化清理 |
| SRC-017 | 10_Inbox 剪輯片段（20個 ChatGPT 對話存檔） | — | source | 2026-04-26 | ✓ 已移入 Sources |
| SRC-018 | 410原子化知識庫（175個舊格式檔案） | — | source | 2026-04-27 | ✓ 已蒸餾至 41_原子知識/ |
| SRC-019 | 330個人金融知識庫（39個教材檔案） | — | source | 2026-04-27 | ✓ 已蒸餾 |
| SRC-020~025 | K-CAREER/K-FIN/K-TRADING/K-AI/K-HOBBY/K-CONTENT | — | — | 2026-04-26 | ✗ 目錄不存在 |

---

## SRC-001 — Karpathy LLM Wiki

- **原始 URL**：`https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f`
- **作者**：Andrej Karpathy
- **攝入日期**：2026-04-27
- **為何重要**：LLM Wiki 方法論的原點，定義了核心概念
- **蒸餾寫入**：
  - K-WIKI-001（核心概念：Wiki vs RAG）
  - K-WIKI-002（三層架構）
  - K-WIKI-003（維護瓶頸）
  - W-KNOWLEDGE-001（Memex 淵源）

---

## SRC-002 — openclaw llm-wiki-admin

- **原始 URL**：`https://raw.githubusercontent.com/openclaw/skills/main/skills/mebusw/llm-wiki-admin/SKILL.md`
- **作者**：mebusw（openclaw）
- **攝入日期**：2026-04-27
- **為何重要**：中文管理 workflow，4-mode（INIT/INGEST/QUERY/LINT），多了 `purpose.md` 作北極星
- **蒸餾寫入**：
  - SKILL.md 維護者指南（與 SRC-001/003 整合）

---

## SRC-003 — sdyckjq-lab llm-wiki-skill v3.3

- **原始 URL**：`https://raw.githubusercontent.com/sdyckjq-lab/llm-wiki-skill/main/SKILL.md`
- **作者**：sdyckjq-lab（Kiro）
- **版本**：3.3.0，License: MIT
- **攝入日期**：2026-04-27
- **為何重要**：完整生產系統，9 個工作流，20+ 腳本，定義了 confidence 等級
- **蒸餾寫入**：
  - SKILL.md 維護者指南（與 SRC-001/002 整合）
  - SCHEMA.md v1.2（第 7-15 工作流章節）

---

## 最近新增

- **2026-04-27**：SRC-001/002/003 三個 LLM Wiki 來源完整蒸餾，建立 `60_Shared/03_Project-Wikis/llm-wiki-research/SKILL.md` 維護者指南
- **2026-04-27**：SRC-018 410原子化知識庫 → 蒸餾至 41_原子知識/
- **2026-04-27**：SRC-019 330個人金融知識庫 → 40 個 atomic pages（K-FIN-021~059）
- **2026-04-26**：SRC-017 10_Inbox → 20 個 ChatGPT 對話存檔移入 43_Sources
- **2026-04-26**：SRC-011 L-人生設計 → 29 個檔案格式化清理
- **2026-04-26**：SRC-007 W-智慧價值 → K-WEALTH-001~023（23 個 atomic 頁）
- **2026-04-26**：SRC-006 H3.0-元系統 → K-HUMAN3-001~046（46 個 atomic 頁）
- **2026-04-26**：SRC-005 B2-商業模式畫布 → K-BIZ-001~022（22 個 atomic 頁）
- **2026-04-26**：SRC-004 B-自我身份 → K-SELF-010_自我身份練習.md
