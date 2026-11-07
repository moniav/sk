---
tags: [trigger, quiet, stay-within-limits]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Fix the off-by-one in pagination, it's in two files: src/api/list.ts and src/ui/Pager.tsx.
