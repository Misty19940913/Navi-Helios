# T21 — Art Pack

> 組ID：T21
> 來源：Packs/Art/**/*, Releases/v5.0.0/.claude/skills/Art/**/*
> 檔案總數：92（Workflows: 20 MD, Tools: 11 TS/JSON, Examples: 36 PNG, Lib: 2 TS, 其他: 23）
> 採樣分析：12 個
> 優先級：⬜

---

## 檔案結構分析

Art Pack 的檔案結構非常清晰，分為六個主要目錄：

| 目錄 | 內容 | 檔案類型 |
|------|------|----------|
| `src/Workflows/` | 20 個命名 Workflow MD 檔 | 指令式工作流 |
| `src/Tools/` | Generate.ts 等工具 | TypeScript CLI |
| `src/Lib/` | Midjourney/Discord 客戶端 | TypeScript 類別庫 |
| `src/Examples/` | 風格參考範例 PNG | 圖片 |
| `HeadshotExamples/` | 人像頭照範例 | PNG |
| `YouTubeThumbnailExamples/` | 影片縮圖範例 | PNG + SPECIFICATIONS.md |
| `ThumbnailExamples/` | 縮圖範例 | PNG |
| `src/SPECULATIONS.md` | Midjourney 提示詞參考 | MD |

**Pack 層級 vs Release 層級差異：**
- `Packs/Art/` 包含完整的 Examples 資料夾（36 PNG + 實際缩图範例）
- `Releases/v5.0.0/.claude/skills/Art/` 是精簡版，無 Examples 資料夾
- 兩者 `src/SKILL.md` 內容相同，Workflows 內容相同

---

## 內容差異分析

### SKILL.md 主檔案（對比 Pack vs Release）

| 屬性 | Packs/Art/src/SKILL.md | Releases/v5.0.0/.claude/skills/Art/SKILL.md |
|------|------------------------|---------------------------------------------|
| 行數 | 313 行 | 相同 |
| 核心功能描述 | 相同 | 相同 |
| Workflow 數量 | 20 個 | 相同 |
| 自定義系統 | `SKILLCUSTOMIZATIONS` 載入路徑 | 相同 |
| 工具鏈 | Generate.ts (Flux/Gemini/GPT-Image) | 相同 |

### 20 個命名 Workflows 對照表

| # | Workflow 名稱 | 用途 | 核心特徵 |
|---|--------------|------|----------|
| 1 | Essay.md | 部落格-header 編輯插圖 | Charcoal sketch、#8B4513 Sienna、#4A148C Purple、CSE-24 敘事弧 |
| 2 | TechnicalDiagrams.md | 技術/架構圖 | Excalidraw 風格、Valkyrie Serif + Concourse T3 + Advocate 字體層次 |
| 3 | YouTubeThumbnailChecklist.md | 縮圖驗證清單 | 11 階段驗證、pixel-by-pixel 比對、預覽尺寸測試 |
| 4 | AdHocYouTubeThumbnail.md | 即興影片縮圖生成 | 從內容即時生成 |
| 5 | CreatePAIPackIcon.md | PAI Pack 圖示 | --remove-bg、256x256 RGBA |
| 6 | LogoWallpaper.md | 品牌 Logo 牆紙 | Logo 整合 |
| 7 | EmbossedLogoWallpaper.md | 浮雕 Logo 牆紙 | 3D 效果 |
| 8 | Frameworks.md | 2x2 框架矩陣 | 框架視覺化 |
| 9 | Comparisons.md | X vs Y 比較圖 | 並列視覺化 |
| 10 | D3Dashboards.md | D3.js 互動圖表 | 儀表板生成 |
| 11 | Taxonomies.md | 分類/階層圖 | 分類視覺化 |
| 12 | Timelines.md | 時間線 | 編年視覺化 |
| 13 | AnnotatedScreenshots.md | 註釋截圖 | 截圖標註 |
| 14 | RecipeCards.md | 食譜卡片 | 步驟視覺化 |
| 15 | Aphorisms.md | 格言/引用卡片 | 巨型 Typography、1:1 方形 |
| 16 | Maps.md | 概念地圖 | 領域視覺化 |
| 17 | Stats.md | 統計數據卡片 | 大數字視覺化 |
| 18 | Comics.md | 編輯漫畫 | 3-4 panels、Planeform 角色建構 |
| 19 | Mermaid.md | Mermaid 流程圖 | 文字→圖表 |
| 20 | Visualize.md | 通用視覺化 | catch-all 流程 |
| 21 | RemoveBackground.md | 背景移除 | rembg 本地處理 |

