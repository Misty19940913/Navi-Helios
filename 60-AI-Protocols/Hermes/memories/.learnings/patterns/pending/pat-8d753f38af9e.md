# Pattern: pat-8d753f38af9e
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T14:59:37.015888+00:00  
**Last seen:** 2026-05-05T14:59:37.015888+00:00

## Summary
API error in terminal: {"output": "=== 檢查 .hermes.md 是否存在 ===\n(不存在)\n(HERMES.md 不存在)\n(..hermes.md 不存在)\n\n=== 檢查是否有 .hermes.md 在 WSL home ===

## Error hashes
- 267e4c2e9bc12746

## Last error
```
Error Type: api_error
Tool Args: {'command': 'echo "=== 檢查 .hermes.md 是否存在 ==="\nls -la ~/.hermes/.hermes.md 2>/dev/null || echo "(不存在)"\nls -la ~/.hermes/HERMES.md 2>/dev/null || echo "(HERMES.md 不存在)"\nls -la ~/..hermes.md 2>/dev/null || echo "(..hermes.md 不存在)"\necho ""\necho "=== 檢查是否有 .hermes.md 在 WSL home ==="\nls -la /home/misty/.hermes.md 2>/dev/null || echo "(/home/misty/.hermes.md 不存在)"\necho ""\necho "=== 嘗試讀取 AGENTS.md 從 CWD ==="\ncat /home/misty/AGENTS.md 2>/dev/null || echo "無法從 CWD 讀取"\necho ""\necho "=== config.yaml 中的 cwd 設定 ==="\ngrep -A2 -B2 "cwd" /home/misty/.hermes/config.yaml | head -20'}

--- Error Output (last 30 lines) ---
{"output": "=== 檢查 .hermes.md 是否存在 ===\n(不存在)\n(HERMES.md 不存在)\n(..hermes.md 不存在)\n\n=== 檢查是否有 .hermes.md 在 WSL home ===\n(/home/misty/.hermes.md 不存在)\n\n=== 嘗試讀取 AGENTS.md 從 CWD ===\n無法從 CWD 讀取\n\n=== config.yaml 中的 cwd 設定 ===\n  backend: local\n  modal_mode: auto\n  cwd: .\n  timeout: 180\n  env_passthrough: []\n--\n  container_persistent: 
```
