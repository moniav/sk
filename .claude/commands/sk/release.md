---
description: Cut a release — version bump, changelog, tag, GitHub release
argument-hint: "[major|minor|patch|X.Y.Z (optional — inferred from commits)]"
disable-model-invocation: true
---

# Release — Version, Changelog, Tag, Publish

Close the loop `/sk:changelog` opens: bump the version, update the changelog, tag,
and (optionally) create a GitHub release and publish.

## Step 1: Preflight

All must pass before anything is modified:

1. **Git repo with a remote** — if not, stop and say why
2. **Clean working tree** — `git status`; uncommitted changes → suggest `/sk:commit` first
3. **On the default branch** — detect with `git symbolic-ref --short refs/remotes/origin/HEAD` (fall back to `main`, then `master`); if on a feature branch, confirm with the user before proceeding
4. **Tests pass** — run the project's test command (from `CLAUDE.md` Build Commands / `docs/system/tech-stack.md`) and paste the output; failing tests block the release

## Step 2: Determine Versions

**Current version** — check in order: the project manifest (`package.json`,
`pyproject.toml`, `Cargo.toml`, `*.gemspec`, `VERSION` file, …), then the latest
git tag (`git describe --tags --abbrev=0`). If they disagree, tell the user and ask
which is authoritative.

**Next version** — if the user passed `major|minor|patch` or an explicit `X.Y.Z`,
use it. Otherwise infer from conventional commits since the last tag:
- any `feat!:` / `BREAKING CHANGE` → major
- any `feat:` → minor
- otherwise → patch

Present: `vCURRENT → vNEXT ({reason})`. **Wait for approval.**

## Step 3: Update Version + Changelog

1. Update the version in the manifest (all places it appears — some projects
   duplicate it; grep for the current version string to find them)
2. Generate release notes from commits since the last tag — same grouping rules as
   `/sk:changelog` (Added / Changed / Fixed / etc., no invented entries)
3. Prepend to `CHANGELOG.md` under `## [X.Y.Z] — YYYY-MM-DD` (create the file if missing)

## Step 4: Commit and Tag

```bash
git add {manifest + CHANGELOG.md}
git commit -m "chore(release): vX.Y.Z"
git tag vX.Y.Z
```

Ask: **"Push commit and tag?"** If yes: `git push && git push --tags`.

## Step 5: GitHub Release (Optional)

If `gh` is available, ask: **"Create a GitHub release?"** If yes:

```bash
gh release create vX.Y.Z --title "vX.Y.Z" --notes "<release notes from Step 3>"
```

## Step 6: Publish (Optional, explicit confirmation required)

If the project publishes to a registry (npm / PyPI / crates.io — infer from the
manifest), ask explicitly: **"Publish vX.Y.Z to {registry}?"** Only on a clear yes,
run the publish command (`npm publish`, etc.) and paste its output. Never publish
without this confirmation.

## Step 7: Summary

- Version: vCURRENT → vNEXT
- Changelog: {N} entries added
- Tag: pushed / local only
- GitHub release: {URL or skipped}
- Published: {registry or skipped}
