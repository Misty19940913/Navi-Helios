# Pattern: pat-f3b74115e6ca
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:51:32.345516+00:00  
**Last seen:** 2026-05-05T10:51:32.345516+00:00

## Summary
Tool error in terminal: {"output": "Package: python3-send2trash\nVersion: 1.8.2-1\nPriority: optional\nSection: universe/python\nSource: send2tr

## Error hashes
- 3a967339025a6b97

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'apt show python3-send2trash 2>/dev/null | head -5 || sudo apt install -y python3-send2trash 2>&1 | tail -5'}

--- Error Output (last 30 lines) ---
{"output": "Package: python3-send2trash\nVersion: 1.8.2-1\nPriority: optional\nSection: universe/python\nSource: send2trash", "exit_code": 0, "error": null}

```
