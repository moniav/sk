---
tags: [trigger, quiet, stay-within-limits]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Our app keeps hitting the GitHub API rate limit (403 with X-RateLimit-Remaining: 0). Add backoff and retry handling in src/github/client.ts.
