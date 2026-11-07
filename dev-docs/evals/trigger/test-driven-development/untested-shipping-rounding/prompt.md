---
tags: [trigger, fire, test-driven-development]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Need to change how calculate_shipping() in the old orders module rounds weights: it rounds down now, it should round up to the nearest 0.5kg. There are no tests for this module at all.
