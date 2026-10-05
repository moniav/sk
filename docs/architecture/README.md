# Architecture

> System design and component relationships for SK.

**Last updated:** 2026-10-05
**Lifecycle:** current
**Source:** `pkg/cli.mjs`, `pkg/`, `.claude-plugin/`, `scripts/`, `package.json`

## Overview

SK is a set of prompt files (commands, skills, agents), a documentation tree, and a small script that scaffolds the tree into a project.
There is no runtime server, database or API.
`pkg/` is the plugin root and the only thing that ships: Claude Code caches it, and a project holds only `docs/` and `CLAUDE.md` (ADR-003).

```mermaid
graph TD
    PKG["pkg/ is everything that ships<br/>56 commands, 9 agents, 28 skills<br/>doc templates, CLAUDE.md template"]

    PKG -->|"Plugin channel<br/>claude plugin install sk@shipkit"| CACHE["Claude Code plugin cache<br/>commands, agents, skills<br/>outside the project"]
    PKG -->|"Plugin channel<br/>/sk:scaffold"| PDOCS["Project<br/>docs/ and CLAUDE.md"]
    PKG -->|"Development<br/>npm run dev = claude --plugin-dir ./pkg"| DOG["Claude Code session<br/>with the working tree as the plugin"]

    PDOCS --> MAN1["Manifest .claude/.sk-manifest.json<br/>channel: plugin, hash per shipped doc"]
```

## Scaffold script (`pkg/cli.mjs`)

| Command | Function |
|---------|----------|
| `node cli.mjs init [target] [--minimal]` | Scaffold `docs/` and `CLAUDE.md`. Fills gaps, never replaces a file. Run by `/sk:scaffold` as `node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" init .` |
| `node cli.mjs update [target]` | Refresh the shipped docs one file at a time, keeping user edits. Flags: `--dry-run`, `--yes`, `--force`. Run by `/sk:scaffold update` |
| `node cli.mjs migrate [target]` | Remove the commands, agents and skills SK 2.x copied into `.claude/`; keep the user's files, `docs/` and `CLAUDE.md`. Run by `/sk:scaffold migrate` |

## Component Index

| Component | Location | Purpose |
|-----------|----------|---------|
| Scaffold script | `pkg/cli.mjs` | init, update (docs), migrate. Zero dependencies; ships inside the plugin |
| Payload and plugin root | `pkg/` | Everything that ships |
| Plugin manifest | `pkg/.claude-plugin/plugin.json` | Name `sk`, version (equals `package.json`), component paths |
| Marketplace | `.claude-plugin/marketplace.json` | Marketplace `shipkit`, installs `sk` from `./pkg` |
| Commands | `pkg/.claude/commands/sk/` | 56 slash commands; six are model-invocable |
| Agents | `pkg/.claude/agents/` | implementer, spec-reviewer, plan-reviewer, quality-reviewer, security-reviewer, perf-reviewer, architecture-reviewer, dependency-analyzer, debugger |
| Skills | `pkg/.claude/skills/` | 28 skills: 11 model-invoked, 17 user-invoked or loaded by commands (internal: research, interviewing, product-brief, flow-design, architecture-design, prototype, git-commit-flow, subtask-execution, executive-meeting, headless-operation) |
| Doc templates | `pkg/docs/templates/` | 27 templates |
| Conventions | `pkg/docs/conventions/` | Code style, coding behaviour, file structure, git workflow, testing, doc lifecycle, delegation policy |
| Check script | `scripts/check.mjs` | `npm test`: counts, frontmatter, gating, paths, models, plugin manifest, and init / update / migrate regressions |
| Evals | `dev-docs/evals/`, `scripts/evals.mjs` | Trigger cases run on `claude plugin eval` |

## How the pieces load

- **A command** is loaded by Claude Code when the user types it (or, for six of them, when the model chooses it). Claude Code substitutes `${CLAUDE_PLUGIN_ROOT}` in its body.
- **A shared skill** such as `git-commit-flow` or `flow-design` is read by a command with the Read tool (`/sk:prd` is a thin orchestrator over `product-brief`, `flow-design`, `architecture-design` and `prototype`, so other commands reuse the same procedures). Nothing is substituted in a file read that way, so it refers to sibling skills by relative path.
- **A model-invoked skill** is listed to the model by its description and loaded when the model calls the Skill tool.
- **An agent** is dispatched by type (`implementer`, or `sk:implementer` under the plugin). Its frontmatter sets its tools, its model and any skills preloaded into it.
- **Three behaviour rules** (evidence before done, stop after three failed attempts, what "just do it" permits) are always on through the project's `CLAUDE.md`.

## Key Design Principles

1. **Zero dependencies.** The CLI uses only the Node.js standard library.
2. **One source, two channels.** `pkg/` is both the plugin root and what the CLI copies; a path rewrite on copy is the only difference.
3. **Updates never destroy user work.** A per-file hash decides between overwrite, keep with a sidecar, and skip. See [Safe update](../flows/safe-update.md).
4. **Context is a budget.** Only six commands and eleven skills put a description in every turn. Everything else is user-invoked.
5. **Language agnostic.** Commands never assume a language or framework.
6. **Proof over claims.** Gates end on something that can be shown: command output, a file, a count.
7. **Dogfooding.** Root `.claude/` is generated from `pkg/.claude/` so SK is developed with SK.

## Related

- [Install channels flow](../flows/install-channels.md)
- [Safe update flow](../flows/safe-update.md)
- [ADR-002: plugin distribution](../decisions/ADR-002-plugin-distribution.md)

The earlier SVG architecture diagram (v1.6, 29 commands) is in [`_archive/`](../_archive/README.md).
