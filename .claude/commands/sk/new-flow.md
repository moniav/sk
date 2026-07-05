---
description: Create a flow diagram — Mermaid markdown or SVG with consistent design system (project)
argument-hint: "[flow name]"
---

# New Flow Diagram

Create a visual diagram in `docs/flows/` or `docs/architecture/` by analyzing actual code paths.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/flows/README.md` — Existing diagrams
3. `docs/architecture/README.md` — System components

**Skip files that are empty or contain only template placeholders.**

## Step 2: Determine Output Format

Ask the user what to diagram, then choose the output format:

| Format | Best For | Output |
|--------|----------|--------|
| **Mermaid** (`.md`) | Quick diagrams, GitHub rendering, sequences, ER diagrams | Markdown with fenced Mermaid block |
| **SVG** (`.svg`) | Polished architecture, custom layouts, precise positioning, print/blog quality | Raw SVG file with design system |

**Default to SVG** for architecture and flow diagrams. Use Mermaid for sequences, ER diagrams, and quick sketches.

## Step 3: Choose Diagram Type

| What to Diagram | Recommended Format | Mermaid Type |
|----------------|-------------------|-------------|
| System architecture | **SVG** | `graph TB` |
| Process with decisions | **SVG** | `flowchart TD` |
| Component internals | **SVG** | — |
| Component interactions | Mermaid | `sequenceDiagram` |
| Entity lifecycle | Mermaid | `stateDiagram-v2` |
| Data model / ER | Mermaid | `erDiagram` |
| Quick sketch | Mermaid | any |

## Step 4: Trace the Code

**Do not guess — read the actual code.**

1. Identify the entry point (API route, event handler, CLI command, user action)
2. Follow the execution path through the codebase
3. Note every branch, decision, and external call
4. Identify error paths and edge cases
5. Map the exit points (responses, side effects, state changes)

Use **Grep** to find the entry point, then **Read** to follow each file.

## Step 5: Create Diagram

### SVG Path

Use the **technical-diagrams** skill. Read `.claude/skills/technical-diagrams/SKILL.md` for the design system and `.claude/skills/technical-diagrams/references/svg-elements.md` for copy-ready element patterns.

**Architecture diagrams** → save to `docs/architecture/{name}.svg`
**Flow diagrams** → save to `docs/flows/{name}.svg`

SVG requirements:
- Grid background (`#fafafa` with `#e5e5e5` grid pattern)
- Monospace font for all text
- Title with bracketed tag: `TITLE [ TAG ]`
- Semantic colors from the design system palette
- Bottom summary note
- Valid SVG XML

### Mermaid Path

Save to `docs/flows/{name}.md` using `docs/templates/flow-diagram.md` as starter.

Mermaid requirements:
- Label every arrow with data/event description
- Show error paths, not just happy path
- Use subgraphs to group related components
- Max ~15 nodes per diagram; split if larger
- Include step-by-step explanation below the diagram

## Step 6: Update Index

Add the new diagram to the appropriate README:

**For `docs/flows/`:**
```markdown
| [Flow Name](./flow-name.svg) | Type | Description |
```

**For `docs/architecture/`:**
```markdown
See [diagram-name.svg](./diagram-name.svg) for visual representation.
```

## Validation

- [ ] Diagram traces actual code paths (not imagined flow)
- [ ] Error/alternative paths included where relevant
- [ ] Every node corresponds to real code or real component
- [ ] Labels describe what flows between nodes
- [ ] **SVG:** Uses design system colors, grid, monospace, title+tag, bottom note
- [ ] **Mermaid:** Syntax renders correctly, step-by-step explanation included
- [ ] Added to section README index
