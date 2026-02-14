---
description: UI quality review — accessibility, responsive design, consistency, UX (project)
---

# UI Review — Quality Analysis

Analyze UI code for accessibility, responsive design, design consistency, performance, and UX patterns.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/system/tech-stack.md` — UI framework, component library, styling approach
3. `docs/conventions/code-style.md` — Component patterns, naming conventions
4. `docs/architecture/` — Component hierarchy and relationships (if exists)

## Step 2: Determine Scope

Ask the user what to review:

| Scope | What gets analyzed |
|-------|-------------------|
| **Full UI scan** | All component/page files in the project |
| **Changed files** | Only modified UI files (staged + unstaged) |
| **Specific component** | User-specified component or page |
| **Specific concern** | Focus on one area: a11y only, responsive only, or performance only |

## Step 3: Accessibility Audit (WCAG 2.2)

### Perceivable
- **Images** — all `<img>` have meaningful `alt` text (or `alt=""` for decorative)
- **Contrast** — text meets 4.5:1 ratio (normal) / 3:1 (large text)
- **Color-only info** — no information conveyed by color alone (add icons, text, patterns)
- **Text resizing** — content usable at 200% zoom, no horizontal scroll
- **Media** — video has captions, audio has transcripts (if applicable)

### Operable
- **Keyboard access** — all interactive elements reachable and operable via keyboard
- **Focus order** — logical tab order matching visual layout
- **Focus visible** — clear focus indicators on all interactive elements
- **Touch targets** — minimum 24x24px (WCAG 2.2 AA), ideally 44x44px
- **Skip navigation** — skip-to-content link for keyboard users
- **No keyboard traps** — user can always tab away from any element

### Understandable
- **Form labels** — every input has a visible `<label>` or `aria-label`
- **Error messages** — specific, helpful, associated with the field (`aria-describedby`)
- **Required fields** — clearly marked with `aria-required="true"` or `required`
- **Language** — `lang` attribute on `<html>` element
- **Consistent navigation** — same components behave the same way everywhere

### Robust
- **Semantic HTML** — correct elements (`<nav>`, `<main>`, `<button>`, `<a>`) not div-soup
- **ARIA correctness** — ARIA roles, states, and properties used correctly (or not needed with semantic HTML)
- **Heading hierarchy** — single `<h1>`, logical `<h2>`-`<h6>` nesting, no skipped levels
- **Interactive elements** — `<button>` for actions, `<a>` for navigation, correct `role` where needed
- **Keyboard handlers** — `onClick` on non-button elements also has `onKeyDown`/`onKeyUp`

## Step 4: Responsive Design

- **Mobile-first** — base styles target mobile, breakpoints add complexity for larger screens
- **320px minimum** — no horizontal scroll at 320px viewport width
- **Breakpoints** — consistent breakpoint values from design system/tokens
- **Tap targets** — adequately sized and spaced on touch devices
- **Fluid typography** — text scales between breakpoints (clamp/fluid type or responsive units)
- **Layout** — flexbox/grid used appropriately, no fixed widths that break at small sizes
- **Images** — responsive (`srcset`, `sizes`, or CSS `max-width: 100%`)
- **Overflow** — long text, URLs, and user content handled (truncation, wrapping, scrolling)

## Step 5: Design Consistency

- **Design tokens** — colors, spacing, typography from a shared token system (not hardcoded values)
- **Spacing system** — consistent scale (4px/8px grid or similar), no arbitrary pixel values
- **Color palette** — using defined theme colors, not one-off hex values
- **Typography scale** — consistent font sizes from a defined scale
- **Component patterns** — similar UI elements use the same component (not reimplemented)
- **States** — consistent loading, empty, error, and success states across the app
- **Icons** — consistent icon set and sizing throughout
- **Animation** — consistent timing and easing, respects `prefers-reduced-motion`

## Step 6: Performance

- **Image optimization** — appropriate formats (WebP/AVIF), correct sizing, not oversized
- **Lazy loading** — images and heavy components below the fold use lazy loading
- **Virtualized lists** — long lists (50+ items) use virtualization
- **Re-render prevention** — memoization where appropriate, stable references for callbacks/objects
- **Font loading** — `font-display: swap` or `optional`, subset fonts when possible
- **Layout shift** — dimensions set on images/embeds, skeleton loaders for async content
- **Bundle impact** — no unnecessarily large imports, tree-shaking friendly

## Step 7: UX Patterns

- **Form validation** — inline validation on blur, clear error messages, preserve user input on error
- **Loading indicators** — spinner or skeleton for async operations, no blank screens
- **Error recovery** — retry options for failed operations, clear error messages with next steps
- **Empty states** — helpful message + action when lists/views are empty (not just blank)
- **Destructive actions** — confirmation dialog before delete/remove/irreversible actions
- **Feedback** — visual confirmation for successful actions (toast, status change, etc.)
- **Navigation** — breadcrumbs or clear back navigation, no dead ends
- **Progressive disclosure** — complex forms broken into steps, advanced options hidden by default

## Step 8: Present Findings

Format findings by category:

### Critical (blocks users or breaks functionality)

| # | Category | Component:Line | Finding | Suggested Fix |
|---|----------|----------------|---------|---------------|
| 1 | Accessibility | `path:42` | Description | Fix |

### Warning (degrades experience)

| # | Category | Component:Line | Finding | Suggested Fix |
|---|----------|----------------|---------|---------------|
| 1 | Responsive | `path:88` | Description | Fix |

### Suggestion (polish and improvement)

| # | Category | Component:Line | Finding | Suggested Fix |
|---|----------|----------------|---------|---------------|
| 1 | Consistency | `path:15` | Description | Fix |

### Good (positive patterns worth noting)

| # | Category | Component:Line | What's Good |
|---|----------|----------------|-------------|
| 1 | UX | `path:30` | Description |

## Step 9: Accessibility Compliance Estimate

Based on the audit, estimate the current WCAG 2.2 conformance level:

- **Level A** — minimum accessibility, basic requirements met
- **Level AA** — standard target for most projects (recommended)
- **Level AAA** — highest level, exceeds most requirements

State the estimated level and list the specific gaps preventing the next level up.
