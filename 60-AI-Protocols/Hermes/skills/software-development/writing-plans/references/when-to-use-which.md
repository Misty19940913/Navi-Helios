# Planning Skill Selection Guide

Use this reference to pick the right planning skill for the task at hand.

---

## Quick Decision Tree

```
Is the task complex/multi-session requiring persistent progress tracking?
├── YES → planning-with-files (task_plan.md + findings.md + progress.md)
└── NO → plan or writing-plans (single markdown plan)
```

---

## Skill Comparison

| | `planning-with-files` | `plan` | `writing-plans` |
|---|---|---|---|
| **Output** | 3 files in project dir | 1 file in `.hermes/plans/` | 1 file (specified location) |
| **Structure** | task_plan + findings + progress | flat markdown | flat markdown with TDD tasks |
| **Use when** | 5+ tool calls, multi-session, research | quick single-session plan | code implementation with tests |
| **Save location** | `30_Projects/32_Active/<project>/` | `.hermes/plans/` | user-specified |
| **Session continuity** | high (progress persists) | low (one-shot) | low (one-shot) |

---

## When to Use `planning-with-files`

- Multi-session project with phases
- Research tasks that evolve over time
- Complex tasks requiring 5+ tool calls
- Tasks where you need to track: what was done, what was learned, what's next
- **Key indicator**: User says "keep track of progress" or "multi-stage task"

## When to Use `plan`

- Quick planning without needing persistent files
- Single-session execution plan
- Fallback when `planning-with-files` is not available

## When to Use `writing-plans`

- Code implementation with TDD cycle
- Bite-sized tasks (2-5 min each)
- When you need exact file paths + code + verification commands
- NOT for research or multi-session tracking

---

## Common Mistake to Avoid

> ❌ Using `writing-plans` for research/multi-session projects
> ✅ Using `planning-with-files` when task spans multiple sessions or requires progress tracking

---

## Location Convention (2026-05-09 established)

User's vault plans go to: `30_Projects/32_Active/<project>/`

Do NOT use `.hermes/plans/` — that is the fallback location only.
