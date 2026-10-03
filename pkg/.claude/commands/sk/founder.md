---
description: Your Monday packet — executive briefs merged into an approval console (project)
argument-hint: "[packet | approve <item> | asks]"
disable-model-invocation: true
---

# Founder — The Monday Packet

Load `.claude/skills/executive-meeting/SKILL.md` for the office layout and citation
rules. This is **not an executive** — it is the founder's console: every brief the
team wrote, merged into one page, with a decisions queue you walk and dispatch.
The founder is never gated by this layer; the packet is a summons you choose to open.

**Empty state:** if no `docs/business/exec/*/briefs/` exist (or the exec home itself
doesn't), say so plainly — "No executive briefs yet." — and point to `/sk:routines`
to schedule the weekly headless briefs (and to `/sk:ceo` / `/sk:cto` / `/sk:cmo` /
`/sk:coo` for on-demand ones). Don't fabricate a packet from nothing.

## Step 1: Read

1. The last-read marker: `docs/business/exec/founder-last-read.md` (if missing, fall
   back to the newest `docs/business/exec/founder/meetings/` note; if neither exists,
   treat everything as unread).
2. Every brief in `docs/business/exec/*/briefs/` newer than that marker.
3. `docs/business/exec/asks.md` — open asks, especially any addressed to the founder.
4. The goal scorecard source: `docs/business/goals.md` (skip gracefully if missing —
   note "no goals doc" as a packet item rather than erroring).

## Step 2: Assemble the Packet (one page)

```
# Monday Packet — {date}

## Goal scorecard        (from goals.md + the CEO brief — cited or "unknown")
## Seat summaries        (3 lines per seat, max — what changed, what they propose)
## Open asks             (from asks.md — who asks whom, what, how old)
## Conflicts             (where seats disagree — surfaced as explicit tradeoffs,
                          NEVER self-resolved; the founder rules)
## DECISIONS QUEUE       (see ranking rule)
```

**Ranking rule — one-way doors first.** The queue is ordered by *reversibility*, not
urgency or seat seniority: irreversible decisions (deletes, public announcements,
pricing changes, policy widenings, architecture one-way doors) at the top, freely
reversible ones at the bottom. Each queue item states:

- **What** is proposed (one line)
- **Who** proposes it (which seat / brief)
- **Evidence** cited (or "proposed without measurement" — flag it)
- **What approval dispatches** (the exact action that fires on approve)

## Step 3: Walk the Queue

Present each item with AskUserQuestion — options: **approve / adjust / defer /
reject**. Adjust means edit the proposal with the founder, then approve the edited
version. No batch approval of one-way doors — those are confirmed one at a time.

## Step 4: Dispatch Approvals

- Board items → created goal-linked on the task board
- Epics → hand off to `/sk:brainstorm` with the proposing seat's framing attached
- Policy-widening proposals → apply the edit to
  `docs/conventions/delegation-policy.md` — **this console is the ONLY path a policy
  edit ever happens**, because here the founder is the one approving
- Asks → mark resolved in `asks.md` with the founder's answer

## Step 5: Record

1. Founder decisions → one line each in `docs/decisions/decision-log.md`
   (who: `founder`), including rejections and any executive dissent overruled.
2. Update `docs/business/exec/founder-last-read.md` with today's date and the briefs
   consumed (create it if missing).
3. Deferred items → note them in the marker file so they **resurface in the next
   packet** — deferral postpones a decision; it never deletes one.

## Argument shortcuts

- `packet` (default) — the full flow above.
- `approve <item>` — jump straight to one named queue item (from the last packet),
  confirm, dispatch, record.
- `asks` — show only the asks ledger with ages; resolve any addressed to the founder.
