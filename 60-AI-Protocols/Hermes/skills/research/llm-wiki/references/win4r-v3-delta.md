# win4r adapters/hermes v3.0.0 vs Hermes llm-wiki v2.1.0 — Delta Analysis

Source: `https://github.com/win4r/llm-wiki-claude-skill` (`adapters/hermes/SKILL.md`)
Fetched via: `curl -sL https://raw.githubusercontent.com/win4r/llm-wiki-claude-skill/main/adapters/hermes/SKILL.md`

---

## 什麼是 win4r adapter？

win4r 把 Karpathy 的 LLM Wiki 做成 Claude Code skill，並同時適配了 **hermes** 和 **codex** 兩種 agent。
`adapters/hermes/SKILL.md` 是專為 Hermes Agent 寫的版本，v3.0.0（2026-05 初）。
你的 `~/.hermes/skills/research/llm-wiki/SKILL.md` 是 Hermes Agent 內建的，v2.1.0。

---

## 版本對照

| 維度 | win4r adapters/hermes | Hermes built-in llm-wiki |
|------|----------------------|--------------------------|
| version | **3.0.0** | 2.1.0 |
| multi-wiki container | ✅ `~/wiki/` + 共享 `.obsidian/` | ❌ 無 |
| daily log split | ✅ `log/YYYYMMDD.md` | ❌ `log.md`（500 筆才 rotate） |
| lint script | ✅ 完整 Python，可執行 | ❌ stub，只有步驟說明無代碼 |
| compile 操作 | ✅ 定義完整 SOP | ❌ 沒有 |
| mermaid/KaTeX 規範 | ✅ | ❌ |
| raw/refs/ 指標檔 | ✅ | ❌ |
| `used_in:` frontmatter | ❌ | ✅ 反向鏈結追蹤 |
| `confidence:` frontmatter | ❌ | ✅ |
| sha256 re-ingest drift | ❌ | ✅ |
| Obsidian headless 方案 | ❌ | ✅ |

---

## win4r v3.0.0 的完整 SKILL.md 核心內容（可直接引用）

### Structure
```
~/wiki/                      ← Container (Obsidian vault root)
├── .obsidian/               ← Shared vault config (covers all sub-wikis)
├── README.md                ← Container-level sub-wiki index
└── llm-wiki/                ← This skill operates here by default
    ├── SCHEMA.md            # Domain, conventions, tag taxonomy (read-first)
    ├── index.md             # Sectioned content catalog
    ├── log/                 # Per-day action log (YYYYMMDD.md)
    ├── raw/                 # Immutable sources — NEVER modify
    │   ├── articles/
    │   ├── papers/
    │   ├── transcripts/
    │   ├── assets/
    │   └── refs/            # Pointer files for large binaries kept outside raw/
    ├── entities/            # People, orgs, products, models
    ├── concepts/            # Topics, techniques, methods
    ├── comparisons/         # Side-by-side analyses
    ├── queries/             # Filed query answers worth keeping
    └── _archive/            # Superseded content (kept, de-indexed)
```

### Log Convention
One file per day at `log/YYYYMMDD.md`. H1 = ISO date. Entry format:
```
## [HH:MM] <op> | <subject>
- Raw: raw/papers/<slug>.md
- Created: entities/X.md, concepts/Y.md
```
Ops: `ingest`, `query`, `lint`, `compile`, `create`, `update`, `merge`, `archive`, `migrate`.

### Page Sizing
Target: **400–1200 words**. When >1200 words → split into subfolder:
```
concepts/<topic>/
├── index.md          # Overview + list of sub-pages with one-line summaries
├── <aspect-1>.md
├── <aspect-2>.md
└── <aspect-3>.md
```

### Compile SOP
1. Orient: read SCHEMA.md + index.md + target subtree
2. Plan split for pages >1200 words. **Confirm with user before writing.**
3. Propose merges for near-duplicates. Confirm, then rewrite.
4. Rewrite index.md so every page appears once with hierarchy (indented bullets).
5. Re-run lint — broken wikilinks are common after moves.
6. Log to `log/<today-YYYYMMDD>.md`.

