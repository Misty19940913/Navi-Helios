---
name: vault-folder-reorganization
description: Obsidian vault 資料夾重組工作流 — 從混亂結構到清晰分類的完整流程
trigger:
  - "整理 vault 內某個混亂的資料夾"
  - "刪除重複、隔離歷史、修正結構"
  - "整理一次"
  - "打掉重練"
  - "重組 vault 的規劃文件"
  - "確認 task_plan 的 Phase 結構"
  - "Life OS 系統建構"
  - "日誌系統 任務系統 目標系統"
produces:
  - 重組後的 vault 資料夾結構（已整理的檔案分類）
  - 蒸餾後的 MOC 內容（精煉要點合併至目標 MOC）
  - 歷史隔離區檔案（已歸檔至 70_歷史存檔/ 或 99_歷史廢墟/）
  - 刪除檔案清單（重複、蒸餾後廢棄、空殼檔）
consumed_by:
  - 用戶（vault owner，檢視與驗收整理後的 vault）
  - 後續 agents（查詢整理後的 vault 結構以執行其他任務）
---

# Vault 資料夾重組工作流

## 觸發條件
用戶要求整理 vault 內某個混亂的資料夾（刪除重複、隔離歷史、修正結構）。

## 核心原則
1. **先讀後動** — 不依賴檔名判斷，全部讀過一遍再分類
2. **brand-mixed 優先識別** — 同一資料夾內可能混雜不同品牌/系統的檔案（例：東黎 vs SentryPigeon）
3. **分階段確認** — 分析 → 提案 → 執行，每階段用戶確認後再動
4. **注意雲端還原** — OneDrive/Google Drive 等會還原刪除的資料夾，刪除後立即檢查
5. **wikilink 含冒號** — `[[標題：副標題]]` 在某些場景下冒號後被截斷，寫入時用完整標題

## 工作流程

### Phase 1：完整掃描
```
delegate_task（leaf）讀取所有檔案的 frontmatter + 前 20 行
產出：檔案清單（路徑 | 用途 | 狀態 | 品牌系統）
```

### Phase 2：分類分析
| 類別 | 判斷標準 |
|---|---|
| 有效檔案 | 屬於當前系統，內容完整，有實際用途 |
| 重複檔案 | 內容與另一檔案高度重疊，可刪除 |
| 歷史隔離檔 | 屬於舊系統/已棄用品牌，需移出主軸 |
| 孤島檔案 | 無法連結到任何系統流程的檔案 |
| 失效連結 | parent/related 指向不存在的檔案或資料夾 |

### Phase 3：提案架構
用文字呈現「建議的新資料夾結構」，包含每個資料夾的職責定義。

### Phase 4：執行（按用戶確認的範圍）
1. 搬遷歷史檔案至隔離區（`70_歷史存檔/` 或 `99_歷史廢墟/`）
2. 刪除重複檔案
3. 刪除空資料夾（注意雲端同步可能還原）
4. 更新 MOC 文件的 wikilinks

### Phase 5：驗收
確認最終檔案結構與提案一致，檢查是否有 OneDrive 還原的資料夾。

## 模式 B（本次 `100夢想/` 案例）：蒸餾-分流 Pattern

當待處理資料夾同時包含**有長尾價值的實際內容**（值得完整保留）和**可被現有 MOC 覆蓋的內容**（蒸餾後可刪除）時採用。

### 判斷邏輯
| 檔案類型 | 處理方式 |
|---|---|
| 實際內容，且有增量價值（如深度敘事、獨特架構） | 搬入新 anchor 位置保留完整版本 |
| 實際內容，但核心內容已被目標 MOC 覆蓋 | 蒸餾要點進 MOC後刪除原檔 |
| 模板格式、引導問題 | 遷入 `81-Template/`，更新 type=template |
| 極低資訊量（<5行）且無架構價值 | 直接蒸餾進 MOC，刪除原檔 |

