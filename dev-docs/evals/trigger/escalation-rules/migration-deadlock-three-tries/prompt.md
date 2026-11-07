---
tags: [trigger, fire, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

migration 0042 fails again. You've now tried wrapping it in a transaction, splitting the ALTER into two steps, and dropping the index first. Still 'deadlock detected' on staging. what now