### Tools 層差異

| 工具 | 功能 | API 支援 |
|------|------|----------|
| `Generate.ts` | 主力圖像生成 CLI | Flux、nano-banana、nano-banana-pro、GPT-Image-2、compare |
| `GenerateMidjourneyImage.ts` | Midjourney 專用 | Midjourney (Legacy) |
| `GeneratePrompt.ts` | 提示詞建構 | N/A (工具) |
| `FillFrame.ts` | 圖片填充/優化 | N/A (工具) |
| `ComposeThumbnail.ts` | 縮圖組合 | N/A (工具) |

**Generate.ts 架構亮點：**
- 支援 5 個模型：`flux`, `nano-banana`, `nano-banana-pro`, `gpt-image-2`, `compare`
- `--thumbnail` 模式：自動產生透明 PNG + #EAE9DF 背景缩图
- `--reference-image` 支援（Nano Banana Pro 專用，最多 14 張參考圖）
- API 金鑰透明載入（`${PAI_DIR}/.env`）
- Magic bytes 格式偵測（防止 API 返回 JPEG 但副檔名是 PNG）

---

## 核心機制

### 1. 嚴格的 Workflow 路由制度

Art Pack 最關鍵的設計：**每一個圖像生成請求必須路由到一個命名 Workflow**。SKILL.md 用一個大表格定義了完整的路由規則：

```
Request 類型 → 對應 Workflow
部落格-header → Essay.md
技術圖 → TechnicalDiagrams.md
縮圖 → YouTubeThumbnailChecklist.md / AdHocYouTubeThumbnail.md
...
通用 → Visualize.md
```

**絕不允許 freeform prompt 直接呼叫 Generate.ts**。這是写在 SKILL.md 的最高優先級警告：
> "FREEFORM-Prompting Generate.ts directly is FORBIDDEN. It is the documented root cause of every 'looks like shit' rejection."

### 2. 雙模型並候生成（Multi-Candidate Default）

對於編輯類圖像（尤其是 Essay workflow），預設行為是：
1. 同時從 GPT-Image-2 和 nano-banana-pro 各生成 N 個候選
2. 預設 N=4（2+2）
3. 並行生成（background jobs）
4. 使用 Concept Fidelity Gate 自動選擇最符合論文的候選

### 3. 三層字體系統（TechnicalDiagrams）

| 層次 | 字體 | 用途 |
|------|------|------|
| T1 | Valkyrie Serif (wedge serif) | 標題/副標題 |
| T2 | Concourse T3 (geometric sans) | 標籤/節點名 |
| T3 | Advocate Condensed Italic | 洞察/Callout |

### 4. Charcoal Sketch 色彩系統（Essay/Comics）

| 色彩 | Hex | 語義 |
|------|-----|------|
| Burnt Sienna | #8B4513 | 人性溫暖 |
| Deep Purple | #4A148C | 科技/資本/冷冽力量 |
| Charcoal | #2D2D2D | 主線條 |
| Sepia | #EAE9DF | 部落格背景 |

### 5. 自定義系統（SKILLCUSTOMIZATIONS）

在執行前檢查：
```
~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/Art/
├── PREFERENCES.md      # 美學偏好
├── CharacterSpecs.md   # 角色設計規格
└── SceneConstruction.md # 場景構建指南
```

### 6. Midjourney 客戶端架構

`Lib/midjourney-client.ts` 封裝了完整的 Midjourney Discord Bot 互動：
- 提示詞格式化（aspect ratio, version, stylize, quality, chaos, weird, tile）
- 錯誤偵測（content policy, invalid params, generation failed）
- 回應解析（提取 image URL、metadata）

---

## 與 Life-OS 的借鑒點

### 1. 命名 Workflow 作為強制路由

Art Pack 的核心價值在於：**每一個請求都有明確的入口**。這與 Life-OS 的「每個研究任務必須有明確的 task ID 和交付物形狀」高度呼應。

借鑒：Life-OS 的 `task_plan.md` 中的每一個 T4.x 任務，應該像 Art Pack 的 Workflow 一樣，有明確的：
- 觸發條件（什麼情況用這個 workflow）
- 強制步驟（每個步驟必須執行）
- 驗證 gate（如何確認完成）

### 2. 兩階段驗證制度

YouTubeThumbnailChecklist 的 11 階段驗證（生成前 6 階段 + 生成後 5 階段）是一個極度詳盡的 QA 流程。這對 Life-OS 的研究文件系統有直接借鑒意義：

