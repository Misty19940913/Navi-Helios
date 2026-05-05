# Pattern: pat-dceefebcab4f
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T14:47:23.977997+00:00  
**Last seen:** 2026-05-05T14:47:23.977997+00:00

## Summary
API error in read_file: {"content": "     1|# MOC — 專案索引\n     2|\n     3|## 專案列表\n     4|\n     5|| 專案 | 檔案 | 狀態 |\n     6||------|------|-----

## Error hashes
- c91c3c3b8ad13e46

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/memories/MOC/projects.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|# MOC — 專案索引\n     2|\n     3|## 專案列表\n     4|\n     5|| 專案 | 檔案 | 狀態 |\n     6||------|------|------|\n     7|| navi-calendar | `areas/navi-calendar.md` | 開發中 — esbuild cache bug + blockedBy 未實作 + WikiLink 渲染失敗 |\n     8|\n     9|## navi-calendar Plugin 現況\n    10|\n    11|- Latest commit: `c210ba8`\n    12|- 問題：`blockedBy` 有定義未實作，`deleteTaskEnhanced()` 未被呼叫\n    13|- esbuild silent no-op 需先 `rm -f main.js`\n    14|- Dev source 需放在 `~/plugin-studies/`，不放 `/tmp`\n    15|| navi-helios | `areas/navi-helios.md` | 設定完成 |\n    16|| arena | `areas/arena.md` | 進行中 |\n    17|| navi-life-os-plugin | `areas/navi-life-os-plugin.md` | 開發中 |\n    18|\n    19|## navi-calendar\n    20|\n    21|Obsidian Calendar plugin 開發，目標：TaskNotes-style inline rendering。\n    22|- 技術棧：Obsidian Plugin API、esbuild 編譯\n    23|- 關鍵發現：`production` mode 不輸出 watch，否則 timeout\
```
