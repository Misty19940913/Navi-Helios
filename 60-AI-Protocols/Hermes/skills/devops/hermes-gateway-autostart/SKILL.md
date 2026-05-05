---
name: hermes-gateway-autostart
description: Set up Hermes Gateway as a systemd user service on WSL2 for auto-start on boot
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [hermes, gateway, wsl2, systemd, discord, auto-start]
---

# Hermes Gateway Auto-Start on WSL2

## Context

WSL2 with systemd enabled (`/etc/wsl.conf` has `systemd=true`) can run systemd user services. Hermes Gateway can be registered as a systemd user service to auto-start on WSL boot.

## Prerequisites

- WSL2 with systemd enabled
- Hermes Agent installed and working
- Discord bot configured with `DISCORD_BOT_TOKEN` and `DISCORD_ALLOWED_USERS` in `~/.hermes/.env`

## Setup

### 1. Create systemd user directory
```bash
mkdir -p ~/.config/systemd/user
```

### 2. Create service file
Write to `~/.config/systemd/user/hermes-gateway.service`:

```ini
[Unit]
Description=Hermes Gateway - Discord/Telegram/Messaging
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/home/misty/.local/bin/hermes gateway run --replace
WorkingDirectory=/home/misty
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=default.target
```

**Critical:** Use `--replace` flag. Without it, if any `hermes gateway run` process is already running (e.g., from a previous manual start), the new service will exit with code 1 because "Gateway already running". The `--replace` flag tells the new instance to take over existing ones gracefully.

### 3. Enable and start
```bash
systemctl --user daemon-reload
systemctl --user enable hermes-gateway
systemctl --user start hermes-gateway
```

### 4. Verify
```bash
systemctl --user status hermes-gateway
tail ~/.hermes/logs/agent.log | grep -i discord
```

## Managing the service

```bash
systemctl --user status hermes-gateway   # check status
systemctl --user stop hermes-gateway     # stop
systemctl --user restart hermes-gateway  # restart
journalctl --user -u hermes-gateway -f   # follow logs
```

## Troubleshooting

### Service fails with "Gateway already running"
This means a previous `hermes gateway run` process is still alive (e.g., started manually or via tmux). The `--replace` flag solves this — make sure it's in `ExecStart`.

### tmux session conflicts
If you previously started gateway via `tmux new-session -d -s hermes-gateway 'hermes gateway run'`, kill it first:
```bash
tmux kill-session -t hermes-gateway 2>/dev/null
```

### WSL2 closes, systemd service dies
If `systemd=true` is not set in `/etc/wsl.conf`, systemd services don't survive WSL close. Add to `/etc/wsl.conf`:
```ini
[boot]
systemd=true
```
Then restart WSL: `wsl --shutdown` from Windows CMD.

## Key Learnings

- The `--replace` flag is essential — always include it, because WSL sessions often have leftover processes
- systemd user services on WSL2 work normally once `systemd=true` is set
- Discord bot connection logs to `~/.hermes/logs/agent.log` — grep for "discord" or "Connected" to verify