### 執行順序
1. 先讀完所有檔案，建立「目標 MOC 現有內容覆蓋度圖譜」
2. 對每檔逐一回報：「目標 MOC 現有內容覆蓋度 X%，差異是...」
3. 用戶確認「蒸餾進 MOC」或「完整保留」或「兩者都要」
4. 先建立新 anchor 資料夾 → 搬遷完整保留檔案
5. 再執行 MOC 蒸餾
6. 最後刪除已蒸餾檔案 + 空資料夾

### 蒸餾原則
- 不要只做「搬移」，要確認目標 MOC 的現有內容
- 當目標 MOC 已有類似內容時，蒸餾增量差異而非簡單附錄
- 資訊量極低的檔案（<5行）不值得佔一個檔案，直接蒸餾進 MOC

---

## MOC 內部章節 vs. 獨立檔案判斷標準

當一個 MOC 涵蓋多個子領域時，用以下標準判斷該用哪種方式：

### 做法 B（推薦）：同一 MOC + 內部章節
用於滿足以下**全部條件**的情況：
- 子領域內容 **< 80 行**
- 子領域**不會被其他 MOC 單獨引用**
- 子領域**沒有自己的子 MOC**
- 子領域沒有獨立的維護責任人

### 做法 A（需要時才用）：獨立檔案 + parent 鏈接
用於滿足以下**任一條件**的情況：
- 子領域內容 **> 150 行**
- 子領域**會被其他 MOC 直接引用**
- 子領域**有自己的子 MOC**
- 子領域有獨立的維護責任人

**⚠️ 邏輯陷阱（2026-05-09 教訓）**：描述做法 B 時，不要說「同一檔案分段落」然後提出「兩個檔案 + parent 鏈接」作為實作——這是自相矛盾。做法 B 就是讓子領域內容**直接內嵌在 MOC 內**，不需要獨立成另一個檔案。

### 執行方式：做法 B 內嵌章節
```
K-AI_人工智慧系統_MOC.md  ← 單一檔案
  ## SKILL 系統
  ## Agent 系統      ← 直接內嵌，不需要獨立檔案
  ## 插件系統
```
每個子領域是 MOC 內的 `## 二級標題`，不需要另外建立檔案。

---

## 陷阱與解法
- **OneDrive 刪除後還原**：刪除後立即 `ls` 確認，發現還原立即重新刪除
- **wikilink 指向資料夾而非檔案**：Obsidian wikilink `[[folder]]` 無法解析，須改用路徑文字 `folder/`
- **parent 連結指向已刪除 MOC**：這類 frontmatter 問題需逐檔修正，列為 TODO 逐項處理
- **品牌混雜**：同一資料夾內多個品牌系統的檔案，必須讀取內容才能發現
- **wikilink 含冒號截斷**：`[[標題：副標題]]` 寫入時冒號後可能被截斷，寫入 wikilink 時始終使用完整標題
- **obsidian-cli 需 API key**：若無 `OBSIDIAN_API_KEY` 環境變數，CLI 不可用。 vault 為 `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`，可用 direct file ops 替代 CLI
- **wikilink 命名不一致**：MOC 內的 wikilink（如 `H3.0-*`、`010_*`、`B2.1_*`）可能已存在於 atomic notes 但命名不同。修復前必須先搜尋 atomic dir 確認 target 存在，再用映射表替換
- **❗ 未確認現有 vault 結構就創建新的**：最大錯誤——在 `32_Active/` 已存在 `Life-OS/` 且包含完整 `task_plan.md`/`system-design.md`/`findings.md`/`progress.md` 四文件的情況下，仍錯誤創建 `Life-OS-New/`。正確做法：**先 `find` 確認目標資料夾是否已存在**，已存在的 vault 應直接更新而非另起爐灶

## 用戶決策風格
Misty 偏好**果斷明確**方案。面對複雜整理任務時：
- 接受「完整盤點一次再動」的延遲
- 回覆通常是甲/乙/丙 直接選，不模糊
- 刪除果斷（不需要確認第二遍）
- 喜歡「一個一個來」的順序處理，不喜歡一次提出太多待辦

