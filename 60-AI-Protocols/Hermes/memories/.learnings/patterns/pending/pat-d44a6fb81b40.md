# Pattern: pat-d44a6fb81b40
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T02:17:45.948244+00:00  
**Last seen:** 2026-05-03T02:17:45.948244+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: json-canvas\n     3|description: Create and edit JSON Canvas files (.canvas) with 

## Error hashes
- 9e27aa7423bfc55d

## Last error
```
Error Type: api_error
Tool Args: {'path': '/tmp/obsidian-skills-new/skills/json-canvas/SKILL.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: json-canvas\n     3|description: Create and edit JSON Canvas files (.canvas) with nodes, edges, groups, and connections. Use when working with .canvas files, creating visual canvases, mind maps, flowcharts, or when the user mentions Canvas files in Obsidian.\n     4|---\n     5|\n     6|# JSON Canvas Skill\n     7|\n     8|## File Structure\n     9|\n    10|A canvas file (`.canvas`) contains two top-level arrays following the [JSON Canvas Spec 1.0](https://jsoncanvas.org/spec/1.0/):\n    11|\n    12|```json\n    13|{\n    14|  \"nodes\": [],\n    15|  \"edges\": []\n    16|}\n    17|```\n    18|\n    19|- `nodes` (optional): Array of node objects\n    20|- `edges` (optional): Array of edge objects connecting nodes\n    21|\n    22|## Common Workflows\n    23|\n    24|### 1. Create a New Canvas\n    25|\n    26|1. C
```
