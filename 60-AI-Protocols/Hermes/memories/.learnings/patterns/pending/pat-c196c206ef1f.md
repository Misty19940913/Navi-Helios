# Pattern: pat-c196c206ef1f
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T09:34:55.330716+00:00  
**Last seen:** 2026-05-03T09:34:55.330716+00:00

## Summary
API error in terminal: {"output": "181\n---\nsession_cron_4de60db14e20_20260503_173341.json\nsession_20260503_172737_da2019.json\nsessions.json

## Error hashes
- 4e5ad1738889db3e

## Last error
```
Error Type: api_error
Tool Args: {'command': 'ls -t /home/misty/.hermes/sessions/*.jsonl 2>/dev/null | wc -l && echo "---" && ls -t /home/misty/.hermes/sessions/ | head -20'}

--- Error Output (last 30 lines) ---
{"output": "181\n---\nsession_cron_4de60db14e20_20260503_173341.json\nsession_20260503_172737_da2019.json\nsessions.json\n20260503_135633_648274.jsonl\nsession_20260503_135633_648274.json\n20260503_170041_9652f0.jsonl\nsession_20260503_170041_9652f0.json\n20260426_122002_b441294a.jsonl\nsession_cron_4de60db14e20_20260503_170231.json\nsession_20260503_163935_44ff84.json\n20260503_161428_9b5a52.jsonl\nsession_20260503_161428_9b5a52.json\nsession_cron_4de60db14e20_20260503_163044.json\nsession_20260503_162423_9290a4.json\nsession_20260503_161651_540604.json\nsession_cron_4de60db14e20_20260503_155927.json\n20260503_111605_3722fa.jsonl\nsession_20260503_111605_3722fa.json\nsession_cron_4de60db14e20_20260503_152817.json\nsession_20260503_151006_401785.json", "exit_code": 0, "error":
```
