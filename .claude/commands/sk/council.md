---
description: Convene an advisory council — multiple personas debate a question and produce a decision report (project)
---

# Council — Multi-Persona Deliberation

Convene a council of AI personas with genuinely different perspectives to debate a strategic or architectural question. Produces a structured decision report with recommendation, dissent, and conditions.

**Use when:** Architecture decisions, technology choices, strategy questions, trade-off analysis, risk assessment, or any decision that benefits from adversarial thinking.

**Do NOT use for:** Implementation details (use `/sk:plan`), brainstorming features (use `/sk:brainstorm`), or debugging (use `/sk:debug`).

## Step 1: Read Context

**Read these first:**
1. `docs/system/project-context.md` — Project summary
2. `docs/system/tech-stack.md` — Current stack
3. `docs/architecture/README.md` — System design
4. `docs/decisions/README.md` — Previous decisions (avoid re-litigating settled questions)

**Skip files that are empty or contain only template placeholders.**

## Step 2: Frame the Question

Ask the user: **"What question should the council deliberate?"**

Classify the question type:

| Type | Example | Default Council |
|------|---------|----------------|
| **Binary decision** | "Should we use Redis or Memcached?" | 3 personas |
| **Multi-option** | "What auth strategy should we adopt?" | 3-5 personas |
| **Open exploration** | "How should we handle scaling?" | 5 personas |
| **Risk assessment** | "What could go wrong with this migration?" | 3 personas (Adversary-heavy) |

Restate the question clearly and confirm with the user before proceeding.

## Step 3: Select Council Composition

### Default Council (3 personas)

| Persona | Mandate | Bias |
|---------|---------|------|
| **The Pragmatist** | Ship working software fast. Every abstraction is a liability until proven otherwise. | Against over-engineering, premature abstraction, speculative features. Would rather copy-paste 3 lines than create a shared utility. |
| **The Architect** | Long-term system health above all. Tech debt compounds. Patterns exist for a reason. | Against shortcuts, "we'll fix it later," inconsistent patterns. Prefers proven solutions over novel ones. |
| **The Adversary** | Break the proposal. Find what everyone else missed. | Must find at least 3 failure modes, security holes, scaling limits, or edge cases. Cannot agree with the majority without identifying risks first. |

### Extended Council (5 personas — for high-stakes decisions)

Add these two:

| Persona | Mandate | Bias |
|---------|---------|------|
| **The User Advocate** | End-user experience is the only metric that matters. Developer convenience that hurts UX is unacceptable. | Against complexity users can feel — latency, confusing flows, poor error messages, accessibility gaps. |
| **The Operator** | Production reliability. If you can't debug it at 3am, don't ship it. | Against hidden complexity, poor observability, hard-to-diagnose failures, systems that need experts to operate. |

### Custom Personas

