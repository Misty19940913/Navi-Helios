# T11 — Memory System

> 組ID：T11
> 來源：Releases/v5.0.0/.claude/PAI/MEMORY/**/*
> 檔案總數：16（皆為子目錄 README）
> 採樣分析：16 個（100%）
> 優先級：高

---

## 檔案結構分析

MEMORY 系統採用**多子目錄分類架構**，每個子目錄為一種記憶類型，各自承擔明確職責。所有子目錄初期皆為空（append-mostly 設計），由系統自動依據使用者行為逐步填充。

**頂層結構：**
```
MEMORY/
├── README.md          # 系統總綱
├── WORK/              # 工作產出（ISA、PRD、Agent 事件）
├── RELATIONSHIP/      # 互動關係學習
├── PAISYSTEMUPDATES/  # 系統自我改進
├── WISDOM/            # 提煉智慧語錄
├── REFERENCE/          # 查詢參考資料
├── AUTO/              # 自動化工作產出
├── SKILLS/            # 技能運行狀態
├── DATA/              # 結構化數據集
├── RESEARCH/          # 研究報告
├── KNOWLEDGE/         # 知識圖譜（已整理）
├── RAW/               # 原始未處理資料
├── SCRATCHPAD/        # 臨時草稿區
├── PROJECT/           # 專案維度記憶
├── BOOKMARKS/         # 書籤同步狀態
└── VERIFICATION/      # 驗證證據
```

---

## 內容差異分析

| 目錄 | 職責定位 | 寫入來源 | 壽命 | 性質 |
|------|---------|---------|------|------|
| **WORK** | Algorithm / Agent 工作結果 | ISASync hook、Agent helpers | 持久，引用導向 | 操作記錄 |
| **RELATIONSHIP** | 用戶×DA 互動模式學習 | RelationshipMemory.hook.ts | 持久，累積學習 | 習得偏好 |
| **PAISYSTEMUPDATES** | 系統改進提案與應用記錄 | PAIUpgrade skill、learning hooks | 持久，版本導向 | 自我演化 |
| **WISDOM** | 高信號原子洞察語錄 | ExtractWisdom skill、Fabric patterns | 持久 | 精煉洞察 |
| **REFERENCE** | 工具/技能專用查詢表 | 各技能主動寫入 | 持久 | 查詢資料 |
| **AUTO** | 背景工作（非互動式）結果 | Cron jobs、scheduled agents | 中期，可歸檔 | 排程報告 |
| **SKILLS** | 各技能個人化運行狀態 | 各技能自行維護 | 持久 | 技能狀態 |
| **DATA** | 結構化數據集 | 數據拉取技能 | 持久，版本化 | 數據倉庫 |
| **RESEARCH** | 調研報告輸出 | Research / WorldThreatModel skill | 持久 | 研究圖書館 |
| **KNOWLEDGE** | 已整理知識圖譜 | Knowledge skill 收割 | 持久，結構化 | 語義網絡 |
| **RAW** | 原始攔截資料 |攝取流程（feed、scrape、transcript） | 中期，需清理 | 未處理原料 |
| **SCRATCHPAD** | 臨時草稿 | 任何需要暫存的流程 | 臨時，會清除 |  Ephemeral |
| **PROJECT** | 專案維度隔離記憶 | 專案感知技能 | 持久 | 專案上下文 |
| **BOOKMARKS** | 書籤同步狀態 | 書籤同步技能 | 持久 | 興趣信號 |
| **VERIFICATION** | 驗證截圖/命令輸出 | VERIFY 階段鉤子 | 持久 | 證據留存 |

---

## 核心機制

### 1. 層次化設計原則
MEMORY 並非單一記憶庫，而是**分層分類的持久化儲存層**。區分邏輯：
- **RAW → DATA → KNOWLEDGE**：從原始資料到結構化知識的提煉路徑
- **MEMORY → KNOWLEDGE**：MEMORY 是 append-mostly 原始記錄，KNOWLEDGE 是精選整理過的知識圖譜
- **WORK → RESEARCH → WISDOM**：從工作產出到研究報告再到原子洞察的價值升級路徑

