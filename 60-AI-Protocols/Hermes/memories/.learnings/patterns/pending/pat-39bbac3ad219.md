# Pattern: pat-39bbac3ad219
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:51:26.393302+00:00  
**Last seen:** 2026-05-05T10:51:26.393302+00:00

## Summary
Tool error in terminal: {"output": "error: externally-managed-environment\n\n× This environment is externally managed\n╰─> To install Python pac

## Error hashes
- 684ddb5270e7bafd

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'pip3 install --user send2trash 2>&1'}

--- Error Output (last 30 lines) ---
{"output": "error: externally-managed-environment\n\n× This environment is externally managed\n╰─> To install Python packages system-wide, try apt install\n    python3-xyz, where xyz is the package you are trying to\n    install.\n    \n    If you wish to install a non-Debian-packaged Python package,\n    create a virtual environment using python3 -m venv path/to/venv.\n    Then use path/to/venv/bin/python and path/to/venv/bin/pip. Make\n    sure you have python3-full installed.\n    \n    If you wish to install a non-Debian packaged Python application,\n    it may be easiest to use pipx install xyz, which will manage a\n    virtual environment for you. Make sure you have pipx installed.\n    \n    See /usr/share/doc/python3.12/README.venv for more information.\n\nnote: If you believe this is a mistake, please contact your Python installation or OS distribution pro
```
