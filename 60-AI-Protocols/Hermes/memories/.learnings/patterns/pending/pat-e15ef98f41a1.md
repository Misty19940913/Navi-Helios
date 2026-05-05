# Pattern: pat-e15ef98f41a1
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T04:20:09.002694+00:00  
**Last seen:** 2026-05-05T04:20:09.002694+00:00

## Summary
Tool error in terminal: {"output": "21:The manifest lives at ~/.hermes/skills/.bundled_manifest.\n38:MANIFEST_FILE = SKILLS_DIR / \".bundled_man

## Error hashes
- 3ae9ade593067b48

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'grep -n "_read_manifest\\|def _read_manifest\\|builtin_names\\|\\.bundled_manifest\\|MANIFEST" ~/.hermes/hermes-agent/tools/skills_sync.py | head -20'}

--- Error Output (last 30 lines) ---
{"output": "21:The manifest lives at ~/.hermes/skills/.bundled_manifest.\n38:MANIFEST_FILE = SKILLS_DIR / \".bundled_manifest\"\n53:def _read_manifest() -> Dict[str, str]:\n60:    if not MANIFEST_FILE.exists():\n64:        for line in MANIFEST_FILE.read_text(encoding=\"utf-8\").splitlines():\n88:    MANIFEST_FILE.parent.mkdir(parents=True, exist_ok=True)\n93:            dir=str(MANIFEST_FILE.parent),\n94:            prefix=\".bundled_manifest_\",\n102:            atomic_replace(tmp_path, MANIFEST_FILE)\n110:        logger.debug(\"Failed to write skills manifest %s: %s\", MANIFEST_FILE, e, exc_info=True)\n193:    manifest = _read_manifest()\n345:    manifest = _read_manifest()", "exit_code": 0, "error": null}

```
