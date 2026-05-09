# Pattern: pat-cbdec261e91c
**Tool:** skill_view  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-09T07:46:12.337138+00:00  
**Last seen:** 2026-05-09T07:46:12.337138+00:00

## Summary
Tool error in skill_view: {"success": false, "error": "File 'examples.md' not found in skill 'planning-with-files'.", "available_files": {"templat

## Error hashes
- 450e4a7488954a98

## Last error
```
Error Type: tool_error
Tool Args: {'file_path': 'examples.md', 'name': 'planning-with-files'}

--- Error Output (last 30 lines) ---
{"success": false, "error": "File 'examples.md' not found in skill 'planning-with-files'.", "available_files": {"templates": ["templates/analytics_findings.md", "templates/analytics_task_plan.md", "templates/findings.md", "templates/progress.md", "templates/task_plan.md"], "scripts": ["scripts/check-complete.ps1", "scripts/check-complete.sh", "scripts/check-continue.sh", "scripts/init-session.ps1", "scripts/init-session.sh", "scripts/session-catchup.py", "scripts/sync-ide-folders.py"]}, "hint": "Use one of the available file paths listed above"}

```
