# Pattern: pat-2047fdebf9cf
**Tool:** execute_code  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-09T07:29:54.138636+00:00  
**Last seen:** 2026-05-09T07:29:54.138636+00:00

## Summary
Tool error in execute_code: {"status": "error", "output": "\n--- stderr ---\n  File \"/tmp/hermes_sandbox_g_g1prgg/script.py\", line 23\n    原创行 = [

## Error hashes
- e3110ab9113555cf

## Last error
```
Error Type: tool_error
Tool Args: {'code': 'from pathlib import Path\nimport re\n\nvault_root = Path("/mnt/c/Users/安泰/OneDrive/Obsidian/Navi Helios")\nmoc_dir = vault_root / "40_Knowledge/42_MOC"\natomic_dir = vault_root / "40_Knowledge/41_原子知識"\n\n# 現有 atomic notes 主題關鍵字（蒸餾時不能重複）\natomic_themes = set()\nfor f in atomic_dir.rglob("*.md"):\n    atomic_themes.add(f.stem.split(\'_\')[0])  # 取 K-XXX 前綴\n\nmoc_files = sorted(moc_dir.glob("*.md"))\n\nprint("=== MOC 內容摘要（快速掃描）===\\n")\nfor moc in moc_files:\n    if moc.stem == "index":\n        continue\n    content = moc.read_text(encoding=\'utf-8\')\n    lines = [l for l in content.split(\'\\n\') if l.strip() and not l.strip().startswith(\'|\') and not l.strip().startswith(\'-\')]\n    non_table_lines = [l for l in content.split(\'\\n\') if l.strip() and not l.strip().startswith(\'|\')]\n    # 表格行之外的原創內容行數\n   原创行 = [l for l in non_table_lines if not l.startswith(\'##\') and not l.startswith(\'```\')]\n    print(f"【{moc.stem}】")\n    print(
```
