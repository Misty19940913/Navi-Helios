# Pattern: pat-6face479bc4b
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T15:07:12.349542+00:00  
**Last seen:** 2026-05-05T15:07:12.349542+00:00

## Summary
Tool error in terminal: {"output": "=== vault (source) ===\n73 /mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/AGENTS.md\n\

## Error hashes
- df9c0fbbe872faf6

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'echo "=== vault (source) ==="\nwc -l "/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/AGENTS.md"\necho ""\necho "=== hermes-agent/ (destination) ==="\nwc -l /home/misty/.hermes/hermes-agent/AGENTS.md\necho ""\necho "=== diff ==="\ndiff "/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/AGENTS.md" /home/misty/.hermes/hermes-agent/AGENTS.md && echo "完全一致"'}

--- Error Output (last 30 lines) ---
{"output": "=== vault (source) ===\n73 /mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/AGENTS.md\n\n=== hermes-agent/ (destination) ===\n73 /home/misty/.hermes/hermes-agent/AGENTS.md\n\n=== diff ===\n完全一致", "exit_code": 0, "error": null}

```
