---
description: Performance analysis — queries, memory, rendering, bundle size, caching
argument-hint: "[scope: branch | file or directory | all (optional)]"
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *)
disallowed-tools: Edit, NotebookEdit
disable-model-invocation: true
---

# Performance Review — Bottleneck Analysis

Analyze code for performance issues across database queries, memory usage, rendering, async patterns, bundle size, and caching opportunities.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

**Report-only.** This command does not modify project files. The only file it may write is its report under `docs/reviews/performance/`.

## Rules

- **Evidence.** Every finding cites `file:line` and says how far it was proven: stated, pointed at the line, traced the path, ran it.
- **No invented numbers.** Only cite a measured benchmark if one was actually run. Otherwise describe the impact in words.
- **Exit gate.** Done when the Step 9 tables and the Step 10 summary are presented with a location and proof level on every finding, the one-line tally is the last line of the summary, and the Step 11 question has been asked.

## Step 1: Read Context

Read first, skipping any file that is empty or contains only template placeholders:
1. `docs/system/project-context.md` (if it exists)
2. `docs/system/tech-stack.md`
3. `docs/system/database-schema.md` (if it exists)
4. `docs/conventions/code-style.md`

## Step 2: Determine Scope

Ask the user what to analyze:

| Scope | What gets analyzed |
|-------|-------------------|
| **Full codebase** | All source files, a broad sweep |
| **Changed files** | Only files modified (staged + unstaged) |
| **Specific area** | User-specified module, route, or feature |
| **Specific concern** | Focus on one category: DB, rendering, bundle, etc. |

## Step 3: Database & Query Performance

- **N+1 queries:** loops (`for` / `forEach` / `map`) containing DB calls, ORM lookups, or API fetches
- **Missing indexes:** read the schema and check that an index exists for every column used in `WHERE`, `ORDER BY`, `JOIN` conditions and foreign keys
- **Unbounded queries:** `SELECT *` or `findMany()` without `LIMIT`, `TOP`, or pagination
- **Expensive operations:** full table scans, `LIKE '%pattern%'`, `IN` clauses with >1000 items, aggregations without covering indexes, `SELECT *` when only a few columns are needed
- **Connection management:** pool configured and sized, connections released after use, transaction scope as narrow as possible

## Step 4: Memory & Data Structure Performance

- **Memory leaks:** event listeners never removed, `setInterval` / `setTimeout` without cleanup, unbounded in-memory caches, closures holding large objects, global state that accumulates across requests
- **Data structure choices:** arrays used for frequent lookups, large objects copied unnecessarily, string concatenation in loops, stored data that could be derived on demand
- **Payload size:** API responses returning more than needed, list endpoints without pagination, binary data not streamed

## Step 5: Rendering & Frontend Performance

*Skip this step if the project has no frontend/UI.*

- **Component rendering:** unnecessary re-renders, missing memoization where the work is expensive, unstable references created in render, one state change re-rendering a large tree
- **DOM & layout:** forced reflows, layout thrashing in loops, large DOM (>1500 elements), costly CSS (complex selectors, excessive animations, unused styles)
- **Loading:** unoptimized or non-lazy images without dimensions, fonts without `font-display` or with unused weights, bundles not split by route or feature, render-blocking CSS or sync JS in `<head>`
- **Bundle size** (JavaScript/TypeScript projects only): heavy imports (`moment`, full `lodash`), imports that defeat tree-shaking, large dependencies with lighter alternatives, the same library at different versions

## Step 6: Async & Concurrency

- **Sequential where parallel is possible:** independent API calls, file reads or DB queries run one after another
- **Missing async patterns:** blocking I/O in async context, missing `await`, unbounded concurrency, external calls without timeout/abort controls
- **Error handling in async:** unhandled rejections, swallowed errors, batch operations where one failure loses all results

## Step 7: Caching Opportunities

- **Cacheable operations:** repeated expensive computations, hot queries on rarely-changing data, slow or rate-limited external API calls, static computed values
- **Caching issues:** responses without `Cache-Control` / `ETag` / `Last-Modified`, static assets served from the application server, cache stampede, in-memory caches with no TTL or size limit

For each caching opportunity you report, answer all five:

| Factor | Question |
|--------|----------|
| **Staleness tolerance** | How old can cached data be? |
| **Invalidation** | How will stale data be cleared? |
| **Storage** | In-memory, Redis, HTTP cache, CDN? |
| **Cache key** | What uniquely identifies this data? |
| **Size** | How much memory will this consume? |

## Step 8: Algorithm & Complexity

- **Complexity red flags:** nested loops over large collections, recursion without memoization on overlapping subproblems, sorting inside loops, regex compilation or repeated parsing inside loops
- **Data access patterns:** linear search or repeated array scans where a hash lookup, Set or binary search fits, results built by repeated concatenation

## Step 9: Present Findings

Use these four sections, in this order.
Warning and Suggestion use the same columns as Critical.

### Critical (measurable user-facing impact)

| # | Category | Location | Finding | Impact | Proof | Fix |
|---|----------|----------|---------|--------|-------|-----|
| 1 | DB-N+1 | `path:42` | Description | Response time / resource usage | traced the path | Specific fix |

### Warning (will cause issues at scale)

### Suggestion (optimization opportunity)

### Good (efficient patterns worth noting)

| # | Category | Location | What's Good |
|---|----------|----------|-------------|
| 1 | Async | `path:30` | Description |

## Step 10: Performance Summary

| Area | Status | Key Finding |
|------|--------|-------------|
| Database queries | OK / WARN / CRITICAL | Summary |
| Memory usage | OK / WARN / CRITICAL | Summary |
| Rendering | OK / WARN / CRITICAL / N/A | Summary |
| Bundle size | OK / WARN / CRITICAL / N/A | Summary |
| Async patterns | OK / WARN / CRITICAL | Summary |
| Caching | OK / WARN / CRITICAL | Summary |
| Algorithms | OK / WARN / CRITICAL | Summary |

**Top 3 priorities** (ordered by impact): a numbered list of the three most impactful fixes.

**End with a one-line tally** so the result is glanceable and comparable across reviews:

`Found: N critical, N warning, N suggestion` (or `Clean — ship` if nothing found). Do not invent performance numbers — only cite a measured benchmark if one was actually run.

## Step 11: Persist Report (Optional)

Ask: **"Save this performance review to `docs/reviews/performance/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template from `docs/templates/review-report.md`.

**Reply:** the Step 9 findings tables (every finding with `file:line` and proof level), the Step 10 summary table, the top 3 priorities, the one-line tally `Found: N critical, N warning, N suggestion`, and the report path if it was saved.
