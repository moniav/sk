---
tags: [trigger, fire, stay-within-limits, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Generate reference pages for all 75 endpoints in openapi.yaml, using subagents so it goes faster. If you run out of room partway, I need to be able to pick it back up cleanly.
