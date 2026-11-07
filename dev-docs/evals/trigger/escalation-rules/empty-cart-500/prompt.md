---
tags: [trigger, quiet, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

The /api/orders endpoint returns 500 when the cart is empty. Stack trace points at OrderService.total() dividing by items.length. Can you fix it?
