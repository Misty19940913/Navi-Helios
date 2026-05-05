# Pattern: pat-798e1dcf13e7
**Tool:** skill_manage  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T15:13:57.427155+00:00  
**Last seen:** 2026-05-05T15:13:57.427155+00:00

## Summary
Tool error in skill_manage: {"success": false, "error": "Skill 'research/llm-wiki' not found."}

## Error hashes
- 60c73ed851251a2d

## Last error
```
Error Type: tool_error
Tool Args: {'action': 'patch', 'name': 'research/llm-wiki', 'old_string': '## Resuming an Existing Wiki (CRITICAL — do this every session)\n\nWhen the user has an existing wiki, **always orient yourself before doing anything**:\n\n① **Read `SCHEMA.md`** — understand the domain, conventions, and tag taxonomy.\n② **Read `index.md`** — learn what pages exist and their summaries.\n③ **Scan recent `log.md`** — read the last 20-30 entries to understand recent activity.\n\n```bash\nWIKI="${WIKI_PATH:-$HOME/wiki}"\n# Orientation reads at session start\nread_file "$WIKI/SCHEMA.md"\nread_file "$WIKI/index.md"\nread_file "$WIKI/log.md" offset=<last 30 lines>\n```\n\nOnly after orientation should you ingest, query, or lint. This prevents:\n- Creating duplicate pages for entities that already exist\n- Missing cross-references to existing content\n- Contradicting the schema\'s conventions\n- Repeating work already logged\n\nFor large wikis (100+ pages), also run a quick `searc
```
