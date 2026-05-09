# T28 — Remaining Packs

> 組ID：T28
> 來源：[9個Pack的src/**/*]
> 檔案總數：84
> 採樣分析：9
> 優先級：低

---

## 檔案結構分析

| Pack 名稱 | src/ 結構 | 核心類型 |
|-----------|-----------|----------|
| ApertureOscillation | SKILL.md + Workflows/ | 認知策略 Skill |
| Aphorisms | SKILL.md + Database/ + Workflows/ | 資料庫 + CRUD Workflow |
| Apify | TypeScript src/ + SKILL.md + INTEGRATION.md | 程式碼封裝 Library |
| ArXiv | SKILL.md + Workflows/ | API 整合 Workflow |
| AudioEditor | SKILL.md + Tools/ + Workflows/ | 工具 Pipeline |
| BeCreative | SKILL.md + Workflows/ + Assets/ + Principles.md 等 | 創意方法論 |
| BitterPillEngineering | SKILL.md + Workflows/ | 審計工具 |
| BrightData | SKILL.md + Workflows/ | 爬蟲分層工具 |
| Browser | SKILL.md + Workflows/ + Stories/ + Recipes/ + README.md | 瀏覽器自動化 |

---

## 內容差異分析（每個Pack的功能說明）

### 1. ApertureOscillation
**功能定位：** 3階段視野振盪認知框架，用於發現戰術與策略視角之間的設計張力。

**核心邏輯：**
- Pass 1（Narrow Aperture）：戰術優先，以具體建構目標為主
- Pass 2（Wide Aperture）：策略優先，以系統願景為主
- Pass 3（Synthesis）：找出兩個視角的分歧點，產生設計張力報告

**與其他工具的區別：** 不是 lens rotation（IterativeDepth）、不是創意發想（BeCreative）、不是根因分析（RootCauseAnalysis）。

---

### 2. Aphorisms
**功能定位：**  格言資料庫管理系統，支援完整 CRUD、主題搜尋、思 想家研究。

**核心資料庫架構：** `~/.claude/skills/aphorisms/Database/aphorisms.md`
- 12+ 主題分類：Work Ethic、Resilience、Learning、Stoicism、Risk、Wisdom、Truth-seeking、Excellence、Curiosity、Freedom、Rationality、Clarity
- 每條語錄包含：引文、作者、主題標籤、上下文、出處、引用歷史

**工作流：**
- `FindAphorism` — 分析電子報內容並推薦 3-5 條引文
- `AddAphorism` — 新增並提取主題、驗證唯一性
- `ResearchThinker` — 深度研究哲學家並補充語錄
- `SearchAphorisms` — 按主題、關鍵字或作者搜尋

---

### 3. Apify
**功能定位：**  透過 Apify actors 對社交媒體、電子商務與商業資料進行網路爬蟲的 TypeScript 程式碼封裝。

**核心設計原則：** File-based TypeScript wrappers 在程式碼層級過濾和轉換資料，比直接使用 MCP 協定節省 95-99% token。

**支援平台：**
- 社群媒體：Instagram、LinkedIn、TikTok、YouTube、Facebook
- 電子商務：Amazon（商品/評論/價格）
- 商業資料：Google Maps（商家搜尋、聯絡資訊、評論）
- 通用爬蟲：自訂 pageFunction 的多頁面爬蟲

**技術特色：** 使用 `Promise.all` 進行平行多平台查詢；Lead enrichment pipeline（Google Maps → 過濾 → LinkedIn 強化）。

---

### 4. ArXiv
**功能定位：**  學術論文搜尋與檢索，結合 arXiv Atom API 與 AlphaXiv 增強摘要。

**技術規格：**
- 無需 API key
- 支援欄位：`ti:`、`abs:`、`au:`、`cat:` + 布林運算（AND、OR、ANDNOT）
- 排序方式：`submittedDate` 或 `relevance`
- AlphaXiv 提供 Markdown 格式摘要，可 404（尚未生成）

**涵蓋類別：** cs.AI、cs.LG、cs.CL、cs.CR、cs.MA、cs.SE、cs.IR

---

### 5. AudioEditor
**功能定位：**  AI 驅動音訊/影片編輯管線，結合 Whisper 轉錄 + Claude 區段分類 + ffmpeg 執行。

**編輯決策分類標籤：**
- `KEEP` — 保留
- `CUT_FILLER` — 剪輯填充詞
- `CUT_FALSE_START` — 剪輯錯誤開始
- `CUT_STUTTER` — 剪輯口吃
- `CUT_DEAD_AIR` — 剪輯無聲段
- `CUT_EDIT_MARKER` — 剪輯編輯標記

