---
name: subagent-driven-development
description: Implements a task with one fresh subagent per subtask, each followed by spec and quality review, while you keep the task file. Use whenever a task has about five or more subtasks, a long session risks drifting, or the user asks for subagents to do the implementation.
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
- For brownfield: full existing files, related tests, 2-3 pattern examples
- Dev Notes entries that touch this subtask's files: failed attempts and learnings from earlier subtasks

### 2. Dispatch Implementer

Agent types below are the names SK registers. When SK is installed as a plugin they carry the `sk:` prefix (for example `sk:implementer`).

Use the Agent tool to dispatch the `implementer` agent. The implementer reports:
- **DONE** — Complete, all checks pass
- **DONE_WITH_CONCERNS** — Complete but flagging issues
- **NEEDS_CONTEXT** — Missing info, orchestrator provides and re-dispatches
- **BLOCKED** — Requires human decision

### 3. Two-Stage Review

**Stage 1 — Spec Compliance:** Dispatch the `spec-reviewer` agent. Does code match what the subtask asked for? → PASS, FAIL, or CANNOT_VERIFY (the requirement depends on code the diff does not show).

**Stage 2 — Code Quality** (only if Stage 1 passes): Dispatch the `quality-reviewer` agent. Checks conventions, test quality, simplicity → Critical / Important / Suggestions.

**Stage 3 — Architecture** (conditional): when a subtask spans modules or adds a new dependency between them, also dispatch the `architecture-reviewer` agent → FITS / CONCERNS / REDESIGN. Single-file subtasks skip this stage.

### 4. Handle Results

- A report with no status line → re-dispatch once asking for it; never infer the status from the prose
- Both pass → check off subtask, move to next
- After a re-dispatch, a concern, or a CANNOT_VERIFY, append one line to the task's Dev Notes: what was learned, so the next implementer gets it
- Spec fails → feed findings back, re-dispatch (max 2 retries)
- Spec cannot verify → read the code it names yourself and decide; if it still depends on a run, record the criterion as untested
- Quality has Critical → fix and re-review, at most 2 rounds; then stop and follow the `escalation-rules` skill
- Quality has only Suggestions → note them, proceed

## Model Selection

Do not pass `model` at dispatch: each agent's definition sets it.
The two exceptions are in the `escalation-rules` skill: one tier up after repeated failure, and `haiku` for the subtasks of an XS or S task.

## Rules

- Sequential implementers only — no parallel dispatch
- Never skip either review stage
- **Never pre-judge a review.** A reviewer's prompt carries the spec, the files and the conventions, never a verdict: no "do not flag", "at most Minor", "the plan chose this" or "this is intentional"
- Fresh context per implementer: no accumulated conversation, only the task file and its Dev Notes
- Orchestrator owns the task file, not subagents

## Brownfield Principle

A brownfield subagent must match existing patterns, not ideal patterns. If the codebase uses callbacks, don't introduce promises. Match what exists unless the task explicitly says to migrate.

The review-integrity rules (no pre-judged reviews, CANNOT_VERIFY, a capped fix loop) are adapted from [obra/superpowers](https://github.com/obra/superpowers) (MIT).
