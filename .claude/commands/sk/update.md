---
description: Update SK commands and templates to latest version (project)
---

# Update SK

Update the ShipKit slash commands, templates, agents, skills, and SOPs to the latest version — without touching your project-specific content.

## Step 1: Determine Source

Check how SK was installed by reading `.claude/.sk-source` (if it exists).

**Three update paths:**

1. **Saved local source** — `.claude/.sk-source` exists and points to a valid SK checkout:
   ```bash
   # Use the saved path (shown in .sk-source)
   node <saved-path>/cli.mjs update .
   ```

2. **Explicit local source** — user specifies a path:
   ```bash
   node /path/to/sk/cli.mjs update .
   # or
   npx shipkit-cld update . --from /path/to/sk
   ```

3. **npm (latest published version)** — no local source:
   ```bash
   npx shipkit-cld@latest update .
   ```

Ask the user which source to use if `.sk-source` doesn't exist:
- **"Update from npm (latest published)?"** — use path 3
- **"Update from local SK checkout?"** — ask for path, use path 2

## Step 2: Run the Update

Run the appropriate command from Step 1.

This updates **only** the SK system files:
- `.claude/commands/sk/` — all slash commands
- `.claude/agents/` — agent definitions
- `.claude/skills/` — active skills
- `docs/templates/` — document templates
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
2. Run `git diff --stat` to show what changed
3. Present a summary of updated files to the user

## Step 4: Ask About Commit

Ask the user: **"SK updated. Want me to commit these changes?"**

If yes, commit with message: `chore: update shipkit-cld commands and templates`
