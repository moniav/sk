---
description: Turn a high-level idea into a detailed PRD by grilling the problem, user flows and architecture, then cut epics from it
argument-hint: "[idea | PRD-N | PRD-N amend <change>]"
disable-model-invocation: true
---

# PRD

Take an idea to a PRD precise enough to build from, then cut it into epics. The grilling happens in stages, each confirmed by the user before it is written down.

**Arguments:** `$ARGUMENTS`
`PRD-N` resumes that PRD. `PRD-N amend <change>` changes an approved PRD. Anything else is the idea; if empty, ask for it in one sentence.

Copy the stages below into your todo list before starting. A stage you decide not to do stays on the list as "skip: <reason>".

## Rules (hold through every stage)

- **Interview in rounds.** Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/interviewing/SKILL.md`: numbered questions, each with your recommended answer; facts you look up, decisions you put to the user.
- **Challenge, don't transcribe.** Take a position on every question. Push back on vague words ("fast", "simple", "handle errors", "users"), on solutions that arrive before the problem, and on "competitor X has it". A requirement nobody can test is not written down yet.
- **The PRD file is the state.** Write each section into `docs/prd/PRD-{N}-{slug}.md` the moment the user confirms it, mark its stage `settled`, set `stage:` to the next one, and log the decision. Never batch to the end; a session can stop after any stage and resume.
- **One vocabulary.** When the user uses two words for one thing, or one word for two, stop and settle the term in `docs/system/glossary.md` right away, then use only that term: in the PRD, the epics and the code.
- **Traceability.** Every requirement traces to a flow step or the brief; every flow step lands on a component. Nothing is added that the user did not decide or a flow does not need.
- **No silent assumptions.** Anything assumed goes into Risks and open questions with a recommended answer. A Must requirement cannot depend on an open question.
- **Docs only.** This command writes the PRD, ADRs, prototypes in `docs/prd/`, the glossary, epics and the task board. Never source code.

## Stage 0: Context and mode

If `docs/templates/` does not exist, the scaffold is missing: run `node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" init . --yes` from the project root first (it only fills gaps and never replaces a file).

Read, skipping files that are empty or only template placeholders: `docs/system/project-context.md`, `tech-stack.md`, `database-schema.md`, `glossary.md`, `docs/architecture/README.md`, `docs/decisions/README.md`, `docs/flows/README.md`, `docs/business/goals.md`, `docs/business/positioning.md`, `docs/tasks/README.md`, `docs/prd/README.md`, and the newest `docs/research/*-brief.md` if one matches the idea (a `/sk:brainstorm` hand-off: its brief seeds Stage 1 and its rejected alternatives are not reopened).

Then pick the mode and say which:

| Mode | When | Stages |
|------|------|--------|
| **product** | A new product, or no code and no PRD yet; or a feature that needs 3+ epics | All, in full |
| **feature** | Code or an approved PRD exists, and the change is 1–2 epics | All, scoped to the change: new flows plus the **existing flows it changes**; architecture as a delta (new or changed components, migration and backfill, API compatibility, feature flag and rollout) |
| **amend** | `PRD-N amend`: the PRD is approved and its epics are in progress | Only the stages the change touches; then list every epic and task the change affects and mark each `needs-replan` in its file; bump `version:` and log the change |
| **task-sized** | One deliverable, no new flow | Stop and suggest the user run `/sk:new-task` |

New PRD: scan `docs/prd/PRD-*.md` for the highest N and use the next; create the file from `docs/templates/prd.md` (`status: draft`, `stage: brief`, `kind:` product or feature) and add it to `docs/prd/README.md`. An existing PRD that overlaps is a conflict to raise, not to duplicate.
Resume: read the PRD, say which stages are settled, and continue at `stage:`.

## Stage 1: Brief

Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/product-brief/SKILL.md`: every field, the problem-statement check, the brief gate. Add the personas table (every persona who touches the product, including admin, support, the payer and the invited user) and seed the glossary with the domain nouns that came up.

**Gate 1:** show the brief; get a yes; write it.

## Stage 2: User flows

Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/flow-design/SKILL.md` for every flow: list, walk, attack, prototype. In feature mode, start from the existing flows in `docs/flows/` and mark what changes in each.

