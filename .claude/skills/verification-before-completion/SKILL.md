# Skill: Verification Before Completion

> **Iron Law:** NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.

## When This Skill Is Active

This skill is active during exit gates and completion claims in:
- `/sk:dev` — DEV exit gate
- `/sk:test` — AC verification
- `/sk:implement` — DEV and TEST phases
- `/sk:refactor` — behavior verification
- `/sk:debug` — fix verification

## Rules

1. You MUST run the actual test/check command in THIS session
2. You MUST paste the raw output (not summarize, not paraphrase)
3. These phrases are NEVER acceptable as evidence:
   - "It works"
   - "Tests pass"
   - "Looks good"
   - "Verified"
   - "Confirmed"
   - "Everything is working"
4. Acceptable evidence looks like:

```
$ npm test
 ✓ user service returns profile (3ms)
 ✓ user service handles missing user (1ms)
 Tests: 2 passed, 0 failed
```

5. For each acceptance criterion, show WHAT you ran and WHAT it returned
6. If a test command is available, always prefer it over manual verification

## Brownfield Adaptation

### If test command exists (detected by /sk:init-docs)
Standard rule: run tests, paste output.

### If no test command exists
1. Manual verification is acceptable BUT must be specific:
   - ACCEPTABLE: "Ran `curl -X POST /api/users -d '{"email":"test@example.com"}'`, got `201` with `{id: 1, email: 'test@example.com'}`"
   - NOT ACCEPTABLE: "Tested manually, it works"
2. First task in any brownfield project SHOULD set up a test runner
3. After test runner exists, switch to standard rule

### If tests exist but are flaky/broken
1. Record baseline before your changes: "847 pass, 123 fail, 12 pending"
2. After your changes: "851 pass, 123 fail, 12 pending"
3. Your changes must not INCREASE the failure count
4. Fixing existing flaky tests is a separate `/sk:debug` task

## How Commands Use This Skill

Commands include a line like:
> Read `.claude/skills/verification-before-completion/SKILL.md` before claiming done.

When you read this file, the rules above become active constraints on your behavior for the rest of that phase.
