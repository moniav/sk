# SK Development Docs

> Meta documentation about **building SK itself** — plans, analyses, and contributor guides.
> These are **not** part of the SK product and **never ship**. Only `cli.mjs` + `pkg/` are packed.

## Why this is separate from `docs/`

Root `docs/` is a **dogfood mirror** of the shipped template (`pkg/docs/`) — it exists so SK
can use its own doc system during development. Mixing SK product-planning docs into that tree
made the mirror impure and confusing. Everything about *evolving SK the product* lives here instead.

| Folder | Holds |
|--------|-------|
| `planning/` | Enhancement plans, roadmaps, implementation plans |
| `reports/`  | Analyses, assessments, design investigations |
| `guides/`   | Contributor/authoring guides (e.g. how to write a skill) |

## Index

### planning/
- `enhancement-plan-doc-system.md` — doc-system & multi-audience enhancement plan (target v1.8.0)
- `IMPLEMENTATION-PLAN.md` — unified-system implementation plan
- `plugin-split-plan.md` — hybrid plugin + npx-init distribution migration (post-v1.9.0; see ADR-002)

### reports/
- `enhancement-report-external-skills.md` — external-skills review findings
- `2026-07-05-full-system-review.md` — four-wave full-system review that drove v1.9.0
- `deduplication-analysis.md`
- `docs-structure-assessment.md`
- `superpowers-workflow-analysis.md`
- `system-integration-guide.md`
- `unified-system-design.md`

### guides/
- `skill-authoring-guide.md` — how to author SK skills