**Gate 2:** show the flow list with each flow's decided edge cases in one line; get a yes; write the section, one subsection per flow.

## Stage 3: Requirements

- **Functional:** consolidate every FR from the flows: id, priority (Must / Should / Could), the flow step it traces to, acceptance as Given / When / Then. Merge duplicates; split any row with "and" in it.
- **Non-functional:** propose a number for each category that applies: performance (latency at a percentile, throughput), availability, data volume and growth, security, privacy and data residency, compliance, accessibility level, locales and RTL, browsers and devices, observability, cost ceiling. "It should be fast" is not done until it has a target and a way to verify it.
- Check both directions: every flow step has an FR or is covered by one; every FR traces back. Close the gaps with the user.

**Gate 3:** show the Must list and the NFR targets; get a yes; write the section.

## Stage 4: Architecture

Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/architecture-design/SKILL.md`: facts first, propose each part, challenge each decision, traceability, ADRs, independent review. In product mode with no code, the stack is decided here and recorded as ADRs; `/sk:kickoff` later turns them into the engineering foundation. In feature mode, only the delta.

**Gate 4:** show the overview diagram, the components, the data model and the ADR list; get a yes; write the section.

## Stage 5: Delivery

- Slice vertically. Epic 1 is the thinnest end-to-end path through the primary flow; later epics add flows, edge cases and NFR hardening. No layer epics ("backend", "frontend") unless the work is pure infrastructure.
- Each epic lists the flows and FR ids it delivers, its dependencies and its appetite. More than 9 tasks in one epic means split it.
- **Coverage:** every Must FR is in exactly one epic; every NFR is in an epic or marked cross-cutting with the epic that first proves it.

**Gate 5:** show the epic table and the coverage result; get a yes; write it.

## Stage 6: Review and approve

Check the whole PRD:
1. The problem statement passes the brief check; every success metric has a baseline and a target.
2. Every flow step has decided edge cases and an FR; every FR traces back.
3. Every NFR has a target and a verification method.
4. Every flow step maps to a component and an interface; every hard-to-reverse decision has an ADR.
5. Glossary terms are used consistently; no word from an Avoid column appears.
6. No Must FR depends on an open question; every open item has a recommended answer.
7. No "TBD", "etc." or "handle errors" remains.

State `PRD review: N/7`; fix each failure with the user. Then set `status: approved`, `stage: done`, update `updated`, log it.

## Stage 7: Write the epics

For each epic in the Delivery table, in order:
1. Next number from `docs/tasks/EPIC-*.md`. Create `docs/tasks/EPIC-{N}-{name}.md` from `docs/templates/epic.md` with `prd: PRD-{N}` and `goal:` from the PRD. Problem and Goal come from the brief, narrowed to this epic; success criteria are the acceptance lines of its FRs, by id; Solution Overview and Architecture Impact are the parts of the PRD architecture this epic touches; Scope lists its FRs in and the PRD non-goals out; Risks are the PRD rows that block it.
2. Fill the Task Breakdown table (task, complexity, dependencies), each task a vertical slice of 1–3 FRs.
3. Task files only for the first epic, from `docs/templates/task-prd.md`, each with its FR acceptance lines as acceptance criteria. Later epics get their task files when they start, so they are planned against the code as it is then.
4. Link the epic in the PRD's Delivery table.

Update `docs/tasks/README.md` and write `docs/tasks/.current` to the first epic (`task: EPIC-{N}`, `phase: plan`; format in `docs/tasks/README.md`).

**Reply:**

```
[PRD APPROVED] PRD-{N}: {title} ({mode})
Problem: {one sentence}
Success: {metric: baseline → target}
Flows: {count} ({count} prototyped) · FRs: {Must}/{Should}/{Could} · NFRs: {count} · ADRs: {list}
Epics:
  EPIC-{N}  {name}  {flows / FRs}  [{appetite}]
Open: {open questions left, or "none"}
Next: {greenfield: /sk:kickoff to set up the stack | otherwise: /sk:plan on the first task of EPIC-{N}}
```

then the paths of every file created or changed. If the session stops earlier, reply with the stages settled, the file path, and `/sk:prd PRD-{N}` to resume.
