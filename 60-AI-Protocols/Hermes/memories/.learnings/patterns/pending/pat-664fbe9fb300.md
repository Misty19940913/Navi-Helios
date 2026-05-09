# Pattern: pat-664fbe9fb300
**Tool:** patch  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-09T04:16:58.349727+00:00  
**Last seen:** 2026-05-09T04:16:58.349727+00:00

## Summary
Tool error in patch: {"success": true, "diff": "--- a//home/misty/.hermes/skills/github/github-repo-management/SKILL.md\n+++ b//home/misty/.h

## Error hashes
- c54fa268e7af9212

## Last error
```
Error Type: tool_error
Tool Args: {'mode': 'replace', 'new_string': "### Common Pitfalls\n\n- ❌ **`git filter-branch` on dirty tree** — always `git add -A && git commit` first\n- ❌ **Assuming .gitignore removes files already tracked** — must rewrite history\n- ❌ **`git push` without `--force`** after rewriting history — old refs still exist remotely\n- ❌ **Large file in committed history** — push fails after slow upload; 100MB is the hard ceiling\n- ❌ **Creating a repo that already exists** — `gh repo create` fails if name is taken; use `--confirm` or check first with `gh repo list`\n- ❌ **Fork without adding upstream** — fork stops syncing with original; always add `git remote add upstream`\n- ❌ **Using wrong auth token** — `gh auth status` shows who you're authenticated as; wrong account = 403 on private repos\n- ❌ **Force-push to shared branches without coordination** — rewrites history for everyone; announce in advance\n\n---\n\n## Verification\n\nAfter any operation, confirm succe
```
