# Pattern: pat-bd45f354f44a
**Tool:** skill_view  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-09T04:15:56.361180+00:00  
**Last seen:** 2026-05-09T04:15:56.361180+00:00

## Summary
API error in skill_view: {"success": true, "name": "github-repo-management", "description": "Clone/create/fork repos; manage remotes, releases.",

## Error hashes
- ef11ff695b30a3b5

## Last error
```
Error Type: api_error
Tool Args: {'name': 'github-repo-management'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "github-repo-management", "description": "Clone/create/fork repos; manage remotes, releases.", "tags": ["GitHub", "Repositories", "Git", "Releases", "Secrets", "Configuration"], "related_skills": ["github-auth", "github-pr-workflow", "github-issues"], "content": "---\nname: github-repo-management\ndescription: \"Clone/create/fork repos; manage remotes, releases.\"\nversion: 1.2.0\nauthor: Hermes Agent\nlicense: MIT\nrequired_primitives: [01_flow-planning, 02_data-retrieval, 05_content-generation, 06_file-operations]\ntriggers:\n  - \"clone repo\"\n  - \"create repo\"\n  - \"fork repo\"\n  - \"gh repo\"\n  - \"github repository\"\n  - \"repo clone\"\n  - \"repo create\"\n  - \"repo fork\"\n  - \"github secrets\"\n  - \"github release\"\n  - \"github actions\"\n  - \"github workflow\"\n  - \"workflow dispatch\"\n  - \"rerun ci\"\n  - \"branch protection\"\n 
```
