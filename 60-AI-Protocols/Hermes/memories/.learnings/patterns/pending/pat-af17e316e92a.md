# Pattern: pat-af17e316e92a
**Tool:** execute_code  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T09:21:13.772285+00:00  
**Last seen:** 2026-05-03T09:21:13.772285+00:00

## Summary
API error in execute_code: {"status": "success", "output": "{'output': '{\"status_code\":400,\"error\":{\"message\":\"Invalid API v1 key.\",\"code\

## Error hashes
- 8bd567ef49aa7c1c

## Last error
```
Error Type: api_error
Tool Args: {'code': '\nfrom hermes_tools import terminal\n\n# Try uploading to a free image hosting service\nresult = terminal(\'\'\'curl -s -F "image=@/home/misty/.hermes/image_cache/img_f1fdd640f0d7.jpeg" https://api.imgbb.com/1/upload?key=d36eb65965021bc39fb5b89f9cacc0e7 2>&1 | head -50\'\'\')\nprint(result)\n'}

--- Error Output (last 30 lines) ---
{"status": "success", "output": "{'output': '{\"status_code\":400,\"error\":{\"message\":\"Invalid API v1 key.\",\"code\":100},\"status_txt\":\"Bad Request\"}', 'exit_code': 0, 'error': None}\n", "tool_calls_made": 1, "duration_seconds": 2.81}

```
