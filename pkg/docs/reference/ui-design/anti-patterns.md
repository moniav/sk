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

## How to use in a review

- Match the product type (from `project-context.md`) to the category rows above.
- Cite the row number in findings and give the specific fix, not generic advice.
- Treat HIGH rows as Critical/Warning; LOW as Suggestion.
