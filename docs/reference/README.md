# Reference

> Curated, stable reference material: lookup docs that commands and contributors consult,
> distinct from the project's own evolving docs.

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

Unlike `system/` (this project's current state) or `architecture/` (this project's design),
`reference/` holds **durable reference data** that doesn't change with the codebase.

## Contents

| Area | Doc | Used by |
|------|-----|---------|
| UI design | [ui-design/visual-design.md](./ui-design/visual-design.md) | `/sk:ui-review` (aesthetic / visual standards) |
| UI design | [ui-design/anti-patterns.md](./ui-design/anti-patterns.md) | `/sk:ui-review` (AI-slop / anti-pattern checks) |
| Stacks | [stacks/signals.md](./stacks/signals.md) | `/sk:init-docs`, `/sk:update-docs`, `/sk:docs-audit` (where to find packages, entry points, routes, data, tests) |

Add new reference material as its own subfolder (e.g. `reference/<topic>/`) and link it here.
