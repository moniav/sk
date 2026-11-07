---
tags: [trigger, quiet, escalation-rules, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Add an 'escalated' status to the support ticket model in app/models/ticket.rb, with a migration and a scope for it.
