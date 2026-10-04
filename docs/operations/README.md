# Operations

> Running the software in production: runbooks, incidents, and postmortems. This is the
> *operate* counterpart to the engineering docs that cover *building*.

**Last updated:** YYYY-MM-DD
**Lifecycle:** current

## Structure

```
operations/
├── README.md          <- this index
├── runbooks/          <- on-call, deploy, rollback, recovery: step-by-step ops procedures
├── incidents/         <- active/recent incident notes (timeline as it unfolds)
└── postmortems/       <- blameless postmortems after resolution
```

## How to use

| Want to… | Run |
|----------|-----|
| Respond to / record an active incident | `/sk:ops incident` |
| Write a blameless postmortem | `/sk:ops postmortem` (or `/sk:debug` offers it after a prod fix) |
| Author a runbook (deploy, rollback, recovery, on-call) | `/sk:ops runbook` |
| Design or review SLOs / error budgets / alerting | `/sk:ops reliability` |
| Production-readiness review | `/sk:ops readiness` |
| Scan operational posture | `/sk:ops` |

## How it relates to other homes

- **`sop/`** = *development* procedures (how to add an endpoint). **`operations/runbooks/`** =
  *production* procedures (what to do when the queue backs up at 3am).
- **`/sk:debug`** handles an active code bug (reproduce → root cause → fix); when it's a
  production incident, it offers to write a **postmortem** here.
- **`reviews/`** holds security/perf review reports; **postmortems** are incident retrospectives.

## Index

### Runbooks
| Runbook | Trigger | Lifecycle |
|---------|---------|-----------|
| _none yet_ | - | - |

### Postmortems
| Incident | Date | Severity | Status |
|----------|------|----------|--------|
| _none yet_ | - | - | - |

> Create a runbook with `/sk:new-sop` (save it under `operations/runbooks/`). Write a
> postmortem from `templates/postmortem.md` after an incident is resolved.
