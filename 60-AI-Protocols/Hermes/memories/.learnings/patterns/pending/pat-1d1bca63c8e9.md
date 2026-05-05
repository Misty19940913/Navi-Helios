# Pattern: pat-1d1bca63c8e9
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:38:01.052345+00:00  
**Last seen:** 2026-05-04T17:38:01.052345+00:00

## Summary
Tool error in terminal: {"output": "72:from hermes_constants import get_hermes_home, display_hermes_home\n88:HERMES_HOME = get_hermes_home()\n11

## Error hashes
- aa343dae763de683

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "bundled_skills\\|bundled_manifest\\|HERMES_AGENT\\|get_hermes_home" ~/.hermes/hermes-agent/tools/skills_tool.py | head -20'}

--- Error Output (last 30 lines) ---
{"output": "72:from hermes_constants import get_hermes_home, display_hermes_home\n88:HERMES_HOME = get_hermes_home()\n112:    env_path = get_hermes_home() / \".env\"", "exit_code": 0, "error": null}

```
