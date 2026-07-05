# Meet your executive team

**Last updated:** 2026-07-05
**Lifecycle:** current
**Audience:** Founders/developers using SK who want persistent executive partners — CEO, CTO, CMO, COO — running the company with them

## What you'll accomplish

A working executive team: 1:1 partners with portfolios, memory, and a dissent duty;
weekly briefs that run themselves; and a Monday packet where you approve the week's
decisions in minutes. You stay hands-on whenever you want — the executives observe
your work, they never gate it.

## Before you start

- SK v2.0+ installed
- Recommended: review `docs/conventions/delegation-policy.md` — its Executive Seats
  table defines what each seat may do (CTO gets S/M execution autonomy day one;
  CEO/CMO propose-only; nobody edits the policy but you)

## Steps

1. **Hold the founding meetings** (order matters):
   - *Greenfield:* `/sk:ceo` first — mission until falsifiable, first goals,
     anti-goals ("what we're NOT doing") — then `/sk:cto` to ratify the stack and
     confirm the autonomy grant. The CMO joins pre-launch.
   - *Brownfield:* `/sk:cto` first ("here's what you actually own" — the
     deps/debt/security sweep), then `/sk:ceo` (goals retrofit + the zombie sweep
     of your scattered TODO lists), then `/sk:cmo` (audit the existing public surface).
   - *What you'll see:* each seat's office appears under `docs/business/exec/<role>/`
     with a `STATE.md` — the executive's memory, rewritten after every meeting.
2. **Schedule the weekly briefs** — `/sk:routines`, pick "Executive briefs."
   - *What you'll see:* each seat writes a weekly brief (cited scorecard + proposed
     plan) to its office; nothing is self-approved.
3. **Run your Monday** — `/sk:founder`.
   - *What you'll see:* the packet — goal scorecard, 3-line seat summaries, open
     asks, conflicts as explicit tradeoffs, and the decisions queue ranked
     one-way-doors-first. Approve/adjust/defer each; approvals dispatch to the board.
     `/sk:resume` will point you here when a packet is waiting.
4. **Use the modes** when you need judgment, not just status:
   - `/sk:ceo grill <topic>` — get stress-tested against your own goals and
     positioning; unanswered questions come back next time
   - `/sk:ceo product <idea>` — a proceed/park/kill verdict on a feature ("should
     we"); `/sk:cto product <idea>` for feasibility/cost ("can we, how expensive")
   - `/sk:cmo product <idea>` — will it market itself; `/sk:coo product <idea>` —
     what does it cost to run
5. **Widen authority as trust builds** — retros cite first-pass rates and
   escalations; widening proposals appear in your packet; approving one edits the
   policy (the only path that happens).

## Working alongside them

Work directly whenever you want — code, write copy, debug. Your work lands on the
board and in git, so the next brief *sees* it. If it serves no stated goal, the CEO
will name that (and you can overrule, on the record). Altitude, not gateway.

## Troubleshooting

| If you see… | It means… | Do this |
|-------------|-----------|---------|
| An executive agrees with everything | The dissent duty isn't biting | Check meeting notes' `Disagreements:` fields — persistently empty means grill it: "what would you push back on?" |
| Scorecards full of "unknown — no measurement" | Honest reporting, missing metrics | Define them: `/sk:new-business-doc` → Metrics dictionary |
| A seat proposes work serving no goal | Goals are stale or the proposal is a detour | Fix goals.md in a `/sk:ceo` meeting, or reject in the packet |
| You want a seat that doesn't exist | Custom seats are supported | Copy `docs/templates/executive-charter.md` into a project command over the `executive-meeting` skill |

## Related guides

- [Set up autonomous maintenance routines](./set-up-autonomous-routines.md)
- [Run multiple agents on one project](./run-multiple-agents.md)
- [Run your marketing with SK](./run-your-marketing.md)
