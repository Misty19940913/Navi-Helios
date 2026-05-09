# T11 — Memory System

> 組ID：T11
> 來源：Releases/v5.0.0/.claude/PAI/MEMORY/**/*
> 檔案總數：16（均為 README.md）
> 採樣分析：16 個（100%）
> 優先級：高

---

## 檔案結構分析

整個 `MEMORY/` 目錄在出廠狀態下**僅包含 15 個子目錄，每個子目錄內各有 1 個 `README.md`**，共 16 個 MD 檔。所有子目錄在全新安裝時皆為空，內容由系統在日常使用中自動生成。

```
MEMORY/
├── README.md              （頂層概覽）
├── AUTO/                  （自動化工作流輸出）
│   └── README.md
├── BOOKMARKS/             （書籤同步狀態）
│   └── README.md
├── DATA/                  （結構化數據集）
│   └── README.md
├── KNOWLEDGE/             （策展知識圖譜）
│   └── README.md
├── PAISYSTEMUPDATES/      （系統升級提案/歷史）
│   └── README.md
├── PROJECT/               （專案維度記憶）
│   └── README.md
├── RAW/                   （未處理原始素材）
│   └── README.md
├── REFERENCE/             （ curated 查詢參考）
│   └── README.md
├── RELATIONSHIP/          （DA-用戶互動關係記錄）
│   └── README.md
├── RESEARCH/              （研究型技能輸出）
│   └── README.md
├── SCRATCHPAD/            （暫時工作空間）
│   └── README.md
├── SKILLS/                （技能運行時狀態）
│   └── README.md
├── VERIFICATION/          （演算法驗證階段的證據）
│   └── README.md
├── WISDOM/                （萃取的智慧片段）
│   └── README.md
└── WORK/                  （每次演算法運行的功能檔）
    └── README.md
```

**共同結構模式：**
- 每個子目錄的 `README.md` 結構高度一致，均為 7-8 行
- 第一段：Purpose（該目錄用途）
- 第二段：Behavior（在何種條件下populate）
- 第三段：Lifecycle notes（空時啥樣、怎麼變髒）
- 語氣：工程文件風，無情緒，direct

---

## 內容差異分析

| 目錄 | 核心職責 | 寫入觸發來源 | 資料型態 |
|------|---------|------------|---------|
| **WORK** | 每次 Algorithm 運行的 ISA、PRD、事件檔 | Algorithm mode、subagent（slug-scoped） | ISA.md, PRD.md, JSONL |
| **AUTO** | 自動化（cron/scheduled）工作流輸出 | scheduled jobs、background agents | 帶時間戳的报告、scan 結果 |
| **RAW** | 未處理的原始素材（HTML/API response/轉錄稿） | feed pulls、transcript captures、scrapes | 原始 HTML、JSON、文本 |
| **DATA** | 結構化、schema-stable 的數據集 | 外部 API data pulls、local dataset skills | CSV、JSON、表格文檔 |
| **KNOWLEDGE** | curated 知識圖譜，entity cross-links | `Knowledge` skill、harvest workflows | 帶 frontmatter 的維基連結筆記 |
| **REFERENCE** | curated lookup tables、cheat sheets、API maps | 各類 skill 在運行時寫入 | MD 或 JSON lookup tables |
| **WISDOM** | 高信號原子洞察，attributable quotes | `ExtractWisdom` skill、Fabric patterns | 短 MD、語錄、洞察卡 |
| **RESEARCH** | 多來源調查報告威脅模型、競品分析 | `Research` skill、`WorldThreatModel` skill | 帶時間戳的 MD 報告 |
| **RELATIONSHIP** | 用戶與 DA 的互動模式、偏好觀察 | `RelationshipMemory.hook.ts` | 偏好觀測筆記 |
| **PROJECT** | 專案維度的上下文，隔離全局命名空間 | project-aware skills | 專案級別的工作日誌 |
| **SKILLS** | 技能運行時狀態、快取、用戶偏好 | 個別 skill 首次運行時創建子目錄 | skill-specific caches |
| **BOOKMARKS** | 書籤同步後的 parsed entries | bookmark-sync workflows | JSON 或 MD，按平台分組 |
| **PAISYSTEMUPDATES** | PAI 系統自身的升級提案與應用歷史 | `PAIUpgrade` skill、hooks surfaced improvements | upgrade proposals with before/after |
| **VERIFICATION** | Algorithm VERIFY 階段的截圖、命令輸出 | VERIFY phase artifacts | screenshot、命令 trace |
| **SCRATCHPAD** | 一次性臨時工作空間 | 任何需要 temp file 的技能/agent | 任何可拋棄的內容 |

**核心對比：**

| 對比維度 | WORK vs AUTO | RAW vs DATA | KNOWLEDGE vs WISDOM vs RESEARCH |
|---------|-------------|-------------|-------------------------------|
| 觸發方式 | USER-initiated vs scheduled | 原始 vs 結構化 | 長期積累 vs 萃取 vs 專題調研 |
| 讀取頻率 | 會話恢復用 | 分析查詢用 | 長期參考用 |
| 清理頻率 | archive 而非 delete | 處理後可清理 | 幾乎不刪除 |

