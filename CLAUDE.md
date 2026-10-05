# CLAUDE.md — SK Development

> Instructions for developing the SK (shipkit-cld) package itself. Not shipped.

## What is SK

SK is a documentation and lifecycle system for Claude Code, shipped as a Claude Code plugin (ADR-003: the plugin is the only channel). Commands, agents and skills load from the plugin cache; a project holds only `docs/` and `CLAUDE.md`. The plugin provides:
- Slash commands (`.claude/commands/sk/`) — 55 lifecycle commands; the map is `pkg/.claude/commands/sk/help.md`
- Agents (`.claude/agents/`) — 9 reviewers and workers, dispatched by type
- Skills (`.claude/skills/`) — 28 skills: rules the model applies on its own, and procedures that commands load
- Doc templates and conventions (`pkg/docs/`) — the structured documentation system
- Template `CLAUDE.md` (`pkg/CLAUDE.md`) — bootstrap instructions for target projects

The idea-to-shipped flow the commands implement, one owner per step: `/sk:brainstorm` (direction) → `/sk:prd` (PRD and epics) → `/sk:kickoff` greenfield or `/sk:init-docs` brownfield (foundation) → `/sk:plan` → `/sk:dev` → `/sk:test` → `/sk:finish`.

## Repository Structure

```
sk/
├── CLAUDE.md              ← You are here (SK development instructions)
├── package.json           ← private: version, npm test, npm run dev
├── Readme.md              ← Public README
├── CHANGELOG.md           ← Unreleased section on top; upgrade notes when users must act
├── .claude-plugin/        ← marketplace.json: installs the plugin from ./pkg
├── scripts/               ← Dev tooling, not shipped: check (npm test), evals
├── pkg/                   ← EVERYTHING that ships; also the plugin root
│   ├── .claude-plugin/    ← plugin.json (version must equal package.json)
│   ├── cli.mjs            ← The script behind /sk:scaffold: init, update (docs), migrate
│   ├── CLAUDE.md          ← Template CLAUDE.md for target projects (100-line budget)
│   ├── docs/              ← Template documentation tree (blank templates, index stubs)
│   └── .claude/           ← commands/sk/, agents/, skills/
├── .claude/               ← settings.json only
├── docs/                  ← Dogfood MIRROR of pkg/docs/: same directories, SK's own content
└── dev-docs/              ← About building SK itself: planning/, reports/, guides/ (not shipped)
```

