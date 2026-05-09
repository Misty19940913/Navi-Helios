# Pattern: pat-10fb57b71f8d
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-07T22:02:13.950254+00:00  
**Last seen:** 2026-05-07T22:02:13.950254+00:00

## Summary
API error in read_file: {"content": "     1|// isa-utils.ts -- Shared ISA functions for hooks\n     2|//\n     3|// Used by: ISASync.hook.ts (Po

## Error hashes
- 6597e45631c7d20f

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/hooks/lib/isa-utils.ts'}

--- Error Output (last 30 lines) ---
{"content": "     1|// isa-utils.ts -- Shared ISA functions for hooks\n     2|//\n     3|// Used by: ISASync.hook.ts (PostToolUse), and any other hook that reads or\n     4|// writes the per-session Ideal State Artifact.\n     5|//\n     6|// Functions:\n     7|//   findArtifactPath(slug)   -- prefer ISA.md, fall back to legacy PRD.md\n     8|//   findLatestISA()          -- scan MEMORY/WORK/[slug]/ISA.md (or legacy PRD.md) by mtime\n     9|//   parseFrontmatter()       -- extract YAML frontmatter to object\n    10|//   writeFrontmatterField()  -- update single field in existing frontmatter\n    11|//   countCriteria()          -- count checked/unchecked in Criteria section\n    12|//   syncToWorkJson()         -- upsert session into work.json from frontmatter\n    13|//\n    14|// Naming history: pre-v4.1.0 the
```
