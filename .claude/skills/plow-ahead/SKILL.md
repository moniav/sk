---
name: plow-ahead
description: >
  Grants autonomy to proceed through minor ambiguity by stating an assumption and
  continuing, stopping only for genuine blockers. Use this skill when the user signals
  "just do it", "don't keep asking", "use your judgment", "proceed", or "keep going" —
  or when small clarifications would interrupt flow without changing the outcome. The
  complement to escalation-rules (which says when to STOP).
---

# Plow Ahead — Autonomy Contract

> Proceed on minor ambiguity with a stated assumption. Stop only for real blockers. Log every decision so the user can review it.

## When This Applies

The user wants momentum over confirmation. Without this contract, agents either over-ask (interrupting flow for trivial choices) or over-assume (silently making consequential decisions). This skill grants autonomy **with accountability**.

## The Contract

1. **Proceed through MINOR ambiguity.** State the assumption inline (`Assuming X since Y…`) and keep going. Anything cheap to reverse is a minor ambiguity.

2. **STOP for genuine blockers:**

   | Stop for | Examples |
   |----------|----------|
   | **Missing access** | Credentials, env vars, a service you can't reach |
   | **Destructive / irreversible** | Deleting data, force-push, prod changes, dropping a table |
   | **Security / privacy** | Auth model, data exposure, PII handling, secrets |
   | **Reserved decisions** | Anything the user explicitly said they want to decide |
   | **Hard-to-reverse design** | Wire format, public IDs, data-model shape — expensive to undo later |

3. **Keep a running decision log** — every assumption you acted on.

4. **End with a recap** of every assumption, flagged so the user can correct any of them in one pass.

## Decision Log Format

```markdown
| # | Decision point | Assumption made | Reversible? |
|---|----------------|-----------------|-------------|
| 1 | Date format unspecified | Used ISO-8601 | Yes — cheap to change |
| 2 | No empty-state copy given | Wrote a neutral placeholder | Yes |
```

## Relationship to escalation-rules

These are the two poles of the stop/go decision:

- **plow-ahead** — keep going on small, reversible forks; assume and log.
- **escalation-rules** — STOP after 3 failed attempts, or on a real blocker, and present options.

When a decision is hard-to-reverse and you're unsure, default to **stop** — the autonomy contract covers minor ambiguity only.
