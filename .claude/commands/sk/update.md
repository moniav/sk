---
description: Update SK commands and templates to latest version (project)
---

# Update SK

Update the ShipKit slash commands, templates, lifecycle docs, and SOPs to the latest version — without touching your project-specific content.

## Step 1: Check Current State

1. Read `package.json` in the project root — check if `shipkit-cld` is referenced
2. Run `npx shipkit-cld@latest --version` or `npm view shipkit-cld version` to see the latest available version
3. Show the user what version they're on vs. what's available

## Step 2: Run the Update

Run the CLI update command:

```bash
npx shipkit-cld@latest update .
```

This updates **only** the SK system files:
- `.claude/commands/sk/` — all slash commands
- `docs/templates/` — document templates
- `docs/lifecycle/` — lifecycle guide
- `docs/sop/` — standard operating procedures
- `CLAUDE.md` — agent instructions

It **preserves** all user content:
- `docs/tasks/` — your task and epic files
- `docs/conventions/` — your code style and patterns
- `docs/system/` — your tech stack, schema, APIs
- `docs/architecture/` — your architecture docs
- `docs/decisions/` — your ADRs
- `docs/flows/` — your flow diagrams

## Step 3: Verify

After the update completes:

1. Confirm the command ran successfully (check output for `[SUCCESS]`)
2. Run `git diff` to show what changed
3. Present a summary of updated files to the user

## Step 4: Ask About Commit

Ask the user: **"SK updated. Want me to commit these changes?"**

If yes, commit with message: `chore: update shipkit-cld commands and templates`
