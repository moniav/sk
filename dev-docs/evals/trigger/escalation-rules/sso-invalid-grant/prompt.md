---
tags: [trigger, quiet, escalation-rules, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Login started failing for SSO users this morning with 'invalid_grant' from Okta. Can you look at auth/oidc.py and figure out what's up?
