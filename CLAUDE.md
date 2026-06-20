# CLAUDE.md — SK Development

> Instructions for developing the SK (shipkit-cld) package itself.

## What is SK

SK is a documentation & lifecycle system for Claude Code. It ships as an npm package (`shipkit-cld`) that installs:
- Slash commands (`.claude/commands/sk/`) — 34 lifecycle commands
- Agent definitions (`.claude/agents/`) — implementer, spec-reviewer, quality-reviewer, dependency-analyzer, architecture-reviewer
- Skills (`.claude/skills/`) — test-driven-development, escalation-rules, legal-advisor, technical-diagrams, subagent-driven-development, verification-before-completion, git-worktrees, copywriting, error-recovery, context-priming, technical-writing
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
│       ├── commands/sk/   ← 34 slash commands
│       ├── agents/        ← Agent definitions
│       └── skills/        ← Skill definitions
├── .claude/               ← DEVELOPMENT copy (for dogfooding SK)
│   ├── commands/sk/       ← Same commands, used during SK development
│   ├── agents/            ← Same agents
│   └── skills/            ← Same skills
└── docs/                  ← SK's own documentation (not shipped)
```

## Key Separation: pkg/ vs root

- **`pkg/`** — Self-contained package: everything that gets installed into target projects
- **Root `.claude/`** — Development copy for dogfooding (same files as `pkg/.claude/`)
- **Root `CLAUDE.md`** — SK-specific (this file). NOT shipped.
- **`pkg/CLAUDE.md`** — Template for target projects. Shipped.

When editing commands/agents/skills, edit in BOTH root `.claude/` AND `pkg/.claude/`.
Root is for testing locally, `pkg/` is what ships. Keep them in sync.
When editing `pkg/docs/` or `pkg/CLAUDE.md`, you're editing what users get on install.

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
