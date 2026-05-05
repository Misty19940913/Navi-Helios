# Pattern: pat-999cc0da5b29
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:50:24.970580+00:00  
**Last seen:** 2026-05-05T09:50:24.970580+00:00

## Summary
API error in read_file: {"content": "   360|\n   361|### Memory Files (CLAUDE.md) Hierarchy\n   362|1. **Global:** `~/.claude/CLAUDE.md` — appli

## Error hashes
- 1cc75d52721e696e

## Last error
```
Error Type: api_error
Tool Args: {'limit': 100, 'offset': 360, 'path': '/home/misty/.hermes/skills/autonomous-ai-agents/claude-code/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "   360|\n   361|### Memory Files (CLAUDE.md) Hierarchy\n   362|1. **Global:** `~/.claude/CLAUDE.md` — applies to all projects\n   363|2. **Project:** `./CLAUDE.md` — project-specific context (git-tracked)\n   364|3. **Local:** `.claude/CLAUDE.local.md` — personal project overrides (gitignored)\n   365|\n   366|Use the `#` prefix in interactive mode to quickly add to memory: `# Always use 2-space indentation`.\n   367|\n   368|## Interactive Session: Slash Commands\n   369|\n   370|### Session & Context\n   371|| Command | Purpose |\n   372||---------|---------|\n   373|| `/help` | Show all commands (including custom and MCP commands) |\n   374|| `/compact [focus]` | Compress context to save tokens; CLAUDE.md survives compaction. E.g., `/compact focus on auth logic` |\n   375|| `/clear` | Wipe co
```
