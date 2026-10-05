# Install SK as a Claude Code plugin

**Last updated:** 2026-10-05
**Lifecycle:** current
**Audience:** Developers installing SK

## What you'll accomplish

SK's 55 commands, 28 skills and 9 agents installed once per machine and updated by Claude Code, while each project owns only its `docs/` tree and `CLAUDE.md`.

The plugin is the only way to install SK since 3.0. Where it runs: everything in the Claude Code CLI and in Cowork; in the Claude web and desktop chat the skills and commands load but agents do not, so commands that dispatch agents (`/sk:review`, `/sk:implement`, `/sk:orchestrate`) need the CLI or Cowork.

## Before you start

- Claude Code with plugin support (`claude plugin` in your shell, or `/plugin` in a session)
- Node.js 18 or later, for the one-time docs scaffold
- If the project has `.claude/commands/sk/` from SK 2.x, see [Moving from SK 2.x](#moving-from-sk-2x) after step 2.

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
   - *What you'll see:* a count of files added to `docs/`, and `CLAUDE.md created`.
     If the project already has a `CLAUDE.md`, it is left alone and SK's template is written beside it as `CLAUDE.sk.md` for you to merge.
   - The scaffold only fills gaps. It never replaces a file, so it is safe on a project that already has `docs/`, and safe to run again.

4. **Verify.** Start a new Claude Code session in the project and run `/sk:task-status`.
   - *What you'll see:* the task board. Agents are available to Claude as `sk:implementer`, `sk:spec-reviewer` and so on.

5. **Start working.** Run `/sk:prd` for a new product or feature, or `/sk:init-docs` in an existing codebase.

## Keeping it up to date

- **Commands, skills and agents:** `claude plugin update sk@shipkit`.
  To update automatically, open `/plugin`, go to Marketplaces, select `shipkit` and choose Enable auto-update. It is off by default.
- **Shipped docs in the project** (templates, SOPs, reference): `/sk:scaffold update`, after the plugin has been updated.
  A file you edited is kept, and the new version is written beside it as `<name>.sk-new`.

## Sharing with a team

Run this once in the repository and commit the `.claude/settings.json` it writes:

```bash
claude plugin marketplace add moniav/sk --scope project
```

Each teammate gets the marketplace when they trust the folder, then installs the plugin.

## Moving from SK 2.x

Until 2.4, `npx shipkit-cld` copied the commands, skills and agents into the project's `.claude/`. The npm package is no longer published.

1. Install the plugin (steps 1 and 2 above).
2. `/sk:scaffold migrate` removes SK's copied files. Your own agents and skills, `docs/` and `CLAUDE.md` are kept.
3. `/sk:scaffold update` refreshes the shipped docs to the plugin's version.

Do not keep both. With the plugin and the copied files together, every command appears twice.

## If something goes wrong

| Symptom | Fix |
|---------|-----|
| `/sk:scaffold` says an older SK copied its files here | Run `/sk:scaffold migrate`. |
| Commands appear twice | The project still has `.claude/commands/sk/`. Run `/sk:scaffold migrate`. |
| `/sk:` commands are missing in a session | Run `claude plugin list` and check `sk@shipkit` is enabled, then start a new session. |
| An update did not arrive | Updates are delivered when the plugin's version changes. Run `claude plugin update sk@shipkit`. |
| `claude plugin details sk` shows "Agents (0)" | That command does not list agents declared in the manifest. They still load; ask Claude to list its `sk:` agent types to confirm. |
