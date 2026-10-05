# PRDs

> Product requirement documents: an idea taken to problem, user flows, requirements and architecture, then cut into epics.

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

## Purpose

A PRD is where an idea is challenged before anything is built. `/sk:prd` writes it one stage at a time (Brief, User flows, Requirements, Architecture, Delivery, Review) and asks you to confirm each stage before it is written. Once approved, it produces the epics in `docs/tasks/`, each linked back to the PRD with `prd: PRD-N`.

Use a PRD for a new product or a feature big enough to need several epics. For a single task, `/sk:new-task` is enough.

## Files

| File | Holds |
|------|-------|
| `PRD-{N}-{slug}.md` | The PRD, from `docs/templates/prd.md` |
| `PRD-{N}-prototypes/F-{n}-{slug}.html` | Clickable variants of a flow, opened directly in a browser |

Hard-to-reverse architecture decisions also go to `docs/decisions/` as ADRs and are listed in the PRD.

## Index

| PRD | Title | Status | Epics |
|-----|-------|--------|-------|
| | | | |

`kind`: `product` (the whole product) or `feature` (a change to it, scoped to the flows it adds or touches).
`status`: `draft` while `/sk:prd` is working on it (`/sk:prd PRD-N` resumes), `approved` once reviewed, `delivered` when `/sk:finish` closes its last epic, `superseded` when replaced.

A delivered PRD is a record of what was decided at the time. The current truth lives in `docs/flows/` (its flows are copied there on delivery) and `docs/system/glossary.md`. A later change goes through a new feature PRD, or `/sk:prd PRD-N amend` while the epics are still open.
