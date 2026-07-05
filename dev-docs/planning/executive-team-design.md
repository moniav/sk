# Executive Team — Design & Founder Journeys

> **Status:** design discussion (2026-07-05). Not built. Commands marked ⊕ are
> proposed; everything else ships today in v1.9.0+.
> The founder journeys below are the spec — written as narrative first, because
> walking them exposes requirements a feature list hides.

## Architecture in one paragraph

An executive is a **charter, not a costume**: a command (⊕ `/sk:ceo`, ⊕ `/sk:cto`,
⊕ `/sk:cmo`) that loads a persona with a distinct decision framework, a portfolio it
owns, a standing agenda, and a dissent duty — into the main conversation, as a 1:1
meeting. Memory lives in the executive's **office** (`docs/business/exec/<role>/`):
a rolling `STATE.md` (positions held, open threads, commitments — rewritten at every
meeting close) plus dated meeting notes. Authority comes from per-role rows in the
existing delegation policy and **widens only on cited evidence** (retro's
first-pass/escalation metrics). Executives wield existing commands rather than
duplicating them; they coordinate through an **asks ledger** (cross-portfolio
requests that must be answered in the next brief) and escalate conflicts to the
founder rather than resolving them silently. Weekly headless briefs (via
`/sk:routines`) plus a ⊕ `/sk:founder` Monday-packet assembler complete the loop:
founder sets direction → executives translate to plans → the fleet executes →
executives report back.

## Principle: altitude, not gateway

The founder is **never gated** by the executive layer. Every SK command keeps
working directly — the founder can implement, write copy, debug, or edit any file
at any time, exactly as without the exec team. What makes mixing altitudes safe is
that the doc system is the shared reality: direct founder work lands in git, on the
board, and in the changelog, so the executives *observe* it in their next briefs
rather than being bypassed by it. The one designed consequence: founder work that
serves no stated goal gets named in the CEO's next review ("founder shipped X
directly; serves nothing in goals.md — goal it or call it a detour") — overridable
like everything else, on the record like everything else. Expected lifecycle: mostly
hands-on early, drifting upward as the fleet earns trust, with the ladder always
available in both directions.

## CEO conversation modes

`/sk:ceo` is not one meeting type. The charter defines modes, selected by argument
or inferred from what the founder opens with
(`argument-hint: "[meeting | grill <topic> | product <feature> | review]"`):

| Mode | What it is | Ends with |
|------|-----------|-----------|
| **meeting** (default) | The weekly 1:1 — briefing, agenda, decisions | Decisions logged, STATE.md rewritten |
| **grill** | Adversarial stress-test of an idea, plan, or direction. Forcing questions — who desperately needs this, what's the demand evidence, smallest wedge, what kills it, why now — but **grounded**: every challenge cites goals.md, positioning, board state, or past decisions. "You said G1 was the priority; this serves nothing on the goals doc — convince me." | The founder's answers recorded; unanswered questions become open threads in STATE.md — **and get re-asked next time** ("last month you couldn't say who pays. Can you now?") |
| **product** | Product/feature sparring — the founder brings a feature idea and gets structured CEO feedback through the CEO lens: goal fit, ICP fit (from positioning), wedge size, opportunity cost (*what it displaces on the board*), anti-goal check, riskiest assumption | A position, not a survey: **proceed / park / kill**, with what evidence would change the verdict. "Proceed" hands off to `/sk:brainstorm` with the CEO's framing attached |
| **review** | The operating review, on demand (same artifact the weekly routine produces) | Dated review + proposed plan |

Two disciplines make these modes worth having:

- **The CEO judges "should we"; the CTO judges "can we/how."** Product mode
  deliberately does not discuss implementation — if the founder asks "how hard is
  it," the CEO's answer is "that's a CTO meeting; my question is whether it deserves
  the fleet's next slot."
- **Feedback always takes a position.** No option surveys. Recommendation + cited
  reasoning + riskiest assumption + the evidence that would flip it. The dissent
  duty applies: if the founder is in love with a feature that serves no goal, the
  grill/product modes are where that gets said — once, clearly, on the record.

