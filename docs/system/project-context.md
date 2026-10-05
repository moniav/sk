# Project Context

<!-- This is the single file every command reads first.
     Keep it dense, accurate, and under 100 lines.
     Update after every significant change. -->

## What is SK

SK (shipkit-cld) is a documentation and lifecycle system for Claude Code.
It gives Claude a structured Plan > Dev > Test workflow, a doc tree to keep current, and review, debugging, release and go-to-market commands.
It ships two ways: as a Claude Code plugin (commands, skills and agents live outside the project), or as files copied into a project's `.claude/`. Either way the project owns its `docs/` tree and `CLAUDE.md`.

## Stack

- **Runtime:** Node.js >= 18
- **Language:** JavaScript (ES modules, no TypeScript)
- **Dependencies:** none (stdlib only: `fs`, `path`, `readline`, `url`, `crypto`)
- **Distribution:** Claude Code plugin `sk` from the `shipkit` marketplace (this repo); npm package `shipkit-cld`

## Build Commands

```yaml
dev:       npm run dev         # claude --plugin-dir ./pkg; /reload-plugins after edits
build:     # No build step: plain ES modules
test:      npm test            # scripts/check.mjs
evals:     npm run evals       # trigger evals on claude plugin eval; costs money
lint:      # No linter configured
typecheck: # No TypeScript
```

## Key Patterns

- **`pkg/` is everything that ships, and the plugin root.** `pkg/.claude-plugin/plugin.json` version must equal `package.json`.
- **Plugin only.** Commands, agents and skills load from the plugin cache and are never written into a project. `pkg/cli.mjs` (zero dependencies, ships inside the plugin, run by `/sk:scaffold`) has three jobs: `init` scaffolds `docs/` and `CLAUDE.md`, `update` refreshes the shipped docs, `migrate` removes the files SK 2.x copied into `.claude/`.
- **Safe docs update:** the manifest (`.claude/.sk-manifest.json`) records a hash per shipped doc. An edited file is kept and the new version is written beside it as `<name>.sk-new`.
- **Paths:** commands reference shared skills as `${CLAUDE_PLUGIN_ROOT}/.claude/...`, which Claude Code resolves to the plugin cache. Skills read with the Read tool use paths relative to their own file.
- **Invocation:** six commands are model-invocable (`debug`, `resume`, `task-status`, `new-task`, `plan`, `review`); the other 49 run only when typed. A gated command or skill cannot be invoked by the model.
- **Models:** an agent's frontmatter is the only place its model is set. Commands and skills never set one.
- **Dogfooding:** `npm run dev` starts Claude Code with the plugin loaded from `pkg/`. The repo's `.claude/` holds only `settings.json`.

## Project Structure

```
sk/
├── package.json            npm package config
├── .claude-plugin/         marketplace.json (installs the plugin from ./pkg)
├── scripts/                check, evals, eval-summary (not shipped)
├── pkg/                    everything that ships; also the plugin root
│   ├── cli.mjs             the script behind /sk:scaffold: init, update (docs), migrate
│   ├── .claude-plugin/     plugin.json
│   ├── CLAUDE.md           template for target projects (under 100 lines)
│   ├── docs/               template documentation tree
│   └── .claude/            commands (56), agents (9), skills (28)
├── .claude/                settings.json only
├── docs/                   dogfood instance of the doc system (not shipped)
└── dev-docs/               plans, reports, guides, evals (not shipped)
```

## Shipped Content

| Category | Count | Location |
|----------|-------|----------|
| Slash commands | 56 | `pkg/.claude/commands/sk/` |
| Agents | 9 | `pkg/.claude/agents/`: implementer, spec-reviewer, plan-reviewer, quality-reviewer, security-reviewer, perf-reviewer, architecture-reviewer, dependency-analyzer, debugger |
| Skills | 28 | `pkg/.claude/skills/`: 11 model-invoked, 17 user-invoked or loaded by commands |
| Doc templates | 27 | `pkg/docs/templates/` |
| Convention docs | 7 | `pkg/docs/conventions/` |
| SOPs | 2 | `pkg/docs/sop/` |

## Gotchas

- `pkg/cli.mjs` must stay zero-dependency.
- There is no dogfood copy of the commands any more: `npm run dev` loads `pkg/` as a plugin.
- A release bumps `package.json` and `pkg/.claude-plugin/plugin.json` together. Plugin users only receive an update when the plugin version changes.
- `pkg/CLAUDE.md` is for target projects; root `CLAUDE.md` is for SK development.
- ASCII-only CLI output, for Windows consoles.
- No em dash in shipped docs or in new text (`pkg/.claude/skills/technical-writing/references/plain-writing-rules.md`).
- `claude plugin eval` needs git 2.31 or no git on the PATH, and cannot run cases that need `Bash` on native Windows.

## Current State

- **Version:** 2.4.0 (`/sk:scaffold` on top of the four waves of `dev-docs/planning/2026-10-best-practices-enhancement-plan.md`).
- **Status:** active development.
- **Next:** run the trigger evals for Waves 3 and 4 (still open). Decide on the project-local verify skill (`dev-docs/planning/2026-10-verify-skill-design-note.md`).
