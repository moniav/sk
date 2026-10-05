---
description: Create the docs/ tree and CLAUDE.md in this project, refresh the shipped docs, or migrate from an SK 2.x file install
argument-hint: "[update | migrate] [--minimal]"
disable-model-invocation: true
---

# Scaffold: docs/ and CLAUDE.md

Create the documentation tree and `CLAUDE.md` that the other commands read and write, using the script that ships inside the plugin.
The script fills gaps only: a file the project already has is never replaced.

**Arguments:** `$ARGUMENTS`

- No arguments: create the scaffold.
- `--minimal`: create only the core doc homes.
- `update`: refresh the shipped templates, SOPs, reference docs and index docs. A file the user edited is kept, and the new version is written beside it as `<name>.sk-new`.
- `migrate`: a project where SK 2.x copied its commands, agents and skills into `.claude/`. Removes SK's copies (the user's own agents, skills and every doc are kept), then the plugin's commands take over.

## Rules

- Run the script. Do not create the files by hand, and do not copy them with shell commands: the script also writes the manifest that later updates depend on.
- Run it from the project root (the folder that holds, or will hold, `CLAUDE.md`).
- Do not fill in any doc here. Filling them is the job of the command named in the reply.

## Step 1: Check what is here

1. Run `node --version`. If Node.js is missing or older than 18, stop and say that the scaffold script needs Node.js 18 or later.
2. If `.claude/commands/sk/` exists in the project and the user did not ask for `migrate`, say that SK 2.x copied its files here and that `/sk:scaffold migrate` removes them, then stop.

## Step 2: Run the script

Create the scaffold:

```
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" init . --yes
```

Add `--minimal` if the user asked for it.

For `update`, show what would change first, then apply it:

```
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" update . --dry-run
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" update . --yes
```

For `migrate`, show the user what the script says it will remove and keep, get a yes, then run it with `--yes`; follow with `update` so the shipped docs match the plugin:

```
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" migrate . --yes
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" update . --yes
```

If the command exits with an error, show the error as it is and stop. Do not work around it.

## Step 3: Check the result

- `docs/README.md` and `CLAUDE.md` exist.
- `.claude/.sk-manifest.json` exists and its `channel` is `plugin`.
- If the script printed `[KEEP]` for `CLAUDE.md`, the project had its own: the SK template is in `CLAUDE.sk.md`. Tell the user to merge the parts they want, and do not merge it yourself.
- After `update`, list every `.sk-new` file the script reported.
- After `migrate`, `.claude/commands/sk/` is gone and `git status` shows only deletions of SK's files.

**Reply:** how many files were added and how many were already present (from the script's output), what happened to `CLAUDE.md`, any `.sk-new` files, and the next step: suggest the user run `/sk:prd` for a new product or feature, or `/sk:init-docs` for an existing codebase.
