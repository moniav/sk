---
description: Define product positioning & messaging — ICP, category, value prop
disable-model-invocation: true
---

# Positioning

Front door to the **product-marketing-context** skill. Establishes the positioning every
other GTM artifact inherits from.

## Step 1: Load the Skill

Read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/product-marketing-context/SKILL.md` and follow it.

## Step 2: Gather Context

Read (skip empty/placeholder files):
1. `docs/system/project-context.md` — what the product is
2. `docs/business/README.md` — existing business docs
3. `docs/business/competitor-*.md` — competitive alternatives, if present

Confirm with the user only what's missing (product, best-fit customer, alternatives, unique attributes).

## Step 3: Produce Positioning

Follow the skill's process. Write the result to `docs/business/positioning.md` using
`docs/templates/positioning.md`, with `Lifecycle: current` + today's `Last updated`.

## Step 4: Update Index

Add/refresh the row in `docs/business/README.md`.

> Positioning is the source of truth — `/sk:copywrite` and `/sk:competitor` should reference it.
