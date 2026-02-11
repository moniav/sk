---
description: Create a Mermaid flow diagram for a system process (project)
---

# New Flow Diagram

Create a visual flow diagram in `docs/flows/` by analyzing actual code paths.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/flows/README.md` — Existing diagrams + Mermaid cheat sheet
2. `docs/templates/flow-diagram.md` — Flow template
3. `docs/architecture/README.md` — System components

## Step 2: Determine Flow Type

Ask the user what to diagram, then choose the best Mermaid diagram type:

| What to Diagram | Mermaid Type | Use When |
|----------------|-------------|----------|
| Component interactions | `sequenceDiagram` | Showing how services talk to each other |
| Process with decisions | `flowchart TD` | Showing logic paths and branches |
| Entity lifecycle | `stateDiagram-v2` | Showing how an entity changes state |
| Data model | `erDiagram` | Showing table relationships |
| System overview | `graph TB` | Showing high-level architecture |

## Step 3: Trace the Code

**Do not guess — read the actual code.**

1. Identify the entry point (API route, event handler, user action)
2. Follow the execution path through the codebase
3. Note every branch, decision, and external call
4. Identify error paths and edge cases
5. Map the exit points (responses, side effects, state changes)

Use the **Grep** tool to find the entry point:
- Search for function names, endpoint definitions, or handler registrations
- Then search for imports to trace the call chain

Use the **Read** tool to follow each file in the execution path.

## Step 4: Create Diagram

Save to `docs/flows/kebab-case-name.md` using `docs/templates/flow-diagram.md`.

### Diagram Quality Rules

- **Label every arrow** — What data or event flows between nodes
- **Show error paths** — Not just the happy path
- **Use subgraphs** — Group related components
- **Keep it readable** — Max ~15 nodes per diagram; split if larger
- **Match reality** — Every node should correspond to actual code

## Step 5: Add Step-by-Step Explanation

Below the diagram, document each step:

```markdown
## Step-by-Step

1. **Client sends request** — POST /api/endpoint with payload
2. **Middleware validates** — Zod schema checks input
3. **Service processes** — Business logic executes
4. **Database updates** — Transaction committed
5. **Response returned** — 201 with created entity
```

## Step 6: Update Index

Add to `docs/flows/README.md`:

```markdown
| [Flow Name](./flow-name.md) | Type | Description |
```

## Validation

- [ ] Diagram traces actual code paths (not imagined flow)
- [ ] Error paths included
- [ ] Every node corresponds to real code
- [ ] Arrow labels describe what flows between nodes
- [ ] Mermaid syntax renders correctly
- [ ] Step-by-step explanation matches diagram
- [ ] Added to `docs/flows/README.md`
