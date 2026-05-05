# Pattern: pat-5d6ed0ca5358
**Tool:** terminal  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T02:52:03.754596+00:00  
**Last seen:** 2026-05-05T02:52:03.754596+00:00

## Summary
Logic error in terminal: {"output": "def get_external_skills_dirs() -> List[Path]:\n    \"\"\"Read ``skills.external_dirs`` from config.yaml and 

## Error hashes
- 1677d2020ef068be

## Last error
```
Error Type: logic_error
Tool Args: {'command': "sed -n '174,220p' ~/.hermes/hermes-agent/agent/skill_utils.py"}

--- Error Output (last 30 lines) ---
{"output": "def get_external_skills_dirs() -> List[Path]:\n    \"\"\"Read ``skills.external_dirs`` from config.yaml and return validated paths.\n\n    Each entry is expanded (``~`` and ``${VAR}``) and resolved to an absolute\n    path.  Only directories that actually exist are returned.  Duplicates and\n    paths that resolve to the local ``~/.hermes/skills/`` are silently skipped.\n    \"\"\"\n    config_path = get_config_path()\n    if not config_path.exists():\n        return []\n    try:\n        parsed = yaml_load(config_path.read_text(encoding=\"utf-8\"))\n    except Exception:\n        return []\n    if not isinstance(parsed, dict):\n        return []\n\n    skills_cfg = parsed.get(\"skills\")\n    if not isinstance(skills_cfg, dict):\n        return []\n\n    raw_dirs = skills_cfg.get(\"external_dirs\")\n    if not raw_dirs:\n    
```
