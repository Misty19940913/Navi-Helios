# Pattern: pat-b4a2d0186f4a
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:38:09.123844+00:00  
**Last seen:** 2026-05-04T17:38:09.123844+00:00

## Summary
Tool error in terminal: {"output": "549:def _find_all_skills(*, skip_disabled: bool = False) -> List[Dict[str, Any]]:\n702:        all_skills = 

## Error hashes
- 9d38b88584146249

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "_find_all_skills\\|def _find" ~/.hermes/hermes-agent/tools/skills_tool.py | head -10'}

--- Error Output (last 30 lines) ---
{"output": "549:def _find_all_skills(*, skip_disabled: bool = False) -> List[Dict[str, Any]]:\n702:        all_skills = _find_all_skills()\n990:            available = [s[\"name\"] for s in _sort_skills(_find_all_skills())[:20]]", "exit_code": 0, "error": null}

```
