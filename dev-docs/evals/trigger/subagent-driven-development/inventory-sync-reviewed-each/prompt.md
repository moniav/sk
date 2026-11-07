---
tags: [trigger, fire, subagent-driven-development, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

For the inventory sync task I want a fresh agent writing each subtask and a separate one reviewing it against the acceptance criteria before you tick it off. 8 subtasks total.
