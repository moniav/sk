---
tags: [trigger, quiet, escalation-rules, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Let's try a different approach to the caching: instead of Redis, use an in-memory LRU in src/cache.ts with a 10k entry cap. Go ahead.
