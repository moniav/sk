# Tech Stack

**Last updated:** 2026-10-05

## Core

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | JavaScript (ES modules) | ES2022 | Primary language |
| Runtime | Node.js | >= 18 | CLI runtime |
| Framework | None | — | Single-file CLI, no framework |
| Database | None | — | SK is stateless — installs files only |
| ORM | None | — | No database |
| Dependencies | Zero | — | stdlib only (`fs`, `path`, `readline`, `url`) |

## Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Plugin marketplace | GitHub (`moniav/sk`, `.claude-plugin/marketplace.json`) | Distribution: `claude plugin marketplace add moniav/sk` |
| Source code | GitHub | Version control |

## Dev Tools

| Tool | Purpose |
|------|---------|
| npm | Package manager and publishing |
| git | Version control with conventional commits |
| Claude Code | Development environment (dogfooding SK itself) |

## Key Dependencies

SK has **zero runtime dependencies** by design. The `package.json` has no `dependencies` or `devDependencies` fields. All functionality uses Node.js built-in modules:

| Module | Why We Use It |
|--------|--------------|
| `fs` | File system operations (copy, read, write, delete) |
| `path` | Path resolution and joining |
| `readline` | Interactive CLI prompts |
| `url` | `fileURLToPath` for `__dirname` in ES modules |
