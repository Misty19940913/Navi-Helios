# Pattern: pat-e127db802ba9
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:59:09.505466+00:00  
**Last seen:** 2026-05-05T09:59:09.505466+00:00

## Summary
Tool error in terminal: {"output": "['fetch', 'list']", "exit_code": 0, "error": null}

## Error hashes
- ba9d4fea10dfb110

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'python3 -c "\nfrom youtube_transcript_api import YouTubeTranscriptApi\n# Check the correct API\napi = YouTubeTranscriptApi()\nprint([m for m in dir(api) if not m.startswith(\'_\')])\n"'}

--- Error Output (last 30 lines) ---
{"output": "['fetch', 'list']", "exit_code": 0, "error": null}

```
