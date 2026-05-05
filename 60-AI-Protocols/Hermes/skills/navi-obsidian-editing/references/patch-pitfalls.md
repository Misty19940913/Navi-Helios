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

## 3. `str.count()` is not a reliable replacement counter

If a pattern appears multiple times with slight variations, `str.count()` before replacement will give the wrong count. Always print before/after line numbers when iterating over multiple replacements.
