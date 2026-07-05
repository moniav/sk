# Plugin Split — Migration Plan

> Companion to `docs/decisions/ADR-002-plugin-distribution.md`. Target: a release
> after v1.9.0, once the wave 1–4 changes have soaked.

## End State

| Payload | Channel | Update story |
|---------|---------|--------------|
| Commands, agents, skills | Claude Code plugin (marketplace) | Native plugin update — atomic, versioned |
| docs/ scaffold + CLAUDE.md template | `npx shipkit-cld init [--minimal]` | One-time scaffold; owned by the project after |
| Existing installs (pre-plugin) | `npx shipkit-cld update` (manifest-based) | Supported indefinitely; docs migration note |

## Steps

1. **Verify current plugin manifest format** against the official Claude Code plugin
   docs (`.claude-plugin/plugin.json` schema, marketplace.json, path conventions for
   commands/agents/skills). Do not guess the schema — check docs at implementation time.
2. **Restructure or map paths.** Plugin layout expects commands/agents/skills relative
   to the plugin root; either point plugin.json at `pkg/.claude/*` (if supported) or
   generate a plugin bundle from `pkg/` in a prepack step (preferred — keeps the
   single-source-of-truth in `pkg/`).
3. **Namespace check.** Commands are currently `/sk:*` via directory namespacing;
   confirm plugin command namespacing matches (plugin name prefix), and whether
   `/sk:` survives. If the prefix changes, ship alias notes.
4. **Trim the CLI to `init`.** New `init` subcommand = current install minus
   `.claude/` copying. Keep `install`/`update`/`remove` for the legacy channel.
5. **Publish a marketplace entry** (separate repo or marketplace.json in this repo).
6. **Docs + README:** dual-channel install instructions; migration guide for existing
   file-copy installs (remove `.claude/` SK files via `remove`, install plugin, keep docs/).
7. **Deprecation policy:** file-copy channel stays until plugin channel has feature
   parity (notably: per-project version pinning; skills/agents visibility in target
   projects) — re-evaluate each release.

## Open Questions

- Plugin skills: do `disable-model-invocation` and scoped-skill semantics carry over
  identically for plugin-shipped skills?
- Do plugin agents appear in the Agent tool's registry the same way project agents do?
- Marketplace hosting: dedicated `shipkit-marketplace` repo vs in-repo marketplace.json.
