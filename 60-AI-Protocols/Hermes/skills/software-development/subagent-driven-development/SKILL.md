---
name: subagent-driven-development
description: "Execute plans via delegate_task subagents (2-stage review)."
version: 1.1.0
author: Hermes Agent (adapted from obra/superpowers)
license: MIT
trigger:
  when:
    - User provides an implementation plan or asks to execute a plan
    - User says "execute", "run the plan", "dispatch tasks", "delegate tasks"
    - User asks to use subagents to implement something
  env:
    plan_file: path to plan file (optional — if not provided, user must supply full task list)
  skills:
    - writing-plans
    - requesting-code-review
    - test-driven-development
  metadata:
    hermes:
      tags: [delegation, subagent, implementation, workflow, parallel]
      related_skills: [writing-plans, requesting-code-review, test-driven-development]
---

# Subagent-Driven Development

## Overview

Execute implementation plans by dispatching fresh subagents per task with systematic two-stage review.

**Core principle:** Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.

## When to Use

Use this skill when:
- You have an implementation plan (from writing-plans skill or user requirements)
- Tasks are mostly independent
- Quality and spec compliance are important
- You want automated review between tasks

**vs. manual execution:**
- Fresh context per task (no confusion from accumulated state)
- Automated review process catches issues early
- Consistent quality checks across all tasks
- Subagents can ask questions before starting work

## The Process

### 1. Read and Parse Plan

Read the plan file. Extract ALL tasks with their full text and context upfront. Create a todo list:

```python
# Read the plan
read_file("docs/plans/feature-plan.md")

# Create todo list with all tasks
todo([
    {"id": "task-1", "content": "Create User model with email field", "status": "pending"},
    {"id": "task-2", "content": "Add password hashing utility", "status": "pending"},
    {"id": "task-3", "content": "Create login endpoint", "status": "pending"},
])
```

**Key:** Read the plan ONCE. Extract everything. Don't make subagents read the plan file — provide the full task text directly in context.

### 2. Per-Task Workflow

For EACH task in the plan:

#### Step 1: Dispatch Implementer Subagent

Use `delegate_task` with complete context:

```python
delegate_task(
    goal="Implement Task 1: Create User model with email and password_hash fields",
    context="""
    TASK FROM PLAN:
    - Create: src/models/user.py
    - Add User class with email (str) and password_hash (str) fields
    - Use bcrypt for password hashing
    - Include __repr__ for debugging

    FOLLOW TDD:
    1. Write failing test in tests/models/test_user.py
    2. Run: pytest tests/models/test_user.py -v (verify FAIL)
    3. Write minimal implementation
    4. Run: pytest tests/models/test_user.py -v (verify PASS)
    5. Run: pytest tests/ -q (verify no regressions)
    6. Commit: git add -A && git commit -m "feat: add User model with password hashing"

    PROJECT CONTEXT:
    - Python 3.11, Flask app in src/app.py
    - Existing models in src/models/
    - Tests use pytest, run from project root
    - bcrypt already in requirements.txt
    """,
    toolsets=['terminal', 'file']
)
```

#### Step 2: Dispatch Spec Compliance Reviewer

After the implementer completes, verify against the original spec:

```python
delegate_task(
    goal="Review if implementation matches the spec from the plan",
    context="""
    ORIGINAL TASK SPEC:
    - Create src/models/user.py with User class
    - Fields: email (str), password_hash (str)
    - Use bcrypt for password hashing
    - Include __repr__

    CHECK:
    - [ ] All requirements from spec implemented?
    - [ ] File paths match spec?
    - [ ] Function signatures match spec?
    - [ ] Behavior matches expected?
    - [ ] Nothing extra added (no scope creep)?

    OUTPUT: PASS or list of specific spec gaps to fix.
    """,
    toolsets=['file']
)
```

**If spec issues found:** Fix gaps, then re-run spec review. Continue only when spec-compliant.

#### Step 3: Dispatch Code Quality Reviewer

After spec compliance passes:

```python
delegate_task(
    goal="Review code quality for Task 1 implementation",
    context="""
    FILES TO REVIEW:
    - src/models/user.py
    - tests/models/test_user.py

    CHECK:
    - [ ] Follows project conventions and style?
    - [ ] Proper error handling?
    - [ ] Clear variable/function names?
    - [ ] Adequate test coverage?
    - [ ] No obvious bugs or missed edge cases?
    - [ ] No security issues?

    OUTPUT FORMAT:
    - Critical Issues: [must fix before proceeding]
    - Important Issues: [should fix]
    - Minor Issues: [optional]
    - Verdict: APPROVED or REQUEST_CHANGES
    """,
    toolsets=['file']
)
```

**If quality issues found:** Fix issues, re-review. Continue only when approved.

#### Step 4: Mark Complete

```python
todo([{"id": "task-1", "content": "Create User model with email field", "status": "completed"}], merge=True)
```

