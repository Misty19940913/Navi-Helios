# Pattern: pat-102acf5d9ac8
**Tool:** skill_view  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T11:17:18.113471+00:00  
**Last seen:** 2026-05-03T11:17:18.113471+00:00

## Summary
API error in skill_view: {"success": true, "name": "vault-bulk-translation", "description": "批次翻譯 Obsidian vault 資料夾（英文→繁體中文）的工作流 — 包含語言偵測、優先級分類、

## Error hashes
- 62ead89df9a49777

## Last error
```
Error Type: api_error
Tool Args: {'name': 'vault-bulk-translation'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "vault-bulk-translation", "description": "批次翻譯 Obsidian vault 資料夾（英文→繁體中文）的工作流 — 包含語言偵測、優先級分類、超時處理、Template/Kit 保護", "tags": [], "related_skills": [], "content": "---\nname: vault-bulk-translation\ndescription: 批次翻譯 Obsidian vault 資料夾（英文→繁體中文）的工作流 — 包含語言偵測、優先級分類、超時處理、Template/Kit 保護\ntrigger:\n  - \"翻譯 vault\"\n  - \"翻譯所有檔案\"\n  - \"translate.*vault\"\n  - \"批次翻譯\"\n  - \"全部翻成中文\"\n  - \"600支援\"\nrequired_primitives:\n  - 02_data-retrieval\n  - 03_format-parsing\n  - 06_file-operations\n  - delegate_task\nproduces:\n  - 翻譯完成的檔案（in-place 覆寫）\n  - 翻譯狀態報告\nconsumed_by:\n  - vault-folder-evaluator（蒸餾/刪除/翻譯三軌之一）\nlast-updated: 2026-05-03\n---\n\n# Vault 批次翻譯工作流\n\n## 觸發條件\n\n用戶要求將 vault 中某資料夾的所有 .md 檔案翻譯成繁體中文。\n\n典型句式：\n- 「翻譯 600支援」\n- 「將這個資料夾全部翻成中文」\n- 「translate all files in X to Traditional Chinese」\n\n## 核心原則\n\n1. **Obsidian CLI 不可用時的降級策略**：直接用 `read_file`
```
