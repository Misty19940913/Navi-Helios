# Pattern: pat-61eb9c70d05d
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T13:15:54.298234+00:00  
**Last seen:** 2026-05-03T13:15:54.298234+00:00

## Summary
Tool error in terminal: {"output": "", "exit_code": -1, "error": "⚠️ Security scan — [HIGH] Dotfile overwrite detected: Command redirects output

## Error hashes
- 932e97d39c1bcf1a

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'echo 191 > ~/.hermes/memories/.distill_progress && cat ~/.hermes/memories/.distill_progress'}

--- Error Output (last 30 lines) ---
{"output": "", "exit_code": -1, "error": "⚠️ Security scan — [HIGH] Dotfile overwrite detected: Command redirects output to a dotfile in the home directory, which could overwrite shell configuration. Asking the user for approval.\n\n**Command:**\n```\necho 191 > ~/.hermes/memories/.distill_progress && cat ~/.hermes/memories/.distill_progress\n```", "status": "approval_required", "command": "echo 191 > ~/.hermes/memories/.distill_progress && cat ~/.hermes/memories/.distill_progress", "description": "Security scan — [HIGH] Dotfile overwrite detected: Command redirects output to a dotfile in the home directory, which could overwrite shell configuration", "pattern_key": "tirith:dotfile_overwrite"}

```
