---
name: hermes-cross-device-sync
category: devops
description: Set up portable, cross-device sync for Hermes AI brain data using OneDrive + GitHub version control. Based on pro-kit 07 methodology adapted for Hermes.
---

# Hermes Cross-Device Sync Setup

## Architecture Overview

```
~/Hermes-Brain/                          ← Local git repo (version control)
├── .hermes/
│   ├── SOUL.md                          ← AI persona
│   ├── memories/                        ← Memory database
│   ├── skills/                           ← Skills library
│   ├── config.yaml                      ← System config
│   └── hooks/                           ← Custom hooks
├── .gitignore                           ← Excludes local-only files
├── MIGRATION.md                         ← Future migration guide
└── scripts/
    └── sync-health.sh                   ← Health check script

OneDrive Sync:                           ← Cross-device file sync
  Add ~/Hermes-Brain/ to Windows OneDrive sync list

GitHub Remote:                          ← Offsite backup + version control
  git push to private repo on GitHub
```

## User Context (Misty on WSL/Fabe Windows machine)

- WSL username: `misty`
- Windows profile folder: `/mnt/c/Users/安泰/` (Chinese username "安泰")
- GitHub username: `Misty19940913`
- Confirmed Obsidian Vault: `/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/`
  - This vault is the PRIMARY brain folder (OneDrive synced, cross-device)
  - Contains PARA-style structure: 10_Inbox, 20_Life_Planning, 30_Projects, 40_Knowledge, 50_Content_Creation, 60-AI-Protocols, 70_Archives, 80_System
  - **Hermes brain folder**: `60-AI-Protocols/Hermes/` (contains SOUL.md, memory/, skills/)
  - Already has: `client_secret_*.json` (Google OAuth file)

## Critical Pitfalls

### 1. WSL path translation for Windows usernames with non-ASCII characters
When accessing Windows files from WSL, translate paths like:
- Windows: `C:\Users\安泰\OneDrive\...`
- WSL: `/mnt/c/Users/安泰/OneDrive/...`
- The Chinese folder name "安泰" is the actual directory name on disk.

### 2. NEVER put git repo inside OneDrive folder
Git fails catastrophically inside OneDrive/Google Drive/Dropbox cloud-sync folders:
- `chmod` operations fail with "Operation not permitted"
- `git status` shows files from parent directories as deleted
- `.git/objects/` corruption and lock file issues
- Cloud sync conflicts break git index

**Correct approach**: Keep git repo local, use OneDrive only for file-level sync.

### 3. Obsidian Vault + Symlinks (Critical Rule)
**Obsidian's vault indexing does NOT follow symlinks** pointing INTO the vault.
- If `~/.hermes/skills` is a symlink → a folder inside the Vault, Obsidian cannot see/read those markdown files
- The vault must be the **mother folder** (source of truth)
- Symlinks in `~/.hermes/` must point TO files/folders that live INSIDE the Vault (so Hermes can access them from WSL)
- This is the reverse of typical symlink direction — here we symlink FROM `~/.hermes/` TO Vault locations

**Correct pattern for WSL + Vault:**
```
WSL:  ~/.hermes/skills → symlink → /mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/skills/
Vault (Windows/OneDrive): contains the actual .md skill files
Obsidian: reads the vault directly (no symlink involved for Obsidian)
Hermes: follows symlink to reach Vault files from WSL
```

**Wrong pattern (what to avoid):**
```
Trying to make Vault point to ~/.hermes/skills via symlink
→ Obsidian won't see the skill files
→ Skills won't appear in Obsidian's search/graph
```

### 4. OAuth / Google Workspace CLI limitation
Google OAuth's `localhost:1` callback only works on the local machine where the browser runs.
- If user is outside (different network/location), OAuth cannot complete
- Must be done from the home computer with the browser
- This is a WSL2 network bridging limitation, not a Hermes bug

## Architecture: Final Recommended Setup

```
Windows/OneDrive (source of truth):
  C:\Users\安泰\OneDrive\Obsidian\Navi Helios\
    └── 60-AI-Protocols/
        └── Hermes/
            ├── SOUL.md           ← AI persona (already created)
            ├── memory/
            │   └── MEMORY.md    ← cross-session memory (already created)
            ├── skills/           ← skills live here (Obsidian sees them)
            └── README.md

WSL2:
  ~/.hermes/skills → symlink → /mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/skills/
  ~/.hermes/SOUL.md → symlink → /mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/SOUL.md
  ~/.hermes/memories → symlink → /mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/memory/

GitHub (separate from Vault, never inside OneDrive):
  Create a private repo (e.g., NaviHelios-Brain)
  Clone it to a NON-OneDrive path (e.g., ~/git/NaviHelios-Brain/)
  Use git sparse-checkout or submodule to pull just skills/, SOUL.md, memory/ from Vault
  OR: manual push of selected folders to GitHub (simpler approach)

OneDrive: handles real-time cross-device sync (Windows ↔ other devices)
GitHub: handles version history and offsite backup (separate from OneDrive)
```

