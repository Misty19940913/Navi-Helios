# Pattern: pat-5ccd203b76a3
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:26:25.786378+00:00  
**Last seen:** 2026-05-04T17:26:25.786378+00:00

## Summary
Tool error in terminal: {"output": "", "exit_code": 0, "error": null, "approval": "Command required approval (shell command via -c/-lc flag) and

## Error hashes
- 4ff4ecec26b36b18

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'find ~/.hermes/skills -name "SKILL.md" | sort | xargs -I{} sh -c \'cat {}/../metadata.yaml 2>/dev/null || echo "---"; basename $(dirname {})\' 2>/dev/null | grep -E "^(obsidian|llm-wiki|note-taking|wiki|vault)" -i | sort | uniq'}

--- Error Output (last 30 lines) ---
{"output": "", "exit_code": 0, "error": null, "approval": "Command required approval (shell command via -c/-lc flag) and was approved by the user."}

```
