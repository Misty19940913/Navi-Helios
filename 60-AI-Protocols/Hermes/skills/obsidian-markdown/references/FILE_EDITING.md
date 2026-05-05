# Obsidian File Editing — Reliable Patterns

## `patch` Tool Multi-Line Gotcha

The `patch` tool uses fuzzy matching. For single-line replacements it works well. For multi-line blocks in `.md` files, it frequently fails with **"Found N matches"** even when the string is unique — because the fuzzy matcher treats line boundaries unpredictably in multi-line mode.

**Reliable pattern: `execute_code` with direct string replacement**

```python
path = "/absolute/path/to/file.md"
with open(path) as f:
    content = f.read()

old = """line 1
line 2
line 3"""

new = """line 1
new line 2"""

count = content.count(old)
if count == 1:
    content = content.replace(old, new)
    with open(path, "w") as f:
        f.write(content)
    print("Done.")
else:
    print(f"Matches: {count} — cannot proceed safely.")
```

**Key rule:** Always check `count` before writing. If `count != 1`, inspect the file with `repr()` before proceeding.

**When `count` reports 0 but the pattern is visibly present:** The Python string may contain invisible differences from what you see rendered (trailing spaces, different line endings `\n` vs `\r\n`, or subtle Unicode). Use `repr()` on the specific line range to capture the exact bytes, then build the `old` string from that output.

**When `count` reports multiple matches:** The block appears more than once in the file (or a similar block exists elsewhere). Increase context in `old` until it is unique — add surrounding lines, a full section header, or enough surrounding text to disambiguate. If unsure, re-read the file fresh (`read_file` without offset/limit) and use `repr()` to construct the unique key.

## Line-level Inspection for Debugging

When replacement fails, inspect exact characters:

```python
with open(path) as f:
    lines = f.readlines()

# Show lines 140-160 with exact repr
for i, line in enumerate(lines[139:160], start=140):
    print(f"{i}: {repr(line)}")
```

Use `repr()` output to build the exact `old` string, including all `\n` and whitespace.

## Obsidian YAML Frontmatter Edits

Frontmatter lives between the `---` fences. For frontmatter-only changes, `patch` usually works on single lines. For multi-line frontmatter edits (e.g., adding multiple fields), use the string replacement pattern above.

## Wikilink Refactoring

When renaming or moving notes, wikilinks `[[Old Name]]` should be updated via direct string replacement across the entire vault. Obsidian does not auto-rewrite wikilinks when files are renamed via external tools.

```python
import os

vault_root = "/path/to/vault"
old_name = "Old Note"
new_name = "New Note"

for dirpath, _, filenames in os.walk(vault_root):
    for fname in filenames:
        if not fname.endswith(".md"):
            continue
        fpath = os.path.join(dirpath, fname)
        with open(fpath) as f:
            content = f.read()
        if old_name in content:
            new_content = content.replace(f"[[{old_name}]]", f"[[{new_name}]]")
            with open(fpath, "w") as f:
                f.write(new_content)
            print(f"Updated: {fpath}")
```
