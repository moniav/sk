---
tags: [trigger, fire, error-recovery, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

All tests pass on my machine but CI has been red since this morning on every branch, including main which nobody touched. The integration suite fails with ECONNREFUSED 127.0.0.1:6379. Something's broken and I don't know where to start.
