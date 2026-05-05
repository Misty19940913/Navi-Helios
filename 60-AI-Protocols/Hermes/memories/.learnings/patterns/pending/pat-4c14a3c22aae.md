# Pattern: pat-4c14a3c22aae
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T14:59:23.658546+00:00  
**Last seen:** 2026-05-05T14:59:23.658546+00:00

## Summary
Tool error in terminal: {"output": "cwd: .\n  docker_mount_cwd_to_workspace: false\n    - cwd", "exit_code": 0, "error": null}

## Error hashes
- 4183442a58c9bbfd

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -i "workdir\\|cwd\\|directory" /home/misty/.hermes/config.yaml | head -20'}

--- Error Output (last 30 lines) ---
{"output": "cwd: .\n  docker_mount_cwd_to_workspace: false\n    - cwd", "exit_code": 0, "error": null}

```
