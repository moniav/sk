# Install SK as a Claude Code plugin

**Last updated:** 2026-10-04
**Lifecycle:** current
**Audience:** Developers who want SK's commands, skills and agents installed once through the Claude Code plugin system instead of copied into each project

## What you'll accomplish

SK's 55 commands, 24 skills and 9 agents installed once per machine and updated by Claude Code, while each project owns only its `docs/` tree and `CLAUDE.md`.

This is the recommended way to install SK.
Copy the files into the project instead (`npx shipkit-cld`) only when the project must pin its own SK version, because a plugin is one version per user.

## Before you start

- Claude Code with plugin support (`claude plugin` in your shell, or `/plugin` in a session)
- Node.js 18 or later, for the one-time docs scaffold
- A project that does not already have SK copied into it. If it has `.claude/commands/sk/`, see [Moving from copied files](#moving-from-copied-files).

## Steps

1. **Add the marketplace**, once per machine:

   ```bash
   claude plugin marketplace add moniav/sk
   ```

   - *What you'll see:* `Successfully added marketplace: shipkit`.

2. **Install the plugin:**

   ```bash
   claude plugin install sk@shipkit
   ```

   - *What you'll see:* `Successfully installed plugin: sk@shipkit`.

3. **Scaffold the docs** in each project that will use SK. Start Claude Code in the project and run:

   ```
   /sk:scaffold
   ```

   Add `--minimal` for the core doc homes only.
   The command runs the script that ships inside the plugin, so the docs match the plugin's version. It needs Node.js 18 or later.
   Outside Claude Code, `npx shipkit-cld init` does the same.
   - *What you'll see:* a count of files added to `docs/`, and `CLAUDE.md created`.
     If the project already has a `CLAUDE.md`, it is left alone and SK's template is written beside it as `CLAUDE.sk.md` for you to merge.
   - The scaffold only fills gaps. It never replaces a file, so it is safe on a project that already has `docs/`, and safe to run again.

4. **Verify.** Start a new Claude Code session in the project and run `/sk:task-status`.
   - *What you'll see:* the task board. Agents are available to Claude as `sk:implementer`, `sk:spec-reviewer` and so on.

5. **Start working.** Run `/sk:kickoff` in a new project, or `/sk:init-docs` in an existing codebase.

## Keeping it up to date

- **Commands, skills and agents:** `claude plugin update sk@shipkit`.
  To update automatically, open `/plugin`, go to Marketplaces, select `shipkit` and choose Enable auto-update. It is off by default.
- **Shipped docs in the project** (templates, SOPs, reference): `/sk:scaffold update`, after the plugin has been updated.
  Outside Claude Code, `npx shipkit-cld@latest update .` does the same.
  A file you edited is kept, and the new version is written beside it as `<name>.sk-new`.

## Sharing with a team

Run this once in the repository and commit the `.claude/settings.json` it writes:

```bash
claude plugin marketplace add moniav/sk --scope project
```

Each teammate gets the marketplace when they trust the folder, then installs the plugin.

## Moving from copied files

1. `npx shipkit-cld remove .` removes the copied commands, skills and agents and keeps `docs/`.
2. Install the plugin (steps 1 and 2 above).
3. `/sk:scaffold` fills any gaps in `docs/` and records that the project now uses the plugin.

Do not keep both. With the plugin and the copied files together, every command appears twice.

## If something goes wrong

| Symptom | Fix |
|---------|-----|
| `init` says SK is installed here as copied files | Follow [Moving from copied files](#moving-from-copied-files). |
| Commands appear twice | The project still has `.claude/commands/sk/`. Run `npx shipkit-cld remove .`. |
| `/sk:` commands are missing in a session | Run `claude plugin list` and check `sk@shipkit` is enabled, then start a new session. |
| An update did not arrive | Updates are delivered when the plugin's version changes. Run `claude plugin update sk@shipkit`. |
| `claude plugin details sk` shows "Agents (0)" | That command does not list agents declared in the manifest. They still load; ask Claude to list its `sk:` agent types to confirm. |
