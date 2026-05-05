# Pattern: pat-dd422b87b7b1
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T04:19:57.080771+00:00  
**Last seen:** 2026-05-05T04:19:57.080771+00:00

## Summary
API error in terminal: {"output": "41:    from tools.skills_hub import unified_search\n62:            trust_style = {\"builtin\": \"bright_cyan

## Error hashes
- 07404c205dca45f0

## Last error
```
Error Type: api_error
Tool Args: {'command': 'grep -n "def.*list\\|builtin\\|local\\|hub" ~/.hermes/hermes-agent/hermes_cli/skills_hub.py | grep -v "def do_\\|#" | head -30'}

--- Error Output (last 30 lines) ---
{"output": "41:    from tools.skills_hub import unified_search\n62:            trust_style = {\"builtin\": \"bright_cyan\", \"trusted\": \"green\", \"community\": \"yellow\"}.get(r.trust_level, \"dim\")\n81:def _format_extra_metadata_lines(extra: Dict[str, Any]) -> list[str]:\n168:    URL. Hidden dirs (``.hub``, ``.trash``) are skipped.\n170:    from tools.skills_hub import SKILLS_DIR\n245:    from tools.skills_hub import GitHubAuth, create_source_router, unified_search\n267:        trust_style = {\"builtin\": \"bright_cyan\", \"trusted\": \"green\", \"community\": \"yellow\"}.get(r.trust_level, \"dim\")\n288:    from tools.skills_hub import (\n302:    _TRUST_RANK = {\"builtin\": 3, \"trusted\": 2, \"community\": 1}\n305:        \"github\": 200, \"clawhub\": 500, \"claude-mark
```
