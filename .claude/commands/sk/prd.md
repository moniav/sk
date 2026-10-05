---
description: Turn a high-level idea into a detailed PRD by grilling the problem, user flows and architecture, then cut epics from it
argument-hint: "[idea, or PRD-N to resume]"
disable-model-invocation: true
---

# PRD

Take a high-level idea to a PRD precise enough to build from: challenge the problem, walk and attack every user flow, design the architecture and question it, then cut the PRD into epics.

**Arguments:** `$ARGUMENTS`
`PRD-N` resumes that PRD. Anything else is the idea. If empty, ask for the idea in one sentence.

Copy the stages below into your todo list before starting. A stage you decide not to do stays on the list as "skip: <reason>".

## Rules (hold through every stage)

- **Interview in rounds.** Follow `.claude/skills/interviewing/SKILL.md`: numbered questions, each with your recommended answer; facts you look up, decisions you put to the user.
- **Challenge, don't transcribe.** Take a position on every question. Push back on vague words ("fast", "simple", "handle errors", "users"), on solutions that arrive before the problem, and on "competitor X has it". Ask "what happens if we don't?" and "who would hate this?". A requirement nobody can test is not written down yet.
- **The PRD file is the state.** Write each section into `docs/prd/PRD-{N}-{slug}.md` the moment the user confirms it, mark its stage `settled`, set `stage:` in the frontmatter to the next one, and log the decision. Never batch to the end; a session can stop after any stage and `/sk:prd PRD-N` resumes there.
- **One vocabulary.** When the user uses two words for one thing, or one word for two things, stop and settle the term. Write it to the Glossary right away and use only that term afterwards, in the PRD and in the epics.
- **Traceability.** Every requirement traces to a flow step or the Brief; every flow step lands on a component. Nothing is added that the user did not decide or a flow does not need.
- **No silent assumptions.** Anything you had to assume goes into Risks and open questions with a recommended answer. A Must requirement cannot depend on an open question.
- **Read-only on code.** This command writes docs only: the PRD, ADRs, prototypes in `docs/prd/`, epics, and the task board.

## Stage 0: Context

Read, skipping files that are empty or only template placeholders: `docs/system/project-context.md`, `docs/system/tech-stack.md`, `docs/system/database-schema.md`, `docs/architecture/README.md`, `docs/decisions/README.md`, `docs/business/goals.md`, `docs/business/positioning.md`, `docs/tasks/README.md`, and `docs/prd/` (an existing PRD that overlaps is a conflict to raise, not to duplicate).

New PRD: scan `docs/prd/PRD-*.md` for the highest N and use the next; create the file from `docs/templates/prd.md` with `status: draft`, `stage: brief`. Add it to `docs/prd/README.md`.
Resume: read the PRD, say which stages are settled, and start at the frontmatter `stage:`.

Greenfield (no code yet) is fine: the architecture stage then proposes rather than verifies.

## Stage 1: Brief: challenge the idea

Goal: the problem is real, owned by a named persona, and measurable.

Cover, in rounds:
- **Problem:** who has it, what they do about it today, what it costs them, what evidence says it is real, why now.
- **Success metrics:** an outcome with a baseline, a target, how it is measured and by when. Push back on output metrics ("ship X") and on metrics nobody can measure yet.
- **Non-goals:** at least one; offer the tempting adjacent features as candidates.
- **Appetite:** how much time this deserves before reassessing. A wide gap between appetite and scope is a finding.
- **Riskiest assumptions:** for each, the evidence today and the cheapest test. Say plainly when the riskiest one should be tested before building.
- **Users:** every persona who touches the product, including admin, support, the payer and the invited user; their context and frequency.
- **Glossary seed:** the domain nouns that came up.

Before writing, check the problem statement: one sentence; one problem; names an unmet need; has a why; contains no solution. Rewrite it with the user until it passes. Also flag the word "just" anywhere in the Brief.

**Gate 1:** show the Brief section and get an explicit yes. Then write it.

## Stage 2: User flows: walk them, then attack them

