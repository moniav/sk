# Idea & Planning Phase Enhancement Plan

> **Status 2026-10-05:** Narrowed by the maintainer to the idea → PRD → epics stage and implemented as `/sk:prd` plus the `prototype` skill (see `CHANGELOG.md`, Unreleased). Decided: a new `/sk:prd` command; one PRD produces many epics; architecture lives in the PRD with ADRs for hard-to-reverse decisions; flows are drawn in Mermaid, attacked step by step, and prototyped as clickable variants. Of the waves below, A (brief), the ADR gate of B, and D (prototype, worst-case data) are covered inside `/sk:prd`; a project-wide glossary (B.1), frontier-only epics outside `/sk:prd` (C), and changes to `/sk:plan` remain open.
> Scope: the stretch from "I have an idea" to "task is `ready` for DEV": `/sk:brainstorm`, `/sk:new-epic`, `/sk:new-task`, `/sk:plan`, `/sk:new-adr`, the `interviewing` skill, the `plan-reviewer` agent, and the `epic`, `task-prd` and `adr-decision` templates.
> Builds on Wave 4.5 of `2026-10-best-practices-enhancement-plan.md` (the `interviewing` skill), which is already in place and is not repeated here.

## Sources

| Source | Revision | Used for |
|--------|----------|----------|
| [RefoundAI/lenny-skills `writing-prds`](https://github.com/RefoundAI/lenny-skills/blob/main/skills/writing-prds/SKILL.md) + `references/artifacts.md` | `13598cc` | problem-statement test, success metrics, non-goals, appetite, 1-pager rubric, nine-box check |
| [mattpocock/skills `grill-with-docs`](https://github.com/mattpocock/skills/blob/main/docs/engineering/grill-with-docs.md) → `grilling`, `domain-modeling` (+ `GLOSSARY-FORMAT.md`, `ADR-FORMAT.md`), `wayfinder` | `4588b32` | glossary written inline, three-gate ADR test, one-paragraph ADRs, fog of war / frontier-only charting |
| [emilkowalski/skill](https://emilkowal.ski/skill) → `prototype`, `break-ui` | `e8a175d` | divergent variants on named axes behind a picker, worst-case data catalogue |

All three are MIT. Borrowed text keeps its provenance in the file and in `CHANGELOG.md` (principle 5 of the best-practices plan).

## What the idea → plan path does today

```
/sk:brainstorm ──► converge ──► interviewing round (scope edges) ──► EPIC + every TASK (subtasks, file paths)
                                                                            │
/sk:plan (per task) ──► codebase scan ──► assumptions table ──► plan-reviewer ──► ready
```

Strong already: conversational divergence, mode table, anti-pattern naming, research tiers, facts-vs-decisions interviewing, the four-failure-class plan review, the 10-box PLAN gate.

## Gaps

| # | Gap | Evidence in SK | What the references do |
|---|-----|----------------|------------------------|
| G1 | **No "why" artifact.** Brainstorm goes from conversation straight to build tasks. The epic's *Success Criteria* are checkbox acceptance criteria, not outcome metrics. No non-goals field, no time budget, no slot for the riskiest assumption (brainstorm writes one, the template has nowhere to put it). | `templates/epic.md`, `brainstorm.md` Step 6a | Lenny: problem in one strong sentence, measurable success metric that filters later requests, explicit non-goals, appetite/urgency, one page. |
| G2 | **No quality bar on the problem statement.** Nothing checks it is short, single, need-based, evidenced, solution-agnostic. | `brainstorm.md` Step 5 has no check | Lenny's *Five Attributes of a Strong Problem Statement* and *PRD Review Checklist*. |
| G3 | **Premature decomposition.** Brainstorm and new-epic write *every* task with subtasks and exact file paths on day one. Tasks 3–7 are planned against a codebase that task 1 will change, and against decisions not yet made. | `new-epic.md` Steps 5–8, `brainstorm.md` 6b | Wayfinder: chart only what you can see; the rest is "Not yet specified" fog that graduates into tickets as decisions resolve. |
| G4 | **Decisions die with the task.** `/sk:plan` Step 5 surfaces hard-to-reverse decisions but records them in the task's *Technical Decisions*, which is archived when the task closes. `/sk:new-adr`'s *When to Use* is broad and its template (Options/Pros/Cons/Consequences) is heavy, so ADRs rarely get written. | `plan.md` Step 5, `new-adr.md`, `templates/adr-decision.md` | Matt: offer an ADR only when **hard to reverse + surprising without context + a real trade-off**; an ADR can be one paragraph; write it the moment the decision lands. |
| G5 | **No shared vocabulary.** No glossary exists anywhere in the doc tree. Interviews don't challenge overloaded terms, so "account / customer / tenant / firm" drift across tasks and code. Costly in SK's target domains (legal, compliance, payments). | `grep -ri glossary pkg/` → nothing | Matt's `domain-modeling`: challenge terms against the glossary, propose a canonical term with `_Avoid_` synonyms, cross-check the code, write the term inline when it resolves. |
| G6 | **"How should it look / behave" is decided in prose.** The only UI step is `/sk:ui-review`, after the build. | no prototype step | Emil's `prototype`: 3 genuinely different variants on named axes, isolated surface, realistic data, the user flips and picks. |
| G7 | **UI edge cases are generic.** `/sk:plan` asks for "edge cases" with no catalogue. | `plan.md` Step 4 | Emil's `break-ui`: plausible or schema-backed worst cases — count of 0 and 1, missing optional fields, longest allowed value, non-Latin and RTL text. |

## Target flow

```
/sk:brainstorm
  explore (unchanged, conversational)
  └► BRIEF  ── gate 1: user approves problem, metric, non-goals, appetite
      └► open decisions = frontier
           ├ grilling   → interviewing + glossary written inline
           ├ prototype  → divergent variants, user picks
           ├ research   → research skill (unchanged)
           └ ADR offered when all three gates hold
      └► EPIC with frontier tasks only; the rest stays in "Not yet specified"
/sk:plan (per task)
  + glossary terms, + worst-case ACs for UI, + ADR offer on hard-to-reverse decisions
```

## Decisions (open)

Answer as "D1 yes, D3 b, …". Each has a recommendation.

| # | Question | Options | Recommended |
|---|----------|---------|-------------|
| D1 | Where does the brief live? | a) a `## Brief` section at the top of the epic · b) a separate `BRIEF-{N}.md` | **a**: one file, no new doc type; a standalone M task gets a 3-line mini brief inside its *What*. |
| D2 | Glossary location | a) `docs/system/glossary.md` · b) root `GLOSSARY.md` (Matt-compatible) | **a**: fits SK's doc tree and `docs/system/` is already read at session start. |
| D3 | Decomposition | a) frontier-only: write in full only tasks with no unresolved upstream decision · b) keep full upfront breakdown | **a**: fixes G3; `/sk:finish` graduates the next tasks. |
| D4 | How are open decisions tracked? | a) an *Open Decisions* table in the epic with a `type` column (grilling / prototype / research / task) · b) a new task `type: decision` with its own lifecycle | **a**: no lifecycle change; `/sk:task-status` reads one more table. |
| D5 | Prototype packaging | a) new gated skill `prototype`, read by `/sk:brainstorm` and `/sk:plan`, plus a thin `/sk:prototype` command · b) skill only | **a**: matches the "gated skills are reused by reading the file" rule in `CLAUDE.md`. |
| D6 | ADR template | a) slim to a one-paragraph core; Options/Consequences optional · b) keep | **a**: the cost of writing an ADR is why they aren't written. |
| D7 | Nine-box cap on epics | a) more than 9 tasks ⇒ re-shape or split · b) no cap | **a**: Ryan Singer's check; cheap and catches scope explosion. |

