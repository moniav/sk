---
tags: [trigger, quiet, error-recovery]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

test_parse_date in tests/test_utils.py is failing: AssertionError: expected '2024-03-01' got '2024-02-29'. Can you fix the off-by-one in parse_date in utils.py?
