# Planning-with-Files Vault Pattern（planning-with-files 框架應用）

> 本檔案描述 planning-with-files 的三文件系統在 Obsidian vault 環境中的具體應用規則。
> 來源：[OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) v2.36.0

## 三文件各司其職

| 檔案 | 職責 | 內容性質 |
|------|------|---------|
| **`task_plan.md`** | **用戶合約 + 階段追蹤** | Phase 區塊 + checkbox 進度。嚴禁混入系統架構描述或設計產出。 |
| **`findings.md`** | **研究發現萃取** | 研究階段的知識蒸餾結果，外部框架描述、相關文獻分析。 |
| **`progress.md`** | **執行日誌** | Session 事實紀錄（完成了什麼、錯誤筆記、下一步），不包含決策脈絡。 |
| **`{name}-design.md`** | **設計產出（可選）** | 系統架構、規格定義、使用者確認的決策結果。是 plan 的產出，不是 plan 本身。 |

## 關鍵約束

### task_plan.md 是用戶合約，不是規格文件

```
❌ task_plan.md 內容：
- 系統架構描述（→ 放 system-design.md）
- 外部框架研究發現（→ 放 findings.md）
- 詳細規格定義（→ 放 {name}-design.md）

✅ task_plan.md 內容：
- Phase 1/2/3 階段劃分
- 每 Phase 的可勾選任務列表
- 當前任務的 checkbox 進度狀態
```

### 設計產出嚴禁混入規劃文件

用戶原話：
> 「design 這個檔案是計劃的產出結果，不可以跟規劃文件混為一談。」

**判斷標準**：如果一個檔案的內容是用戶閱讀後需要做出決策的規劃假設，屬 `task_plan.md`；如果是用戶已確認的設計輸出，屬 `{name}-design.md`。兩者不會出現在同一個檔案裡。

### Phase 結構是 task_plan.md 的必要條件

沒有 Phase 的 `task_plan.md` 失去追蹤意義——相當於只有一個大TODO。

最小有效結構成：
```markdown
## Phase 1：分析與確診
- [ ] T1.1 任務...
- [ ] T1.2 任務...

## Phase 2：設計與確認
- [ ] T2.1 任務...

## Phase 3：執行與驗收
- [ ] T3.1 任務...
```

## Obsidian Vault 實作位置

在 `30_Projects/32_Active/{Project}/` 資料夾下的典型結構：

```
{Project}/
├── task_plan.md        ← 規劃追蹤（Phase + checkbox）
├── findings.md         ← 研究萃取
├── progress.md        ← 執行日誌
├── {name}-design.md   ← 設計產出（可選）
└── references/        ← 支撐檔案
    ├── sources/        ← 原始素材
    └── templates/      ← 模板
```

## 與 Vault-Folder-Reorganization 的整合

當重組一個已包含 planning-with-files 三文件的 vault 時：

1. **先確認 task_plan.md 的 Phase 結構是否完整**——不完整的 task_plan 優先重構
2. **設計產出（design.md）與 task_plan.md 分離**——確認兩者沒有職責混淆
3. **進度同步**——progress.md 的任務狀態應與 task_plan.md 的 checkbox 一致
4. **Phase 完成後更新 checkbox**——在 progress.md 記錄的事實對應到 task_plan.md 的勾選

## 常見錯誤

| 錯誤 | 說明 |
|------|------|
| 將系統架構寫入 task_plan.md | 混淆了「規劃文件」與「設計文件」的職責 |
| 沒有 Phase 只有 TODO | 失去追蹤意義，progress 無法對應 |
| findings.md 包含已確認決策 | 發現僅供參考，決策應固化到 design.md |
| progress.md 寫成決策脈絡 | progress 是事實日誌，不是推理過程 |
| 在現有 vault 存在時創建新的 | 未先 `find` 確認目標資料夾已存在就直接另起爐灶（2026-05-05 教訓） |
| 多文件 vault 策略不一致 | `task_plan.md` 說「素材參考」，`system-design.md` 說「新建 vault 不動 Navi Helios」——同一專案的底層定位衝突。修正方法：確認 `task_plan.md` 立場後，將其他文件的第七章/ vault 策略統一至同一句話（2026-05-05 教訓） |
| 發現重複內容未即時合併 | `findings.md` 第四章出現兩個完全相同的「已確認決策」表格（僅格式不同）。定期檢查同章節是否有重複段落；編輯後習慣性往前翻找是否已有相同內容（2026-05-05 教訓） |

## 計劃演化模式（增生而非覆寫）

> ⚠️ 此原則來自 2026-05-05 session，DreadxMisty 確認。

**核心原則**：計劃是一本規劃日誌，不是狀態快照。

| 原則 | 說明 |
|------|------|
| 不刪除舊內容 | 每次變動在 Changelog 追加，不覆蓋 |
| Changelog 置頂 | `task_plan.md` 頂部永遠是最新變動記錄 |
| Phase 完成標記 ✅ | 不移動內容，僅標記狀態 + 日期 |
| 變動因素必填 | Changelog 每行必須回答「為什麼變」 |

**禁止行為**：
- ❌ 將 Phase 標記「廢棄」並刪除內容 → 改用「已合併至 Phase X」或「已暫停（原因）」
- ❌ 用「更新：」前綴覆寫舊內容 → 始終以 Changelog 追加方式記錄變化
