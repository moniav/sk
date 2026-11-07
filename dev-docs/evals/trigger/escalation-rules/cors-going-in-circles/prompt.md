---
tags: [trigger, fire, escalation-rules]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

We've been going back and forth on this CORS thing for an hour. You changed the middleware order, then added the origin allowlist, then tried the proxy config in vite.config.ts, and the browser still says 'No Access-Control-Allow-Origin header is present'. Feels like we're going in circles.