Grill mode's memory is the killer feature: `STATE.md` accumulates the open
interrogation threads, so founder accountability compounds across sessions instead
of resetting. (The CTO and CMO charters get lighter versions of the same pattern —
`/sk:cto grill` for an architecture direction, `/sk:cmo product` for "will this
feature market itself" — same protocol, their lens.)

---

## Journey 1 — Greenfield: idea to launch

**Cast:** a solo founder with an idea, an empty repo, and SK.

### Day 0 — Founding day

```
npx shipkit-cld
/sk:kickoff
```

Kickoff runs as today (guided conversation, deep-tier stack research, foundation
docs). At the end it offers: **"Stand up your executive team?"** ⊕ — creating the
exec home, charters, and per-role delegation-policy rows (CTO: S/M autonomy;
CEO/CMO: propose-only).

**First meeting — ⊕ `/sk:ceo` (founding mode).** Different from a weekly 1:1: no
scorecard exists yet, so the agenda is *constitutional*:

- Mission in one sentence; the CEO pushes until it's falsifiable
- First goals → `docs/business/goals.md` (G1 "10 paying users by Oct", measurable)
- **Anti-goals** — the CEO's signature move: "What looks attractive that we're NOT
  doing this half?" The founder says "mobile app"; it goes in the doc; the CEO will
  defend that line later — including against the founder
- Riskiest assumption named; smallest wedge chosen
- Meeting closes: `STATE.md` written, decisions in the decision log, first epic
  scoped for `/sk:brainstorm`

**Second meeting — ⊕ `/sk:cto` (founding mode).** Ratifies the kickoff research:
stack choices become ADRs; the delegation policy S/M grant is reviewed with the
founder ("here's what I'll do without asking, here's the evidence trail you'll
have"); testing/review gates confirmed. CTO's first pushback, same day: founder
wants to skip tests for the prototype — CTO cites the charter ("velocity problems
are clarity problems"), offers the compromise (Quick Path for XS spikes, gates on
the wedge), notes the disagreement in the meeting record.

### Weeks 1–3 — Build

The founder mostly talks to nobody. `/sk:brainstorm` produced the epic; the fleet
executes (`/sk:implement`, or claimed tasks across parallel sessions); routines run
nightly audits. **Monday:** ⊕ `/sk:founder` assembles the packet — CTO brief (goal-
linked eng scorecard, 7/9 first-pass, one stalled task flagged), CEO brief (G1
trajectory unknown — *no measurement yet*, flagged as the top item). Founder's
Monday is 10 minutes and one decision: approve the CEO's proposal to define the G1
measure before building further.

### Week 4 — The CMO enters

Product approaches usable. **⊕ `/sk:cmo` (founding mode):** positioning first
(`/sk:positioning` wielded inside the meeting), then brand voice — the CMO refuses
to draft copy before the voice doc exists ("ten posts in ten voices is worse than
silence"). Output: positioning.md, brand-voice.md, and a launch campaign proposal
(`/sk:campaign new launch`) with a measurable objective linked to G1, awaiting
founder approval because CMO is propose-only.

### Week 6 — Launch

```
/sk:release        → v0.1.0 tagged
/sk:announce       → tiered pack in the brand voice
```

Founder signs off every public asset (publishing is never autonomous — hard limit,
not policy). Campaign goes live; the asks ledger gets its first entry:
`CMO → CTO: launch-week stability watch — accepted`.

### Week 8 — The system starts steering

CEO's operating review runs headless Sunday night. Monday packet leads with:
- G1 scorecard: 4 paying users, trajectory short — **cited** from the metric source
- **Blind spot called out:** "We have zero structured customer signal. Every roadmap
  decision I propose is inference. Recommend the feedback loop before the next epic."
- Kill recommendation: a parked idea the founder keeps mentioning that serves no goal
- CMO's campaign close: honest results ("email: 31% open, cited; social: unknown —
  no tracking was in place")

The founder disagrees with the kill recommendation → 15-minute `/sk:ceo` meeting →
CEO makes the case once, with citations, founder overrules → **decision log records
both the dissent and the override.** Three months later, "why did we keep this?"
has an answer.

### Month 3 — Earned authority

Retro cites: CTO 23 S/M tasks, 87% first-pass, zero policy violations → proposes
widening "merge on green CI + SHIP verdict" to autonomous. Founder approves the
policy edit (only the founder can). The company now ships routine work end-to-end
with no founder touch — and every step of how that trust was earned is in the log.

---

## Journey 2 — Brownfield: taking over what exists

**Cast:** a founder with a 2-year-old codebase, some revenue, scattered docs, a
TODO list in three places, and no idea what the tech debt really is.

### Day 0 — Discovery, not construction

```
npx shipkit-cld          # existing docs backed up, scaffold laid down
/sk:init-docs            # full profile; codebase scanned, system docs populated
```

**First meeting — ⊕ `/sk:cto` (due-diligence mode).** Brownfield inverts the order:
technical truth before strategy, because strategy set against an imagined codebase
is fiction. The CTO runs the sweep — `/sk:deps`, `/sk:debt`, `/sk:security-review`,
architecture read — and delivers **"here's what you actually own"**:

- Tech health brief: 2 Critical security findings, 14 outdated deps (3 with CVEs),
  debt clustered in the auth module, test coverage honest-unknown
- A *triage proposal*, not a lecture: "fix the 2 Criticals this week (S tasks,
  within my grant if you confirm it); the auth debt only matters if auth is on the
  roadmap — CEO question, not mine"
- The line brownfield founders need to hear: **"Nothing here is shameful. It shipped
  and it earns revenue. Now we decide what it needs to become."**

### Day 1 — ⊕ `/sk:ceo` (retrofit mode)

Greenfield CEO invents goals; brownfield CEO **excavates** them:

- "What is this business actually doing?" — revenue reality, who pays, why
- Goals retrofit: the implicit strategy made explicit in goals.md — including the
  awkward part where two ongoing efforts serve no articulable goal
- **The zombie sweep:** the three TODO lists get consolidated onto the board; each
  item gets a goal link or a `cancelled`/`abandoned` status. Typical outcome: 40
  items in → 12 remain. The founder feels lighter; the board finally tells the truth
- Anti-goals from scar tissue: "we keep almost building an API for that one
  customer" → anti-goal, written down

### Day 2 — ⊕ `/sk:cmo` (audit mode)

Marketing due diligence: what public surface exists (site copy, old launch posts,
half-maintained changelog) → voice extracted from the *best* existing copy into
brand-voice.md ("you already have a voice on your pricing page; the rest of the
site doesn't match it") → positioning written from the actual paying customers,
not aspirations. First proposal is usually maintenance, not fireworks: fix the
site's voice drift, restart the changelog-to-announcement habit via `/sk:announce`
on the next release.

### Week 1 onward — Converging on the same rhythm

The two journeys deliberately merge here: Monday packet, weekly briefs, asks
ledger, authority ramp. Brownfield differences that persist:

- CTO's early briefs weight debt-vs-feature portfolio balance heavily; the debt
  ledger delta is the number the founder learns to watch
- CEO's operating reviews inherit real history — git log and the retrofitted board
  make the first "where does effort actually go vs goals" analysis immediately
  damning and immediately useful
- The feedback loop matters even more (there are actual customers to mine), so the
  CEO's blind-spot pressure arrives in week 1, not week 8

---

## What the journeys reveal (requirements mined from narrative)

1. **Founding/due-diligence mode ≠ weekly mode.** Each charter needs a first-meeting
   agenda (constitutional/excavational) distinct from the standing agenda. One-time
   mode, triggered when the office has no `STATE.md`.
2. **Kickoff and init-docs are the on-ramps** — both should end by offering to stand
   up the exec team (greenfield: after foundation docs; brownfield: after the scan).
3. **Brownfield order is CTO → CEO → CMO; greenfield is CEO → CTO → CMO.** The
   journeys prove the ordering isn't cosmetic — each meeting consumes the previous
   one's outputs.
4. **The zombie sweep is a CEO capability** — consolidating scattered work-tracking
   onto the board with goal links or kill statuses. Needs explicit charter support.
5. **Dissent must be cheap and recorded** — the override moment (founder overrules
   CEO) is a *feature*; meeting notes need the `disagreements:` field from day one.
6. **The Monday packet is the product.** If the founder reads one artifact, it's
   this. `/sk:founder` deserves as much design care as any executive.
7. **Measurement-before-building shows up in both journeys** — the metrics
   dictionary (previously proposed, unbuilt) should ship with or before the exec team.
8. **Authority ramp needs a trigger** — retro already computes the evidence; the
   missing piece is retro proposing specific policy-row edits when thresholds hold.

## Build plan (when approved)

| Piece | Size | Notes |
|-------|------|-------|
| `executive-meeting` skill | M | protocol, STATE.md read/rewrite, dissent duty, founding-mode detection |
| `executive-charter` template | S | makes CEO/CTO/CMO instances + future COO/GC cheap; user-definable executives |
| ⊕ `/sk:ceo`, `/sk:cto`, `/sk:cmo` | S–M each | charter + conversation modes (meeting/grill/product/review) over the shared skill |
| ⊕ `/sk:founder` | M | Monday packet assembler; decisions ranked by reversibility |
| `docs/business/exec/` home + asks ledger | S | STATE + meetings + asks.md |
| Delegation policy: per-role section | S | CTO S/M grant; CEO/CMO propose-only defaults |
| 3 routine rows (weekly briefs, headless) | XS | reuses headless-operation |
| Metrics dictionary template | S | prerequisite pulled forward from earlier backlog |
| kickoff/init-docs exec on-ramp | S | closing offer in both commands |

## Settled decisions (2026-07-05)

1. **Meeting notes: every conversation.** Every executive session writes a note —
   even "no decisions" meetings — because grill threads, positions, and dissent all
   carry value beyond formal decisions, and a gap in the record is indistinguishable
   from a meeting that never happened. Notes stay short by protocol (the
   executive-meeting skill caps them: decisions, disagreements, threads, actions —
   not transcripts). `STATE.md` remains the rolling synthesis so note volume never
   burdens context.

2. **COO at launch — four seats.** The COO owns what already exists but has no
   owner: routines (the schedules and their reports), incidents/postmortems,
   reliability/SLOs, the delegation policy's *operational* health (are headless runs
   escalating properly? are blocked items rotting?), and — when the support pack
   lands — customer support operations. Charter framework: "the company must run the
   same on a day nobody is watching"; boring excellence; every incident becomes a
   runbook. Wields: `/sk:ops`, `/sk:routines`, docs-audit/deps reports, the
   operations home. Brownfield due-diligence mode: routine coverage audit + "what
   breaks if the founder disappears for two weeks?" Greenfield founding mode: stands
   up the initial routine set. Day-one authority: may tune routine cadences and
   file/triage incidents autonomously; may not change the delegation policy or
   deploy anything.

## The remaining decision, expanded: `/sk:founder` — standalone, folded, or bridged

The Monday packet needs a home. Three options:

### Option A — Fold into `/sk:resume`

One morning ritual: resume detects the exec home and prepends the packet to the
session briefing.

- **For:** single habit, no new command; the founder can't forget to check.
- **Against — and these are structural:** it violates the altitude principle. Resume
  is *session*-scoped ("what was I doing?") and runs every session; the packet is
  *company*-scoped ("what does the company need from me?") and is weekly. A founder
  dropping in for a hands-on coding hour would open with a board meeting — exactly
  the gating the design forbids. It also bloats every session's context with content
  that's stale six days out of seven, and it leaves no room for the packet to grow
  into an approval console (below) without making resume enormous.

### Option B — Standalone `/sk:founder`

- **For:** clean altitude separation — you *choose* the founder hat, matching how
  every other executive works; cadence matches the weekly briefs; resume stays lean.
  Most importantly it gives the packet room to become what it wants to be: not a
  report but an **approval console** — the decisions queue (approve / adjust / defer
  each item, ranked by reversibility, one-way doors first), asks awaiting
  resolution, policy-widening proposals to ratify, and on approval the dispatch
  happens right there (items land on the board, epics go to brainstorm, policy edits
  apply). Founder decisions write to the decision log like everyone else's.
- **Against:** 49th command; discoverability — a founder who never learns the
  command never sees the packet, and the exec layer silently degrades into reports
  nobody reads.

### Option C — Standalone + a bridge (recommended)

Option B, plus one line: when `/sk:resume` runs and an **unread packet** exists (a
brief newer than the last `/sk:founder` session), the session briefing ends with:
`Your executive team's Monday packet is waiting — /sk:founder (3 decisions queued,
1 one-way door).` One sentence, session-scoped resume stays session-scoped, the
company-scoped work is signposted not imposed — the same hint-not-gate pattern as
`.current`. Discoverability solved, altitude preserved, and the teaser line
("1 one-way door") does the marketing.

**Recommendation: C.** It is strictly B plus the discoverability fix, at the cost of
three lines in resume.md.

**DECIDED 2026-07-05: Option C.** All design decisions closed — build approved.

## Build plan additions from these decisions

| Piece | Size | Notes |
|-------|------|-------|
| ⊕ `/sk:coo` | S–M | fourth charter over the shared skill; owns routines/incidents/reliability |
| resume.md bridge | XS | unread-packet pointer (if Option C confirmed) |
| Note-brevity protocol | — | folded into the executive-meeting skill (decisions/disagreements/threads/actions caps) |
