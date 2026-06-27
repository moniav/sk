---
description: Audit documentation coherence — orphans, staleness, broken links, lifecycle (project)
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
as real docs.

## Step 2: Run the four checks

Today's date is needed for staleness — get it with **Bash**: `date +%F`.

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
- Evergreen doc **missing** a `Lifecycle` or `Last updated` field → flag **unstamped**.

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

## Step 3: Report

Print a categorized report. Every finding cites `file:line`. Group as:

```
## Docs Audit — <date>

### Orphans (N)
- docs/path/to/file.md — linked from no index

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
