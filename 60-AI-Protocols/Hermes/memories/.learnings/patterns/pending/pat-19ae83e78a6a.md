# Pattern: pat-19ae83e78a6a
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:58:19.881875+00:00  
**Last seen:** 2026-05-05T09:58:19.881875+00:00

## Summary
Tool error in terminal: {"output": "fetch_transcript.py\n{\"error\": \"Transcripts are disabled for this video.\"}", "exit_code": 0, "error": nu

## Error hashes
- 44bdfb8ba5d2abe2

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'ls /home/misty/.hermes/skills/media/youtube-content/scripts/ 2>/dev/null && python3 /home/misty/.hermes/skills/media/youtube-content/scripts/fetch_transcript.py "https://youtube.com/watch?v=Zy6tS-7xg9M" --text-only 2>&1 | head -100'}

--- Error Output (last 30 lines) ---
{"output": "fetch_transcript.py\n{\"error\": \"Transcripts are disabled for this video.\"}", "exit_code": 0, "error": null}

```
