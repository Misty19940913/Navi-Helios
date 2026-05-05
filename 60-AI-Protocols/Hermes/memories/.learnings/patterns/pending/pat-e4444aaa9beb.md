# Pattern: pat-e4444aaa9beb
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:27:29.651851+00:00  
**Last seen:** 2026-05-05T10:27:29.651851+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: github-code-review\n     3|description: Review code changes by analyzing git diffs

## Error hashes
- 2b80ad1341a77658

## Last error
```
Error Type: api_error
Tool Args: {'path': './hermes-backup-20260425-164411/skills/github/github-code-review/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: github-code-review\n     3|description: Review code changes by analyzing git diffs, leaving inline comments on PRs, and performing thorough pre-push review. Works with gh CLI or falls back to git + GitHub REST API via curl.\n     4|version: 1.1.0\n     5|author: Hermes Agent\n     6|license: MIT\n     7|metadata:\n     8|  hermes:\n     9|    tags: [GitHub, Code-Review, Pull-Requests, Git, Quality]\n    10|    related_skills: [github-auth, github-pr-workflow]\n    11|---\n    12|\n    13|# GitHub Code Review\n    14|\n    15|Perform code reviews on local changes before pushing, or review open PRs on GitHub. Most of this skill uses plain `git` — the `gh`/`curl` split only matters for PR-level interactions.\n    16|\n    17|## Prerequisites\n    18|\n    19|- Authenticated with GitHub (see `githu
```
