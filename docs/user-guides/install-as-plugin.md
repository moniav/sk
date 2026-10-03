# Install SK as a Claude Code plugin (experimental)

**Last updated:** 2026-07-05
**Lifecycle:** current
**Audience:** Developers who want SK's commands/skills/agents installed natively via the Claude Code plugin system instead of file-copied into each project

## What you'll accomplish

SK's 53 commands, 23 skills, and 8 agents installed once at the user level, updating
natively with `/plugin update` — while your project keeps owning its `docs/` tree.

> **Experimental.** The npm channel (`npx shipkit-cld`) remains the recommended path.
> Known limitation: some command bodies reference `.claude/` files by project path,
> which don't exist in a plugin install — a few skill/agent loads inside commands
> degrade until the reference rewrite lands. Track progress in
> [`dev-docs/planning/plugin-split-plan.md`](../../dev-docs/planning/plugin-split-plan.md).

## Before you start

- Claude Code with plugin support (`/plugin` command available)
- A project for the docs scaffold (plugins don't create project files)

## Steps

1. **Add the marketplace (one-time):**
   ```
   /plugin marketplace add moniav/sk
   ```
   - *What you'll see:* the `shipkit` marketplace registered.
2. **Install the plugin:**
   ```
   /plugin install sk@shipkit
   ```
   - *What you'll see:* the `sk` plugin installed. Commands keep their exact `/sk:*`
     names (the plugin is named `sk`, and plugins namespace as `/plugin-name:command`).
3. **Verify** — start a new session and run `/sk:task-status`.
   - *What you'll see:* the command executes; agents appear in the Agent tool as
     `sk:implementer`, `sk:spec-reviewer`, etc.
4. **Scaffold the docs system** in your project (still required — plugins ship the
   executable surface, not project files):
   ```bash
   npx shipkit-cld            # or --minimal
   ```
   - *Note:* this currently also copies `.claude/` into the project, duplicating what
     the plugin provides. Harmless (project files shadow plugin files); a docs-only
     `init` is planned.
5. **Update later** with `/plugin update sk@shipkit` — during the experimental phase
   the plugin tracks the latest commit on `main`, so updates arrive on every push.

## Switching back / uninstalling

```
/plugin uninstall sk@shipkit
```

Your project's `docs/` (and any file-copied `.claude/` from step 4) are untouched —
plugins never write project files.

## Troubleshooting

| If you see… | It means… | Do this |
|-------------|-----------|---------|
| A command says it can't find `.claude/skills/...` | The known path-reference limitation | Run `npx shipkit-cld` in the project (step 4) so the files exist, or use the npm channel |
| `/sk:*` commands missing after install | Session predates the install | Start a new session |
| Two copies of a command in the `/` menu | Plugin + file-copied project install coexist | Expected during the experimental phase; project files take precedence |

## Related guides

- [Set up autonomous maintenance routines](./set-up-autonomous-routines.md)
- [Run multiple agents on one project](./run-multiple-agents.md)
