---
description: Analyze competitors — profiles, positioning map, honest comparison
disable-model-invocation: true
---

# Competitor Analysis

Front door to the **competitor-analysis** skill. Produces decision-useful competitive
intelligence into `docs/business/`.

## Step 1: Load the Skill

Read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/competitor-analysis/SKILL.md` and follow it.

## Step 2: Gather Context

Read (skip empty/placeholder files):
1. `docs/system/project-context.md` — your product and wedge
2. `docs/business/positioning.md` — your positioning, if defined
3. `docs/business/README.md` — existing competitor docs (avoid duplicates)

Confirm with the user: which competitors (or "find them"), and the decision this informs.
Remember the status-quo / DIY alternative.

## Step 3: Produce the Analysis

Follow the skill's process. Write per-competitor profiles to
`docs/business/competitor-<name>.md` (use `docs/templates/competitor-profile.md`) and a
`docs/business/competitive-landscape.md` summary. Each carries `Lifecycle` + `Last updated`.

## Step 4: Update Index

Add/refresh rows in `docs/business/README.md`. End with ranked **Implications**.
