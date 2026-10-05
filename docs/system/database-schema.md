# Database Schema

**Last updated:** 2026-10-05

## Not Applicable

SK is a plugin plus a scaffold script. It has no database, no schema, and no migrations.

The only persistent state in a target project is `.claude/.sk-manifest.json`: the SK version, who owns `CLAUDE.md` (`sk` or `user`), the doc profile (`full` or `minimal`), `channel: plugin`, and a hash per shipped doc so `update` can tell an untouched file from an edited one.
