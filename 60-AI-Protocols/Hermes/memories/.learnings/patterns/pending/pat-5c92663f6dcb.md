# Pattern: pat-5c92663f6dcb
**Tool:** skill_manage  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-09T07:36:29.645658+00:00  
**Last seen:** 2026-05-09T07:36:29.645658+00:00

## Summary
Tool error in skill_manage: {"success": false, "error": "Could not find a match for old_string in the file\n\nDid you mean one of these sections?\n 

## Error hashes
- 6de291f07a2104e6

## Last error
```
Error Type: tool_error
Tool Args: {'action': 'patch', 'name': 'writing-plans', 'new_string': '## Location Convention (2026-05-09 established)\n\nUser\'s vault plans go to: `30_Projects/32_Active/<project>/`\n\nDo NOT use `.hermes/plans/` — that is the fallback location only.\n\n---\n\n## Session 2026-05-09 Corrections (Real Errors to Learn From)\n\n### Error 1: Wrong Skill Selected\nUser asked to plan a new trading system. I used `writing-plans` (single flat plan file) instead of `planning-with-files` (3-file system with task_plan.md + findings.md + progress.md). The user had to explicitly correct me.\n\n**Fix**: For multi-phase tasks requiring 5+ tool calls, always use `planning-with-files`.\n\n### Error 2: Wrong Save Location\nI saved the plan as `30_Projects/32_Active/新建交易系統_計畫.md` (single flat file). User said "計畫資料夾要放在30_Projects/32_Active" — meaning the plan should be in a subfolder with task_plan.md + findings.md + progress.md, not a single _計畫.md file.\n\n**Correct pattern**:\n
```
