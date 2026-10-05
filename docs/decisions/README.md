# Architecture Decision Records

> Capture the WHY behind key technical decisions so future-you (and future-Claude) don't have to guess.

**Last updated:** 2026-10-05

## Decision Log

<!-- Add ADRs here as you create them with /sk:new-adr -->

| # | Decision | Status | Date |
|---|----------|--------|------|
| [ADR-001](./ADR-001-doc-system-model.md) | Doc system model | Accepted | 2026-07-05 |
| [ADR-002](./ADR-002-plugin-distribution.md) | Hybrid distribution: plugin plus file-copy CLI | Superseded by ADR-003 | 2026-07-05 |
| [ADR-003](./ADR-003-plugin-only.md) | Plugin is the only distribution channel | Accepted | 2026-10-05 |

### Decisions Made (not yet recorded as ADRs)

These decisions are documented in CLAUDE.md and code but don't have formal ADRs:

- **Zero dependencies** — CLI uses only Node.js stdlib to minimize supply chain risk
- **pkg/ separation** — Self-contained package directory vs project root for clean shipping
- **Language-agnostic commands** — Commands never assume specific tech stack
- **ASCII-only CLI output** — Windows cp1255 compatibility over Unicode aesthetics

## When to Write an ADR

Write one when you:
- Choose between multiple viable technologies
- Deviate from a common/expected pattern
- Make a decision that's hard to reverse
- Find yourself explaining "why we do it this way" more than once

## Statuses

- **Proposed** — Under discussion
- **Accepted** — Decision made, implementing
- **Superseded** — Replaced by a newer ADR (link to it)
- **Deprecated** — No longer relevant

> Create new ADRs using the [ADR template](../templates/adr-decision.md)
