---
name: obsidian-cli
description: Interact with Obsidian vaults using the Obsidian CLI to read, create, search, and manage notes, tasks, properties, and more. Also supports plugin and theme development with commands to reload plugins, run JavaScript, capture errors, take screenshots, and inspect the DOM. Use when the user asks to interact with their Obsidian vault, manage notes, search vault content, perform vault operations from the command line, or develop and debug Obsidian plugins and themes.
setup_required: true
---

# Obsidian CLI

Use the `obsidian` CLI to interact with a running Obsidian instance. Requires Obsidian to be open AND the CLI binary to be installed.

## ⚠️ Prerequisites (MUST verify before use)

```bash
# Check if obsidian CLI is installed
obsidian --version 2>&1
```

**If `command not found`**: The CLI is not installed. Install it first:
- Download from https://obsidian.md/download
- Or via npm: `npm install -g obsidian-cli`
- WSL note: Obsidian must run on the Windows side; the CLI bridges from terminal to the running app

**If `obsidian vault list` returns "An API key must be provided"**: Set the environment variable first:
```bash
export OBSIDIAN_API_KEY="your-key-here"
```
Then retry. If the key is correct but the vault list is still empty, the Obsidian app may not be running on the Windows side — launch it there first.

**If the CLI bridge is unavailable (WSL + no API key / app not running)**: Fall back to direct file operations. Vault files are accessible at `/mnt/c/Users/<username>/OneDrive/Apps/remotely-save/<VaultName>/`. Use `read_file`, `write_file`, `patch`, and `search_files` with those paths directly — this works without any API key or running app. Do NOT let CLI unavailability block vault operations; the vault files are just regular markdown.

**If CLI is installed but `obsidian vault list` returns empty**: Obsidian app may not be running. Launch Obsidian first.

## ⚡操作順序（CLI First, File Ops Fallback）

**When the user explicitly says to use the CLI skill**, follow this order:
1. **CLI first** — Try `obsidian` commands first. They provide structured output and are vault-aware.
2. **File ops fallback** — If CLI prerequisites aren't met (no API key, app not running in WSL), use direct file operations via `/mnt/c/...` paths. This is equally valid.

**Do NOT default to direct file ops when CLI would work.** The user explicitly wants CLI used first when available.

**Current vault path** (verify before each session):
```
/mnt/c/Users/安泰/OneDrive/Apps/remotely-save/Navi Helios/
```

Key subdirectories:
- `20_Life_Planning/` — Goals, Areas, Tasks, Journal
- `30_Projects/32_Active/Life-OS/` — Active Life OS project files
- `40_Knowledge/41_原子知識/` — Atomic wiki pages (flat structure, no MOC subdirs)

## Command reference

Run `obsidian help` to see all available commands. This is always up to date. Full docs: https://help.obsidian.md/cli

## Syntax

**Parameters** take a value with `=`. Quote values with spaces:

```bash
obsidian create name="My Note" content="Hello world"
```

**Flags** are boolean switches with no value:

```bash
obsidian create name="My Note" silent overwrite
```

For multiline content use `\n` for newline and `\t` for tab.

## File targeting

Many commands accept `file` or `path` to target a file. Without either, the active file is used.

- `file=<name>` — resolves like a wikilink (name only, no path or extension needed)
- `path=<path>` — exact path from vault root, e.g. `folder/note.md`

## Vault targeting

Commands target the most recently focused vault by default. Use `vault=<name>` as the first parameter to target a specific vault:

```bash
obsidian vault="My Vault" search query="test"
```

## Common patterns

```bash
obsidian read file="My Note"
obsidian create name="New Note" content="# Hello" template="Template" silent
obsidian append file="My Note" content="New line"
obsidian search query="search term" limit=10
obsidian daily:read
obsidian daily:append content="- [ ] New task"
obsidian property:set name="status" value="done" file="My Note"
obsidian tasks daily todo
obsidian tags sort=count counts
obsidian backlinks file="My Note"
```

Use `--copy` on any command to copy output to clipboard. Use `silent` to prevent files from opening. Use `total` on list commands to get a count.

## Plugin development

### Develop/test cycle

After making code changes to a plugin or theme, follow this workflow:

1. **Reload** the plugin to pick up changes:
   ```bash
   obsidian plugin:reload id=my-plugin
   ```
2. **Check for errors** — if errors appear, fix and repeat from step 1:
   ```bash
   obsidian dev:errors
   ```
3. **Verify visually** with a screenshot or DOM inspection:
   ```bash
   obsidian dev:screenshot path=screenshot.png
   obsidian dev:dom selector=".workspace-leaf" text
   ```
4. **Check console output** for warnings or unexpected logs:
   ```bash
   obsidian dev:console level=error
   ```

### Additional developer commands

Run JavaScript in the app context:

```bash
obsidian eval code="app.vault.getFiles().length"
```

Inspect CSS values:

```bash
obsidian dev:css selector=".workspace-leaf" prop=background-color
```

Toggle mobile emulation:

```bash
obsidian dev:mobile on
```

Run `obsidian help` to see additional developer commands including CDP and debugger controls.
