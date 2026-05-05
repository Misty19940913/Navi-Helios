# Pattern: pat-09e11a0c2af7
**Tool:** terminal  
**Type:** logic_error  
**Count:** 1  
**Status:** pending  
**First seen:** 2026-05-05T02:54:14.669574+00:00  
**Last seen:** 2026-05-05T02:54:14.669574+00:00

## Summary
Logic error in terminal: {"output": "def get_available_skills() -> Dict[str, List[str]]:\n    \"\"\"Return skills grouped by category, filtered b

## Error hashes
- e041789b494119b4

## Last error
```
Error Type: logic_error
Tool Args: {'command': "sed -n '99,140p' ~/.hermes/hermes-agent/hermes_cli/banner.py"}

--- Error Output (last 30 lines) ---
{"output": "def get_available_skills() -> Dict[str, List[str]]:\n    \"\"\"Return skills grouped by category, filtered by platform and disabled state.\n\n    Delegates to ``_find_all_skills()`` from ``tools/skills_tool`` which already\n    handles platform gating (``platforms:`` frontmatter) and respects the\n    user's ``skills.disabled`` config list.\n    \"\"\"\n    try:\n        from tools.skills_tool import _find_all_skills\n        all_skills = _find_all_skills()  # already filtered\n    except Exception:\n        return {}\n\n    skills_by_category: Dict[str, List[str]] = {}\n    for skill in all_skills:\n        category = skill.get(\"category\") or \"general\"\n        skills_by_category.setdefault(category, []).append(skill[\"name\"])\n    return skills_by_category\n\n\n# ==========================================================
```
