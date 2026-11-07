---
tags: [trigger, fire, error-recovery]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Deploy to prod went out 20 min ago and half the pods are in CrashLoopBackOff, logs say 'Error: missing env DATABASE_POOL_SIZE'. The other half are still on the old version. What do we do right now?
