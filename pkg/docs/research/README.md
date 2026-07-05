# Research

> Brainstorm findings, library evaluations, and debug investigation traces.

**Last updated:** 2026-07-05

## Purpose

When a command does web research or `/sk:debug` traces a complex root cause, the reasoning is valuable but gets lost after the session. This directory preserves reusable knowledge — and the `research` skill **checks here first** before searching the web, so saved findings prevent duplicate research (freshness windows: version facts ~30d, comparisons ~90d, concepts ~6-12mo).

## When to Save

| Command | Save When |
|---------|-----------|
| `/sk:kickoff` | Stack research (structure, ecosystem, versions, pitfalls) |
| `/sk:brainstorm` | Web research was performed (library comparisons, pattern analysis) |
| `/sk:plan` | Targeted research changed the technical approach |
| `/sk:migrate` | Migration-guide findings for a version jump |
| `/sk:debug` | Investigation trace for M+ complexity bugs |

Not every run — only when substantial research or investigation happened. Always fill the template's **Sources** section; findings without provenance can't be safely reused.

## Naming Convention

`YYYY-MM-DD-{topic}.md` (e.g., `2026-03-22-csv-export-libraries.md`)

## Template

Use `docs/templates/research-doc.md` when saving research artifacts.

## Relationship to Other Docs

- Research documents the **exploration** (what options exist, what we learned)
- ADRs document the **decision** (which option we picked and why)
- Task files document the **implementation** (what we built)

A brainstorm might produce all three: research findings here, an ADR in `docs/decisions/`, and tasks in `docs/tasks/`.
