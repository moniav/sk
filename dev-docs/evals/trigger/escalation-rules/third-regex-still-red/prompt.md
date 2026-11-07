---
tags: [trigger, fire, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

ok that regex still doesn't match ISO dates with timezone offsets. that's the third version you've given me and test_parse_timestamps is still red with the same failure: '2024-05-01T10:00:00+02:00' not matched.
