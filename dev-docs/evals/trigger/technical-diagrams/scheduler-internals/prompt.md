---
tags: [trigger, fire, technical-diagrams]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Diagram the internals of the scheduler component (src/scheduler/): the queue, the lease manager, the worker pool and the retry backoff. It should match the style of the other figures in docs/.
