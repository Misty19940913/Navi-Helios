# Pattern: pat-c851c167c7ce
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:27:30.154086+00:00  
**Last seen:** 2026-05-05T10:27:30.154086+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: github-repo-management\n     3|description: Clone, create, fork, configure, and ma

## Error hashes
- 87e401d7de48e603

## Last error
```
Error Type: api_error
Tool Args: {'path': './hermes-backup-20260425-164411/skills/github/github-repo-management/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: github-repo-management\n     3|description: Clone, create, fork, configure, and manage GitHub repositories. Manage remotes, secrets, releases, and workflows. Works with gh CLI or falls back to git + GitHub REST API via curl.\n     4|version: 1.1.0\n     5|author: Hermes Agent\n     6|license: MIT\n     7|metadata:\n     8|  hermes:\n     9|    tags: [GitHub, Repositories, Git, Releases, Secrets, Configuration]\n    10|    related_skills: [github-auth, github-pr-workflow, github-issues]\n    11|---\n    12|\n    13|# GitHub Repository Management\n    14|\n    15|Create, clone, fork, configure, and manage GitHub repositories. Each section shows `gh` first, then the `git` + `curl` fallback.\n    16|\n    17|## Prerequisites\n    18|\n    19|- Authenticated with GitHub (see `github-auth` skill)
```
