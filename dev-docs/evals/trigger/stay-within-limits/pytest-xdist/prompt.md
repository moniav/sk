---
tags: [trigger, quiet, stay-within-limits, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Make pytest run in parallel with xdist, the suite takes 12 minutes on CI.
