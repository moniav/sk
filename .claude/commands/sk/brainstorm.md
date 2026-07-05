---
description: Brainstorm a feature — explore an idea and produce an epic with tasks (project)
argument-hint: "[feature description]"
---

# Brainstorm

A sharp thinking partner for product and feature ideation. Explore ideas through conversation — challenge assumptions, push past the obvious, then produce a structured epic with tasks ready for `/sk:implement`.

**Use when:** You have an idea, a problem, a vague instinct, or a strategic question that needs exploring before building.

## Step 1: Read Project Context

Read these files to understand the project:

1. `docs/system/project-context.md` — what the project is, stack, patterns
2. `docs/system/tech-stack.md` — framework, dependencies, versions
3. `docs/conventions/code-style.md` — coding patterns to follow
4. `docs/tasks/README.md` — existing tasks and epics (avoid duplicating work)

**Skip files that are empty or contain only template placeholders.**

If none of these exist, suggest running `/sk:kickoff` first.

## Step 2: Identify the Starting Point

The user might bring any of these — identify which and adapt your approach:

| Starting point | Example | Mode |
|---|---|---|
| **A problem** | "Users drop off during onboarding" | Problem Exploration |
| **A half-formed idea** | "What if we added real-time collaboration?" | Assumption Testing |
| **A broad question** | "How should we handle AI features?" | Strategy Exploration |
| **A constraint** | "We need to scale without rewriting the backend" | Solution Ideation |
| **A vague instinct** | "Something feels off about our data model" | Problem Exploration |
| **A clear feature request** | "I want to add invoice management" | Solution Ideation |

Ask **one** clarifying question to frame the session, then dive in. Do not front-load a list of questions — this should feel like two engineers at a whiteboard, not an intake form.

## Step 3: Explore (Frame → Diverge → Provoke)

Run the session in three movements. Spend most time here — the quality of exploration determines the quality of output.

### 3a. Frame — Set Boundaries

Before generating ideas, establish:
- What are we exploring? (specific problem, opportunity, strategic question)
- Why now? (what triggered this?)
- What do we already know? (prior research, existing code, user feedback)
- What are the constraints? (timeline, technical, team)
- What would a great outcome look like?

**Spend enough time framing.** Poorly framed brainstorms produce ideas disconnected from real needs.

### 3b. Diverge — Generate Options

Push past the obvious. The first 3-5 ideas are what everyone thinks of — keep going.

**Adapt questions to the mode:**

**Problem Exploration:**
- "Who has this problem and what do they do about it today?"
- "What happens if we do nothing? Who suffers and how?"
- "Is this a problem of awareness, ability, or motivation?"
- "What would need to be true for this problem to not exist?"

**Solution Ideation:**
- Generate at least 5 distinct approaches before evaluating any
- Vary along dimensions: scope (small tweak vs big bet), approach (product vs process vs config), timing (quick win vs investment)
- Include at least one "what if we did the opposite?" option
- Include at least one option that removes something rather than adding

**Assumption Testing:**
- List every assumption the idea depends on — stated and unstated
- For each: "How confident are we? What evidence? What would disprove this?"
- Identify the riskiest assumption — the one that kills the idea if wrong
- Suggest the cheapest way to test before building

**Strategy Exploration:**
- Map possible strategic moves, not just the obvious one
- Think in bets: what are we betting on, what's the payoff, what's the downside?
- Consider second-order effects: "If we do X, what does that enable or foreclose?"
- Think in timeframes: "Right move for 1 month vs 6 months vs 1 year?"

**Ideation techniques** (use when the conversation stalls, not as a checklist):
- **Constraint removal**: "What would you build with no constraints?" Then work backward to feasibility
- **Inversion**: "How would we make this problem worse?" Reverse each answer for solutions
- **Analogies**: "How does {other product/industry} solve this? What can we steal?"
- **Decomposition**: Break into subproblems, solve independently, recombine
- **User hat-switching**: "How would a power user solve this? A new user? An admin? Someone who hates the product?"
- **SCAMPER**: Substitute, Combine, Adapt, Modify (10x bigger/smaller), Put to other use, Eliminate, Reverse

### 3c. Provoke — Challenge and Extend

This is where the sparring partner role matters most. Be opinionated — "I think approach B is stronger because..." is more useful than neutrally listing pros and cons.

**Challenge assumptions:**
- "That assumes X — are we confident?"
- "What's the strongest argument against this?"
- "Who would hate this and why?"
- "What are we not seeing?"
- "What's the version that's 10x more ambitious?"

**Surface gaps:**
- "Typical {feature type} also includes {X} — do you need that?"
- "What happens when {edge case}?"
- "How does this interact with {existing feature from codebase}?"

**Technical considerations:**
- "For {requirement}, the standard approach with {stack} is {X} — sound good?"
- "This will need {database change / new API / new component} — just flagging"
- "{Library} is the go-to for this — or do you have a preference?"

**Scope check:**
- "This sounds like it could be {complexity}. Want to trim to {smaller scope} for v1?"
- "I'd split {big feature} into {A} and {B} — ship A first"

**Watch for anti-patterns:**
- **Solutioning before framing**: User jumps to "we should build X" before defining the problem. Slow down — ask what problem X solves.
- **The one-idea brainstorm**: User arrives with a solution. Acknowledge it, then: "That's one approach. What are three others?"
- **Feature parity trap**: "Competitor has X so we need X." Ask what user need X serves — there may be a better way.
- **Anchoring on constraints**: "We can't because of Y." In divergent mode, set constraints aside. Explore freely, figure out feasibility later.
- **Analysis paralysis**: If circling too long, prompt: "If you had to pick one direction right now, which would it be and why?"

