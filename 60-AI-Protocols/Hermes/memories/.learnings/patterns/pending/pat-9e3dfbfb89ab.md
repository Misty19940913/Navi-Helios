# Pattern: pat-9e3dfbfb89ab
**Tool:** read_file  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T02:22:16.070215+00:00  
**Last seen:** 2026-05-03T02:22:16.070215+00:00

## Summary
Logic error in read_file: {"content": "    20|import argparse\n    21|import json\n    22|import re\n    23|import sys\n    24|\n    25|\n    26|d

## Error hashes
- e64b54f40f21a103

## Last error
```
Error Type: logic_error
Tool Args: {'path': '/home/misty/.hermes/skills/media/youtube-content/scripts/fetch_transcript.py', 'offset': 20}

--- Error Output (last 30 lines) ---
{"content": "    20|import argparse\n    21|import json\n    22|import re\n    23|import sys\n    24|\n    25|\n    26|def extract_video_id(url_or_id: str) -> str:\n    27|    \"\"\"Extract the 11-character video ID from various YouTube URL formats.\"\"\"\n    28|    url_or_id = url_or_id.strip()\n    29|    patterns = [\n    30|        r'(?:v=|youtu\\.be/|shorts/|embed/|live/)([a-zA-Z0-9_-]{11})',\n    31|        r'^([a-zA-Z0-9_-]{11})$',\n    32|    ]\n    33|    for pattern in patterns:\n    34|        match = re.search(pattern, url_or_id)\n    35|        if match:\n    36|            return match.group(1)\n    37|    return url_or_id\n    38|\n    39|\n    40|def format_timestamp(seconds: float) -> str:\n    41|    \"\"\"Convert seconds to HH:MM:SS or MM:SS format.\"\"\"\n    42|    total = int(seconds)\n    
```
