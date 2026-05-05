# Pattern: pat-87f1ec1cbc50
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T02:51:52.507134+00:00  
**Last seen:** 2026-05-05T02:51:52.507134+00:00

## Summary
Tool error in terminal: {"output": "89:SKILLS_DIR = HERMES_HOME / \"skills\"\n453:    # Try the module-level SKILLS_DIR first (respects monkeypa

## Error hashes
- 169daed6df00bc4f

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "SKILLS_DIR\\|get_external_skills" ~/.hermes/hermes-agent/tools/skills_tool.py | head -20'}

--- Error Output (last 30 lines) ---
{"output": "89:SKILLS_DIR = HERMES_HOME / \"skills\"\n453:    # Try the module-level SKILLS_DIR first (respects monkeypatching in tests),\n455:    dirs_to_check = [SKILLS_DIR]\n457:        from agent.skill_utils import get_external_skills_dirs\n458:        dirs_to_check.extend(get_external_skills_dirs())\n560:    from agent.skill_utils import get_external_skills_dirs, iter_skill_index_files\n570:    if SKILLS_DIR.exists():\n571:        dirs_to_scan.append(SKILLS_DIR)\n572:    dirs_to_scan.extend(get_external_skills_dirs())\n689:        if not SKILLS_DIR.exists():\n690:            SKILLS_DIR.mkdir(parents=True, exist_ok=True)\n934:        from agent.skill_utils import get_external_skills_dirs\n938:        if SKILLS_DIR.exists():\n939:            all_dirs.append(SKILLS_DIR)\n940:        all_dirs.extend(get
```
