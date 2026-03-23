# File Structure Conventions

**Last updated:** 2026-03-23

## Project Root

```
sk/
├── cli.mjs                          ← CLI entry point (install/update/remove)
├── package.json                     ← npm package config
├── CLAUDE.md                        ← SK development instructions (NOT shipped)
├── Readme.md                        ← Public npm/GitHub README
├── pkg/                             ← EVERYTHING installed into target projects
│   ├── CLAUDE.md                    ← Template CLAUDE.md for target projects
│   ├── docs/                        ← Template documentation tree
│   │   ├── README.md                ← Master doc index
│   │   ├── architecture/            ← System design templates
│   │   ├── conventions/             ← Code style, structure, testing
│   │   ├── decisions/               ← ADR templates
│   │   ├── flows/                   ← Flow diagram templates
│   │   ├── research/                ← Research artifact templates
│   │   ├── reviews/                 ← Review report templates
│   │   ├── sop/                     ← Standard procedures
│   │   ├── system/                  ← Tech stack, schema, API templates
│   │   ├── tasks/                   ← Task board + examples
│   │   └── templates/               ← Starter templates for all doc types
│   └── .claude/                     ← Claude Code configuration
│       ├── commands/sk/             ← 29 slash commands
│       ├── agents/                  ← 4 agent definitions
│       └── skills/                  ← 7 skill definitions
├── .claude/                         ← Development copy (dogfooding)
│   ├── commands/sk/                 ← Same commands as pkg/
│   ├── agents/                      ← Same agents as pkg/
│   ├── skills/                      ← Same skills as pkg/
│   └── settings.json                ← SK-specific settings
├── docs/                            ← SK's own documentation (NOT shipped)
│   ├── README.md                    ← Master doc index
│   ├── architecture/                ← SK architecture docs
│   ├── conventions/                 ← SK code conventions
│   ├── decisions/                   ← SK ADRs
│   ├── flows/                       ← SK flow diagrams
│   ├── reports/                     ← Analysis and design reports
│   ├── research/                    ← Research artifacts
│   ├── reviews/                     ← Review reports
│   ├── sop/                         ← SK procedures
│   ├── system/                      ← SK system state
│   ├── tasks/                       ← SK task board
│   └── templates/                   ← Same as pkg/docs/templates/
└── .gitignore
```

## Rules

### Key Separation: pkg/ vs Root

- **`pkg/`** — Self-contained package: everything installed into target projects
- **Root `.claude/`** — Development copy for dogfooding (same files as `pkg/.claude/`)
- **Root `CLAUDE.md`** — SK development instructions. NOT shipped.
- **`pkg/CLAUDE.md`** — Template for target projects. Shipped.
- **Root `docs/`** — SK's own documentation. NOT shipped.
- **`pkg/docs/`** — Template documentation for target projects. Shipped.

### Editing Commands/Skills/Agents

When editing commands, agents, or skills: **edit in BOTH** root `.claude/` AND `pkg/.claude/`. Root is for local testing, `pkg/` is what ships.

### When to Create a New Directory

- **New command:** Add `{name}.md` to `pkg/.claude/commands/sk/` (and root copy)
- **New skill:** Create `pkg/.claude/skills/{name}/SKILL.md` (and root copy)
- **New agent:** Add `{name}.md` to `pkg/.claude/agents/` (and root copy)
- **New template:** Add to `pkg/docs/templates/`
- **New report:** Add to `docs/reports/` (SK-only, not shipped)

### File Size Limits

| File Type | Soft Limit | Notes |
|-----------|-----------|-------|
| `cli.mjs` | 600 lines | Single file by design, but keep sections clear |
| Command `.md` | 300 lines | Complex commands can be longer |
| `pkg/CLAUDE.md` | 100 lines | Every line costs context on every session |
| Skill `SKILL.md` | 400 lines | Include references as separate files |
