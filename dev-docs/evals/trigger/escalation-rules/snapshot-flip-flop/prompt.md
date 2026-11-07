---
tags: [trigger, fire, escalation-rules, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

the snapshot test for <InvoiceTable/> keeps flip-flopping. we updated the snapshot, then pinned the locale, then mocked Date.now, and it's still failing in CI about 1 run in 3. I'm about out of patience with this one
