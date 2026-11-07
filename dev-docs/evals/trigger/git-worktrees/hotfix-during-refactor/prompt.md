---
tags: [trigger, fire, git-worktrees]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

I'm in the middle of a big refactor on feature/search-v2 and prod needs a hotfix for the login bug ASAP. I don't want to keep flipping branches back and forth in this checkout. Set me up so I can do the hotfix in a separate copy of the repo and come back to my refactor untouched.
