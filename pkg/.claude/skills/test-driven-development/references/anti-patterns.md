# TDD Anti-Patterns

> These are behaviors that violate the TDD skill. If you catch yourself doing any of these, stop and correct course.

## Writing Code Before Tests

**"Let me just get the implementation working first, then I'll add tests."**

No. Write the test first. If you already wrote code without a test, delete the code and start with the test.

**"I'll keep the code I wrote as reference while writing the test."**

No. Delete it. Write the test. Reimplement from scratch guided by the test. The second implementation will be better because the test defines the contract.

## Rationalizing Skipping Tests

**"This is too simple to test."**

If it's truly trivial, the test is trivial too — takes 30 seconds to write. Write it.

**"This is just a configuration change."**

If it changes behavior, it needs a test. If it doesn't change behavior, verify that with a test.

**"I'll test this manually."**

Manual testing is not a substitute for automated tests. Manual verification is acceptable only when no test infrastructure exists (brownfield), and even then, setting up test infrastructure should be the first priority.

## Testing the Wrong Thing

**Testing implementation details instead of behavior.**

Wrong: "assert that `_internal_method` was called with `args`"
Right: "assert that `public_method(input)` returns `expected_output`"

**Mocking everything (testing mocks, not code).**

If your test has more mock setup than assertions, you're testing your mocks, not your code.

**Tests that always pass (no real assertions).**

A test without meaningful assertions (or with only `expect(true).toBe(true)`) is worse than no test — it gives false confidence.

## Process Violations

**Batch-writing tests after all code is done.**

This defeats the purpose of TDD. Tests written after code tend to test the implementation, not the behavior. They also miss edge cases that TDD naturally uncovers.

**Skipping RED (writing a test that passes immediately).**

If your test passes without writing new code, either:
- The feature already exists (no work needed)
- Your test doesn't actually test the new behavior (fix the test)

**Skipping REFACTOR.**

Refactoring after GREEN is when you improve code quality. Skipping it accumulates tech debt inside each TDD cycle.

## Tests That Cannot Disagree With the Code

**The assertion recomputes the expected value the way the code does.**

Wrong: `expect(total(items)).toBe(items.reduce((s, i) => s + i.price, 0))`
Right: `expect(total([{ price: 2 }, { price: 3 }])).toBe(5)`

If the expected value is derived by the same logic as the code under test, the test passes by construction. The expected value must come from an independent source: a known literal, a worked example, the spec.

**Writing every test before any code.**

Tests written in bulk describe behaviour you imagined, before the first implementation taught you anything. Write one test, make it pass, then write the next.