---

## 核心機制

### 三層架構定位

PAI 的 `MEMORY/` 是**持續狀態層（Persistent State Layer）**，在 PAI 整體架構中的定位：

```
┌─────────────────────────────────────────┐
│  USER/        — 靜態身份與偏好（declare）   │  ← 宣告式
├─────────────────────────────────────────┤
│  MEMORY/      — 持續積累的生活記錄         │  ← 觀測式
│  ├── WORK     — Algorithm 運行記錄        │
│  ├── AUTO      — 自動化運行記錄            │
│  ├── RAW       — 原始攝入素材              │
│  ├── DATA      — 結構化數據集              │
│  └── ...其他14個子目錄                    │
├─────────────────────────────────────────┤
│  KNOWLEDGE/  — curated 知識圖譜           │  ← 提煉式
└─────────────────────────────────────────┘
```

- **MEMORY/** 是 append-mostly 的日誌帶，是 `KNOWLEDGE/` 和 `USER/` 的素材來源
- `KNOWLEDGE/` 從 MEMORY 的各子目錄 harvest，經 curation 後晉升
- `RELATIONSHIP/` 是 USER 層（declared identity）與 MEMORY 層（learned observation）的翻譯層

### 命名空間隔離

- **PROJECT/**：解決多專案間的全局污染問題，每個專案有獨立子目錄
- **SKILLS/**：解決技能運行時狀態不應干擾技能代碼本身的問題（代碼在 `skills/`，數據在 `MEMORY/SKILLS/`）

### 驗證導向

- **VERIFICATION/**：對應 Algorithm 的 VERIFY 階段——"should work" 是最低信任度聲明，截圖/命令 trace 是實際證據
- **WORK/**：每個 Algorithm run 有 slug（`YYYYMMDD-HHMMSS_kebab-task-summary`），所有 ISA、PRD、Forge event 都落在同一 slug 下，支援會話恢復

### SCRATCHPAD 隔離

SCRATCHPAD 是唯一的「可拋棄」層，訊號很明確：沒有鉤子會從這裡讀取，沒有下游 pipeline 依賴它，任何東西若變重要了就晉升到 WORK/KNOWLEDGE/RESEARCH。

---

## 關聯檔案

- **T08 — ISA System**：MEMORY/WORK/ 的核心 artifact 是 ISA.md
- **T10 — CLAUDE.md 路由**：Routing table 中有 `Memory system` 指向 `~/.claude/PAI/DOCUMENTATION/Memory/MemorySystem.md`
- **T11（自身）**：頂層 README.md 與 15 個子目錄 README.md 形成完整元文件
- **T12 — Algorithm v6.3.0**：Algorithm mode 是 WORK/ 的主要寫入觸發源
- **T06 — Hook TypeScript**：`RelationshipMemory.hook.ts` 是 RELATIONSHIP/ 的寫入端

---

## 與 Life-OS 的借鑒點

### 值得借鑒的設計

1. **append-mostly + 分型隔離**：MEMORY/ 的各子目錄各有邊界，SCRATCHPAD 只進不出，KNOWLEDGE/ 是 harvest 晉升的結果——這個分型邏輯讓"什麼該留、什麼該刪"變得自動化，適用於任何個人知識管理系統

2. **WORK/slug 模式**：每次複雜工作有時間戳 slug，所有 artifact 落在同一命名空間下，支援跨會話恢復——這比把東西散在多個目錄更利於追溯

3. **RELATIONSHIP/ 分離 declared vs learned**：`USER/` 是用戶宣告的身份，`RELATIONSHIP/` 是系統觀測到的互動模式——兩個來源的事實不打架，但合併後能提供更豐富的上下文

4. **VERIFICATION/ 的存在本身**：把「驗證證據」當成一等公民，而不是事後補的備註——這個制度設計讓系統的可審計性大幅提升

### 可改進的觀察

- `MEMORY/` 在全新狀態下只有空目錄撐場面，對於從未運行過 Algorithm 的用戶，沒有任何實際範本可參考——文件說的是「正常使用的自然結果」，但新手無法從空殼理解實際輸出的形狀
- 15 個子目錄的邊界定義（尤其是 REFERENCE vs KNOWLEDGE vs WISDOM）需要一定經驗才能正確歸類，沒有離線 validator 或衝突解決機制

---

## 檔案清單

```
Releases/v5.0.0/.claude/PAI/MEMORY/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/AUTO/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/BOOKMARKS/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/DATA/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/KNOWLEDGE/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/PAISYSTEMUPDATES/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/PROJECT/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/RAW/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/REFERENCE/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/RELATIONSHIP/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/RESEARCH/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/SCRATCHPAD/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/SKILLS/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/VERIFICATION/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/WISDOM/README.md
Releases/v5.0.0/.claude/PAI/MEMORY/WORK/README.md
```
