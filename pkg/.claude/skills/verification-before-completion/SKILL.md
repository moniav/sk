---
name: verification-before-completion
description: Requires fresh command output as evidence before any claim that work is done, complete or passing, and checks the result against the original request. Use before reporting a task finished or confirming that something works.
---

# Verification Before Completion

> No completion claim without evidence produced in this session.

## The rule

Before saying a task is done:

1. **Run** the check in this session. Prefer the project's test command over a manual check.
2. **Show** the raw output, not a summary of it.
3. **Map** each acceptance criterion to the evidence for it: what you ran and what it returned.
4. **State the revision** the evidence is for: the commit hash and branch, or "uncommitted changes on `<branch>`".

"It works", "tests pass", "looks good", "verified" and "confirmed" are claims. On their own they are never evidence.

## How far each claim was proven

Say which rung every claim reached. A higher rung is stronger; the first rung is worth nothing on its own.

| Rung | What you did | Worth |
|------|--------------|-------|
| 1. Stated | You said it | Nothing |
| 2. Pointed | You cited the `file:line` that makes it true | Weak: the reader can check |
| 3. Walked | You traced the failure path step by step and showed it cannot happen | Moderate |
| 4. Ran | A test or script exercised the real code and printed the result | Strong |
| 5. Reproduced | You saw it in the running application | Strongest |

Get every acceptance criterion to rung 4 where a command can reach it. When something stops below rung 4, say where it stopped and why.

## Three results, never two

Every criterion ends as exactly one of:

- **passed:** with its evidence
- **failed:** with its evidence
- **untested:** with the reason it could not be checked (a missing credential, a service that is unreachable, no way to drive the UI from here)

Never drop a criterion from the report because it could not be checked. An honest "untested" is a result; silence is not.

## Fixing a bug: capture the failure first

Before writing the fix, run the failing case and keep the output. That is the "before". After the fix, run the same thing: that is the "after". Report them as a pair. A fix shown only as "after" does not show that anything changed.

## Evidence when there is no test

| Kind of change | Evidence |
|----------------|----------|
| API or service | The request you sent and the status and body that came back |
| Performance | The measured number before and after, with how it was measured |
| Visual | A screenshot or captured frame, looked at, at the size it will be used |
| Data or migration | The query you ran and the rows or counts it returned |
| Behaviour of an agent or prompt | The transcript excerpt showing the tool call and the response |

Good: "Ran `curl -X POST /api/users -d '{...}'`, got `201` with `{id: 1, ...}`."
Bad: "Tested manually, it works."

In a codebase with no tests, setting up a test runner comes first.

## Audit against what was asked

Passing tests show that the code you wrote works. They do not show that you built what was asked.

1. **Reconstruct the request:** the user's words, the stated constraints, every acceptance criterion. The user's intent is the reference, not your summary of what you did.
2. **Check both directions against the diff:**
   - **Missing:** every requirement has a change that satisfies it.
   - **Extra:** nothing in the diff was not asked for. Report extras as follow-ups; do not fold them into "done".

If a criterion has no evidence, or the diff goes beyond the request, the work is not done: fix it or say so.

## Flaky test suites

Record the counts before your change ("847 pass, 123 fail, 12 pending") and after. Your change must not raise the failure count. Fixing the existing failures is a separate task.
