---
name: youtube-content
description: "YouTube transcripts to summaries, threads, blogs."
trigger: "*.youtube.com/watch*, *youtu.be/*, *youtube.com/shorts/*, *youtube.com/live/*"
required_primitives:
  - terminal
  - read_file
  - write_file
---

# YouTube Content Tool

## When to use

Use when the user shares a YouTube URL or video link, asks to summarize a video, requests a transcript, or wants to extract and reformat content from any YouTube video. Transforms transcripts into structured content (chapters, summaries, threads, blog posts).

Extract transcripts from YouTube videos and convert them into useful formats.

## Setup

```bash
# WRONG for this environment — do not use plain `pip install`
# pip install youtube-transcript-api

# CORRECT for Hermes venv (/.hermes/hermes-agent/venv/):
# The venv python3 IS the default `python3` in PATH, but venv has no working pip module.
# Use system pip3 with --target to install into the venv:
pip3 install youtube-transcript-api -q --target ~/.hermes/hermes-agent/venv/lib/python3.11/site-packages/

# Verify it landed:
python3 -c "from youtube_transcript_api import YouTubeTranscriptApi; print('ok')"
```

## API Usage (Python direct)

```python
# CORRECT API for current youtube-transcript-api version:
from youtube_transcript_api import YouTubeTranscriptApi

api = YouTubeTranscriptApi()
result = api.fetch('VIDEO_ID')          # returns transcript list
# OR
transcript = api.list('VIDEO_ID')       # returns available languages

# Catch specific errors:
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound
```

## Fallback: Page Scrape (when transcripts disabled)

When transcript API returns `TranscriptsDisabled`, fall back to scraping the video page directly.
This also works for videos where captions exist but are not retrievable via API.

```bash
# Get video title + description with timestamps:
curl -s --compressed -A "Mozilla/5.0" -o /tmp/yt_page.html \
  "https://www.youtube.com/watch?v=VIDEO_ID"

# Extract title:
python3 -c "
import re
html = open('/tmp/yt_page.html').read()
m = re.search(r'\"shortDescription\":\"((?:[^\"\\\\]|\\\\.)*)\"', html)
if m:
    desc = m.group(1).encode().decode('unicode_escape')
    print(desc)
"

# Extract tags:
curl -s --compressed -A "Mozilla/5.0" "https://www.youtube.com/watch?v=VIDEO_ID" | \
  grep -oP '(?<=\"keywords\":\[)[^\]]+' | tr ',' '\n'
```

**What you get from page scrape:**
- Full video description (may include chapter markers with timestamps)
- Video title
- Tags
- uploader info

## Error Handling

- **"externally managed environment" pip error**: System pip refuses to install into the Python environment. Use `--target` to install into the venv site-packages directly. See Setup above.
- **TranscriptsDisabled**: Fall back to page scrape method above. Many Chinese-language videos have captions disabled but description with embedded chapter timestamps.
- **Transcript disabled**: tell the user; suggest they check if subtitles are available on the video page.
- **Private/unavailable video**: relay the error and ask the user to verify the URL.
- **No matching language**: retry without `--language` to fetch any available transcript, then note the actual language to the user.
- **ModuleNotFoundError after install**: Run `which python3` and `python3 -c "import sys; print(sys.path)"` to confirm which Python interpreter the script is using, then install to that interpreter's site-packages.
- **API changed (NoAttributeError: 'get_transcript')**: The installed version uses `.fetch()` not `.get_transcript()`. Update the helper script accordingly.

## Helper Script

`SKILL_DIR` is the directory containing this SKILL.md file. The script accepts any standard YouTube URL format, short links (youtu.be), shorts, embeds, live links, or a raw 11-character video ID.

```bash
# JSON output with metadata
python3 SKILL_DIR/scripts/fetch_transcript.py "https://youtube.com/watch?v=VIDEO_ID"

# Plain text (good for piping into further processing)
python3 SKILL_DIR/scripts/fetch_transcript.py "URL" --text-only

# With timestamps
python3 SKILL_DIR/scripts/fetch_transcript.py "URL" --timestamps

# Specific language with fallback chain
python3 SKILL_DIR/scripts/fetch_transcript.py "URL" --language tr,en
```

## Output Formats

After fetching the transcript, format it based on what the user asks for:

- **Chapters**: Group by topic shifts, output timestamped chapter list
- **Summary**: Concise 5-10 sentence overview of the entire video
- **Chapter summaries**: Chapters with a short paragraph summary for each
- **Thread**: Twitter/X thread format — numbered posts, each under 280 chars
- **Blog post**: Full article with title, sections, and key takeaways
- **Quotes**: Notable quotes with timestamps

### Example — Chapters Output

```
00:00 Introduction — host opens with the problem statement
03:45 Background — prior work and why existing solutions fall short
12:20 Core method — walkthrough of the proposed approach
24:10 Results — benchmark comparisons and key takeaways
31:55 Q&A — audience questions on scalability and next steps
```

## Workflow

1. **Fetch** the transcript using the helper script with `--text-only --timestamps`.
2. **Validate**: confirm the output is non-empty and in the expected language. If empty, retry without `--language` to get any available transcript. If still empty, tell the user the video likely has transcripts disabled.
3. **Chunk if needed**: if the transcript exceeds ~50K characters, split into overlapping chunks (~40K with 2K overlap) and summarize each chunk before merging.
4. **Transform** into the requested output format. If the user did not specify a format, default to a summary.
5. **Verify**: re-read the transformed output to check for coherence, correct timestamps, and completeness before presenting.

## Error Handling

- **"externally managed environment" pip error**: System pip refuses to install into the Python environment. Use `--target` to install into the venv site-packages directly. See Setup above.
- **Transcript disabled**: tell the user; suggest they check if subtitles are available on the video page.
- **Private/unavailable video**: relay the error and ask the user to verify the URL.
- **No matching language**: retry without `--language` to fetch any available transcript, then note the actual language to the user.
- **Module not found after install**: If the transcript script reports `ModuleNotFoundError: No module named 'youtube_transcript_api'` even after install, the package may have landed in the wrong Python environment. Run `which python3` and `python3 -c "import sys; print(sys.path)"` to confirm which Python interpreter the script is using, then install to that interpreter's site-packages.