Not proposed: changing brainstorm's one-question-at-a-time exploration (a deliberate deviation recorded in Wave 4.5); Emil's animation skills (not planning); Lenny's guest quotes (no behaviour change); wayfinder's issue-tracker map (SK is file-based, so the concepts transfer, the tracker does not).

## Items

### Wave A — The brief (G1, G2, D1, D7)

**A.1 Brief section in the epic template.** At the top of `templates/epic.md`, replacing *Problem Statement* and *Goal*:

```markdown
## Brief
**Problem:** <one sentence: who, unmet need, why it matters; no solution words>
**Evidence:** <what tells us this is real: data, quotes, tickets, or "hunch">
**Success metric:** <outcome, baseline → target, how measured, by when>  (not an acceptance criterion)
**Non-goals:** <what this deliberately does not do>
**Appetite:** <time we will spend before we stop and reassess>
**Riskiest assumption:** <what kills this if wrong> — cheapest test: <…>
**Direction:** <just enough for engineers to start; no button-level spec>
```

Keep *Success Criteria (Epic-Level)* but rename it *Acceptance (Epic-Level)* so metric and AC stop being confused.

**A.2 Brief gate in `/sk:brainstorm`.** New Step 5.5 between Converge and Structure: draft the brief, run the check below, show it, get an explicit yes. No epic or task file before that.

