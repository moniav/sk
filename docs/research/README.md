# Research

> Brainstorm findings, library evaluations, and debug investigation traces.

**Last updated:** 2026-03-22

## Purpose

When `/sk:brainstorm` does web research or `/sk:debug` traces a complex root cause, the reasoning is valuable but gets lost after the session. This directory preserves reusable knowledge.

## When to Save

| Command | Save When |
|---------|-----------|
| `/sk:brainstorm` | Web research was performed (library comparisons, pattern analysis) |
| `/sk:debug` | Investigation trace for M+ complexity bugs |

Not every brainstorm or debug — only when substantial research or investigation happened.

## Naming Convention

`YYYY-MM-DD-{topic}.md` (e.g., `2026-03-22-csv-export-libraries.md`)

## Template

Use `docs/templates/research-doc.md` when saving research artifacts.

## Relationship to Other Docs

- Research documents the **exploration** (what options exist, what we learned)
- ADRs document the **decision** (which option we picked and why)
- Task files document the **implementation** (what we built)

A brainstorm might produce all three: research findings here, an ADR in `docs/decisions/`, and tasks in `docs/tasks/`.
