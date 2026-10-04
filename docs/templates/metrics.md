# Metrics Dictionary

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

> The single source of truth for what each number means and where it comes from.
> Goal measures (`goals.md`), operating reviews, campaign results, and executive
> briefs may only cite metrics defined here. A number without a dictionary entry
> and a source is not a number, it's a vibe.

## Metrics

| Metric | Definition | Source of truth | Owner | Baseline (date) |
|--------|-----------|-----------------|-------|-----------------|
| <!-- paying-users --> | <!-- distinct accounts with an active paid plan --> | <!-- Stripe dashboard / query --> | <!-- CEO --> | <!-- 4 (2026-07-01) --> |

## Rules

- **Definition before use:** a goal or report citing an undefined metric gets the
  metric defined first or the claim marked "unknown".
- **Source is a place, not a person:** where does the number get read from,
  exactly. If it can't be read, the honest value is "unknown: no measurement".
- **Baselines are dated:** trends need a starting point.
- Changing a definition is a decision: log it (`docs/decisions/decision-log.md`)
  and note old vs new, or trend lines silently lie.
