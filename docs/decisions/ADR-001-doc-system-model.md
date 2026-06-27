# ADR-001: Multi-Audience Documentation Model

**Status:** Accepted
**Date:** 2026-06-27
**Supersedes:** —
**Superseded by:** —

> SK-development decision (dogfood copy; not shipped). Records the doc-system model the
> v1.8.0 enhancement builds on. See `dev-docs/planning/enhancement-plan-doc-system.md`.

## Context

The `/sk:` library's shipped doc template was engineer-only: a single `docs/README.md`
agent index over a 13-section tree. The v1.8.0 enhancement adds multi-audience surfaces
(feature docs, end-user guides) and a coherence/lifecycle layer. Before building the new
creators (`/sk:new-feature-doc`, `/sk:new-user-guide`) we had to settle the tree shape so
new homes don't collide with the existing one.

## Decision

1. **Two front doors, not one.**
   - `docs/README.md` stays the **agent index** ("Claude Code: read this first").
   - `docs/START-HERE.md` is a new **human router** — role lanes (engineer / feature /
     end-user / compliance) pointing into the tree. Projects prune unused lanes.

2. **New domain homes:** `docs/features/`, `docs/user-guides/`, and a single
   `docs/_archive/`. Each ships with a stub index.
   - `business/` is **deferred** to Phase 3 (GTM work), not created now.

3. **`features/` vs `architecture/`.** `architecture/` stays *system-level* (how
   components fit, data flow, cross-cutting concerns). `features/` holds *per-feature*
   docs (what a feature does, how to use/extend it), created by `/sk:new-feature-doc`
   from the `feature-doc` template. They are complementary, not duplicates.

4. **Lifecycle, not `status`.** Freshness is tracked with a `Lifecycle` field (already
   shipped in T2) — deliberately distinct from task/epic `status`, ADR `Status`, and
   review `status`. See `conventions/doc-lifecycle.md`.

5. **`_archive/` over deletion.** Superseded docs move to `_archive/` (exempt from
   orphan/staleness checks) rather than being deleted, preserving history.

## Consequences

- `/sk:init-docs` scaffolds both front doors + the three new homes; `/sk:update-docs`
  maintains them and reports by `Lifecycle`.
- `/sk:docs-audit` exempts `_archive/` and treats `features/`/`user-guides/` as evergreen.
- Consuming projects that don't need a lane (e.g. no end-users) simply delete that home —
  the scaffold is opt-out, not mandatory.
- This ADR is SK-internal and lives in the dogfood `docs/` tree only; it is **not** part
  of the shipped `pkg/` template.
