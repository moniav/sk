# CLAUDE.md — Agent Instructions

> This file is read automatically by Claude Code at the start of every session.

## Session Continuity

On session start, check `docs/tasks/.current` for active work context.
Commands update this file automatically. Use `/sk:resume` to get a briefing.

## Memory Integration

Use Claude Code memory for cross-session context:
- **Save to memory:** User preferences, workflow patterns, project-specific gotchas
- **Save to docs:** Technical decisions (ADRs), conventions, architecture
- **Save to task files:** Current work state, progress, subtask status

## Development Lifecycle: Plan > Dev > Test

Most work is XS/S complexity — just describe what you want and go. No task file needed; follow Plan > Dev > Test mentally; when done, tell the user to run `/sk:commit`.

**For M+ complexity, use the formal lifecycle:**

### Starting New Work

1. **Decide scope:** Epic (L/XL) > Task (M) > Quick Path (XS/S)
2. **Follow the SOP:** `docs/sop/creating-a-task.md`
3. **Use templates:** Epic (`docs/templates/epic.md`) or Task (`docs/templates/task-prd.md`)
4. **See worked example:** `docs/tasks/examples/TASK-user-registration-api.md`

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

## Coding Behavior (5 Principles)

See `docs/conventions/coding-behavior.md` for detailed examples and anti-patterns.

1. **Surface Assumptions Before Writing Code** — State beliefs, verify by reading code/docs, flag ambiguity before proceeding.
2. **Do Exactly What Was Asked** — No drive-by refactoring, no speculative features, no gold plating. Note improvements as follow-ups.
3. **Keep the Solution as Simple as Possible** — Simplest solution that satisfies all criteria. Walk the simplicity ladder (stdlib → native → existing dep → one-liner); justify complexity with a specific requirement.
4. **Verify Goals After Implementation** — Re-read each criterion, verify with evidence, run actual checks.
5. **Track Deliberate Shortcuts** — Mark intentional shortcuts with `// sk-debt: <ceiling>, <upgrade trigger>`; harvest them with `/sk:debt`.

## Documentation System

**Always consult docs before coding.** Full command and prerequisites reference: `docs/commands-reference.md`.

### Before Implementation

Read: `docs/system/project-context.md` (project summary), `docs/README.md` (doc map), `docs/conventions/` (code style, structure, patterns), relevant `docs/sop/` and `docs/architecture/`.

### During Implementation

Follow `docs/conventions/code-style.md`, `file-structure.md`, and `testing.md`. Reference `docs/system/` for schema, APIs, integrations.

### After Implementation

Update any docs that changed: `docs/system/` (schema, APIs, tech stack, project context), `docs/architecture/`, `docs/flows/`, `docs/tasks/`, `docs/decisions/`.

### Creating New Docs

Use templates from `docs/templates/`: `epic.md`, `task-prd.md`, `sop-procedure.md`, `adr-decision.md`, `flow-diagram.md`, `component-doc.md`, `feature-doc.md`, `user-guide.md`, `postmortem.md`. Business/GTM: `positioning.md`, `competitor-profile.md`, `pricing-strategy.md`, `business-plan.md`, `financial-model.md`, `cap-table.md`, `investor-update.md`, `decision-memo.md`, `goals.md`, `brand-voice.md`, `campaign.md`, `metrics.md`, `executive-charter.md`.

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

<!-- Add project-specific constraints below (e.g., "no raw SQL", "all text must support i18n") -->

- Never commit `.env` files or secrets
