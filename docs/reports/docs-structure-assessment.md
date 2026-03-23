# Do We Need More Doc Categories?

**Date:** 2026-03-22
**Question:** Should docs/ include PRDs, external docs, review reports, and other output from commands?

---

## The Problem

Right now, 7 commands produce valuable output that **disappears after the session**:

| Command | Produces | Where It Goes |
|---|---|---|
| `/sk:code-review` | Findings table, verdict, severity ratings | Shown to user → gone |
| `/sk:security-review` | OWASP findings, CVEs, secret scan results | Shown to user → gone |
| `/sk:perf-review` | Bottleneck analysis, caching opportunities | Shown to user → gone |
| `/sk:ui-review` | A11y audit, responsive issues, WCAG rating | Shown to user → gone |
| `/sk:deps` | Vulnerability report, outdated packages, licenses | Shown to user → gone |
| `/sk:brainstorm` | Design exploration, research findings, approach rationale | Partially saved in epic/task, research lost |
| `/sk:debug` | Root cause analysis, investigation trace, hypothesis log | Fix is in code, investigation logic lost |

**What's lost:**
- A security review from last month that found 3 medium issues — were they fixed?
- A perf review that identified N+1 queries — did we address them all?
- A brainstorm's research findings on library choices — why did we pick react-pdf?
- A debug investigation's hypothesis chain — if the bug recurs, we start from scratch

---

## What to Add (and What NOT to Add)

### Add: `docs/reviews/` — Persistent Review Records

Review output is the clearest gap. These are actionable findings that need tracking.

```
docs/reviews/
├── README.md                              ← Index of all reviews
├── code/
│   └── 2026-03-22-profile-feature.md      ← Code review for profile branch
├── security/
│   └── 2026-03-15-full-scan.md            ← Security audit results
├── performance/
│   └── 2026-03-10-api-endpoints.md        ← Performance analysis
├── ui/
│   └── 2026-03-18-dashboard-a11y.md       ← UI/a11y audit
└── deps/
    └── 2026-03-01-q1-audit.md             ← Dependency health check
```

