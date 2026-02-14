---
description: Brainstorm a feature — explore an idea and produce an epic with tasks (project)
---

# Brainstorm

Explore a feature idea through guided conversation, research domain patterns and technical approaches, then produce a structured epic with tasks — ready for `/sk:implement`.

**Use when:** You have an idea but haven't broken it down yet. Works for both initial product features and new features added later.

## Step 1: Read Project Context

Read these files to understand the project:

1. `docs/system/project-context.md` — what the project is, stack, patterns
2. `docs/system/tech-stack.md` — framework, dependencies, versions
3. `docs/conventions/code-style.md` — coding patterns to follow
4. `docs/tasks/README.md` — existing tasks and epics (avoid duplicating work)

If none of these exist, suggest running `/sk:kickoff` first.

## Step 2: Explore the Idea

Start with an open question: **"What do you want to build?"**

Then ask follow-up questions to flesh it out. Adapt based on the idea — don't ask irrelevant questions.

### For user-facing features:
- Who uses this? (user role / persona)
- What's the core flow? (step by step, what does the user do?)
- What does success look like? (how do you know it works?)
- What's out of scope? (what does this NOT do?)

### For technical/infrastructure work:
- What problem does this solve?
- What's the current state? (what exists today, what's broken/missing?)
- What's the desired end state?
- What are the constraints? (performance targets, compatibility, etc.)

### For API / data work:
- What entities are involved?
- What operations are needed? (CRUD, workflows, etc.)
- Who/what consumes this? (frontend, mobile, third-party?)
- What are the edge cases?

Keep the conversation going until you have a clear picture. Aim for 2-3 rounds of questions.

## Step 3: Research (Ask First)

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

### If no — skip to Step 4.

## Step 4: Challenge and Refine

Based on the conversation (and research if done), surface things the user might have missed:

**Functional gaps:**
- "Typical {feature type} also includes {X} — do you need that?"
- "What happens when {edge case}?"
- "How does this interact with {existing feature}?"

**Technical considerations:**
- "For {requirement}, the recommended approach with {stack} is {X} — sound good?"
- "This will need {database change / new API endpoint / new component} — just flagging"
- "{Library} is the standard choice for this — or do you have a preference?"

**Scope check:**
- "This sounds like it could be {complexity}. Want to trim it to {smaller scope} for a first pass?"
- "I'd suggest splitting {big feature} into {part A} and {part B} — ship A first"

Let the user respond and adjust. This should be a conversation, not a lecture.

## Step 5: Structure into Epic + Tasks

Once the idea is clear, create the files:

### 5a. Determine Scope

- **L/XL (3+ tasks):** Create an Epic + Tasks
- **M (single deliverable):** Create a standalone Task (skip the Epic)

### 5b. Create the Epic (if L/XL)

Scan `docs/tasks/` for the highest existing EPIC number, use next.

Create `docs/tasks/EPIC-{N}-{name}.md` using the template from `docs/templates/epic.md`:
- Fill in the YAML frontmatter (schema, type, id, title, phase, status, priority, dates)
- Write a clear problem statement (from conversation)
- Define acceptance criteria (testable, yes/no verifiable)
- List the task breakdown with complexity estimates

### 5c. Create Tasks

For each task in the breakdown, scan for the highest existing TASK number, use next.

Create `docs/tasks/TASK-{N}-{E{epicN}|S}-{name}.md` using the template from `docs/templates/task-prd.md`:
- Fill in YAML frontmatter (phase: plan, status: planning)
- Write the problem statement scoped to this task
- Define acceptance criteria specific to this task
- List subtasks (each S complexity)
- Pre-populate **Phase Analysis > Technical Decisions** with any research findings relevant to this task

### 5d. Update Task Board

Update `docs/tasks/README.md`:
- Add the Epic to "Active Epics" table (if created)
- Add all Tasks to the "[PLAN] Planning" section

## Step 6: Summary

Present the result:

```
[BRAINSTORM COMPLETE]

Feature: {feature name}
Scope:   {complexity} — {N} tasks

Epic: EPIC-{N}-{name}.md
  {acceptance criteria summary}

Tasks:
  TASK-{N}-E{epicN}-{name}.md  [{complexity}] {one-line description}
  TASK-{N}-E{epicN}-{name}.md  [{complexity}] {one-line description}
  TASK-{N}-E{epicN}-{name}.md  [{complexity}] {one-line description}

Research applied:
  - {key finding or "no research requested"}

Recommended build order:
  1. {task name} (no dependencies)
  2. {task name} (depends on 1)
  3. {task name} (depends on 1)
```

Ask: **"Ready to start building? Run `/sk:implement` to begin with the first task."**

If the user wants to adjust scope, tasks, or acceptance criteria — edit the files directly. The brainstorm output is a starting point, not a contract.
