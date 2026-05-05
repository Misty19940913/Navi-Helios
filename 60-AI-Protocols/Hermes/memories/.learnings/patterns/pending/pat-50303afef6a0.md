# Pattern: pat-50303afef6a0
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T00:33:19.679605+00:00  
**Last seen:** 2026-05-04T00:33:19.679605+00:00

## Summary
API error in terminal: {"output": "183\n-rw-r--r-- 1 misty misty 431803 Apr 25 18:34 /home/misty/.hermes/sessions/20260425_114026_a2f8f426.json

## Error hashes
- 73a8ef5edc5a7ef0

## Last error
```
Error Type: api_error
Tool Args: {'command': 'ls ~/.hermes/sessions/*.jsonl 2>/dev/null | wc -l && ls -lt ~/.hermes/sessions/*.jsonl 2>/dev/null | tail -5'}

--- Error Output (last 30 lines) ---
{"output": "183\n-rw-r--r-- 1 misty misty 431803 Apr 25 18:34 /home/misty/.hermes/sessions/20260425_114026_a2f8f426.jsonl\n-rw-r--r-- 1 misty misty  52541 Apr 25 13:09 /home/misty/.hermes/sessions/20260425_130813_135c4d79.jsonl\n-rw-r--r-- 1 misty misty  44780 Apr 25 11:53 /home/misty/.hermes/sessions/20260425_115253_8fef02ef.jsonl\n-rw-r--r-- 1 misty misty  44210 Apr 25 11:51 /home/misty/.hermes/sessions/20260425_115107_52f434fd.jsonl\n-rw-r--r-- 1 misty misty  42822 Apr 25 11:50 /home/misty/.hermes/sessions/20260425_115026_00ee23bd.jsonl", "exit_code": 0, "error": null}

```
