---
schema: v1
type: task
id: TASK-{N}
title: "{Task Title}"
phase: plan
status: planning  # planning | ready | in-progress | testing | done | blocked | cancelled | abandoned
priority: P1
epic: E{N} | standalone
created: YYYY-MM-DD
updated: YYYY-MM-DD
---

# Task: [Task Name]

---

## What

<!-- One paragraph max. What are we building and why? -->

## Acceptance Criteria

<!-- These are the TEST phase checklist. Every criterion must be verifiable. -->

- [ ] **AC-1:** [Specific, testable condition]
- [ ] **AC-2:** [Specific, testable condition]
- [ ] **AC-3:** [Specific, testable condition]

---

## [PLAN]

### Approach

<!-- Brief technical approach. HOW will we build this? -->

### Affected Areas

| Area | Change Type | Files |
|------|-----------|-------|
| Database | New table / Alter | `path/to/schema` |
| API | New endpoint | `path/to/routes` |
| UI | New component | `path/to/components` |
| Docs | Update | `docs/system/...` |

### Dependencies

<!-- What must exist before this task can start? -->

- [ ] Dependency 1 (link or description)

### Open Questions

<!-- Resolve ALL questions before moving to DEV phase -->

| Question | Answer |
|----------|--------|
| — | — |

> **PLAN exit gate:** All questions resolved, approach clear, subtasks defined below.

---

## Phase Analysis

<!-- Written by /sk:plan, consumed by /sk:dev — DO NOT fill manually -->

### Codebase Scan Results

<!-- Patterns found, affected files, reusable utilities -->

### Technical Decisions

<!-- Approach chosen and why -->

### Dev Notes

<!-- Written by /sk:dev, consumed by /sk:test -->

---

## [DEV]

### Subtasks

<!-- Each subtask at S complexity (single concern, 1-2 files). Tagged by phase. Execute top-to-bottom. -->

- [ ] **ST-1** `[DEV]` — Description of what to implement
- [ ] **ST-2** `[DEV]` — Description of what to implement
- [ ] **ST-3** `[DEV]` — Description of what to implement
- [ ] **ST-4** `[TEST]` — Write unit tests for [what]
- [ ] **ST-5** `[TEST]` — Write integration test for [what]
- [ ] **ST-6** `[DOCS]` — Update [specific docs]

### Implementation Notes

<!-- Key decisions, gotchas, or context for the person/agent implementing this -->

> **DEV exit gate:** All DEV subtasks done, code self-reviewed, docs updated.

---

## [TEST]

### Test Plan

| What to Test | How | Expected Result |
|-------------|-----|-----------------|
| Happy path | [Describe steps] | [Expected outcome] |
| Error case | [Describe steps] | [Expected error handling] |
| Edge case | [Describe steps] | [Expected behavior] |

### Verification

<!-- Check each AC one by one -->

- [ ] **AC-1** verified: [how you confirmed it]
- [ ] **AC-2** verified: [how you confirmed it]
- [ ] **AC-3** verified: [how you confirmed it]
- [ ] All existing tests still pass
- [ ] No regressions

> **TEST exit gate:** All criteria verified, all tests pass, no regressions.

---

## Progress Log

| Date | Phase | Note |
|------|-------|------|
| YYYY-MM-DD | PLAN | Task created |
