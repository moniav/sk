---
name: product-brief
description: The brief that must exist before anything is designed or built: problem, evidence, success metric, non-goals, appetite, riskiest assumptions, and the checks that keep it honest. Loaded by /sk:prd, /sk:brainstorm, /sk:new-epic and /sk:new-task; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Product Brief

A brief says why something is worth building and how we will know it worked, before anyone decides what to build. It is short on purpose: one screen, read by everyone.

Adapted from the `writing-prds` skill in [RefoundAI/lenny-skills](https://github.com/RefoundAI/lenny-skills) (MIT).

## Fields

| Field | What goes there | Push back when |
|-------|-----------------|----------------|
| **Problem** | One sentence: who, the unmet need, why it matters | It contains a solution, more than one problem, or a feature name |
| **Who has it** | The primary persona, with context and frequency | "Users" or "everyone" |
| **Evidence** | Data, quotes, tickets, lost deals; or the word "hunch" | A claim with no source: ask what would make it true |
| **Why now** | What changed that makes this worth doing now | Nothing changed: ask what happens if we wait a quarter |
| **Success metric** | An outcome with baseline, target, how measured, by when | It is an output ("ship X"), has no baseline, or cannot be measured yet |
| **Non-goals** | What this deliberately does not do (at least one) | Empty: offer the tempting adjacent features as candidates |
| **Appetite** | How much time this deserves before reassessing | Appetite and scope are far apart: that gap is a finding, not a detail |
| **Riskiest assumptions** | Each with today's evidence and the cheapest test | The riskiest one should be tested before building and nobody said so |
| **Direction** | Just enough for engineers to start; no button-level spec | It reads like an implementation plan |

For a single task (`/sk:new-task`), only Problem, Success metric and Non-goals are needed, as three lines.

## The problem statement check

Run it before writing the brief, and rewrite with the user until every line holds:

1. One sentence.
2. One problem, ownable by one team in the appetite.
3. Names an unmet need of a person (or a business need, said plainly).
4. Says what is wrong *and* why it matters, with the evidence behind it.
5. Contains no solution: no feature, screen, technology or vendor.

Then scan the whole brief for the word **"just"** and flag it: it hides work and undermines whoever will do it.

## Brief gate

The brief is settled only when the user has read it as written and said yes. Nothing downstream (flows, architecture, epics, tasks) is written before that.
