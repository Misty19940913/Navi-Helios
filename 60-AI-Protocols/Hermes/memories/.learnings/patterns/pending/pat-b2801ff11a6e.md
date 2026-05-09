# Pattern: pat-b2801ff11a6e
**Tool:** skill_view  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-07T19:36:23.134723+00:00  
**Last seen:** 2026-05-07T19:36:23.134723+00:00

## Summary
API error in skill_view: {"success": true, "name": "hermes-memory-system", "file": "references/session-jsonl-format.md", "content": "# Session JS

## Error hashes
- 63dda8b887a1b1cd

## Last error
```
Error Type: api_error
Tool Args: {'file_path': 'references/session-jsonl-format.md', 'name': 'hermes-memory-system'}

--- Error Output (last 30 lines) ---
{"success": true, "name": "hermes-memory-system", "file": "references/session-jsonl-format.md", "content": "# Session JSONL 格式參考（2026-04-30 實測）\n\n## 檔案位置\n\n```\n~/.hermes/sessions/{timestamp}_{hash}.jsonl\n~/.hermes/sessions/session_{timestamp}_{hash}.json\n~/.hermes/sessions/session_cron_{hash}_{timestamp}.json  ← cron job session\n```\n\n## Entry 格式\n\n每行是一個 JSON 物件，共 4 種 role：\n\n### 1. `session_meta`\n```json\n{\"role\": \"session_meta\", \"content\": \"\"}\n```\n幾乎為空，session 開頭的 metadata 標記。\n\n### 2. `user`\n```json\n{\"role\": \"user\", \"content\": \"[DreadxMisty] 你目前運行在哪裡\"}\n```\n`content` 是**字串**。中文字為真實對話，英文可能摻雜 system prompt。\n\n### 3. `assistant`\n```json\n{\"role\": \"assistant\", \"content\": \"回覆文字...\"}\n```\n或結構化格式：\n```json\n{\"role\": \"assistant\", \"content\": [\n  {\"type\": \"text\", \"text\": \"回覆文字第一段...\"
```
