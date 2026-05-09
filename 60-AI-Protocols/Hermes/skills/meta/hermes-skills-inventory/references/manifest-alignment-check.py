#!/usr/bin/env python3
"""
Hermes Skills Manifest vs Disk Alignment Checker

Compares .bundled_manifest against actual SKILL.md frontmatter names.
Key insight: folder name may differ from frontmatter name — ground truth is always frontmatter `name:` field.

Usage: python3 references/manifest-alignment-check.py
"""
import re, os
from pathlib import Path

skills_dir = Path('/home/misty/.hermes/skills')
manifest = open(skills_dir / '.bundled_manifest').read().strip().split('\n')
bundled = set(line.split(':')[0] for line in manifest if line.strip())

disk_fm = {}
for root, dirs, files in os.walk(skills_dir, followlinks=True):
    dirs[:] = [d for d in dirs if d not in {'.git', '.github', '.hub', '__pycache__'}]
    if 'SKILL.md' not in files:
        continue
    rel = str(Path(root).relative_to(skills_dir))
    content = open(f'{skills_dir}/{rel}/SKILL.md', encoding='utf-8').read()
    m = re.match(r'---\s*\n(.*?)\n---', content, re.DOTALL)
    if m:
        for line in m.group(1).split('\n'):
            if line.startswith('name:'):
                disk_fm[line.split(':',1)[1].strip()] = rel

only_m = bundled - set(disk_fm.keys())
only_d = set(disk_fm.keys()) - bundled
print(f'Manifest: {len(bundled)} | Disk: {len(disk_fm)} | Gap: {len(only_m) + len(only_d)}')
print(f'Only manifest (deleted): {len(only_m)} → {sorted(only_m) if only_m else "none"}')
print(f'Only disk (unregistered): {len(only_d)} → {sorted(only_d) if only_d else "none"}')
if not only_m and not only_d:
    print('✓ ALIGNED')
