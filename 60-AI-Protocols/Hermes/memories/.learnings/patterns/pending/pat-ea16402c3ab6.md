# Pattern: pat-ea16402c3ab6
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-08T16:17:49.843106+00:00  
**Last seen:** 2026-05-08T16:17:49.843106+00:00

## Summary
API error in terminal: {"output": "ERROR: XMLRPC request failed [code: -32500]\nRuntimeError: PyPI no longer supports 'pip search' (or XML-RPC 

## Error hashes
- b2e128b9c44c2da1

## Last error
```
Error Type: api_error
Tool Args: {'command': "~/.hermes/mt5-env/bin/pip search mt5 2>&1 | head -20 || echo 'search disabled'", 'timeout': None, 'workdir': None}

--- Error Output (last 30 lines) ---
{"output": "ERROR: XMLRPC request failed [code: -32500]\nRuntimeError: PyPI no longer supports 'pip search' (or XML-RPC search). Please use https://pypi.org/search (via a browser) instead. See https://warehouse.pypa.io/api-reference/xml-rpc.html#deprecated-methods for more information.", "exit_code": 0, "error": null}

```
