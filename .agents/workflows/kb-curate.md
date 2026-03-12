---
description: 執行 410 原子化知識庫的全面審核、去重與 YAML 標準化。
---

# //CURATE_KB 工作流

此工作流用於自動化維護知識庫秩序，解決重複檔案與 YAML 規範漂移問題。

## 執行步驟

1. **初始審核 (Audit)**
   - 呼叫 `kb-curator` 技能中的 `audit_vault` 邏輯。
   - 掃描 `410 原子化知識庫` 識別：
     - 同名但後綴不同的重複組。
     - 缺失或不符合 7 行核心規範的 YAML。
   - 產出 `📋 知識庫狀態報告`。

2. **人工確認 (User Approval)**
   - Misty 審閱報告並決定合併優先級。
   - 若同意特定合併案，進入下一步。

3. **執行合併與校準 (Standardize & Fix)**
   - 針對批准的檔案，執行 `Naming Standardization`（中文 (英文).md）。
   - 執行 YAML 校準：
     - `status: DONE` -> `evergreen`。
     - 為 `subject`, `parent`, `related` 加上括號與雙引號。
   - 整合文件內容（保留實踐指南，更新洞見 Callout）。

4. **連結全局修復 (Link Repair)**
   - 全局搜尋並替換被合併/改名檔案的 Wikilinks。

5. **存檔與日誌**
   - 執行 `//log` 記錄整理細節。
