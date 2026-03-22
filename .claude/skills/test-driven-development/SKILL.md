# Skill: Test-Driven Development

> **Iron Law:** NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.

## When This Skill Is Active

This skill is active during subtask execution in:
- `/sk:dev` — for each [DEV]+[TEST] subtask pair
- `/sk:implement` — during the DEV phase

## The TDD Cycle

For each feature unit (a [TEST]+[DEV] subtask pair):

### 1. RED — Write the failing test

Write the test FIRST. Run it. It MUST fail.
Show the failure output to prove the test is meaningful.

```
$ npm test -- --grep "profile service"
 ✗ should return user profile by ID
   Expected: { id: 1, name: "Jane" }
   Received: undefined
 Tests: 0 passed, 1 failed
```

### 2. GREEN — Write the minimum code to pass

Write ONLY enough production code to make the test pass. No more.
Run the test again. It MUST pass now.

```
$ npm test -- --grep "profile service"
 ✓ should return user profile by ID (3ms)
 Tests: 1 passed, 0 failed
```

### 3. REFACTOR — Clean up (tests must still pass)

Improve the code structure without changing behavior.
Run tests again to confirm nothing broke.

```
$ npm test -- --grep "profile service"
 ✓ should return user profile by ID (2ms)
 Tests: 1 passed, 0 failed
```

## Subtask Execution Order

The TDD skill reorders subtask execution. Instead of all [DEV] then all [TEST]:

```
WRONG ORDER:
  ST-1 [DEV]  Implement service
  ST-2 [DEV]  Implement API endpoint
  ST-3 [TEST] Write tests for service
  ST-4 [TEST] Write tests for API endpoint

CORRECT ORDER (TDD):
  ST-3 [TEST] Write failing test for service        → RED
  ST-1 [DEV]  Implement service                     → GREEN + REFACTOR
  ST-4 [TEST] Write failing test for API endpoint   → RED
  ST-2 [DEV]  Implement API endpoint                → GREEN + REFACTOR
```

Pair each [TEST] with its corresponding [DEV] subtask. Execute the test first.

## Brownfield Adaptation

### For NEW code
Same as greenfield — test first, always.

### For MODIFYING existing untested code
1. Write a characterization test first (captures CURRENT behavior)
2. Run it — it should PASS (proves you understand what the code does today)
3. Modify the test to reflect DESIRED behavior
4. Run it — it should FAIL (proves the change isn't made yet)
5. Make the change
6. Run it — it should PASS

### For FIXING a bug in untested code
1. Write a test that reproduces the bug — it MUST fail
2. Fix the bug
3. Run the test — it MUST pass

### If NO test infrastructure exists
1. First subtask is ALWAYS "set up test runner"
2. `/sk:plan` must include a [DEV] subtask for test setup
3. "No test runner" is not an excuse for no tests

## Anti-Patterns

See `anti-patterns.md` in this directory for the full list.

## How Commands Use This Skill

Commands include a line like:
> Read `.claude/skills/test-driven-development/SKILL.md` — follow TDD cycle for subtask execution.

When you read this file, you MUST follow RED-GREEN-REFACTOR for every feature unit.
