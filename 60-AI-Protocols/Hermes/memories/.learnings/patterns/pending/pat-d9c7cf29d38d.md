# Pattern: pat-d9c7cf29d38d
**Tool:** skill_view  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-04T17:29:57.864079+00:00  
**Last seen:** 2026-05-04T17:29:57.864079+00:00

## Summary
Tool error in skill_view: {"success": true, "name": "wiki-ingest-workflow", "description": "獨立 INGEST 工作流 — 從發現 wiki 缺口到 raw source 攝入成 atomic pag

## Error hashes
- c562ee5125faa470

## Last error
```
Error Type: tool_error
Tool Args: {'name': 'wiki-ingest-workflow'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "wiki-ingest-workflow", "description": "獨立 INGEST 工作流 — 從發現 wiki 缺口到 raw source 攝入成 atomic page，包含 5 檔結構範本", "tags": ["wiki-ingest", "llm-wiki", "workflow", "atomic-pages"], "related_skills": [], "content": "---\nname: wiki-ingest-workflow\ndescription: 獨立 INGEST 工作流 — 從發現 wiki 缺口到 raw source 攝入成 atomic page，包含 5 檔結構範本\ntrigger:\n  - \"INGEST\"\n  - \"攝入 wiki\"\n  - \"寫入 atomic page\"\n  - \"distill.*wiki\"\n  - \"新增 wiki 知識\"\nrequired_primitives:\n  - 01_flow-planning\n  - 02_data-retrieval\n  - 03_format-parsing\n  - 05_content-generation\n  - 06_file-operations\n  - 08_logging\nsources:\n  - SRC-001_Karpathy-LLM-Wiki\n  - SRC-002_openclaw-llm-wiki-admin\n  - SRC-003_sdyckjq-lab-v3.3\nlast-updated: 2026-04-29\nauthor: Hermes/Navi\ntags:\n  - wiki-ingest\n  - llm-wiki\n  - workflow\n  - atomic-pages\nproduces:\n  - wiki_atomic_page: 新建的 atomic wiki pages（
```
