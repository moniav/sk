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
dev:       # No dev server: CLI tool
build:     # No build step: plain ES modules
test:      npm test            # scripts/check.mjs
sync:      npm run sync        # mirror pkg/.claude into the dogfood copy
evals:     npm run evals       # trigger evals on claude plugin eval; costs money
lint:      # No linter configured
typecheck: # No TypeScript
```

## Key Patterns

- **`pkg/` is everything that ships, and the plugin root.** `pkg/.claude-plugin/plugin.json` version must equal `package.json`.
- **Single-file CLI** (`cli.mjs`): `install`, `update`, `remove`, `init`. `init` scaffolds `docs/` and `CLAUDE.md` only, for plugin users.
- **Safe update:** the manifest (`.claude/.sk-manifest.json`) records a hash per shipped file. An edited file is kept and the new version is written beside it as `<name>.sk-new`. `pkg/.sk-baselines.json` (generated from release tags) holds the hashes of every released version.
- **Two channels, one source:** commands reference shared skills as `${CLAUDE_PLUGIN_ROOT}/.claude/...`; `cli.mjs` rewrites the prefix to `.claude/` when copying into a project. Skills read with the Read tool use paths relative to their own file.
- **Invocation:** six commands are model-invocable (`debug`, `resume`, `task-status`, `new-task`, `plan`, `review`); the other 48 run only when typed. A gated command or skill cannot be invoked by the model.
- **Models:** an agent's frontmatter is the only place its model is set. Commands and skills never set one.
- **Root `.claude/` is generated** by `npm run sync`. Edit `pkg/.claude/` only.

## Project Structure

```
sk/
├── cli.mjs                 CLI: install / update / remove / init
├── package.json            npm package config
├── .claude-plugin/         marketplace.json (installs the plugin from ./pkg)
├── scripts/                check, sync, baselines, evals, eval-summary (not shipped)
├── pkg/                    everything that ships; also the plugin root
│   ├── .claude-plugin/     plugin.json
│   ├── .sk-baselines.json  GENERATED: release file hashes
│   ├── CLAUDE.md           template for target projects (under 100 lines)
│   ├── docs/               template documentation tree
│   └── .claude/            commands (54), agents (9), skills (24)
├── .claude/                dogfood copy, written by npm run sync
├── docs/                   dogfood instance of the doc system (not shipped)
└── dev-docs/               plans, reports, guides, evals (not shipped)
```

## Shipped Content

| Category | Count | Location |
|----------|-------|----------|
| Slash commands | 54 | `pkg/.claude/commands/sk/` |
| Agents | 9 | `pkg/.claude/agents/`: implementer, spec-reviewer, plan-reviewer, quality-reviewer, security-reviewer, perf-reviewer, architecture-reviewer, dependency-analyzer, debugger |
| Skills | 24 | `pkg/.claude/skills/`: 11 model-invoked, 13 user-invoked or loaded by commands |
| Doc templates | 26 | `pkg/docs/templates/` |
| Convention docs | 7 | `pkg/docs/conventions/` |
| SOPs | 2 | `pkg/docs/sop/` |

## Gotchas

- `cli.mjs` must stay zero-dependency.
- Never edit `pkg/.sk-baselines.json` or root `.claude/` by hand: regenerate with `npm run baselines` and `npm run sync`.
- A release bumps `package.json` and `pkg/.claude-plugin/plugin.json` together. Plugin users only receive an update when the plugin version changes.
- `pkg/CLAUDE.md` is for target projects; root `CLAUDE.md` is for SK development.
- ASCII-only CLI output, for Windows consoles.
- No em dash in shipped docs or in new text (`pkg/.claude/skills/technical-writing/references/plain-writing-rules.md`).
- `claude plugin eval` needs git 2.31 or no git on the PATH, and cannot run cases that need `Bash` on native Windows.

## Current State

- **Version:** 2.0.0 published. Unreleased work on branches `feat/best-practices-wave-1` to `-wave-4`: see `dev-docs/planning/2026-10-best-practices-enhancement-plan.md`.
- **Status:** active development.
- **Next:** re-run the trigger evals, then merge and release the four waves. After that, decide on the project-local verify skill (`dev-docs/planning/2026-10-verify-skill-design-note.md`).
