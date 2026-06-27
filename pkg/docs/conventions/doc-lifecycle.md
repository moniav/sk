# Doc Lifecycle

> How documentation freshness is tracked so relevance stays clear over time.
> **Claude Code:** When creating or updating an evergreen doc, set its `Lifecycle` and `Last updated` fields. `/sk:docs-audit` reports on these.

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

## The `Lifecycle` field

Evergreen reference docs — feature/component docs, flows, SOPs, user guides, and the
domain-home indexes (`features/`, `business/`, `legal/`, `operations/`, `user-guides/`,
`reference/`, `_archive/`) — carry a freshness signal alongside `Last updated`. (Section
indexes like `system/` and `architecture/` may adopt it too; it's recommended wherever a
doc has a meaningful "is this still accurate?" lifespan.):

| Value | Meaning | Action |
|-------|---------|--------|
| `current` | Accurate and in active use | None — this is the default |
| `stale` | Likely out of date; not yet verified | Review and refresh, or confirm `current` |
| `deprecated` | Describes something on its way out; kept for reference | Plan removal; link to the replacement |
| `archived` | No longer relevant; retained for history only | Move to `_archive/` when that home exists |

## Why a separate field (not `status`)

`Lifecycle` is **freshness**, deliberately distinct from the other `status`-like
fields already in use — they answer different questions and must not be conflated:

| Field | Lives on | Answers |
|-------|----------|---------|
| `Lifecycle` | evergreen reference docs | Is this doc still accurate? |
| `status` | tasks / epics | What workflow phase is the work in? (`planning`, `done`) |
| `Status` | ADRs | What is the decision's state? (`Proposed`, `Accepted`) |
| `status` | review reports | How many findings are open? (`3 open / 5 resolved`) |

Transient, event-stamped docs (tasks, epics, research, reviews) do **not** take a
`Lifecycle` — their existing date and `status` fields already express their state,
and "staleness" is meaningless for a finished task.

## Staleness threshold

`/sk:docs-audit` flags an evergreen doc as stale when **`Last updated` is older than
180 days** *and* its `Lifecycle` is not explicitly set to `current`. The threshold is
a default, not a hard rule — a doc that's old but still accurate stays `current`. Set
`Lifecycle: deprecated`/`archived` to suppress staleness noise on docs you've already
triaged.

## How it's applied

- New evergreen docs inherit the field from their template (`Lifecycle: current`).
- `/sk:docs-audit` groups its report by `Lifecycle` and flags missing/old fields.
- `/sk:update-docs` refreshes `Last updated` when it touches a doc and may downgrade
  a doc to `stale` when the code it describes has changed.