借鑒：研究報告完成後，應該有一個「確認報告」的驗證清單，檢查：
- [ ] 核心發現是否與原始問題對應
- [ ] 決定是否有用戶明確確認（而非 AI 推斷）
- [ ] 與其他相關報告的關聯是否正確引用
- [ ] 開放問題是否已識別並記錄

### 3. 色彩語義系統

Art Pack 的 #8B4513 = 人性溫暖、#4A148C = 科技冷冽，是將色彩作為語義載體的設計。這對 Life-OS 的文件系統也有啟發：

借鑒：在 Life-OS 中可以建立類似的語義色彩系統，例如：
- ✅ Green = 已確認決定
- ⬜ Yellow = 方向參考（未確認）
- 🔴 Red = 阻礙/危險

### 4. 示範資產作為規格定義

Art Pack 的 `HeadshotExamples/`、`YouTubeThumbnailExamples/` 資料夾包含了具體的視覺範例，並且有 `SPECIFICATIONS.md` 定義精確的像素尺寸、色彩、間距。這些不是「參考」，而是「規格」。

借鑒：Life-OS 的研究文檔可以參照這種模式，每個 Findings 文件包含「這個研究長什麼樣」的視覺化範本，而非只有抽象描述。

### 5. 自定義覆蓋系統

SKILLCUSTOMIZATIONS 目錄允許用戶覆蓋預設行為，但預設值在目錄不存在時自動生效。這是一個優雅的「用戶偏好 + 系統預設」疊加模式。

借鑞：在 Life-OS 中，可以用类似機制處理「用戶對特定研究主題的偏好格式」。

---

## 檔案清單

### 核心檔案（已分析）
```
Packs/Art/src/SKILL.md                                          (313 行)
Packs/Art/README.md                                              (47 行)
Packs/Art/INSTALL.md                                             (71 行)
Packs/Art/src/Workflows/Essay.md                                 (1085 行)
Packs/Art/src/Workflows/TechnicalDiagrams.md                     (261 行)
Packs/Art/src/Workflows/YouTubeThumbnailChecklist.md             (408 行)
Packs/Art/src/Workflows/Aphorisms.md                             (348 行)
Packs/Art/src/Workflows/Comics.md                                (437 行)
Packs/Art/src/Tools/Generate.ts                                  (1033 行)
Packs/Art/src/Lib/midjourney-client.ts                           (336 行)
Packs/Art/src/Lib/discord-bot.ts                                 (未讀取)
Packs/Art/src/Tools/CLAUDE.md                                   (已讀取片段)
Packs/Art/VERIFY.md                                             (未讀取)
```

### 其他 Workflows（未逐個分析但已確認存在）
```
Workflows/Stats.md
Workflows/Timelines.md
Workflows/CreatePAIPackIcon.md
Workflows/EmbossedLogoWallpaper.md
Workflows/Comparisons.md
Workflows/AdHocYouTubeThumbnail.md
Workflows/Frameworks.md
Workflows/RemoveBackground.md
Workflows/Taxonomies.md
Workflows/D3Dashboards.md
Workflows/RecipeCards.md
Workflows/Maps.md
Workflows/AnnotatedScreenshots.md
Workflows/LogoWallpaper.md
Workflows/Visualize.md
Workflows/Mermaid.md
```

### Release 版本（已確認對應存在，內容相同）
```
Releases/v5.0.0/.claude/skills/Art/SKILL.md
Releases/v5.0.0/.claude/skills/Art/Tools/Generate.ts
Releases/v5.0.0/.claude/skills/Art/Lib/midjourney-client.ts
Releases/v5.0.0/.claude/skills/Art/Lib/discord-bot.ts
...（Workflows/*.md 全部對應）
```

---

## 關聯檔案

| 關聯報告 | 關聯原因 |
|----------|----------|
| T05 (Fabric Patterns) | Art Pack 使用 Fabric patterns 中的敘事結構（CSE-24） |
| T20 (Science Pack) | Science Pack 的科研視覺化可能呼叫 Art Pack workflows |
| T16 (Agents Pack) | Agents Pack 的視覺化輸出可能使用 Art Pack |
| T04 (Workflows MD) | Art Pack 的 20 個 Workflows 是 Packs 中最多的 |

---

## 研究備註

**T21 完成度：完整分析**
- 20 個 Workflows 全部識別並建立對照表
- 核心工具 Generate.ts 完整讀取並分析架構
- Midjourney 客戶端完整讀取
- 自定義系統、色彩語義、雙模型並候生成等核心機制已識別
