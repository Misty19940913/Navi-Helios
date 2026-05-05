---
title: SRC-002 openclaw llm-wiki-admin
type: source
folder: 43_Sources
status: active
tags:
  - llm-wiki
  - source
  - openclaw
  - mebusw
time_created: 2026-04-27
time_modified: 2026-04-27
parent:
  - 60_Shared/03_Project-Wikis/llm-wiki-research/index
related:
  - SRC-001_Karpathy-LLM-Wiki
  - SRC-003_sdyckjq-lab-v3.3
source_url: https://raw.githubusercontent.com/openclaw/skills/main/skills/mebusw/llm-wiki-admin/SKILL.md
author: mebusw (openclaw)
date: 2026-04
version: "1.0"
confidence: extracted
---

# SRC-002：openclaw llm-wiki-admin

## 基本資訊

| 欄位 | 值 |
|------|-----|
| 作者 | mebusw（openclaw） |
| URL | https://raw.githubusercontent.com/openclaw/skills/main/skills/mebusw/llm-wiki-admin/SKILL.md |
| 類型 | Claude Code Skill（中文管理 workflow） |
| 語言 | 中文 |
| 依賴 | `/obsidian` skill |

## 核心理念

> **不是 RAG，是編譯。** RAG 每次查詢都重新推导；Wiki 把知識編譯一次，持續複利積累。

三層架構：
```
raw/      ← 原始資料（只讀，永不修改）
wiki/     ← LLM 編寫並維護的 Markdown 知識頁面
schema.md ← Wiki 結構規則（頁面類型、格式、命名、工作流）
purpose.md ← 項目目標與範圍（LLM 的「北極星」）
```

`schema.md` + `purpose.md` 是系統的「憲法」。

## 四種操作模式

| 用戶說 | 进入模式 |
|--------|---------|
| 初始化 / 新建 wiki / 配置项目 | → [INIT] 初始化 |
| 摄入 / ingest / 把这个加进 wiki / 读这篇文章 | → [INGEST] 摄入 |
| wiki 里有没有 / 查一下 / 问题 | → [QUERY] 查询 |
| 健康检查 / lint / 孤立页面 / 检查 wiki | → [LINT] 健康检查 |

## [INIT] 初始化

Step 1: Interview（一次問卷）
- 使用場景: 🔬研究調研 📚閱讀積累 🌱個人成長 💼商業/團隊 📄通用
- 主題領域
- 主要資料類型（論文/書籍/網文/筆記/會議記錄）
- 寫作語言

Step 2: Generate config files
- 讀取 `references/templates.md` 獲取模板
- 生成5個文件: `schema.md`, `purpose.md`, `wiki/index.md`, `wiki/log.md`, `wiki/overview.md`

Step 3: 寫入 Obsidian vault（需要 /obsidian skill）
Step 4: Confirm completion

## [INGEST] 攝入新資料

Pre-flight：Tell user what was discovered before writing files

Steps：
1. Read raw material in full
2. Read `wiki/index.md`
3. Read `schema.md`
4. Identify entities, concepts, cases, sources
5. For each concept: existing page → append, new → create
6. **MUST preserve**: all numbers, percentages, case details, original storylines, contributor quotes
7. Add bidirectional `[[Wikilink]]` — at page bottom in `## Related` section（NOT in frontmatter）
8. Contradictions: note both versions with `> ⚠️ 矛盾：...`，do NOT arbitrate
9. Update `wiki/index.md`（append, preserve all existing entries）
10. Append to `wiki/log.md`（`## [YYYY-MM-DD] ingest | 來源標題`，reverse order — newest at top）
11. Update `wiki/overview.md`（2-5 paragraph overview）

Reporting: "已更新 4 個頁面，新建 2 個。發現 1 處矛盾，已在 `zzz.md` 標注。"

**ABSOLUTE PROHIBITIONS**：
- 修改 `raw/` 目錄中的任何文件
- 一次攝入涉及 5-15 個 wiki 頁面，不要跳過交叉引用

## [QUERY] 查詢

1. Read `wiki/index.md`, locate relevant pages
2. Read 2-5 most relevant wiki pages（NOT re-search raw materials）
3. If raw details needed, check corresponding raw/ source
4. Answer citing raw data and cases, use `(→ [[page-name]])` inline citations
5. Append to `wiki/log.md`

Ask: "要把這個分析保存為 wiki 頁面嗎？好的洞見不應消失在對話歷史裡。"

## [LINT] 健康檢查

Checks：
- 孤立頁面（沒有任何入鏈）
- 缺失頁面（被 `[[Wikilink]]` 引用但尚不存在）
- 矛盾內容（不同頁面對同一概念描述衝突）
- 未索引頁面（在 `wiki/` 存在但未出現在 `index.md`）
- 缺失 frontmatter
- 過時內容（`status: outdated` 的頁面）

Lint 原則：展示所有發現，再問用戶是否處理，不擅自批量修改。

## 內容原則

**Must preserve**：
- 所有百分比、數字、時間盒數值
- 真實案例完整故事線
- 教練實踐具體對話片段
- 貢獻者原始表達方式

**Absolute prohibition**：
- 修改 `raw/` 目錄的任何文件
- 刪除或簡化原始案例數據
- 未標注來源地合併不同來源的說法
- 靜默覆蓋矛盾——矛盾是比乾淨頁面更有價值的信號

## 與 Karpathy 版本的差異

| 維度 | Karpathy | openclaw |
|------|----------|----------|
| purpose.md | 無 | 有（明確「北極星」）|
| 場景模板 | 無 | 5 種場景（研究/閱讀/個人/商業/通用）|
| 攝入前預覽 | 無 | 強制（"Pre-flight告知"）|
| 矛盾處理 | 提及 | 明確（`> ⚠️ 矛盾：...`，不裁決）|
| /obsidian 依賴 | 無 | 有 |

## 參考文件

- `references/templates.md` — 5種場景完整 schema + purpose 原始模板
- `references/ingest-logic.md` — 攝入兩步流程詳解
