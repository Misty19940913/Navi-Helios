# Pattern: pat-d4f6d1d8e688
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T10:08:07.628656+00:00  
**Last seen:** 2026-05-03T10:08:07.628656+00:00

## Summary
API error in read_file: {"error": "Read produced 100,931 characters which exceeds the safety limit (100,000 chars). Use offset and limit to read

## Error hashes
- 50e978a4088bc6a2

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/sessions/20260503_101040_1be88452.jsonl', 'limit': 300}

--- Error Output (last 30 lines) ---
{"error": "Read produced 100,931 characters which exceeds the safety limit (100,000 chars). Use offset and limit to read a smaller range. The file has 65 lines total.", "path": "/home/misty/.hermes/sessions/20260503_101040_1be88452.jsonl", "total_lines": 65, "file_size": 404587}

```
