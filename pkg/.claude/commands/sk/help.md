---
description: Find the right SK command for what you want to do
argument-hint: "[what you want to do (optional)]"
disable-model-invocation: true
---

# Help — Which Command?

**Arguments:** `$ARGUMENTS`

If the arguments describe a situation, answer with the one or two commands that fit it, one line on why, and what comes next in the flow. Do not print the whole map.
If there are no arguments, print the map below as it is.
Do not run any command from here. This command only points the way.

## The main flow: idea to shipped

```
/sk:brainstorm  ->  /sk:new-task  ->  /sk:plan  ->  /sk:dev  ->  /sk:test  ->  /sk:finish
   explore           track it        break down    build        verify        review, commit, PR
```

- **Small change (XS or S):** skip the flow. Describe the change, then `/sk:commit`.
- **One sitting, start to end:** `/sk:implement` runs plan, dev and test in one go.
- **Large feature (several tasks):** `/sk:new-epic`, then a task per piece.
- **Many independent subtasks:** `/sk:orchestrate` runs them as a parallel agent team.

## Starting points

| You are... | Start with |
|------------|------------|
| Starting a new project | `/sk:kickoff` |
| Adding SK to an existing codebase | `/sk:init-docs` |
| Coming back to work in progress | `/sk:resume`, or `/sk:task-status` for the whole board |
| Looking at something broken | `/sk:debug` |
| Unsure which way to go on a decision | `/sk:council`, then `/sk:new-adr` to record it |

## By situation

| I want to... | Command |
|--------------|---------|
| Review a branch before shipping, all dimensions | `/sk:review` |
| Review one dimension | `/sk:code-review`, `/sk:security-review`, `/sk:perf-review`, `/sk:ui-review` |
| Explain a change to a reviewer | `/sk:recap` |
| Commit, or open a pull request | `/sk:commit`, `/sk:pr` |
| Cut a release and announce it | `/sk:changelog`, `/sk:release`, `/sk:announce` |
| Restructure code without changing behaviour | `/sk:refactor` |
| Upgrade a dependency or run a migration | `/sk:migrate` |
| Check dependencies, or collect tech-debt markers | `/sk:deps`, `/sk:debt` |
| Look back at finished work | `/sk:retro` |
| Bring the docs in line with the code | `/sk:update-docs`; `/sk:docs-audit` to find what is stale |
| Write a doc | `/sk:new-feature-doc`, `/sk:new-user-guide`, `/sk:new-sop`, `/sk:new-flow`, `/sk:new-adr` |
| Run production: incidents, runbooks, SLOs | `/sk:ops` |
| Automate recurring checks | `/sk:routines` |
| Handle legal and compliance | `/sk:legal-scan` |
| Do go-to-market work | `/sk:positioning`, `/sk:competitor`, `/sk:pricing`, `/sk:copywrite`, `/sk:campaign`, `/sk:new-business-doc` |
| Talk strategy with an executive seat | `/sk:ceo`, `/sk:cto`, `/sk:cmo`, `/sk:coo`; `/sk:founder` for the weekly packet |
| Update SK itself | `/sk:update` |

## Good to know

- Claude starts only six commands by itself: `debug`, `resume`, `task-status`, `new-task`, `plan` and `review`. Type the others.
- Most commands take an argument; the hint appears as you type the command name.
- The full reference, with what each command needs before it runs, is `docs/commands-reference.md`.
