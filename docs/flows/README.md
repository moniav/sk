# Flow Diagrams

> Visual diagrams for SK processes, in Mermaid so they render on GitHub and in most Markdown viewers.

**Last updated:** 2026-10-05
**Lifecycle:** current

## Diagram Index

| Flow | Type | Description |
|------|------|-------------|
| [Idea to epics](./idea-to-epics.md) | Flowchart (Mermaid) | `/sk:brainstorm` → `/sk:prd` (brief, flows, requirements, architecture, delivery) → epics → `/sk:kickoff` or `/sk:plan`; which command owns each step |
| [Install channels](./install-channels.md) | Flowchart (Mermaid) | Plugin plus `init`, or files copied into the project: what each writes and records |
| [Safe update](./safe-update.md) | Flowchart (Mermaid) | How `update` decides, per file, between overwrite, keep with a sidecar, and skip |

## Architecture Diagrams

See [Architecture](../architecture/README.md) for the system overview.

The README diagrams (how it works, getting started, task lifecycle, task hierarchy, command map) are Mermaid sources in `assets/src/`, rendered to PNG in `assets/`.

## Archived

The earlier SVG install flow describes the CLI as it was at v1.6 and is in [`_archive/`](../_archive/README.md).

> Create new flow diagrams with `/sk:new-flow`, using the [flow template](../templates/flow-diagram.md).
