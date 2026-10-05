# Flow Diagrams

> Visual diagrams for SK processes, in Mermaid so they render on GitHub and in most Markdown viewers.

**Last updated:** 2026-10-05
**Lifecycle:** current

## Diagram Index

| Flow | Type | Description |
|------|------|-------------|
| [Idea to epics](./idea-to-epics.md) | Flowchart (Mermaid) | `/sk:brainstorm` → `/sk:prd` (brief, flows, requirements, architecture, delivery) → epics → `/sk:kickoff` or `/sk:plan`; which command owns each step |
| [Install and update](./install-and-update.md) | Flowchart (Mermaid) | Plugin install, `/sk:scaffold` init / update / migrate, and the per-doc update decision |

## Architecture Diagrams

See [Architecture](../architecture/README.md) for the system overview.

The README diagrams (how it works, getting started, task lifecycle, task hierarchy, command map) are Mermaid sources in `assets/src/`, rendered to PNG in `assets/`.

## Archived

The SK 2.x flows (two install channels, per-file update of copied commands) and the v1.6 SVG install flow are in [`_archive/`](../_archive/README.md).

> Create new flow diagrams with `/sk:new-flow`, using the [flow template](../templates/flow-diagram.md).
