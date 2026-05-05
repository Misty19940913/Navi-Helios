# MOC — 踩坑與方法論索引

## lessons

|| lesson | 檔案 | 描述 |
|--------|------|------|
| rendering | `areas/rendering.md` | CSS/rendering 除錯方法論（5個錯誤假設，已填入） |
| dom-css-clone-debug | `areas/rendering.md` | A plugin UI clone B plugin 外觀的完整流程 |
| navi-calendar-plugin-dev | `areas/navi-calendar.md` | Navi Calendar 插件開發實戰記錄 |
| obsidian-plugin-compilation-debugging | `areas/navi-calendar.md` | esbuild cache silent no-op build 除錯 |
| widget-inline-dom | `areas/rendering.md` | CodeMirror inline widget 全 span 原則 |
| obsidian-path-with-spaces | `MOC/lessons.md` | Obsidian vault 路徑含空格的處理方式 |

## 新增 lesson

### Obsidian 路徑含空格處理
- WSL 中 Obsidian vault 路徑含空格：`"/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/"`
- 所有 CLI 工具呼叫路徑都要用雙引號包起來

## 蒸餾優先順序

| Area | 價值 | 狀態 |
|------|------|------|
| `areas/rendering.md` | 高 — 所有 plugin UI 開發都用得到 | ✅ 已蒸餾（5 patterns） |
| `areas/navi-calendar.md` | 高 — 正在開發的插件 | ✅ 已蒸餾（11 sections） |
| `areas/navi-helios.md` | 中 — vault 架構穩定 | ⚠️ 待蒸餾 |
| `areas/arena.md` | 中 — Arena 進化框架 | ⚠️ 待蒸餾 |

## 蒸餾流程（反向：session → memory）

```
Step 1: session_search 挖（指定 topic，limit=3~5）
Step 2: 蒸餾成 atomic facts（每個錯誤假設 = 1 confirmed pattern）
Step 3: 寫入對應 area 檔
Step 4: 更新對應 MOC 的狀態
Step 5: 提交 git
```

## Pattern Pending 規則

- 成功 1 次 → 放 pending
- 成功 3 次 → 晉升 confirmed
- 失敗 → rejected



## [SESSION_20260426_212347] navi-calendar 完整 code review 方法論

- **每次部署前「再檢查一次」**：用戶說「每次檢查都發現新問題」，代表第一次 grep 搜關鍵字不夠 → 必須把整個 plugin 每個檔案全部讀過才能部署
- **修完要編譯部署驗證**：只改 code 不夠，要 `Deployed OK` 才算完成
- **GitHub repo 建立**：需要 GitHub PAT（ghp_...），可用 curl + REST API 建立 repo 並推送（不需要 gh CLI）
- **esbuild cache silent no-op**：刪 main.js 再重新編譯，確保不是 cache 殘留

## [SESSION_20260430_181013] INGEST 蒸餾工作流核心規則

- **Source 刪除條件**：atomic page 完整涵蓋原檔案內容時才能刪除 source；需用戶確認覆蓋率 100%
- **讀書筆記刪除原則**：與現有 atomic page 重疊率達 ~95% 的讀書筆記（第二手整理）→ 直接刪除，不蒸餾
- **試卷/操作型素材**：試卷題目（財富分數測驗.md）屬於操作型素材，非知識型 → 直接刪除不蒸餾
- **NotebookLM 用途限制**：僅用於「原始素材攝入」，非處理已消化過的筆記；實體書籍需先數位化（PDF/電子書）才能餵入
- **來源：20260430_181013**

## [SESSION_20260430_181746] 設計人生 INGEST 結果

- **覆蓋率確認流程**：先對比 source 與現有 atomic pages，輸出「已涵蓋（X檔）/需新建/已有歸屬」三類
- **已涵蓋率高**：19個設計人生檔案中，17個已完整涵蓋於 L-XXX atomic pages，蒸餾價值低
- **壞連結修復優先**：蒸餾前應先修復壞連結（指向不存在頁面的 wikilink），再評估蒸餾價值
- **來源：20260430_181746**

## [SESSION_20260430_182704] Navi 3.0 / Arena 前身 vs HUMAN_3.0 確認

- **`232-000/Navi 3.0` 路徑不存在**：實際只有「一人企業與人生設計：原子筆記總表.md」
- **HUMAN_3.0 = Arena 前身**：Navi 3.0 的 4 個相關檔案散落於舊資料各處，需交叉比對才能確認收錄狀態
- **Dan Koe newsletter 蒸餾**：000捕獲/未命名.md 是 Dan Koe newsletter（letters.thedankoe.com，主題：2026 行為改變/心理學/生產力），需蒸餾進 K-HUMAN3-* atomic pages
- **Anti-Vision Protocol**（K-HUMAN3-035）：早晨心理挖掘 6 題 + 具象化 5 題
- **一天重新設計生命 Protocol**（K-HUMAN3-038）：早晨/白天/晚間三段 + 30/90/180天週期
- **來源：20260430_182704**

## [SESSION_20260430_192916] 蒸餾價值評估維度

- **評估維度**：內容獨特性、結構完整性、資訊密度、壞連結風險
- **高分準則**：內容獨特性高（原創論述，非引用或濃縮）、有獨立論述而非wikilink堆砌
- **低分特徵**：~95% 與現有 atomic pages 重疊、大段落引用而非原創、僅wikilink無內容、骨幹式大綱
- **低分處置**：直接刪除，不浪費時間蒸餾
- **來源：20260430_192916**

## 蒸餾價值評分標準（Confirmed）

| 分數 | 意義 | 處置 |
|------|------|------|
| 1-2/10 | ~95% 重疊，無獨立價值 | 刪除 |
| 3-5/10 | 部分重疊，有補充價值 | 蒸餾補充現有頁面 |
| 6-8/10 | 有原創內容 | 完整蒸餾 |
| 9-10/10 | 全新領域知識 | 優先處理 |

## [SESSION_20260430_192916] 設計人生.md 壞連結清單（已知）

- `[[L-035-富而喜悅]]` → 不存在
- `[[L-041-生命之輪整合]]` → 不存在
- 這些是 設計人生.md 的已知壞連結，蒸餾前需先排除或修復
