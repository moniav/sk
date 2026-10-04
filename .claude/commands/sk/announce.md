---
description: Turn a release into an announcement pack — post, email, social from the changelog
argument-hint: "[version (optional — defaults to latest changelog entry)]"
disable-model-invocation: true
---

# Announce — Release → Announcement Pack

Close the ship-to-market loop: turn a changelog entry into coordinated launch
assets. Pairs with `/sk:release` (which cuts the version this announces).

Write the text to the rules in `.claude/skills/technical-writing/references/plain-writing-rules.md` (`docs/business/brand-voice.md` overrides them if it exists).

## Step 1: Read Context

1. `CHANGELOG.md` — the entry for `$ARGUMENTS` version, or the latest entry
2. `docs/business/brand-voice.md` — the voice (if missing, offer to create it from
   `docs/templates/brand-voice.md` first; otherwise use the copywriting skill default)
3. `docs/business/positioning.md` — audience and value framing (if it exists)
4. `.claude/skills/copywriting/SKILL.md` — writing rules

**Honesty rule:** the pack may only claim what the changelog actually says shipped.
No aspirational features, no invented metrics.

## Step 2: Pick the Tier

Match effort to the release (AskUserQuestion, recommend based on semver):

| Tier | For | Pack contents |
|------|-----|---------------|
| **Major** | Breaking/flagship (X.0.0) | Announcement post + email + 3-post social sequence + suggest `/sk:campaign` for coordinated launch |
| **Minor** | New features (x.Y.0) | Short announcement post + 1-2 social posts |
| **Patch** | Fixes (x.y.Z) | One social post / changelog blurb — or skip; not every patch is news |

## Step 3: Write the Pack

Translate changelog entries from *what changed* to *what the reader can now do* —
lead with the user outcome, not the implementation. Follow the tone-by-context rows
in brand-voice (announcements ≠ ad copy).

Produce every asset ready-to-publish in one file per the tier table: post, email
(subject + body), social posts (each within platform length norms).

## Step 4: Save & Hand Off

1. Save to `docs/business/copy/announce-v{X.Y.Z}.md` (create `copy/` if missing) and
   add it to the `docs/business/README.md` index.
2. **Do not publish anywhere** — publishing is outward-facing and never autonomous
   (delegation policy). Present the pack for human review and say exactly what's
   ready to go where.
3. For major tiers: offer `/sk:campaign new` to track the launch as a campaign.
