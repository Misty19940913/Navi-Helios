---
name: research-document-architecture
description: "Multi-batch document research pipeline — organize large source analysis into sequential typed-reports with progress tracking and write verification."
version: 1.0.0
author: Hermes Agent (Navi)
license: MIT
trigger:
  when:
    - User asks to analyze or research multiple categories/sets of source files
    - User says "research", "analyze all files", "batch analysis", "typed reports"
    - User sets up a recurring research job that produces multiple output files
  env:
    source_root: "Base path for source files to analyze"
    output_vault: "Obsidian vault path for output reports"
    progress_file: "Path to .research_progress.json"
    master_index: "Path to 00_框架索引.md or equivalent"
  skills:
    - systematic-debugging
    - subagent-driven-development
  metadata:
    hermes:
      tags: [research, batch-analysis, typed-reports, progress-tracking, cron]
      related_skills: [systematic-debugging, subagent-driven-development]
      priority: high
---

# Research Document Architecture

## Overview

When you need to analyze large, heterogeneous source codebases into multiple structured typed-reports, use this pipeline. It breaks the work into sequential batches, tracks progress, and ensures every output file is verified before advancing.

**Core principle:** Progress advances ONLY when the output file is physically confirmed on disk — never on self-reported completion.

## When to Use

- Large codebase audits requiring categorized reports (e.g., "analyze all packs into T01-T30 typed reports")
- Recurring research jobs (cron) that produce sequential outputs
- Any task where N independent reports must be produced from M source file groups

**Not for:** Single-shot research queries (use normal research skills), one-off file analysis (use terminal + read_file directly)

## The Pipeline

### Phase 1: Design the Typed-Report Schema

Before collecting files, define the report structure:

```markdown
# T{XX} — {Group Name}

> 組ID：T{XX}
> 來源：{glob_patterns}
> 檔案總數：{N}
> 採樣分析：{M} 個
> 優先級：{high/medium/low}

---

## 檔案結構分析

## 內容差異分析

## 核心機制

## 關聯檔案

## 與 Life-OS 的借鑒點

## 檔案清單
```

Each report type has:
- A fixed template (consistent across all batches)
- A unique ID (T01, T02, ...)
- A defined source glob pattern
- A specific output filename

### Phase 2: Set Up Progress Tracking

Create `.research_progress.json`:

```json
{"current_index": 0, "completed": [], "status": "IN_PROGRESS"}
```

Create `00_框架索引.md` with one row per batch:
```
| T01 | Group Name | ⬜ | — |
```

### Phase 3: Batch Execution Loop

For each batch (current_index → N):

```
1. Read current_index from progress.json
2. Look up batch definition (ID, name, paths, output filename)
3. Collect source files (find/glob)
4. Sample if >100 files
5. Read and analyze sampled files
6. Write output report to vault
7. PHYSICAL VERIFICATION (see below)
8. Update progress.json ONLY if verified
9. Update master index marking ✅
10. Increment current_index
```

### Phase 4: Write Verification (MANDATORY)

**This is the most critical step. Skip it and the pipeline WILL produce silent gaps.**

After writing the report file:

```python
# Step 1: Check file exists and has content
result = terminal(f'ls -la "{output_path}"')
assert result.exit_code == 0, f"File not written: {output_path}"

# Step 2: Check size
size = int(result.stdout.split()[4])
assert size > 500, f"File too small ({size} bytes): {output_path}"

# Step 3: Check header
content = read_file(output_path)
expected_header = f"# T{tid}"
assert content.startswith(expected_header), f"Wrong file header in {output_path}"
```

**Why this matters (observed 2026-05-08):**
- LLM subagent reported "T14 complete" after analysis
- Progress.json advanced to current_index=15
- Actual file was NEVER written (path with spaces failed silently)
- Next cron run started at T15, leaving T14 permanently missing
- Gap only discovered weeks later during manual vault audit

### Phase 5: Progress Update (Script Hook)

**Do NOT let the LLM manually update progress.json.** Instead, use a script hook:

```python
# pai_research_progress_hook.py
# Called after each batch with: python3 hook.py <current_index> <output_filename>

def main():
    idx = int(sys.argv[1])
    filename = sys.argv[2]
    
    # Verify output file
    ok, msg = verify_report(filename)
    
    progress = load_progress()
    if ok:
        progress["current_index"] = idx + 1
        tid = TASK_MAP[idx][0]
        if tid not in progress["completed"]:
            progress["completed"].append(tid)
        save_progress(progress)
    else:
        # Don't advance — file wasn't written
        print(f"VERIFICATION FAILED: {msg}")
        sys.exit(1)
```

This prevents the "progress advanced but file missing" trap.

## WSL + OneDrive Path Pitfalls

When vault path contains spaces (`Navi Helios`) and lives on OneDrive:

1. **Always quote paths** in terminal commands: `"$path"` not `$path`
2. **OneDrive sync lag**: `ls` may return stale results if OneDrive is mid-sync. If write verification fails but you're sure the path is correct, retry after 2-3 seconds.
3. **Path canonicalization**: Use `/mnt/c/Users/...` format in scripts, not WSL-style `/home/misty/...` for Windows paths
4. **Concurrent writes**: If cron job and manual session both write to the same vault, OneDrive may create conflict copies (`~filename~`). Handle this in verification.

## Cron Job Setup

For recurring research pipelines:

```yaml
schedule: "*/30 * * * *"  # or appropriate interval
script: "python3 ~/.hermes/scripts/pai_research_progress_hook.py"
skills: []  # Empty — do NOT attach non-existent skills
workdir: "/home/misty/.hermes/scripts"
deliver: "origin"
```

**Never attach skills that don't exist.** The cron runner will skip them with a warning, but the job will still run. However, if the skill name is referenced in the prompt as a dependency, this creates confusion.

## Master Index Format

```markdown
# {Project} 框架索引

> 追蹤研究進度，{N} 組任務完成狀態。

## 進度總覽

| 組ID | 名稱 | 狀態 | 完成時間 |
|------|------|------|---------|
| T01 | Group Name | ✅ | 2026-05-08 |
| T02 | Group Name | ⬜ | — |

## 研究完成度

**已完成：{X} / {N} ({pct})**

*最後更新：{timestamp}*
```

## Quality Gates

| Gate | Checkpoint | Failure Action |
|------|-----------|----------------|
| Pre-flight | Source files exist | Abort if glob returns 0 files |
| Write | File written + size > 500 | Retry once, then abort batch |
| Content | Header matches expected | Re-write, do not advance progress |
| Progress | Progress.json updated | Verify with read_file, not self-report |
| Index | Master index marked ✅ | Manual verification after all batches |

## Session Memory Integration

After completing a research pipeline session:
- Note any source patterns that didn't match expectations
- Record which batch took longest (heuristic for complexity)
- Flag any source file types that need special handling
- Update this skill's pitfalls section with new failure modes

## Case Study

- `references/pai-research-case-study.md` — 2026-05-08 session: PAI 30-report analysis, parallel folder discovery, index rot detection, physical verification vs self-reported completion. Directly relevant to pipelines that span long sessions where LLM may be both orchestrator and executor.

## Anti-Patterns

- **Self-reported completion**: "The agent said it wrote the file" → ALWAYS verify physically
- **Unverified progress advancement**: Updating progress.json before confirming file write
- **Skipping the 500-byte minimum**: Empty or near-empty files are invalid outputs
- **Attaching non-existent skills**: Creates confusion and job startup warnings
- **Unquoted paths with spaces**: Silent failure in shell commands
- **OneDrive sync lag ignored**: Writes may succeed locally but not be visible to subsequent reads
