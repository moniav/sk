---
tags: [trigger, fire, error-recovery]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

bumped webpack 4 -> 5 along with react-scripts and now `npm run build` dies with:

Module not found: Error: Can't resolve 'crypto' in '/app/node_modules/jsonwebtoken/lib'

it was fine yesterday. what happened and how do i get back to a working build
