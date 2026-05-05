# Pattern: pat-5c92663f6dcb
**Tool:** skill_manage  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T15:04:14.652391+00:00  
**Last seen:** 2026-05-05T15:04:14.652391+00:00

## Summary
Tool error in skill_manage: {"success": false, "error": "Could not find a match for old_string in the file\n\nDid you mean one of these sections?\n 

## Error hashes
- 4662434915119aee

## Last error
```
Error Type: tool_error
Tool Args: {'action': 'patch', 'name': 'vault-folder-reorganization', 'new_string': '## 相關參考文檔\n\n- `references/life-os-kce-spaces.md` — Life-OS KCE 空間歸屬矛盾案例（跨文件審查lesson）', 'old_string': '## Related Skills'}

--- Error Output (last 30 lines) ---
{"success": false, "error": "Could not find a match for old_string in the file\n\nDid you mean one of these sections?\n 147| ---\n 148| \n 149| ## 吸收的相關 Skills\n 150| \n 151| 以下技能已被整合進本傘狀技能，作為 references/ 下的支撐檔案：\n---\n 165| - **不應該**作為 skill 安裝到 `~/.hermes/skills/`\n 166| \n 167| **Hermes Skill**：\n 168| - 存在於 `~/.hermes/skills/` 目錄\n 169| - 是可執行程序，包含步驟、判斷條件、交付標準\n---\n 157| | ~~`planning-with-files-vault-pattern`~~ | ~~已移除~~ | ⚠️ 該文檔為 vault 內部約定，非 Hermes 可執行技能。詳見下方「Vault Pattern vs Skill 辨別原則」|\n 158| \n 159| ## Vault Pattern vs Skill 辨別原則（2026-05-05 新增）\n 160| \n 161| **Vault Pattern（例如 `planning-with-files-vault-pattern.md`）**：", "file_preview": "---\nname: vault-folder-reorganization\ndescription: Obsidian vault 資料夾重
```
