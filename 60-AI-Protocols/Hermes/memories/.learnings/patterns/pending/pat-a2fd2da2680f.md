# Pattern: pat-a2fd2da2680f
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T13:40:03.909869+00:00  
**Last seen:** 2026-05-05T13:40:03.909869+00:00

## Summary
Tool error in terminal: {"output": "0.4.0\n---\ndir  codex\ndir  hermes", "exit_code": 0, "error": null}

## Error hashes
- 27924efa31f131a2

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'curl -s https://raw.githubusercontent.com/win4r/llm-wiki-claude-skill/main/VERSION && echo "---" && curl -s https://api.github.com/repos/win4r/llm-wiki-claude-skill/contents/adapters 2>/dev/null | python3 -c "import json,sys; items=json.load(sys.stdin); [print(f\\"{i.get(\'type\'):4} {i.get(\'name\')}\\") for i in items]"', 'timeout': 30}

--- Error Output (last 30 lines) ---
{"output": "0.4.0\n---\ndir  codex\ndir  hermes", "exit_code": 0, "error": null}

```
