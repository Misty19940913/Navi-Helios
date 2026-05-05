# Pattern: pat-a8ed74352bd2
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T13:40:59.719179+00:00  
**Last seen:** 2026-05-05T13:40:59.719179+00:00

## Summary
Tool error in terminal: {"output": "#!/usr/bin/env python3\n\"\"\"Generate a deterministic compile plan for oversized/index-drift llm-wikis.\"\"

## Error hashes
- 86759083a035a14e

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'curl -s https://raw.githubusercontent.com/win4r/llm-wiki-claude-skill/main/adapters/codex/scripts/llm_wiki_compile_plan.py', 'timeout': 30}

--- Error Output (last 30 lines) ---
{"output": "#!/usr/bin/env python3\n\"\"\"Generate a deterministic compile plan for oversized/index-drift llm-wikis.\"\"\"\n\nfrom __future__ import annotations\n\nimport argparse\nimport json\nimport os\nimport re\nimport sys\nfrom collections import defaultdict\nfrom pathlib import Path\nfrom typing import Any\n\n\nCONTENT_DIRS = (\"entities\", \"concepts\", \"comparisons\", \"queries\")\nFRONTMATTER_RE = re.compile(r\"^---\\n(.*?)\\n---\\n?\", re.S)\n\n\ndef default_wiki_path() -> Path:\n    raw = os.environ.get(\"LLM_WIKI_PATH\") or os.environ.get(\"WIKI_PATH\")\n    if raw:\n        return Path(raw).expanduser()\n    return Path.home() / \"wiki\" / \"llm-wiki\"\n\n\ndef parse_args() -> argparse.Namespace:\n    parser = argparse.ArgumentParser(description=\"Pla
```
