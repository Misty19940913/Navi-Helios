---
name: obsidian-plugin-release
description: Build, tag, release, and deploy an Obsidian plugin with BRAT compatibility
tags: [obsidian, plugin, github, brat]
created: 2026-04-28
---

# Obsidian Plugin Release Workflow

## Standard Release Steps

```bash
# 1. Update version in manifest.json (e.g. 0.3.3)
# 2. Build
npm run build

# 3. Commit + tag
git add -A && git commit -m "release: v0.x.x"
git tag v0.x.x
git push origin main --tags

# 4. Create GitHub Release via API
# BRAT reads from Release assets, NOT repo root
GH_TOKEN="ghp_xxxx"
REPO="owner/repo"
TAG="v0.x.x"

# Create release
RELEASE=$(curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/$REPO/releases \
  -d "{
    \"tag_name\": \"$TAG\",
    \"target_commitish\": \"main\",
    \"name\": \"$TAG\",
    \"draft\": true
  }")
RELEASE_ID=$(echo $RELEASE | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")

# Upload assets (REQUIRED — BRAT downloads from here)
for FILE in manifest.json main.js styles.css; do
  curl -s -X POST \
    -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    -H "Content-Type: application/octet-stream" \
    "https://uploads.github.com/repos/$REPO/releases/$RELEASE_ID/assets?name=$FILE" \
    --data-binary "@$FILE"
done
```

**CRITICAL:** BRAT downloads from `https://github.com/{owner}/{repo}/releases/download/{version}/{filename}`.
A GitHub Release with NO uploaded assets = 404 for BRAT. Source code zips don't count.

## Common Bugs

### Bug: Widget not rendering after wikilink conversion
**Symptom:** Task wikilinks show as plain text, no card widget.

**Cause 1:** `createTaskLinkOverlay` returns only `viewPlugin`, missing `taskLinkField`.
```ts
// ❌ Wrong — StateField decorations never reach CodeMirror
return viewPlugin;

// ✅ Correct — array of extensions
return [taskLinkField, viewPlugin];
```

**Cause 2:** Used `Decoration.line({ widget })` for an inline widget.
```ts
// ❌ Wrong — Decoration.line() is for line-level decorations (background, etc.)
const deco = Decoration.line({ widget });

// ✅ Correct — Decoration.widget() with side:1 for inline widgets
const deco = Decoration.widget({ widget, side: 1 });
```

**Cause 3:** Debounced `update()` + immediate `Decoration.none` in refresh effect causes flicker.
```ts
// ❌ Wrong — decorations vanish immediately, reappear after debounce
if (effect.is(refreshEffect)) {
  return Decoration.none; // immediately clears
}

// ✅ Correct — set flag, let update() rebuild synchronously
let pendingRefresh = false;
if (effect.is(refreshEffect)) {
  pendingRefresh = true;
}
// In update():
if (pendingRefresh) {
  pendingRefresh = false;
  this.decorations = this.buildDecorations(); // sync, no debounce
}
```

### Bug: `+` button doesn't appear on checkbox lines
Same as Cause 2 — `Decoration.line()` doesn't render inline widgets.

## Vault Deployment
Vault path (Misty's setup):
```
/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/.obsidian/plugins/{plugin-id}/
```
Copy built files directly:
```bash
PLUGIN_DIR="/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/.obsidian/plugins/navi-calendar"
cp manifest.json main.js styles.css "$PLUGIN_DIR/"
```

## BRAT Update URL Pattern
BRAT clones repo and reads: `{repo}/releases/download/{version}/{filename}`
- manifest.json → must be in Release assets
- main.js → must be in Release assets
- styles.css → must be in Release assets

## Token Issues
- GitHub token embedded in `git remote origin` is MASKED (`***`) in this environment
- `git push` works via SSH (SSH key at `~/.ssh/id_ed25519`)
- GitHub API calls fail without valid token
- Solution: store PAT in `~/.netrc` or use `gh auth login` for `gh` CLI
