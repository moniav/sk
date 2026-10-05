# Feature: [Name]

**Last updated:** YYYY-MM-DD
**Lifecycle:** current  <!-- current | stale | deprecated | archived (see conventions/doc-lifecycle.md) -->
**Status:** [shipped | in-progress | planned]
**Code:** `src/path/to/feature`
**Delivered by:** <!-- PRD-N / EPIC-N / TASK-N; the FR ids this feature satisfies -->
**Flags / config:** <!-- feature flag or settings that turn it on, or `none` -->

## What it does

<!-- 1-3 sentences: the user-facing capability this feature provides. Describe what
     actually ships today, verified against the code, not aspirational behavior. -->

## How it works

<!-- The mechanism, at the level a contributor needs. Key modules, the data flow, the
     entry points. Link to ../architecture/ for system-level context and ../flows/ for
     diagrams instead of duplicating them. -->

- **Entry point:** `path:symbol`
- **Key modules:** …
- **Data / state:** …

## How to use it

<!-- For a developer integrating with or building on this feature. Minimal example. -->

## How to extend it

<!-- Where to add to it, what to be careful of, the seams designed for extension. -->

## Edge cases & limitations

<!-- The decided behaviour on bad input, empty state, limits, permissions, a dependency down, concurrency. Known constraints,
     unsupported cases, sharp edges. Link the flow's Error Paths table instead of repeating it. -->

## Related

- Architecture: [../architecture/README.md](../architecture/README.md)
- Flows: <!-- ../flows/<flow>.md -->
- Tasks/ADRs: <!-- links to the work that built this -->
