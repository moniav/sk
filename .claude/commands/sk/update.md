---
description: Update SK commands and templates to latest version
disable-model-invocation: true
---

# Update SK

Update the ShipKit slash commands, templates, agents, skills, and SOPs to the latest version — without touching your project-specific content.

## Step 1: Determine Source

Check how SK was installed by reading `.claude/.sk-source` (if it exists).

**Skip files that are empty or contain only template placeholders.**

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

Preview first, then run for real. The CLI prompts for confirmation, which cannot be answered from here, so pass `--yes` on the real run:

```bash
<command from Step 1> --dry-run    # shows what would change, writes nothing
<command from Step 1> --yes
```

Show the user the dry-run summary before the real run.

The update touches **only** SK-managed files, one file at a time:
- `.claude/commands/sk/`, `.claude/agents/`, `.claude/skills/`
- `docs/templates/`, `docs/sop/`, `docs/reference/`
- `docs/commands-reference.md`, `docs/README.md`, `docs/conventions/coding-behavior.md`
- `CLAUDE.md`, only if SK created it and it has not been edited since

It **never overwrites the user's work**:
- A managed file with local edits is kept, and SK's new version is written beside it as `<name>.sk-new`
- The user's own files are left alone, including one that shares a name with an SK file
- `docs/tasks/`, `docs/system/`, `docs/architecture/`, `docs/decisions/`, `docs/flows/`, and the rest of `docs/conventions/` are not touched

Never pass `--force` unless the user asks for it: it replaces every managed file with SK's version and discards local edits.

## Step 3: Verify

After the update completes:

1. Confirm the command ran successfully (check output for `[SUCCESS]`)
2. Run `git diff --stat` to show what changed
3. Present a summary of updated files to the user
4. For every `[KEEP] ... has local changes` line: show the difference between the file and its `.sk-new` sidecar, and ask whether to merge, take SK's version (rename the sidecar over the file), or keep the local version (delete the sidecar)
5. Relay any upgrade notes the CLI printed

## Step 4: Ask About Commit

Ask the user: **"SK updated. Want me to commit these changes?"**

If yes, commit with message: `chore: update shipkit-cld commands and templates`
