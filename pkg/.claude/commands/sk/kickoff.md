---
description: Set up the engineering foundation for a new project — stack research, conventions, build commands, optional repo scaffold
disable-model-invocation: true
---

# Project Kickoff

Turn a chosen stack into a working foundation: current best practices researched, conventions and build commands written, and (if wanted) the repo scaffolded. The product itself (problem, flows, requirements, architecture) is decided in `/sk:prd`, not here.

**Use when:** Starting a greenfield project. Run it after `/sk:prd` has approved the product PRD; it reads the stack from the PRD's ADRs. Without a PRD it asks only for the stack.
**Not for:** An existing codebase (`/sk:init-docs` derives the same docs from the code).

## Step 1: Read Existing State

If `docs/templates/` does not exist, the scaffold is missing. If `.claude/commands/sk/` does not exist in the project either (SK runs as a plugin), create it before anything else by running `node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" init . --yes` from the project root; it only fills gaps and never replaces a file.

Check what already exists:

1. `docs/prd/README.md`: the approved product PRD, if any. Read its Architecture section and the ADRs it lists in `docs/decisions/`: they name the stack, the components and the NFR targets this foundation must serve.
2. `docs/system/project-context.md` and `docs/system/tech-stack.md`, if filled in.
3. Use **Glob** to check for `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `pom.xml`, `Gemfile`. If one exists the project is not fully greenfield: pre-fill from it. If several exist (workspaces / monorepo), ask which package to target, or the workspace root, before proceeding.

## Step 2: Confirm the Stack

**With a PRD:** restate the stack from its ADRs in one line (language, framework, database, data layer, auth, styling, hosting) and ask only for what the PRD left open. Do not reopen decided ADRs; a change to the stack goes through `/sk:prd PRD-N amend`.

**Without a PRD:** say that the product decisions will be thinner for it, then ask for the platform (web app, API, CLI, mobile, desktop, library) and the stack via AskUserQuestion, offering 2–3 options with trade-offs when the user has not decided (e.g. "Next.js vs SvelteKit vs Remix"), and the usual parts: language and framework, database, data layer, auth, styling, hosting. Ask for the 3–5 core features in one line each, and any hard constraints (offline, multi-tenant, data residency, a mandated database).

## Step 3: Research Current Best Practices

Follow `${CLAUDE_PLUGIN_ROOT}/.claude/skills/research/SKILL.md` — **Deep tier** (stack selection feeds every
downstream decision; use the parallel subagent fan-out). Kickoff-specific angles:

1. **Structure & conventions** — `{framework}` recommended project structure, naming
   conventions, testing practices (current year)
2. **Ecosystem** — recommended libraries for auth/validation/testing with `{framework}`;
   `{ORM}`/`{database}` patterns (if applicable)
3. **Pitfalls** — `{framework}` common mistakes to avoid
4. **Versions** — latest stable versions of every chosen dependency — **registry pages
   or official release notes only** (primary-source rule; never from model memory)

Extract: recommended directory layout, naming conventions, key patterns, exact
dependency versions (with source links), and stack-specific pitfalls.

## Step 4: Generate Foundation Docs

Using the stack, the PRD (if any) AND the research results, generate these files:

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
- Link to the product PRD (if any)

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

If the PRD already recorded the stack choices as ADRs, add the researched versions and any pitfall that changes the decision to those ADRs; do not create duplicates. Otherwise create ADR files for the most significant stack choices:
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

Next step: {with a PRD: /sk:plan on the first task of EPIC-1 | without: /sk:prd to define the product, or /sk:new-task for a first task}
```

Ask (AskUserQuestion): **"Stand up your executive team?"** — if yes, suggest the
founding order for greenfield: `/sk:ceo` first (mission, goals, anti-goals), then
`/sk:cto` (ratify the stack research, confirm the autonomy grant). The CMO joins
pre-launch.

Then ask (with a PRD): **"Start planning the first task of EPIC-1? (/sk:plan)"**; without one: **"Define the product with /sk:prd now?"**
