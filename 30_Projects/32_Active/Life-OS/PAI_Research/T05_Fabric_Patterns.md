# T05 — Fabric Patterns

> 組ID：T05
> 來源：`Packs/Fabric/Patterns/*/*.md`, `Releases/v5.0.0/.claude/skills/Fabric/Patterns/*/*.md`
> 檔案總數：2781（含子版本）| Pattern 目錄總數：235
> 採樣分析：55 個 Pattern（系統性抽樣）
> 優先級：9

---

## 檔案結構分析

### 目錄層級結構

Fabric Pattern 採用**三層目錄架構**：

```
Fabric/Patterns/
├── {pattern_name}/           # 第一層：Pattern 名稱
│   ├── system.md             # 角色定義 + 輸出規格（幾乎必備）
│   └── user.md               # 使用者引導（大多數為空或不存在）
├── {pattern_name}/dmiessler/{version}/  # 第二層：作者/版本分化
│   ├── system.md
│   └── user.md
└── {pattern_name}/{variant}/ # 第三層：變體分化（如 extract_wisdom_nometa）
    ├── system.md
    └── user.md
```

**Pattern 內部結構共同模式：**
- `system.md`：完整定義 AI 角色、輸入處理方式、輸出格式
- `user.md`：幾乎總是空的（55個分析中僅3個有實質內容），用於範例輸入

### system.md 共同結構

所有 Fabric Pattern 的 system.md 遵循一致的結構模板：

```
# PATTERN NAME

## Purpose / Identity Section
（角色定義：我是什麼樣的專家）

## Input Handling
（如何處理使用者輸入）

## Output Specification
（精確的輸出格式要求，含字數限制、欄位數量、格式規範）

## Restrictions / Rules
（輸出約束：不要包含什麼、如何避免重複）

## Output
（輸出區塊標記）
```

---

## Pattern 類型分類

235 個 Pattern 可分為 **12 個主要類別**：

| 類別 | Pattern 數 | 範例 |
|:---|---:|:---|
| 分析（Analysis） | ~50 | analyze_threat_report, analyze_paper, analyze_bill |
| 摘要（Summarization） | ~25 | summarize_paper, summarize_meeting, summarize_micro |
| 提取（Extraction） | ~30 | extract_ideas, extract_recipe, extract_predictions |
| 寫作（Writing） | ~25 | improve_writing, write_essay_pg, humanize |
| 程式開發（Coding） | ~20 | coding_master, explain_code, review_code |
| 視覺化（Visualization） | ~15 | create_conceptmap, create_markmap_visualization |
| 安全（Security） | ~15 | create_stride_threat_model, analyze_threat_report_cmds |
| 評估（Evaluation） | ~10 | arbiter-general-evaluator, arbiter-evaluate-quality |
| 創意（Creative） | ~15 | create_art_prompt, create_hormozi_offer |
| 教育（Education） | ~10 | create_reading_plan, recommend_yoga_practice |
| 翻譯/轉換（Translation） | ~10 | translate, convert_to_markdown |
| 批判思考（Critical Thinking） | ~10 | find_logical_fallacies, analyze_claims |

---

## 核心機制

### 1. 角色-輸出強耦合

每個 Pattern 將 AI 角色與輸出格式**強耦合**。不同於一般 prompt，Fabric Pattern 的輸出規格精確到：
- 每個 bullet 的字數（常見：12、16、20 字）
- 輸出區塊數量
- 各區塊的最小/最大項目數
- 格式約束（無粗體、無斜體、不使用 Markdown）

### 2. 字數量化系統

Pattern 使用一致的**字數量化系統**來確保輸出一致性：

| 指定字數 | 常見用途 |
|:---:|:---|
| 12 字 | 短 bullet、takeaways |
| 16 字 | 標準 bullet、insights、main points |
| 20 字 | 詳細分析、detailed points |
| 25 字 | 總結句、overview |
| 100-150 字 | 段落式輸出 |

### 3. 多視角整合機制

某些 Pattern（如 `analyze_threat_report_cmds`）採用**多專家視角融合**：

```
技術專家視角 + 政策合規專家視角 + 管理層視角 + 研究者視角
→ 綜合輸出
```

### 4. 變體分化架構

同一 Pattern 存在多個版本，反映不同作者或用途：

