---
description: Create a business doc — plan, model summary, cap table, investor update, memo (project)
---

# New Business Doc

Create a structured business document in `docs/business/`, the same way `/sk:new-sop` creates
SOPs. The command enforces structure + freshness; the content stays human-authored.

**Use when:** Capturing a business artifact with discipline. For positioning/competitor/pricing
use the dedicated GTM commands; for marketing copy use `/sk:copywrite`.

## Step 1: Read Context

Read (skip empty/placeholder files):
1. `docs/system/project-context.md` — project summary
2. `docs/business/README.md` — existing business docs (avoid duplicates)

## Step 2: Choose Type

Ask the user which type, then use the matching template from `docs/templates/`:

| Type | Template | For |
|------|----------|-----|
| Business plan | `business-plan.md` | The plan on a page — problem, solution, market, model, GTM |
| Financial model summary | `financial-model.md` | Narrative over the numbers; links to the live model |
| Cap table | `cap-table.md` | Ownership snapshot; links to the source of record |
| Investor update | `investor-update.md` | Recurring update — metrics, highlights, lowlights, asks |
| Decision memo | `decision-memo.md` | One reversible/irreversible decision, options, recommendation |

## Step 3: Write the Doc

Create `docs/business/<name>.md` from the chosen template. Fill `Lifecycle: current` +
today's `Last updated`. **Templates are lean scaffolds** — structure + prompts, not financial
tooling. Numbers link out to the live source (spreadsheet, captable tool); don't embed or invent them.

## Step 4: Update Index

Add the row to `docs/business/README.md`.

## Validation

- [ ] Created from the right template into `docs/business/`
- [ ] `Lifecycle` + `Last updated` set
- [ ] Numbers link to a live source (not invented)
- [ ] Indexed in `docs/business/README.md`