### Pitfalls (win4r 版本)
- Never modify `raw/` — sources are immutable
- Always orient first — SCHEMA + index + recent log every session
- Always update index.md and today's `log/YYYYMMDD.md`
- Don't create pages for passing mentions
- Every page needs ≥2 outbound `[[wikilinks]]`
- Tags only from SCHEMA taxonomy
- Handle contradictions explicitly
- Ask before mass updates (10+ pages)
- Keep pages scannable (400–1200 words)
- Don't cross-contaminate with Claude Code memory — research in wiki, preferences in memory

### Lint Checks (win4r version, severity order)
1. **broken_links** — wikilinks to non-existent pages
2. **missing_frontmatter** — pages missing required fields
3. **orphans** — pages with zero inbound links
4. **unknown_tags** — tags not in SCHEMA taxonomy
5. **not_indexed** — pages not in index.md
6. **stale_pages** — `updated` >90 days ago
7. **oversized_pages** — >1200 words (candidate for compile/split)

### Diagram & Math Convention
- **Diagrams** → Mermaid. Never ASCII art (rots fast, unsearchable).
- **Math** → KaTeX. Inline `$...$` or block `$$...$$`.

### Large Binaries
Videos, model weights, datasets, PDFs >10 MB → **do not copy into wiki**.
Create pointer at `raw/refs/<slug>.md`:
```yaml
---
kind: ref
external_path: /Volumes/external/models/llama-3-70b/
size: ~140 GB
---
Llama 3 70B weights, downloaded 2026-01-15 from HuggingFace.
```

---

## 與 Navi Helios 40_Knowledge 的實際差距（磁碟實查）

時間：2026-05-05 深夜。目錄結構如下：

```
40_Knowledge/
├── wiki/
│   └── log.md              ← 單一 INGEST 記錄（2026-05-05）
├── 41_原子知識/
│   ├── K-SELF-*.md         ← 自我成長相關（~12篇）
│   ├── K-CONTENT-*.md      ← 內容創作相關（~14篇）
│   ├── K-BIZ-*.md          ← 商業/Business（~9篇）
│   ├── K-AI-*.md           ← AI 相關（4篇）
│   ├── K-SYS-*.md          ← 系統/方法論（3篇：K-SYS-036, K-SYS-060, K-SYS-061）
│   ├── K-FIN-054_財富四象限理論.md
│   ├── K-CAREER-014_職業研究方法.md
│   ├── K-000-價值觀探索.md  ← 特殊命名（無前綴類別）
│   └── K-SELF-026_價值觀探索.md
└── 42_MOC/
    ├── K-SELF_自我成長_MOC.md
    └── K-CONTENT_內容創作_MOC.md
```

**你的設計贏過 win4r 的點：**
- MOC 多層結構（win4r 只有 flat `index.md`）
- `used_in:` 反向追蹤
- `confidence:` 品質信號
- sha256 re-ingest drift detection
- Obsidian headless 完整方案

**你缺的關鍵東西：**
- `raw/` 沒有（INGEST 沒有留存原始素材）
- `entities/`、`comparisons/`、`queries/` 沒有
- `_archive/` 沒有
- lint script 是空的（skill 裡只有 stub）
- compile SOP 完全沒有
- log 是單一檔案（會變成萬行巨獸）
- 沒有 mermaid/KaTeX 規範

---

## 對齊方向（給 user 的選項）

win4r 給了三個明確方向：
- **選項 A**：新建獨立 `~/wiki/llm-wiki/`，與 Navi Helios 完全分開
- **選項 B**：把 Navi Helios 直接對齊成 win4r 結構（風險高）
- **選項 C**：`~/wiki/llm-wiki/` 當純 research wiki，Navi Helios 當 Life OS

（最終由 Misty 決定方向後執行。）
