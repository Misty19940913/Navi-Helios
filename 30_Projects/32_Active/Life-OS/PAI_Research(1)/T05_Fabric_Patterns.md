# T05 — Fabric Patterns

> 組ID：T05
> 來源：Releases/v5.0.0/.claude/skills/Fabric/Patterns/*/*.md
> 檔案總數：309
> 採樣分析：80+ 個
> 優先級：高

---

## 檔案結構分析

Fabric Pattern 是由 Daniel Miessler 發起的 Open Source 專案「Fabric」的核心元件，定位為「AI 時代的提示工程模式庫」。每一個 Pattern 都是一個獨立的提示模板，用於解決特定任務。

### 標準目錄結構

每個 Pattern 為一個資料夾，內含：

```
pattern_name/
├── system.md      # 核心系統提示（幾乎每個 pattern 都有）
├── user.md        # 使用者輸入模板（多數為空）
├── README.md      # 說明文件（部分有）
└── dmiessler/     # 作者個人化版本子目錄
    └── extract_wisdom-1.0.0/
        ├── system.md
        └── user.md
```

### system.md 的兩種主流結構

**結構A — 標準結構（含 GOALS 段落）：**

```
# IDENTITY
你是一個___________的___________

# GOALS
1. _____________。
2. _____________。

# STEPS
- 步驟一
- 步驟二

# OUTPUT
（輸出格式說明）

# POSITIVE / NEGATIVE EXAMPLES
（參考範例）

# OUTPUT INSTRUCTIONS
- 嚴格遵循格式
- 僅輸出 Markdown

# INPUT
…
```

**結構B — 精簡結構（無 GOALS 段落）：**

```
# IDENTITY and PURPOSE
你是一個___________的___________

# STEPS
- …

# OUTPUT INSTRUCTIONS
- …

# INPUT
…
```

### README.md 的標準格式

包含：Description（問題與解決方案）、Functionality（功能說明）、Usage（使用方式）、Output（輸出範例）、Meta（作者與版本資訊）。

---

## 內容差異分析

309 個 Pattern 可分為以下類別：

| 類別 | 代表 Pattern | 數量 | 核心功能 |
|------|------------|------|---------|
| **提取類** | extract_wisdom, summarize_paper, extract_ideas, extract_alpha | ~30 | 從內容中結構化提取特定資訊 |
| **總結類** | summarize_micro, create_micro_summary | ~5 | 生成簡短摘要 |
| **創建類** | create_command, create_art_prompt, create_keynote, create_visualization | ~25 | 根據需求生成內容 |
| **分析類** | review_code, analyze_logs, analyze_candidates, analyze_interviewer_techniques | ~20 | 深度分析並給出結構化反饋 |
| **評估類** | arbiter-evaluate-quality, arbiter-general-evaluator, arbiter-create-ideal | ~8 | 對比多個輸出並評分 |
| **改進類** | improve_writing, improve_report_finding, refine_design_document | ~10 | 潤飾與提升現有內容 |
| **比較類** | compare_and_contrast | ~2 | 對比兩個主題 |
| **顧問類** | answer_interview_question, ask_uncle_duke, provide_guidance | ~10 | 給予專業建議 |
| **領域專家** | recommend_yoga_practice, find_logical_fallacies, identify_job_stories | ~15 | 特定領域的專門處理 |
| **實驗性** | t_year_in_review, t_red_team_thinking, t_extract_panel_topics | ~5 | 带有前綴「t_」的測試版本 |

### 核心差異對比

**extract_wisdom vs extract_alpha：**

| 面向 | extract_wisdom | extract_alpha |
|------|---------------|---------------|
| 設計者 | dmiessler（官方） | 可能是 PRINCIPAL_NAME 自定義 |
| 輸出焦點 | IDEAS, QUOTES, HABITS, FACTS, REFERENCES | 僅 IDEA（net new ideas） |
| 哲學基礎 | 廣泛覆蓋人生意義、科技、未來 | 資訊理論——only what is different |
| 風格 | 多區塊結構化輸出 | 8-word bullets，PG 風格 |
| 字數要求 | 16-word bullets | 8-word bullets |

**review_code vs analyze_logs：**

| 面向 | review_code | analyze_logs |
|------|------------|-------------|
| 角色設定 | Principal Software Engineer | 資安分析專家 |
| 輸出格式 | Overall Assessment → Prioritized Recommendations → Detailed Feedback | 結構化威脅分析 |
| 重點 | Correctness, Security, Performance, Readability, Best Practices | 日誌模式識別 |

**arbiter-* 家族（四個成員）：**

| Pattern | 功能 |
|---------|-----|
| arbiter-general-evaluator | 超智能通用品質評估系統，定義多維度 Rubric |
| arbiter-evaluate-quality | 對 Bundle 1/2/3 評分比較 |
| arbiter-create-ideal | 根據輸入創建理想提示 |
| arbiter-run-prompt | 對指定輸入運行候選提示並輸出 JSON |

---

## 核心機制

### Pattern 的觸發與執行邏輯

每個 Pattern 是一個「角色+目標+步驟+輸出格式」的封裝。系統收到用戶輸入後：

1. **路由**：根據 pattern 名稱選擇對應的 `system.md`
2. **填充**：將用戶輸入注入 `# INPUT` 段落
3. **執行**：LLM 以 IDENTITY 定義的角色嚴格按照 STEPS 執行
4. **輸出**：依 OUTPUT INSTRUCTIONS 格式化結果

### Pattern 間的組合使用

Fabric 設計了一種「Pipeline」用法——多個 Pattern 可以串聯：

```
extract_wisdom → improve_writing → create_art_prompt
```

例如：`extract_wisdom` 提取內容精華 → `improve_writing` 潤飾 → `create_art_prompt` 生成視覺化

### 版本管理機制

部分 Pattern（如 `extract_wisdom`）有 `dmiessler/extract_wisdom-1.0.0/` 子目錄，存放作者個人維護的特定版本。這種設計允許：
- 實驗性修改與穩定版本共存
- 作者個人化調整不影響主版本
- 子目錄的 README 說明該版本的特殊用途

---

## 關聯檔案

| 相關報告 | 關係 |
|---------|-----|
| T02 — Packs SKILL.md | Fabric Pack 本身是一個 Pack |
| T03 — v5.0.0 skills SKILL.md | Fabric Patterns 是 v5.0.0 的子技能集 |
| T04 — Workflows MD | 部分 Pattern 可能被包裝為 Workflow |
| T26 — PAI CORE TS | PAI 可能以 TypeScript 封裝 Fabric 調用 |

---

## 與 Life-OS 的借鑒點

### 1. Pattern 即「最小可行提示模板」

Fabric Pattern 的結構（IDENTITY → GOALS → STEPS → OUTPUT）與 Life-OS 的「技能」概念高度吻合。可借鑒其結構模板，建立 Life-OS 的「Operation Pattern」系統——每個日常任務（如晨間檢視、每週回顧）都有固定 Pattern。

### 2. 提取類 Pattern 的多視角設計

`extract_wisdom` 的 6 個輸出區塊（IDEAS/QUOTES/HABITS/FACTS/REFERENCES/ONE-SENTENCE TAKEAWAY）提供了一種「同一內容的多重切片」方法。Life-OS 可以用類似方式——從一天的日誌中同時提取：情緒模式、任務完成率、能量曲線、人際互動。

### 3. Arbiter 家族的評估框架

`arbiter-general-evaluator` 的「多維度 Rubric 評分」機制非常值得借鑒。Life-OS 可以在「每週回顧」中加入「自己 vs 理想版本」對比，用同樣的 Quality Rubric 評估各維度分數。

### 4. 測試前綴命名（t_）

帶前綴的實驗性 Pattern（`t_year_in_review`、`t_red_team_thinking`）提供了一種「沙箱」命名慣例。Life-OS 的實驗性技能可以用 `draft_`、`test_`、`exp_` 前綴區分。

### 5. README 即說明書

每個有價值的 Pattern 都附有 README，說明使用場景、輸出範例。這種「每一個功能都有說明書」的態度，是 Life-OS 亟需建立的紀律。

---

## 檔案清單

### 採樣分析的核心 Pattern（按類別）

**提取類：**
- `extract_wisdom/system.md` — 從任何內容提取智慧（IDEAS/QUOTES/HABITS/FACTS/REFERENCES）
- `extract_wisdom/README.md` — 官方說明書
- `extract_wisdom/dmiessler/extract_wisdom-1.0.0/system.md` — 作者個人版本
- `summarize_paper/system.md` — 學術論文摘要
- `summarize_paper/README.md` — 使用說明
- `extract_recipe/system.md` — 食譜提取
- `extract_ideas/system.md` — 創意提取
- `extract_alpha/system.md` — Alpha 資訊提取（8-word PG 風格）
- `extract_product_features/system.md` — 產品功能提取
- `extract_predictions/system.md` — 預測提取
- `extract_extraordinary_claims/system.md` — 驚人聲明提取
- `extract_business_ideas/system.md` — 商機提取
- `extract_book_ideas/system.md` — 書籍點子提取
- `extract_song_meaning/system.md` — 歌曲意義提取
- `extract_algorithm_update_recommendations/system.md` — 演算法更新建議
- `t_extract_panel_topics/system.md` — 實驗性面板主題提取

**總結類：**
- `summarize_micro/system.md` — 微總結
- `summarize_micro/user.md` — 微總結用戶模板
- `create_micro_summary/system.md` — 創建微總結

**創建類：**
- `create_command/system.md` — 滲透測試命令生成
- `create_command/README.md` — 使用說明（sqlmap/nmap/gobuster/dirsearch/nuclei 範例）
- `create_visualization/system.md` — 視覺化創建
- `create_markmap_visualization/system.md` — Markmap 思維導圖
- `create_art_prompt/system.md` — AI 藝術提示詞
- `create_keynote/system.md` — 主題演講創建
- `create_security_update/system.md` — 安全更新撰寫
- `create_report_finding/system.md` — 調查報告發現
- `create_investigation_visualization/system.md` — 調查視覺化
- `create_conceptmap/system.md` — 概念圖
- `create_cyber_summary/system.md` — 網路安全摘要
- `create_ai_jobs_analysis/system.md` — AI 工作分析
- `create_hormozi_offer/system.md` — 商業報價創建
- `create_mnemonic_phrases/system.md` — 助記短語
- `create_aphorisms/system.md` — 格言創建
- `create_ttrc_graph/system.md` — TTRC 圖
- `create_video_chapters/system.md` — 影片章節
- `create_podcast_image/system.md` — 播客圖像

**分析類：**
- `review_code/system.md` — 程式碼審查（完整結構：Overall Assessment → Prioritized → Detailed）
- `analyze_logs/system.md` — 日誌分析
- `analyze_candidates/system.md` — 求職者分析
- `analyze_candidates/user.md` — 求職者分析用戶模板
- `analyze_interviewer_techniques/system.md` — 面試技巧分析
- `analyze_threat_report_cmds/system.md` — 威脅報告命令分析
- `analyze_mistakes/system.md` — 錯誤分析

**評估類（Arbiter 家族）：**
- `arbiter-general-evaluator/system.md` — 通用品質評估系統
- `arbiter-evaluate-quality/system.md` — 多輸出 Bundle 評分
- `arbiter-create-ideal/system.md` — 創建理想提示
- `arbiter-run-prompt/system.md` — 運行候選提示
- `arbiter-evaluate-quality/system.md` — 評估輸出品質

**改進類：**
- `improve_writing/system.md` — 寫作提升
- `improve_report_finding/system.md` — 報告發現優化
- `refine_design_document/system.md` — 設計文件精煉
- `review_design/system.md` — 設計審查

**比較類：**
- `compare_and_contrast/system.md` — 比較對比

**顧問類：**
- `answer_interview_question/system.md` — 面試問題回答
- `ask_uncle_duke/system.md` — Uncle Duke 顧問風格
- `provide_guidance/system.md` — 指導建議
- `recommend_pipeline_upgrades/system.md` — 流水線升級建議
- `recommend_artists/system.md` — 藝術家推薦
- `recommend_yoga_practice/system.md` — 瑜伽練習推薦

**其他專業：**
- `clean_text/system.md` — 文字清理
- `explain_code/system.md` — 程式碼解釋
- `find_logical_fallacies/system.md` — 邏輯謬誤識別
- `identify_job_stories/system.md` — 工作故事識別
- `raw_query/system.md` — 原始查詢
- `extract_videoid/system.md` — 影片 ID 提取
- `create_tags/system.md` — 標籤創建
- `agility_story/system.md` — 敏捷故事
- `t_year_in_review/system.md` — 年度回顧實驗版
- `t_red_team_thinking/system.md` — 紅隊思維實驗版
- `official_pattern_template/system.md` — 官方 Pattern 模板

### 完整 Pattern 清單（309 個，來自 v5.0.0）

所有 Pattern 集中於：
`~/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/Fabric/Patterns/`

完整目錄列表（按字母序）：
- `agility_story/`
- `analyze_candidates/`
- `analyze_interviewer_techniques/`
- `analyze_logs/`
- `analyze_mistakes/`
- `analyze_threat_report_cmds/`
- `answer_interview_question/`
- `arbiter-evaluate-quality/`
- `arbiter-general-evaluator/`
- `arbiter-run-prompt/`
- `ask_uncle_duke/`
- `clean_text/`
- `compare_and_contrast/`
- `coding_master/`
- `create_ai_jobs_analysis/`
- `create_aphorisms/`
- `create_art_prompt/`
- `create_command/`
- `create_conceptmap/`
- `create_cyber_summary/`
- `create_hormozi_offer/`
- `create_investigation_visualization/`
- `create_keynote/`
- `create_micro_summary/`
- `create_mnemonic_phrases/`
- `create_podcast_image/`
- `create_report_finding/`
- `create_security_update/`
- `create_tags/`
- `create_ttrc_graph/`
- `create_video_chapters/`
- `create_visualization/`
- `create_markmap_visualization/`
- `explain_code/`
- `explain_terms/`
- `extract_alpha/`
- `extract_algorithm_update_recommendations/`
- `extract_book_ideas/`
- `extract_business_ideas/`
- `extract_ideas/`
- `extract_extraordinary_claims/`
- `extract_panel_topics/` (or `t_extract_panel_topics/`)
- `extract_predictions/`
- `extract_product_features/`
- `extract_recipe/`
- `extract_song_meaning/`
- `extract_videoid/`
- `extract_wisdom/`
- `find_female_life_partner/`
- `find_logical_fallacies/`
- `identify_job_stories/`
- `improve_report_finding/`
- `improve_writing/`
- `official_pattern_template/`
- `raw_query/`
- `recommend_artists/`
- `recommend_pipeline_upgrades/`
- `recommend_yoga_practice/`
- `refine_design_document/`
- `review_code/`
- `review_design/`
- `summarize_micro/`
- `summarize_paper/`
- `t_extract_panel_topics/`
- `t_red_team_thinking/`
- `t_year_in_review/`
