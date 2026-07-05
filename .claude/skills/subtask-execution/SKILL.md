---
name: subtask-execution
description: Canonical DEV-phase subtask loop — TDD ordering, per-type checklists, self-review, compliance pass, exit-gate evidence. Loaded by /sk:dev and /sk:implement; not invoked directly.
disable-model-invocation: true
---

# Subtask Execution

The single source of truth for executing a task's subtasks during the DEV phase.
`/sk:dev` and `/sk:implement` both follow this loop; `/sk:orchestrate` delegates it
to implementer subagents instead.

## Load Conventions and Skills First

Before the first subtask, read:
- `docs/conventions/code-style.md`, `file-structure.md`, `testing.md`
- `.claude/skills/test-driven-development/SKILL.md` (and its `anti-patterns.md`)
- `.claude/skills/escalation-rules/SKILL.md`

**Skip convention files that are empty or contain only template placeholders.**
If conventions aren't configured, match patterns found in the existing codebase.

## Execution Order (TDD)

Process subtasks **top-to-bottom, one at a time**. For each feature unit, execute the
`[TEST]` subtask BEFORE its paired `[DEV]` subtask:

1. `[TEST]` Write failing test → run → confirm RED (paste output)
2. `[DEV]` Implement to pass → run → confirm GREEN (paste output)
3. Refactor → run → confirm still GREEN (paste output)

If a subtask fails 3+ times, follow the `escalation-rules` skill: STOP, evaluate options, ask the user.

## Per-Type Checklists

### For each `[DEV]` subtask:

1. **Read the subtask** — understand exactly what to implement
2. **Check conventions** — reference `docs/conventions/code-style.md` for patterns
3. **Implement** — exactly what the subtask describes, no more, no less; simplest approach that satisfies the requirement
4. **Self-review** before checking the box:
   - Follows naming conventions?
   - File in correct location per `docs/conventions/file-structure.md`?
   - Error handling in place?
   - No hardcoded values, magic numbers, or leftover TODOs?
   - No unused imports?
   - No drive-by changes outside this subtask's scope?
   - Is this the simplest solution, or did you over-engineer it?
5. **Check the box** — mark subtask complete in the task file

### For each `[TEST]` subtask:

1. **Read** `docs/conventions/testing.md` for test patterns
2. **Write tests** following AAA pattern (Arrange, Act, Assert)
3. **Run tests** — confirm they pass
4. **Check the box**

### For each `[DOCS]` subtask:

1. **Identify what changed** — schema? APIs? architecture? components?
2. **Update the specific docs** listed in the subtask
3. **Verify links** — make sure cross-references still work
4. **Check the box**

## Convention Compliance Pass (after all subtasks)

```markdown
### Code Conventions (docs/conventions/code-style.md)
- [ ] Naming follows project conventions (camelCase, PascalCase, etc.)
- [ ] Import order is correct (external > internal > relative)
- [ ] Boolean variables use is/has/can/should prefix
- [ ] Early returns used instead of deep nesting
- [ ] Comments explain WHY, not WHAT
- [ ] No magic numbers — constants extracted and named

### File Structure (docs/conventions/file-structure.md)
- [ ] New files placed in correct directories
- [ ] Co-location principle followed (related files together)
- [ ] Public API exports updated if applicable
- [ ] No file exceeds soft size limits

### Git Workflow (docs/conventions/git-workflow.md)
- [ ] Commit messages follow format: type(scope): description
- [ ] Commits are atomic (one logical change each)
- [ ] No temporary or debug code committed
```

**Tip:** For a deeper analysis, run `/sk:code-review` on the changes before the TEST phase.

## DEV Exit Gate (evidence required)

Read `.claude/skills/verification-before-completion/SKILL.md` before claiming done.
You MUST run the actual test suite and paste the output. "Tests pass" is not evidence.

All conditions must be true:

```markdown
- [ ] All `[DEV]` subtasks checked off
- [ ] All `[TEST]` subtasks checked off
- [ ] All `[DOCS]` subtasks checked off
- [ ] Code self-reviewed against conventions
- [ ] All existing tests still pass (no regressions)
- [ ] Documentation updated in same commit as code
```