**2a. List the flows.** Propose the full list per persona and ask what is missing. Always check the flows that get forgotten: first use and empty state, sign-up and invite, roles and permissions, settings, notifications, billing and plan limits, export, delete and account closure, admin and support.

**2b. Walk each flow,** primary flows first. Trigger, preconditions, end state, then the numbered steps (what the user does, what the system does). Draw it in Mermaid in the PRD.

**2c. Attack each step.** For every step, go through these and put the ones that apply to the user, with your recommended behaviour:

| Attack | Ask |
|--------|-----|
| Bad input | Invalid, duplicate, too long, wrong format: what exactly happens? |
| Empty and first use | Nothing exists yet: what does the user see and do? |
| Limits | 0, 1, many, the plan limit, the largest value accepted? |
| Permissions | Who may do this? What does someone without the right see? Cross-tenant? |
| Dependency down | The API, payment provider, email or AI model fails or times out: then what? |
| Abandon and return | They leave halfway: is progress kept? For how long? |
| Concurrency | Double click, two tabs, two users editing the same thing? |
| Undo | Can it be reversed? Until when? Who is told? |
| Notification | Who needs to know this happened, through which channel? |
| Language and access | RTL and mixed-direction text, translation, keyboard and screen reader |
| Audit and compliance | Must this be logged, retained, consented to, or deletable on request? |

Each decided behaviour becomes a row in the flow's edge-case table with an FR id, or an explicit non-goal. "Show an error" is not a decision; the message, the recovery path and what is preserved are.

**2d. Prototype the flows that matter.** For the primary flow, and for any step where the open question is how it should look or behave, read `.claude/skills/prototype/SKILL.md` and follow it. Offer it; the user may decline per flow. Record the chosen variant and why in the flow's Prototype line, and turn what the choice decided into requirements.

**Gate 2:** show the flow list with a one-line summary of each flow's decided edge cases; get a yes. Write the section.

## Stage 3: Requirements

- **Functional:** consolidate every FR from the flows. Each has an id, a priority (Must / Should / Could), the flow step it traces to, and acceptance in Given / When / Then. Merge duplicates; split any row with "and" in the requirement.
- **Non-functional:** propose a number for each category that applies: performance (latency at a percentile, throughput), availability, data volume and growth, security, privacy and data residency, compliance, accessibility level, supported locales and RTL, browsers and devices, observability, cost ceiling. Challenge each "it should be fast" until it has a target and a way to verify it.
- Check: every flow step has an FR or is covered by another; every FR traces back. List gaps and close them with the user.

**Gate 3:** show the Must list and the NFR targets; get a yes. Write the section.

## Stage 4: Architecture: design it, then question it

**4a. Facts first.** In an existing codebase, map what exists: components, data model, patterns, integrations, and the ADRs in `docs/decisions/`. Use an Explore subagent for a wide codebase so the raw reading stays out of this conversation. Never ask the user what the code can tell you.

**4b. Propose, don't ask open-ended.** Draft each part with a recommendation, then grill the decisions in rounds:
- **Components and boundaries:** what is new, changed, reused; which component owns which data.
- **Data model:** entities named from the Glossary, relationships, tenancy, ID format, deletion and retention, PII.
- **Interfaces:** the endpoints, events and jobs each flow step needs; sync or async; which must be idempotent.
- **Integrations:** each third party, what happens when it fails, the fallback.
- **Access control:** a role × action matrix from the personas and flows.
- **Consistency and concurrency:** transactions, idempotency keys, double submit, concurrent edits, retries and ordering for background work.
- **Security and privacy:** the threats on the primary flows (spoofing, tampering, data exposure, abuse) and the mitigation for each.
- **Observability, deployment and migration:** what is logged and alerted, feature flags, rollout order, migration from today's data.

For each decision, challenge it: the alternative and why not; what breaks at 10× the NFR volume; how hard it is to reverse.

**4c. Traceability.** Fill the table mapping every flow step to a component and an interface. A step without a row is a gap to close now.

