# Pattern: pat-acf8bc4df784
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T09:21:13.631423+00:00  
**Last seen:** 2026-05-03T09:21:13.631423+00:00

## Summary
API error in terminal: {"output": "{\"status_code\":400,\"error\":{\"message\":\"Invalid API v1 key.\",\"code\":100},\"status_txt\":\"Bad Reque

## Error hashes
- 71d40e10e6c4a581

## Last error
```
Error Type: api_error
Tool Args: {'command': 'curl -s -F "image=@/home/misty/.hermes/image_cache/img_f1fdd640f0d7.jpeg" https://api.imgbb.com/1/upload?key=d36eb65965021bc39fb5b89f9cacc0e7 2>&1 | head -50', 'timeout': None, 'workdir': None}

--- Error Output (last 30 lines) ---
{"output": "{\"status_code\":400,\"error\":{\"message\":\"Invalid API v1 key.\",\"code\":100},\"status_txt\":\"Bad Request\"}", "exit_code": 0, "error": null}

```
