# Pattern: pat-bcb58f8871aa
**Tool:** terminal  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:38:12.839326+00:00  
**Last seen:** 2026-05-04T17:38:12.839326+00:00

## Summary
Logic error in terminal: {"output": "def _find_all_skills(*, skip_disabled: bool = False) -> List[Dict[str, Any]]:\n    \"\"\"Recursively find al

## Error hashes
- 1f304b66179be69a

## Last error
```
Error Type: logic_error
Tool Args: {'command': "sed -n '549,620p' ~/.hermes/hermes-agent/tools/skills_tool.py"}

--- Error Output (last 30 lines) ---
{"output": "def _find_all_skills(*, skip_disabled: bool = False) -> List[Dict[str, Any]]:\n    \"\"\"Recursively find all skills in ~/.hermes/skills/ and external dirs.\n\n    Args:\n        skip_disabled: If True, return ALL skills regardless of disabled\n            state (used by ``hermes skills`` config UI). Default False\n            filters out disabled skills.\n\n    Returns:\n        List of skill metadata dicts (name, description, category).\n    \"\"\"\n    from agent.skill_utils import get_external_skills_dirs, iter_skill_index_files\n\n    skills = []\n    seen_names: set = set()\n\n    # Load disabled set once (not per-skill)\n    disabled = set() if skip_disabled else _get_disabled_skill_names()\n\n    # Scan local dir first, then external dirs (local takes precedence)\n    dirs_to_scan = []\n    if SKILLS_DIR.exists():\n   
```