**4d. ADRs.** For a decision that is hard to reverse, surprising to a later reader, and the result of a real trade-off, write an ADR now in `docs/decisions/` from `docs/templates/adr-decision.md` (context, decision and why may be one paragraph; options and consequences only when they add something), and list it in the PRD's Decisions table. Other decisions stay in the PRD.

**4e. Independent review.** Dispatch the **architecture-reviewer** agent (`sk:architecture-reviewer` under the plugin) with the PRD's Architecture and Requirements sections and the paths to the existing architecture docs. Put each of its concerns to the user with your recommended answer. Quote its verdict in the Decision log.

**Gate 4:** show the overview diagram, the components, the data model and the ADR list; get a yes. Write the section.

## Stage 5: Delivery: cut the PRD into epics

- Slice vertically. Epic 1 is the thinnest end-to-end path through the primary flow (the walking skeleton); later epics add flows, edge cases and NFR hardening. Avoid layer epics ("backend", "frontend") unless the work is pure infrastructure.
- Each epic lists the flows and FR ids it delivers, its dependencies, and its appetite. No epic should need more than 9 tasks; if it does, split it.
- **Coverage check:** every Must FR is in exactly one epic; every NFR is either in an epic or noted as cross-cutting with the epic that first proves it. State the result.

**Gate 5:** show the epic table and the coverage result; get a yes.

## Stage 6: Review and approve

Re-read the whole PRD and check:
1. The problem statement passes the Stage 1 check, and every success metric has a baseline and a target.
2. Every flow step has decided edge cases and traces to an FR; every FR traces back to a flow step or the Brief.
3. Every NFR has a target and a verification method.
4. Every flow step maps to a component and an interface; every hard-to-reverse decision has an ADR.
5. Glossary terms are used consistently; no synonym from an Avoid column appears.
6. No Must FR depends on an open question; every open item has an owner and a recommended answer.
7. No "TBD", "etc." or "handle errors" remains.

State `PRD review: N/7`. Fix each failure with the user before going on. Then set `status: approved`, `stage: done`, update `updated`, and log it.

## Stage 7: Write the epics

For each epic in the Delivery table, in order:
1. Scan `docs/tasks/EPIC-*.md` for the highest number and use the next.
2. Create `docs/tasks/EPIC-{N}-{name}.md` from `docs/templates/epic.md`: set `prd: PRD-{N}` and `goal:` from the PRD. Problem Statement and Goal come from the PRD Brief, narrowed to this epic. Epic-level success criteria are the acceptance lines of the FRs it delivers, by id. Solution Overview and Architecture Impact come from the PRD's Architecture, only the parts this epic touches. Scope lists the FRs in and the PRD non-goals out. Risks come from the PRD rows that block this epic.
3. Fill the epic's Task Breakdown table (task, complexity, dependencies), each task a vertical slice of 1–3 FRs.
4. Create task files only for the first epic, from `docs/templates/task-prd.md`, each with its FR acceptance lines as its acceptance criteria. Later epics keep their breakdown table; their task files are created when that epic starts, so they are planned against the code as it is then.
5. Link the epic file in the PRD's Delivery table.

Update `docs/tasks/README.md` (Active Epics, and the first epic's tasks under Planning) and write `docs/tasks/.current` pointing at the first epic (`task: EPIC-{N}`, `phase: plan`; format in `docs/tasks/README.md`).

**Reply:**

```
[PRD APPROVED] PRD-{N}: {title}
Problem: {one sentence}
Success: {metric: baseline → target}
Flows: {count} ({count} prototyped) · FRs: {Must}/{Should}/{Could} · NFRs: {count} · ADRs: {list}
Epics:
  EPIC-{N}  {name}  {flows / FRs}  [{appetite}]
Open: {open questions left, or "none"}
Next: /sk:plan on the first task of EPIC-{N}
```

then the paths of every file created or changed. If the session stops before Stage 7, reply with the stages settled, the file path, and `/sk:prd PRD-{N}` to resume.
