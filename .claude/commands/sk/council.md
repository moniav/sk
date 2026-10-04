---
description: Convene an advisory council — multiple personas debate a question and produce a decision report
argument-hint: "[question to deliberate]"
disable-model-invocation: true
---

# Council — Multi-Persona Deliberation

Convene a council of personas with opposed mandates to debate a strategic or architectural question, and produce a decision report with recommendation, dissent, and conditions.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

**Not for:** implementation details (`/sk:plan`), debugging (`/sk:debug`), or brainstorming features (suggest the user run `/sk:brainstorm`).

**Plan-arbiter mode:** if the input is two or more *complete, competing plans* for the same goal and the job is to **pick one**, skip Steps 2 to 10 and use **Plan-Arbiter Mode** at the end of this file.

## Rules and Gates

- **Round 0 is independent:** zero cross-visibility, no persona sees another's position.
- **Seats run on different models.** Agreement between seats on different models is stronger evidence than agreement between seats on one model, so each seat is dispatched with the model in the table in Step 3.
- **Mandatory disagreement:** every persona MUST disagree with at least one other position.
- **Record all dissent,** even if outvoted.
- **Evidence, not principles:** personas must reference specific evidence (codebase, research, data).
- **Maximum 3 rounds** (Round 0, 1, 2). If there is no convergence after 3, report the split decision as-is.
- **Research is pre-debate only:** only you (the orchestrator) trigger it, and every persona receives the same output.
- **You write the synthesis.** Do NOT delegate Step 9 to a subagent.
- **Confirm before spending:** the user confirms the question (Step 2), and the composition, models and token estimate (Step 3), before any dispatch.
- **Exit gate:** done when the report is saved to `docs/decisions/council-{YYYY-MM-DD}-{topic-slug}.md` and the user has chosen one of the five Step 10 options.

## Step 1: Read Context

Read, skipping files that are empty or contain only template placeholders:
1. `docs/system/project-context.md`: project summary
2. `docs/system/tech-stack.md`: current stack
3. `docs/architecture/README.md`: system design
4. `docs/decisions/README.md`: previous decisions (do not re-litigate settled questions)

## Step 2: Frame the Question

Ask the user: **"What question should the council deliberate?"**

Classify it to size the council:

| Type | Example | Default Council |
|------|---------|----------------|
| **Binary decision** | "Should we use Redis or Memcached?" | 3 personas |
| **Multi-option** | "What auth strategy should we adopt?" | 3-5 personas |
| **Open exploration** | "How should we handle scaling?" | 5 personas |
| **Risk assessment** | "What could go wrong with this migration?" | 3 personas (Adversary-heavy) |

Restate the question in one sentence and get the user's confirmation before proceeding.

## Step 3: Select Council Composition

The default council is the first three personas. The extended council (high-stakes decisions) adds the last two.

| Persona | Model | Mandate | Bias |
|---------|-------|---------|------|
| **The Pragmatist** | `sonnet` | Ship working software fast. Every abstraction is a liability until proven otherwise. | Against over-engineering, premature abstraction, speculative features. Would rather copy-paste 3 lines than create a shared utility. |
| **The Architect** | `opus` | Long-term system health above all. Tech debt compounds. Patterns exist for a reason. | Against shortcuts, "we'll fix it later," inconsistent patterns. Prefers proven solutions over novel ones. |
| **The Adversary** | `haiku` | Break the proposal. Find what everyone else missed. | Must find at least 3 failure modes, security holes, scaling limits, or edge cases. Cannot agree with the majority without identifying risks first. |
| **The User Advocate** | `sonnet` | End-user experience is the only metric that matters. Developer convenience that hurts UX is unacceptable. | Against complexity users can feel: latency, confusing flows, poor error messages, accessibility gaps. |
| **The Operator** | `opus` | Production reliability. If you can't debug it at 3am, don't ship it. | Against hidden complexity, poor observability, hard-to-diagnose failures, systems that need experts to operate. |

A persona keeps its model for every round. The user may reassign models, or put every seat on one model; then say in the report that the agreement map shows mandates only.

Custom personas are allowed on request. Each needs a **clear mandate** (what they optimize for), a **concrete bias** (what they are against, specific not abstract), a **disagreement requirement** (must challenge at least one other position), and a model.

Confirm the composition: **"Council of {N}: {name (model), ...}. Proceed?"**

Then show the cost estimate before dispatching anything: **"This council will use approximately {N} personas over {R} rounds (~{T}K tokens). Proceed?"**
Estimates: 3 personas, 2 rounds ~15-20K (default); 3 personas, 3 rounds ~20-30K (deep disagreement in Round 1); 5 personas, 2 rounds ~25-35K (high-stakes architecture); 5 personas, 3 rounds ~35-50K (use sparingly).

## Step 4: Pre-Debate Research (Optional)

Ask: **"Should the council research before deliberating? (Recommended for technology choices.)"**

If yes, identify 2-3 specific questions the council needs answered and dispatch one research subagent (`subagent_type: general-purpose`, `model: sonnet`) with this prompt:

```
Research the following questions for a technical council deliberation:
{questions}

Search the web for current best practices, benchmarks, comparisons.
Produce a neutral fact sheet: no recommendations, just evidence.
Format: bullet points with sources.
```

Pass its output to every persona as **shared evidence**.

## Dispatching a persona

Every round uses the Agent tool once per persona, all in one message so they run in parallel: `subagent_type: general-purpose`, `model:` the persona's model from Step 3, `description: "Council R{round}: {persona name}"`. Each prompt starts with this header, followed by the round's own section:

