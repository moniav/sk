---
schema: v1
type: task
id: TASK-{N}
title: "{Task Title}"
phase: plan
status: planning  # planning | ready | in-progress | testing | done | blocked | needs-replan | cancelled | abandoned
priority: P1      # P0 critical/blocking | P1 this sprint | P2 valuable | P3 nice to have
complexity: M     # XS | S | M | L — a task is M at most; L means split it
epic: E{N} | standalone
delivers:     # PRD requirement ids this task delivers (FR-3, NFR-1); blank if there is no PRD
claimed_by:   # agent/session working this task (blank = unclaimed); see tasks/README.md claim convention
claimed_at:   # YYYY-MM-DD HH:MM (claim goes stale when `updated` is >24h old)
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Task: [Task Name]

---

## What

<!-- Three lines, then at most one paragraph of context. The problem line contains no solution. -->

**Problem:** <!-- who, the unmet need, why it matters -->
**Success metric:** <!-- the outcome this moves, with a number where one exists -->
**Non-goals:** <!-- what this task deliberately does not do -->

## Acceptance Criteria

<!-- The TEST-phase checklist. Each criterion is a yes/no check on observable behaviour, independent of the others.
     Good: "POST /api/users returns 201 with {id, email, name} and no password hash".  Bad: "the feature works well". -->

- [ ] **AC-1:** Given … when … then …
- [ ] **AC-2:** Given … when … then …
- [ ] **AC-3:** Given … when … then … <!-- include the failure path: what the user sees when it goes wrong -->

---

## [PLAN]

### Approach

<!-- HOW, in a few sentences: the existing pattern this follows (file or feature), what is new, and, if data changes,
     the migration and rollback. Commit to one approach; alternatives go under Technical Decisions with why not. -->

### Affected Areas

<!-- Exact paths, confirmed with Glob; new files marked (new). A Docs row names each doc to update, or `none`. -->

| Area | Change Type | Files |
|------|-------------|-------|
| Database | New table / Alter / none | `path/to/schema` |
| API | New endpoint / Change | `path/to/routes` |
| Service | New / Change | `path/to/services` |
| UI | New component / Change | `path/to/components` |
| Tests | New / Extend | `tests/path/to/test_file` |
| Docs | Update | `docs/system/...` |

### Dependencies

<!-- What must exist before this task can start: other tasks, migrations, credentials, decisions. -->

- [ ] Dependency 1 (link or description)

### Open Questions

<!-- Every row has an answer before DEV. Facts are looked up, not asked; decisions go to the user with a recommendation. -->

| # | Question | Recommended answer | Status | Answer |
|---|----------|--------------------|--------|--------|
| 1 | - | - | Open / Verified / Decided | - |

> **PLAN exit gate:** every open question answered, approach committed, every subtask anchored to a real path.

---

## Phase Analysis

<!-- Written by /sk:plan, consumed by /sk:dev. DO NOT fill manually -->

### Codebase Scan Results

<!-- Patterns found, affected files, reusable utilities, tests that cover the area (or `none`) -->

### Assumptions & Clarifications

| # | Assumption / Ambiguity | Status | Resolution |
|---|------------------------|--------|------------|
| 1 | - | Verified / Confirmed / Ambiguous | - |

### Technical Decisions

<!-- Approach chosen and why; alternatives rejected and why; the existing file or pattern followed.
     A hard-to-reverse decision that is surprising and a real trade-off gets an ADR: link it here. -->

### Dev Notes

<!-- Written by /sk:dev, consumed by /sk:test: deviations from the plan, gotchas found, `sk-debt` markers added -->

---

## [DEV]

### Subtasks

<!-- Each subtask is S complexity (single concern, 1-2 files), names its exact path, and says what to implement.
     Order by dependency, top to bottom. [TEST] subtasks exist for every AC. -->

- [ ] **ST-1** `[DEV]`: Add/Change {what} in `path/to/file` (new)
- [ ] **ST-2** `[DEV]`: Add/Change {what} in `path/to/file`
- [ ] **ST-3** `[DEV]`: Wire {what} to {what} in `path/to/file`
- [ ] **ST-4** `[TEST]`: Unit tests for {what} in `tests/path` — covers AC-1, AC-2
- [ ] **ST-5** `[TEST]`: Integration test for {what} in `tests/path` — covers AC-3
- [ ] **ST-6** `[DOCS]`: Update `docs/system/{doc}.md` ({what changed})

### Implementation Notes

<!-- Key decisions, gotchas, or context for the person/agent implementing this -->

> **DEV exit gate:** all DEV subtasks done, code self-reviewed, docs updated in the same commit.

---

## [TEST]

### Test Plan

<!-- One row per AC at least. For a UI task, a worst-case data row (0 / 1 / many, missing optional fields, longest
     allowed value, RTL and mixed-direction text). -->

| What to Test | How | Expected Result | AC |
|--------------|-----|-----------------|----|
| Happy path | [steps or command] | [outcome] | AC-1 |
| Failure path | [steps or command] | [the error the user sees; what is preserved] | AC-3 |
| Edge case | [steps or command] | [behaviour] | AC-2 |

### Verification

<!-- Written by /sk:test. Evidence, not assertion: what was run in this session and what it showed, at a named revision. -->

Revision: <commit hash> on <branch>

| AC | Done when | What was run | Result | Proof |
|----|-----------|--------------|--------|-------|
| AC-1 | <observable outcome> | <command or action> | passed / failed / untested | ran / reproduced, or the reason it is untested |
| suite | all existing tests pass | <test command> | N passed, 0 failed | output kept |

> **TEST exit gate:** every AC verified with evidence, all tests pass, no regressions.

---

## Progress Log

| Date | Phase | Note |
|------|-------|------|
| YYYY-MM-DD | PLAN | Task created |
