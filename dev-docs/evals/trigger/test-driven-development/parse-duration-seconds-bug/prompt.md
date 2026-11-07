---
tags: [trigger, fire, test-driven-development, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

parse_duration("1h30m") returns 90 but parse_duration("90s") returns 0. fix please, it's in src/duration.rs
