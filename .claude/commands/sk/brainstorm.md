---
description: Brainstorm — explore a problem or idea from many angles and leave with one direction and a brief
argument-hint: "[feature description]"
disable-model-invocation: true
---

# Brainstorm

Explore a product or feature idea through conversation and converge on one direction, written up as a brief. Defining and building it is the next command's job: `/sk:prd` for a product or a multi-epic feature, `/sk:new-epic` or `/sk:new-task` for smaller work.

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
- **Brainstorm is not the spec.** It ends with a chosen direction and a brief; flows, requirements, architecture and tasks are written by the next command.
- **Exit gate.** Done when the brief exists in `docs/research/`, the user has confirmed it, and the Step 7 summary names the next command.

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

If the user already knows what they want to build and only needs it defined, suggest the user run `/sk:prd` directly; brainstorm is for when the direction itself is open.

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

## Step 6: Write the Brief

Write the chosen direction as a brief following `.claude/skills/product-brief/SKILL.md`: every field, the problem-statement check, the brief gate. Add the parked ideas and the alternatives rejected, with why, so the next command does not reopen them.

Save it as `docs/research/YYYY-MM-DD-{topic}-brief.md` (the `research-doc.md` template, with the brief as its findings). If Step 4 research was done, include the search queries, key findings and sources in the same file.

Show the brief and get a yes before Step 7.

## Step 7: Summary and Hand-off

Size the direction and name the next command:

| Direction is | Next |
|--------------|------|
| A product, or a feature needing 3+ epics, or new user flows and architecture | `/sk:prd` (it reads the brief) |
| A feature of 1–2 epics without new architecture | `/sk:new-epic` |
| One deliverable | `/sk:new-task` |
| Worth testing before building | describe the cheapest test of the riskiest assumption |

```
[BRAINSTORM COMPLETE]

Direction: {one sentence}
Problem:   {the one-sentence problem statement}
Success:   {metric: baseline → target}
Riskiest assumption: {what kills this if wrong} — cheapest test: {…}

Parked ideas:
  - {interesting, not now, or "none"}

Brief: docs/research/YYYY-MM-DD-{topic}-brief.md
Next:  {command} {argument}
```

**Reply:** the `[BRAINSTORM COMPLETE]` block filled in, with the path of the brief, followed by the suggested next command.
