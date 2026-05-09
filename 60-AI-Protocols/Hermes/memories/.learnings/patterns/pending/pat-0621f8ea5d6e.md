# Pattern: pat-0621f8ea5d6e
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T02:00:25.700836+00:00  
**Last seen:** 2026-05-08T02:00:25.700836+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: CreateSkill\n     3|description: \"Complete PAI skill development lifecycle across

## Error hashes
- 0aecc12bcd3ecb9b

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/skills/CreateSkill/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: CreateSkill\n     3|description: \"Complete PAI skill development lifecycle across two tracks. Structure track: scaffold new skills (TitleCase dirs, flat 2-level max, Workflows/ + Tools/ + References/ only), validate against canonical format, canonicalize existing skills. Effectiveness track (Anthropic methodology): TestSkill spawns with-skill vs baseline agents in parallel and compares outputs, ImproveSkill diagnoses root causes and rewrites instructions with reasoning over rigid constraints, OptimizeDescription generates 20 should/shouldn't-trigger test queries and rewrites for accuracy. Guides from Thariq Shihipar (Mar 2026): Gotchas section mandatory, BPE check before finalizing, progressive disclosure (frontmatter → SKILL.md body → reference files), on-demand hooks
```
