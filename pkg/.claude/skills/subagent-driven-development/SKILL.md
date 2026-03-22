# Skill: Subagent-Driven Development

> **Pattern:** Dispatch a fresh subagent per subtask with two-stage review.

## When This Skill Is Active

This skill is opt-in. It activates when:
- The user chooses subagent mode during `/sk:dev` or `/sk:implement`
- Recommended for tasks with 5+ subtasks or long sessions where context pollution is a risk

## How the Orchestrator Asks

At the start of `/sk:dev`, if the task has 5+ subtasks:

> "This task has N subtasks. Use subagent mode? Each subtask gets a fresh agent with clean context. (Recommended for large tasks to prevent context drift.)"

If the user says yes, follow this skill's pattern. If no, continue with direct execution.

## Dispatch Pattern

For each subtask pair ([TEST] + [DEV]):

### 1. Prepare Context Package

The orchestrator assembles a context package for the implementer:
- Subtask spec (description, file paths, expected outcome)
- Relevant acceptance criteria
- `docs/conventions/code-style.md`
- `docs/conventions/testing.md`
- `.claude/skills/test-driven-development/SKILL.md`
- For brownfield: full existing files being modified, related test files, `docs/system/project-context.md`, 2-3 examples of similar patterns

### 2. Dispatch Implementer

Use the Agent tool to dispatch `.claude/agents/implementer.md` with the context package.

The implementer works in isolation and reports one of:
- **DONE** — Subtask complete, all checks pass. Continue to review.
- **DONE_WITH_CONCERNS** — Complete but flagging potential issues. Review the concerns.
- **NEEDS_CONTEXT** — Missing information. Orchestrator provides it and re-dispatches.
- **BLOCKED** — Cannot proceed. Requires human decision.

### 3. Two-Stage Review

After the implementer reports DONE or DONE_WITH_CONCERNS:

**Stage 1: Spec Compliance**
- Dispatch `.claude/agents/spec-reviewer.md`
- Checks: does code match what the subtask asked for?
- Output: PASS or FAIL with specific findings

**Stage 2: Code Quality** (only if Stage 1 passes)
- Dispatch `.claude/agents/quality-reviewer.md`
- Checks: conventions, test quality, simplicity
- Output: Critical / Important / Suggestions

### 4. Handle Review Results

- If both pass: check off subtask, move to next
- If spec review fails: feed findings back, re-dispatch implementer (max 2 retries)
- If quality review has Critical issues: fix and re-review
- If quality review has only Suggestions: note them, proceed

## Model Selection (Optional)

When dispatching agents, use the cheapest model that can handle each role:
- **Implementer:** `model: "sonnet"` for standard tasks, `model: "haiku"` for simple/well-defined
- **Spec reviewer:** `model: "haiku"` (binary pass/fail check)
- **Quality reviewer:** `model: "sonnet"` (nuanced judgment)

## Rules

- Never dispatch multiple implementers in parallel — sequential only
- Never skip either review stage
- Each implementer gets fresh context — no accumulated session state
- The orchestrator maintains the task file, not the subagents

## Brownfield Adaptation

In brownfield codebases, the implementer receives EXTRA context:
- Full existing code in the files being modified (not just the target area)
- Related test files (if any exist)
- `docs/system/project-context.md` (patterns and gotchas)
- 2-3 examples of similar patterns already in the codebase

**Principle:** A brownfield subagent must match existing patterns, not ideal patterns. If the codebase uses callbacks, don't introduce promises. Match what exists unless the task explicitly says to migrate.
