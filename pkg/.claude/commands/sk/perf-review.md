---
description: Performance analysis — queries, memory, rendering, bundle size, caching (project)
---

# Performance Review — Bottleneck Analysis

Analyze code for performance issues across database queries, memory usage, rendering, async patterns, bundle size, and caching opportunities.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/system/tech-stack.md` — Framework, runtime, database, caching layer
3. `docs/system/database-schema.md` — Tables, indexes, relationships (if exists)
4. `docs/conventions/code-style.md` — Existing patterns and practices

## Step 2: Determine Scope

Ask the user what to analyze:

| Scope | What gets analyzed |
|-------|-------------------|
| **Full codebase** | All source files — broad sweep |
| **Changed files** | Only files modified (staged + unstaged) |
| **Specific area** | User-specified module, route, or feature |
| **Specific concern** | Focus on one category: DB, rendering, bundle, etc. |

## Step 3: Database & Query Performance

### N+1 Queries
- **Search for:** loops that execute queries inside them
- **Pattern:** `for` / `forEach` / `map` containing DB calls, ORM lookups, or API fetches
- **Fix:** batch queries, eager loading, `WHERE IN` clauses, joins

### Missing Indexes
- Read the schema and identify columns used in:
  - `WHERE` clauses
  - `ORDER BY` clauses
  - `JOIN` conditions
  - Foreign key columns
- Check if corresponding indexes exist

### Unbounded Queries
- **Search for:** queries without `LIMIT`, `TOP`, or pagination
- **Pattern:** `SELECT *` or `findMany()` without limits
- **Risk:** returns all rows from a table that could grow to millions

### Expensive Operations
- Full table scans (queries without index-backed filters)
- `LIKE '%pattern%'` (leading wildcard defeats indexes)
- Large `IN` clauses (>1000 items)
- Aggregations without covering indexes
- Unnecessary `SELECT *` when only a few columns are needed

### Connection Management
- Connection pool configured and sized appropriately
- Connections released after use (no leaks)
- Transaction scope is as narrow as possible

## Step 4: Memory & Data Structure Performance

### Memory Leaks
- **Event listeners** — registered but never removed
- **Timers** — `setInterval` / `setTimeout` without cleanup
- **Caches** — unbounded in-memory caches that grow forever
- **Closures** — holding references to large objects longer than needed
- **Global state** — objects that accumulate data across requests

### Data Structure Choices
- Using arrays for frequent lookups (should be Map/Set/dict)
- Copying large objects unnecessarily (spread operator on big objects)
- String concatenation in loops (should use StringBuilder/join/array)
- Storing derived data that can be computed on demand

### Payload Size
- API responses returning more data than needed
- Large objects serialized unnecessarily
- Missing pagination on list endpoints
- Binary data not streamed

## Step 5: Rendering & Frontend Performance

*Skip this section if the project has no frontend/UI.*

### Component Rendering
- **Unnecessary re-renders** — components re-rendering when props haven't changed
- **Missing memoization** — `React.memo`, `useMemo`, `useCallback` where expensive
- **Unstable references** — objects/arrays/functions created in render (cause child re-renders)
- **Large component trees** — single state change re-renders too many components

### DOM & Layout
- **Forced reflows** — reading layout properties after writing them
- **Layout thrashing** — repeated read-write cycles in loops
- **Large DOM** — too many nodes (>1500 elements)
- **CSS performance** — complex selectors, excessive animations, unused styles

### Loading Performance
- **Images** — unoptimized formats, missing dimensions, no lazy loading
- **Fonts** — no `font-display`, loading unused weights/styles
- **Code splitting** — large bundles not split by route or feature
- **Critical path** — render-blocking resources (CSS, sync JS in `<head>`)

### Bundle Size
If a JavaScript/TypeScript project:
- Look for heavy imports (`moment`, `lodash` full bundle, etc.)
- Check for tree-shaking friendliness (named imports vs default)
- Identify large dependencies that could be replaced with lighter alternatives
- Check for duplicate dependencies (same library at different versions)

## Step 6: Async & Concurrency

### Sequential Where Parallel Is Possible
- Independent API calls made sequentially (should use `Promise.all` / `asyncio.gather`)
- Sequential file reads that could be parallelized
- Independent DB queries that could run concurrently

### Missing Async Patterns
- **Blocking I/O** — synchronous file/network operations in async context
- **Missing await** — fire-and-forget on operations that should be awaited
- **Unbounded concurrency** — launching thousands of concurrent operations without limits
- **Missing timeouts** — external calls without timeout/abort controls

### Error Handling in Async
- **Unhandled rejections** — promises without `.catch()` or try/catch
- **Error swallowing** — catching errors without logging or re-throwing
- **Partial failure** — batch operations where one failure loses all results

## Step 7: Caching Opportunities

### Identify Cacheable Operations
- **Repeated expensive computations** — same inputs, same outputs
- **Frequent DB queries** — hot queries on rarely-changing data
- **External API calls** — rate-limited or slow external services
- **Static content** — computed values that rarely change

### Caching Strategy Assessment
For each opportunity, evaluate:

| Factor | Question |
|--------|----------|
| **Staleness tolerance** | How old can cached data be? |
| **Invalidation** | How will stale data be cleared? |
| **Storage** | In-memory, Redis, HTTP cache, CDN? |
| **Cache key** | What uniquely identifies this data? |
| **Size** | How much memory will this consume? |

### Common Caching Issues
- **Missing cache headers** — API responses without `Cache-Control`, `ETag`, `Last-Modified`
- **No CDN** — static assets served from application server
- **Cache stampede** — many requests rebuild cache simultaneously
- **Unbounded caches** — no TTL or size limit on in-memory caches

## Step 8: Algorithm & Complexity

### Complexity Red Flags
- **Nested loops** over large collections — O(n^2) or worse
- **Recursive functions** without memoization on overlapping subproblems
- **Sorting in loops** — re-sorting on every iteration
- **String operations** — regex compilation inside loops, repeated parsing

### Data Access Patterns
- Linear search where binary search or hash lookup is possible
- Repeated array scans for membership checks (use Set)
- Building results by repeated concatenation instead of batch collection

## Step 9: Present Findings

Format findings by severity and impact:

### Critical (measurable user-facing impact)

| # | Category | Location | Finding | Impact | Fix |
|---|----------|----------|---------|--------|-----|
| 1 | DB-N+1 | `path:42` | Description | Response time / resource usage | Specific fix |

### Warning (will cause issues at scale)

| # | Category | Location | Finding | Impact | Fix |
|---|----------|----------|---------|--------|-----|
| 1 | Memory | `path:88` | Description | When it becomes a problem | Specific fix |

### Suggestion (optimization opportunity)

| # | Category | Location | Finding | Impact | Fix |
|---|----------|----------|---------|--------|-----|
| 1 | Caching | `path:15` | Description | Potential improvement | Specific fix |

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

**Top 3 priorities** (ordered by impact):
1. Most impactful fix
2. Second most impactful
3. Third most impactful

## Step 11: Persist Report (Optional)

Ask: **"Save this performance review to `docs/reviews/performance/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template from `docs/templates/review-report.md`.
