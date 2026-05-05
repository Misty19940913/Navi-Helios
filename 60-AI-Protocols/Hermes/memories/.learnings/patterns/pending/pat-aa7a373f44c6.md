# Pattern: pat-aa7a373f44c6
**Tool:** terminal  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T13:40:43.380507+00:00  
**Last seen:** 2026-05-05T13:40:43.380507+00:00

## Summary
Logic error in terminal: {"output": "#!/usr/bin/env python3\n\"\"\"Lint a Karpathy-style llm-wiki directory.\n\nThe checker is intentionally depe

## Error hashes
- 7f3e844a5d5cf7da

## Last error
```
Error Type: logic_error
Tool Args: {'command': 'curl -s https://raw.githubusercontent.com/win4r/llm-wiki-claude-skill/main/adapters/codex/scripts/llm_wiki_lint.py', 'timeout': 30}

--- Error Output (last 30 lines) ---
{"output": "#!/usr/bin/env python3\n\"\"\"Lint a Karpathy-style llm-wiki directory.\n\nThe checker is intentionally dependency-light. If PyYAML is installed it will\nuse it for frontmatter; otherwise it falls back to a small parser that handles\nthe frontmatter shapes used by this skill.\n\"\"\"\n\nfrom __future__ import annotations\n\nimport argparse\nimport json\nimport os\nimport re\nimport sys\nfrom collections import defaultdict\nfrom datetime import date, datetime, timedelta\nfrom pathlib import Path\nfrom typing import Any\n\n\nCONTENT_DIRS = (\"entities\", \"concepts\", \"comparisons\", \"queries\")\nREQUIRED_DIRS = CONTENT_DIRS + (\"log\", \"raw\")\nREQUIRED_ROOT_FILES = (\"SCHEMA.md\", \"index.md\")\nREQUIRED_FIELDS = {\"title\", \"created\", \"updated\", \"type
```
