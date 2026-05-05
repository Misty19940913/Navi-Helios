# Pattern: pat-d47f21c55e8a
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T15:00:07.511508+00:00  
**Last seen:** 2026-05-05T15:00:07.511508+00:00

## Summary
Tool error in terminal: {"output": "974:    returns content, ``build_context_files_prompt`` should be called with\n1083:def build_context_files_

## Error hashes
- 5120292b06544f9c

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "build_context_files_prompt" /home/misty/.hermes/hermes-agent/agent/prompt_builder.py | head -10'}

--- Error Output (last 30 lines) ---
{"output": "974:    returns content, ``build_context_files_prompt`` should be called with\n1083:def build_context_files_prompt(cwd: Optional[str] = None, skip_soul: bool = False) -> str:", "exit_code": 0, "error": null}

```
