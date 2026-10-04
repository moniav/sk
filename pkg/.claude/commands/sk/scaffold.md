---
description: Create the docs/ tree and CLAUDE.md in this project, or refresh the shipped docs
argument-hint: "[update] [--minimal]"
disable-model-invocation: true
---

# Scaffold: docs/ and CLAUDE.md

Create the documentation tree and `CLAUDE.md` that the other commands read and write, using the script that ships with SK.
The script fills gaps only: a file the project already has is never replaced.

**Arguments:** `$ARGUMENTS`

- No arguments: create the scaffold.
- `--minimal`: create only the core doc homes.
- `update`: refresh the shipped templates, SOPs and reference docs. A file the user edited is kept, and the new version is written beside it as `<name>.sk-new`.

## Rules

- Run the script. Do not create the files by hand, and do not copy them with shell commands: the script also writes the manifest that later updates depend on.
- Run it from the project root (the folder that holds, or will hold, `CLAUDE.md`).
- Do not fill in any doc here. Filling them is the job of the command named in the reply.

## Step 1: Check what is here

1. If `.claude/commands/sk/` exists in the project, SK was installed as copied files and the scaffold was created at install. Do not run the script in Step 2. For `update`, or to restore missing files, tell the user to run `npx shipkit-cld@latest update .` and stop.
2. Run `node --version`. If Node.js is missing or older than 18, stop and say that the scaffold script needs Node.js 18 or later.

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

If the command exits with an error, show the error as it is and stop. Do not work around it.

## Step 3: Check the result

- `docs/README.md` and `CLAUDE.md` exist.
- `.claude/.sk-manifest.json` exists and its `channel` is `plugin`.
- If the script printed `[KEEP]` for `CLAUDE.md`, the project had its own: the SK template is in `CLAUDE.sk.md`. Tell the user to merge the parts they want, and do not merge it yourself.
- After `update`, list every `.sk-new` file the script reported.

**Reply:** how many files were added and how many were already present (from the script's output), what happened to `CLAUDE.md`, any `.sk-new` files, and the next step: suggest the user run `/sk:kickoff` for a new project or `/sk:init-docs` for an existing codebase.
