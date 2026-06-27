# Skill & Command Authoring Guide

> Internal guide for writing SK skills, commands, and agents. **Not shipped** — this lives in SK's own `docs/`, not `pkg/`.
> Use it when adding or trimming any `pkg/.claude/**` file.

## The goal: predictable *process*, not predictable output

A good skill makes the agent's *behavior* reliable, not its prose. Optimize every line for "does this change what the agent does?" If it doesn't, it's dead weight that costs context on every load.

## The no-op test (how to trim)

Read each sentence in isolation and ask: **would removing this sentence change what the agent does?** If no, delete the whole sentence — don't just trim words. Skills accrete "sediment" (stale, redundant, or aspirational lines) over time; the no-op test is how you remove it. Apply it to existing files, not just new ones.

## Leading words

Front-load each instruction with a semantic anchor the model already understands from pretraining ("Reproduce the bug before…", "Never claim done without…"). A strong leading word improves both *execution* (the agent does the right thing) and *invocation* (model-invoked skills fire when they should).

## Invocation discipline (the context-cost decision)

Every skill's `description` loads on **every turn**. Classify each one (see also root `CLAUDE.md`):

- **Model-invoked** (default): the model should reach for it autonomously. Keep a trigger-rich `Use when…` description.
- **User-invoked only**: it only ever fires by hand. Add `disable-model-invocation: true` and trim the description to a one-line summary — it then costs no per-turn context.

Deciding question: *could the model usefully reach for this on its own?* If no → user-invoked.

## Information hierarchy

- **In the skill body:** the ordered steps with completion criteria — what the agent executes.
- **In sibling reference files** (`references/*.md`, or `docs/reference/**` for commands): heavy material consulted on demand.
- Push too little down and the body bloats; push too much down and you hide what the agent actually needs. The body should be runnable on its own; references add depth.

## Failure modes to audit against

| Failure mode | What it looks like |
|--------------|--------------------|
| **Premature completion** | Skill lets the agent claim done without evidence (see `verification-before-completion`) |
| **Duplication** | The same instruction restated in multiple files; they drift apart |
| **Sediment** | Stale layers from past edits that no longer match the flow |
| **Sprawl** | One skill trying to do five jobs — split it |
| **No-ops** | Sentences that read well but change no behavior |

## SK-specific conventions

- **Edit in both trees:** every `pkg/.claude/**` change must be mirrored to root `.claude/**` (dev/dogfood copy). Reference *data* under `pkg/docs/**` is shipped but not mirrored to root.
- **Framework-agnostic:** never assume Node/Python/etc. in a command or skill.
- **ASCII output:** use `[OK]/[WARN]/[ERROR]`, not Unicode symbols (Windows cp1255 safety).
- **Self-contained:** skills/agents must not hard-depend on files that may be absent — degrade gracefully ("skip if empty/placeholder").
- **Quantified close:** review/analysis commands end with a one-line tally so results are glanceable and comparable.
- **No fabricated metrics:** never state a number you didn't measure against a real baseline.
