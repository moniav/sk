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
└── trigger/<skill>/<case>/
    ├── prompt.md              the request, as a user would type it
    └── graders/
        ├── fired.md           passes when the skill was invoked
        └── stayed-quiet.md    passes when it was not
```

**Trigger cases** (`--tag trigger`): for each model-invoked skill, two requests that should fire it (`--tag fire`) and one near miss that should not (`--tag quiet`).
Each case is also tagged with its skill name.

**Behaviour cases** are not written yet.
They need one organic task each for `dev`, `test` and `debug`, with a rubric of three to six checkable criteria, and they need `Bash`, so they run under WSL2 or in CI.

## Writing a case

1. Write the prompt the way a user would, without naming the skill unless a user would.
2. Keep the words "eval", "test case", "rubric", "judge" and "benchmark" out of the prompt.
   A session that knows it is being measured behaves differently.
3. Grade from what happened, not from what the session says about itself: `tool_used` for whether a skill fired, `regex` over a produced file, `llm` only for short outputs with concrete PASS and FAIL conditions.
4. Never ask the session which skills it used.
5. For a "must not fire" check, use `tool_used` with `min: 0` and `max: 0`.
6. Give trigger graders `arm: both` so they are scored in every mode.

## Reading a result

- A skill that fires on its `fire` cases and stays quiet on its `quiet` case has a working description.
- A skill that never fires has a description the model does not match, or one that was dropped from the listing.
- A skill that fires on its `quiet` case has a description that is too broad.
- Compare across Haiku, Sonnet and Opus: a description that only works on the largest model is too subtle, and SK dispatches subagents on the smaller ones.
- One run tells you little. Use the default three runs before drawing a conclusion.

## Rules for changing SK

- Record a baseline before changing descriptions or shortening prompts.
- A change merges only if the suite scores at least as well as the baseline on every model tested.
- Put the before and after scores in the changelog entry.
