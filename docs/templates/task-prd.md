# Task: [Task Name]

**Status:** backlog | planning | ready | in-progress | in-review | testing | done | blocked  
**Priority:** P0 | P1 | P2 | P3  
**Complexity:** XS | S | M | L | XL  
**Parent Epic:** [Epic Name](./EPIC-name.md) (or "standalone")  
**Created:** YYYY-MM-DD  
**Last updated:** YYYY-MM-DD  

---

## What

<!-- One paragraph max. What are we building and why? -->

## Acceptance Criteria

<!-- These are the TEST phase checklist. Every criterion must be verifiable. -->

- [ ] **AC-1:** [Specific, testable condition]
- [ ] **AC-2:** [Specific, testable condition]
- [ ] **AC-3:** [Specific, testable condition]

---

## 🎯 PLAN

### Approach

<!-- Brief technical approach. HOW will we build this? -->

### Affected Areas

| Area | Change Type | Files |
|------|-----------|-------|
| Database | New table / Alter | `src/lib/db/schema.ts` |
| API | New endpoint | `src/app/api/...` |
| UI | New component | `src/components/...` |
| Docs | Update | `docs/system/...` |

### Dependencies

<!-- What must exist before this task can start? -->

- [ ] Dependency 1 (link or description)

### Open Questions

<!-- Resolve ALL questions before moving to DEV phase -->

| Question | Answer |
|----------|--------|
| — | — |

> ✅ **PLAN exit gate:** All questions resolved, approach clear, subtasks defined below.

---

## 🔨 DEV

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

> ✅ **DEV exit gate:** All DEV subtasks done, code self-reviewed, docs updated.

---

## 🧪 TEST

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

> ✅ **TEST exit gate:** All criteria verified, all tests pass, no regressions.

---

## Progress Log

| Date | Phase | Note |
|------|-------|------|
| YYYY-MM-DD | PLAN | Task created |