**技術參數：** 40ms qsin crossfades；呼吸音衰減至 50%（非移除）；可選 Cleanvoice API 雲端潤飾。

---

### 6. BeCreative
**功能定位：**  發散性創意發想與語料庫擴展，基於 Zhang et al. 2025 的 Verbalized Sampling 研究。

**研究數據：**
- 創意寫作多樣性提升 1.6-2.1x
- 品質改善 25.7%
- 合成資料下游準確率：30.6% → 37.5%（數學基準）

**七種工作流：**
- `StandardCreativity`、`MaximumCreativity`、`IdeaGeneration`
- `TreeOfThoughts`、`DomainSpecific`
- `TechnicalCreativityGemini3`（演算法/架構）、`SyntheticDataExpansion`（語料庫擴展）

---

### 7. BitterPillEngineering
**功能定位：**  審計 AI 指令集是否過度提示（over-prompting），核心問題：「更聰明的模型是否會讓這條規則變得多餘？」

**Five Questions 審計框架：**
- 這條規則 Claude 預設就會做嗎？
- 是否矛盾？
- 是否冗餘？
- 是否是一次性的修補？
- 是否模糊？

**規則分類：** CUT / RESOLVE / MERGE / EVALUATE / SHARPEN / MOVE / KEEP

---

### 8. BrightData
**功能定位：**  4層遞進式爬蟲，自動升級直到成功。

**Tier 分層：**
- Tier 1：WebFetch（內建快速）
- Tier 2：curl + Chrome headers（基本 bot bypass）
- Tier 3：agent-browser（headless JavaScript 渲染）
- Tier 4：Bright Data MCP proxy（CAPTCHA、先進 bot 偵測、住宅代理）

**爬蟲模式：** `FourTierScrape`（單 URL）與 `Crawl`（多頁面，最多吃 50 頁）。

---

### 9. Browser
**功能定位：**  透過 agent-browser 進行的無頭瀏覽器自動化，支援批次命令、網路攔截、裝置模擬。

**與 BrightData 的區別：** Browser 負責自動化操作，BrightData 負責繞過 bot 偵測與內容抓取。

**Recipes 模板引擎：** 參數化模板 → 解析參數 → 執行工具（agent-browser / BrowserAgent / UIReviewer）。

---

## 核心機制

### 1. ApertureOscillation — 視野振盪框架
固定問題本身，改變問題的範圍邊界，透過三個視角產生設計張力報告。

### 2. Aphorisms — 主題索引資料庫
12+ 主題分類驅動的語錄推薦引擎，用於電子報與內容匹配。

### 3. Apify — Token 節省型程式碼封裝
在程式碼層級過濾資料，避免大量 MCP 往返造成的 token 消耗。

### 4. ArXiv — API + 外部摘要增強
直接查詢 arXiv Atom API，搭配 AlphaXiv 第三方摘要服務補足原始論文的可讀性。

### 5. AudioEditor — 多階段 Pipeline
轉錄 → 分析 → 編輯 → （可選）雲端潤飾，全流程 CLI 執行。

### 6. BeCreative — Verbalized Sampling
單次生成多個低相關性候選（p<0.10），再從中選擇最優，提升創意多樣性。

### 7. BitterPillEngineering — 規則審計分類
以「更聰明的模型是否需要這條規則」為核心判準，系統化裁剪冗餘指令。

### 8. BrightData — 遞進式爬蟲升級
從最輕量方法開始，失敗後自動升級到更強大的繞過機制。

### 9. Browser — 模板化瀏覽器自動化
以 Markdown recipe 為載體的參數化腳本引擎，支援動態參數解析。

---

## 關聯檔案

| Pack | 關聯技能 / 依賴 |
|------|----------------|
| ApertureOscillation | Algorithm（OBSERVE/THINK 階段整合）；與 IterativeDepth 互補 |
| Aphorisms | XPost、LinkedInPost（電子報引文整合） |
| Apify | 依賴 `apify-client` npm 套件；與 BrightData/瀏覽器爬蟲分工 |
| ArXiv | 依賴 `curl` + arXiv API；AlphaXiv 第三方服務 |
| AudioEditor | 依賴 `insanely-fast-whisper`（MPS）、`ffmpeg`、`Cleanvoice API` |
| BeCreative | 與 XPost、LinkedInPost、Blogging、Art、Business、Research 整合 |
| BitterPillEngineering | settings.json（loadAtStartup / postCompactRestore.fullFiles 同步） |
| BrightData | 依賴 `agent-browser`（Rust CLI）；Bright Data MCP |
| Browser | 依賴 `agent-browser`（Rust CLI daemon）；與 BrightData/Interceptor 分工 |

