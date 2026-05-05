# Obsidian Plugin Multi-Patch Safety Reference

> Condensed from `obsidian-plugin-multi-patch` — safety workflow for patching the same source file multiple times.

## Core Principle
**每次 patch 後立即 re-read 全檔追蹤狀態。**

`offset/limit` 分頁讀取不會反映 patch 的變更。patch 是精確替換，但當你先後 patch 了 A → B → C 三個不同位置，第三次 patch 的 `old_string` 必須是 B 修改後的精確內容。

## Standard Flow

```
read_file(full) → patch(1) → read_file(full) → patch(2) → ... → build → deploy
```

## Structural Changes: Use write_file Instead

對於新增整個 function 或大量重寫，用 `write_file` 整體替換，比多次 patch 更安全：
1. 先 read_file 全檔
2. 在記憶體中修改
3. write_file 一次寫回

## Verification Levels

| 改動類型 | 最小驗證 |
|---------|---------|
| 新增 field（types.ts） | `tsc -noEmit --skipLibCheck` 確認無 error |
| 修改 parse function | `tsc` + build 確認 |
| 修改 lifecycle（main.ts）| build + 部署 + vault reload |
| UI widget 改動 | build + 部署 + vault reload + 截圖確認 |

## Structural Damage Diagnosis

當多段 patch 後出現「看起來正確但 TypeScript 編譯失敗」時：

1. **先用 `sed` + `cat -A` 確認縮進字元：**
   ```bash
   sed -n 'L,L+p' file.ts | cat -A
   ```
   `cat -A` 顯示 tab（`^I`）vs 空格 vs 混合。多段 patch 後極易產生 tab/space 混用。

2. **確認結構完整性：** 檢查 `try { ... } catch` 是否同層級、`for` 迴圈閉合 `}` 是否在正確位置。

3. **若結構複雜（巢狀 try/for/if 超過 3 層），放棄下一個 patch，改用 write_file 整段重寫。**

## Live Session Record (2026-04-28)

`TaskService.ts` `parseTasksFromFile` 新增 `blockedBy` 解析 + GAP 4 parent/children block 時，連續 patch 造成結構損壞：
- `} catch (e)` 縮進層級錯誤（出現在 `if (!alreadyHasLine0)` 內層而非 `try` 層級）
- `for` 迴圈閉合 `}` 消失
- **診斷工具：** `sed -n '136,145p' /tmp/.../TaskService.ts | cat -A` 確認縮進字元
- **修復方式：** 放棄下一個 patch，直接重寫整個 GAP 4 block（40 行），一次性寫回
