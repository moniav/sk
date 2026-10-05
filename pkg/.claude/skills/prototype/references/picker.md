# Picker

The control that switches between variants. It is chrome, not a design decision: build it as specified here in every prototype, and do not restyle it to match the product.

## Placement and look

- A bar fixed to the bottom centre of the viewport, above all content (`z-index` max), 8px from the bottom edge.
- Dark background (`#111`, 92% opacity), white text, 13px system font, 8px radius, 6px padding, a subtle shadow. It must stay readable over any variant.
- `dir="ltr"` on the bar itself, even when the prototype is RTL, so the controls do not flip.

## Contents, left to right

1. One button per variant: its number and name ("1 Guided"). The active one is filled white with dark text.
2. A divider, then the active variant's axis in muted text ("axis: number of steps").
3. A **Demo / Worst case** segmented toggle.
4. A **Simulate failure** toggle, present only when the flow has failure paths to show.
5. A **Reset** button that returns the active variant to the flow's first step with fresh state.

## Behaviour

- Keys: `1`–`5` select a variant, `←` and `→` step through them, `w` toggles worst case, `f` toggles failure, `r` resets. Ignore keys while focus is in a text input.
- Switching is instant, with no transition.
- Switching variant or dataset resets the flow to its first step.
- The selected variant, dataset and failure state go into the URL hash (`#v=2&data=worst&fail=1`), so a link reopens the same view.
- Buttons are real `<button>` elements with visible focus rings and `aria-pressed`.
- On screens narrower than 480px, the axis text is hidden and the variant names shorten to their numbers.
