---
tags: [trigger, fire, technical-writing, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Write the procedure for rotating the database credentials, step by step, for whoever is on call. Right now it's tribal knowledge in Dave's head; what he told me is roughly: vault write, restart the pods, verify with psql.
