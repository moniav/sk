---
name: test-driven-development
description: Enforces red-green-refactor, where a failing test is written and run before the production code. Use when implementing a feature, fixing a bug, or when the user mentions TDD or test first.
---

# Test-Driven Development

> Write the test first. Make it fail. Then make it pass. Then clean up.

## The TDD Cycle

For each feature unit:

### 1. RED — Write the failing test

Write the test first. Run it. It must fail. Show the failure output.

```
$ npm test -- --grep "profile service"
 ✗ should return user profile by ID
   Expected: { id: 1, name: "Jane" }
   Received: undefined
 Tests: 0 passed, 1 failed
```

### 2. GREEN — Minimum code to pass

Write only enough production code to make the test pass. No more.

```
$ npm test -- --grep "profile service"
 ✓ should return user profile by ID (3ms)
 Tests: 1 passed, 0 failed
```

### 3. REFACTOR — Clean up (tests must still pass)

Improve code structure without changing behavior. Run tests again to confirm.

## Subtask Execution Order

TDD reorders subtask execution — pair each [TEST] with its [DEV] subtask:

```
TDD ORDER:
  [TEST] Write failing test for service        → RED
  [DEV]  Implement service                     → GREEN + REFACTOR
  [TEST] Write failing test for API endpoint   → RED
  [DEV]  Implement API endpoint                → GREEN + REFACTOR
```

## Brownfield Adaptation

**Modifying existing untested code:**
1. Write a characterization test (captures current behavior) — it should pass
2. Modify the test to reflect desired behavior — it should fail
3. Make the change — it should pass

**Fixing a bug in untested code:**
1. Write a test that reproduces the bug — it must fail
2. Fix the bug — the test must pass

**No test infrastructure:** First subtask is always "set up test runner."

## Anti-Patterns

See `anti-patterns.md` in this directory for common violations:
- Writing code before tests
- Rationalizing skipping tests ("too simple", "just config")
- Testing implementation details instead of behavior
- Batch-writing tests after implementation
