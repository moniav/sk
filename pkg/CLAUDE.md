# CLAUDE.md — Agent Instructions

> Read automatically by Claude Code at the start of every session.

## Session Continuity

On session start, check `docs/tasks/.current` for active work; `/sk:resume` gives a briefing. Save user preferences and project gotchas to Claude Code memory; decisions, conventions and architecture to docs; current work state to the task file.

## Development Lifecycle: Plan > Dev > Test

Most work is XS/S complexity — just describe what you want and go. No task file needed; follow Plan > Dev > Test mentally; when done, tell the user to run `/sk:commit`.

**For M+ complexity, use the formal lifecycle.** `/sk:help` maps any situation to a command.

### Starting New Work

| Size | Path |
|------|------|
| A product, or a feature with new flows or architecture | `/sk:prd` writes the PRD (`docs/prd/`) and the epics; greenfield, then `/sk:kickoff` for the stack |
| A feature of several tasks, no PRD needed | `/sk:new-epic`, then a task per piece |
| One deliverable (M) | `/sk:new-task` → `/sk:plan` → `/sk:dev` → `/sk:test` → `/sk:finish` |
| Direction still open | `/sk:brainstorm` first; it ends with a brief |

SOP: `docs/sop/creating-a-task.md`. Worked example: `docs/tasks/examples/TASK-user-registration-api.md`.

### [PLAN] Phase (before writing code)

1. Write the problem statement and acceptance criteria
2. Break into subtasks (each S complexity — single concern, self-contained)
3. Resolve all open questions; identify affected files and docs

**Exit gate:** All questions resolved, subtasks defined, acceptance criteria testable.

### [DEV] Phase

1. Execute subtasks top-to-bottom, checking them off
2. Follow conventions in `docs/conventions/`
3. Update docs in the same commit as code changes

**Exit gate:** All subtasks done, code self-reviewed, docs updated.

### [TEST] Phase

1. Verify each acceptance criterion one-by-one
2. Test error paths and edge cases; confirm no regressions

**Exit gate:** All criteria verified, all tests pass.

## Working Behavior

Rules 1-5 have examples in `docs/conventions/coding-behavior.md`; rules 6-8 each have a skill with the detail.

1. **Surface Assumptions Before Writing Code** — State beliefs, verify by reading code/docs, flag ambiguity before proceeding.
2. **Do Exactly What Was Asked** — No drive-by refactoring, no speculative features, no gold plating. Note improvements as follow-ups.
3. **Keep the Solution as Simple as Possible** — Simplest solution that satisfies all criteria. Walk the simplicity ladder (stdlib → native → existing dep → one-liner); justify complexity with a specific requirement.
4. **Verify Goals After Implementation** — Re-read each criterion, verify with evidence, run actual checks.
5. **Track Deliberate Shortcuts** — Mark intentional shortcuts with `// sk-debt: <ceiling>, <upgrade trigger>`; harvest them with `/sk:debt`.
6. **Evidence Before "Done"** — Run the check in this session and show its output before saying work is complete or passing. Report each criterion as passed, failed or untested (`verification-before-completion`).
7. **Stop After Three Failed Attempts** — Same problem, three failed fixes: say what was tried and why each failed, then offer options instead of a fourth try (`escalation-rules`).
8. **When Told to Just Do It** — Proceed on reversible choices, state each assumption as you make it, list them at the end. Still stop for anything destructive, irreversible or security-related (`plow-ahead`).

## Documentation System

**Always consult docs before coding.** Full command and prerequisites reference: `docs/commands-reference.md`.

- **Before:** `docs/system/project-context.md` (project summary), `docs/system/glossary.md` (use its terms, in code too), `docs/README.md` (doc map), `docs/conventions/`, the relevant `docs/sop/`, `docs/architecture/` and `docs/flows/`.
- **During:** follow `docs/conventions/code-style.md`, `file-structure.md` and `testing.md`; `docs/system/` for schema, APIs, integrations.
- **After:** update whatever changed: `docs/system/`, `docs/architecture/`, `docs/flows/`, `docs/tasks/`, `docs/decisions/`, the glossary.
- **New docs:** start from `docs/templates/` (index in `docs/templates/README.md`, with the command that emits each).

## Build Commands

<!-- REQUIRED: Fill these in before using /sk:dev or /sk:test -->

```yaml
dev:       # e.g., npm run dev
build:     # e.g., npm run build
test:      # e.g., npm test
lint:      # e.g., npm run lint
typecheck: # e.g., npm run typecheck
```

## Key Constraints

- Never commit `.env` files or secrets
