---
tags: [trigger, fire, plow-ahead, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Go ahead and wire the new structured logger through all the services. You decide log levels and field names, just don't touch anything in infra/ or the prod configs without asking me.
