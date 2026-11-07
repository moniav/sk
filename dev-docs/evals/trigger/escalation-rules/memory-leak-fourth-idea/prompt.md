---
tags: [trigger, fire, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Tried your suggestion to close the DB cursors, didn't help. Tried the WeakMap cache, didn't help. Tried bumping node to 20, didn't help. RSS still climbs ~50MB/hour in the worker. Before you suggest a fourth thing, I want to step back.
