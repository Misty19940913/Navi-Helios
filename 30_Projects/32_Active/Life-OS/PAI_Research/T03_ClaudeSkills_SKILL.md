# T03 — v5.0.0 Skills SKILL.md

> 組ID：T03
> 來源：Releases/v5.0.0/.claude/skills/*/SKILL.md
> 檔案總數：47
> 採樣分析：47 個（全面覆蓋）
> 優先級：高

---

## 檔案結構分析

v5.0.0 的 Skills SKILL.md 構成 PAI 的技能系統核心，每個技能為獨立封裝的能力單元。從分析的 47 個 SKILL.md 中，可歸納出以下共同結構模式：

### 標準 Frontmatter 區塊
```yaml
---
name: [SkillName]
description: "一句話描述，觸發詞 + 排除範圍"
effort: [low|medium|high]
---
```
- **name**：技能唯一識別符，大多位單字或駝峰式（如 `Fabric`、`FirstPrinciples`、`RedTeam`）
- **description**：最關鍵的描述欄位，嚴格定義「何時使用」（USE WHEN）與「何時不用」（NOT FOR），同時內含觸發詞列表
- **effort**：難度層級（低/中/高），影響執行時間估算

### 標準內容區塊
多數 SKILL.md 包含以下章節（並非全部技能都有這些章節，視性質而定）：

1. **Customization 區塊**：幾乎所有技能都有，指向 `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/[SkillName]/`，允許使用者覆寫預設行為
2. **Voice Notification 區塊**：約 60% 技能有語音通知需求，格式統一為 curl 到 localhost:31337
3. **Workflow Routing 表格**：多數技能的核心章節，以表格呈現觸發詞、對應 workflow、與說明
4. **Quick Reference / Examples**：常見使用範例
5. **Gotchas**：常見失敗模式與注意事項
6. **Execution Log**：執行日誌格式，輸出為 JSONL 格式到 `~/.claude/PAI/MEMORY/SKILLS/execution.jsonl`

### 共同設計模式

| 模式 | 說明 |
|------|------|
| **雙repo架構** | Daemon 技能使用 public framework + private content 雙 repo 模式 |
| **MCP 整合** | Browser 技能說明 agent-browser 為 Rust 原生 CLI，另有 Legacy built-in agents 已廢棄 |
| **平行執行** | RedTeam 使用 32 個平行代理；Browser 使用 agent-browser 並支援 session 隔離 |
| **TypeScript 工具** | 多個技能使用 `.ts` 工具檔案（DaemonAggregator.ts、KnowledgeHarvester.ts、InterviewScan.ts 等） |
| **Skills 自引用** | 多個技能在 NOT FOR 段落明確排除其他技能的職責 |

---

## 內容差異分析

v5.0.0 技能系統涵蓋極廣，從底層系統到應用層均有布局。以下按功能群組分析差異：

### 系統層（System Infrastructure）

| 技能 | 核心職責 | 獨特設計 |
|------|---------|---------|
| **PAIUpgrade** | PAI 版本升級 | 單一用途技能，專門處理版本遷移 |
| **Daemon** | 公開數位形象管理 | 雙repo架構 + 程式化 SecurityFilter（非LLM判斷） |
| **Knowledge** | 知識圖譜管理 | 4 實體類型（People/Companies/Ideas/Research）+ 嚴格 cross-link 強制 |
| **ContextSearch** | 工作階段上下文恢復 | 與 Knowledge 的 mine 功能互補 |

### 認知增強（Cognitive Enhancement）

| 技能 | 核心職責 | 獨特設計 |
|------|---------|---------|
| **ISA** | 理想狀態 artifact 管理 | 12 區段鎖定結構 + E1-E5 難度層級門檻 |
| **Interview** | 階段式對話訪談 | 4階段phase（Phase 1 foundational TELOS 永遠優先）+ Review/Fill 雙模式 |
| **Telos** | 個人/專案生命作業系統 | 雙重上下文（Personal TELOS + Project TELOS） |
| **Fabric** | 240+ 提示模式庫 | 原生執行（不需 CLI）+ Pattern 目錄結構 |

### 創意與內容（Creative & Content）

| 技能 | 核心職責 | 獨特設計 |
|------|---------|---------|
| **WriteStory** | 小說/故事寫作 | 7 敘事層次 + Storr/Pressfield/Forsyth 三框架 |
| **Art** | 藝術創作 | （本次未深入分析） |
| **AudioEditor** | 音訊剪輯 | Whisper + Claude 分類 + ffmpeg 三段式 pipeline |
| **Remotion** | 影片/動畫創作 | （本次未深入分析） |
| **Webdesign** | 網頁設計 | （本次未深入分析） |

### 深度分析（Deep Analysis）

| 技能 | 核心職責 | 獨特設計 |
|------|---------|---------|
| **RedTeam** | 軍事級對抗分析 | 32 平行代理 + 5 階段協議（分解→平行分析→綜合→ Steelman → 反駁） |
| **FirstPrinciples** | 第一原理推理 | 3 步框架（解構→挑戰→重構）+ 限制分類（硬/軟/假設） |
| **WorldThreatModel** | 世界威脅模型 | 11 時間視野（6 個月至 50 年）+ 3 執行層級 |
| **Council** | 多元觀點辯論 | （本次未深入分析） |

### 外部整合（External Integrations）

| 技能 | 核心職責 | 獨特設計 |
|------|---------|---------|
| **ArXiv** | 學術論文搜索 | Atom API + AlphaXiv 摘要 enrichment |
| **Apify** | 社群/B2B 資料爬取 | File-based MCP 架構（97.5% token 節省） |
| **Browser** | 瀏覽器自動化 | agent-browser Rust CLI + per-site profile auth |
| **Interceptor** | 反機器人檢測繞過 | Chrome 擴展 + 零 CDP 指紋 |
| **BrightData** | 進階網頁爬取 | （與 Interceptor 互補） |

### 領域專門（Domain-Specific）

| 技能 | 核心職責 |
|------|---------|
| **Science** | 科學研究輔助 |
| **Agents** | 代理系統管理 |
| **CreateSkill** | 技能創建框架 |
| **Research** | 研究工作流 |
| **Ideate** | 創意髒想法生成 |

### 思維工具（Thinking Tools）

| 技能 | 核心職責 |
|------|---------|
| **RootCauseAnalysis** | 根因分析 |
| **SystemsThinking** | 系統思考 |
| **BitterPillEngineering** | AI 弱點工程分析 |
| **IterativeDepth** | 迭代深度搜索 |
| **Prompting** | 提示詞工程 |

### 商務/其他（Business & Misc）

| 技能 | 核心職責 |
|------|---------|
| **Sales** | 銷售對話 |
| **PrivateInvestigator** | 私人調查 |
| **ApertureOscillation** | 未知（需進一步研究） |
| **Aphorisms** | 格言/箴言 |
| **BeCreative** | 創意激發 |
| **ExtractWisdom** | 智慧提取（與 Fabric 的 extract_wisdom 模式不同） |
| **ContextSearch** | 上下文搜索 |
| **CreateCLI** | CLI 工具創建 |
| **Delegation** | 任務委派 |
| **Evals** | 評估框架 |
| **Loop** | 循環工作流 |
| **Migrate** | 遷移工具 |
| **Optimize** | 優化工具 |
| **USMetrics** | 美國指標 |
| **ExtractWisdom** | 智慧提取 |

---

## 核心機制

### 觸發詞路由機制
每個 SKILL.md 的 description 欄位內含完整觸發詞列表，Skill Router 據此判斷該由哪個技能處理請求。例如 `FirstPrinciples` 的 description 包含：`"first principles, fundamental truths, challenge assumptions, is this a real constraint, rebuild from scratch..."`。

### 語音通知機制
約 60% 技能在執行前需要發送 curl 通知到 `localhost:31337`，通知即將執行的 workflow 名稱。這是 PAI 的語音系統整合。

### 多層執行日誌
幾乎所有技能都會將執行記錄寫入 `~/.claude/PAI/MEMORY/SKILLS/execution.jsonl`，格式為 JSONL，包含 timestamp、skill、workflow、input、status、duration_s。

### Workflow 委派模型
複雜技能（如 ISA、RedTeam、WorldThreatModel）使用 workflow 子檔案模式，每個 workflow 為獨立 Markdown 檔案，定義該工作流的詳細步驟。

### 使用者覆寫機制
幾乎所有技能都支援 `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/[SkillName]/` 目錄，使用者可在此放置 `PREFERENCES.md` 或其他設定檔，覆寫技能預設行為而不修改原技能檔案。

---

## 關聯檔案

- **T01 Root Docs** — PLATFORM.md、SECURITY.md 定義整體架構約束，Skills 系統需遵守
- **T10 CLAUDE.md Routing** — 路由邏輯與 SKILL.md 的觸發詞設計直接相關
- **T11 Memory System** — execution.jsonl 寫入路徑與 Memory System 整合
- **T05 Fabric Patterns** — Fabric 技能的 Pattern 目錄與 SKILL.md 中的 Pattern 清單對應
- **T22 Thinking Skills** — FirstPrinciples、RedTeam、RootCauseAnalysis、SystemsThinking 構成思維工具集群

---

## 與 Life-OS 的借鑒點

### 1. 階段式驗證系統（Interview Skill）
Interview 的 Phase 1（Foundation）永遠最先執行的設計，可用於 Life-OS 任務系統——確保核心價值觀/目標在任何新任務前都已確認。

### 2. 嚴格的 Cross-link 強制（Knowledge Skill）
Knowledge 技能要求每個 note 必須有 2-4 個 typed related links。這適用於 Life-OS 的參考文檔——每個 MOC 或發現報告都應有明確的 cross-references，而非孤立存在。

### 3. 雙 repo 架構（Daemon Skill）
Daemon 的 public/private 分離模式可用於 Life-OS 的敏感資料管理——某些模組（如財務密碼）可類似地從主要 vault 結構中排除。

### 4. 第一原理推理框架（FirstPrinciples Skill）
三步解構→挑戰→重構的框架，適用於 Life-OS 的大型決策——避免類比推理，確保每個決定都回溯到根本事實。

### 5. Execution Log 標準化
所有技能統一的 JSONL 執行日誌格式，可用於追蹤 Life-OS 中的研究工作流程——每個研究任務的執行時間、輸入摘要、狀態都應被記錄。

### 6. Tier/Gate 系統（ISA Skill）
ISA 的 E1-E5 難度層級與強制性區段門檻，可映射到 Life-OS 的任務複雜度分類系統。

---

## 檔案清單

以下為本次分析的所有 v5.0.0 Skills SKILL.md：

```
Releases/v5.0.0/.claude/skills/
├── Agents/SKILL.md
├── ApertureOscillation/SKILL.md
├── Aphorisms/SKILL.md
├── Apify/SKILL.md
├── ArXiv/SKILL.md
├── Art/SKILL.md
├── AudioEditor/SKILL.md
├── BeCreative/SKILL.md
├── BitterPillEngineering/SKILL.md
├── BrightData/SKILL.md
├── Browser/SKILL.md
├── ContextSearch/SKILL.md
├── Council/SKILL.md
├── CreateCLI/SKILL.md
├── CreateSkill/SKILL.md
├── Daemon/SKILL.md
├── Delegation/SKILL.md
├── Evals/SKILL.md
├── ExtractWisdom/SKILL.md
├── Fabric/SKILL.md
├── FirstPrinciples/SKILL.md
├── ISA/SKILL.md
├── Ideate/SKILL.md
├── Interceptor/SKILL.md
├── Interview/SKILL.md
├── IterativeDepth/SKILL.md
├── Knowledge/SKILL.md
├── Loop/SKILL.md
├── Migrate/SKILL.md
├── Optimize/SKILL.md
├── PAIUpgrade/SKILL.md
├── PrivateInvestigator/SKILL.md
├── Prompting/SKILL.md
├── RedTeam/SKILL.md
├── Remotion/SKILL.md
├── Research/SKILL.md
├── RootCauseAnalysis/SKILL.md
├── Sales/SKILL.md
├── Science/SKILL.md
├── SystemsThinking/SKILL.md
├── Telos/SKILL.md
├── USMetrics/SKILL.md
├── Webdesign/SKILL.md
├── WorldThreatModel/SKILL.md
└── WriteStory/SKILL.md
```

---

## 研究備註

v5.0.0 技能系統展現了高度模組化設計，每個技能都有明確的職責邊界（透過 NOT FOR 段落定義）。技能之間存在明確的協作關係（如 RedTeam + FirstPrinciples + Council 的組合使用），也有嚴格的排除邊界（如 Knowledge vs ContextSearch）。整體系統呈現從底層系統工具到頂層應用的完整層次結構。
