---
title: SRC-003 sdyckjq-lab llm-wiki-skill v3.3.0
type: source
folder: 43_Sources
status: active
tags:
  - llm-wiki
  - source
  - sdyckjq-lab
  - kiro
  - production
time_created: 2026-04-27
time_modified: 2026-04-27
parent:
  - 60_Shared/03_Project-Wikis/llm-wiki-research/index
related:
  - SRC-001_Karpathy-LLM-Wiki
  - SRC-002_openclaw-llm-wiki-admin
source_url: https://raw.githubusercontent.com/sdyckjq-lab/llm-wiki-skill/main/SKILL.md
author: sdyckjq-lab（Kiro）
date: 2026-04
version: 3.3.0
license: MIT
confidence: extracted
---

# SRC-003：sdyckjq-lab llm-wiki-skill v3.3.0

## 基本資訊

| 欄位 | 值 |
|------|-----|
| 作者 | sdyckjq-lab（Kiro） |
| Repo | https://github.com/sdyckjq-lab/llm-wiki-skill |
| URL | https://raw.githubusercontent.com/sdyckjq-lab/llm-wiki-skill/main/SKILL.md |
| 版本 | 3.3.0 |
| License | MIT |
| 類型 | 完整生產系統 |
| 語言 | 中文 + 英文 |
| 腳本數量 | 20+ |

## 九個工作流

| 用戶意圖 | 工作流 |
|---------|--------|
| "初始化知識庫" / "新建 wiki" | `init` |
| URL / file path / "添加素材" / "消化" | `ingest` |
| "批量消化" / folder path | `batch-ingest` |
| "關於 XX" / "查詢" / "XX 是什麼" | `query` |
| "給我講講 XX" / "深度分析 XX" / "digest XX" | `digest` |
| "對比一下 X 和 Y" / "整理時間線" | `digest`（with format）|
| "檢查知識庫" / "健康檢查" / "lint" | `lint` |
| "知識庫狀態" / "現在有什麼" | `status` |
| "畫個知識圖譜" / "graph" | `graph` |
| "刪除素材" / "remove" / "delete" | `delete` |
| "結晶化" / "crystallize" | `crystallize` |

## ingest 工作流（最複雜）

### Step 0 — 隱私確認
每次 session 第一次 ingest 前：請用戶確認「沒有電話號碼、身份證號、API Key、密碼」

### Step 1 — 來源路由
透過 `source-registry.sh`：
- URL → 適配器匹配（baoyu-url-to-markdown、wechat-article-to-markdown、youtube-transcript）
- 本地檔案 → `source-registry.sh match-file`
- 純文字粘貼 → `source-registry.sh get plain_text`
- 適配器不可用 → fallback hints

### Step 2 — Content-length triage
- \>= 1000 chars → Full processing
- < 1000 chars → Simplified processing

### Step 3 — 完整處理（兩步 JSON 中間層）
**Step 3a**：結構化分析 → JSON
```json
{
  "entities": [...],
  "topics": [...],
  "connections": [...],
  "contradictions": [...],
  "confidence": "EXTRACTED | INFERRED | AMBIGUOUS | UNVERIFIED"
}
```

**Step 3b**：頁面生成（使用 Step 3a 結果 + 現有 wiki 頁面）

快取檢查：`cache.sh check` → HIT → 跳過 LLM call

### Step 4 — Simplified processing
較短 entities，無 topic pages，無 overview 更新

### Step 5 — 來源頁面創建
`create-source-page.sh`（atomic write + cache update）

## batch-ingest 工作流

1. Lists all files in folder，顯示 count，請求確認
2. 對每個檔案執行 `cache.sh check` — cache hit = skip
3. **每 5 個檔案暫停**，顯示進度，詢問是否繼續
4. 完成後：完整 index.md 刷新 + 摘要報告

## query 工作流

1. 從 `.wiki-schema.md` 擴展別名（同義詞組，不跨組傳播）
2. Grep 搜尋 + 關鍵詞擴展，相關性排序
3. 單頁長度限制：>2000 chars → frontmatter + 前 500 + grep 命中段落
4. 段落限制：最多 15 段落（每關鍵詞 3 段落）
5. >= 3 個來源綜合 → 提示保存
6. 保存的查詢頁面標記 `derived: true`，未來 ingest 視為次要來源

## digest 工作流

跨多個來源深度綜合 → 持久化 `wiki/synthesis/` 頁面

三種輸出格式：
- Deep Dive → 模板A
- Comparison Table → 模板B
- Timeline with Mermaid gantt → 模板C

觸發：`"對比"` → 模板B，`"時間線"` → 模板C，default → 模板A

單頁長度限制：>3000 chars → frontmatter + 核心觀點 + 相關段落

