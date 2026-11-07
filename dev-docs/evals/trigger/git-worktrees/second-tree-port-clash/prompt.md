---
tags: [trigger, fire, git-worktrees, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

I made a second worktree for the payments task and now the dev server says port 3000 is in use, and my tests seem to be hitting the other tree's database. Sort out the setup so they're actually separate.
