# Visual Design & Aesthetic Reference

> Consulted by `/sk:ui-review` for the **taste** dimension: the part a WCAG/compliance pass doesn't cover.
> Critique-first: use this to judge a rendered/coded UI, not to generate a design system.

## Aesthetic Audit Checklist

Rate each dimension and name the specific gap. A "10" answer is given so the review can say what would raise the score.

| Dimension | What "good" looks like |
|-----------|------------------------|
| **Visual hierarchy** | Eye lands on the most important thing first; size/weight/color encode importance, not decoration |
| **Whitespace & rhythm** | Related things grouped tight, sections separated loose; consistent spacing scale, not uniform gaps |
| **Type scale** | A clear modular scale (e.g. 1.2–1.333 ratio); 2 font families max; line length 60–75 chars |
| **Color sophistication** | A deliberate palette with one accent, neutrals doing the heavy lifting; not rainbow, not default-purple |
| **Consistency** | Same component for the same job; tokens for color/space/radius, no one-off hex or arbitrary px |
| **Restraint** | Effects (shadow, blur, gradient, motion) used with intent, not everywhere |

## Numeric Thresholds (cite these in findings)

- **Contrast:** 4.5:1 normal text, 3:1 large text / UI components.
- **Touch targets:** 44×44px ideal (24×24px WCAG 2.2 minimum).
- **Line length:** 60–75 characters for body copy.
- **Type scale:** pick one ratio (1.2 / 1.25 / 1.333) and use it consistently.
- **Spacing:** a 4px or 8px base grid; no arbitrary values.
- **Motion:** 150–300ms for most UI transitions; respect `prefers-reduced-motion`.
- **Layout shift:** CLS < 0.1 (set dimensions on images/embeds, reserve space for async content).

## Choosing / Judging a Visual Style

When assessing whether a chosen style fits, check it on multiple axes: a style can look good but fail a hard constraint:

| Axis | Question |
|------|----------|
| **Fit** | Does the style match the product type and audience? (see `anti-patterns.md` category rows) |
| **Accessibility** | Does it hold contrast and focus visibility? (glassmorphism/low-contrast often fails) |
| **Dark mode** | Does it work in both themes, or only one? |
| **Mobile** | Does the footprint and density survive small screens? |
| **Performance** | Heavy blur/shadow/animation cost: acceptable for this surface? |
| **Conversion** | For marketing surfaces: does it support the CTA, or distract from it? |

## Persisting a Design System (optional)

For projects with a real design system, capture it once in `docs/design/DESIGN.md` (aesthetic direction, palette tokens, type pairing, spacing scale, motion). `/sk:ui-review` should then check the UI *against* that file rather than against generic defaults: deviations from the canonical tokens become findings.
