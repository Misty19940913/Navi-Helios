# Pattern: pat-fb9b955da7be
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:52:20.888840+00:00  
**Last seen:** 2026-05-05T09:52:20.888840+00:00

## Summary
API error in read_file: {"content": "     1|\"\"\"\n     2|Shell-script hooks bridge.\n     3|\n     4|Reads the ``hooks:`` block from ``cli-con

## Error hashes
- a3a63c0926902602

## Last error
```
Error Type: api_error
Tool Args: {'limit': 100, 'path': '/home/misty/.hermes/hermes-agent/agent/shell_hooks.py'}

--- Error Output (last 30 lines) ---
{"content": "     1|\"\"\"\n     2|Shell-script hooks bridge.\n     3|\n     4|Reads the ``hooks:`` block from ``cli-config.yaml``, prompts the user for\n     5|consent on first use of each ``(event, command)`` pair, and registers\n     6|callbacks on the existing plugin hook manager so every existing\n     7|``invoke_hook()`` site dispatches to the configured shell scripts — with\n     8|zero changes to call sites.\n     9|\n    10|Design notes\n    11|------------\n    12|* Python plugins and shell hooks compose naturally: both flow through\n    13|  :func:`hermes_cli.plugins.invoke_hook` and its aggregators.  Python\n    14|  plugins are registered first (via ``discover_and_load()``) so their\n    15|  block decisions win ties over shell-hook blocks.\n    16|* Subprocess execution uses ``shlex.split(os.path.expanduser(command))``\n   
```