Brief check (inline, not an agent; adapted from Lenny's *Five Attributes* + *PRD Review Checklist*):
1. Problem is one sentence, a single problem, names an unmet need, has a *why*, and contains no solution.
2. The success metric is an outcome with a number and a measurement method.
3. At least one non-goal.
4. Appetite stated.
5. Direction leaves room for the builder (no field-by-field UI spec).
6. The word "just" does not appear in Direction or Appetite.

**A.3 Mini brief for standalone tasks.** `/sk:new-task` and the M path of brainstorm put *Problem / Success metric / Non-goals* as three lines inside *What*.

**A.4 Nine-box cap.** `/sk:new-epic` Step 5 and brainstorm Step 6: more than 9 tasks means re-shape or split the epic; say which.

- **Files:** `pkg/docs/templates/epic.md`, `task-prd.md`, `commands/sk/brainstorm.md`, `new-epic.md`, `new-task.md`; `docs/` mirror.
- **Done when:** a brainstorm run in a test project stops at the brief and writes no task file before approval; the epic file has all seven brief fields filled; `npm test` passes.

### Wave B — Glossary and ADRs (G4, G5, D2, D6)

**B.1 Glossary.** New `pkg/docs/system/glossary.md` (template with Matt's format: term, one- or two-sentence definition of what it *is*, `_Avoid_:` synonyms; project-specific terms only; no implementation detail). Created lazily — the template ships empty. Matching empty home in `docs/`.

**B.2 Domain discipline in `interviewing`.** Add a short section (≈10 lines):
- When the user's term conflicts with the glossary, say so and ask which is meant.
- When a term is vague or overloaded, propose a canonical one.
- Probe each new concept with one concrete edge-case scenario.
- When the user states how something works, check the code; surface any contradiction.
- Write each resolved term to `docs/system/glossary.md` immediately, not at the end.

**B.3 ADR three-gate test.** In `interviewing`, `/sk:plan` Step 5 and `/sk:new-adr` *When to Use*: offer an ADR only when the decision is hard to reverse, surprising without context, and the result of a real trade-off. When all three hold, write it there and then. List the qualifying kinds (architectural shape, cross-context integration, lock-in technology, boundary/ownership, deliberate deviation, invisible constraint, non-obvious rejection).

**B.4 Slim ADR template.** Core = title + 1–3 sentences (context, decision, why). *Status*, *Options Considered*, *Consequences* become optional sections.

**B.5 Read the glossary.** Add `docs/system/glossary.md` to the Step 1 read list of `brainstorm`, `new-epic`, `new-task`, `plan`; one line in `pkg/CLAUDE.md` ("Use the terms in `docs/system/glossary.md`"), staying under 100 lines.

- **Files:** `skills/interviewing/SKILL.md`, `commands/sk/plan.md`, `new-adr.md`, `brainstorm.md`, `new-epic.md`, `new-task.md`, `pkg/docs/templates/adr-decision.md`, new `pkg/docs/system/glossary.md`, `pkg/CLAUDE.md`, `docs/` mirror.
- **Done when:** in a test project, a plan session that resolves a term writes it to the glossary mid-session; a hard-to-reverse decision produces a one-paragraph ADR in `docs/decisions/`; a reversible one does not.

### Wave C — Frontier-only decomposition (G3, D3, D4)

**C.1 Epic sections.** Add to `templates/epic.md`:
- *Open Decisions* — `| # | Question | Type (grilling/prototype/research/task) | Blocked by | Status | Answer |`
- *Decisions so far* — one line per resolved decision, linking the ADR or task that holds the detail.
- *Not yet specified* — in-scope fog that cannot be phrased sharply yet.
- *Out of scope* already exists; keep it, and state it never graduates.

**C.2 Frontier rule.** `/sk:brainstorm` 6b and `/sk:new-epic` Step 8 create full task files only for tasks with no open upstream decision. Everything else is a row in the Task Breakdown table marked `not yet specified`, with no file. The test is *can the task be stated precisely now*, not *can it be built now*.

**C.3 Graduation.** `/sk:finish` (after a task closes) and `/sk:plan` (after resolving a decision) re-read the epic: move answered decisions to *Decisions so far*, turn now-specifiable fog into task files, and say what graduated.

- **Files:** `templates/epic.md`, `commands/sk/brainstorm.md`, `new-epic.md`, `finish.md`, `plan.md`, `task-status.md`.
- **Done when:** a new epic with one blocking decision gets task files only for the unblocked tasks; closing the first task graduates the next one.

### Wave D — Prototype and worst-case data (G6, G7, D5)

**D.1 New skill `prototype`** (`disable-model-invocation: true`; ≈120 lines; adapted from Emil's `prototype`):
- Runs only after the brief is approved, to answer an open *prototype* decision (Lenny's warning against premature high-fidelity mocks).
- One piece per run. Default 3 variants, max 5. Each has a name and a stated axis (layout, density, interaction model, flow, data shape); two variants that differ only in colour or copy are one.
- Every variant works with realistic, product-shaped data. No lorem ipsum, no dead buttons.
- Isolated surface: a dev-only route, or one self-contained HTML file when there is no dev server. Production code is never imported from it or edited.
- Present a table: variant · axis · when it wins · its cost. Do not pre-pick. The choice is the user's.
- On a pick: record the decision in the epic's *Open Decisions*, write ADR if the three gates hold, delete the prototype surface. **Promotion into the codebase is DEV's job, not this skill's** (deviation from Emil's Phase 6).
- Not UI-only: a logic or API-shape question can be prototyped as stubs with the same rules.
- Picker: a minimal keyboard-switchable selector specified in `references/picker.md`.

**D.2 `/sk:prototype` command** — thin wrapper that reads the skill (≈20 lines).

**D.3 Worst-case data catalogue** `skills/prototype/references/worst-case-data.md` (adapted from Emil's `break-ui` catalogue): counts 0 / 1 / large with separators, singular/plural, missing optional fields, longest value the schema accepts (or "unbounded" as a finding), long unbreakable email/URL, one-letter names, non-Latin, **RTL (Hebrew/Arabic) and mixed-direction strings**, emoji, extreme numbers and dates, translated labels. Rule: plausible or schema-backed, never random.

**D.4 Use in planning.** `/sk:plan` Step 4 AC refinement: for any task with a UI area, read the catalogue and add an AC for each row that applies. `/sk:brainstorm` Step 3c *Gaps*: offer a prototype when a *how should it look/behave* decision is open.

- **Files:** new `skills/prototype/` (SKILL.md, `references/picker.md`, `references/worst-case-data.md`), new `commands/sk/prototype.md`, `plan.md`, `brainstorm.md`, `help.md`, `Readme.md`, `scripts/check.mjs` counts (skills 24→25, commands 55→56).
- **Done when:** `/sk:prototype` in a web test project builds three variants on distinct axes behind the picker, the user's pick is recorded in the epic, and the surface is gone afterwards; a planned UI task contains worst-case ACs including an RTL row.

## Order and cost

| Wave | Size | Depends on | Evals |
|------|------|-----------|-------|
| A — Brief | S | — | yes, `brainstorm` and `new-task` descriptions unchanged but prompt length grows |
| B — Glossary + ADR | S | — | yes, `plan` and `interviewing` grow |
| C — Frontier | M | A | run `brainstorm`, `new-epic`, `finish` end-to-end in a test project |
| D — Prototype | M | A, C (writes to *Open Decisions*) | new command; trigger check only (gated) |

Net prompt growth is the risk: `brainstorm.md` is already 202 lines. Wave A should pay for itself by cutting Step 7's summary block and the duplicated read list, so the file ends no longer than today.

## Changelog notes

- Adds: brief gate, glossary, three-gate ADR rule, frontier-only epics, `prototype` skill and command, worst-case UI acceptance criteria.
- Upgrade notes: existing epics keep working; the new sections are optional on old files. `docs/system/glossary.md` is created on first use.
- Credits: RefoundAI/lenny-skills, mattpocock/skills, emilkowalski/skill (MIT).
