---
description: Document a feature/subsystem — verified against code, into docs/features/
argument-hint: "[feature or subsystem name]"
disable-model-invocation: true
---

# New Feature Doc

Create per-feature documentation in `docs/features/` by reading the actual code — the same
discipline as `/sk:new-flow` and `/sk:new-adr`. Documents what *ships today*, not
aspirations.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Write the text to the rules in `${CLAUDE_PLUGIN_ROOT}/.claude/skills/technical-writing/references/plain-writing-rules.md` (`docs/business/brand-voice.md` overrides them if it exists).

**Use when:** A feature or subsystem is worth a standalone explainer (what it does, how it
works, how to extend it). For system-level design use `docs/architecture/`; for diagrams
use `/sk:new-flow`.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — project summary (if it exists)
2. `docs/features/README.md` — existing feature docs (avoid duplication)
3. `docs/architecture/README.md` — system components (for cross-links)

**Skip files that are empty or contain only template placeholders.**

## Step 2: Identify the Feature

Confirm with the user which feature/subsystem to document and where its code lives. If
unclear, use **Glob**/**Grep** to locate the entry point and propose the scope.

## Step 3: Trace the Code (no aspirational docs)

**Do not guess — read the actual code.** This is the core requirement.

1. Find the entry point(s) — route, handler, command, exported API.
2. Follow the execution path; note key modules, data/state, external calls.
3. Identify how the feature is used and where it's extended.
4. Note edge cases, limitations, and error paths.

Use **Grep** to find the entry point, then **Read** to follow each file. **Verify every
capability you intend to document against code** — if it isn't in the code, don't write it.

## Step 4: Write the Doc

Create `docs/features/{feature-name}.md` from `docs/templates/feature-doc.md`.
If `docs/features/` doesn't exist yet (minimal install), create it with a stub README index first.

- Fill `Last updated` (today) and `Lifecycle: current`.
- Set `Status` to `shipped` only for behavior verified in Step 3; mark partial work
  `in-progress` / `planned`.
- Cite real code as `path:symbol`. Link to `architecture/` and `flows/` rather than
  duplicating them.

## Step 5: Update Index

Add a row to `docs/features/README.md`:

```markdown
| [Feature Name](./feature-name.md) | <one-line> | current |
```

## Validation

- [ ] Every documented capability is backed by real code (traced in Step 3)
- [ ] `Status` reflects what actually ships (no aspirational "shipped")
- [ ] `Last updated` + `Lifecycle` frontmatter filled in
- [ ] Code references use `path:symbol`; no duplicated architecture/flow content
- [ ] Added to `docs/features/README.md`