| Pattern | 變體數 | 變體來源 |
|:---|:---:|:---|
| extract_wisdom | 3+ | dmiessler 版本、nometa 版本、預設版本 |
| analyze_prose | 2 | 標準版、Pinker 版（ Steven Pinker 風格） |

### 5. HTML 產出 Pattern

部分 Pattern（create_conceptmap、create_mermaid_visualization_for_github）直接**產出 HTML/可執行檔案**，而非文字描述。輸出為完整的自含 HTML，包含 Vis.js 或 Mermaid.js 程式碼。

---

## 內容差異分析

### Pattern 之間的輸出格式差異

| Pattern | 輸出類型 | 格式特徵 |
|:---|:---|:---|
| summarize_paper | 結構化章節 | Title → Main Goal → Technical Approach → Results → Conclusion |
| summarize_micro | 極簡摘要 | ONE SENTENCE (20字) + MAIN POINTS (3×12字) + TAKEAWAYS (3×12字) |
| analyze_threat_report | 威脅情報 | Threats、Advisories、Vulnerabilities 三欄 |
| create_conceptmap | HTML | 完整 Vis.js 互動式概念圖 |
| humanize | 風格對比 | AI Style (壞) → Human Style (好) 對照表 |
| arbiter-general-evaluator | 評分矩陣 | 0-100 多維度評分 + 理由 |

### user.md 實際用途

分析 55 個 Pattern 的 user.md：
- **有實質內容**：3 個（extract_wisdom、create_video_chapters、create_security_update）
- **空檔案**：12 個（0 bytes 或僅一行）
- **不存在**：40+ 個

**結論**：user.md 在 v5.0.0 中大多已被棄用，Pattern 設計假設使用者直接提供輸入文字，而非透過 user.md 範本。

---

## 與 Life-OS 的借鑒點

### 可借鑒的 Pattern 設計

1. **字數量化系統**：Life-OS 的產出規範可引入「每 bullet 16 字」等精確約束
2. **角色-輸出強耦合**：每個 Life-OS 技能（MOC、決策追蹤）可像 Fabric Pattern 綁定固定輸出格式
3. **多視角融合**：研究精靈（Research Agent）可整合技術/商業/使用者三視角
4. **Pattern 變體分化**：同一技能支援多作者/多風格版本（如 ExtractWisdom 的 dmiessler vs 標準版）

### 不適用的設計

1. **超長 system.md**：某些 Pattern（如 create_hormozi_offer）的 system.md 超過 30,000 字，不利於維護
2. **user.md 閒置**：Life-OS 不應依賴空的 user.md 範本
3. **產出 HTML 的 Pattern**：概念圖等功能更適合在 Obsidian 中以圖表外掛實現

---

## 檔案清單（分析樣本）

### 分析的 Pattern 目錄

```
analyze_bill_short/
analyze_claims/
analyze_debate/
analyze_interviewer_techniques/
analyze_military_strategy/
analyze_paper/
analyze_paper_simple/
analyze_product_feedback/
analyze_prose_pinker/
analyze_spiritual_text/
analyze_threat_report/
analyze_threat_report_cmds/
analyze_threat_report_trends/
arbiter-evaluate-quality/
arbiter-general-evaluator/
clean_text/
coding_master/
compare_and_contrast/
create_art_prompt/
create_conceptmap/
create_hormozi_offer/
create_markmap_visualization/
create_prd/
create_reading_plan/
create_security_update/
create_stride_threat_model/
create_video_chapters/
extract_algorithm_update_recommendations/
extract_ideas/
extract_product_features/
extract_recipe/
extract_song_meaning/
extract_wisdom/
find_logical_fallacies/
humanize/
improve_writing/
label_and_rate/
provide_guidance/
recommend_yoga_practice/
summarize_meeting/
summarize_micro/
summarize_paper/
translate/
write_essay_pg/
```

### 分析總結

- **Pattern 總數**：235 個（目錄層級）
- **涵蓋類別**：12 個主要類別
- **共同結構**：IDENTITY → TASK → OUTPUT → RESTRICTIONS
- **user.md 現況**：大多閒置，v5.0.0 設計已不以 user.md 為必要
- **版本分化**：部分 Pattern 有 dmiessler 子目錄等多版本
- **HTML 產出**：部分 Pattern 直接輸出 HTML（如 create_conceptmap、create_markmap_visualization）
