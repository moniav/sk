---
description: Brainstorm a feature — explore an idea and produce an epic with tasks
argument-hint: "[feature description]"
disable-model-invocation: true
---

# Brainstorm

Explore a product or feature idea through conversation, then produce a structured epic with tasks ready for `/sk:implement`.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

## Rules and Gates

- **Conversation, not intake form.** Ask one question at a time. Never front-load a list of questions, and never generate a list of ideas and hand it over.
- **Take positions.** Say "I think approach B is stronger because..." instead of listing pros and cons neutrally. Do not agree with everything, and challenge constructively: "That assumes X, are we confident?" and not "That won't work".
- **Never anchor on the first idea.** Always push for alternatives, and when the user finishes a thought, push further ("And then what happens?").
- **Diverge before evaluating.** While generating options (3b), do not evaluate feasibility.
- **Match energy.** If the user is excited about an idea, explore it before poking holes, even if it is risky.
- **Techniques are tools, not checklists.** Use the ideation techniques only when the conversation stalls or a thread is exhausted.
- **Brainstorm is not the decision.** It generates options and a starting point; the user may edit scope, tasks, or acceptance criteria afterwards.
- **Exit gate.** Done when the epic/task files exist in `docs/tasks/`, `docs/tasks/README.md` lists them, `docs/tasks/.current` points at the new work, and the Step 7 summary has been shown.

## Step 1: Read Project Context

Read, skipping files that are empty or contain only template placeholders:
1. `docs/system/project-context.md`: what the project is, stack, patterns
2. `docs/system/tech-stack.md`: framework, dependencies, versions
3. `docs/conventions/code-style.md`: coding patterns to follow
4. `docs/tasks/README.md`: existing tasks and epics (avoid duplicating work)

If none of these exist, suggest the user run `/sk:kickoff` first.

## Step 2: Identify the Starting Point

Identify what the user brought and pick the mode:

| Starting point | Example | Mode |
|---|---|---|
| **A problem** | "Users drop off during onboarding" | Problem Exploration |
| **A half-formed idea** | "What if we added real-time collaboration?" | Assumption Testing |
| **A broad question** | "How should we handle AI features?" | Strategy Exploration |
| **A constraint** | "We need to scale without rewriting the backend" | Solution Ideation |
| **A vague instinct** | "Something feels off about our data model" | Problem Exploration |
| **A clear feature request** | "I want to add invoice management" | Solution Ideation |

State the mode, ask **one** clarifying question to frame the session, then start Step 3.

## Step 3: Explore (Frame, Diverge, Provoke)

Spend most of the session here.

### 3a. Frame

Done when you have written one answer to each of these in the conversation (use "unknown" where the user cannot say):
- What are we exploring? (specific problem, opportunity, strategic question)
- Why now? (what triggered this?)
- What do we already know? (prior research, existing code, user feedback)
- What are the constraints? (timeline, technical, team)
- What would a great outcome look like?

### 3b. Diverge

The first 3-5 ideas are the ones everyone thinks of: keep going past them. Work by mode:

**Problem Exploration:**
- "Who has this problem and what do they do about it today?"
- "What happens if we do nothing? Who suffers and how?"
- "Is this a problem of awareness, ability, or motivation?"
- "What would need to be true for this problem to not exist?"

**Solution Ideation:**
- Generate at least 5 distinct approaches before evaluating any
- Vary along scope (small tweak vs big bet), approach (product vs process vs config), and timing (quick win vs investment)
- Include at least one "what if we did the opposite?" option
- Include at least one option that removes something rather than adding

**Assumption Testing:**
- List every assumption the idea depends on, stated and unstated
- For each: "How confident are we? What evidence? What would disprove this?"
- Identify the riskiest assumption: the one that kills the idea if wrong
- Suggest the cheapest way to test it before building

**Strategy Exploration:**
- Map the possible strategic moves, not just the obvious one
- Think in bets: what are we betting on, what is the payoff, what is the downside?
- Second-order effects: "If we do X, what does that enable or foreclose?"
- Timeframes: "Right move for 1 month vs 6 months vs 1 year?"

**Ideation techniques** (only when the conversation stalls or a thread is exhausted): constraint removal, then work backward to feasibility; inversion ("How would we make this worse?", then reverse each answer); analogies from other products or industries; decomposition into subproblems; user hat-switching (power user, new user, admin, someone who hates the product); SCAMPER.

### 3c. Provoke

Cover each of these before converging:
- **Assumptions:** the strongest argument against, who would hate this and why, what we are not seeing, the version that is 10x more ambitious.
- **Gaps:** what a typical {feature type} also includes ("do you need that?"), what happens on {edge case}, how this interacts with {existing feature from the codebase}.
- **Technical:** name the standard approach for {requirement} with the project's stack and ask if it is acceptable; flag any database change, new API, or new component it needs; name the go-to library and ask for a preference.
- **Scope:** state the likely complexity and offer a trimmed v1; propose splitting a big feature into {A} and {B}, shipping A first.

