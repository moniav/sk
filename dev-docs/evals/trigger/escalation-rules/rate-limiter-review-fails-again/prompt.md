---
tags: [trigger, fire, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Subtask 4 (rate limiter middleware) came back from review failing spec for the third time. The sliding window still counts requests from the previous window, and each fix has broken something else.
