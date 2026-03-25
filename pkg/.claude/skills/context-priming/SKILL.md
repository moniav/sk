---
name: context-priming
description: >
  Efficiently build a mental model of an unfamiliar codebase or module.
  Use at the start of new sessions, when entering unfamiliar code areas,
  or when onboarding to a new project. Reads files in priority order to
  maximize understanding per token.
---

# Context Priming

Systematic approach to understanding a codebase or module quickly and thoroughly.

## When This Activates

- First session on a new project
- Entering an unfamiliar area of a known codebase
- After `/sk:kickoff` to understand what was set up
- When the user says "get familiar with X" or "understand the X module"
- Before making changes to code you haven't worked with before

## Priority Reading Order

Build understanding layer by layer. Stop when you have enough context for the task.

### Layer 1: Project Identity (always read)
1. `CLAUDE.md` — project instructions and constraints
2. `docs/system/project-context.md` — what this project is, tech stack, key patterns
3. `package.json` / `pyproject.toml` / `go.mod` / `Cargo.toml` — dependencies and scripts

### Layer 2: Architecture (read for M+ tasks)
4. `docs/architecture/README.md` — system design, module boundaries
5. Entry points — `src/index.*`, `src/main.*`, `app.*`, `cli.*`
6. Directory structure — `ls` the top-level src directory to understand module layout

### Layer 3: Conventions (read before writing code)
7. `docs/conventions/code-style.md` — naming, patterns, import order
8. `docs/conventions/testing.md` — test patterns and requirements
9. `docs/conventions/file-structure.md` — where things go

### Layer 4: Domain-Specific (read for the area you'll work in)
10. The specific module/directory you'll be modifying
11. Tests for that module — they document expected behavior
12. Recent git history for that area — `git log --oneline -10 -- <path>`

### Layer 5: Active Work (read to understand current state)
13. `docs/tasks/.current` — what's in progress
14. `docs/tasks/README.md` — task board overview
15. Recent task files — what was done recently

## How to Build the Mental Model

As you read, construct this understanding:

1. **What does this project do?** (one sentence)
2. **What's the tech stack?** (language, framework, key libraries)
3. **How is it organized?** (module boundaries, layer structure)
4. **What are the key patterns?** (how do they do X here?)
5. **What's the current state?** (what's being worked on, any known issues)

## Rules

- Read before doing — never make changes to code you haven't read
- Don't read everything — stop at the layer that gives you enough context
- If docs are stale or missing, derive understanding from code (but note the doc gaps)
- Prioritize reading tests — they document intent, not just implementation
- For large codebases, focus on the relevant module, not the whole system
- Share your understanding with the user before starting work ("Here's what I understand about this module...")
