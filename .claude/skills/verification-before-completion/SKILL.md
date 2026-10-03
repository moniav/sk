---
name: verification-before-completion
description: Requires fresh command output as evidence before any claim that work is done, complete or passing, and checks the result against the original request. Use before reporting a task finished or confirming that something works.
---

# Verification Before Completion

> No completion claims without fresh verification evidence.

## Core Rule

Before claiming any task is done, you must:

1. **Run** the actual test/check command in THIS session
2. **Show** the raw output — not a summary, not a paraphrase
3. **Map** each acceptance criterion to specific evidence (what you ran + what it returned)

If a test command exists, always prefer it over manual verification.

## Audit Against the Original Contract

Passing tests are necessary but not sufficient — they prove the code you wrote works, not that you built what was asked. Before claiming done, reconstruct the original contract and audit the real evidence against it:

1. **Reconstruct the ask** — the user's actual request, stated constraints, and every acceptance criterion. Treat the user's intent as ground truth, not your own summary of what you did.
2. **Audit the evidence** — the diff, test output, and any CI/screenshots. For each acceptance criterion, point to the specific change that satisfies it.
3. **Check both directions:**
   - **Missing** — every requirement has a corresponding change (nothing silently dropped).
   - **Extra** — no scope creep: features, refactors, or files that were never asked for. Note those as follow-ups instead of folding them into "done".

If any criterion has no evidence, or the diff does things outside the ask, you are not done — fix it or surface it before claiming completion.

## What Counts as Evidence

**Acceptable:**
```
$ npm test
 ✓ user service returns profile (3ms)
 ✓ user service handles missing user (1ms)
 Tests: 2 passed, 0 failed
```

**Not acceptable** — these phrases alone are never evidence:
- "It works" / "Tests pass" / "Looks good" / "Verified" / "Confirmed"

## When No Test Command Exists

Manual verification is acceptable if specific:
- **Good:** "Ran `curl -X POST /api/users -d '{...}'`, got `201` with `{id: 1, ...}`"
- **Bad:** "Tested manually, it works"

Setting up a test runner should be the first priority in any untested codebase.

## When Tests Are Flaky

1. Record baseline before changes: "847 pass, 123 fail, 12 pending"
2. Record after changes: "851 pass, 123 fail, 12 pending"
3. Your changes must not increase the failure count
4. Fixing existing flaky tests is a separate task
