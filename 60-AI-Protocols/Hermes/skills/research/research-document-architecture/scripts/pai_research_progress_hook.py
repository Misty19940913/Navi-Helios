#!/usr/bin/env python3
"""
PAI Research Progress Hook — called automatically after each cron batch.

VERIFICATION BEFORE ADVANCE: This script is the mechanism that prevents
the "progress.json says done but vault file missing" trap.

Usage (from cron job script= field):
  python3 ~/.hermes/scripts/pai_research_progress_hook.py <current_index> <expected_report_name>

Environment:
  VAULT_PROGRESS   — path to .research_progress.json
  REPORTS_DIR      — path to output vault directory

The hook:
  1. Verifies the report file exists AND has >500 bytes
  2. Only advances progress.json if verification passes
  3. Exits with code 1 if verification fails (cron job marked failed)

This replaces manual LLM-based progress updates, which were prone to
claiming success before the file write actually landed on disk.
"""

import json
import os
import sys
from pathlib import Path

VAULT_PROGRESS = Path("/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/30_Projects/32_Active/Life-OS/PAI_Research/.research_progress.json")
REPORTS_DIR = Path("/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios/30_Projects/32_Active/Life-OS/PAI_Research")

TASK_MAP = {
    0:  ("T01", "T01_Root_Docs.md"),
    1:  ("T02", "T02_Packs_SKILL.md"),
    2:  ("T03", "T03_ClaudeSkills_SKILL.md"),
    3:  ("T04", "T04_Workflows.md"),
    4:  ("T05", "T05_Fabric_Patterns.md"),
    5:  ("T06", "T06_Hook_TypeScript.md"),
    6:  ("T07", "T07_Packs_Install_Verify.md"),
    7:  ("T08", "T08_ISA_System.md"),
    8:  ("T09", "T09_Interview_System.md"),
    9:  ("T10", "T10_CLAUDE_Routing.md"),
    10: ("T11", "T11_Memory_System.md"),
    11: ("T12", "T12_ALGORITHM.md"),
    12: ("T13", "T13_USER_Identity.md"),
    13: ("T14", "T14_PULSE.md"),
    14: ("T15", "T15_DA_IDENTITY.md"),
    15: ("T16", "T16_Agents_Pack.md"),
    16: ("T17", "T17_Council_Pack.md"),
    17: ("T18", "T18_Research_Pack.md"),
    18: ("T19", "T19_CreateSkill_Pack.md"),
    19: ("T20", "T20_Science_Pack.md"),
    20: ("T21", "T21_Art_Pack.md"),
    21: ("T22", "T22_Thinking_Skills.md"),
    22: ("T23", "T23_WriteStory_Pack.md"),
    23: ("T24", "T24_Webdesign_Pack.md"),
    24: ("T25", "T25_Remotion_Pack.md"),
    25: ("T26", "T26_PAI_CORE_TS.md"),
    26: ("T27", "T27_Tools_PY.md"),
    27: ("T28", "T28_Remaining_Packs.md"),
    28: ("T29", "T29_v5_DOCUMENTATION.md"),
    29: ("T30", "T30_Install_Verify_System.md"),
}

def load_progress():
    if not VAULT_PROGRESS.exists():
        return {"current_index": 0, "completed": [], "status": "IN_PROGRESS"}
    with open(VAULT_PROGRESS, "r", encoding="utf-8") as f:
        return json.load(f)

def save_progress(data):
    tmp = VAULT_PROGRESS.with_suffix(".json.tmp")
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    tmp.replace(VAULT_PROGRESS)

def verify_report(report_name):
    """Verify report exists with substantial content (>500 bytes)."""
    path = REPORTS_DIR / report_name
    if not path.exists():
        return False, f"File does not exist: {path}"
    size = path.stat().st_size
    if size < 500:
        return False, f"File too small ({size} bytes): {path}"
    return True, f"OK ({size} bytes)"

def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <current_index> <expected_report_name>")
        sys.exit(1)

    current_index = int(sys.argv[1])
    expected_report = sys.argv[2]

    task_info = TASK_MAP.get(current_index, (None, expected_report))
    tid, canonical_name = task_info

    print(f"[Progress Hook] index={current_index} tid={tid} expected={expected_report}")

    # Physical verification
    ok, msg = verify_report(expected_report)
    print(f"[Progress Hook] Verification: {msg}")

    progress = load_progress()

    if ok:
        if tid and tid not in progress["completed"]:
            progress["completed"].append(tid)
        progress["current_index"] = current_index + 1
        if progress["current_index"] >= 30:
            progress["status"] = "COMPLETED"
            progress["completed_at"] = "2026-05-08"
        save_progress(progress)
        print(f"[Progress Hook] Advanced: index → {current_index + 1}")
    else:
        # Verification failed — do NOT advance
        save_progress(progress)
        print(f"[Progress Hook] BLOCKED — file missing/invalid, stayed at index={progress['current_index']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
