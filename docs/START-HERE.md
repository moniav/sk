# Start Here

> **Human front door.** Pick your lane below. (If you're an AI agent, read
> [`README.md`](./README.md) instead: it's the machine index.)

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

This project's documentation is organized by audience. Find your role, follow the lane.
Delete any lane your project doesn't need.

## I want to…

| If you're a… | Start with | Then |
|--------------|-----------|------|
| **New engineer** | [system/project-context.md](./system/project-context.md): what this is | [conventions/](./conventions/) → [architecture/](./architecture/) |
| **Defining what to build** | [prd/](./prd/): the PRDs, each with its flows, requirements and architecture | [system/glossary.md](./system/glossary.md) → [decisions/](./decisions/) |
| **Building a feature** | [features/](./features/): how subsystems work | [tasks/](./tasks/) → [flows/](./flows/) |
| **On-call / operating prod** | [operations/](./operations/): runbooks, postmortems | [system/](./system/) |
| **End user / customer** | [user-guides/](./user-guides/): how to use the product | - |
| **Business / GTM** | [business/](./business/): positioning, competitors, pricing | - |
| **Compliance / legal** | [legal/](./legal/): agreements, policies, compliance scans | [decisions/](./decisions/) |
| **Returning contributor** | [tasks/](./tasks/): what's in flight | [README.md](./README.md): full map |

## Conventions you should know

- Every evergreen doc carries a **`Lifecycle`** field (`current` / `stale` /
  `deprecated` / `archived`). Run `/sk:docs-audit` to check doc health.
- Superseded docs live in [`_archive/`](./_archive/), not deleted.
- Full section map and AI-agent guidance: [README.md](./README.md).
