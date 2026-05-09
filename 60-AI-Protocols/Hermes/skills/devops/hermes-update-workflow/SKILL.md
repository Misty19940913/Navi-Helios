---
name: hermes-update-workflow
description: Hermes Agent update procedure — git pull後重啟gateway的標準流程，避免stale memory process問題
---

# Hermes Update Workflow

## Context
After `hermes update` (git pull), the gateway may run stale code if an old process is still in memory. The new binary is on disk but the running process uses old in-memory code.

## Symptoms
- `hermes update` reports "0 commits behind" but Discord shows errors like `ImportError: cannot import name 'cfg_get'`
- Any `AttributeError` or missing symbol error immediately after git pull
- Behavior doesn't match new code you just pulled

## Root Cause
Python processes load `.py` files into memory. `git pull --ff` updates disk files but does NOT update running processes. Must restart.

## Workflow

### Step 1: Update
```bash
cd ~/.hermes/hermes-agent
git pull --ff
```

### Step 2: Clear stale cache (optional, for accurate status)
```bash
rm ~/.hermes/.update_check
hermes update  # verify 0 behind
```

### Step 3: Restart gateway
```bash
# Find running gateway PID
ps aux | grep "hermes gateway"

# Kill old process
kill <old_pid>

# Start new gateway
hermes gateway start
# OR restart via systemd
systemctl --user restart hermes-gateway
```

### Step 3b: Clear stale update-check cache (prevents false "behind" report)
```bash
rm -f ~/.hermes/.update_check
```

### Step 4: Verify
```bash
hermes update  # should show 0 commits behind
systemctl --user status hermes-gateway  # active (running)
```

## Key Files
- `~/.hermes/gateway.pid` — PID file, check if matches running process
- `~/.hermes/.update_check` — caches behind count; delete after git pull for accurate status
- `~/.config/systemd/user/hermes-gateway.service` — systemd service definition
- `~/.hermes/hermes-agent/` — git working directory (where git pull runs)

## Important Note
`hermes gateway start` calls `gateway run --replace` which replaces existing gateway if one is running. So after git pull, simply running `hermes gateway start` should be sufficient to pick up new code. No manual kill needed.

## Verify Discord is connected
Check logs: `~/.hermes/logs/agent.log` for "Navi#7308" or "Shard ID connected"
