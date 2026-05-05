# Pattern: pat-d2dbcd9e173e
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T15:00:47.040013+00:00  
**Last seen:** 2026-05-05T15:00:47.040013+00:00

## Summary
Tool error in terminal: {"output": "# Hermes Agent - Development Guide\n\nInstructions for AI coding assistants and developers working on the he

## Error hashes
- 132e475e450b5643

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'head -20 /home/misty/.hermes/hermes-agent/AGENTS.md'}

--- Error Output (last 30 lines) ---
{"output": "# Hermes Agent - Development Guide\n\nInstructions for AI coding assistants and developers working on the hermes-agent codebase.\n\n## Development Environment\n\n```bash\n# Prefer .venv; fall back to venv if that's what your checkout has.\nsource .venv/bin/activate   # or: source venv/bin/activate\n```\n\n`scripts/run_tests.sh` probes `.venv` first, then `venv`, then\n`$HOME/.hermes/hermes-agent/venv` (for worktrees that share a venv with the\nmain checkout).\n\n## Project Structure\n\nFile counts shift constantly — don't treat the tree below as exhaustive.\nThe canonical source is the filesystem. The notes call out the load-bearing\nentry points you'll actually edit.", "exit_code": 0, "error": null}

```
