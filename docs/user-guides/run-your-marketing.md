# Run your marketing with SK

**Last updated:** 2026-07-05
**Lifecycle:** current
**Audience:** Developers/founders using SK who want agents to produce consistent, goal-linked marketing — copy, campaigns, and release announcements

## What you'll accomplish

A marketing setup where every piece of public copy sounds like one company, campaigns
are planned and measured like engineering work, and each release turns into an
announcement pack automatically — with publishing always behind your sign-off.

## Before you start

- SK v1.9.0+ installed
- Positioning defined (`/sk:positioning` → `docs/business/positioning.md`) — the
  voice and campaigns build on it

## Steps

1. **Define your brand voice (once)** — run `/sk:new-business-doc`, pick **Brand voice**.
   - *What you'll see:* `docs/business/brand-voice.md` — tone by context, words you
     use/never use, before/after examples. Everything that writes public words reads
     this first and it overrides SK's default voice.
2. **Produce copy** with `/sk:copywrite` — landing pages, emails, ads, social, and
   long-form blog posts (with SEO title/meta/outline).
   - *What you'll see:* ready-to-use copy in your voice, saved to `docs/business/copy/`.
3. **Plan coordinated work as a campaign** — `/sk:campaign new {name}`.
   - *What you'll see:* a campaign file with a measurable objective linked to a goal
     (`G{N}` from `docs/business/goals.md`), the target ICP segment, and a channel/
     asset checklist pointing at the copywrite format that produces each asset.
4. **Announce releases** — after `/sk:release`, run `/sk:announce`.
   - *What you'll see:* a tiered pack (major: post + email + social sequence; minor:
     short post + social; patch: a blurb or "skip — not news") that only claims what
     the changelog says shipped, saved to `docs/business/copy/announce-v{X.Y.Z}.md`.
5. **Automate the drumbeat (optional)** — `/sk:routines` includes a weekly social
   pack and monthly newsletter draft, generated from recently shipped work.
   - *What you'll see:* drafts landing in `docs/business/copy/` on schedule.
6. **Close campaigns honestly** — `/sk:campaign close CAMPAIGN-N` when it's done.
   - *What you'll see:* a results table filled with real numbers and sources — or
     "we don't know" where measurement wasn't in place — plus lessons captured.

## Troubleshooting

| If you see… | It means… | Do this |
|-------------|-----------|---------|
| Copy that sounds generic/off-brand | No `brand-voice.md`, so the default voice applied | Step 1 — then regenerate |
| An announcement claiming an unshipped feature | It can't — announce only reads the changelog | If the changelog is wrong, fix it and re-run |
| A campaign live past its launch date, still `planning` | `/sk:campaign status` flags these | Launch it, reschedule, or cancel it |
| Something got published automatically | Marketing routines produce drafts only; publishing requires human sign-off | Check who published interactively |

## Related guides

- [Set up autonomous maintenance routines](./set-up-autonomous-routines.md)
- [Run multiple agents on one project](./run-multiple-agents.md)
