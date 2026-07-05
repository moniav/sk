---
description: Bootstrap a new project — guided setup with best-practice research (project)
disable-model-invocation: true
---

# Project Kickoff

Set up a new project from scratch through guided conversation and current best-practice research. Generates all foundation docs so you can start building immediately.

**Use when:** Starting a greenfield project. Replaces manually filling in tech-stack.md, project-context.md, code-style.md, and CLAUDE.md build commands.

## Step 1: Read Existing State

Check what already exists:

1. If `docs/system/project-context.md` exists, read it
2. If `docs/system/tech-stack.md` exists, read it
3. Use **Glob** to check for: `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `Gemfile`
4. If a manifest file exists, read it — the project isn't fully greenfield, pre-fill answers from it. If multiple package manifests exist (workspaces / monorepo), ask the user which package to target — or cover the workspace root — before proceeding.

## Step 2: Guided Conversation

Ask the user these questions. Adapt based on answers — skip what's obvious, dig deeper where it matters.

### Round 1: The Basics

Ask all of these together:

1. **What are you building?** (one sentence — e.g., "A SaaS invoicing platform", "A CLI tool for database migrations")
2. **Who is it for?** (e.g., "small businesses", "developers", "internal team")
3. **What platform?** (web app, API, CLI, mobile, desktop, library/package)

### Round 2: Stack

Based on the platform answer, either:

**A) Suggest a stack** if the user hasn't decided:
- Present 2-3 options with tradeoffs based on the project type
- e.g., for a web app: "Next.js (full-stack, React) vs SvelteKit (lighter, faster) vs Remix (nested routing, progressive enhancement)"

**B) Confirm the stack** if the user already knows:
- "You mentioned Next.js — what about: database (Postgres? SQLite?), ORM (Prisma? Drizzle?), auth (NextAuth? Clerk?), styling (Tailwind? CSS modules?)?"

Ask about:
- Language / framework
- Database (if applicable)
- ORM / data layer (if applicable)
- Auth approach (if applicable)
- Styling / UI (if frontend)
- Hosting target (Vercel, AWS, self-hosted, etc.)

### Round 3: Scope and Constraints

Ask:
- **What are the 3-5 core features?** (the MVP — what must work for this to be useful)
- **Any hard constraints?** (e.g., must be offline-capable, must support multi-tenancy, no vendor lock-in, must use specific DB)

## Step 3: Research Current Best Practices

Use **WebSearch** to research the chosen stack. Run these searches:

### Framework / Language
- `"{framework} {latest version} recommended project structure {current year}"`
- `"{framework} best practices {current year}"`
- `"{framework} common mistakes to avoid"`

### Database / ORM (if applicable)
- `"{ORM} {framework} recommended patterns {current year}"`
- `"{database} with {framework} setup guide {current year}"`

### Key Libraries
- `"{framework} recommended libraries {current year}"` (auth, validation, testing, etc.)
- Check latest stable versions of all chosen dependencies

### Conventions
- `"{language} naming conventions {framework}"`
- `"{framework} testing best practices {current year}"`

Use **WebFetch** on the most relevant results (official docs, reputable guides) to extract:
- Recommended project structure (directory layout)
- Naming conventions
- Key patterns (e.g., server components, repository pattern, middleware)
- Latest stable versions of all dependencies
- Common pitfalls specific to this stack

## Step 4: Generate Foundation Docs

Using the conversation answers AND research results, generate these files:

### 4a. `docs/system/tech-stack.md`

Fill in with:
- Exact framework + version (from research, use latest stable)
- All dependencies with versions
- Dev tooling (linter, formatter, test runner)
- Hosting / infrastructure

### 4b. `docs/system/project-context.md`

Fill in with:
- Stack summary (one line)
- Build commands
- Key patterns (from research)
- Project structure (from research — recommended layout for this stack)
- Gotchas (from research — common pitfalls)
- Current state: "Greenfield — no code yet"

### 4c. `docs/conventions/code-style.md`

Fill in with:
- Naming conventions for the chosen language/framework (from research)
- File naming patterns
- Import ordering
- Component/module patterns specific to the stack
- Error handling conventions

### 4d. `docs/conventions/file-structure.md`

Fill in with the recommended project structure for the chosen stack (from research).

### 4e. `CLAUDE.md` Build Commands section

Replace the placeholder comments with actual commands for the chosen stack:
```yaml
dev:       npm run dev        # or uvicorn, cargo run, etc.
build:     npm run build      # or python -m build, cargo build, etc.
test:      npm test           # or pytest, cargo test, etc.
lint:      npm run lint       # or ruff check, cargo clippy, etc.
typecheck: npx tsc --noEmit   # if applicable
```

### 4f. ADRs (1-2)

Create ADR files for the most significant stack choices:
- `docs/decisions/ADR-001-{framework-choice}.md` — Why this framework over alternatives
- `docs/decisions/ADR-002-{database-choice}.md` — Why this database (if applicable)

Update `docs/decisions/README.md` with the new entries.

### 4g. `docs/conventions/testing.md`

Fill in with testing conventions for the chosen stack (from research):
- Test runner and assertion library
- File naming and location conventions
- What to test at each level (unit, integration, e2e)
- Mocking patterns

## Step 5: Initialize Project (Optional)

Ask: **"Want me to scaffold the project structure too?"**

If yes:
- Create the recommended directory layout (from research)
- Initialize the package manifest (`npm init`, `cargo init`, etc.) if it doesn't exist
- Install core dependencies
- Set up linter/formatter config
- Create a minimal "hello world" entry point

If no:
- Skip — user will set up the project themselves

## Step 6: Summary and Next Steps

Present to the user:

```
[KICKOFF COMPLETE]

Project: {name}
Stack:   {framework} + {database} + {key libraries}

Files generated:
  docs/system/tech-stack.md         -- stack with current versions
  docs/system/project-context.md    -- dense project summary
  docs/conventions/code-style.md    -- {language} conventions
  docs/conventions/file-structure.md -- recommended layout
  docs/conventions/testing.md       -- test patterns
  docs/decisions/ADR-001-*.md       -- framework choice
  docs/decisions/ADR-002-*.md       -- database choice
  CLAUDE.md                         -- build commands filled in

Research applied:
  - {framework} v{version} (latest stable)
  - {key finding from research}
  - {key finding from research}

Next step: Run /sk:brainstorm to define your first feature
```

Ask: **"Want to brainstorm your first feature now? (/sk:brainstorm)"**
