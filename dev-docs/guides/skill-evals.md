# Skill evals

> How SK measures whether a change to a skill, command or description helped.
> Dev-only: nothing here ships.

## Why

A skill is only useful if the model reaches for it at the right moment and then follows it.
Both are behaviours, so they are measured by running real sessions, not by reading the file.
Run the suite before and after any change to a description, a trigger, or the length of a prompt, and compare.

## The tool

SK uses Claude Code's built-in `claude plugin eval`.
Each case is a prompt plus one or more graders; each run is a fresh, isolated session with only the SK plugin loaded.
The run cannot read the eval directory, so a case never leaks into the session it tests.

```bash
npm run evals -- --tag trigger --model haiku --max-cost-usd 3
npm run evals -- --tag test-driven-development --runs 1
```

`scripts/evals.mjs` adds `--eval-dir dev-docs/evals --ablation none --no-publish --trust-plugin` and passes the rest through.
Results go to `dev-docs/evals/results/<timestamp>/` (ignored by git); copy a run you want to keep into `dev-docs/evals/baselines/`.

**It costs money.**
Every run is a model session on your account.
A trigger case on Haiku costs about $0.03 per run; the 33-case trigger suite at the default 3 runs is 99 runs per model.
Always pass `--max-cost-usd`.

**Requirements.**
Claude Code 2.1.269 or later.
Git 2.31 or later, or no git on the PATH; the script hides an older git from the run.
Cases that need `Bash` cannot run on native Windows (no sandbox backend): use WSL2 or CI for those.

## What is in the suite

```
dev-docs/evals/
├── trigger/<skill>/<case>/
│   ├── prompt.md              the request, as a user would type it
│   └── graders/
│       ├── fired.md           passes when the skill was invoked
│       └── stayed-quiet.md    passes when it was not
└── behaviour/<case>/
    ├── case.yaml              tags, turn and time limits, tools, and context.scaffold_script
    ├── fixture.sh             builds the small git repository the case runs in
    ├── prompt.md              the request
    └── graders/               what must have happened (llm, regex, tool_used, tool_order, file_exists)
```

**Trigger cases** (`--tag trigger`): for each model-invoked skill, two requests that should fire it (`--tag fire`) and one near miss that should not (`--tag quiet`).
Each case is also tagged with its skill name.

**Behaviour cases** (`--suite behaviour`): one case per promise SK makes (a review finds the bug and drops the noise, a report-only command edits nothing, a plan stops on an open question, pressure does not replace evidence). The list is in `dev-docs/evals/behaviour/README.md`.
Each run starts in an empty directory, so `fixture.sh` builds the repository: files and git state only, since project configuration written there is not loaded.
`--suite behaviour` passes `--scaffold` (the fixtures are this repository's own scripts), grants `Bash`, `Edit`, `Write` and `Agent`, and runs every case with and without the plugin.
The "vs none" column of `scripts/eval-summary.mjs` is what SK contributed. A case at zero still guards a promise against regression (plain Claude may already do the right thing); a case below zero means SK makes things worse and is a finding.
They need `Bash`, so they run on Linux, macOS, WSL2 or CI.

## Writing a case

1. Write the prompt the way a user would, without naming the skill unless a user would.
2. Keep the words "eval", "test case", "rubric", "judge" and "benchmark" out of the prompt.
   A session that knows it is being measured behaves differently.
3. Grade from what happened, not from what the session says about itself: `tool_used` for whether a skill fired, `regex` over a produced file, `llm` only for short outputs with concrete PASS and FAIL conditions.
4. Never ask the session which skills it used.
5. For a "must not fire" check, use `tool_used` with `min: 0` and `max: 0`.
6. Give trigger graders `arm: both` so they are scored in every mode.
7. In a behaviour case, a grader only the plugin could pass (a section name SK's report uses) gets `arm: with-only`; a grader both arms could pass stays scored, which is what makes the difference measurable.
8. An `llm` grader names the concrete evidence: superficial evidence (the right file name with the wrong content, the right heading over an empty section) is a fail.
9. Never copy a case's prompt or grader wording into a description or command. The case then measures the copy, not the behaviour.

## Reading a result

- A skill that fires on its `fire` cases and stays quiet on its `quiet` case has a working description.
- A skill that never fires has a description the model does not match, or one that was dropped from the listing.
- A skill that fires on its `quiet` case has a description that is too broad.
- Compare across Haiku, Sonnet and Opus: a description that only works on the largest model is too subtle, and SK dispatches subagents on the smaller ones.
- One run tells you little. Use the default three runs before drawing a conclusion.

## Tuning a description

1. Tune on Haiku (about $1.70 for the whole trigger suite at 3 runs); validate the result once on Sonnet (about $25 for the suite, or a few dollars with `--tag <skill>`).
2. At most two edits to one description per round. Read the failures of the training cases only.
3. Keep a change only on a strict held-out gain, and only if no other skill's quiet score drops. With 9 held-out runs per skill and kind, one run is 11 points: a single-run move on one skill is noise (it shows up on unchanged descriptions too).
4. Describe the moment to load the skill and what skipping it costs; never copy a case's wording.
5. A skill that stays under about 50% on held-out cases after tuning gets its rule delivered another way, recorded here.

**Status after the 3.2 tuning** (held-out fire; Haiku / Sonnet):

| Skill | Haiku | Sonnet | Delivered also by |
|-------|-------|--------|-------------------|
| create-pdf | 56-67% | 100% | description |
| technical-diagrams | 56-78% | 100% | description |
| technical-writing | 22% | 100% | description (tuned) |
| git-worktrees | 22% | 67% | description (tuned) |
| subagent-driven-development | 22% | 67% | `/sk:dev`, `/sk:implement`, `/sk:orchestrate` |
| escalation-rules | 0% | 33% | CLAUDE.md rule 7; `/sk:test`, `/sk:debug`, `/sk:refactor`, `/sk:orchestrate`, `debugger` |
| stay-within-limits | 0% | 33% | `/sk:orchestrate` |
| plow-ahead | 0% | 56% | CLAUDE.md rule 8 |
| error-recovery | 0% | 11% | `/sk:debug` (broken repository, dependency or deploy state) |
| test-driven-development | 0% | 0% | `subtask-execution`, `implementer`, `/sk:debug`; session briefing in dev |
| verification-before-completion | 0% | 0% | CLAUDE.md rule 6; eight commands; `implementer`; session briefing in dev and test |

## Rules for changing SK

- Record a baseline before changing descriptions or shortening prompts.
- A change merges only if the suite scores at least as well as the baseline on every model tested.
- Put the before and after scores in the changelog entry.
- For behaviour cases: `node scripts/eval-summary.mjs before.json after.json` labels each case improved, regressed, stable or persistent fail, and exits 1 on any regression. A regression blocks the merge.
- Pin `--model` (and `--judge-model` when it matters) so two results are comparable, and leave a partial result (`partial: true`) out of any comparison.
- Expect noise: with 3 runs a case moves by a third when one run flips. Treat a move of one run on one case as noise; a regression is a case that drops from passing (80% or more) to failing on a rerun too. `code-review-planted-bug` is the noisiest case (its `no-noise` grader): it has read 50 to 83% across unchanged runs. The baseline `behaviour-3.0-sonnet.json` (3 runs, Sonnet, Sonnet judge, $3.63) is the reference for 3.1.0.
