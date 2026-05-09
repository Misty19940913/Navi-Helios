# Pattern: pat-8bd727e9d9b2
**Tool:** execute_code  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-09T05:46:02.983005+00:00  
**Last seen:** 2026-05-09T05:46:02.983005+00:00

## Summary
API error in execute_code: {"status": "success", "output": "Total: 120 | B:68 C:41 D:11\n\n=== GRADE B (well-structured) ===\n  [B] research/resear

## Error hashes
- c77f955717327a68

## Last error
```
Error Type: api_error
Tool Args: {'code': 'import os, re\n\nskills_dir = "/home/misty/.hermes/skills"\n\n# Expanded patterns for step-like content detection\nSTEP_PATTERNS = [\n    r\'(?i)^##?\\s*step\\s*\\d\',       # "## Step 1", "### Step 2"\n    r\'(?i)^##?\\s*步驟\',              # "## 步驟 1"\n    r\'(?i)^##?\\s*流程\',              # "## 流程"\n    r\'(?i)^##?\\s*指令\',              # "## 指令" (commands)\n    r\'(?i)^##?\\s*操作\',              # "## 操作"\n    r\'(?i)^##?\\s*guide\',            # "## Guide"\n    r\'(?i)^##?\\s*tutorial\',         # "## Tutorial"\n    r\'(?i)^##?\\s*workflow\',         # "## Workflow"\n    r\'(?i)^##?\\s*procedure\',        # "## Procedure"\n    r\'(?i)^##?\\s*how\\s*to\',         # "## How to"\n    # Code block headers with action verbs\n    r\'(?im)^#{1,3}\\s+`[^`]+`\',      # "### `install`" style headers\n    # Numbered list markers\n    r\'\\n\\s*\\d+\\.\\s+\\S\',             # "1. Do something"\n    r\'\\n\\s*[▶➤•]\\s+\\S\',             # "• Do somethin
```