### 3. Final Review

After ALL tasks are complete, dispatch a final integration reviewer:

```python
delegate_task(
    goal="Review the entire implementation for consistency and integration issues",
    context="""
    All tasks from the plan are complete. Review the full implementation:
    - Do all components work together?
    - Any inconsistencies between tasks?
    - All tests passing?
    - Ready for merge?
    """,
    toolsets=['terminal', 'file']
)
```

### 4. Verify and Commit

```bash
# Run full test suite
pytest tests/ -q

# Review all changes
git diff --stat

# Final commit if needed
git add -A && git commit -m "feat: complete [feature name] implementation"
```

## Task Granularity

**Each task = 2-5 minutes of focused work.**

**Too big:**
- "Implement user authentication system"

**Right size:**
- "Create User model with email and password fields"
- "Add password hashing function"
- "Create login endpoint"
- "Add JWT token generation"
- "Create registration endpoint"

## Orchestrator Review Gate (MANDATORY — Never Skip)

**The orchestrator MUST review subagent output before committing or delivering.** Subagent self-reports are not sufficient. This is a distinct gate from the subagent's own internal review process.

**The failed pattern (2026-04-27 navi-calendar session):**
```
delegate_task (9 scopes) → subagent implements → commit+push → user finds 6 critical bugs still present
```
**Root cause:** Subagent addressed its own understanding of the requirements, but the coordinator never verified the modified files against the original 6-bug list. The subagent fixed "expand icon" and "priority regex" — items not in the original 6-bug list.

**Correct pattern:**
```
delegate_task → subagent implements → ORCHESTRATOR reads actual files → verify against original requirements → commit+push
```

**Orchestrator review checklist before commit:**

