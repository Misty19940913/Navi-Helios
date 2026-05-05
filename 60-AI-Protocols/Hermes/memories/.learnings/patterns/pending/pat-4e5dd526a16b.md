# Pattern: pat-4e5dd526a16b
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T13:15:03.007683+00:00  
**Last seen:** 2026-05-03T13:15:03.007683+00:00

## Summary
API error in terminal: {"output": "{\"role\": \"session_meta\", \"tools\": [{\"type\": \"function\", \"function\": {\"name\": \"browser_back\",

## Error hashes
- 6ab8dc95daf76c0a

## Last error
```
Error Type: api_error
Tool Args: {'command': 'cat ~/.hermes/sessions/20260425_114026_a2f8f426.jsonl'}

--- Error Output (last 30 lines) ---
{"output": "{\"role\": \"session_meta\", \"tools\": [{\"type\": \"function\", \"function\": {\"name\": \"browser_back\", \"description\": \"Navigate back to the previous page in browser history. Requires browser_navigate to be called first.\", \"parameters\": {\"type\": \"object\", \"properties\": {}}}}, {\"type\": \"function\", \"function\": {\"name\": \"browser_click\", \"description\": \"Click on an element identified by its ref ID from the snapshot (e.g., '@e5'). The ref IDs are shown in square brackets in the snapshot output. Requires browser_navigate and browser_snapshot to be called first.\", \"parameters\": {\"type\": \"object\", \"properties\": {\"ref\": {\"type\": \"string\", \"description\": \"The element reference from the snapshot (e.g., '@e5', '@e12')\"}}, \"required\": [\"ref\"]}}}, {\"type\": \"function\", \"function\": {\"name\": \
```
