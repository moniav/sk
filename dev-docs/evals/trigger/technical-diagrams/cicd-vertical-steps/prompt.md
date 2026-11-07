---
tags: [trigger, fire, technical-diagrams, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

sketch our CI/CD pipeline as a picture: PR opened, lint+test, preview deploy, merge, staging, manual approval, prod. Vertical steps with the approval as a decision point.
