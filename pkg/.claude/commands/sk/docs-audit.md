---
description: Audit documentation coherence — orphans, staleness, drift from the code, broken links, lifecycle
argument-hint: "[drift (only the drift check) | <days> stale threshold (optional)]"
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *)
disallowed-tools: Edit, NotebookEdit
disable-model-invocation: true
---

# Audit Documentation

Check whether `docs/` is still coherent: find orphaned docs, stale docs, broken
cross-links, and docs sitting outside the indexed structure. **Read-only by default** —
produces a report and proposes fixes; it does not modify files unless you ask.

**Report-only.** This command does not modify project files. The only file it may write is its report under `docs/reviews/`; fixes are applied only in a later turn, after you ask for them. Asked to fix something, add a test or change a file, it still only reports: it lists the changes for the user to start after the report, and creates no other file.

**Arguments:** `$ARGUMENTS`
`drift` runs Step 1 and the drift check (2f) only, for a scheduled or post-merge run. A number sets the stale threshold in days. Empty runs every check.

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

## Step 2: Run the checks

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
- **Code-drift**, for a doc without `Verified at` only (a stamped doc goes to 2f): if it declares the code it describes via a
  `Source:` / `Code:` / `Location:` field (see `docs/conventions/doc-lifecycle.md`),
  get the last commit date of those paths (`git log -1 --format=%cs -- <paths>`)
  and compare against `Last updated`. Code newer than the doc → flag **code-drift**
  with both dates. Skip paths that no longer exist (report those as a note instead).
  List each code-describing doc without the stamp once under **Unstamped**, with
  `/sk:update-docs` as the way to stamp it.
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

### 2f. Drift since `Verified at`

For each doc with a `**Verified at:** <sha>` stamp (`docs/conventions/doc-lifecycle.md`):

1. **What changed.** `git diff --name-only <sha> HEAD`, ignoring `docs/` and `CLAUDE.md` (the docs' own commits are not code changes). A sha git does not know (rewritten history) → report the doc as **unverifiable** and fall back to 2b. Nothing changed → the doc is clean; do not re-read its claims.
2. **Which claims to re-check.** Only these: claims that cite a changed file (`path` or `path:line`), claims about paths under its `Source:` / `Code:` / `Location:` when those changed, and the kind checks below when files of that kind changed. Find routes, models, migrations and manifests with `docs/reference/stacks/signals.md`.

| Doc | Re-check when | Against |
|-----|---------------|---------|
| `system/api-reference.md` | a route file changed | every documented endpoint still declared with that method and path; a route the diff adds is undocumented |
| `system/database-schema.md` | a migration, model or schema file changed | every documented table and column still created and not dropped by a later migration; a table the diff adds is undocumented |
| `system/env-variables.md` | a changed file reads an environment variable | each documented name still read; a name the diff adds is undocumented (names only; never open a secret file) |
| `CLAUDE.md` Build Commands | a manifest or CI file changed | each command still defined in the scripts or run in CI |
| `architecture/` | any path it cites changed or is gone | the cited path exists; the component still does what the doc says |
| feature doc *Behaviour contract* | its `Code:` paths changed | each row still holds in the code and a test exercises it; behaviour a delivered PRD tagged REMOVED is gone from the code |

3. **Verdict per claim:** **holds**, **drifted** (what the doc says, what the code says, both `path:line`), or **unverified** (a claim marked *(inferred)*, or one the code cannot settle). Drifted claims are findings, one per cause: removed behaviour still served is one finding, not also an undocumented route. Unverified claims are listed, not counted.

## Step 3: Report

Print a categorized report. Every finding cites `file:line`. Group as:

```
## Docs Audit — <date>

### Orphans (N)
- docs/path/to/file.md — linked from no index

### Drift since Verified at (N claims in D docs)
| Doc | Claim | Doc says | Code says | Evidence |
- unverified: (claims, or none) · unverifiable stamps: (docs, or none)

### Code-drift, unstamped docs (N)
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
Audit: N docs scanned · D drifted claims in K docs · O orphans · S stale · B broken links · U out-of-lane · stale threshold 180d
```

## Step 4: Offer fixes (only if asked)

Default is report-only. If the user asks to fix, propose targeted actions and confirm
before writing:
- Orphan → add a link from the right index, or move under `_archive/`.
- Broken link → repoint or remove.
- Stale → set `Lifecycle: stale` (flag for review) — don't rewrite content here; that's
  `/sk:update-docs`.
- Drifted claim → `/sk:update-docs` on that doc (it re-verifies and moves `Verified at`); a contract row whose behaviour changed on purpose goes through `/sk:prd PRD-N amend`.
- Out-of-lane → move into the correct section + index it.

## Configuration

- **Staleness threshold:** default 180 days. If the user passes a number (e.g.
  "audit, 90 day threshold"), use it.
- **Project-agnostic:** never assume a specific stack or path beyond `docs/`.