## 驗收清單
- [ ] 所有 wikilinks 可解析（無 `[[不存在]]`）
- [ ] 無失效 parent/related 連結
- [ ] 歷史隔離區已歸檔
- [ ] 雲端同步後無還原資料夾

---

## 任務追蹤：Changelog 增生模式

當 vault 內的規劃文件（`task_plan.md`）需要記錄變動時，採用**增生演化**而非覆寫。

### 核心原則
- **不刪除、不覆寫舊內容** — 計劃是一本規劃日誌，不是狀態快照
- **Changelog 置頂** — 每次實質變動（新增/刪除/重寫 Phase）在頂部追加一行
- **Phase 完成不移動** — 標記 ✅ + 日期，內容留在原位置

### 必要結構
```markdown
## 變動日誌（Changelog）

| 日期 | 變動因素 | 說明 |
|------|----------|------|
| 2026-05-05 | 整合新需求 | 新增 Phase 4，調整 Phase 3 內容 |
| 2026-05-04 | 初始版本 | 建立 task_plan.md，Phase 1-3 規劃 |

---

## Phase 1：... ✅（2026-05-04）
## Phase 2：... 🔵
## Phase 3：...
```

### 禁止行為
- ❌ 將 Phase 標記「廢棄」並刪除內容 → 改用「已合併至 Phase X」或「已暫停（原因）」
- ❌ 用「更新：」前綴覆寫舊內容 → 始終以 Changelog 追加方式記錄變化
- ❌ 在現有 vault 存在時創建新的 → 未先 `find` 確認目標資料夾已存在，直接另起爐灶（2026-05-05 教訓）

---

## 吸收的相關 Skills

以下技能已被整合進本傘狀技能，作為 references/ 下的支撐檔案：

| 吸收的 Skill | 內容形式 | 觸發場景 |
|--------------|---------|---------|
| `vault-folder-evaluator` | `references/vault-folder-evaluator.md` | 評估資料夾的蒸餾/刪除價值 |
| `vault-file-restore-from-git` | `references/vault-file-restore-from-git.md` | 從 vault-git 備份還原被刪除或未同步的檔案 |
| `life-os-kce-spaces` | `references/life-os-kce-spaces.md` | 跨文件 KCE 空間歸屬審查（圖vs文、口述vs圖示不一致） |
| ~~`planning-with-files-vault-pattern`~~ | ~~已移除~~ | ⚠️ 該文檔為 vault 內部約定，非 Hermes 可執行技能。詳見下方「Vault Pattern vs Skill 辨別原則」|
| `232-series-distillation` | `references/232-series-distillation.md` | 232 系列蒸餾實際案例記錄（2026-05-09）|
| `wikilink-fix-mapping` | `references/wikilink-fix-mapping.md` | MOC wikilink 失效映射修復流程，含 H3.0/Arena/B2.0 案例 |

## Vault Pattern vs Skill 辨別原則（2026-05-05 新增）

**Vault Pattern（例如 `planning-with-files-vault-pattern.md`）**：
- 存在於 Obsidian vault 內的 `references/` 目錄
- 是靜態描述文件，描述 vault 的結構約定
- 回答：「這個 vault 的專案資料夾應該有哪些檔案？」
- **不應該**作為 skill 安裝到 `~/.hermes/skills/`

**Hermes Skill**：
- 存在於 `~/.hermes/skills/` 目錄
- 是可執行程序，包含步驟、判斷條件、交付標準
- 回答：「我該怎麼操作/執行某件事？」
- 可被 `skill_view()` 載入並由 Hermes 執行

**兩者不應混淆**：將 vault pattern 當 skill 裝會讓 Hermes 試圖「執行」一個純描述性文件，且佔用 skill 容量配額。

**觸發信號**：當用戶提到「planning-with-files」、「三文件」、「task_plan.md/findings.md/progress.md」時，應視為 vault 內部約定的應用場景，調用 `references/planning-with-files-vault-pattern.md` 作為參考，而非嘗試執行它。
