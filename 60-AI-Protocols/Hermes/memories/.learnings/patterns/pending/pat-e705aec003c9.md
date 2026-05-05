# Pattern: pat-e705aec003c9
**Tool:** search_files  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:52:07.221152+00:00  
**Last seen:** 2026-05-05T09:52:07.221152+00:00

## Summary
Logic error in search_files: {"total_count": 214, "matches": [{"path": "/home/misty/.hermes/hermes-agent/gateway/run.py", "line": 2444, "content": " 

## Error hashes
- 268797c9b14c3258

## Last error
```
Error Type: logic_error
Tool Args: {'context': 5, 'limit': 20, 'output_mode': 'content', 'path': '/home/misty/.hermes/hermes-agent', 'pattern': 'shell-hooks|shell_hook|shell_hook', 'target': 'content'}

--- Error Output (last 30 lines) ---
{"total_count": 214, "matches": [{"path": "/home/misty/.hermes/hermes-agent/gateway/run.py", "line": 2444, "content": "        # registration already honored --accept-hooks, and re-reading"}, {"path": "/home/misty/.hermes/hermes-agent/gateway/run.py", "line": 2445, "content": "        # hooks_auto_accept here would just duplicate that lookup."}, {"path": "/home/misty/.hermes/hermes-agent/gateway/run.py", "line": 2446, "content": "        # Failures are logged but must never block gateway startup."}, {"path": "/home/misty/.hermes/hermes-agent/gateway/run.py", "line": 2447, "content": "        try:"}, {"path": "/home/misty/.hermes/hermes-agent/gateway/run.py", "line": 2448, "content": "            from hermes_cli.config import load_config"}, {"path": "
```