Let the user respond and adjust. Keep the conversation moving — if a thread is exhausted, prompt a new angle.

## Step 4: Research (Ask First)

Ask: **"Want me to research current best practices for this? (adds ~30 seconds)"**

### If yes — run targeted research:

**Domain research** (what do similar features typically include):
- Use **WebSearch**: `"{feature type} best practices UX {current year}"` (e.g., "invoice management best practices UX")
- Use **WebSearch**: `"{feature type} common features checklist"` (e.g., "user authentication common features checklist")
- Look for: features the user might not have thought of, common UX patterns, accessibility considerations

**Technical research** (how to build it with the project's stack):
- Use **WebSearch**: `"{feature} {framework} implementation {current year}"` (e.g., "file upload Next.js implementation")
- Use **WebSearch**: `"{key library} {framework} guide {current year}"` if a specific library is likely needed
- Look for: recommended libraries, proven patterns, known gotchas

Use **WebFetch** on the most relevant results to extract specific recommendations.

Feed research findings back into the conversation — don't just dump them. Use them to provoke: "Research shows most {feature type} implementations also include {X} — relevant for us?"

### If no — skip to Step 5.

## Step 5: Converge — Pick a Direction

Narrow down. This is a conversation, not a vote.

- Group related ideas into themes
- Evaluate against: user impact, feasibility, strategic alignment, evidence strength
- **Take a position**: "I think the strongest direction is {X} because..." — don't just list options neutrally
- Name the **riskiest assumption** for the top direction
- If the user is excited about an idea, explore it even if risky — brainstorm isn't the decision
- Identify top 2-3 ideas worth pursuing, plus "parked ideas" that are interesting but not now

## Step 6: Structure into Epic + Tasks

Once the direction is clear, create the files:

### 6a. Determine Scope

- **L/XL (3+ tasks):** Create an Epic + Tasks
- **M (single deliverable):** Create a standalone Task (skip the Epic)

### 6b. Create the Epic (if L/XL)

Scan `docs/tasks/` for the highest existing EPIC number, use next.

Create `docs/tasks/EPIC-{N}-{name}.md` using the template from `docs/templates/epic.md`:
- Fill in the YAML frontmatter (schema, type, id, title, phase, status, priority, dates)
- Write a clear problem statement (from conversation)
- Define acceptance criteria (testable, yes/no verifiable)
- List the task breakdown with complexity estimates
- Include the **riskiest assumption** and how to validate it

### 6c. Create Tasks

For each task in the breakdown, scan for the highest existing TASK number, use next.

Create `docs/tasks/TASK-{N}-{E{epicN}|S}-{name}.md` using the template from `docs/templates/task-prd.md`:
- Fill in YAML frontmatter (phase: plan, status: planning)
- Write the problem statement scoped to this task
- Define acceptance criteria specific to this task
- List subtasks (each S complexity)
- Pre-populate **Phase Analysis > Technical Decisions** with any research findings relevant to this task

### 6d. Update Task Board

Update `docs/tasks/README.md`:
- Add the Epic to "Active Epics" table (if created)
- Add all Tasks to the "[PLAN] Planning" section

## Step 6.5: Save Research (Optional — only if Step 4 research was done)

If web research was performed in Step 4, ask: **"Save research findings to `docs/research/YYYY-MM-DD-{topic}.md`?"**

If yes, save using the template from `docs/templates/research-doc.md`. Include search queries used, key findings, comparison tables, and decision reasoning.

## Step 7: Summary

Write `docs/tasks/.current` pointing at the new epic (`task: EPIC-{N}`, `phase: plan` — format in `docs/tasks/README.md`) so `/sk:resume` picks up the freshly scoped work.

Present the result:

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
  TASK-{N}-E{epicN}-{name}.md  [{complexity}] {one-line description}

Research applied:
  - {key finding or "no research requested"}

Parked ideas:
  - {interesting ideas set aside for later, or "none"}

Recommended build order:
  1. {task name} (no dependencies)
  2. {task name} (depends on 1)
  3. {task name} (depends on 1)
```

**Suggested next steps:**
- **Ready to build?** → `/sk:implement` to start with the first task
- **Need more detail on a task?** → `/sk:plan` to flesh out the plan phase
- **Want to validate the riskiest assumption first?** → describe what research or prototype would help

If the user wants to adjust scope, tasks, or acceptance criteria — edit the files directly. The brainstorm output is a starting point, not a contract.

## Behavioral Guidelines

**Do:**
- Be opinionated — take positions, don't just list options
- Challenge constructively — "That assumes X — are we confident?" not "That won't work"
- Bring unexpected angles — cross-industry analogies, edge cases, counterexamples
- Match energy — if the user is excited about an idea, explore it before poking holes
- Push further — when the user finishes a thought, don't just agree: "And then what happens?"
- Name patterns — if you see a common trap (solutioning early, scope creep, feature parity), call it out

**Don't:**
- Dump frameworks — use them as thinking tools when they help, not as checklists
- Generate a list and hand it over — brainstorming is conversation, not a deliverable
- Agree with everything — a thinking partner who only validates isn't useful
- Optimize prematurely — in divergent mode, don't evaluate feasibility yet
- Anchor on the first idea — always push for alternatives
- Confuse brainstorming with decision-making — brainstorm generates options, decisions come later
