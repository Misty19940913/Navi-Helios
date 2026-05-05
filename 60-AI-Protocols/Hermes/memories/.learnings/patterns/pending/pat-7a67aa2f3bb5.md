# Pattern: pat-7a67aa2f3bb5
**Tool:** read_file  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T09:52:31.183860+00:00  
**Last seen:** 2026-05-05T09:52:31.183860+00:00

## Summary
API error in read_file: {"content": "   100|# (``threading.Lock`` is non-reentrant).  POSIX callers use the sibling\n   101|# ``.lock`` file via

## Error hashes
- 8cf705cac86ccc51

## Last error
```
Error Type: api_error
Tool Args: {'limit': 80, 'offset': 100, 'path': '/home/misty/.hermes/hermes-agent/agent/shell_hooks.py'}

--- Error Output (last 30 lines) ---
{"content": "   100|# (``threading.Lock`` is non-reentrant).  POSIX callers use the sibling\n   101|# ``.lock`` file via ``fcntl.flock`` and bypass this.\n   102|_allowlist_write_lock = threading.Lock()\n   103|\n   104|\n   105|@dataclass\n   106|class ShellHookSpec:\n   107|    \"\"\"Parsed and validated representation of a single ``hooks:`` entry.\"\"\"\n   108|\n   109|    event: str\n   110|    command: str\n   111|    matcher: Optional[str] = None\n   112|    timeout: int = DEFAULT_TIMEOUT_SECONDS\n   113|    compiled_matcher: Optional[re.Pattern] = field(default=None, repr=False)\n   114|\n   115|    def __post_init__(self) -> None:\n   116|        # Strip whitespace introduced by YAML quirks (e.g. multi-line string\n   117|        # folding) — a matcher of \" terminal\" would otherwise silently fail\n   118|        
```
