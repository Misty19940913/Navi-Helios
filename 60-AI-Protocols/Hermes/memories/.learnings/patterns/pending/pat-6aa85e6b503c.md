# Pattern: pat-6aa85e6b503c
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:40:18.138433+00:00  
**Last seen:** 2026-05-04T17:40:18.138433+00:00

## Summary
API error in terminal: {"output": "skills.external_dirs: []\nall skills keys: ['external_dirs', 'template_vars', 'inline_shell', 'inline_shell_

## Error hashes
- 297a6910e3922d6c

## Last error
```
Error Type: api_error
Tool Args: {'command': 'python3 -c "\nimport sys, yaml\nsys.path.insert(0, \'/home/misty/.hermes/hermes-agent\')\nfrom hermes_cli.config import load_config\nconfig = load_config()\nprint(\'skills.external_dirs:\', config.get(\'skills\', {}).get(\'external_dirs\', \'NOT SET\'))\nprint(\'all skills keys:\', list(config.get(\'skills\', {}).keys()))\n" 2>&1'}

--- Error Output (last 30 lines) ---
{"output": "skills.external_dirs: []\nall skills keys: ['external_dirs', 'template_vars', 'inline_shell', 'inline_shell_timeout', 'guard_agent_created', 'creation_nudge_interval']", "exit_code": 0, "error": null}

```
