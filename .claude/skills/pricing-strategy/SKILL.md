---
name: pricing-strategy
description: Design and evaluate pricing — value metric, model, tiers, packaging, and willingness-to-pay. Invoked via /sk:pricing.
disable-model-invocation: true
---

# Pricing Strategy

Help choose a pricing model and packaging grounded in **value delivered**, not cost-plus or
gut feel. Pricing is a positioning decision as much as a revenue one.

## Before You Start

Gather (check `docs/business/` and `docs/system/project-context.md` first):

1. **Product & ICP** — who pays, and what outcome they're buying.
2. **Value metric candidates** — the thing that scales with the value the customer gets
   (seats, usage, outcomes, data volume…).
3. **Costs & constraints** — marginal cost per unit, competitor price points, current pricing if any.
4. **Goal** — land-and-expand, maximize ARPU, simplicity, undercut, premium.

## Principles

- **Pick the value metric first.** Good pricing scales with customer value and feels fair as they grow.
- **Charge for value, not features or cost.** Cost sets the floor, not the price.
- **Three tiers, by willingness-to-pay, not feature gating for its own sake.** Anchor high, make the middle the obvious choice.
- **Packaging > price points.** What's bundled vs add-on moves revenue more than the numbers.
- **Price is a signal.** Too cheap reads as low-value to enterprise buyers.

## Process

1. **Choose the value metric** — test candidates against: scales with value? easy to
   understand? predictable for the buyer? hard to game?
2. **Pick the model** — flat / per-seat / usage / tiered / hybrid. Note the trade-offs for this ICP.
3. **Design tiers** — name them, set the fence (what moves a buyer up a tier), pick the
   anchor and the target tier. Add usage-based components where value is variable.
4. **Estimate willingness-to-pay** — from value delivered, competitor anchors, and (if
   available) the Van Westendorp-style "too cheap / too expensive" range. Flag assumptions.
5. **Pressure-test** — does it punish growth? leave money on the table at the top? confuse
   the buyer? expose to gaming?

## Output

Write to `docs/business/pricing-strategy.md` (use the `pricing-strategy` template) with
`Lifecycle` + `Last updated`. Include the chosen value metric, the tier table, the
rationale, and **open questions to validate with real customers**. Numbers are estimates —
link out to any live model rather than embedding a spreadsheet.
