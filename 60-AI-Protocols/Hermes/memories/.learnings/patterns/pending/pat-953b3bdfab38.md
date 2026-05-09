# Pattern: pat-953b3bdfab38
**Tool:** skill_view  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T02:38:14.402382+00:00  
**Last seen:** 2026-05-08T02:38:14.402382+00:00

## Summary
Tool error in skill_view: {"success": true, "name": "systematic-debugging", "description": "4-phase root cause debugging: understand bugs before f

## Error hashes
- 0958e5f45296e87f

## Last error
```
Error Type: tool_error
Tool Args: {'name': 'systematic-debugging'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "systematic-debugging", "description": "4-phase root cause debugging: understand bugs before fixing.", "tags": ["debugging", "troubleshooting", "problem-solving", "root-cause", "investigation"], "related_skills": ["test-driven-development", "writing-plans", "subagent-driven-development"], "content": "---\nname: systematic-debugging\ndescription: \"4-phase root cause debugging: understand bugs before fixing.\"\nversion: 1.1.0\nauthor: Hermes Agent (adapted from obra/superpowers)\nlicense: MIT\nmetadata:\n  hermes:\n    tags: [debugging, troubleshooting, problem-solving, root-cause, investigation]\n    related_skills: [test-driven-development, writing-plans, subagent-driven-development]\n    triggers:\n      - \"debug\"\n      - \"bug\"\n      - \"fix\"\n      - \"error\"\n      - \"crash\"\n      - \"issue\"\n      - \"test failed\"\n      - \"unexpected beh
```
