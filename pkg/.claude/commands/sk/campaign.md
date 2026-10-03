---
description: Plan, track, and close a marketing campaign — goal-linked, asset checklist, honest results
argument-hint: "[new <name> | status | close CAMPAIGN-N]"
disable-model-invocation: true
---

# Campaign — Marketing Campaigns as Units of Work

Give marketing work the same discipline epics give engineering: a goal-linked plan,
an asset checklist, and results measured honestly at close.

## Step 1: Read Context

**Read (if they exist — skip empty/template files):**
1. `docs/business/positioning.md` — ICP and messaging the campaign builds on
2. `docs/business/brand-voice.md` — voice all assets must follow
3. `docs/business/goals.md` — goals campaigns link to
4. `docs/business/campaigns/` — existing campaigns (numbering, active ones)

## Step 2: Mode

From `$ARGUMENTS` or ask (AskUserQuestion): **New campaign** / **Status** / **Close a campaign**.

### New

1. Scan `docs/business/campaigns/` for the highest CAMPAIGN number; use next.
   If the directory doesn't exist yet, create it and add a Campaigns section link in
   `docs/business/README.md`.
2. Fill `docs/templates/campaign.md` conversationally: objective (a measurable
   outcome, not an activity), audience (from ICP), goal link (`G{N}` — ask if goals
   exist), channels + asset list, launch date.
3. For each asset, note the `/sk:copywrite` format that produces it.
4. Save as `docs/business/campaigns/CAMPAIGN-{N}-{kebab-name}.md`; add it to the
   `docs/business/README.md` index.

### Status

List campaigns with `status: planning|live`, their launch dates, asset progress
(drafted/approved counts from the checklist), and any past launch date still in
`planning` — flag those.

### Close

1. Set `status: done`, update `updated`.
2. Fill the **Results** table — real numbers with sources only. "We don't know"
   is a valid entry if measurement wasn't in place; say so rather than inventing.
3. Capture **What we learned** and offer to save durable lessons to memory or
   raise convention updates (same rules as `/sk:retro`).

## Guidelines

- Objective must be measurable — "publish 3 posts" is an activity, not an objective.
- Assets follow `brand-voice.md`; if it doesn't exist, offer to create it first
  (`docs/templates/brand-voice.md`, derived from positioning).
- **Publishing is never autonomous** — every asset gets human sign-off before going
  live (delegation policy: outward-facing actions).
- Campaigns without a goal link deserve the same question as goal-orphaned epics.
