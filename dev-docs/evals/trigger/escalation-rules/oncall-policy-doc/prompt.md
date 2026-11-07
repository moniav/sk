---
tags: [trigger, quiet, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Write our on-call escalation policy in docs/ops/oncall.md: primary gets paged first, secondary after 15 minutes, then the eng manager after 30.
