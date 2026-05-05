# MOC — 專案索引

## 專案列表

| 專案 | 檔案 | 狀態 |
|------|------|------|
| navi-calendar | `areas/navi-calendar.md` | 開發中 — esbuild cache bug + blockedBy 未實作 + WikiLink 渲染失敗 |

## navi-calendar Plugin 現況

- Latest commit: `c210ba8`
- 問題：`blockedBy` 有定義未實作，`deleteTaskEnhanced()` 未被呼叫
- esbuild silent no-op 需先 `rm -f main.js`
- Dev source 需放在 `~/plugin-studies/`，不放 `/tmp`
| navi-helios | `areas/navi-helios.md` | 設定完成 |
| arena | `areas/arena.md` | 進行中 |
| navi-life-os-plugin | `areas/navi-life-os-plugin.md` | 開發中 |

## navi-calendar

Obsidian Calendar plugin 開發，目標：TaskNotes-style inline rendering。
- 技術棧：Obsidian Plugin API、esbuild 編譯
- 關鍵發現：`production` mode 不輸出 watch，否則 timeout
- 最新：Phase 0+1+2 部署完成，但用戶抱怨看不見 ribbon icon

## Navi 公司多代理體系

來源：`60-AI-Protocols/62-學習區/1/workspace/`

| Agent | 職位 | 職務 |
|-------|------|------|
| Navi 🦊 | L1 合夥人 | 主代理，策略夥伴，Misty 稱「Boss」 |
| Larvis | L1-Boss祕書 | 品質把關、任務協調、團隊管理 |
| doc-analyster | L3 文書組 | 讀取資料、理解摘要 |
| doc-editor | L3 文書組 | 書寫長文、內容整合 |
| doc-architecter | L3 文書組 | 知識結構設計、MOC建立 |
| doc-leader | 文書組組長 | 組內管理 |
| trader | L2 金融組組長 | 市場流動性分析、量化交易 |

核心文件（三件套）：
- `IDENTITY.md` — 身份定位
- `SOUL.md` — 人格原則（實質效用勝於情緒、先找答案再提問、Owner心態）
- `AGENTS.md` — 工作區協議（啟動流程、記憶系統、心跳機制）

編輯協議：複製 → `{{原始檔名}}-{{編輯者}}` → 更新 YAML frontmatter（version, last-editor, time_modified）

Source: 20260426_011907

## 技能整合分析

### knowledge-triage 技能已驗證可用
- 流程：萃取 inbox 檔 → 寫入 K-* → 用 `[[wiki-links]]` 取代原始內容
- 語義去重：需檢查 42_MOC/ 確認是否已存在
- 進展落後：僅處理 2/20 檔案

### brainstorm / plan / planning-with-files 三技能比較
| 技能 | 來源 | 複雜度 | 獨家機制 |
|------|------|--------|----------|
| brainstorm | pro-kit 04（雷小蒙） | 中 | HARD-GATE、溝通模式切換 |
| plan | Hermes 原生 | 輕 | 無特殊機制 |
| planning-with-files | openclaw/navi | 重 | 狀態機、3-Strike、正式審批 |

### 三者邏輯順序
```
knowledge-triage → brainstorm → planning-with-files
（萃取）       （規劃）    （執行追蹤）
```

## navi-helios

Vault + Obsidian 設定架構。
- Vault: `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios`
- Obsidian: 1.12.3，plugin format: CommonJS (--platform=node)

## arena

Arena 專案（詳見 `areas/arena.md`）

## navi-life-os-plugin

esbuild `production` mode 不輸出 watch，否則 timeout。
驗證編譯：`node esbuild.config.mjs production`


## [SESSION_20260430_181013] knowledge-triage v1.1.0 — 原子知識萃取流程

### 核心流程（蒸餾 vs 舊流程）
| 舊流程 | 新流程（v1.1） |
|---------|----------------|
| 產生詳細分析報告 | 每篇萃取 1~N 個原子知識 |
| 知識困在報告裡 | 知識直接進 `41_原子知識/K-*` |
| 無查重機制 | 先查 `42_MOC/` 語意重複 |
| 原始檔案不動 | 原始檔改寫成「連結地圖」 |
| 4階段18子任務 | A~G 步驟線性流程 |

### 新關鍵步驟
- 步驟C：前往 `42_MOC/` 語意查重（不只找同名）
- 步驟D：重複 → 更新現有 atomic；新知識 → 新建 atomic + 雙向連結
- 步驟E：用 `[[wiki-link]]` 取代原始檔案內容

### INGEST 刪除原則
- atomic page 完整涵蓋 source 內容 → 用戶確認覆蓋率 → 刪除 source
- 讀書筆記（~95% 重疊）→ 直接刪除不蒸餾
- 試卷/操作型素材 → 直接刪除不蒸餾

### 新增 atomic pages（本次 session）
| ID | 內容 |
|----|------|
| K-CAREER-007 | 個人獲利模式（九宮格框架、價值/活動導向轉變） |
| K-WEALTH-003 | 五大資產框架（定義、財富儀表板、實踐框架） |
| K-CONTENT-0XX | SWOT、4P、WHO×WHAT×HOW、內容鉤子矩陣 |
| K-HUMAN3-035 | Anti-Vision Protocol（早晨6題+具象化5題） |
| K-HUMAN3-038 | 一天重新設計生命 Protocol（30/90/180天週期） |


## [SESSION_20260430_181746] 設計人生 INGEST 覆蓋率分析

- 19個檔案中 17個已涵蓋於現有 L-XXX atomic pages
- 1個蒸餾進 `30_Projects/33_Done/設計人生/`（設計人生整合筆記.md）
- 1個已有歸屬（財富流沙盤.md → K-FIN）
- 壞連結清單：[[L-035-富而喜悅]]、[[L-041-生命之輪整合]] 不存在


## [SESSION_20260430_182704] Arena 前身確認

- Navi 3.0 ≠ `232-000/Navi 3.0`（該路徑不存在）
- `HUMAN_3.0`（`30_Projects/33_Done/HUMAN_3.0/`）= Arena 前身
- 相關檔案散落舊資料各處，需交叉比對才能確認收錄狀態


## [20260430_173000] Discord auto_thread 問題已解決
- `auto_thread: false` — Hermes 回覆 Discord 訊息時不再自動建立討論串
- Source: 20260426_004408

## [20260430_173000] Vault-Git 同步架構
- Vault → OneDrive 即時同步
- `60-AI-Protocols/Hermes/` → GitHub private repo 備份
- 兩者分開，避免 OneDrive/git 衝突
- Source: 20260426_011907



## [SESSION_20260426_212347] navi-calendar 架構修復（2026-04-26）

- Repo: `Misty19940913/navi-calendar`（GitHub token: ghp_Rg...MclX）
- Latest commit 後：split-right/split-bottom 移除；openDirection 只留 replace/new-tab；新增 miniCalendarSidebar 設定
- getLeaf(true) → getLeaf("tab") 修正在 TaskService.openDailyNote()
- icon 從 calendar-with-checkmark 改為 calendar（三個視圖）
- ViewStateManager 寫入不存在欄位的 runtime bug 已修（改為 no-op + TODO）
- Dev path: `~/plugin-studies/navi-calendar`（不再放 /tmp）
