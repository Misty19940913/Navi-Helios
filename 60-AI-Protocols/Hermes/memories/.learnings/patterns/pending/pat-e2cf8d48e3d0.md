# Pattern: pat-e2cf8d48e3d0
**Tool:** terminal  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:59:04.652771+00:00  
**Last seen:** 2026-05-05T09:59:04.652771+00:00

## Summary
Logic error in terminal: {"output": "['AgeRestricted', 'CookieError', 'CookieInvalid', 'CookiePathInvalid', 'CouldNotRetrieveTranscript', 'Failed

## Error hashes
- 138db87b12a84c28

## Last error
```
Error Type: logic_error
Tool Args: {'command': 'python3 -c "\nimport youtube_transcript_api\nprint(dir(youtube_transcript_api))\nprint(\'---\')\nimport youtube_transcript_api._errors as e\nprint(dir(e))\n"'}

--- Error Output (last 30 lines) ---
{"output": "['AgeRestricted', 'CookieError', 'CookieInvalid', 'CookiePathInvalid', 'CouldNotRetrieveTranscript', 'FailedToCreateConsentCookie', 'FetchedTranscript', 'FetchedTranscriptSnippet', 'InvalidVideoId', 'IpBlocked', 'NoTranscriptFound', 'NotTranslatable', 'PoTokenRequired', 'RequestBlocked', 'Transcript', 'TranscriptList', 'TranscriptsDisabled', 'TranslationLanguageNotAvailable', 'VideoUnavailable', 'VideoUnplayable', 'YouTubeDataUnparsable', 'YouTubeRequestFailed', 'YouTubeTranscriptApi', 'YouTubeTranscriptApiException', '__all__', '__builtins__', '__cached__', '__doc__', '__file__', '__loader__', '__name__', '__package__', '__path__', '__spec__', '_api', '_errors', '_settings', '_transcripts', 'proxies']\n---\n['AgeRestricted', 'Cooki
```
