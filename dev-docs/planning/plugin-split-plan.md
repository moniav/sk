# Plugin Split — Migration Plan

> Companion to `docs/decisions/ADR-002-plugin-distribution.md`.
> **Status 2026-07-05:** format verified against official docs; experimental plugin
> channel shipped (`.claude-plugin/plugin.json` + `marketplace.json` in this repo).
> Remaining work below before the plugin channel can be recommended over npm.

## End State

| Payload | Channel | Update story |
|---------|---------|--------------|
| Commands, agents, skills | Claude Code plugin (marketplace) | Native plugin update — atomic, versioned |
| docs/ scaffold + CLAUDE.md template | `npx shipkit-cld init [--minimal]` | One-time scaffold; owned by the project after |
| Existing installs (pre-plugin) | `npx shipkit-cld update` (manifest-based) | Supported indefinitely; docs migration note |

## Verified Facts (official docs, 2026-07-05)

Sources: code.claude.com/docs/en/{plugins,plugins-reference,plugin-marketplaces,skills,discover-plugins}.md

- **Namespace preserved:** plugin commands invoke as `/plugin-name:command`. Plugin is
  named `sk`, so every `/sk:foo` name survives exactly. (Resolved former step 3.)
- **Custom paths supported:** plugin.json points `commands` → `./pkg/.claude/commands/sk`,
  `agents` → `./pkg/.claude/agents`, `skills` → `./pkg/.claude/skills`. No build step,
  `pkg/` stays the single source of truth. (Resolved former step 2 — no prepack needed.)
- **Skills parity:** plugin skills use identical frontmatter incl.
  `disable-model-invocation`. (Resolved open question 1.)
- **Agents parity:** plugin agents register in the Agent tool as `sk:agent-name`;
  `hooks`/`mcpServers`/`permissionMode` frontmatter are blocked in plugin agents
  (we don't use them). (Resolved open question 2.)
- **Marketplace in-repo:** one repo can be both plugin and marketplace
  (`.claude-plugin/marketplace.json`, source `"./"`). Users:
  `/plugin marketplace add moniav/sk` → `/plugin install sk@shipkit`.
  (Resolved open question 3 — no separate repo.)
- **Versioning:** `version` omitted from plugin.json + marketplace entry → users track
  commit SHAs (right for the experimental phase). At stabilization, set `version` and
  bump per release — pushing commits alone then stops triggering updates.
- **Scopes:** plugins install at user scope by default; per-project enablement via
  `.claude/settings.json` `enabledPlugins`. Per-project *version pinning* is NOT
  documented — assume one version per user.

## Known Blocker → the remaining real work

**In-body path references.** Commands/skills reference each other by project paths
(`.claude/skills/x/SKILL.md`, `.claude/agents/y.md`, `docs/templates/z.md`). In a
plugin install those `.claude/` paths don't exist in the project, so skill/agent
loading inside command bodies degrades. The docs template paths are fine (docs/ still
comes from `npx shipkit-cld`).

Fix options to evaluate (in order):
1. `${CLAUDE_PLUGIN_ROOT}` substitution in command/skill bodies — verify it applies to
   markdown content (documented for hooks/MCP configs; **unverified for md bodies** —
   test, don't assume).
2. Reference skills by *name* ("follow the `sk:git-commit-flow` skill") instead of
   path — works in plugin channel; file-copy channel uses unprefixed names, so the
   text would need to be channel-neutral ("the git-commit-flow skill") and rely on
   the model resolving whichever is present.
3. Dual-resolution instruction pattern: "read `.claude/skills/x/SKILL.md`; if absent,
   invoke the `x` skill" — works in both channels, slightly noisier.

## Remaining Steps

1. **Real-world install test:** `/plugin marketplace add moniav/sk`,
   `/plugin install sk@shipkit` in a scratch project — verify all 48 commands appear,
   agents register, gated skills stay gated. Exercise a full `/sk:new-task` → `/sk:dev`
   flow and catalog exactly which path references break.
2. **Reference-rewrite pass** using whichever fix option survives testing (~100+
   references across commands/skills; mechanical once the pattern is chosen).
3. **CLI `init` subcommand** — docs scaffold + CLAUDE.md only, no `.claude/` copying;
   `--minimal` supported. Keep `install`/`update`/`remove` for the legacy channel.
4. **Docs + README:** promote plugin channel from experimental; migration guide for
   file-copy installs (`npx shipkit-cld remove` keeps docs/ → install plugin → `init`
   fills any doc gaps).
5. **Stabilize versioning:** set `version` in plugin.json, bump in `/sk:release` flow
   (add the plugin.json bump to release.md's version-update step).
6. **Deprecation policy:** file-copy channel stays until plugin channel has feature
   parity; re-evaluate each release. Note: per-project version pinning may *never*
   come to plugins — projects that need pinning keep the npm channel.
