---
tags: [trigger, quiet, stay-within-limits, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Our summarizer requests are getting truncated. Add a check in summarize.py that keeps the prompt under 8k tokens before sending.
