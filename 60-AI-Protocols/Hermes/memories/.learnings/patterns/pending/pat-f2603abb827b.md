# Pattern: pat-f2603abb827b
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T02:51:53.771161+00:00  
**Last seen:** 2026-05-05T02:51:53.771161+00:00

## Summary
Tool error in terminal: {"output": "47:SKILLS_DIR = HERMES_HOME / \"skills\"\n48:HUB_DIR = SKILLS_DIR / \".hub\"\n2734:        install_dir = SKI

## Error hashes
- cfb5f701fa688ae6

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "SKILLS_DIR\\|get_external" ~/.hermes/hermes-agent/tools/skills_hub.py | head -30'}

--- Error Output (last 30 lines) ---
{"output": "47:SKILLS_DIR = HERMES_HOME / \"skills\"\n48:HUB_DIR = SKILLS_DIR / \".hub\"\n2734:        install_dir = SKILLS_DIR / safe_category / safe_skill_name\n2736:        install_dir = SKILLS_DIR / safe_skill_name\n2769:        install_path=str(install_dir.relative_to(SKILLS_DIR)),\n2790:    install_path = SKILLS_DIR / entry[\"install_path\"]", "exit_code": 0, "error": null}

```
