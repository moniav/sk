---
name: verification-before-completion
description: >
  Enforces evidence-based verification before claiming any task is complete.
  Use this skill whenever you are about to say "done", "complete", "finished",
  "verified", or "all tests pass" — for ANY development task, not just SK commands.
  Also triggers during exit gates in /sk:dev, /sk:test, /sk:implement, /sk:refactor,
  and /sk:debug. If you're about to claim completion without showing actual command
  output, this skill applies to you.
---

# Verification Before Completion

> No completion claims without fresh verification evidence.

## Core Rule

Before claiming any task is done, you must:

1. **Run** the actual test/check command in THIS session
2. **Show** the raw output — not a summary, not a paraphrase
3. **Map** each acceptance criterion to specific evidence (what you ran + what it returned)

If a test command exists, always prefer it over manual verification.

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
