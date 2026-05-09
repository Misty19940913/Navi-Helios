# T18 — Research Pack

> 組ID：T18
> 來源：Packs/Research/\> 檔案總數：25
> 採樣分析：16 個
> 優先級：高

---

## 檔案結構分析

Research Pack 採用 **Skills-as-Containers 架構**，是 PAI 中最具規模的研究引擎：

```
Packs/Research/
├── README.md                    # Pack 概述（255行）
├── INSTALL.md / VERIFY.md      # 安裝驗證
├── src/
│   ├── SKILL.md               # 技能路由（155行）— 觸發分派核心
│   ├── QuickReference.md       # 模式對照表（52行）
│   ├── UrlVerificationProtocol.md  # URL 驗證協議（50行）
│   ├── MigrationNotes.md       # 架構遷移記錄（121行）
│   ├── Workflows/              # 13個工作流
│   │   ├── QuickResearch.md    # 單一Claude查詢
│   │   ├── StandardResearch.md # 3代理並行（預設）
│   │   ├── ExtensiveResearch.md # 12代理並行
│   │   ├── DeepInvestigation.md # 漸進迭代深度研究
│   │   ├── ExtractAlpha.md     # 高價值洞察萃取
│   │   ├── ClaudeResearch.md   # Claude WebSearch免費層
│   │   ├── InterviewResearch.md # Tyler Cowen風格訪調
│   │   ├── AnalyzeAiTrends.md  # AI趨勢分析
│   │   ├── Fabric.md           # 242+ Fabric模式
│   │   ├── Enhance.md          # 內容強化
│   │   ├── ExtractKnowledge.md # 結構化知識萃取
│   │   ├── Retrieve.md         # 內容檢索（CAPTCHA處理）
│   │   ├── WebScraping.md      # 通用網頁爬取
│   │   └── YoutubeExtraction.md # YouTube擷取
│   └── Templates/
│       ├── MarketResearch.md    # 市場研究領域模板
│       └── ThreatLandscape.md   # 威脅情領域模板
```

### 核心設計原則

| 設計選擇 | 說明 |
|---------|------|
| **Skills-as-Containers** | 每個技能自包含，Workflows/ 為子目錄 |
| **觸發=路由** | "research" 單字即Standard模式，無例外 |
| **深度可擴縮** | Quick(1 agent, 10s) → Standard(3, 30s) → Extensive(12, 90s) → Deep(迭代, 60min+) |
| **URL驗證強制** | 每一個URL都必須經過 WebFetch/curl 驗證才能交付 |

---

## 內容差異分析

### 研究模式對照

| 模式 | 觸發關鍵字 | Agent數 | 速度 | 核心用途 |
|------|-----------|--------|------|---------|
| **Quick** | "quick research" | 1 (Claude) | ~10-15s | 快速查詢，簡單事實 |
| **Standard** | "do research" (預設) | 2 (Claude + Gemini) | ~15-30s | 日常研究，多視角 |
| **Extensive** | "extensive research" | 9 (各3) | ~60-90s | 深度 dive，12視角 |
| **Deep Investigation** | "deep investigation" | 漸進迭代 | 3-60min | 持久知識庫，實體評分 |

### 萃取能力光譜

Research Pack 內建兩種深度萃取邏輯：

**Extract Alpha**（基於 Shannon 資訊理論）
- 先進行 10 維度 deep thinking，再萃取 24-30 個高價值洞察
- 專注「低概率但極其深刻」的 insight
- Paul Graham 風格，8-12 字bullet
- 目標：捕捉普通萃取模式會漏掉的細微深度

**Extract Knowledge**（結構化抽取）
- 轉為知識圖譜導向，輸出結構化欄位
- 適合建立可查詢的知識庫

---

## 核心機制

### 1. 多代理並行協調

Standard 模式啟動 ClaudeResearcher + GeminiResearcher 各一，Extensive 模式則是：
- 3 × Claude（學術/分析/學者視角）
- 3 × Gemini（跨域/多元視角）
- 3 × Grok（反向/事實導向）

每個 agent 拿到 **一個優化過的查詢**，做 **1-2 次搜尋** 後立即回傳。大量平行化掩蓋個別agent的延遲。

### 2. URL 驗證三層級

```
Layer 1: WebFetch/WebSearch（首選）
Layer 2: BrightData MCP（CAPTCHA/機器人檢測）
Layer 3: Apify MCP（專業爬蟲）
```

失敗才升級到下一層。這是針對「研究agent會產生幻覺URL」這個已知失敗模式的顯式防禦。

