# Pattern: pat-2051dca83f1f
**Tool:** skill_manage  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-07T19:20:16.752373+00:00  
**Last seen:** 2026-05-07T19:20:16.752373+00:00

## Summary
Tool error in skill_manage: {"success": false, "error": "Patch would break SKILL.md structure: Frontmatter must include 'name' field."}

## Error hashes
- e95a2fdd27234553

## Last error
```
Error Type: tool_error
Tool Args: {'action': 'patch', 'name': 'github-repo-management', 'new_string': '---\ntitle: GitHub Large Files & History Rewriting\n---\n\n# GitHub Large Files & History Rewriting\n\n## GitHub File Size Limits\n\n| Limit Type | Size |\n|------------|------|\n| Hard limit (rejected) | 100 MB |\n| Soft warning | 50 MB |\n| Recommended max | 50 MB |\n\nFiles exceeding 100 MB are **rejected** at push and cannot enter the repo history.\n\n## Detecting Large Files in History\n\n```bash\n# Find large files in git history (by object size)\ngit rev-list --all --objects | \\\n  while read sha path; do\n    size=$(git cat-file -s "$sha" 2>/dev/null || echo 0)\n    [ "$size" -gt 50000000 ] && echo "$size $path"\n  done | sort -rn | head -20\n\n# Or via git ls-files with size check\ngit ls-tree -r HEAD | awk \'{print $4}\' | sort -rn | head\n```\n\n## Removing Large Files from History (git filter-branch)\n\n### Prerequisite: Clean Working Tree\n\n`git filter-branch` **fails w
```