### 2. 自動填充協議
初始狀態全空，內容由以下事件觸發自動寫入：
- Algorithm Mode 觸發 → WORK/ 產生 ISA 檔案
- 對話互動 → RELATIONSHIP/ 寫入觀察
- 系統學習 → PAISYSTEMUPDATES/ 提案
- 攝取流程 → RAW/ 存放 → 解析 → DATA/
- 知識收割 → KNOWLEDGE/ 整理
- 洞察提取 → WISDOM/ 沉澱

### 3. 職業生涯記憶隔離
PROJECT/ 支援多專案並行記憶，各專案獨立子目錄，不污染全域命名空間，解決跨專案上下文混淆問題。

### 4. 驗證即程式碼文化
VERIFICATION/ 將「聲稱完成」與「實際證據」分離——截圖、命令輸出、curl 追蹤等作為可審計物件留存，對抗「應該可以工作」的心智模型。

### 5. 技能狀態隔離
SKILLS/ 讓每個技能維護自己的運行狀態（快取、評估歷史、用戶偏好），與技能代碼本體（~/.claude/skills/）分離，實現技能無狀態化設計。

---

## 關聯檔案

- T10 — CLAUDE Routing（路由至 Memory System 文件）
- T12 — ALGORITHM.md（Algorithm 寫入 WORK/ 的 ISA 機制上游）
- T11 — Memory System（本章）

---

## 與 Life-OS 的借鑒點

### 可借鑒設計

| PAI MEMORY 機制 | Life-OS 對應 | 改進建議 |
|----------------|-------------|---------|
| 分層 append-mostly | 目前 vault 混用記錄與產出 | 引入 RAW→DATA→KNOWLEDGE 分層概念 |
| PROJECT/ 專案隔離 | 目前 Projects 僅有 folder | 參考 PROJECT/ 建立專案維度上下文隔離 |
| VERIFICATION/ 留存證據 | 目前缺乏驗證留存機制 | 建立 VERIFICATION/ 或 equivalent |
| SCRATCHPAD/ 臨時區 | 目前臨時內容散落各處 | 建立統一臨時區，與長期內容清晰分離 |
| WORK/ slug 目錄（時間戳+任務名） | 目前 session 為非結構化 | 引入 slug 命名慣例，支援歷史復現 |

### 設計原則對照
- **PAI**：「新安裝全空，內容由使用行為自然填充」→ **Life-OS 可借鑒**：vault 初期輕量化，內容隨專案生長
- **PAI**：「每種內容有唯一正確歸屬」→ **Life-OS 可加強**：杜絕同一內容跨多檔案重複
- **PAI**：「自我演化路徑 LEARNING→PAISYSTEMUPDATES」→ **Life-OS 可借鑒**：建立系統自我改善的正式機制

---

## 檔案清單

所有分析的檔案（皆為 README 描述檔）：

1. `MEMORY/README.md`
2. `MEMORY/WORK/README.md`
3. `MEMORY/RELATIONSHIP/README.md`
4. `MEMORY/PAISYSTEMUPDATES/README.md`
5. `MEMORY/WISDOM/README.md`
6. `MEMORY/REFERENCE/README.md`
7. `MEMORY/AUTO/README.md`
8. `MEMORY/SKILLS/README.md`
9. `MEMORY/DATA/README.md`
10. `MEMORY/RESEARCH/README.md`
11. `MEMORY/KNOWLEDGE/README.md`
12. `MEMORY/RAW/README.md`
13. `MEMORY/SCRATCHPAD/README.md`
14. `MEMORY/PROJECT/README.md`
15. `MEMORY/BOOKMARKS/README.md`
16. `MEMORY/VERIFICATION/README.md`
