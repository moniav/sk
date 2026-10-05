# API Reference

**Last updated:** 2026-10-05

## Not Applicable

SK is a Claude Code plugin, not a web service. It exposes no HTTP endpoints.

## Script interface

The one executable is `pkg/cli.mjs`, run by `/sk:scaffold` from the plugin cache (see [Architecture](../architecture/README.md)):

```
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" init [target] [--minimal] [--yes]     # docs/ and CLAUDE.md, filling gaps
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" update [target] [--dry-run] [--force] [--yes]   # refresh the shipped docs
node "${CLAUDE_PLUGIN_ROOT}/cli.mjs" migrate [target] [--yes]              # remove what SK 2.x copied into .claude/
```