The user may request custom personas. If so, ensure each persona has:
1. A **clear mandate** (what they optimize for)
2. A **concrete bias** (what they're against — specific, not abstract)
3. A **disagreement requirement** (must challenge at least one other position)

Present the council composition and confirm: **"Council of {N}: {names}. Proceed?"**

## Step 4: Pre-Debate Research (Optional)

Ask: **"Should the council research before deliberating? (Recommended for technology choices.)"**

If yes:
1. Identify 2-3 specific questions the council needs answered
2. Dispatch a research subagent:
   ```
   Use Agent tool:
     description: "Research for council: {topic}"
     subagent_type: general-purpose
     model: sonnet
     prompt: |
       Research the following questions for a technical council deliberation:
       {questions}

       Search the web for current best practices, benchmarks, comparisons.
       Produce a neutral fact sheet — no recommendations, just evidence.
       Format: bullet points with sources.
   ```
3. The research output becomes **shared evidence** — all personas receive it equally

## Step 5: Round 0 — Independent Positions

**Critical: Zero cross-visibility.** Each persona forms their position without seeing others.

Dispatch ALL personas **simultaneously** (parallel Agent tool calls):

```
For each persona:
  Use Agent tool:
    description: "Council R0: {persona name}"
    subagent_type: general-purpose
    model: sonnet
    prompt: |
      You are {persona name} on an advisory council.

      YOUR MANDATE: {mandate}
      YOUR BIAS: {bias}

      QUESTION: {the question}

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

Collect all positions.

## Step 6: Summarize Round 0

Compress each persona's position to a structured summary:

```
{Persona}: {position in 1 sentence}
  - Arg 1: {key point}
  - Arg 2: {key point}
  - Arg 3: {key point}
  Confidence: {level}
```

This summary (not the full text) is shared in the next round.

## Step 7: Round 1 — Challenge

Dispatch ALL personas again **simultaneously**:

```
For each persona:
  Use Agent tool:
    description: "Council R1: {persona name}"
    subagent_type: general-purpose
    model: sonnet
    prompt: |
      You are {persona name} on an advisory council. This is the CHALLENGE round.

      YOUR MANDATE: {mandate}
      YOUR BIAS: {bias}

      QUESTION: {the question}

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

After Round 1, assess:

1. Count agreements vs disagreements across all personas
2. Check if positions have converged or diverged

**If converged** (most personas agree on core recommendation): Skip to Synthesis.

**If diverged** (fundamental disagreement remains): Run one more round.

### Round 2 — Rebuttal (only if needed)

Dispatch ONLY the personas with unresolved disagreements:

```
For each disagreeing persona:
  Use Agent tool:
    description: "Council R2: {persona name}"
    subagent_type: general-purpose
    model: sonnet
    prompt: |
      You are {persona name}. This is the FINAL rebuttal round.

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

The orchestrator (you) reads all rounds and produces the council report.

**Do NOT delegate synthesis to a subagent.** The orchestrator has full context and should produce the final report directly.

### Report Structure

Save to `docs/decisions/council-{YYYY-MM-DD}-{topic-slug}.md`:

```markdown
# Council Decision: {Topic}

**Date:** {today}
**Council:** {persona names}
**Rounds:** {number completed}
**Status:** Recommendation | Split Decision | Needs More Information

## Question

{The original question, clearly stated}

## Recommendation

{Clear, actionable recommendation in 2-3 sentences. If split decision, state the majority position.}

**Confidence:** High | Medium | Low
{Why this confidence level — what evidence supports it, what's uncertain}

## Key Arguments For

1. **{argument}** — raised by {persona}
   {supporting evidence}
2. **{argument}** — raised by {persona}
   {supporting evidence}

## Key Arguments Against

1. **{argument}** — raised by {persona}
   {supporting evidence}
2. **{argument}** — raised by {persona}
   {supporting evidence}

## Dissenting Opinions

{persona}: {their position and reasoning in 2-3 sentences}
> This dissent should be revisited if {condition}.

## Unresolved Concerns

- {concern} — raised by {persona}, not fully addressed
- {concern} — relevant if {condition}

## Conditions That Would Change This Recommendation

- If {condition}, reconsider {aspect}
- If {condition}, the Adversary's concerns become critical

## Vote Summary

| Persona | Position | Confidence | Key Reason |
|---------|----------|------------|------------|
| {name} | SUPPORT/OPPOSE/ABSTAIN | H/M/L | {1 sentence} |

## Evidence Gathered

{If pre-debate research was done, summarize key findings with sources}

## Debate Transcript

<details>
<summary>Round 0 — Independent Positions</summary>

### {Persona 1}
{full position}

### {Persona 2}
{full position}

...
</details>

<details>
<summary>Round 1 — Challenges</summary>

### {Persona 1}
{full challenge response}

...
</details>

{Round 2 if it occurred}
```

## Step 10: Present and Follow Up

Show the user:
1. The **recommendation** and **confidence level**
2. Any **dissenting opinions** that deserve attention
3. The **conditions** that would change the recommendation

Ask: **"Accept this recommendation? Options:"**
- **Accept** — Proceed with the recommendation
- **Accept as ADR** — Save to `docs/decisions/` as a formal Architecture Decision Record
- **Dig deeper** — Request another round on a specific unresolved point
- **Reframe** — The question was wrong; rephrase and re-run
- **Override** — User decides differently; record the override and reasoning

If accepted as ADR, also update `docs/decisions/README.md` with the new entry.

## Token Budget

| Configuration | Estimated Cost | When to Use |
|--------------|---------------|-------------|
| 3 personas, 2 rounds | ~15-20K tokens | Default for most decisions |
| 3 personas, 3 rounds | ~20-30K tokens | When Round 1 shows deep disagreement |
| 5 personas, 2 rounds | ~25-35K tokens | High-stakes architecture decisions |
| 5 personas, 3 rounds | ~35-50K tokens | Maximum depth, use sparingly |

Show estimate before dispatching: **"This council will use approximately {N} personas over {R} rounds (~{T}K tokens). Proceed?"**

## Guard Rails

- **No echo chambers:** Every persona MUST disagree with at least one other position
- **No groupthink:** Round 0 is always independent (zero cross-visibility)
- **No false consensus:** Record all dissent, even if outvoted
- **No debate theater:** Personas must reference specific evidence (codebase, research, data) — not abstract principles
- **No runaway costs:** Maximum 3 rounds. If no convergence after 3 rounds, report the split decision as-is
- **Research is pre-debate only:** Only the orchestrator triggers research, shared equally to all personas