### 3. Deep Investigation 的漸進收窄漏斗

```
Iteration 1: 廣泛景觀掃描 → 發現實體 → 評分(CRITICAL/HIGH/MEDIUM/LOW × EASY/MODERATE/HARD)
Iteration 2+: 根據評分排序，最高優先實體逐一深度 dive
Exit Gate: 所有 CRITICAL/HIGH 已 RESEARCHED + 每類別 ≥3 實體
```

Artifact 持久化於 `~/.claude/MEMORY/RESEARCH/{date}_{topic}/`，形成跨session的持久知識庫。

### 4. 輸入來源多樣性

| 來源 | 工具 |
|------|------|
| 網頁內容 | WebFetch + BrightData MCP |
| YouTube | `fabric -y` (下載+轉譯+處理) |
| 本地檔案 | 直接讀取 |
| PDF/文章 | WebScraping workflow |
| 阻塞內容 | Retrieve workflow (CAPTCHA處理) |

---

## 關聯檔案

| 關聯檔案 | 關係 |
|---------|------|
| **T05 Fabric Patterns** | Fabric.md 工作流呼叫 242+ 個 Fabric pattern |
| **T20 Science Pack** | 共享威脅情分析模板（ThreatLandscape） |
| **T29 v5 DOC** | DOCUMENTATION 提供 Research 輸出持久化的底層機制 |
| **各Agent子類** | ClaudeResearcher, GeminiResearcher, GrokResearcher, PerplexityResearcher |

---

## 與 Life-OS 的借鑒點

### 1. 研究深度光譜（立即可用）

Life-OS 的「研究」任務可採用類似的四層擴縮：

```
⬜ 快速調研（5分鐘）→ 快速查詢，單一來源
🟡 標準調研（20分鐘）→ 多視角交叉
🔴 深度調研（2小時）→ 漸進迭代，實體評分
✅ 全面調研（持久專案）→ 知識庫構建
```

### 2. URL/資訊驗證強制協議

Research Pack 的「每一個URL必須驗證才能交付」是明確的紀律。Life-OS 的研究輸出應建立相同標準——未驗證的連結視為不存在。

### 3. Scratch → History 持久化模式

```
Working: ~/.claude/MEMORY/WORK/{current_work}/
History:  ~/.claude/History/research/YYYY-MM-DD_[topic]/
```

Life-OS 可以參考這個分流邏輯——正在進行的研究留在 WORK/，確認的知識沉澱到 History/。

### 4. Deep Investigation 的實體評分矩陣

CRITICAL/HIGH/MEDIUM/LOW × EASY/MODERATE/HARD 的雙維度評分，對應 Life-OS 的「重要性 × 執行難度」決策框架。

### 5. Extract Alpha 的反向萃取邏輯

不萃取「主要論點」，而是用 10 維度 deep thinking 挖掘「低概率高價值洞察」。這與 Life-OS 的「深度重構」精神相通——不摘要內容，而是萃取出穿透力。

---

## 檔案清單

| 檔案路徑 | 類型 | 行數 |
|---------|------|------|
| `Packs/Research/README.md` | MD | 255 |
| `Packs/Research/INSTALL.md` | MD | — |
| `Packs/Research/VERIFY.md` | MD | — |
| `Packs/Research/src/SKILL.md` | MD | 155 |
| `Packs/Research/src/QuickReference.md` | MD | 52 |
| `Packs/Research/src/UrlVerificationProtocol.md` | MD | 50 |
| `Packs/Research/src/MigrationNotes.md` | MD | 121 |
| `Packs/Research/src/QuickReference.md` | MD | 52 |
| `Packs/Research/src/Workflows/StandardResearch.md` | MD | 95 |
| `Packs/Research/src/Workflows/ExtensiveResearch.md` | MD | 143 |
| `Packs/Research/src/Workflows/DeepInvestigation.md` | MD | 361 |
| `Packs/Research/src/Workflows/ExtractAlpha.md` | MD | 518 |
| `Packs/Research/src/Workflows/QuickResearch.md` | MD | 49 |
| `Packs/Research/src/Workflows/ClaudeResearch.md` | TS | 104 |
| `Packs/Research/src/Workflows/InterviewResearch.md` | MD | 112 |
| `Packs/Research/src/Workflows/Fabric.md` | MD | 375 |
| `Packs/Research/src/Workflows/Enhance.md` | MD | 82 |
| `Packs/Research/src/Templates/MarketResearch.md` | MD | 272 |
| `Packs/Research/src/Templates/ThreatLandscape.md` | MD | 277 |
