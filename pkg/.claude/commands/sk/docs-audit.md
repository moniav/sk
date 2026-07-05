---
description: Audit documentation coherence — orphans, staleness, broken links, lifecycle (project)
allowed-tools: Read, Grep, Glob, Bash(git:*), Bash(date:*)
---

# Audit Documentation

Check whether `docs/` is still coherent: find orphaned docs, stale docs, broken
cross-links, and docs sitting outside the indexed structure. **Read-only by default** —
produces a report and proposes fixes; it does not modify files unless you ask.

**Use when:** Periodic doc health check, before a release, or after a large refactor.
Pairs with `/sk:update-docs` (which fixes content) and the `Lifecycle` convention
(`docs/conventions/doc-lifecycle.md`).

## Step 1: Build the inventory

Use **Glob** `docs/**/*.md` to list every doc file. Note the count.

Use **Read** on the index files that define the intended structure:
- `docs/README.md` — master index
- each section `README.md` (e.g. `docs/architecture/README.md`, `docs/conventions/README.md`, …)

**Skip** files that are empty or contain only unfilled template placeholders
(`YYYY-MM-DD`, `[Name]`, `{Topic}`) — report them separately as "unfilled stubs", not
as real docs. Untouched SK-shipped scaffold indexes are normal for a young project:
report those as a single count line, not as itemized findings demanding action.

## Step 2: Run the four checks

Today's date is needed for staleness — get it with **Bash**: `date +%F`
(PowerShell: `Get-Date -Format yyyy-MM-dd`).

### 2a. Orphans (reachability)

Build the set of docs **linked** from any index (`README.md` files) by collecting their
relative Markdown links. Diff against the full file list from Step 1.

- A doc reachable from no index is an **orphan**.
- Exempt by convention: `README.md` files themselves, files under `tasks/`,
  `reviews/`, `research/` (these are dated/event logs, not index-linked), and anything
  under `_archive/`.

### 2b. Staleness

For each **evergreen** doc (`architecture/`, `conventions/`, `system/`, `flows/`,
`sop/`, `decisions/`, and any feature/component docs), read its `Last updated` /
`updated` field and `Lifecycle` field:

- `Last updated` older than **180 days** (configurable — see below) **and** `Lifecycle`
  not explicitly `current` → flag **stale**.
- `Lifecycle: stale` / `deprecated` → report under those groups regardless of date.
- **Code-drift** (strongest signal): if the doc declares the code it describes via a
  `Source:` / `Code:` / `Location:` field (see `docs/conventions/doc-lifecycle.md`),
  get the last commit date of those paths — `git log -1 --format=%cs -- <paths>` —
  and compare against `Last updated`. Code newer than the doc → flag **code-drift**
  with both dates. Skip paths that no longer exist (report those as a note instead).
- Evergreen doc **missing** a `Lifecycle` or `Last updated` field → flag **unstamped** —
  but only where the convention *requires* the field: feature/component docs, flows,
  SOPs, user guides, and the domain-home indexes (`features/`, `business/`, `legal/`,
  `operations/`, `user-guides/`, `reference/`, `_archive/`). Section indexes
  (`architecture/`, `system/`, `conventions/`, `decisions/` READMEs) **may** adopt
  `Lifecycle` per `docs/conventions/doc-lifecycle.md` but are NOT flagged when they
  haven't — don't report a fresh scaffold against its own convention.

Do **not** apply staleness to transient docs (`tasks/`, `reviews/`, `research/`) — their
`status`/`date` fields govern them, not freshness.

### 2c. Broken cross-links

For every relative Markdown link (`](./...)` / `](../...)`) in any doc, check the target
resolves to a real file (use **Glob**/**Read** to confirm existence). Report each
unresolved link with its source `file:line`.

**Exemptions** (these are not broken links):
- External `http(s)://` links and pure anchors (`#section`).
- Anything under `templates/` — template files contain intentional **placeholder** links.
- Links containing placeholder tokens: `{...}`, `[...]`, or obvious example names
  (e.g. `process-name`, `relevant-flow`, `EPIC-1-...` in an index's example block).

### 2d. Out-of-lane docs

Flag docs that live directly under `docs/` (not in a known section folder) and aren't one
of the expected root files (`README.md`). These usually belong in a section.

### 2e. Task hygiene

- **Abandoned-in-flight:** tasks/epics with `status: in-progress`/`testing` whose
  `updated` is older than 30 days → list them; suggest `status: abandoned` or
  `cancelled` (via `/sk:task-status`).
- **Board drift:** if `docs/tasks/README.md` tables disagree with task-file
  frontmatter, note it and point to `/sk:task-status` Step 4 to regenerate.

## Step 3: Report

Print a categorized report. Every finding cites `file:line`. Group as:

```
## Docs Audit — <date>

### Orphans (N)
- docs/path/to/file.md — linked from no index

### Code-drift (N)
- docs/features/auth.md — Source `src/auth/` last changed 2026-06-28, doc updated 2026-03-01

### Stale (N)
- docs/architecture/foo.md — Last updated 2024-01-02 (540d), Lifecycle: current

### Lifecycle: deprecated / stale (N)
- docs/flows/old-flow.md — Lifecycle: deprecated → plan removal

### Broken links (N)
- docs/README.md:42 — ./system/missing.md does not exist

### Out-of-lane (N)
- docs/notes.md — not under a known section

### Unstamped evergreen docs (N)
- docs/sop/deploy.md — no Lifecycle field

### Unfilled stubs (N)
- docs/system/api-reference.md — placeholder only
```

End with a one-line tally (quantified-footer convention):

```
Audit: N docs scanned · O orphans · S stale · B broken links · U out-of-lane · stale threshold 180d
```

## Step 4: Offer fixes (only if asked)

Default is report-only. If the user asks to fix, propose targeted actions and confirm
before writing:
- Orphan → add a link from the right index, or move under `_archive/`.
- Broken link → repoint or remove.
- Stale → set `Lifecycle: stale` (flag for review) — don't rewrite content here; that's
  `/sk:update-docs`.
- Out-of-lane → move into the correct section + index it.

## Configuration

- **Staleness threshold:** default 180 days. If the user passes a number (e.g.
  "audit, 90 day threshold"), use it.
- **Project-agnostic:** never assume a specific stack or path beyond `docs/`.
