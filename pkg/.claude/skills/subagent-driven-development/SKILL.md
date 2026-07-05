---
name: subagent-driven-development
description: >
  Orchestrates implementation with isolated subagents — one per subtask — plus
  two-stage review (spec compliance, then code quality). Use for features with 5+
  subtasks, when context pollution is a concern, or when the user asks for "subagent
  mode" or "fresh context per task". Activates during /sk:dev and /sk:implement.
  Sequential by design — /sk:orchestrate is the parallel path.
---

# Subagent-Driven Development

> Dispatch a fresh subagent per subtask with two-stage review.

This skill is opt-in. At the start of `/sk:dev`, if the task has 5+ subtasks, offer subagent mode. Each subtask gets a fresh agent with clean context, preventing drift in long sessions.

## Dispatch Pattern

For each subtask pair ([TEST] + [DEV]):

### 1. Prepare Context Package

Assemble for the implementer:
- Subtask spec (description, file paths, expected outcome)
- Relevant acceptance criteria
- Code style and testing conventions from `docs/conventions/`
- TDD skill reference
- For brownfield: full existing files, related tests, 2-3 pattern examples

### 2. Dispatch Implementer

Use the Agent tool to dispatch `.claude/agents/implementer.md`. The implementer reports:
- **DONE** — Complete, all checks pass
- **DONE_WITH_CONCERNS** — Complete but flagging issues
- **NEEDS_CONTEXT** — Missing info, orchestrator provides and re-dispatches
- **BLOCKED** — Requires human decision

### 3. Two-Stage Review

**Stage 1 — Spec Compliance:** Dispatch `.claude/agents/spec-reviewer.md`. Does code match what the subtask asked for? → PASS or FAIL.

**Stage 2 — Code Quality** (only if Stage 1 passes): Dispatch `.claude/agents/quality-reviewer.md`. Checks conventions, test quality, simplicity → Critical / Important / Suggestions.

### 4. Handle Results

- Both pass → check off subtask, move to next
- Spec fails → feed findings back, re-dispatch (max 2 retries)
- Quality has Critical → fix and re-review
- Quality has only Suggestions → note them, proceed

## Model Selection

Use the cheapest model that fits each role:
- **Implementer:** `sonnet` (standard) or `haiku` (simple/well-defined)
- **Spec reviewer:** `haiku` (binary pass/fail)
- **Quality reviewer:** `sonnet` (nuanced judgment)

## Rules

- Sequential implementers only — no parallel dispatch
- Never skip either review stage
- Fresh context per implementer — no accumulated state
- Orchestrator owns the task file, not subagents

## Brownfield Principle

A brownfield subagent must match existing patterns, not ideal patterns. If the codebase uses callbacks, don't introduce promises. Match what exists unless the task explicitly says to migrate.