**Key principle**: Vault is the brain. OneDrive syncs it. GitHub backs up selected parts. They serve different purposes and must not overlap.

## Setup Steps

### Step 1: Backup
```bash
BACKUP_DIR="$HOME/hermes-backup-$(date +%Y%m%d-%H%M%S)"
cp -a "$HOME/.hermes" "$BACKUP_DIR"
```

### Step 2: Create mother folder
```bash
# Option A: Inside Obsidian vault (best if you use Obsidian heavily)
MOTHER="$HOME/path/to/Obsidian/Vault/Hermes-Brain"

# Option B: Standalone local folder (best for git compatibility)
MOTHER="$HOME/Hermes-Brain"

mkdir -p "$MOTHER/.hermes"
```

### Step 3: Move core files to mother
```bash
for item in SOUL.md memories skills config.yaml hooks; do
  [ -e "$HOME/.hermes/$item" ] && mv "$HOME/.hermes/$item" "$MOTHER/.hermes/$item"
done
```

### Step 4: Create symlinks in ~/.hermes/
```bash
for item in SOUL.md memories skills config.yaml hooks; do
  rm -rf "$HOME/.hermes/$item"
  ln -sf "$MOTHER/.hermes/$item" "$HOME/.hermes/$item"
done
```

### Step 5: Verify symlinks
```bash
for item in SOUL.md memories skills config.yaml hooks; do
  if [ -L "$HOME/.hermes/$item" ]; then
    TARGET=$(readlink "$HOME/.hermes/$item")
    [ -e "$TARGET" ] && echo "✅ $item" || echo "❌ $item broken"
  else
    echo "⚠️ $item not a symlink"
  fi
done
```

### Step 6: Add to OneDrive sync (Windows side)
On Windows, open OneDrive settings → "Choose folders" → check `~/Hermes-Brain/`

### Step 7: Initialize git (local only)
```bash
cd "$MOTHER"
git init -b main
git config user.name "YourGitHubUsername"
git config user.email "your@email.com"
git config --global --add safe.directory "$MOTHER"
```

### Step 8: Create .gitignore
```gitignore
# Secrets
.env
.env.*
**/.env

# Hermes local-only state
.hermes/state.db
.hermes/state.db-shm
.hermes/state.db-wal
.hermes/sessions/
.hermes/cache/
.hermes/checkpoints/
.hermes/logs/
.hermes/sandboxes/
.hermes/cron/
.hermes/hermes-agent/
.hermes/node/
.hermes/bin/
.hermes/audio_cache/
.hermes/image_cache/
.hermes/models_dev_cache.json
.hermes/gateway.*
.hermes/auth.lock
.hermes/auth.json
.hermes/channel_directory.json
.hermes/discord_threads.json
.hermes/pairing/
.hermes/.update_check
.hermes/.hermes_history
.hermes/.skills_prompt_snapshot.json

# System
.DS_Store
Thumbs.db

# Backups
*-backup-*/

# Logs
*.log
```

### Step 9: GitHub remote
```bash
# Create repo on GitHub first, then:
git remote add origin git@github.com:username/repo.git
git add .
git commit -m "init: Hermes brain portable sync"
git push -u origin main
```

## What to Sync vs Not Sync

| Sync ✅ | Local Only ❌ |
|---|---|
| SOUL.md | state.db, state.db-wal, state.db-shm |
| memories/ | sessions/ |
| skills/ | hermes-agent/, node/, bin/ |
| config.yaml | .env (contains API keys) |
| hooks/ | cache/, checkpoints/, logs/ |
| MIGRATION.md | audio_cache/, image_cache/ |
| sync-health.sh | models_dev_cache.json |

## Files Excluded from git but synced by OneDrive
These are too large or machine-specific for git, but useful to have on all devices:
- `hermes-agent/` (large binary)
- `node/` (Node.js runtime)
- `bin/` (Hermes binary)

This is a judgment call based on your bandwidth and device storage.
