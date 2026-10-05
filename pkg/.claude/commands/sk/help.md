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
new product:    /sk:prd (product) -> /sk:kickoff   ┐
existing code:  /sk:init-docs -> /sk:prd (feature) ├-> /sk:plan -> /sk:dev -> /sk:test -> /sk:finish
one task:       /sk:new-task                       ┘   break down   build      verify     review, commit, PR
```

- **Not sure what to build:** `/sk:brainstorm` first; it ends with one direction and a brief that `/sk:prd` reads.
- **`/sk:prd`** grills the problem, the user flows and the architecture into a PRD, then writes the epics. `/sk:prd PRD-N` resumes; `/sk:prd PRD-N amend` changes an approved one.
- **`/sk:kickoff`** turns the PRD's stack into the engineering foundation (research, conventions, build commands, repo scaffold).

- **Small change (XS or S):** skip the flow. Describe the change, then `/sk:commit`.
- **One sitting, start to end:** `/sk:implement` runs plan, dev and test in one go.
- **Large feature without a PRD:** `/sk:new-epic` by hand, then a task per piece.
- **Many independent subtasks:** `/sk:orchestrate` runs them as a parallel agent team.

## Starting points

| You are... | Start with |
|------------|------------|
| In a project with no `docs/` tree yet | `/sk:scaffold`, then one of the next two |
| Starting a new project | `/sk:prd` to define it, then `/sk:kickoff` to set up the stack |
| Adding SK to an existing codebase | `/sk:init-docs`, then `/sk:prd` for the next feature |
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
