# Delegation Policy

> What agents may decide alone vs must escalate to a human. Commands consult this at
> their gates; the `headless-operation` skill enforces it on unattended runs.
> **This is a starting policy — edit it to widen or tighten autonomy as trust grows.**

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

## Decision Rights

| Action | Autonomous? | Conditions / notes |
|--------|-------------|--------------------|
| Read, analyze, research | **Yes** | Always |
| Edit code on a feature branch | **Yes** | Within the active task's scope |
| Create commits (conventional format) | **Yes** | Never amend, never skip hooks |
| Push a feature branch | **Yes** | Never force-push |
| Create a pull request | **Yes** | — |
| Merge to the default branch | **Ask** | Autonomous only if CI is green AND `/sk:review` verdict is SHIP — and only if you widen this row |
| Deploy, publish, release | **Never alone** | Explicit human confirmation every time |
| Spend money / sign up for external services | **Never alone** | — |
| Delete data, destructive migrations, force-push | **Never alone** | — |
| Modify CI config, permissions, or this policy file | **Ask** | Agents don't widen their own authority |
| Mark own work done | **Yes, with evidence** | Per `verification-before-completion` — pasted output, not claims |

## Complexity Ceiling

- **XS/S** — fully autonomous (Quick Path)
- **M** — autonomous through PLAN>DEV>TEST, but the plan gate requires either human approval or a passing `spec-reviewer` plan review
- **L/XL** — human approves the epic breakdown before implementation starts

## When Policy Says "Ask" and No Human Is Available

Don't block and don't proceed. **Escalate by artifact**: record the pending decision
as a `status: blocked` item on the task board (with what's needed and why), or a
dated report in `docs/operations/`, then continue with other in-policy work.

## Provenance

Every autonomous decision taken under this policy gets one line in
`docs/decisions/decision-log.md` (or the task's Progress Log if the log doesn't
exist): what was decided, which policy row covered it, who (session/agent), and the
run date. "Why is the system like this?" must stay answerable without archaeology.