For navi-calendar-style plugin development:
- [ ] Read the actual modified TypeScript files (not just subagent's summary table)
- [ ] For each original requirement/bug, find the specific code that addresses it
- [ ] Run `tsc -noEmit --skipLibCheck` to confirm no type errors
- [ ] Run `npm run build` → verify `main.js` mtime is "now" (not cached)
- [ ] Search for the specific method names mentioned in requirements (`updateTask`, `createTask`, `loadDependencies`, etc.)
- [ ] Confirm `import` statements are at the top of files (not bottom — a common TS pattern error)
- [ ] Confirm new `Blocking`/`Notice`/`Setting` imports were added when new code uses them
- [ ] Check `types.ts` for duplicate interface definitions
- [ ] THEN commit and push

**Generic checklist (all subagent tasks):**
- [ ] Read the actual modified files (not just subagent's summary)
- [ ] Verify each original requirement is addressed by finding the specific code
- [ ] Run build/compile step to confirm no errors
- [ ] Confirm no regression in unchanged files
- [ ] THEN commit and push

**What "read the files" actually means:**
- Open each modified file in the editor
- Scroll to the sections that should have changed
- Read the actual code — don't trust the subagent's description of the code
- Ask: "Does this code actually do what the requirement says?"

**If the orchestrator skips this gate:** Bugs reach production, users notice, rework required. The user's direct complaint (2026-04-27): "在提交任務成果之前你應該就要有一個審查，而不是寫完代碼就直接交出來"

## Pitfall: Delegated File-Output Tasks Need Physical Verification

When delegating tasks that produce file outputs (research reports, generated documents, batch analysis), the **orchestrator MUST physically verify file existence** before marking complete — not trust the subagent's self-report.

**The silent-failure pattern (observed 2026-05-08, PAI Research session):**
```
1. LLM subagent analyzes source files, writes report, claims "complete"
2. Progress tracker (progress.json) updates to "done"
3. Actual file write FAILED (unquoted path with spaces → shell command failed silently)
4. Progress shows done, vault has no file
5. Next batch starts from wrong index → duplicated work or gaps
```

**Root cause**: The delegation prompt didn't include a verification step. The subagent reported success based on its internal write attempt, not actual filesystem state.

**Required verification protocol for any delegated file-output task:**

```python
# After subagent reports completion:
# 1. Verify file exists at expected path
result = terminal(f'ls -la "{expected_path}"')
assert result.exit_code == 0, "File not found"

# 2. Verify non-zero size
size = int(result.stdout.split()[4])
assert size > 500, f"File too small: {size} bytes"

# 3. Verify header matches expected content
content = read_file(expected_path)
assert content.startswith(expected_header), "Wrong file content"
```

**Special case — WSL + OneDrive paths with spaces:**
- Always quote paths in shell commands: `"$path"` not `$path`
- Verify both existence AND content — a zero-byte file will `ls` fine but is invalid
- OneDrive sync can lag — if write succeeds but sync hasn't propagated, `ls` may show stale state

**Orchestrator review gate for file-output tasks now includes:**
- [ ] Read the actual output file (not just subagent's summary)
- [ ] Confirm file size > minimum threshold (typically 500 bytes)
- [ ] Confirm file starts with expected header/magic bytes
- [ ] For batch tasks: verify progress tracker matches actual files on disk

---

## Red Flags — Never Do These

- Start implementation without a plan
- Skip reviews (spec compliance OR code quality)
- Proceed with unfixed critical/important issues
- Dispatch multiple implementation subagents for tasks that touch the same files
- Make subagent read the plan file (provide full text in context instead)
- Skip scene-setting context (subagent needs to understand where the task fits)
- Ignore subagent questions (answer before letting them proceed)
- Accept "close enough" on spec compliance
- Skip review loops (reviewer found issues → implementer fixes → review again)
- Let implementer self-review replace actual review (both are needed)
- **Start code quality review before spec compliance is PASS** (wrong order)
- Move to next task while either review has open issues
- **Commit subagent output without orchestrator reading the changed files first** (the orchestrator's review gate is separate from the subagent's internal review)

## Handling Issues

### If Subagent Asks Questions

- Answer clearly and completely
- Provide additional context if needed
- Don't rush them into implementation

### If Reviewer Finds Issues

- Implementer subagent (or a new one) fixes them
- Reviewer reviews again
- Repeat until approved
- Don't skip the re-review

### If Subagent Fails a Task

- Dispatch a new fix subagent with specific instructions about what went wrong
- Don't try to fix manually in the controller session (context pollution)

## Efficiency Notes

**Why fresh subagent per task:**
- Prevents context pollution from accumulated state
- Each subagent gets clean, focused context
- No confusion from prior tasks' code or reasoning

**Why two-stage review:**
- Spec review catches under/over-building early
- Quality review ensures the implementation is well-built
- Catches issues before they compound across tasks

**Cost trade-off:**
- More subagent invocations (implementer + 2 reviewers per task)
- But catches issues early (cheaper than debugging compounded problems later)

## Integration with Other Skills

### With writing-plans

This skill EXECUTES plans created by the writing-plans skill:
1. User requirements → writing-plans → implementation plan
2. Implementation plan → subagent-driven-development → working code

### With test-driven-development

Implementer subagents should follow TDD:
1. Write failing test first
2. Implement minimal code
3. Verify test passes
4. Commit

Include TDD instructions in every implementer context.

### With requesting-code-review

The two-stage review process IS the code review. For final integration review, use the requesting-code-review skill's review dimensions.

### With systematic-debugging

If a subagent encounters bugs during implementation:
1. Follow systematic-debugging process
2. Find root cause before fixing
3. Write regression test
4. Resume implementation

## Example Workflow

```
[Read plan: docs/plans/auth-feature.md]
[Create todo list with 5 tasks]

--- Task 1: Create User model ---
[Dispatch implementer subagent]
  Implementer: "Should email be unique?"
  You: "Yes, email must be unique"
  Implementer: Implemented, 3/3 tests passing, committed.

[Dispatch spec reviewer]
  Spec reviewer: ✅ PASS — all requirements met

[Dispatch quality reviewer]
  Quality reviewer: ✅ APPROVED — clean code, good tests

[Mark Task 1 complete]

--- Task 2: Password hashing ---
[Dispatch implementer subagent]
  Implementer: No questions, implemented, 5/5 tests passing.

[Dispatch spec reviewer]
  Spec reviewer: ❌ Missing: password strength validation (spec says "min 8 chars")

[Implementer fixes]
  Implementer: Added validation, 7/7 tests passing.

[Dispatch spec reviewer again]
  Spec reviewer: ✅ PASS

[Dispatch quality reviewer]
  Quality reviewer: Important: Magic number 8, extract to constant
  Implementer: Extracted MIN_PASSWORD_LENGTH constant
  Quality reviewer: ✅ APPROVED

[Mark Task 2 complete]

... (continue for all tasks)

[After all tasks: dispatch final integration reviewer]
[Run full test suite: all passing]
[Done!]
```

## Remember

```
Fresh subagent per task
Two-stage review every time
Spec compliance FIRST
Code quality SECOND
Never skip reviews
Catch issues early
```

**Quality is not an accident. It's the result of systematic process.**

## Further reading (load when relevant)

When the orchestration involves significant context usage, long review loops, or complex validation checkpoints, load these references for the specific discipline:

- **`references/context-budget-discipline.md`** — Four-tier context degradation model (PEAK / GOOD / DEGRADING / POOR), read-depth rules that scale with context window size, and early warning signs of silent degradation. Load when a run will clearly consume significant context (multi-phase plans, many subagents, large artifacts).
- **`references/gates-taxonomy.md`** — The four canonical gate types (Pre-flight, Revision, Escalation, Abort) with behavior, recovery, and examples. Load when designing or reviewing any workflow that has validation checkpoints — use the vocabulary explicitly so each gate has defined entry, failure behavior, and resumption rules.

Both references adapted from gsd-build/get-shit-done (MIT © 2025 Lex Christopherson).
