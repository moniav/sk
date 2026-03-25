# Project Context

<!-- This is the single file every command reads first.
     Keep it dense, accurate, and under 100 lines.
     Update after every significant change. -->

## What is SK

SK (shipkit-cld) is a documentation and lifecycle system for Claude Code. It ships as an npm package that installs slash commands, agent definitions, skills, doc templates, and conventions into any project — giving Claude Code a structured Plan > Dev > Test workflow.

## Stack

- **Runtime:** Node.js >= 18
- **Language:** JavaScript (ES modules, zero TypeScript)
- **Dependencies:** Zero (stdlib only: `fs`, `path`, `readline`, `url`)
- **Package manager:** npm
- **Distribution:** npm registry as `shipkit-cld`

## Build Commands

```yaml
dev:       # No dev server — CLI tool
build:     # No build step — plain ES modules
test:      node cli.mjs /tmp/sk-test   # Test install into temp dir
lint:      # No linter configured
typecheck: # No TypeScript
```

## Key Patterns

- Single-file CLI (`cli.mjs`) — all install/update/remove logic in one file
- `pkg/` directory is the self-contained package shipped to users
- Root `.claude/` mirrors `pkg/.claude/` for dogfooding during SK development
- ANSI color helpers (no external deps) for CLI output
- Interactive prompts via `readline`

## Project Structure

```
sk/
├── cli.mjs                ← CLI entry point (install/update/remove)
├── package.json           ← npm package config (v1.5.0)
├── CLAUDE.md              ← SK development instructions
├── Readme.md              ← Public README
├── pkg/                   ← Everything installed into target projects
│   ├── CLAUDE.md          ← Template CLAUDE.md for target projects
│   ├── docs/              ← Template documentation tree
│   └── .claude/           ← Commands (32), agents (5), skills (11)
├── .claude/               ← Development copy (dogfooding)
├── docs/                  ← SK's own documentation (not shipped)
└── docs/reports/          ← Analysis reports and design docs
```

## Shipped Content

| Category | Count | Location |
|----------|-------|----------|
| Slash commands | 32 | `pkg/.claude/commands/sk/` |
| Agents | 5 | `pkg/.claude/agents/` (implementer, spec-reviewer, quality-reviewer, dependency-analyzer, architecture-reviewer) |
| Skills | 11 | `pkg/.claude/skills/` (test-driven-development, escalation-rules, legal-advisor, technical-diagrams, subagent-driven-development, verification-before-completion, git-worktrees, copywriting, error-recovery, context-priming, technical-writing) |
| Doc templates | 8 | `pkg/docs/templates/` |
| Convention docs | 5 | `pkg/docs/conventions/` |
| SOPs | 2 | `pkg/docs/sop/` |

## Gotchas

- `cli.mjs` must stay zero-dependency — only Node.js stdlib imports
- Edit commands in BOTH root `.claude/` AND `pkg/.claude/` — keep them in sync
- `pkg/CLAUDE.md` is for target projects, root `CLAUDE.md` is for SK development
- Root `docs/` is SK-specific; `pkg/docs/` is what ships to users
- ASCII-only CLI output (no Unicode symbols) for Windows compatibility

## Current State

- **Version:** 1.5.0
- **Status:** Active development, published on npm
- **Recent work:** Added `/sk:retro` (retrospectives), `/sk:migrate` (upgrades/migrations), `architecture-reviewer` agent, `error-recovery` skill, `context-priming` skill, `technical-writing` skill, convention graceful degradation, command decision matrix, skill interaction docs
- **Next:** Continued refinement of commands and skills
