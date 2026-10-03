---
description: Analyze code for bugs, conventions, performance, and maintainability
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *), Bash(gh pr diff *), Bash(gh pr view *)
disallowed-tools: Edit, NotebookEdit
disable-model-invocation: true
---

# Code Review — Quality Analysis

Perform a thorough code review across correctness, conventions, performance, maintainability, and testing.

**Report-only.** This command does not modify project files. The only file it may write is its report under `docs/reviews/code/`.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/conventions/code-style.md` — Naming, patterns, anti-patterns
3. `docs/conventions/file-structure.md` — Where files go, co-location rules
4. `docs/conventions/testing.md` — Testing standards and patterns
5. `docs/conventions/git-workflow.md` — Commit and PR conventions

**Skip files that are empty or contain only template placeholders.** If conventions aren't configured, review against language/framework defaults instead.

## Step 2: Determine Scope

Ask the user what to review:

| Scope | Command | What gets reviewed |
|-------|---------|-------------------|
| **Staged changes** | `git diff --cached` | Files about to be committed |
| **Unstaged changes** | `git diff` | Modified files not yet staged |
| **Branch diff** | `git diff {base}...HEAD` | All changes on this branch vs the default branch |
| **Last N commits** | `git diff HEAD~N..HEAD` | Recent commit range |
| **Specific files** | User provides paths | Named files only |
| **PR number** | `gh pr diff <N>` | Pull request changes |

For branch diffs, detect the default branch with `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then `master`) and use it as `{base}`.

If this isn't a git repository or has no commits yet, skip the git-based steps and note that in the output — don't error out.

## Step 3: Read Full Context

For every changed file:
1. **Read the full file** — not just the diff. You need surrounding context to assess correctness.
2. **Identify the file's role** — Is it a controller, model, utility, test, config?
3. **Note related files** — What imports this? What does this import?

## Step 4: Analyze

Review the code across 5 categories:

### 4a: Correctness & Bugs

- Logic errors — wrong conditions, off-by-one, inverted checks
- Null/undefined handling — missing guards, unsafe access chains
- Race conditions — async operations, shared state, missing await
- Edge cases — empty arrays, zero values, boundary conditions
- Error handling — swallowed errors, missing try/catch, wrong error types
- Type safety — implicit coercions, missing type checks

### 4b: Convention Compliance

Reference `docs/conventions/code-style.md` and `docs/conventions/file-structure.md`:

- Naming — variables, functions, files follow project conventions
- File placement — new files in correct directories
- Import order — external, internal, relative (per convention)
- Early returns — used instead of deep nesting
- Comments — explain WHY not WHAT, no commented-out code
- Constants — no magic numbers or strings

### 4c: Performance

- N+1 queries — database calls inside loops
- Unnecessary re-renders — missing memoization, unstable references
- Unbounded lists — missing pagination or limits
- Missing caching — repeated expensive computations
- Large payloads — over-fetching data, missing field selection
- Blocking operations — sync I/O in async context

### 4d: Maintainability

- Function size — functions doing too many things (SRP violation)
- DRY — duplicated logic that should be extracted
- Coupling — components knowing too much about each other
- Dead code — unused functions, unreachable branches, stale imports
- Complexity — deeply nested logic, long method chains
- Naming clarity — can you understand the code without comments?

### 4e: Testing

- Coverage gaps — new logic paths without corresponding tests
- AAA pattern — tests follow Arrange, Act, Assert structure
- Test isolation — tests don't depend on each other or external state
- Mock appropriateness — mocking too much (testing mocks) or too little
- Edge case coverage — tests for error paths, not just happy paths
- Assertion quality — specific assertions, not just "no error thrown"

### 4f: Scope & Simplicity

Reference `docs/conventions/coding-behavior.md`:

- Simplicity ladder — could this be stdlib, a native platform feature, or an already-installed dependency instead of new code? (coding-behavior §3)
- Over-engineering — abstractions, classes, or patterns for single-use cases
- Speculative features — code for requirements that don't exist yet
- Drive-by changes — refactoring or "cleanup" outside the task's scope
- Gold plating — extra configuration, logging, or error handling beyond what's needed
- Premature abstraction — generic utilities where simple inline code would suffice

## Step 5: Present Report

Format findings as a structured report:

### Critical (must fix before merge)

| # | Category | File:Line | Finding | Suggested Fix |
|---|----------|-----------|---------|---------------|
| 1 | Correctness | `path:42` | Description | Fix |

### Warning (should fix)

| # | Category | File:Line | Finding | Suggested Fix |
|---|----------|-----------|---------|---------------|
| 1 | Performance | `path:88` | Description | Fix |

### Suggestion (nice to have)

| # | Category | File:Line | Finding | Suggested Fix |
|---|----------|-----------|---------|---------------|
| 1 | Maintainability | `path:15` | Description | Fix |

### Good (positive patterns worth noting)

| # | Category | File:Line | What's Good |
|---|----------|-----------|-------------|
| 1 | Testing | `path:30` | Description |

## Step 6: Verdict

Provide an overall assessment:

- **APPROVE** — No critical issues, code is ready to merge
- **REQUEST CHANGES** — Critical or multiple warning issues must be addressed
- **NEEDS DISCUSSION** — Architectural or design concerns need team input

Include a brief summary: what the code does well, what needs attention, and any systemic patterns noticed.

**End with a one-line tally** so the result is glanceable and comparable across reviews:

`Found: N critical, N warning, N suggestion — <APPROVE | REQUEST CHANGES | NEEDS DISCUSSION>` (or `Clean — ship` if nothing found).

## Step 7: Persist Report (Optional)

Ask: **"Save this review report to `docs/reviews/code/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template from `docs/templates/review-report.md`. Add the review to `docs/reviews/README.md` index.
