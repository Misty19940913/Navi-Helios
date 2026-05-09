# Pattern: pat-ca92d9a3ae80
**Tool:** skill_view  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T14:19:25.975558+00:00  
**Last seen:** 2026-05-08T14:19:25.975558+00:00

## Summary
Logic error in skill_view: {"success": true, "name": "hermes-skills-inventory", "description": "Hermes vault skills 現況追蹤（2026-05-08 磁碟實查版）", "tags"

## Error hashes
- a1bc9c068939bfbf

## Last error
```
Error Type: logic_error
Tool Args: {'name': 'hermes-skills-inventory'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "hermes-skills-inventory", "description": "Hermes vault skills 現況追蹤（2026-05-08 磁碟實查版）", "tags": [], "related_skills": [], "content": "---\nname: hermes-skills-inventory\ndescription: Hermes vault skills 現況追蹤（2026-05-08 磁碟實查版）\ntrigger: 被問到「現在有哪些 skills」「某 skill 存在嗎」「skills_list 和磁碟對不上」時觸發\nrequired_primitives: []\n---\n\n# Hermes Skills Inventory（2026-05-08 磁碟實查版）\n\n## 對齊狀態（2026-05-08 最新）\n\n| 指標 | 數值 |\n|---|---|\n| Manifest (`.bundled_manifest`) | **120** |\n| 磁碟實際 (frontmatter `name:` 掃描) | **120** |\n| YAML 解析失敗 | **0**（本次修復 12 個） |\n| 差距 | **0** |\n\n> 2026-05-08 完成：\n> - 修復 `_primitives/01~08` 集體 YAML trigger 失效（引號內嵌雙引號）\n> - 修復 `creative/pretext`（`@` 特殊字元）、`creative/baoyu-comic`（`|` 語法）、`mlops/inference/vllm`（逗號非陣列）YAML 錯誤\n> - 補入 `workflow/pattern-pending` 缺少的 `name:` 欄位並註冊 manifest\n> - 清理 `vault-knowledge-distillation` 殭尸，納入 8 個未登錄技能\n\n## 對齊
```