```
You are {persona name} on an advisory council.

YOUR MANDATE: {mandate}
YOUR BIAS: {bias}
QUESTION: {the question}
```

## Step 5: Round 0 — Independent Positions

Dispatch ALL personas, then collect all positions. After the header:

```
PROJECT CONTEXT:
{project-context summary}

SHARED EVIDENCE (if any):
{research findings}

CODEBASE ACCESS: You may use Read, Glob, and Grep to examine the actual
codebase for evidence to support your arguments.

INSTRUCTIONS:
1. State your position clearly (200 words max)
2. List your top 3 arguments with specific evidence
   (from codebase, research, or reasoning)
3. State your confidence: HIGH / MEDIUM / LOW

RULES:
- Be concrete, not abstract. Reference actual files, patterns, or data.
- Do not hedge. Take a clear position.
- 200 word limit on position statement. Be dense, not verbose.
```

## Step 6: Summarize Round 0

Compress each position to this summary. The summary, not the full text, is what other personas see in Round 1:

```
{Persona}: {position in 1 sentence}
  - Arg 1: {key point}
  - Arg 2: {key point}
  - Arg 3: {key point}
  Confidence: {level}
```

Note now, before anyone sees anyone else: which seats reached the same conclusion independently. That goes in the report's Agreement Map.

## Step 7: Round 1 — Challenge

Dispatch ALL personas again. After the header:

```
This is the CHALLENGE round.

YOUR ROUND 0 POSITION:
{their own full position from Round 0}

OTHER COUNCIL MEMBERS' POSITIONS:
{Round 0 summaries of all OTHER personas}

INSTRUCTIONS:
1. For EACH other council member, state:
   - AGREE or DISAGREE (pick one, no "partially agree")
   - Why (1-2 sentences, specific)
2. Identify the single strongest counter-argument to YOUR OWN position
3. State whether you want to REVISE your position or HOLD
   - If REVISE: state your updated position (100 words max)
   - If HOLD: state what would need to be true to change your mind

RULES:
- You MUST disagree with at least one other position.
  "I agree with everyone" is not acceptable.
- Attack arguments, not personas.
- Be specific: reference actual trade-offs, not abstract principles.
```

## Step 8: Convergence Check

Tally the AGREE/DISAGREE answers and each persona's post-Round-1 position (revised or held), and write the tally down as the Agreement Map.

- **Converged** (a majority of personas now back the same core recommendation): skip to Step 9.
- **Diverged** (no majority, or a fundamental disagreement remains): run Round 2, dispatching ONLY the personas with unresolved disagreements. After the header:

```
This is the FINAL rebuttal round.

The council is split on: {the core disagreement}

Your position: {their current position}
Opposing position: {the strongest opposing position}

INSTRUCTIONS:
1. Make your strongest final argument (150 words max)
2. Acknowledge the strongest point from the opposition
3. State your FINAL position: SUPPORT / OPPOSE / ABSTAIN
4. State conditions under which you would change your vote
```

## Step 9: Synthesis

Read all rounds and write the report yourself, filling every section of `docs/templates/council-report.md` (if that template is missing, use these sections: Question, Recommendation with confidence, Key Arguments For and Against, Agreement Map, Dissenting Opinions, Unresolved Concerns, Conditions That Would Change This Recommendation, Vote Summary, Evidence Gathered, Debate Transcript).

Save to `docs/decisions/council-{YYYY-MM-DD}-{topic-slug}.md`.

In the Agreement Map, say in one or two sentences where seats on different models reached the same conclusion independently in Round 0, and where a split follows the model rather than the mandate. Weigh the first as strong evidence and the second as weak.

## Step 10: Present and Follow Up

Show the user the **recommendation** and **confidence level**, the **agreement map**, every **dissenting opinion**, and the **conditions** that would change the recommendation.

Ask: **"Accept this recommendation? Options:"**
- **Accept**: proceed with the recommendation
- **Accept as ADR**: save to `docs/decisions/` as a formal Architecture Decision Record, and add the new entry to `docs/decisions/README.md`
- **Dig deeper**: another round on a specific unresolved point (within the 3-round maximum)
- **Reframe**: the question was wrong; rephrase and re-run
- **Override**: the user decides differently; record the override and reasoning in the report

## Plan-Arbiter Mode (resolving competing plans)

Never average competing plans into a blend: choose one spine and graft the best ideas from the rest onto it.

1. **Normalize:** restate each plan in the same shape: goal, key decisions, file/area changes, risks, validation approach.
2. **Cross-review:** for each plan, list where it is stronger and weaker than the others. Check each against the real codebase (Read/Grep) and note which referenced files and symbols actually exist.
3. **Score on the ranked tiebreaker.** Apply in order; a higher criterion settles the choice before a lower one is considered:
   1. **Correctness:** does it actually solve the problem and meet the acceptance criteria?
   2. **Grounding:** is it anchored in real files, symbols, and constraints, not invented ones?
   3. **Simplicity:** is it the simplest approach that works (fewest moving parts)?
   4. **Validation robustness:** how well can it be tested and verified?
   5. **Execution cost:** effort, risk, and blast radius to implement.
4. **Decide and hand off:** name the winning plan, justify it against the tiebreaker, and graft the specific better ideas from the runners-up into it. Present one merged, executable direction in the shape of `docs/templates/plan-arbitration.md` (Decision, Ranked Comparison, Ideas Grafted from Runners-Up, Final Executable Direction).

**Reply:** the recommendation and confidence level, the vote summary with each seat's model, the agreement map, every dissenting opinion, the conditions that would change the recommendation, the path of the saved report, and the five follow-up options. In Plan-Arbiter Mode: the filled Plan Arbitration block.
