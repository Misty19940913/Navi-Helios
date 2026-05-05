# Pattern: pat-db111de64a14
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:58:58.999859+00:00  
**Last seen:** 2026-05-05T09:58:58.999859+00:00

## Summary
Tool error in terminal: {"output": "ERROR: type object 'YouTubeTranscriptApi' has no attribute 'get_transcript'", "exit_code": 0, "error": null}

## Error hashes
- 73c342b15b3bb68c

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'python3 -c "\nfrom youtube_transcript_api import YouTubeTranscriptApi\ntry:\n    transcript = YouTubeTranscriptApi.get_transcript(\'Zy6tS-7xg9M\', languages=[\'en\', \'zh-TW\', \'zh\', \'ja\'])\n    print(\'SUCCESS\')\n    for item in transcript[:5]:\n        print(item)\nexcept Exception as e:\n    print(f\'ERROR: {e}\')\n" 2>&1'}

--- Error Output (last 30 lines) ---
{"output": "ERROR: type object 'YouTubeTranscriptApi' has no attribute 'get_transcript'", "exit_code": 0, "error": null}

```
