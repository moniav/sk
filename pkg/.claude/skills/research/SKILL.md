---
name: research
description: Canonical web-research procedure — prior-research reuse, depth tiers, parallel fan-out, source discipline, cited findings. Loaded by /sk:kickoff, /sk:brainstorm, /sk:plan, /sk:migrate, /sk:debug; not invoked directly.
disable-model-invocation: true
---

# Research

The single source of truth for how SK commands do web research. Goals: don't
re-research what the project already knows, keep raw search noise out of the main
context, and never let an uncited claim become a technical decision.

## 1. Check Prior Research First

Before any search, Glob `docs/research/*.md` and scan titles/dates for the topic.

| Finding type | Trust prior research for |
|--------------|-------------------------|
| Version numbers, "latest stable", CVEs | ~30 days |
| Library comparisons, API patterns | ~90 days |
| UX patterns, domain checklists, concepts | ~6-12 months |

Fresh enough → reuse it (say so: "using research from {date}") and only fill gaps.
Stale → re-verify only the perishable facts; keep the conceptual findings.

## 2. Choose Depth

Ask (use AskUserQuestion) with **honest time estimates**:

- **Quick** (~1–2 min) — 2-3 targeted searches run inline; fetch only the single most
  authoritative source. For: one focused question, sanity checks, a version lookup.
- **Deep** (~5–10 min) — parallel subagent fan-out (below). For: stack selection,
  feature scoping, anything feeding multiple decisions.

The calling command may fix the tier itself (e.g. migrate always fetches primary
sources) — then skip the ask.

## 3. Design Queries — Multi-Angle

Cover distinct angles rather than variations of one query. Pick what fits the task:

| Angle | Query shape |
|-------|-------------|
| Official guidance | `{tech} official docs {topic}`, `{tech} {version} release notes` |
| Best practices | `{topic} best practices {current year}` |
| Pitfalls | `{tech} common mistakes`, `{topic} gotchas` |
| Comparison | `{option A} vs {option B} {current year}` |
| Domain completeness | `{feature type} features checklist`, `{feature type} UX patterns` |

Always include `{current year}` on freshness-sensitive queries.

## 4. Deep Mode: Parallel Subagent Fan-out

Dispatch 2–4 subagents **in one message** (parallel Agent calls), one angle each,
so raw results never enter the main context:

```
Use Agent tool (general-purpose), one call per angle:
  prompt: Research: {angle question}. Use WebSearch, then WebFetch the 1-2 most
          authoritative sources (prefer official docs). Return ONLY a findings
          table: | finding | source URL | source date | confidence |
          plus a 2-3 sentence summary. Flag anything you could not verify in a
          fetched source as UNVERIFIED.
```

Merge the returned tables; discard UNVERIFIED rows or verify them yourself before
they influence a decision.

## 5. Source Discipline

- **Hierarchy:** official docs / release notes > registry pages (npm, PyPI, crates.io)
  > reputable engineering blogs > forums/Q&A. Cite the highest tier available.
- **Primary-source rule:** load-bearing claims — version numbers, API shapes,
  "X is deprecated", config formats — must come from a **fetched** primary source,
  not a search snippet and **not model memory** (knowledge cutoffs make remembered
  versions actively wrong).
- **Date-stamp everything:** a finding without a source date can't be trusted later.
- **Disagreement:** when sources conflict, prefer the newer primary source and note
  the conflict rather than silently picking one.

## 6. Feed Back & Save

- Feed findings into the conversation as provocations, not dumps: "research shows
  most {X} implementations also include {Y} — relevant for us?"
- Offer to save: `docs/research/YYYY-MM-DD-{topic}.md` from
  `docs/templates/research-doc.md` — **including the Sources section** (URL,
  accessed date, which finding each supports). If `docs/research/` doesn't exist
  yet (minimal install), create it with a stub README first.
- Findings that changed a decision belong in the task's Technical Decisions or an
  ADR — link the research doc from there.
