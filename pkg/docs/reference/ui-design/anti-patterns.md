# UI/UX Anti-Patterns Reference

> Consulted by `/sk:ui-review`. Category-specific and aesthetic anti-patterns with severity and a concrete fix.
> This is a **seed corpus**: extend it with patterns specific to your product and design system.

Severity: **HIGH** (blocks or visibly cheapens the product) · **MED** (degrades quality) · **LOW** (polish).

## AI-Slop Signals (generic "looks AI-generated" tells)

| # | Anti-pattern | Severity | Fix |
|---|--------------|----------|-----|
| 1 | Default purple/indigo → violet gradient on the hero / primary button | HIGH | Pick a palette from the product's brand; gradients only with intent and contrast |
| 2 | Untouched component-library defaults (raw shadcn/MUI look, default radii, default shadows everywhere) | MED | Set design tokens (radius, shadow, spacing) so the UI reads as *yours* |
| 3 | Emoji used as UI icons (check/rocket/fire glyphs in buttons/nav) | MED | Use a real icon set (Lucide/Tabler/Heroicons) at consistent sizes |
| 4 | Everything centered: every section a centered hero with a centered subhead | MED | Use real layout: left-aligned text blocks, asymmetric grids, content hierarchy |
| 5 | Uniform spacing: same gap between every element, no rhythm | MED | Group related elements (tighter) and separate sections (looser) per a spacing scale |
| 6 | Three identical feature cards with icon + heading + lorem-ish blurb | LOW | Vary card weight by importance; cut filler; show real content |
| 7 | Glassmorphism / heavy blur applied with no purpose | LOW | Reserve effects for surfaces that benefit; check contrast over them |

## Category-Specific Anti-Patterns

| # | Product type | Anti-pattern | Severity |
|---|--------------|--------------|----------|
| 8 | B2B / enterprise SaaS | Consumer-playful AI purple/pink gradients; undercuts trust | HIGH |
| 9 | Luxury / premium brand | Fast/bouncy animations + dense layouts; reads cheap | HIGH |
| 10 | Developer tool | Over-designed marketing chrome over the actual product/CLI; devs want signal, not splash | MED |
| 11 | Fintech / health | Playful microcopy or unclear states on money/health actions; erodes confidence | HIGH |
| 12 | Data-heavy dashboard | Decorative charts with poor data-ink ratio; style over legibility | MED |

## Interaction & State Anti-Patterns

| # | Anti-pattern | Severity | Good vs Bad |
|---|--------------|----------|-------------|
| 13 | Removing the focus outline | HIGH | Good: `:focus-visible { outline: 2px solid … }` · Bad: `outline: none` |
| 14 | `z-index` arms race | MED | Good: a documented scale (`z-10/20/50`) · Bad: `z-index: 9999` |
| 15 | No empty / loading / error state, just a blank area or spinner forever | MED | Provide all four states: loading, empty (with action), error (with retry), success |
| 16 | Destructive action with no confirmation | HIGH | Confirm or make easily undoable (undo toast) before irreversible delete |
| 17 | Color as the *only* signal (red/green with no icon or text) | HIGH | Pair color with an icon/label so it survives color-blindness and grayscale |

## Landing Page Anti-Patterns

For marketing and landing pages. The copy side of the same checks is `/sk:copywrite`'s landing page audit.

| # | Anti-pattern | Severity | Fix |
|---|--------------|----------|-----|
| 18 | No product above the fold: stock photo, abstract illustration or nothing | HIGH | A real screenshot, short clip or interactive preview in the hero |
| 19 | Primary CTA, CTA label or one line of proof pushed below the first phone screen | HIGH | Hero, CTA and one line of proof fit the first screen at 375px wide |
| 20 | Sign-up form asks for more than is needed to start (phone, company size, a card for a trial) | HIGH | Email alone, or social/SSO sign-in; collect the rest after sign-up |
| 21 | Proof that cannot be real shipped live: placeholder logos, unattributed testimonials | HIGH | Real logos and named quotes, or no proof strip until there are some |
| 22 | Nav links, secondary offers or several CTA labels competing with the primary action | MED | One primary action per page; remove or demote the rest |
| 23 | Primary CTA not repeated at the bottom of the page | MED | Repeat the same button, same label, after the last section |
| 24 | CTA label that says nothing ("Submit", "Get started", "Learn more") | MED | Say what happens: "Start my free trial", "Join the waitlist" |

## Interface Detail and Motion Anti-Patterns

For any interface. Detail and motion faults a viewer notices even when the layout is right; a motion fix also honours `prefers-reduced-motion`. Adapted from the `stageshow` skill in [benjitaylor/skills](https://github.com/benjitaylor/skills) (MIT).

| # | Anti-pattern | Severity | Fix |
|---|--------------|----------|-----|
| 25 | Filled and outline icons mixed in one toolbar, nav or list | LOW | One icon family and one style per surface |
| 26 | A label or value that swaps in one frame when it changes ("Save" to "Saved", a total) | MED | Change it in place: the old text leaves as the new arrives, and the control keeps its size |
| 27 | An element that enters with an animation but vanishes with none (toast, popover, row) | LOW | Keep it mounted through its exit, then remove it |
| 28 | A popover or menu that moves while open as its content changes height | MED | Anchor it to the edge it opened from and reserve its height |
| 29 | A list that jumps when a row is added or removed | MED | Animate the space the row takes so its neighbours move with it |
| 30 | A number's unit wrapping onto its own line in a stat or tile | LOW | Keep number and unit on one line; size the number to the tile |
| 31 | Rows padded far taller than their text, or spread out to fill an empty pane | LOW | Pad to the text (about 8 to 12px) and fill the pane with content, or shorten the pane |

## How to use in a review

- Match the product type (from `project-context.md`) to the category rows above.
- For a marketing or landing page, also check rows 18 to 24.
- For any interface, check rows 25 to 31; the motion rows (26 to 29) need the running UI or its code.
- Cite the row number in findings and give the specific fix, not generic advice.
- Treat HIGH rows as Critical/Warning; LOW as Suggestion.
