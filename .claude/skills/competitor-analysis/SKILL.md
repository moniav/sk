---
name: competitor-analysis
description: Analyze competitors — profiles, positioning maps, feature/pricing comparisons, and threat assessment. Invoked via /sk:competitor.
disable-model-invocation: true
---

# Competitor Analysis

Produce honest, decision-useful competitive intelligence — not a flattering scoreboard.
The goal is to understand where you genuinely win, where you lose, and what to do about it.

## Before You Start

Gather (ask only for what's missing — check `docs/system/project-context.md` and
`docs/business/` first):

1. **Your product** — what it does, who for, the wedge.
2. **Which competitors** — named, or "find them." Include the status-quo / DIY / "do
   nothing" alternative — that's usually the real competitor.
3. **The decision** — what this analysis informs (positioning, roadmap, pricing, a deal).

## Principles

- **Steelman the competitor.** Assume a smart buyer chose them for good reasons. Find those reasons.
- **Compare on buyer criteria, not feature counts.** A longer feature table rarely wins deals.
- **Cite evidence.** Pricing pages, docs, reviews, changelogs — link sources; flag guesses as guesses.
- **Name where you lose.** An analysis with no losses is marketing, not intelligence.

## Process

1. **Identify the set** — direct, indirect, and status-quo alternatives. Cap at the 3–5 that matter.
2. **Profile each** (use the `competitor-profile` template): positioning, ICP, pricing model,
   key strengths, real weaknesses, momentum (funding/hiring/release cadence).
3. **Map positioning** — place competitors on the 2 axes buyers actually decide on (not
   generic "ease vs power" unless that's the real axis).
4. **Comparison matrix** — rows = buyer's decision criteria (weighted), columns = competitors.
   Mark honestly: win / parity / lose.
5. **So what** — for each competitor: where we win, where we lose, the counter, and the
   gap worth closing.

## Output

Write profiles to `docs/business/competitor-<name>.md` and a summary
`docs/business/competitive-landscape.md`, each with `Lifecycle` + `Last updated`
frontmatter. End with a short **Implications** section: 3–5 concrete moves, ranked.

Keep it current — competitive intel rots fast; set `Lifecycle: stale` when older than a quarter.
