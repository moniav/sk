---
tags: [trigger, fire, stay-within-limits]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

This refactor will run for hours with lots of subagents. Pace it so we don't hit the limit mid-task and can resume cleanly.
