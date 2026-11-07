---
tags: [trigger, quiet, error-recovery, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

TypeScript complains `Property 'email' does not exist on type 'User'` in src/routes/signup.ts after I added the field to the form. How do I add it to the type?