Three rules keep these apart:
- **Commands, agents, skills:** edit in `pkg/.claude/`. To try them, `npm run dev` starts Claude Code with `pkg/` loaded as the plugin (`claude --plugin-dir ./pkg`); `/reload-plugins` picks up edits in a running session.
- **`pkg/docs/` and `docs/`:** same directory structure, different content. A new doc home or template goes in both (blank in `pkg/`, SK's own in `docs/`), plus a row in `docs/README.md` and `docs/templates/README.md` of each.
- **SK product planning** (enhancement plans, analyses) goes in `dev-docs/`, never in `docs/`. Nothing in `pkg/` may mention SK development.

## Build Commands

```yaml
dev:       npm run dev                 # claude --plugin-dir ./pkg
build:     # No build step — plain ES modules
test:      npm test                    # scripts/check.mjs: counts, frontmatter, gating, paths, plugin manifest, init/update/migrate regression
           node pkg/cli.mjs init /tmp/sk-test --yes   # Manual scaffold into a temp dir
lint:      # No linter configured
typecheck: # No TypeScript — plain JavaScript
```

## Development Workflow

SK itself follows the Quick Path for most changes (XS/S complexity):
1. Edit the relevant file in `pkg/` (command, agent, skill, template, `cli.mjs`)
2. `npm test`, and read its warnings: em-dashes in `pkg/` markdown, and the size of the always-loaded description listing
3. For a command or skill change: try it with `npm run dev` in a scratch project (`node pkg/cli.mjs init <dir> --yes` scaffolds its docs)
4. For a change to a description, a trigger or a prompt's length: `npm run evals` before and after (`dev-docs/guides/skill-evals.md`; it costs money)
5. Add a line under `## Unreleased` in `CHANGELOG.md`; commit with conventional format

For M+ changes, use the SK commands themselves (dogfooding).

## What `npm test` enforces

Fix the cause, not the check.

- **Counts.** "N commands / skills / agents" in `package.json`, `pkg/.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `Readme.md`, this file and `docs/user-guides/install-as-plugin.md` must match the file system. A new command or skill means editing all six.
- **Every command appears in `help.md`.** It is the map; a command missing from it is one nobody finds.
- **Gating.** Only `debug`, `resume`, `task-status`, `new-task`, `plan` and `review` may be started by the model; their descriptions carry a "Use when" trigger. Every other command sets `disable-model-invocation: true`. A command never tells the model to run a gated command; it reads that command's file, or suggests the user run it.
- **Report-only commands** (`code-review`, `perf-review`, `security-review`, `ui-review`, `docs-audit`, `debt`, `recap`, `task-status`, `review`) disallow `Edit`.
- **Internal skills** (procedures loaded by commands: `git-commit-flow`, `subtask-execution`, `research`, `executive-meeting`, `interviewing`, `prototype`, `product-brief`, `flow-design`, `architecture-design`) set `disable-model-invocation: true` and `user-invocable: false`, so they cost no per-turn context. `headless-operation` stays model-invocable because scheduled prompts reach it by name. A new internal skill is added to `INTERNAL_SKILLS` in `scripts/check.mjs`.
- **Frontmatter.** Skill names are lowercase and match their directory; descriptions are under 1024 characters; a skill body is under 500 lines; a reference file over 100 lines opens with a contents list.
- **Agents.** Each names its model by alias; `debugger`, `architecture-reviewer` and `plan-reviewer` inherit, so they are never weaker than the session.
- **Scaffold regression.** `init` lands every doc and never replaces one; `update` keeps edits (sidecar) and the user's own files; `migrate` removes only SK's copies from a 2.x project; the script runs from a plugin-layout copy of `pkg/`.

## Paths inside shipped files

Shipped files live in the plugin cache, so they never name a path directly:
- **In a command:** `${CLAUDE_PLUGIN_ROOT}/.claude/skills/<name>/SKILL.md`; Claude Code substitutes the variable when it loads the command.
- **In a skill or agent, read with the Read tool:** a path relative to that file (`../other-skill/SKILL.md`). No variable is substituted there.
- **A skill's own bundled file used in a shell command:** `${CLAUDE_SKILL_DIR}/references/<file>`.
- **Agents:** dispatch by type (`implementer`; `sk:implementer` under the plugin), never by reading the agent file.

## Constraints

- `pkg/cli.mjs` must work with Node.js >= 18, no dependencies, and run from a bare copy of `pkg/` (the plugin cache has no `package.json` and no parent folder)
- Commands must be language/framework agnostic — never assume Node.js, Python, etc.
- Templates must use placeholder comments, not hardcoded values
- Skills and agents must be self-contained (no cross-references that break if files are missing)
- `pkg/CLAUDE.md` stays under 100 lines — every line costs context in every session of every user
- Text adapted from another repository keeps its provenance: a credit line in the file and in `CHANGELOG.md`

### Skill invocation discipline

A skill's `description` is loaded into context on **every turn** so the model can decide whether to fire it: a standing context tax. Classify every skill:
- **Model-invoked** — the model should reach for it on its own (the dev loop, a topic mention). Keep a trigger-rich "Use when…" description.
- **User-invoked only** — fired by hand (`context-priming`). `disable-model-invocation: true`, one-line description.
- **Internal** — loaded by commands, never by hand. Both flags, as listed above.

The deciding question: *could the model usefully reach for this on its own?* If no, it is not model-invoked.

## Release Process

1. Update version in `package.json` **and** `pkg/.claude-plugin/plugin.json` (they must match; plugin users only receive an update when the plugin version changes)
2. Update changelog (or use `/sk:changelog`): rename `Unreleased` to the version, keep an `**Upgrade notes:**` block if users must act
3. `npm test`, and `claude plugin validate . --strict` where the claude CLI is available
4. Commit, tag `vX.Y.Z`, `git push --tags`. The marketplace points at this repository, so the tag is the release; nothing is published to npm.

## Session Continuity

Use `/sk:resume` to pick up where you left off; `docs/tasks/.current` holds the active work context. Save SK-specific gotchas to Claude Code memory, decisions to `docs/decisions/`, work state to the task file.
