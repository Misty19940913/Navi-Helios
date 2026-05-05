# Pattern: pat-16a45ef5f33e
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T14:34:16.097907+00:00  
**Last seen:** 2026-05-05T14:34:16.097907+00:00

## Summary
API error in read_file: {"content": "     1|---\n     2|name: llm-wiki\n     3|description: \"Karpathy's LLM Wiki: build/query interlinked markd

## Error hashes
- e96154ccc2ac39cf

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/skills/research/llm-wiki/SKILL.md', 'limit': 507}

--- Error Output (last 30 lines) ---
{"content": "     1|---\n     2|name: llm-wiki\n     3|description: \"Karpathy's LLM Wiki: build/query interlinked markdown KB.\"\n     4|version: 2.1.0\n     5|author: Hermes Agent\n     6|license: MIT\n     7|metadata:\n     8|  hermes:\n     9|    tags: [wiki, knowledge-base, research, notes, markdown, rag-alternative]\n    10|    category: research\n    11|    related_skills: [obsidian, arxiv]\n    12|trigger: \"被問到「如何建立個人 wiki」「如何攝取文獻」「如何查詢知識庫」時觸發\"\n    13|---\n    14|\n    15|# Karpathy's LLM Wiki\n    16|\n    17|Build and maintain a persistent, compounding knowledge base as interlinked markdown files.\n    18|Based on [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).\n    19|\n    20|Unlike traditional RAG (which rediscovers knowledge from scratch per query), the wiki\n    2
```