## lint 工作流

- **Step 0（機械）**：`lint-runner.sh` — orphan pages, broken links, index inconsistencies
- **Step 3（AI 判斷）**：矛盾、缺失交叉引用、confidence 等級報告（抽查）、補充修復建議
- 每 10 次 ingest → 提示運行 lint

## status 工作流

1. `adapter-state.sh summary-human`
2. `source-signal-coverage.js` → JSON coverage data
3. 顯示：source distribution、wiki page counts、purpose.md 存在性、recent activity、adapter states、suggestions

## graph 工作流

1. 掃描所有 `[[Wikilinks]]`
2. 生成 `wiki/knowledge-graph.md`（Mermaid，>50 edges 最多 30 nodes）
3. 生成 `wiki/graph-data.json`（`build-graph-data.sh`，Node helper，需要 jq）
4. 生成 `wiki/knowledge-graph.html`（`build-graph-html.sh`，wash/watercolor style）
5. **無自動標注**：用戶手動優化 top 3-5 edges

## 生產腳本清單

| 腳本 | 用途 |
|------|------|
| `init-wiki.sh` | 初始化 wiki 目錄結構 |
| `cache.sh` | 快取管理（check/update/HIT/MISS/auto-repair）|
| `create-source-page.sh` | 來源頁面 atomic write + cache update |
| `adapter-state.sh` | 適配器可用性檢查/分類 |
| `source-registry.sh` | 來源類型註冊 + URL/file 匹配 |
| `lint-runner.sh` | 機械 wiki 健康檢查 |
| `lint-fix.sh` | 自動修復 lint 問題 |
| `build-graph-data.sh` | 生成圖 JSON（含社區檢測）|
| `build-graph-html.sh` | 生成互動 HTML 可視化 |
| `graph-analysis.js` | Louvain 社區 + 3-signal 邊權重 |
| `source-signal-coverage.js` | 每來源覆蓋率分析 |
| `validate-step1.sh` | 驗證 Step 1 JSON 結構 |
| `wiki-compat.sh` | 向後相容性檢查 |
| `runtime-context.sh` | 運行時上下文幫手 |
| `shared-config.sh` | 共享配置 |
| `delete-helper.sh` | 來源刪除 |
| `hook-session-start.sh` | Session 開始 hook |
| `source-record-contract.tsv` | 來源記錄 schema |

## 快取系統

`cache.sh check ""` before every ingest

快取狀態：
- `HIT` — 直接使用
- `HIT(repaired)` — 自我修復
- `MISS:no_entry` — 無記錄
- `MISS:hash_changed` — hash 變化
- `MISS:no_source` — 來源消失
- `MISS:repaired_needs_verify` — 修復後需驗證

快取檔案：`.wiki-cache.json`

`create-source-page.sh` 執行 atomic write + cache update

## 適配器/依賴系統

5-state 模型：`not_installed` | `env_unavailable` | `runtime_failed` | `unsupported` | `empty_result`

來源註冊表：10列 TSV（source_id, label, category, input_mode, match_rule, raw_dir, adapter_name, dependency_name, dependency_type, fallback_hint）

可選依賴：baoyu-url-to-markdown、wechat-article-to-markdown、youtube-transcript

## Confidence 等級

| 等級 | 意義 |
|------|------|
| `extracted` | 直接從來源引出，有引文 |
| `inferred` | 多來源推導 |
| `ambiguous` | 來源本身有歧義 |
| `unverified` | AI 背景知識，無來源 |

## 與其他來源的差異

| 維度 | Karpathy | openclaw | sdyckjq-lab v3.3 |
|------|----------|----------|-------------------|
| 工作流數量 | 3 | 4 | **9** |
| 腳本數量 | 0 | 0 | **20+** |
| 快取機制 | 無 | 無 | **有** |
| 多 wiki 支援 | 無 | 無 | **有** |
| 來源適配器 | 無 | 無 | **有** |
| 批次處理 | 無 | 無 | **有（每5檔案暫停）** |
| Confidence 標籤 | 無 | 無 | **有** |
| 兩步攝入 | 無 | 無 | **有（JSON 中間層）** |
| 圖譜輸出 | Obsidian | 無 | **Mermaid + JSON + HTML** |
| 隱私檢查 | 無 | 無 | **有** |

## 6 個其他來源缺少的生產功能

1. **快取系統**（`.wiki-cache.json`）
2. **來源適配器**（baoyu、wechat、youtube）
3. **批次暫停機制**（每 5 個檔案）
4. **多語言支援**（中/英文模板切換）
5. **隱私自我檢查**（強制用戶確認）
6. **Lint 腳本**（lint-runner.sh + lint-fix.sh）