---

## 與 Life-OS 的借鑒點

### 高價值借鑒

1. **ApertureOscillation（視野振盪）** — 可用於重大生命決策的「戰術/戰略」雙視角分析，避免只見樹木不見森林。

2. **Aphorisms（語錄管理）** — 可建立「生命原則語錄庫」，用於電子報、文章寫作的智慧引文推薦。

3. **BeCreative（創意發想）** — Verbalized Sampling 可用於頭腦風暴、課程設計、創意寫作的多樣性提升。

4. **BitterPillEngineering（規則審計）** — 可用於審計個人工作流中「過度複雜的流程」，找出可以移除的無效步驟。

5. **BrightData 4層爬蟲框架** — 可改造為「資訊獲取策略」：先快速查詢 → 失敗後用更深入的方法。

### 中等價值借鑒

6. **ArXiv** — 學術文獻追蹤框架可用於持續學習與研究前沿追蹤。

7. **AudioEditor Pipeline** — 可用於 Podcast 或錄音的自動剪輯流程。

8. **Browser Recipe 模板** — 可建立「常見任務模板庫」，減少重複工作。

### 低價值（高度特定）

9. **Apify** — 主要用於社群媒體爬蟲，與 Life-OS 日常應用距離較遠。

---

## 檔案清單

### ApertureOscillation（2個檔案）
```
src/SKILL.md
src/Workflows/Oscillate.md
```

### Aphorisms（6個檔案）
```
src/Database/aphorisms.md
src/SKILL.md
src/Workflows/AddAphorism.md
src/Workflows/FindAphorism.md
src/Workflows/ResearchThinker.md
src/Workflows/SearchAphorisms.md
```

### Apify（24個檔案）
```
src/package.json
src/README.md
src/types/index.ts
src/types/common.ts
src/index.ts
src/examples/smoke-test.ts
src/examples/comparison-test.ts
src/examples/instagram-scraper.ts
src/SKILL.md
src/tsconfig.json
src/.gitignore
src/skills/get-user-tweets.ts
src/INTEGRATION.md
src/actors/ecommerce/index.ts
src/actors/ecommerce/amazon.ts
src/actors/business/index.ts
src/actors/business/google-maps.ts
src/actors/index.ts
src/actors/social-media/youtube.ts
src/actors/social-media/twitter.ts
src/actors/social-media/linkedin.ts
src/actors/social-media/index.ts
src/actors/social-media/tiktok.ts
src/actors/social-media/instagram.ts
src/actors/social-media/facebook.ts
src/actors/web/web-scraper.ts
src/actors/web/index.ts
src/Workflows/Update.md
```

### ArXiv（4個檔案）
```
src/SKILL.md
src/Workflows/Latest.md
src/Workflows/Search.md
src/Workflows/Paper.md
```

### AudioEditor（11個檔案）
```
src/SKILL.md
src/Tools/Pipeline.help.md
src/Tools/Pipeline.ts
src/Tools/Analyze.help.md
src/Tools/Transcribe.ts
src/Tools/Analyze.ts
src/Tools/Polish.ts
src/Tools/Edit.help.md
src/Tools/Transcribe.help.md
src/Tools/Polish.help.md
src/Tools/Edit.ts
src/Workflows/Clean.md
```

### BeCreative（14個檔案）
```
src/Examples.md
src/ResearchFoundation.md
src/Templates.md
src/SKILL.md
src/Assets/creative-writing-template.md
src/Assets/idea-generation-template.md
src/Principles.md
src/Workflows/SyntheticDataExpansion.md
src/Workflows/DomainSpecific.md
src/Workflows/TreeOfThoughts.md
src/Workflows/IdeaGeneration.md
src/Workflows/StandardCreativity.md
src/Workflows/TechnicalCreativityGemini3.md
src/Workflows/MaximumCreativity.md
```

### BitterPillEngineering（3個檔案）
```
src/SKILL.md
src/Workflows/Audit.md
src/Workflows/QuickCheck.md
```

### BrightData（3個檔案）
```
src/SKILL.md
src/Workflows/Crawl.md
src/Workflows/FourTierScrape.md
```

### Browser（13個檔案）
```
src/Stories/ExampleApp.yaml
src/Stories/README.md
src/Stories/HackerNews.yaml
src/README.md
src/Recipes/README.md
src/Recipes/ScreenshotCompare.md
src/Recipes/FormFill.md
src/Recipes/SummarizePage.md
src/SKILL.md
src/Workflows/Update.md
src/Workflows/ReviewStories.md
src/Workflows/Automate.md
```
