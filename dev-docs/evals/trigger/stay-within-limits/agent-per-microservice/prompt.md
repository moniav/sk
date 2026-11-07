---
tags: [trigger, fire, stay-within-limits]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Launch an agent per microservice (there are 18 under services/) to audit how each one handles retries and timeouts, then consolidate the findings into one report.
