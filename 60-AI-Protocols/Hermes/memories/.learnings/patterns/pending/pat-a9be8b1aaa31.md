# Pattern: pat-a9be8b1aaa31
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:27:14.659168+00:00  
**Last seen:** 2026-05-05T10:27:14.659168+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: claude-code\n     3|description: Delegate coding tasks to Claude Code (Anthropic's

## Error hashes
- dc41dabc91bc64f3

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/hermes-backup-20260425-164411/skills/autonomous-ai-agents/claude-code/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: claude-code\n     3|description: Delegate coding tasks to Claude Code (Anthropic's CLI agent). Use for building features, refactoring, PR reviews, and iterative coding. Requires the claude CLI installed.\n     4|version: 2.2.0\n     5|author: Hermes Agent + Teknium\n     6|license: MIT\n     7|metadata:\n     8|  hermes:\n     9|    tags: [Coding-Agent, Claude, Anthropic, Code-Review, Refactoring, PTY, Automation]\n    10|    related_skills: [codex, hermes-agent, opencode]\n    11|---\n    12|\n    13|# Claude Code — Hermes Orchestration Guide\n    14|\n    15|Delegate coding tasks to [Claude Code](https://code.claude.com/docs/en/cli-reference) (Anthropic's autonomous coding agent CLI) via the Hermes terminal. Claude Code v2.x can read files, write code, run shell commands, spa
```
