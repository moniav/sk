# Design note: project-local verify skill (plan item 4.6)

> Status: proposal, not approved, nothing built.
> Source: item 4.6 of `2026-10-best-practices-enhancement-plan.md`.
> Written 2026-10-04.

## The problem

SK tells the agent to prove its work (`verification-before-completion`, `/sk:test`), but it cannot tell the agent how to run the user's app.
Every session rediscovers the same facts: which command starts the app, which port it listens on, how to tell it is healthy, how to log in, how to stop it.
When the rediscovery fails, the agent falls back to "the tests pass", which is the `ran` rung of the proof scale at best, and often only `walked`.
The facts are project-specific, so they cannot ship inside SK.
They have to be written once inside the project and kept there.

## Proposal

A new user-invoked command, `/sk:verify-setup`, that writes a skill into the user's project at `.claude/skills/verify/SKILL.md` and runs it once before handing over.

The generated skill has five fixed sections:

1. **Launch:** the exact command, the working directory, required environment variables (names only, never values), and how long startup takes.
2. **Health check:** one command or URL that returns a known result when the app is up.
3. **Drive:** how to exercise the app, by surface. A CLI: the invocation and a sample input. An API: a base URL and one authenticated request. A UI: the URL, a test login, and the browsing tool available in the project.
4. **Teardown:** how to stop everything the launch started, including background processes and containers.
5. **Feature map:** up to fifteen rows of feature, where to reach it, and what "working" looks like.

The description of the generated skill is trigger-first ("Use when a change must be checked in the running app..."), so it is model-invoked.
It is the project's file, not SK's: it is not in the manifest, `update` never touches it, and `remove` leaves it.

## How the command works

1. **Look up, do not ask.** Read `docs/system/project-context.md` build commands, the package manifest scripts, any `Makefile`, `Procfile`, compose file and CI workflow. This follows the `interviewing` skill: facts are looked up, only decisions are asked.
2. **Ask one round** for what could not be found: test credentials source, which surfaces matter, anything that must not be started (a production database, a paid API).
3. **Write the skill** from a template shipped in `pkg/docs/templates/verify-skill.md`.
4. **Run it once:** launch, health check, one drive step, teardown. Each step is recorded with its proof rung.
5. **Hand over** with what ran and what did not. A step that failed stays in the skill marked `untested`, with the error. The command does not claim a working skill it has not run.

## Decisions needed

| # | Question | Recommendation | Why |
|---|----------|----------------|-----|
| V1 | Generated skill, or a section in `docs/system/project-context.md`? | Generated skill. | A doc section is loaded only when a command reads it. A skill is reached for by the model at the moment it needs to verify, and costs one description line otherwise. |
| V2 | Name: `verify` or `sk-verify`? | `verify`. | It belongs to the project. An `sk-` prefix suggests SK owns and updates it. If a `verify` skill already exists, stop and ask. |
| V3 | New command, or a step inside `/sk:kickoff` and `/sk:init-docs`? | New command, suggested by both. | It needs a runnable app, which a fresh project does not have yet. It must also be re-runnable when the launch changes. |
| V4 | Does `/sk:test` depend on it? | No. `/sk:test` uses it when present and says so; when absent it suggests the user run `/sk:verify-setup` once. | SK must keep working in projects with nothing to launch (libraries, docs repos). |
| V5 | Who keeps it current? | `/sk:retro` routes "could not launch the app" findings to it; `/sk:verify-setup` re-runs and diffs. No automatic rewrite. | The file is the user's. Silent rewrites of a user's file are what safe update was built to stop. |
| V6 | Secrets | Names of variables and where they come from only. The command refuses to write a value that looks like a credential. | The skill is committed to the repository. |

## Risks

- **The first run starts real processes.** The command lists what it will launch and waits for approval before step 4. In a headless run it writes the skill and skips the run, marking every step `untested`.
- **It goes stale.** A launch command that changed makes the skill wrong, and a wrong skill is worse than none. Mitigation: the skill's first step is the health check, and a failed health check tells the agent to re-derive and report, not to trust the file.
- **Language neutrality.** The command must not assume Node, Python or any runner. The lookup list above is a list of places, not of tools, and the template has no default commands.
- **Windows.** Background processes and teardown differ by shell. The template records the shell the commands were verified in.
- **It cannot be evaluated here.** A behaviour eval needs `Bash`, which `claude plugin eval` refuses on native Windows. It would have to be tested by hand in two or three real projects (a CLI, an API, a UI app) or in CI on Linux.

## Cost

One command (about 120 lines), one template, one line each in `/sk:help`, `/sk:test`, `/sk:kickoff` and `/sk:retro`'s routing table, count updates, and a regression test that `update` and `remove` leave `.claude/skills/verify/` alone.
Size M.

## Recommendation

Build it, after Waves 1 to 4 are released, as its own minor version.
It is the one Wave 4 item that adds a capability SK cannot get any other way, and it is what makes the proof scale reachable above `ran` in a UI project.
It should not be built before the hand test in real projects is possible, because without that it would ship unverified, which is the failure it exists to prevent.
