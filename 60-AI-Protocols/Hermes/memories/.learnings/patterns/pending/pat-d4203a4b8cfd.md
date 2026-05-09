# Pattern: pat-d4203a4b8cfd
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-07T22:32:38.062754+00:00  
**Last seen:** 2026-05-07T22:32:38.062754+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: ArXiv\n     3|pack-id: pai-arxiv-v1.0.0\n     4|version: 1.0.0\n     5|author: dan

## Error hashes
- dda8c60e4fa07aae

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Packs/ArXiv/README.md'}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: ArXiv\n     3|pack-id: pai-arxiv-v1.0.0\n     4|version: 1.0.0\n     5|author: danielmiessler\n     6|description: Search and retrieve arXiv academic papers by topic, category, or paper ID — with AlphaXiv-enriched AI-generated overviews. Uses arXiv Atom API (no auth) for discovery and search across cs.AI, cs.LG, cs.CL (NLP/LLMs), cs.CR (security), cs.MA (multi-agent), cs.SE, and cs.IR. Supports title (ti:), abstract (abs:), author (au:), and category (cat:) search fields with boolean operators (AND, OR, ANDNOT); sorts by lastUpdatedDate or relevance; paginates up to 2,000 results per call with 3s rate limit between calls. AlphaXiv enrichment fetches markdown summaries from alphaxiv.org/overview/{ID}.md; full text from alphaxiv.org/abs/{ID}.md as fallback; 404 means summary not yet generated. Workflo
```
