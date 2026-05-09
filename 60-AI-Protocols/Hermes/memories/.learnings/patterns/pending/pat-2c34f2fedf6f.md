# Pattern: pat-2c34f2fedf6f
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T02:01:17.988941+00:00  
**Last seen:** 2026-05-08T02:01:17.988941+00:00

## Summary
API error in read_file: {"content": "     1|/**\n     2| * PAI Pulse — Shared Utilities\n     3| *\n     4| * Cron matching, state I/O, config l

## Error hashes
- be637b68e93ecfbd

## Last error
```
Error Type: api_error
Tool Args: {'path': '/home/misty/.hermes/Personal_AI_Infrastructure/Releases/v5.0.0/.claude/PAI/PULSE/lib.ts'}

--- Error Output (last 30 lines) ---
{"content": "     1|/**\n     2| * PAI Pulse — Shared Utilities\n     3| *\n     4| * Cron matching, state I/O, config loading, output dispatch, process spawning.\n     5| * Extracted from Monitor's proven code, stripped to essentials.\n     6| */\n     7|\n     8|import { parse } from \"smol-toml\"\n     9|import { join } from \"path\"\n    10|import { rename } from \"fs/promises\"\n    11|\n    12|// ── Types ──\n    13|\n    14|export type OutputTarget = \"voice\" | \"telegram\" | \"ntfy\" | \"email\" | \"log\"\n    15|\n    16|export interface Job {\n    17|  name: string\n    18|  schedule: string\n    19|  type: \"script\" | \"claude\"\n    20|  command?: string\n    21|  prompt?: string\n    22|  model?: string\n    23|  output: OutputTarget | OutputTarget[]\n    24|  enabled: boolean\n    25|}\n    26|\n    27
```
