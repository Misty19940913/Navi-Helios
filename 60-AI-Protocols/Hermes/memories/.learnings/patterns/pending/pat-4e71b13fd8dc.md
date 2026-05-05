# Pattern: pat-4e71b13fd8dc
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T02:22:28.037091+00:00  
**Last seen:** 2026-05-03T02:22:28.037091+00:00

## Summary
Tool error in terminal: {"output": "Name: youtube-transcript-api\nVersion: 1.2.4\nSummary: This is a python API which allows you to get the tran

## Error hashes
- bf4ef5d7e3872c6c

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'pip3 show youtube-transcript-api 2>&1 | head -3; which pip3; python3 -c "import sys; print(sys.path)" 2>&1'}

--- Error Output (last 30 lines) ---
{"output": "Name: youtube-transcript-api\nVersion: 1.2.4\nSummary: This is a python API which allows you to get the transcripts/subtitles for a given YouTube video. It also works for automatically generated subtitles, supports translating subtitles and it does not require a headless browser, like other selenium based solutions do!\n/usr/bin/pip3\n['', '/home/misty/.local/share/uv/python/cpython-3.11.15-linux-x86_64-gnu/lib/python311.zip', '/home/misty/.local/share/uv/python/cpython-3.11.15-linux-x86_64-gnu/lib/python3.11', '/home/misty/.local/share/uv/python/cpython-3.11-linux-x86_64-gnu/lib/python3.11/lib-dynload', '/home/misty/.hermes/hermes-agent/venv/lib/python3.11/site-packages', '__editable__.hermes_agent-0.11.0.finder.__path_hook__']", "exit_code": 0, "error": null}

```
