---
name: test-driven-development
description: Load before you write or edit production code to fix a bug or change behaviour: you write and run a failing test first, then the code that makes it pass. Applies to every code change, including one-line fixes and rushed requests; skipping it is how regressions ship. Not needed for edits to tests alone or for questions about testing.
---

# Test-Driven Development

> Write the test first. Watch it fail. Make it pass. Then clean up.

## The cycle

Work one behaviour at a time. One test, then the code for that test, then the next test.

### 1. RED: write the failing test

Write one test for one behaviour, through the public interface. Run it. It must fail, and for the right reason: the behaviour is missing, not a typo or a broken import. Keep the output.

### 2. GREEN: the minimum code to pass

Write only enough production code to pass that test. Run it again. Keep the output.

### 3. REFACTOR: clean up, still green

Improve the structure without changing behaviour. Run the tests again.

The output of each run is the evidence. Example (the commands are whatever the project's test runner uses):

```
$ <test command> profile
 FAIL  returns the user profile by id
   expected { id: 1, name: "Jane" }, received undefined
 1 failed

$ <test command> profile
 PASS  returns the user profile by id
 1 passed
```

## In a task file

Each `[TEST]` subtask is paired with the `[DEV]` subtask after it:

```
[TEST] failing test for the service        -> RED
[DEV]  implement the service               -> GREEN, REFACTOR
[TEST] failing test for the API endpoint   -> RED
[DEV]  implement the API endpoint          -> GREEN, REFACTOR
```

## Existing code without tests

- **Changing untested code:** first write a characterization test that captures what it does now (it passes). Then change the test to the behaviour you want (it fails). Then change the code (it passes).
- **Fixing a bug:** write a test that reproduces the bug (it fails). Fix the bug (it passes).
- **No test runner at all:** the first subtask is to set one up.

## When a test first is not practical

Prefer no new test over a bad one. A test is impractical when the only way to write it is to mock most of the system, depend on timing or shared global state, stand up infrastructure far larger than the change, or build a harness that would be deleted straight after.

In that case you may skip the test, on two conditions:

1. **Say so, with the reason.** "No test: reproducing this needs the payment provider's sandbox, which is not reachable here."
2. **Name and run the closest executable check instead**, and keep its output: a targeted script, a request against the running app, a snapshot comparison, a log assertion.

"It is too simple to test" and "it is only configuration" are not reasons. If it changes behaviour, it can be checked.

## Excuses and what is true

| Excuse | What is true |
|--------|--------------|
| "Write it now, add tests later" | Later rarely comes, and a test written after the code is shaped to pass it. The failing test takes minutes. |
| "I already tested it by hand" | A manual check proves one run today. The test proves every run after this one. |
| "It is too simple to test" | Simple code is the cheapest to test, and simple changes break too. |
| "The user is in a hurry" | Say the test comes first and why, in one line, then write it. A fast fix that breaks later is slower. |
| "Deleting the code I already wrote is wasteful" | Keep it aside, write the failing test, then bring the code back to make it pass. |
| "I will keep the old code as a reference" | Reference code becomes the implementation. Write from the test, not from the draft. |

## What a good test is

- It calls the code the way its users do and asserts on the result. It still passes after a refactor that keeps the behaviour.
- **Its expected value comes from somewhere other than the code under test:** a known literal, a worked example, the spec. `expect(add(a, b)).toBe(a + b)` recomputes the answer the way the code does, so it can never disagree with it.

## Anti-patterns

See `references/anti-patterns.md` in this skill's directory. The four that matter most:

- Writing the code first and the test after
- Writing all the tests first, then all the code (tests written in bulk describe imagined behaviour; work one test at a time)
- Testing implementation details or mocks instead of behaviour
- A test that cannot fail

The excuses table is adapted from [obra/superpowers](https://github.com/obra/superpowers) (MIT), whose measurements showed removing it weakened test-first behaviour under pressure.