**Why:** Reviews are point-in-time snapshots with actionable findings. Persisting them enables:
- Tracking whether findings were addressed
- Comparing reviews over time (are we getting better or worse?)
- Onboarding context (what's the current security/perf posture?)
- Audit trail (when was the last security review?)

**Format:** Each review file includes the command output + a tracking section:

```markdown
---
type: review
category: security
date: 2026-03-15
scope: full codebase
status: 3 open / 2 resolved
---

# Security Review — 2026-03-15

## Findings

### Critical
(none)

### High
| # | Category | Location | Finding | Status |
|---|----------|----------|---------|--------|
| 1 | A03-Injection | `api/search:42` | User input in SQL | ✅ Fixed (TASK-12) |

### Medium
| # | Category | Location | Finding | Status |
|---|----------|----------|---------|--------|
| 1 | A05-Config | `config/cors.ts:8` | CORS allows * | ⬜ Open |
| 2 | A01-Access | `api/admin:15` | Missing rate limit | ⬜ Open |
| 3 | A09-Logging | `services/auth.ts` | Failed logins not logged | ✅ Fixed (TASK-14) |

## Next Review
Recommended: 2026-04-15 (monthly)
```

**Template needed:** `docs/templates/review-report.md`

**Command changes:** Each review command gets a final step: "Save this report to `docs/reviews/{category}/YYYY-MM-DD-{scope}.md`? (ask user)"

---

### Add: `docs/research/` — Brainstorm & Investigation Artifacts

When `/sk:brainstorm` does web research or `/sk:debug` traces a complex investigation, the reasoning is valuable but gets lost.

```
docs/research/
├── README.md                              ← Index
├── 2026-03-22-csv-export-libraries.md     ← Library comparison from brainstorm
├── 2026-03-18-auth-approaches.md          ← Architecture research
└── 2026-03-15-dashboard-500-investigation.md ← Debug investigation trace
```

**Why:**
- Brainstorm research (library comparisons, pattern analysis) informs future decisions — without it, the next person re-researches the same thing
- Debug investigations document the reasoning chain — if the bug recurs or a similar one appears, the investigation is reusable
- These are NOT ADRs (ADRs record the *decision*, research records the *exploration*)

**When to save:**
- `/sk:brainstorm` — save research findings when web research was performed
- `/sk:debug` — save investigation trace for M+ complexity bugs
- NOT every brainstorm or debug — only when substantial research/investigation happened

**Format:**

```markdown
---
type: research
trigger: /sk:brainstorm for EPIC-3
date: 2026-03-22
---

# Research: CSV Export Libraries for Rails

## Context
Needed CSV export for reports page. Evaluated 3 options.

## Findings

| Library | Stars | Last Release | Pros | Cons |
|---|---|---|---|---|
| csv (stdlib) | built-in | always | No dependency, fast | Low-level, manual formatting |
| rubyXL | 1.2k | 2025-11 | Full Excel support | Heavy, overkill for CSV |
| csv_builder | 800 | 2024-08 | Nice DSL for views | Unmaintained (1yr+) |

## Decision
Used csv stdlib. Simplest option, no dependency, matches existing PDF export pattern.
→ Recorded in ADR-005-csv-export-approach.md
```

---

### DON'T Add: Separate PRD Directory

**Why not:** Task files (TASK-*.md) already ARE the PRDs. They contain:
- Problem statement (What section)
- Acceptance criteria
- Technical approach
- Subtask breakdown
- Test plan
- Verification results

A separate PRD directory would duplicate task files. The task template already covers everything a PRD needs.

**What if you need a higher-level product document?** Use an Epic file. Epics contain:
- Goal and scope
- Task decomposition
- Dependency graph
- Acceptance criteria at the feature level

**What if you need a product vision or roadmap?** That belongs in `docs/system/project-context.md` (the "what are we building and why" document) or as a top-level `ROADMAP.md` — not in a PRD directory.

---

### DON'T Add: External Documentation Mirror

**Why not:** External docs (API docs for third-party services, framework guides, etc.) go stale fast and are better accessed at the source.

**Instead:** Use `docs/system/integrations.md` to list external services with links to their docs. Use `docs/research/` for specific findings from external docs that informed a decision.

**Exception:** If you need to document how YOUR project integrates with an external service (not the service's own docs), that goes in `docs/system/integrations.md` or `docs/architecture/`.

---

### DON'T Add: Meeting Notes / Discussion Logs

**Why not:** Conversations are ephemeral. The *decisions* from conversations belong in ADRs. The *requirements* belong in task files. The *research* belongs in research docs. Meeting notes themselves add noise.

**Instead:** After a significant discussion, save what matters:
- Decision → `/sk:new-adr`
- New requirement → update task file
- Research finding → save to `docs/research/`

---

## Updated docs/ Structure

```
docs/
├── README.md                  ← Master index (update with new sections)
├── tasks/                     ← Task board + task/epic files (unchanged)
├── architecture/              ← System design (unchanged)
├── conventions/               ← Code standards (unchanged)
├── sop/                       ← Procedures (unchanged)
├── flows/                     ← Mermaid diagrams (unchanged)
├── decisions/                 ← ADRs (unchanged)
├── system/                    ← Current state (unchanged)
├── templates/                 ← Doc templates (add review-report.md)
├── reviews/                   ← NEW: Persistent review output
│   ├── README.md
│   ├── code/
│   ├── security/
│   ├── performance/
│   ├── ui/
│   └── deps/
└── research/                  ← NEW: Brainstorm & investigation artifacts
    └── README.md
```

**Two new directories, two new templates, minor updates to 7 commands.**

---

## How Reviews & Research Connect to the Rest

```
/sk:brainstorm
  ├── produces: EPIC + TASK files in docs/tasks/
  ├── produces: research doc in docs/research/ (if web research was done)
  └── may trigger: ADR in docs/decisions/ (if significant tech choice made)

/sk:code-review
  ├── produces: review report in docs/reviews/code/
  ├── findings link to: specific files (path:line)
  └── critical findings → create tasks in docs/tasks/

/sk:security-review
  ├── produces: review report in docs/reviews/security/
  ├── critical/high findings → create tasks in docs/tasks/
  └── may trigger: ADR if security architecture changes needed

/sk:perf-review
  ├── produces: review report in docs/reviews/performance/
  └── critical findings → create tasks in docs/tasks/

/sk:ui-review
  ├── produces: review report in docs/reviews/ui/
  └── critical findings → create tasks in docs/tasks/

/sk:deps
  ├── produces: review report in docs/reviews/deps/
  └── critical CVEs → create tasks in docs/tasks/

/sk:debug (M+ complexity)
  ├── produces: research doc in docs/research/ (investigation trace)
  ├── fix goes in: code
  └── if architectural: ADR in docs/decisions/
```

**The pattern:** Reviews and research CREATE artifacts. Those artifacts REFERENCE tasks. Tasks DRIVE the lifecycle.

```
                    ┌──────────────┐
                    │   reviews/   │──── findings ────┐
                    └──────────────┘                   │
                    ┌──────────────┐                   ▼
                    │  research/   │──── informs ──→ tasks/ ──→ Plan → Dev → Test
                    └──────────────┘                   ▲
                    ┌──────────────┐                   │
                    │  decisions/  │──── constrains ───┘
                    └──────────────┘
```

---

## Implementation

### New Files to Create

```
docs/reviews/README.md              ← Review index
docs/research/README.md             ← Research index
docs/templates/review-report.md     ← Review template
docs/templates/research-doc.md      ← Research template
```

### Commands to Update (add "Save report?" step)

| Command | Add at End |
|---|---|
| `/sk:code-review` | "Save this review to `docs/reviews/code/YYYY-MM-DD-{scope}.md`?" |
| `/sk:security-review` | "Save this review to `docs/reviews/security/YYYY-MM-DD-{scope}.md`?" |
| `/sk:perf-review` | "Save this review to `docs/reviews/performance/YYYY-MM-DD-{scope}.md`?" |
| `/sk:ui-review` | "Save this review to `docs/reviews/ui/YYYY-MM-DD-{scope}.md`?" |
| `/sk:deps` | "Save this review to `docs/reviews/deps/YYYY-MM-DD-{scope}.md`?" |
| `/sk:brainstorm` | "Save research findings to `docs/research/YYYY-MM-DD-{topic}.md`?" (only if web research was done) |
| `/sk:debug` | "Save investigation trace to `docs/research/YYYY-MM-DD-{bug}.md`?" (only for M+ complexity) |

### Update docs/README.md

Add two rows to the Quick Navigation table:

```markdown
| [Reviews](./reviews/) | Code, security, perf, UI review reports | After running review commands |
| [Research](./research/) | Brainstorm findings, debug investigations | After brainstorm or complex debug |
```

---

## Summary

| Category | Add? | Why |
|---|---|---|
| **reviews/** | Yes | Review output is actionable, needs tracking, currently lost after session |
| **research/** | Yes | Brainstorm research and debug investigations are reusable knowledge, currently lost |
| **PRDs** | No | Task files already serve this purpose |
| **External docs** | No | Link to sources from integrations.md instead |
| **Meeting notes** | No | Extract decisions → ADR, requirements → tasks, findings → research |

**Two additions. Zero duplications. Seven command tweaks (add optional save step).**
