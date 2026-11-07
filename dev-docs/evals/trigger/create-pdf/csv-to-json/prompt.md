---
tags: [trigger, quiet, create-pdf]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

convert data/customers.csv to JSON, one object per row, keys from the header row. write it to data/customers.json
