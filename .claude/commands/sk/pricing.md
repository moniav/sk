---
description: Design or evaluate pricing — value metric, model, tiers, packaging (project)
---

# Pricing Strategy

Front door to the **pricing-strategy** skill. Produces a pricing recommendation into
`docs/business/`.

## Step 1: Load the Skill

Read `.claude/skills/pricing-strategy/SKILL.md` and follow it.

## Step 2: Gather Context

Read (skip empty/placeholder files):
1. `docs/system/project-context.md` — product and ICP
2. `docs/business/positioning.md` — value pillars to price against
3. `docs/business/competitor-*.md` — competitor price anchors, if present

Confirm with the user: value-metric candidates, costs/constraints, and the pricing goal.

## Step 3: Produce the Strategy

Follow the skill's process. Write to `docs/business/pricing-strategy.md` using
`docs/templates/pricing-strategy.md`, with `Lifecycle: current` + today's `Last updated`.

## Step 4: Update Index

Add/refresh the row in `docs/business/README.md`. List **open questions to validate with
real customers** — pricing is a hypothesis until tested.
