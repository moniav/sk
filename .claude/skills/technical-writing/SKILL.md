---
name: technical-writing
description: Writes technical documentation, such as READMEs, API docs, guides, onboarding and architecture overviews, checked against the code. Use when creating or substantially rewriting developer documentation. Not for marketing copy.
---

# Technical Writing

Documentation a developer can act on, and that is true of the code as it is today.

## Before writing

1. **Name the reader and what they are trying to do.** Lead the document with that.
2. **Read the code the document describes.** Every command, path, flag, endpoint and example must exist. Run commands where you can. Never document a feature that is planned.
3. **Find the right home and template.** `docs/README.md` maps the doc tree; `docs/templates/` has a template for most doc types (`feature-doc.md`, `component-doc.md`, `user-guide.md`, `sop-procedure.md`, `adr-decision.md`, `flow-diagram.md`). Use the template instead of inventing a structure. A README at the repository root has no template: quick start first, then usage, reference, configuration.
4. **Check for an existing doc.** Update it, or link to it, rather than writing a second one.

## While writing

- Follow `references/plain-writing-rules.md` in this skill's directory. Read it before the first draft.
- Quick start before detail. A reader should be able to succeed with the first screen.
- Show a working example for anything a reader will type or call. State expected output.
- State versions, exact commands and exact paths. A vague instruction is worse than none.
- Describe behaviour, not implementation that will change.
- Link to other docs instead of repeating them.

## SK doc conventions

- Evergreen docs carry `**Last updated:**` and `**Lifecycle:**` fields (see `docs/conventions/doc-lifecycle.md`). Set both.
- A doc that describes code names it in a `Source:` field, so `/sk:docs-audit` can detect drift.
- Add the new doc to its section's `README.md` index.
- Skip any convention file that is empty or still a template; match the existing docs instead.

## Done when

- [ ] Every command, path and example was checked against the code, and the ones that can run were run
- [ ] A reader can complete the quick start without leaving the page
- [ ] `Last updated`, `Lifecycle` and (where it applies) `Source` are set
- [ ] The section index links to the doc
- [ ] The text passes the self-check in `references/plain-writing-rules.md`
