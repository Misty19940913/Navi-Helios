# Pattern: pat-10ae46eadc5b
**Tool:** terminal  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T02:52:19.797641+00:00  
**Last seen:** 2026-05-05T02:52:19.797641+00:00

## Summary
Logic error in terminal: {"output": "filters out disabled skills.\n\n    Returns:\n        List of skill metadata dicts (name, description, categ

## Error hashes
- 8b674d8cb4a95b33

## Last error
```
Error Type: logic_error
Tool Args: {'command': "sed -n '555,670p' ~/.hermes/hermes-agent/tools/skills_tool.py"}

--- Error Output (last 30 lines) ---
{"output": "filters out disabled skills.\n\n    Returns:\n        List of skill metadata dicts (name, description, category).\n    \"\"\"\n    from agent.skill_utils import get_external_skills_dirs, iter_skill_index_files\n\n    skills = []\n    seen_names: set = set()\n\n    # Load disabled set once (not per-skill)\n    disabled = set() if skip_disabled else _get_disabled_skill_names()\n\n    # Scan local dir first, then external dirs (local takes precedence)\n    dirs_to_scan = []\n    if SKILLS_DIR.exists():\n        dirs_to_scan.append(SKILLS_DIR)\n    dirs_to_scan.extend(get_external_skills_dirs())\n\n    for scan_dir in dirs_to_scan:\n        for skill_md in iter_skill_index_files(scan_dir, \"SKILL.md\"):\n            if any(part in _EXCLUDED_SKILL_DIRS for part in skill_md.parts):\n                continue\n\n            skill_dir 
```
