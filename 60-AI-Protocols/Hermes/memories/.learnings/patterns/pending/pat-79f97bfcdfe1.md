# Pattern: pat-79f97bfcdfe1
**Tool:** skill_view  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T06:53:23.086901+00:00  
**Last seen:** 2026-05-04T06:53:23.086901+00:00

## Summary
Tool error in skill_view: {"success": true, "name": "vault-template-audit", "description": "When asked to review/organize vault templates, follow 

## Error hashes
- 574d9e5c338d89d7

## Last error
```
Error Type: tool_error
Tool Args: {'name': 'vault-template-audit'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "vault-template-audit", "description": "When asked to review/organize vault templates, follow this protocol — read all templates, check broken links, propose specific fixes without pushing decisions back.", "tags": [], "related_skills": [], "content": "---\nname: vault-template-audit\ndescription: When asked to review/organize vault templates, follow this protocol — read all templates, check broken links, propose specific fixes without pushing decisions back.\ntriggers:\n  - \"整理模板\"\n  - \"audit 81-Template\"\n  - \"vault template review\"\n  - \"80-System structure discussion\"\n---\n\n# Vault Template Audit Protocol\n\n## 實戰蒸餾（2026-04-30 重構）\n\n### 發現的問題模式\n1. `type: content` + `status: DONE` → 根本不是模板，是已完成產出，應刪除\n2. `type: content` + 應在專案資料夾 → 飄移模板，需搬家\n3. 兩個同名功能模板 → 深度比對，產出整合版，刪除多餘\n4. `type: content` 卻無實質內容的空殼 → 立即刪除\n5. 系統提供的模板 → `type: template`，放在 `
```
