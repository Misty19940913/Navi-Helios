# Pattern: pat-94aef9efd694
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T13:39:59.935790+00:00  
**Last seen:** 2026-05-05T13:39:59.935790+00:00

## Summary
Tool error in terminal: {"output": "# llm-wiki — Claude Code Skill\n\n> Build and maintain a persistent, interlinked markdown knowledge base as 

## Error hashes
- a6e762e19ae9d7b7

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'curl -s https://raw.githubusercontent.com/win4r/llm-wiki-claude-skill/main/README.md | head -300', 'timeout': 30}

--- Error Output (last 30 lines) ---
{"output": "# llm-wiki — Claude Code Skill\n\n> Build and maintain a persistent, interlinked markdown knowledge base as a Claude Code skill.\n> Based on [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).\n\nA single-file `SKILL.md` that teaches Claude Code how to treat a directory of markdown files (default `~/wiki/`) as a compounding, self-organizing research knowledge base. Four core operations — **ingest**, **query**, **lint**, **compile** — turn raw sources (papers, articles, URLs) into cross-linked concept pages, without requiring any external RAG service.\n\n## Why a wiki instead of RAG?\n\n- **RAG** re-retrieves raw chunks on every query. Knowledge never compiles.\n- **LLM Wiki** compiles raw sources **once** into cross-linked mar
```
