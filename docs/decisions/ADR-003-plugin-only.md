# ADR-003: Plugin is the only distribution channel

**Status:** Accepted
**Date:** 2026-10-05
**Supersedes:** ADR-002 (the hybrid: plugin plus a file-copy CLI during transition)
**Decided in:** conversation, 2026-10-05

Hard to reverse: users on the file-copy channel must migrate, and the npm package stops. Surprising without context: a later reader finds a `cli.mjs` inside a plugin and no `bin`. Real trade-off: per-project version pinning and in-project edits of shipped commands are given up.

## Context

ADR-002 kept `npx shipkit-cld` (commands, agents and skills copied into `.claude/`) alive while the plugin proved itself. The plugin has been the recommended path since 2.3. The file-copy channel was the largest part of the code base: two thirds of `pkg/cli.mjs`, the release baselines and their generator, half of the regression tests, a dogfood copy kept in sync by a script, and a rule in every shipped file that paths must work in both channels. Its two remaining benefits, pinning an SK version per project and editing a shipped command in place, were not in use, and the second is what made updates fragile.

## Decision

The Claude Code plugin is the only way to install SK. Commands, agents and skills load from the plugin cache and are never written into a project. `pkg/cli.mjs` stays, inside the plugin, with three jobs run by `/sk:scaffold`: `init` (docs and `CLAUDE.md`, filling gaps), `update` (the shipped docs, keeping edits), `migrate` (removing what SK 2.x copied). The npm package is private and no longer published. SK dogfoods itself with `claude --plugin-dir ./pkg`; the repo's `.claude/` holds only `settings.json`.

## Consequences

- A project that needs a changed command forks the plugin and loads the fork with `--plugin-dir`, or adds its own project command under another name.
- Plugin agents do not load in the Claude web and desktop chat; the commands that dispatch them need the CLI or Cowork. Documented in the install guide.
- Listing SK in Claude Code's official marketplace would remove the `marketplace add` step; not done yet.
