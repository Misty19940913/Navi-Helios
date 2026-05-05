# Pattern: pat-edcae75fd832
**Tool:** mcp_firecrawl_firecrawl_scrape  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T01:51:53.313201+00:00  
**Last seen:** 2026-05-04T01:51:53.313201+00:00

## Summary
Tool error in mcp_firecrawl_firecrawl_scrape: {"result": "{\n  \"metadata\": {\n    \"scrapeId\": \"019df0af-3dd3-731d-b348-1c661fc3a08e\",\n    \"sourceURL\": \"http

## Error hashes
- 0f67c2ea2a094885

## Last error
```
Error Type: tool_error
Tool Args: {'url': 'https://api.github.com/repos/lifehacker-tw/brand-cis', 'formats': ['json'], 'jsonOptions': {'prompt': 'Extract repository information including status, visibility, description, default branch, and any error messages'}}

--- Error Output (last 30 lines) ---
{"result": "{\n  \"metadata\": {\n    \"scrapeId\": \"019df0af-3dd3-731d-b348-1c661fc3a08e\",\n    \"sourceURL\": \"https://api.github.com/repos/lifehacker-tw/brand-cis\",\n    \"url\": \"https://api.github.com/repos/lifehacker-tw/brand-cis\",\n    \"statusCode\": 404,\n    \"error\": \"Not Found\",\n    \"contentType\": \"application/json; charset=utf-8\",\n    \"timezone\": \"America/New_York\",\n    \"proxyUsed\": \"basic\",\n    \"cacheState\": \"miss\",\n    \"indexId\": \"27b986d6-541e-4682-923f-3f1beac96374\",\n    \"creditsUsed\": 5,\n    \"concurrencyLimited\": false\n  },\n  \"json\": {\n    \"repository\": {\n      \"status\": \"Not Found\",\n      \"visibility\": \"\",\n      \"d
```
