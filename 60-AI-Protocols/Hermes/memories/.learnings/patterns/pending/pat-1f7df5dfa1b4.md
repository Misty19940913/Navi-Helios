# Pattern: pat-1f7df5dfa1b4
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T16:17:49.296858+00:00  
**Last seen:** 2026-05-08T16:17:49.296858+00:00

## Summary
API error in terminal: {"output": "WARNING: pip index is currently an experimental command. It may be removed/changed in a future release witho

## Error hashes
- a6bca8e736e581dc

## Last error
```
Error Type: api_error
Tool Args: {'command': "~/.hermes/mt5-env/bin/pip index versions MetaTrader5 2>&1 || echo '---' && pip search MetaTrader5 2>&1 || echo 'no search'", 'timeout': None, 'workdir': None}

--- Error Output (last 30 lines) ---
{"output": "WARNING: pip index is currently an experimental command. It may be removed/changed in a future release without prior warning.\nERROR: No matching distribution found for MetaTrader5\n\n[notice] A new release of pip is available: 24.0 -> 26.1.1\n[notice] To update, run: python3.11 -m pip install --upgrade pip\n---\nERROR: XMLRPC request failed [code: -32500]\nRuntimeError: PyPI no longer supports 'pip search' (or XML-RPC search). Please use https://pypi.org/search (via a browser) instead. See https://warehouse.pypa.io/api-reference/xml-rpc.html#deprecated-methods for more information.\nno search", "exit_code": 0, "error": null}

```
