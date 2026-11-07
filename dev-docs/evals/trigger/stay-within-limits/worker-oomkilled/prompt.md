---
tags: [trigger, quiet, stay-within-limits, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

The worker container keeps getting OOMKilled at 512Mi. Should I raise the limit in k8s/worker.yaml or is something leaking?
