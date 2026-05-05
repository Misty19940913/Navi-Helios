# Pattern: pat-4ffa87b5e307
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:27:20.107743+00:00  
**Last seen:** 2026-05-05T10:27:20.107743+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: github-auth\n     3|description: Set up GitHub authentication for the agent using 

## Error hashes
- bc33625fb743a511

## Last error
```
Error Type: api_error
Tool Args: {'path': './hermes-backup-20260425-164411/skills/github/github-auth/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: github-auth\n     3|description: Set up GitHub authentication for the agent using git (universally available) or the gh CLI. Covers HTTPS tokens, SSH keys, credential helpers, and gh auth — with a detection flow to pick the right method automatically.\n     4|version: 1.1.0\n     5|author: Hermes Agent\n     6|license: MIT\n     7|required_primitives:\n     8|  - terminal\n     9|  - http\n    10|metadata:\n    11|  hermes:\n    12|    tags: [GitHub, Authentication, Git, gh-cli, SSH, Setup]\n    13|    related_skills: [github-pr-workflow, github-code-review, github-issues, github-repo-management]\n    14|---\n    15|\n    16|# GitHub Authentication Setup\n    17|\n    18|This skill sets up authentication so the agent can work with GitHub repositories, PRs, issues, and CI. It covers two paths:\n    19|
```
