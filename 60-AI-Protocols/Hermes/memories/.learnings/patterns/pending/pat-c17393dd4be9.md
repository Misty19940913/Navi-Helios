# Pattern: pat-c17393dd4be9
**Tool:** terminal  
**Type:** tool_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T10:18:28.913378+00:00  
**Last seen:** 2026-05-05T10:18:28.913378+00:00

## Summary
Tool error in terminal: {"output": "Total skills: 114\nHas composition[]:        0 (0%)\nHas required_primitives[]: 25 (21%)\nHas trigger:      

## Error hashes
- 2e7dda4b10e0b61c

## Last error
```
Error Type: tool_error
Tool Args: {'command': 'python3 << \'EOF\'\nimport os, re\nfrom pathlib import Path\n\nskills_dir = Path(\'/home/misty/.hermes/skills\')\nEXCL = {\'.git\', \'.github\', \'.hub\', \'__pycache__\'}\n\nresults = []\nfor root, dirs, files in os.walk(skills_dir, followlinks=True):\n    dirs[:] = [d for d in dirs if d not in EXCL]\n    if \'SKILL.md\' not in files:\n        continue\n    rel = str(Path(root).relative_to(skills_dir))\n    try:\n        content = open(os.path.join(root, \'SKILL.md\'), encoding=\'utf-8\').read()\n    except:\n        content = open(os.path.join(root, \'SKILL.md\')).read()\n\n    fm = {}\n    body_start = 0\n    m = re.match(r\'---\\s*\\n(.*?)\\n---\', content, re.DOTALL)\n    if m:\n        for line in m.group(1).split(\'\\n\'):\n            if \':\' in line:\n                k, v = line.split(\':\', 1)\n                fm[k.strip()] = v.strip()\n        body_start = m.end()\n\n    name = fm.get(\'name\', Path(root).name)\n    composition
```
