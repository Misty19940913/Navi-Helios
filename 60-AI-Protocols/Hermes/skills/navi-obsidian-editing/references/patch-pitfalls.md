# Patching Pitfalls (session-learned)

## 1. `patch` tool truncates on partial-read files

**Problem**: `patch` was used on a file that had been read with `offset/limit` (partial view). The tool warned "was last read with offset/limit pagination (partial view). Re-read the whole file before overwriting it." but subsequent patches wrote the **new content** as if the partial-read state was the full file — losing everything outside the read window.

**Symptoms**:
- After a failed patch, changelog rows got `|` prefixes and `repr()` artifacts
- File ended up with malformed table syntax

**Workaround** (use in this order):
1. `terminal` + `python3 -c "..."` — most reliable for exact content inspection and multi-line replacement
2. `execute_code` — good for programmatic string replacement with explicit encoding
3. `patch` — only safe when the file was **never** partially read in that context window

## 2. Unicode/encoding in multi-line strings

Chinese characters in multiline strings passed to `patch`'s `old_string` parameter must be byte-exact. Use `python3 -c "repr(line)"` via terminal to get the exact string before patching.

## 4. Mass ID refactoring — execute_code, not patch chains

**Trigger**: 5+ replacements across a file (e.g. T6.1→T1, T6.2→T2, T4.3→T7, etc.)

**Correct approach**:
1. `read_file` full content
2. `execute_code` with `str.replace` loop or dict-mapping — all replacements in one Python call
3. `write_file` — single write back to disk

**Why not patch chains**: each patch reads from current disk state (not the in-memory state from the previous patch). After 3-4 patches the disk state diverges from expectations, causing mismatches or overwrite corruption. The file shown in this session developed duplicate YAML frontmatter and `>` prefix artifacts after a chain of partial reads + patches.

**Verification**: use `content.count(new_id)` spot-checks after write to confirm all replacements landed correctly.
