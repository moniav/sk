---
tags: [trigger, quiet, subagent-driven-development]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Use a couple of agents in parallel to search the codebase for every place we read environment variables.
