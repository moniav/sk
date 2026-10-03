---
name: technical-diagrams
description: Generates SVG architecture, flow and component diagrams in one consistent visual style. Use when the user asks for a diagram of a system, process or component, or when documentation needs an SVG figure.
---

# Technical SVG Diagrams

> Generate consistent, professional SVG diagrams for project documentation.

## Design System

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Background | Light gray | `#fafafa` |
| Grid lines | Subtle gray | `#e5e5e5` |
| Primary text | Dark gray | `#333` |
| Secondary text | Medium gray | `#666` |
| Muted text | Light gray | `#999` |
| Borders/arrows | Gray | `#ccc` |
| Success/positive | Green | `#27ae60` |
| Error/negative | Red | `#e74c3c` |
| Primary accent | Blue | `#3498db` |
| Warning/sandbox | Orange | `#f39c12` |
| Process step | Purple | `#9b59b6` |

### Typography

- **Font family:** `monospace` for all text
- **Title:** 14px bold, `#333`
- **Subtitle/tag:** 12px, `#888`, in brackets `[ LIKE_THIS ]`
- **Labels:** 10-11px, color matches element
- **Notes:** 7-8px, `#999`

## Diagram Types

### Architecture Diagrams

Horizontal left-to-right flow showing system components.

- **Use for:** System overviews, data flow, before/after comparisons
- **Dimensions:** 800-860 x 350-480
- **Structure:** Title + tag, components flow left to right, arrows connect, bottom summary note

### Flow Diagrams

Vertical top-to-bottom showing process steps.

- **Use for:** Execution flows, request lifecycles, step-by-step processes
- **Dimensions:** 600-620 x 700+ (adjust height for steps)
- **Structure:** Title + tag, dashed vertical guide, steps connected by arrows, decision diamonds, start/end ellipses

### Component Diagrams

Focused view of a single component's internals.

- **Use for:** Internal structure, nested elements, detailed breakdowns
- **Dimensions:** Varies by content
- **Structure:** Outer container, inner elements with semantic colors, labels

## SVG Base Template

```xml
<svg viewBox="0 0 WIDTH HEIGHT" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e5e5" stroke-width="0.5"/>
    </pattern>
    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#ccc"/>
    </marker>
    <marker id="arrowGreen" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#27ae60"/>
    </marker>
    <marker id="arrowBlue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#3498db"/>
    </marker>
  </defs>

  <!-- Background -->
  <rect width="WIDTH" height="HEIGHT" fill="#fafafa"/>
  <rect width="WIDTH" height="HEIGHT" fill="url(#grid)"/>

  <!-- Title -->
  <text x="40" y="35" font-family="monospace" font-size="14" fill="#333" font-weight="bold">TITLE</text>
  <text x="X" y="35" font-family="monospace" font-size="12" fill="#888">[ TAG ]</text>

  <!-- Content -->

  <!-- Bottom note -->
  <text x="CENTER" y="BOTTOM" font-family="monospace" font-size="10" fill="#999" text-anchor="middle">summary note</text>
</svg>
```

## Element Patterns

See `references/svg-elements.md` for copy-ready SVG patterns:
- Nodes (circle with inner dot)
- Containers (solid and dashed borders)
- Tool/component boxes
- Arrows and connections (horizontal, vertical, fan-out)
- Flow elements (ellipses, diamonds, process rectangles)
- Labels and notes

## Creating a Diagram

1. **Determine type and dimensions** based on what you're diagramming
2. **Start with the base template** above
3. **Add elements** using patterns from `references/svg-elements.md`
4. **Connect with arrows** — solid for primary flow, dashed for secondary
5. **Add labels** — component names in `SCREAMING_SNAKE_CASE`, actions in lowercase
6. **Save as `.svg`** to `docs/architecture/` or `docs/flows/`
7. **Update the index** — add to the section README

## Success Criteria

- [ ] Uses consistent color palette from design system
- [ ] All text is monospace
- [ ] Grid background applied
- [ ] Title with bracketed tag present
- [ ] Components properly connected with arrows
- [ ] Labels are clear and properly positioned
- [ ] Bottom summary note included
- [ ] SVG is valid XML
- [ ] Referenced from section README
