# Pattern: pat-796fd5dab6c1
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:59:16.878281+00:00  
**Last seen:** 2026-05-05T09:59:16.878281+00:00

## Summary
Tool error in terminal: {"output": "ERROR type: TranscriptsDisabled\nERROR: \nCould not retrieve a transcript for the video https://www.youtube.

## Error hashes
- 000170652d66ef9e

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'python3 -c "\nfrom youtube_transcript_api import YouTubeTranscriptApi\ntry:\n    result = YouTubeTranscriptApi().fetch(\'Zy6tS-7xg9M\')\n    print(type(result))\n    print(result[:200] if isinstance(result, str) else result)\nexcept Exception as e:\n    print(f\'ERROR type: {type(e).__name__}\')\n    print(f\'ERROR: {e}\')\n" 2>&1'}

--- Error Output (last 30 lines) ---
{"output": "ERROR type: TranscriptsDisabled\nERROR: \nCould not retrieve a transcript for the video https://www.youtube.com/watch?v=Zy6tS-7xg9M! This is most likely caused by:\n\nSubtitles are disabled for this video\n\nIf you are sure that the described cause is not responsible for this error and that a transcript should be retrievable, please create an issue at https://github.com/jdepoix/youtube-transcript-api/issues. Please add which version of youtube_transcript_api you are using and provide the information needed to replicate the error. Also make sure that there are no
```
