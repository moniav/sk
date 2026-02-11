# Development Lifecycle

> Every piece of work follows the same cycle: **Plan → Dev → Test → Done.**
> No phase is skipped. Each phase has a clear entry/exit gate.

**Last updated:** YYYY-MM-DD

## The Cycle

```mermaid
flowchart LR
    subgraph PLAN ["🎯 PLAN"]
        P1[Define Task] --> P2[Break Down]
        P2 --> P3[Acceptance Criteria]
        P3 --> P4[Plan Review ✓]
    end
    
    subgraph DEV ["🔨 DEV"]
        D1[Implement] --> D2[Self-Review]
        D2 --> D3[Update Docs]
        D3 --> D4[Dev Complete ✓]
    end
    
    subgraph TEST ["🧪 TEST"]
        T1[Run Tests] --> T2[Verify Criteria]
        T2 --> T3[Edge Cases]
        T3 --> T4[Test Pass ✓]
    end
    
    PLAN --> DEV --> TEST --> DONE["✅ DONE"]
    TEST -->|Fail| DEV
```

## Phase Details

### 🎯 Phase 1: PLAN

**Goal:** Know exactly what to build before writing any code.

| Step | Action | Output |
|------|--------|--------|
| **Define** | Write the task with problem statement and goal | Task doc created |
| **Break Down** | Split into subtasks (each ≤ 4 hours of work) | Subtask list with estimates |
| **Acceptance Criteria** | Define how we know it's done | Testable checklist |
| **Review** | Validate plan makes sense, check dependencies | Plan approved |

**Entry gate:** Idea or requirement exists
**Exit gate:** Task doc complete with subtasks and acceptance criteria

#### Planning Checklist

```markdown
- [ ] Problem statement is clear (what & why)
- [ ] Success criteria are testable (not vague)
- [ ] Task is broken into subtasks ≤ 4h each
- [ ] Each subtask is self-contained (can be built & tested independently)
- [ ] Dependencies between subtasks are identified
- [ ] Affected system docs identified (what needs updating)
- [ ] No open questions blocking implementation
```

---

### 🔨 Phase 2: DEV

**Goal:** Implement exactly what was planned, nothing more.

| Step | Action | Output |
|------|--------|--------|
| **Implement** | Build each subtask in order | Working code |
| **Self-Review** | Check conventions, clean up | Clean code |
| **Update Docs** | Update system/architecture/flow docs | Current docs |
| **Mark Complete** | Update subtask status | Status updated |

**Entry gate:** Plan is approved, no blocking questions
**Exit gate:** All subtasks implemented, docs updated, self-reviewed

#### Dev Checklist (per subtask)

```markdown
- [ ] Follows code conventions (docs/conventions/code-style.md)
- [ ] Files in correct locations (docs/conventions/file-structure.md)
- [ ] No hardcoded values, magic numbers, or TODOs left behind
- [ ] Error handling in place
- [ ] Logging added for key operations
- [ ] Relevant docs updated in same commit
```

---

### 🧪 Phase 3: TEST

**Goal:** Verify the implementation meets the acceptance criteria.

| Step | Action | Output |
|------|--------|--------|
| **Unit Tests** | Test individual functions and logic | Tests passing |
| **Integration** | Test components working together | Tests passing |
| **Acceptance** | Verify each criterion from plan | All criteria met |
| **Edge Cases** | Test error paths, boundaries, empty states | No surprises |

**Entry gate:** Dev complete, all subtasks marked done
**Exit gate:** All tests pass, all acceptance criteria verified

#### Test Checklist

```markdown
- [ ] Unit tests written for new logic
- [ ] Happy path works end-to-end
- [ ] Error paths handled gracefully
- [ ] Edge cases: empty data, invalid input, timeouts
- [ ] No regressions (existing tests still pass)
- [ ] Acceptance criteria verified one-by-one
```

---

### ✅ DONE

Task is complete when:
1. All acceptance criteria pass
2. All tests pass
3. All docs are updated
4. Task status updated to `done`

---

## Task Hierarchy

```
Epic (large feature, multiple tasks)
├── Task (self-contained deliverable, 1-2 days)
│   ├── Subtask (single work unit, ≤ 4 hours)
│   ├── Subtask
│   └── Subtask
├── Task
│   ├── Subtask
│   └── Subtask
└── Task
    └── Subtask
```

| Level | Scope | Time | Has Own Doc? |
|-------|-------|------|-------------|
| **Epic** | Full feature or initiative | Days–weeks | Yes: `tasks/EPIC-name.md` |
| **Task** | One shippable piece of the epic | 1-2 days | Yes: section in epic doc or own file |
| **Subtask** | Atomic unit of work | ≤ 4 hours | No: lives as checklist in parent task |

### Self-Contained Task Rules

Each task (and ideally each subtask) should be **self-contained**:

1. **Independent** — Can be built without waiting for other tasks (or dependencies are explicit)
2. **Testable** — Has its own acceptance criteria that can be verified in isolation
3. **Shippable** — Produces a working increment (nothing left half-done)
4. **Documented** — Includes what docs need updating as part of "done"

### Breaking Down Tasks

```mermaid
flowchart TD
    A[Feature Idea] --> B{Can it ship in 1-2 days?}
    B -->|Yes| C[It's a Task — write it up]
    B -->|No| D[It's an Epic — break it into Tasks]
    C --> E{Can each piece be done in ≤ 4h?}
    E -->|Yes| F[Those are your Subtasks]
    E -->|No| G[Break further until ≤ 4h each]
    D --> C
```

#### Decomposition Strategies

| Strategy | When to Use | Example |
|----------|------------|---------|
| **By layer** | Full-stack features | DB → API → UI → Tests |
| **By user story** | User-facing features | "User can sign up" → "User can log in" → "User can reset password" |
| **By component** | System changes | Auth module → Payment module → Notification module |
| **By risk** | Uncertain features | Spike/prototype → Core logic → Polish |

## Quick Reference

### Status Values

| Status | Meaning | Phase |
|--------|---------|-------|
| `backlog` | Not yet planned | — |
| `planning` | Being broken down and specified | PLAN |
| `ready` | Plan complete, ready to build | PLAN → DEV |
| `in-progress` | Currently being implemented | DEV |
| `in-review` | Code complete, being reviewed | DEV → TEST |
| `testing` | Being tested against criteria | TEST |
| `done` | All criteria met, docs updated | DONE |
| `blocked` | Waiting on dependency | Any |

### Priority Levels

| Priority | Meaning | Response |
|----------|---------|----------|
| **P0** | Critical, blocking everything | Do now, drop everything else |
| **P1** | Important, needed soon | Do this sprint |
| **P2** | Valuable, can wait | Do when P0/P1 clear |
| **P3** | Nice to have | Do if time permits |

## Related Docs

- [Task Templates](../templates/) — Epic, Task, and Subtask templates
- [Task Board](../tasks/README.md) — Current task tracking
- [SOP: Creating a Task](../sop/creating-a-task.md) — Step-by-step guide
- [Conventions](../conventions/) — Standards to follow during DEV phase
