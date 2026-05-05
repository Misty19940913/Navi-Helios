# Domain：Navi Helios — Vault 與 Obsidian 設定

## 環境

- Vault: `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios`
- Obsidian: 1.12.3
- Plugin format: CommonJS (--platform=node)

## 關鍵設定

- skills 目錄：`60-AI-Protocols/Hermes/skills/`
- memory 目錄：`60-AI-Protocols/Hermes/memory/`
- 兩者皆為 symlink 指向 Hermes-Brain canonical 位置

## 三層記憶系統（重建後）

- Layer 1：`MEMORY.md`（session 自動 injection）
- Layer 2：`MOC/`（領域 MOC 索引）
- Layer 3：`domains/`（具體領域記憶）

Canonical：`~/Hermes-Brain/.hermes/memories/`
Vault symlink：`60-AI-Protocols/Hermes/memory/`

## Design 參考資料

- 14個品牌 MD 檔案
- `_Design_Preview.html`（211KB，16品牌比對）
- 工作流：MD → _Design_Preview.html（每次蓋掉舊版）


## [20260430_173000] Vault 路徑與同步架構確認

| 項目 | 值 |
|------|-----|
| Vault path | `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/` |
| Skills 位置 | `60-AI-Protocols/Hermes/skills/` |
| GitHub backup | private repo `Misty19940913/navi-helios-vault` |
| 備份範圍 | 只涵蓋 `60-AI-Protocols/Hermes/` |
| Symlink | `~/.hermes/skills` → vault skills/ |

### ⚠️ OneDrive + Git 衝突警告
- 不要在 OneDrive 同步的資料夾內執行 `git init`
- `.git/objects/` 可能損壞，chmod 會失敗
- 解決：Git backup 只做 `60-AI-Protocols/Hermes/` 的獨立 git repo

### Source
- Sessions: 20260426_011907, 20260426_003829


---

## [20260505_213000] INGEST 代價昂貴錯誤實錄（蒸餾自 sessions）

以下 Pattern 來自真实錯誤，代價昂貴。遇到相同場景時直接套用，不要重新犯錯。

### Pattern 1：MOC 選擇以內容主題為準，不是來源路徑

**錯誤：** 來源檔案在哪个資料夾，就近選 MOC；或看到 MOC 列表有類似的就選那個。

**代價：** 浪費編號（K-WEALTH-001/002）、事後遷移 45 分鐘。

**L-series trap：** 看見 `L-` MOC 先問「這是 Stanford DYL 框架嗎？」
- 是（設計人生、Ikigai、奧德賽計劃、原型測試）→ L-人生設計
- 否（Life OS、PARA、PKM、LifeOS 追蹤框架）→ K-SELF 或對應 K-系列

**正確流程：**
```
Step 1: 讀取來源內容，理解實質主題
Step 2: 列出候選 MOC
Step 3: 問「這份知識是關於什麼領域？」
Step 4: 選最匹配的 MOC
Step 5: 不確定 → 先問用戶
```

### Pattern 2：Namespace 碰撞——新建 MOC 前必須檢查根目錄

**錯誤：** 直接建 `K-WEALTH-001/` 目錄，蒸餾完才發現根目錄已有 `K-WEALTH-001.md`（內容領域完全不同）。

**代價：** 廢棄已建頁面、額外遷移。

**預防：** 創建新 MOC 目錄前，先 `ls {vault}/40_Knowledge/41_原子知識/` 檢查是否已有同名 namespace 檔案。

### Pattern 3：Batch INGEST 統一在主流程執行，不委派 subagent

**錯誤：** 委派 subagent 執行 Batch INGEST。

**症狀：** 所有工具呼叫集體失敗，錯誤路徑是從未出現過的路徑（如 doubled "Obsidian" 疊加）。

**代價：** 32 個工具呼叫全部失敗，INGEST 完全失敗。

**Protocol：** Batch INGEST（含 5+ 檔案）統一在主流程執行，直接用 `subprocess.run(shell=True)` + Python `open()` 讀寫。

### Pattern 4：WSL/OneDrive 含中文路徑——讀寫工具選擇

| 操作 | 正確工具 |
|:---|:---|
| 含中文路徑**讀取** | `subprocess.run(f'cat "{path}"', shell=True, capture_output=True)` |
| 含中文路徑**寫入** | Python `open()` in `execute_code` |
| `open()` 在 OneDrive 路徑 | **失敗**（I/O error）|

**OneDrive sync I/O 恢復：** `cat` 回傳 0 bytes 但 `ls` 非空 → 優先搜尋同目錄的「原子化清單」版本，通常可讀。

### Pattern 5：Subagent 委派時 vault 路徑必須明確

委派 `delegate_task` 時，context 必須包含：
```
vault = "/mnt/c/Users/安泰/OneDrive/Apps/remotely-save/Navi Helios/"
```
並明確標記「所有讀寫操作用 shell cat + execute_code，不要用 terminal/read_file」。

### Pattern 6：討論記錄 vault 寫入決策

| 情況 | 寫入目標 |
|:---|:---|
| 涉及 atomic pages wikilinks | `remotely-save` vault（provenance 鏈完整） |
| 純對話待蒸餾 | `Obsidian` vault 即可 |
