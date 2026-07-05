# Templates

> Starter templates for every doc type. Copy one when creating a new doc — most are emitted
> automatically by the `/sk:` command in the right-hand column.

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

> These are scaffolds with intentional placeholder links (`{N}`, `[Name]`) — `/sk:docs-audit`
> exempts this folder from the broken-link check.

## Lifecycle / work templates

| Template | Creates | Command |
|----------|---------|---------|
| `epic.md` | An epic (multi-task feature) | `/sk:new-epic` |
| `task-prd.md` | A task with Plan/Dev/Test phases | `/sk:new-task` |
| `sop-procedure.md` | A standard operating procedure | `/sk:new-sop` |
| `adr-decision.md` | An architecture decision record | `/sk:new-adr` |
| `flow-diagram.md` | A Mermaid/SVG flow diagram | `/sk:new-flow` |
| `component-doc.md` | An architecture component doc | manual / `/sk:init-docs` |
| `feature-doc.md` | A per-feature doc | `/sk:new-feature-doc` |
| `user-guide.md` | A customer-facing guide | `/sk:new-user-guide` |
| `postmortem.md` | A blameless postmortem | `/sk:ops postmortem`, `/sk:debug` |
| `research-doc.md` | A research/investigation artifact | `/sk:brainstorm`, `/sk:debug` |
| `review-report.md` | A review report | `/sk:code-review`, `/sk:security-review`, … |

## Business / GTM templates

| Template | Creates | Command |
|----------|---------|---------|
| `positioning.md` | Positioning & messaging | `/sk:positioning` |
| `competitor-profile.md` | A competitor profile | `/sk:competitor` |
| `pricing-strategy.md` | A pricing strategy | `/sk:pricing` |
| `business-plan.md` | A business plan | `/sk:new-business-doc` |
| `financial-model.md` | A financial-model summary | `/sk:new-business-doc` |
| `cap-table.md` | A cap-table snapshot | `/sk:new-business-doc` |
| `investor-update.md` | An investor update | `/sk:new-business-doc` |
| `decision-memo.md` | A decision memo | `/sk:new-business-doc` |
| `goals.md` | Company goals — the strategy layer epics link to via `goal:` | `/sk:new-business-doc` |
| `brand-voice.md` | How the company sounds — overrides the copywriting default voice | `/sk:new-business-doc` |
| `campaign.md` | A marketing campaign — goal-linked plan, assets, honest results | `/sk:campaign` |
| `metrics.md` | Metrics dictionary — what each number means + its source of truth | `/sk:new-business-doc` |
| `executive-charter.md` | A custom executive seat over the executive-meeting skill | manual |

> Evergreen templates carry a `Lifecycle` field (see
> [../conventions/doc-lifecycle.md](../conventions/doc-lifecycle.md)). Transient ones
> (`epic`, `task-prd`, `research-doc`, `review-report`) use YAML frontmatter instead.
