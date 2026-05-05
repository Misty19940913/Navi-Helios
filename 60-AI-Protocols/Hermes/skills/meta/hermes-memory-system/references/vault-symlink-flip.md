# Vault Symlink Flip — WSL/Windows Cross-Environment Memory

## Problem

Windows Obsidian cannot resolve WSL symlinks. If `vault/60-AI-Protocols/Hermes/memory` is a symlink pointing to a WSL path like `/home/misty/Hermes-Brain/.hermes/memories`, Obsidian treats it as a 0-byte corrupt file and refuses to load the vault.

## Solution: Flip the Symlink

Canonical location = vault side (Windows-accessible). WSL side symlinks back to vault.

```
BEFORE:
vault/memory → symlink → /home/misty/.../memories    ← Windows can't resolve ❌
WSL ~/.hermes/memories = canonical                    ← WSL works, Windows broken

AFTER:
vault/memory/ ← real folder with all content         ← Windows works ✅
WSL ~/.hermes/memories → symlink → vault/memory/     ← WSL works ✅
```

## Migration Steps

1. **Backup**: `shutil.copytree("~/.hermes/memories", "~/.hermes/memories.backup")`
2. **Remove vault symlink**: `os.remove("vault/.../memory")`
3. **Create real folder in vault**: `os.makedirs("vault/.../memory")`
4. **Copy backup into vault**: copy all items from backup to new vault folder
5. **Recreate WSL symlink**: `os.symlink(vault_memory_path, "~/.hermes/memories")`

## Tool Caveat

`terminal` tool (bash) fails with misleading `FileNotFoundError` pointing to unrelated paths when working with `/mnt/c/Users/...` paths. Use `execute_code` (Python) instead — it works reliably.

## Key Insight

The WSL-side `~/.hermes/memories` path is now a symlink pointing at the vault's memory folder. Any code that reads `~/.hermes/memories` works unchanged. The vault is now the source of truth for both environments.

## OneDrive Sync Risk

When Hermes (WSL) writes to memories, the write goes through `/mnt/c/` and triggers OneDrive sync. Since writes are mostly one-directional (Hermes writes, user rarely edits in Obsidian), conflicts are low. Avoid simultaneous editing.
