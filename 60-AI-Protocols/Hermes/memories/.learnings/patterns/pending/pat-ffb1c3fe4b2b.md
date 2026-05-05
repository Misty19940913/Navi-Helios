# Pattern: pat-ffb1c3fe4b2b
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T14:30:45.038736+00:00  
**Last seen:** 2026-05-05T14:30:45.038736+00:00

## Summary
Tool error in terminal: {"output": "2:name: llm-wiki\n3:description: \"Karpathy's LLM Wiki: build/query interlinked markdown KB.\"\n38:**Locatio

## Error hashes
- 1a851fb030a9f4f1

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "WIKI_PATH\\|wiki_path\\|description\\|name:" ~/.hermes/skills/research/llm-wiki/SKILL.md 2>/dev/null | head -20'}

--- Error Output (last 30 lines) ---
{"output": "2:name: llm-wiki\n3:description: \"Karpathy's LLM Wiki: build/query interlinked markdown KB.\"\n38:**Location:** Set via `WIKI_PATH` environment variable (e.g. in `~/.hermes/.env`).\n43:WIKI=\"${WIKI_PATH:-$HOME/wiki}\"\n81:WIKI=\"${WIKI_PATH:-$HOME/wiki}\"\n101:1. Determine the wiki path (from `$WIKI_PATH` env var, or ask the user; default `~/wiki`)\n327:wiki = \"<WIKI_PATH>\"", "exit_code": 0, "error": null}

```
