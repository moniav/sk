---
name: plow-ahead
description: Grants autonomy to proceed through minor ambiguity by stating an assumption and continuing, stopping only for real blockers, with a decision log at the end. Use when the user says to just do it, stop asking, use your judgment, or keep going.
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

3. **Keep a decision trail:** one row for every assumption you acted on, in the format in `${CLAUDE_SKILL_DIR}/references/decision-trail.md` (`references/decision-trail.md` in this skill's directory). Read it before the first decision.

4. **End with the whole trail,** so the user can correct any assumption in one pass. For work the user stepped away from, audit the trail first, as that file describes.

## Relationship to escalation-rules

These are the two poles of the stop/go decision:

- **plow-ahead** — keep going on small, reversible forks; assume and log.
- **escalation-rules** — STOP after 3 failed attempts, or on a real blocker, and present options.

When a decision is hard-to-reverse and you're unsure, default to **stop** — the autonomy contract covers minor ambiguity only.
