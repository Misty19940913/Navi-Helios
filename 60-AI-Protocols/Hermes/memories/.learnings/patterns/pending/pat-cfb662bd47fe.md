# Pattern: pat-cfb662bd47fe
**Tool:** skill_manage  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T14:23:49.918928+00:00  
**Last seen:** 2026-05-05T14:23:49.918928+00:00

## Summary
Tool error in skill_manage: {"success": false, "error": "SKILL.md must start with YAML frontmatter (---). See existing skills for format."}

## Error hashes
- 34a7b74ec848d6c7

## Last error
```
Error Type: tool_error
Tool Args: {'action': 'create', 'name': 'hermes-asset-symlink-mgmt', 'content': '# Hermes Asset Symlink Management\n\n> WSL/NFTS 環境下 Hermes 資產（SOUL/AGENTS/memories/skills）的 symlink 建立與重建標準程序。\n\n## 典型場景\n\n將 Hermes 資產從舊路徑迁移到新 canonical 路徑後，需重建 `~/.hermes/` 下的所有 symlinks。\n\n## 標準程序\n\n### Step 0: 確認新舊路徑\n\n```bash\n# 新 canonical 路徑（vault）\nNEW_CANONICAL="/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/60-AI-Protocols/Hermes/"\n\n# 驗證目標存在\nls "$NEW_CANONICAL/SOUL.md"\nls "$NEW_CANONICAL/memories/"\nls "$NEW_CANONICAL/skills/"\n```\n\n### Step 1: 備份現有 symlinks 狀態\n\n```bash\nls -la ~/.hermes/ | grep -E "SOUL|memories|skills"\n```\n\n### Step 2: 刪除舊 symlinks\n\n⚠️ **NTFS gotcha**: WSL 中 `rm symlink` 在 NTFS mount 上可能追蹤到目標並刪除之。**刪除後立即驗證目標是否存在**，不等壞了再補救。\n\n```bash\nrm -v ~/.hermes/SOUL.md ~/.hermes/memories ~/.hermes/skills\n\n# 立即驗證 — 目標檔案還在不在？\nls "$NEW_CANONICAL/SOUL.md"    # must still exist\n```\n\n### Step 3: 重新建立 symlinks\n\n```bash\nln -sv "$NEW_CANONICAL/SOUL.m
```
