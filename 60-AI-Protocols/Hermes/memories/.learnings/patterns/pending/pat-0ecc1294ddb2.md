# Pattern: pat-0ecc1294ddb2
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T04:20:02.219751+00:00  
**Last seen:** 2026-05-05T04:20:02.219751+00:00

## Summary
Tool error in terminal: {"output": "\"\"\"List installed skills, distinguishing hub, builtin, and local skills.\n\n    Args:\n        source_fil

## Error hashes
- ef346bbe2fae0f5f

## Last error
```
Error Type: tool_error
Tool Args: {'command': "sed -n '764,900p' ~/.hermes/hermes-agent/hermes_cli/skills_hub.py"}

--- Error Output (last 30 lines) ---
{"output": "\"\"\"List installed skills, distinguishing hub, builtin, and local skills.\n\n    Args:\n        source_filter: ``all`` | ``hub`` | ``builtin`` | ``local``.\n        enabled_only: If True, hide disabled skills from the output.\n\n    Enabled/disabled state is resolved against the currently active profile's\n    config — ``hermes -p <profile> skills list`` reads that profile's\n    ``skills.disabled`` list because ``-p`` swaps ``HERMES_HOME`` at process\n    start.  No explicit profile flag needed here.\n    \"\"\"\n    from tools.skills_hub import HubLockFile, ensure_hub_dirs\n    from tools.skills_sync import _read_manifest\n    from tools.skills_tool import _find_all_skills\n    from agent.skill_utils import get_disabled_skill_names\n\n    c = console or _console\n    ensure_hub_dirs()\n    lock = HubLockFile()\n    hub_
```
