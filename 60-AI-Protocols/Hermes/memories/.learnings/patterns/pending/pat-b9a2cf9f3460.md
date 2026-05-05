# Pattern: pat-b9a2cf9f3460
**Tool:** terminal  
**Type:** api_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-03T19:56:00.886679+00:00  
**Last seen:** 2026-05-03T19:56:00.886679+00:00

## Summary
API error in terminal: {"output": "- config.yaml sync 已解決：live → Hermes-Brain → GitHub（透過 `~/sync-config-to-brain.sh`）\n- hermes update false p

## Error hashes
- cf922677f6a7340c

## Last error
```
Error Type: api_error
Tool Args: {'command': 'cat ~/.hermes/memories/MEMORY.md 2>/dev/null | head -50'}

--- Error Output (last 30 lines) ---
{"output": "- config.yaml sync 已解決：live → Hermes-Brain → GitHub（透過 `~/sync-config-to-brain.sh`）\n- hermes update false positive: `rm ~/.hermes/.update_check` 可清除 6hr 缓存的假落後訊息（快取在 git pull --ff 後仍回舊值）\n§\n- Navi Helios vault 路徑（WSL）：`/mnt/c/Users/安泰/OneDrive/Apps/remotely-save/Navi Helios/`，atomic pages 在 `40_Knowledge/41_原子知識/{MOC}/`\n- `~/Navi-Helios-vault` 捷徑不存在，每次 INGEST 都要重新 find 確認路徑\n§\nhermes update 後必須重啟 gateway：舊行程(PID)記憶體中跑舊程式碼，git pull 只更新硬碟。症狀：ImportError: cfg_get。Fix: `kill <gateway_pid> && hermes gateway start`（或 `hermes gateway restart`）。Gateway 也會更新 user service 定義（systemd）。\n§\n- Navi Helios vault：`/mnt/c/Users/安泰/OneDrive/Apps/remotely-save/Navi Helios/`，skills 在 `60-AI-Protocols/Hermes/skills/`，atomic pages 在 `40_Knowledge/41_原子知識/{MOC}/`\n- 10_Inbox：`/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/10_Inbox/`\n- hermes update 後需重
```
