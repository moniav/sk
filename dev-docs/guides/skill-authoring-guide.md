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

Rules settled in the 2026-10 review (all enforced by `npm test`):

- **Commands:** only `debug`, `resume`, `task-status`, `new-task`, `plan` and `review` are model-invocable. Every other command sets `disable-model-invocation: true`.
- **A gated command or skill cannot be reached through the Skill tool.** Claude Code refuses the call. A command that reuses another reads its file; it never says "run `/sk:x`". A scheduled prompt starts with the slash command itself.
- **A skill that commands load by path** (`git-commit-flow`, `subtask-execution`, `research`, `executive-meeting`) is gated and also sets `user-invocable: false`, so it stays out of the `/` menu.
- **A skill that must be reachable by name from outside SK** (`headless-operation`, named in stored scheduled prompts) stays model-invocable.

## Writing a description

The listing has a budget of about 1% of the context window, shared with every other installed skill. When it overflows, Claude Code drops descriptions and keeps only names, and a bare name gives the model nothing to match.

- 200 to 300 characters.
- Third person: what the skill does, then `Use when` and the triggers.
- One trigger per distinct case. No lists of `/sk:` command names.
- A user-invoked description is one human-facing line with no trigger list.
- Measure a change with `npm run evals` (see `skill-evals.md`), before and after.

## Paths

SK ships as a plugin and as files copied into a project. A shipped file never names an install path directly.

| Where the reference is written | Write |
|--------------------------------|-------|
| A command, pointing at a skill or another command | `${CLAUDE_PLUGIN_ROOT}/.claude/skills/<name>/SKILL.md` |
| A skill or agent that is read with the Read tool, pointing at a sibling | A path relative to that file: `../other-skill/SKILL.md` |
| A skill's own bundled file, used in a shell command | `${CLAUDE_SKILL_DIR}/references/<file>` |
| A skill's own bundled file, in prose | `references/<file>` ("in this skill's directory") |
| An agent | Its type: `implementer` (`sk:implementer` under the plugin) |
| A model-invocable skill | "Call the Skill tool with `<name>`", one call per skill |

Variables are substituted only in content Claude Code loads itself (a command, or a skill invoked through the Skill tool). A file opened with the Read tool is plain text.

## Models

Commands and skills never set `model`. An agent's frontmatter is the only place its model is chosen, by alias: `inherit` for judgement-heavy agents, `sonnet` for bounded ones, `haiku` for mechanical ones. The two dispatch-time exceptions live in `escalation-rules`.

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

- **Edit in `pkg/` only:** change `pkg/.claude/**`, then run `npm run sync` to write the root `.claude/**` dogfood copy. Reference *data* under `pkg/docs/**` is shipped but not mirrored to root.
- **Framework-agnostic:** never assume Node/Python/etc. in a command or skill.
- **ASCII output:** use `[OK]/[WARN]/[ERROR]`, not Unicode symbols (Windows cp1255 safety).
- **Self-contained:** skills/agents must not hard-depend on files that may be absent — degrade gracefully ("skip if empty/placeholder").
- **Quantified close:** review/analysis commands end with a one-line tally so results are glanceable and comparable.
- **No fabricated metrics:** never state a number you didn't measure against a real baseline.
