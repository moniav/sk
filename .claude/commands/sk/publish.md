---
description: Bump version, commit, push, and publish to npm
---

# Publish Package

Bump the package version, commit, push to remote, and publish to npm.

## Step 1: Pre-flight Checks

1. Run `npm whoami` — confirm authenticated to npm
2. Run `git status` — confirm working tree is clean (no uncommitted changes)
3. If there are uncommitted changes, ask the user whether to commit them first or abort

## Step 2: Determine Version Bump

Ask the user which version bump to apply:
- **patch** (x.x.X) — bug fixes, minor tweaks
- **minor** (x.X.0) — new features, non-breaking changes
- **major** (X.0.0) — breaking changes

Show the current version from `package.json` and what it will become.

## Step 3: Bump Version

```bash
npm version <patch|minor|major>
```

This updates `package.json` and creates a git tag automatically.

## Step 4: Push

```bash
git push && git push --tags
```

## Step 5: Publish

```bash
npm publish
```

If it fails with a 2FA/OTP error, ask the user for their OTP code and retry:

```bash
npm publish --otp=CODE
```

## Step 6: Verify

```bash
npm view shipkit-cld version
```

Confirm the published version matches the expected version.

Present to user:
- Version published
- npm URL: https://www.npmjs.com/package/shipkit-cld
- Git tag created
