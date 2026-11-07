---
tags: [trigger, fire, escalation-rules, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Third rebuild, still 'exec /app/entrypoint.sh: no such file or directory'. We did chmod +x, we switched the shebang to bash, we fixed line endings with dos2unix. I'm stuck.
