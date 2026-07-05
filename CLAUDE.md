# CLAUDE.md — SK Development

> Instructions for developing the SK (shipkit-cld) package itself.

## What is SK

SK is a documentation & lifecycle system for Claude Code. It ships as an npm package (`shipkit-cld`) that installs:
- Slash commands (`.claude/commands/sk/`) — 48 lifecycle commands
- Agent definitions (`.claude/agents/`) — implementer, spec-reviewer, quality-reviewer, dependency-analyzer, architecture-reviewer, debugger, security-reviewer, perf-reviewer
- Skills (`.claude/skills/`) — test-driven-development, escalation-rules, legal-advisor, technical-diagrams, subagent-driven-development, verification-before-completion, git-worktrees, copywriting, error-recovery, context-priming, technical-writing, plow-ahead, stay-within-limits, competitor-analysis, pricing-strategy, product-marketing-context, operations-advisor, create-pdf, git-commit-flow, subtask-execution, research, headless-operation
- Doc templates and conventions (`pkg/docs/`) — structured documentation system
- Template CLAUDE.md (`pkg/CLAUDE.md`) — bootstrap instructions for target projects

## Repository Structure

```
sk/
├── CLAUDE.md              ← You are here (SK development instructions)
├── cli.mjs                ← CLI entry point (install/update/remove)
├── package.json           ← npm package config
├── Readme.md              ← Public README
├── pkg/                   ← EVERYTHING installed into target projects
│   ├── CLAUDE.md          ← Template CLAUDE.md for target projects
│   ├── docs/              ← Template documentation tree
│   └── .claude/           ← Commands, agents, skills
│       ├── commands/sk/   ← 48 slash commands
│       ├── agents/        ← Agent definitions
│       └── skills/        ← Skill definitions
├── .claude/               ← DEVELOPMENT copy (for dogfooding SK)
│   ├── commands/sk/       ← Same commands, used during SK development
│   ├── agents/            ← Same agents
│   └── skills/            ← Same skills
├── docs/                  ← Dogfood MIRROR of pkg/docs/ (not shipped) — SK uses its own doc system
└── dev-docs/              ← Meta docs about building SK itself (not shipped, not a mirror)
    ├── planning/          ← Enhancement plans, roadmaps
    ├── reports/           ← Analyses, assessments
    └── guides/            ← Contributor/authoring guides
```

## Key Separation: pkg/ vs root

- **`pkg/`** — Self-contained package: everything that gets installed into target projects
- **Root `.claude/`** — Development copy for dogfooding (same files as `pkg/.claude/`)
- **Root `CLAUDE.md`** — SK-specific (this file). NOT shipped.
- **`pkg/CLAUDE.md`** — Template for target projects. Shipped.

When editing commands/agents/skills, edit in BOTH root `.claude/` AND `pkg/.claude/`.
Root is for testing locally, `pkg/` is what ships. Keep them in sync.
When editing `pkg/docs/` or `pkg/CLAUDE.md`, you're editing what users get on install.

### docs/ vs dev-docs/

- **Root `docs/`** is SK's dogfood instance of the shipped doc system. It mirrors the
  **structure** of `pkg/docs/` 1:1 (same directories / doc-types) but holds SK's own
  **filled-in content** — `pkg/docs/` ships blank templates; `docs/` is them filled in.
  So files differ in *content*, never in *which directories exist*. When you add a new
  doc-home/section to `pkg/docs/`, add the matching empty home to `docs/` too (keep the
  structure 1:1). Do NOT drop SK product-planning docs here — those go in `dev-docs/`.
- **`dev-docs/`** is for everything about evolving SK the product (plans, analyses, contributor
  guides). Not shipped, not part of the doc-system structure. See `dev-docs/README.md`.

## Build Commands

```yaml
dev:       # No dev server — SK is a CLI tool
build:     # No build step — plain ES modules
test:      node cli.mjs /tmp/sk-test   # Test install into temp dir
lint:      # No linter configured
typecheck: # No TypeScript — plain JavaScript
```

## Development Workflow

SK itself follows the Quick Path for most changes (XS/S complexity):
1. Edit the relevant file (command, template, skill, cli.mjs)
2. Test manually: `node cli.mjs /tmp/sk-test` for CLI changes
3. For command changes: test in a target project
4. Commit with conventional format

For M+ changes, use the SK commands themselves (dogfooding).

## Constraints

- `cli.mjs` must work with Node.js >= 18, no dependencies (zero-dep package)
- Commands must be language/framework agnostic — never assume Node.js, Python, etc.
- Templates must use placeholder comments, not hardcoded values
- Skills and agents must be self-contained (no cross-references that break if files are missing)
- `.claude/commands/sk/` files are the product — test changes in real projects
- `pkg/CLAUDE.md` should stay under 100 lines — every line costs context on every session
- Never ship SK-specific content in `pkg/` (no references to SK development)

### Skill invocation discipline

A skill's `description` is loaded into context on **every turn** so the model can decide whether to auto-fire it — a standing context tax. When authoring/editing a skill, classify it:
- **Model-invoked** (default) — the model should reach for it autonomously (e.g. during the dev loop or on topic mention). Keep a trigger-rich "Use when…" description.
- **User-invoked only** — it only ever fires by hand (e.g. `context-priming`, a start-of-session tool). Add `disable-model-invocation: true` to the frontmatter and trim the description to a plain one-line summary, so it costs no per-turn context.

The deciding question: *could the model usefully reach for this on its own?* If no, make it user-invoked.

## Release Process

1. Update version in `package.json`
2. Update changelog (or use `/sk:changelog`)
3. `npm publish`
4. Tag: `git tag vX.Y.Z && git push --tags`

## Session Continuity

Use `/sk:resume` to pick up where you left off.
Check `docs/tasks/.current` for active work context.

## Memory Integration

Use Claude Code memory for cross-session context:
- **Save to memory:** User preferences, workflow patterns, SK-specific gotchas
- **Save to docs:** Technical decisions, conventions, architecture
- **Save to task files:** Current work state, progress, subtask status
