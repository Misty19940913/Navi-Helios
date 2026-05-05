# Pattern: pat-c1223cb22aa4
**Tool:** skill_view  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:07:05.664142+00:00  
**Last seen:** 2026-05-05T10:07:05.664142+00:00

## Summary
Tool error in skill_view: {"success": true, "name": "youtube-content", "description": "YouTube transcripts to summaries, threads, blogs.", "tags":

## Error hashes
- c22c08f9186b39d9

## Last error
```
Error Type: tool_error
Tool Args: {'name': 'youtube-content'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "youtube-content", "description": "YouTube transcripts to summaries, threads, blogs.", "tags": [], "related_skills": [], "content": "---\nname: youtube-content\ndescription: \"YouTube transcripts to summaries, threads, blogs.\"\ntrigger: \"*.youtube.com/watch*, *youtu.be/*, *youtube.com/shorts/*, *youtube.com/live/*\"\nrequired_primitives:\n  - terminal\n  - read_file\n  - write_file\n---\n\n# YouTube Content Tool\n\n## When to use\n\nUse when the user shares a YouTube URL or video link, asks to summarize a video, requests a transcript, or wants to extract and reformat content from any YouTube video. Transforms transcripts into structured content (chapters, summaries, threads, blog posts).\n\nExtract transcripts from YouTube videos and convert them into useful formats.\n\n## Setup\n\n```bash\n# WRONG for this environment — do not use plain `pip install`\n# pip i
```
