# Pattern: pat-ecd648bb0915
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:38:20.283020+00:00  
**Last seen:** 2026-05-04T17:38:20.283020+00:00

## Summary
Tool error in terminal: {"output": "def get_hermes_home() -> Path:\n    \"\"\"Return the Hermes home directory (default: ~/.hermes).\n\n    Read

## Error hashes
- a94f056b7f044505

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'cat ~/.hermes/hermes-agent/hermes_constants.py | grep -A5 "def get_hermes_home"'}

--- Error Output (last 30 lines) ---
{"output": "def get_hermes_home() -> Path:\n    \"\"\"Return the Hermes home directory (default: ~/.hermes).\n\n    Reads HERMES_HOME env var, falls back to ~/.hermes.\n    This is the single source of truth — all other copies should import this.\n    \"\"\"", "exit_code": 0, "error": null}

```
