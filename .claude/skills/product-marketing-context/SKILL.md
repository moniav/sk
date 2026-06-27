---
name: product-marketing-context
description: Build product positioning and messaging — ICP, category, value prop, differentiation, messaging hierarchy. Invoked via /sk:positioning.
disable-model-invocation: true
---

# Product Marketing Context

Establish the foundational positioning every other GTM artifact (copy, competitor analysis,
pricing, sales decks) should inherit from. Positioning first; messaging follows.

## Before You Start

Gather (check `docs/system/project-context.md`, `docs/business/`, and any competitor docs first):

1. **Product** — what it does, the core capability.
2. **Best-fit customer** — who gets the most value, fastest. Be specific; "everyone" is not an ICP.
3. **Alternatives** — what they use today (including DIY / status quo).
4. **Unique attributes** — what's true of you and not of the alternatives.

## Principles (April Dunford's frame)

Positioning is **context-setting**: the frame that makes your value obvious to the right buyer.

- **Competitive alternatives** — what would they do without you? That defines your real market.
- **Unique attributes** — features/capabilities only you have.
- **Value** — the benefit those attributes enable, that the buyer cares about.
- **Best-fit ICP** — the buyers who care most about that value.
- **Market category** — the frame that makes the value obvious; pick the category that
  makes you the obvious choice, not the most impressive-sounding one.

## Process

1. **Map alternatives → attributes → value** — for each unique attribute, name the value it
   unlocks and which buyer cares.
2. **Define the ICP** — firmographics + the trigger/pain that makes them buy now.
3. **Choose the category** — the context that frames the value. Test: does it make the
   differentiation obvious to the ICP?
4. **Write the messaging hierarchy** — one-line positioning statement → 3 value pillars →
   proof for each. Everything downstream pulls from this.
5. **Sanity check** — would a best-fit buyer nod? Would a poor-fit buyer self-select out?

## Output

Write to `docs/business/positioning.md` (use the `positioning` template) with `Lifecycle` +
`Last updated`. The positioning statement and value pillars become the source of truth
`/sk:copywrite` and `/sk:competitor` should reference. Mark unvalidated claims as assumptions.
