# Pattern: pat-c322c0b465af
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-07T22:02:04.165870+00:00  
**Last seen:** 2026-05-07T22:02:04.165870+00:00

## Summary
API error in read_file: {"content": "   501|Claude Code's built-in auto-memory system writes learnings to `~/.claude/projects/<project>/memory/M

## Error hashes
- 9dba0fb2c85fdcd0

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/DOCUMENTATION/Hooks/HookSystem.md', 'offset': 501}

--- Error Output (last 30 lines) ---
{"content": "   501|Claude Code's built-in auto-memory system writes learnings to `~/.claude/projects/<project>/memory/MEMORY.md`. The PreCompact hook complements this by preserving work-in-progress state that auto-memory doesn't capture (active task context, ISA state, file lists). Auto-dream (server-controlled) periodically consolidates auto-memory files between sessions.\n   502|\n   503|---\n   504|\n   505|### 11. **PostCompact**\n   506|**When:** After Claude compacts context\n   507|**Status:** Active — `RestoreContext.hook.ts`\n   508|\n   509|**Current Hooks:**\n   510|```json\n   511|{\n   512|  \"PostCompact\": [\n   513|    {\n   514|      \"hooks\": [\n   515|        {\n   516|          \"type\": \"command\",\n   517|          \"command\": \"$HOME/.claude/hooks/RestoreC
```
