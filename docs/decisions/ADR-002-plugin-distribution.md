# ADR-002: Hybrid Distribution — Claude Code Plugin + npx Init Scaffold

**Status:** Accepted — experimental plugin channel shipped 2026-07-05 (format verified
against official docs; see `dev-docs/planning/plugin-split-plan.md` for remaining work)
**Date:** 2026-07-05
**Note:** Dogfood copy — records an SK product decision; not shipped to target projects.

## Context

SK ships as an npm package that file-copies two very different payloads into target
projects:

1. **Executable surface** — commands, agents, skills (`.claude/`). Shared, versioned,
   never user-edited. The 2026-07-05 full-system review found the file-copy update
   model structurally fragile here: stale-source pinning, orphan accumulation, and
   CLAUDE.md ownership ambiguity all stem from copying versioned content into
   user-owned trees. The v1.8.x manifest (`.claude/.sk-manifest.json`) patches these,
   but Claude Code's native plugin system solves them by construction: plugins are
   installed/updated/removed as a versioned bundle, never merged into project files.
2. **Per-project doc system** — `docs/` tree + CLAUDE.md template. Intentionally
   copied-then-owned; the user edits everything. This does NOT fit the plugin model
   (global, read-only) and must remain a scaffold initializer.

## Decision

Go **hybrid**:

- Package the executable surface (45 commands, 20 skills, 8 agents) as a **Claude Code
  plugin** (`.claude-plugin/plugin.json` + marketplace listing), making install/update/
  remove native and versioned.
- Keep a thin **`npx shipkit-cld init`** whose only job is laying down the `docs/`
  scaffold + CLAUDE.md template (with `--minimal` profile support).
- During transition, the current file-copy CLI remains the primary channel; the plugin
  is additive until proven, then becomes the recommended path.

## Consequences

- (+) Updates to commands/skills/agents become atomic and clobber-free; the manifest
  prune/ownership machinery eventually becomes unnecessary for the plugin channel.
- (+) Marketplace discoverability.
- (−) Two distribution channels to test during the transition.
- (−) Plugin-installed commands are global to the user, not per-project — projects that
  pin different SK versions need the file-copy channel until plugins support per-project
  scoping.
- See `dev-docs/planning/plugin-split-plan.md` for the migration plan.

## Alternatives Considered

- **Plugin only** — rejected: the docs scaffold can't be a plugin, and existing
  file-copy installs need a supported path indefinitely.
- **Status quo (file-copy only)** — rejected: the manifest machinery works but
  re-implements what the platform now provides natively.