Name these anti-patterns when you see them:
- **Solutioning before framing** (user jumps to "we should build X"): ask what problem X solves.
- **The one-idea brainstorm** (user arrives with a solution): acknowledge it, then "That's one approach. What are three others?"
- **Feature parity trap** ("Competitor has X so we need X"): ask what user need X serves.
- **Anchoring on constraints** ("We can't because of Y"): set constraints aside while diverging, settle feasibility later.
- **Analysis paralysis** (circling too long): "If you had to pick one direction right now, which would it be and why?"

## Step 4: Research (Ask First)

Follow `.claude/skills/research/SKILL.md`: check `docs/research/` for reusable prior research first, then ask the depth question (AskUserQuestion):
**Quick** (~1-2 min, 2-3 inline searches) / **Deep** (~5-10 min, parallel subagent fan-out) / **Skip**.

Brainstorm-specific angles:
- **Domain:** what similar features typically include (`{feature type}` features checklist, UX patterns, accessibility considerations), to surface features the user has not thought of.
- **Technical:** how to build it with this project's stack (`{feature} {framework}` implementation patterns, recommended libraries, known gotchas).

Feed findings back as provocations, not dumps: "Research shows most {feature type} implementations also include {X}, relevant for us?"
Every recommendation that could change the design needs a cited source (primary-source rule).

## Step 5: Converge

- Group related ideas into themes
- Evaluate against: user impact, feasibility, strategic alignment, evidence strength
- State your pick: "I think the strongest direction is {X} because..."

**Done when** the user has confirmed one direction and you have written down: the top 2-3 ideas worth pursuing, the riskiest assumption for the chosen direction, and the parked ideas (interesting, but not now).

## Step 6: Structure into Epic + Tasks

Scope: **L/XL (3+ tasks)** gets an Epic + Tasks; **M (single deliverable)** gets a standalone Task and no Epic.

### 6a. Create the Epic (if L/XL)

Scan `docs/tasks/` for the highest existing EPIC number and use the next.
Create `docs/tasks/EPIC-{N}-{name}.md` using the template from `docs/templates/epic.md`:
- Fill in the YAML frontmatter (schema, type, id, title, phase, status, priority, dates)
- Problem statement (from the conversation)
- Acceptance criteria (testable, yes/no verifiable)
- Task breakdown with complexity estimates
- The **riskiest assumption** and how to validate it

### 6b. Create Tasks

For each task in the breakdown, scan for the highest existing TASK number and use the next.
Create `docs/tasks/TASK-{N}-{E{epicN}|S}-{name}.md` using the template from `docs/templates/task-prd.md`:
- YAML frontmatter (phase: plan, status: planning)
- Problem statement scoped to this task
- Acceptance criteria specific to this task
- Subtasks (each S complexity)
- **Phase Analysis > Technical Decisions** pre-populated with any research findings relevant to this task

### 6c. Update Task Board

Update `docs/tasks/README.md`: add the Epic to the "Active Epics" table (if created) and all Tasks to the "[PLAN] Planning" section.

## Step 6.5: Save Research (only if Step 4 research was done)

Ask: **"Save research findings to `docs/research/YYYY-MM-DD-{topic}.md`?"**
If yes, save using the template from `docs/templates/research-doc.md`. Include search queries used, key findings, comparison tables, and decision reasoning.

## Step 7: Summary

Write `docs/tasks/.current` pointing at the new epic (`task: EPIC-{N}`, `phase: plan`; format in `docs/tasks/README.md`) so `/sk:resume` picks up the freshly scoped work.
Then present the result:

```
[BRAINSTORM COMPLETE]

Feature: {feature name}
Scope:   {complexity} — {N} tasks

Direction: {one-sentence summary of chosen approach}
Riskiest assumption: {what could kill this if wrong}

Epic: EPIC-{N}-{name}.md
  {acceptance criteria summary}

Tasks:
  TASK-{N}-E{epicN}-{name}.md  [{complexity}] {one-line description}
  TASK-{N}-E{epicN}-{name}.md  [{complexity}] {one-line description}

Research applied:
  - {key finding or "no research requested"}

Parked ideas:
  - {interesting ideas set aside for later, or "none"}

Recommended build order:
  1. {task name} (no dependencies)
  2. {task name} (depends on 1)
```

Suggest these next steps to the user, and if they want to adjust scope, tasks, or acceptance criteria, edit the files directly:
- **Ready to build?** `/sk:implement` to start with the first task
- **Need more detail on a task?** `/sk:plan` to flesh out the plan phase
- **Want to validate the riskiest assumption first?** Describe what research or prototype would help

**Reply:** the `[BRAINSTORM COMPLETE]` block filled in, with the path of every file created or updated (epic, tasks, `docs/tasks/README.md`, `docs/tasks/.current`, research doc if saved), followed by the three suggested next steps.
