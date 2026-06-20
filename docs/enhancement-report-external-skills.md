# SK Enhancement Report — External Skill Repos

> Competitive analysis of four community skill collections and concrete recommendations
> for enhancing SK's skills, commands, and agents.
>
> **Date:** 2026-06-19
> **Repos reviewed:**
> - [BuilderIO/skills](https://github.com/BuilderIO/skills) — orchestration/governance skills (`@agent-native/skills`)
> - [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — data-driven design intelligence
> - [mattpocock/skills](https://github.com/mattpocock/skills) — engineering-craft skills + authoring discipline
> - [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) — anti-over-engineering behavioral overlay

---

## Implementation Status

**All 14 recommendations (R1–R14) implemented** on 2026-06-20. Verified via clean install (`node cli.mjs` → 34 commands, all core files present). Changes landed in both `pkg/.claude/` and root `.claude/` per the sync rule.

| Tier | Items | Delivered |
|------|-------|-----------|
| Sprint 1 | R1, R3, R4, R9, R13 | `disable-model-invocation` on `context-priming` + classification rule in `CLAUDE.md`; quantified footers on 4 review commands; honesty guardrails in `retro`/`changelog`; feedback-loop-first + ranked hypotheses + `[DEBUG-xxxx]` tags in `debug`; adversarial self-review pass in `plan` + plan-review mode in `spec-reviewer` |
| Sprint 2 | R2, R6, R8, R14 | new `/sk:debt` + `sk-debt:` marker convention; contract-audit in `verification-before-completion`; new `plow-ahead` skill; new `/sk:recap` |
| Sprint 3 | R5, R7, R10, R11, R12 | plan-arbiter mode in `/sk:council`; new `stay-within-limits` skill (wired into `orchestrate`); UI-design reference corpus (`anti-patterns.md`, `visual-design.md`) + aesthetic audit step in `ui-review`; simplicity ladder in `coding-behavior` + `code-review`; `docs/skill-authoring-guide.md` |

Remaining as future expansion: R10's reference corpus ships as a **seed** set to grow over time; an optional `docs/design/DESIGN.md` persistence file is supported by `ui-review` but not auto-generated.

---

## Executive Summary

SK is **broad and Claude-native**: 32 lifecycle commands, a structured docs system, 5 agents, and 11 skills. The four repos reviewed are mostly **narrow and deep**, and each is strong in an area where SK is thin or absent. None directly competes with SK's lifecycle/docs scope; all four are complementary mines for specific patterns.

The highest-leverage takeaways, in priority order:

1. **Adopt the model-invoked vs. user-invoked context-cost discipline** (mattpocock) — a structural improvement to *every* SK skill, near-zero cost.
2. **Add a "tracked-debt comment + harvester" command** (ponytail) — fills a genuine gap; clean, self-contained.
3. **Add governance/orchestration skills** (BuilderIO) — `plan-arbiter`, `agent-watchdog`, budget governance, autonomy contract.
4. **Externalize UI-review knowledge into a queryable data layer** (ui-ux-pro-max) — turns `/sk:ui-review` from a static checklist into a per-product-type design corpus.
5. **Harden craft conventions** — finding-vocabulary discipline, "build the feedback loop first" debugging, the no-op test for trimming skill files.

---

## Per-Repo Findings

### 1. BuilderIO/skills — orchestration & governance

11 skills, zero lifecycle commands. Cross-agent (Claude + Codex from one source). Strongest in **judgment/orchestration** skills SK lacks:

| Skill | What it does | SK gap |
|---|---|---|
| `/plan-arbiter` | Resolves two competing plans into one via ranked tiebreaker (correctness → grounding → simplicity → validation → cost) | SK has reviewers, no "two plans enter, one leaves" arbiter |
| `/agent-watchdog` | Reconstructs original contract, audits actual diffs/tests/CI against it | SK's `verification-before-completion` doesn't cover cross-agent scope-creep auditing |
| `/efficient-fable` + `/efficient-frontier` | Cost-tiered orchestration: expensive model judges, cheap subagents do grunt work, **treat subagent reports as leads not facts** | SK's `subagent-driven-development` is similar but doesn't frame around model-cost tiering or mandate re-verification of subagent claims |
| `/stay-within-limits` | Budget governor: bounded waves (~3 subagents), pause at 95% of quota, emit self-contained resume prompt | Nothing in SK addresses quota exhaustion during long runs |
| `/plow-ahead` | Autonomy contract: proceed through minor ambiguity with stated assumptions, stop only on real blockers, keep a decision log | SK's `escalation-rules` is the inverse (when to *stop*); no "keep going" contract |
| `/read-the-damn-docs` | Docs-first with **mandatory citation** of official docs consulted | SK has no docs-first-with-citation discipline |
| `/quick-recap` | 🟢/🟡/🔴 one-line status block ending every response | No glanceable completion-state convention (note: would need ASCII variants per this project's Windows-Unicode rule) |

**Structural pattern worth stealing:** progressive disclosure via `references/` — `SKILL.md` stays short, heavy material loaded on demand. SK already does this in `legal-advisor`, `copywriting`, and `technical-diagrams`; could extend to other large skills.

### 2. nextlevelbuilder/ui-ux-pro-max-skill — data-driven design intelligence

A **CSV-data-driven** design skill: the model queries large curated lookup tables instead of reading one long prose checklist. Headline scale: 161 product categories, 161 pre-WCAG-validated color palettes, ~71 styles, 99 UX guidelines (each with paired good/bad code snippets), 34 landing patterns, 15 tech stacks.

Key architectural ideas vs SK's `/sk:ui-review` (currently a static markdown checklist):

- **Externalized knowledge layer** — model gets *just* the matched rows for the current product, keeping the prompt small while the corpus stays huge.
- **Product-type → full design-token set** with contrast already fixed at authoring time.
- **JSON conditional decision-rules** per category (`if_data_heavy → add-glassmorphism`, `must_have: case-studies`).
- **Category-specific anti-patterns with severity** ("B2B → no AI purple/pink gradients", rated HIGH/MEDIUM).
- **Paired good/bad code examples** on every UX rule.
- **MASTER + page-override persistence** — durable `design-system/MASTER.md` plus per-page overrides as project memory.

Caveat: it's **generation-first** (produce a design system), keyword/scoring-matched, no live visual QA. SK's `/sk:ui-review` is **critique-first**. They're complementary — borrow the *data corpus* idea, keep SK's review framing.

### 3. mattpocock/skills — engineering craft + authoring discipline

Mature infrastructure (changesets, ADRs, `.out-of-scope/`, deprecated-but-retained skills). Targets specific **failure modes** of AI development. Most transferable ideas:

- **Model-invoked vs. user-invoked as an explicit context-cost decision** — `disable-model-invocation: true` for skills that only ever fire by hand, so they pay zero standing context tax. This is a discipline SK currently lacks (all SK skills carry trigger-rich descriptions loaded every turn).
- **`grilling` as a composable alignment primitive** — one skill that interviews the user one question at a time (with a recommended answer each time), composed into higher-level skills. SK has no pre-build interrogation skill.
- **"Build the feedback loop first" debugging** — `diagnosing-bugs` *halts* if no tight pass/fail loop can be built; demands 3–5 ranked falsifiable hypotheses before instrumenting; tags debug logs `[DEBUG-a4f2]` for clean removal. More rigorous than SK's `/sk:debug` (which is good but doesn't gate on feedback-loop existence).
- **`writing-great-skills` meta-craft** — the **no-op test** (run each sentence in isolation; if it doesn't change agent behavior, delete the whole sentence), **leading words** (front-load a semantic anchor), named failure modes (premature completion, duplication, sediment, sprawl, no-ops). Directly useful for trimming SK's own skill files.
- **`handoff`** — compact conversation into a handoff doc in the OS temp dir, reference artifacts by path not duplication, redact secrets. SK has `/sk:resume` but no explicit cross-agent handoff doc.
- **`codebase-design` "deep modules"** — precise vocabulary (module, interface, depth, seam) + the deletion test as a repeatable heuristic.

### 4. DietrichGebert/ponytail — anti-over-engineering overlay

A narrow behavioral skill enforcing "write the laziest code that works" via a 6-step decision ladder (YAGNI → stdlib → native → existing dep → one-liner → minimal code), with explicit non-negotiables (validation, security, a11y never simplified away). Best ideas:

- **Tracked-debt comment + harvester** — `// ponytail: <ceiling>, <upgrade path>` markers + a `/ponytail-debt` command that harvests them into a ledger and flags entries with no upgrade path. Turns "I took a shortcut" into a grep-able, auditable record. **SK has no equivalent.**
- **Intellectual-honesty guardrails** — `ponytail-gain` *refuses* to print fabricated savings numbers because there's no baseline. Encoding "don't fabricate metrics" as a skill boundary is rare and worth copying for SK's `/sk:retro` and changelog.
- **Fixed tiny finding-vocabulary + mandatory net-lines footer** — five tags, every report ends with `net: -N lines possible`. Makes review output scannable and comparable.
- **Diff-scope vs repo-scope as two separate skills** (review vs audit) — clean triggers, bounded cost.
- **Compaction-survival via SessionStart hook** — re-injects active mode after every compaction/resume. Relevant to how SK maintains `docs/tasks/.current` context.
- **Self-testing LLM judge** — the benchmark judge must pass a calibration self-test (rank known-bad above known-good) before it's allowed to score. Strong anti-bias pattern for any LLM-as-judge work.

---

## Deep-Dive: `visual-plan` / `visual-recap` (BuilderIO) — and a markdown-native SK adaptation

BuilderIO's two flagship skills are a **before/after review-gate pair**: `visual-plan` renders a text plan as a rich interactive artifact (wireframes, diagrams, file-change map, annotated code, Open Questions) for human sign-off *before* implementation; `visual-recap` renders a finished diff as a structured visual summary for review *after*. They warrant their own section because the idea is high-value but the implementation is commercially locked — so the question is precisely *which parts SK can adopt*.

### The portability boundary (the critical finding)

The rich rendering is a **proprietary hosted service** (`@agent-native/core` Plan MCP + renderer at `plan.agent-native.com`). The SKILL.md files are mostly routing logic that call hosted `create-*`/`update-*`/`get-plan-feedback` tools. Crucially, **even the "local-files mode" is not renderer-free** — `plan local serve` still pipes the MDX through Builder's Plan UI from a localhost bridge. There is no point at which the rich artifact renders without their renderer. So SK cannot fork this; it can only re-implement the *ideas* against plain Markdown.

**Locked to the hosted product (do NOT attempt to replicate):**
- Interactive canvas (`<DesignBoard>/<Artboard>/<Connector>`), prototype tabs, inline comment threads.
- The coordinate-anchored feedback loop (`targetX/targetY/canvasX/canvasY` → `get-plan-feedback` → surgical `contentPatches`). The coordinates are *produced by their comment UI* — unreplicable without building one.

**Fully portable as pure instruction + plain markdown (~70% of the value, zero-dep):**
1. **Adversarial self-review pass** — for high-stakes plans (architecture, backend, data-model, migration, multi-file), run one skeptical pass checking four failure classes, verbatim: *hard-to-reverse decisions made implicitly* (wire format, public IDs, data-model shape, auth, ownership); *steps not anchored in real files/symbols*; *a menu of options where the plan should commit to one*; *obvious missing decisions*.
2. **Open Questions discipline** — unresolved decisions live **only** in a final block, never duplicated elsewhere, each with a marked recommendation.
3. **Read-only-until-approved gate** — no source edits while building/reviewing the plan; editing begins only after the user approves the direction.
4. **Document-quality bar** — outcome-first, prose-first, self-contained (no "as discussed above"), names *real* files/symbols rather than inventing them.
5. **Recap skeleton + budgets** — wireframe of UI impact → narrative (1–3 paras) → data-model/API blocks → file-tree of changed files → `## Key changes` as **3–8 diff tabs, <150 lines each**; data *"never inferred, rounded, or invented"* — derived mechanically from the diff.

### Mapping to SK (markdown-native, zero-dep)

SK already has the bones: `/sk:plan` (PLAN phase + task PRD), the `spec-reviewer` agent, `technical-diagrams` (Mermaid/SVG), and the docs/templates system. The missing loop is **gate → adversarial-check → open-questions**, plus a post-implementation recap artifact.

| BuilderIO mechanism | SK adaptation (zero-dep) |
|---|---|
| Visual plan artifact (hosted MDX) | Enrich `/sk:plan` output: file-change table + Mermaid diagram (via `technical-diagrams`) + annotated snippets in plain markdown |
| Adversarial self-review pass | New pre-exit-gate step in `/sk:plan`, dispatched to the `spec-reviewer` agent, running the four-failure-class check before the plan is final |
| Open Questions form | A required `## Open Questions` section with marked recommendations — formalize what's currently implicit |
| Read-only-until-approved gate | Make explicit in `/sk:plan`: no source edits until the plan is approved |
| `visual-recap` | **New `/sk:recap` command** — the missing post-implementation review artifact |
| Canvas / coordinate feedback | **Drop** — commercial renderer, not replicable |

### Two concrete recommendations (cross-referenced in the table below as R13–R14)

**R13. Add an adversarial self-review pass to `/sk:plan`.**
- **What:** Before the PLAN exit gate, dispatch the existing `spec-reviewer` agent to attack the plan against the four `visual-plan` failure classes — implicit hard-to-reverse decisions (wire format, public IDs, data-model shape, auth, ownership), steps not anchored in real files/symbols, a menu of options where the plan should commit to one, and obvious missing decisions. Route every unresolved judgment call into a required `## Open Questions` block with a recommended answer rather than silently guessing, and make "read-only until the plan is approved" an explicit rule.
- **Why it helps:** SK's `/sk:plan` produces a task PRD but never *attacks its own plan* before handing it over — so weak architectural decisions survive into the DEV phase, where they're far more expensive to unwind ("expensive to undo once data or callers depend on them"). A cheap skeptical pass at plan time is the highest-leverage moment to catch them. It's pure instruction (no dependency), reuses an agent SK already ships, and the Open-Questions discipline converts silent assumptions into explicit, reviewable decisions. This is the single highest-value idea in the `visual-plan`/`visual-recap` pair.
- *Files:* `pkg/.claude/commands/sk/plan.md`, `pkg/.claude/agents/spec-reviewer.md` (+ root mirror). *Effort:* S.

**R14. Add a `/sk:recap` command (markdown-native visual-recap).**
- **What:** A post-implementation command that turns a completed diff into a structured review artifact in plain markdown: a UI-impact note (when rendered UI changed) → outcome narrative (1–3 paragraphs, what changed and why) → data-model/API deltas → a file tree of changed files → `## Key changes` rendered as 3–8 fenced ` ```diff ` tabs (under ~150 lines each). All data derived mechanically from `git diff` — never inferred or invented. Persist to `docs/reviews/` like SK's other review reports.
- **Why it helps:** SK has `/sk:changelog` (user-facing release notes) and `/sk:retro` (lessons learned) but nothing that produces a *reviewer-facing "here's what changed and why" artifact* from a diff — the exact thing needed between "implementation done" and "PR review." A structured recap lets a human (or a fresh agent) grok a change without reading raw diffs, with hard budgets (3–8 tabs, <150 lines) that force it to stay a summary rather than a dump. It captures the most portable, zero-dep half of `visual-recap` and fills a real hole in SK's lifecycle without overlapping the two commands it sits between.
- *New files:* `pkg/.claude/commands/sk/recap.md` (+ root mirror). *Effort:* S–M.

---

## Gap Analysis vs SK

| Capability | SK today | External exemplar | Gap |
|---|---|---|---|
| Context-cost discipline on skills | All skills model-invokable, always loaded | mattpocock `disable-model-invocation` | **Yes** — silent context tax |
| Tracked tech-debt / shortcut ledger | None | ponytail debt harvester | **Yes** |
| Pre-build interrogation / alignment | Implicit in `/sk:plan` | mattpocock `grilling` | Partial |
| Multi-plan arbitration | None | BuilderIO `plan-arbiter` | **Yes** |
| Cross-agent contract auditing | `verification-before-completion` | BuilderIO `agent-watchdog` | Partial |
| Budget/quota governance in long runs | None | BuilderIO `stay-within-limits` | **Yes** |
| Autonomy "keep going" contract | `escalation-rules` (inverse only) | BuilderIO `plow-ahead` | **Yes** |
| Docs-first with citation | None | BuilderIO `read-the-damn-docs` | **Yes** |
| Feedback-loop-first debugging | `/sk:debug` (no gate) | mattpocock `diagnosing-bugs` | Partial |
| UI-review knowledge as data | Static markdown checklist | ui-ux-pro-max CSV corpus | **Yes** |
| Anti-over-engineering lens | `coding-behavior.md` principle 3 + code-review 4f | ponytail decision ladder | Partial |
| Skill-authoring craft guide | None | mattpocock `writing-great-skills` | **Yes** (internal value) |
| Adversarial plan-review gate | `/sk:plan` (no self-attack pass) | BuilderIO `visual-plan` | **Yes** (R13) |
| Post-implementation recap artifact | `/sk:changelog`, `/sk:retro` (neither is a diff recap) | BuilderIO `visual-recap` | **Yes** (R14) |

---

## Recommendations (Prioritized)

### Tier 1 — Quick wins (high value, low effort, self-contained)

**R1. Add the model-invoked / user-invoked discipline to all skills.**
- **What:** Every Claude Code skill's `description` is loaded into context on *every turn* so the model can decide whether to auto-fire it. Audit SK's 11 skills and split them: skills the model should reach for autonomously (e.g. `test-driven-development`, `escalation-rules`, `verification-before-completion`) keep their trigger-rich descriptions; skills that only ever fire by hand (e.g. `legal-advisor`, `copywriting`, `context-priming`) get `disable-model-invocation: true` and have their description trimmed to a plain one-line summary.
- **Why it helps:** Trigger-rich descriptions are a *standing context tax* — they cost tokens on every single turn whether or not the skill is ever used. SK ships 11 skills, all currently model-invokable with verbose "Use when…" descriptions; trimming the hand-only ones reclaims context budget every session, on every project that installs SK. It also makes invocation more reliable: fewer competing trigger descriptions means the model picks the right skill more often. This is the single cheapest systemic improvement available.
- *Files:* every `pkg/.claude/skills/*/SKILL.md` (+ root mirror). Document the rule in `CLAUDE.md`. *Effort:* S.

**R2. Add a tech-debt marker + harvester command (`/sk:debt`).**
- **What:** Define a structured shortcut comment — `// sk-debt: <ceiling>, <upgrade trigger>` (e.g. `// sk-debt: hardcoded to USD, generalize when we add a second currency`). Add a `/sk:debt` command that greps the codebase for these markers, produces a ranked ledger (by age, file, or severity), and flags any marker missing an upgrade trigger as `no-trigger` (debt with no exit plan). Optionally persists to `docs/debt-ledger.md`.
- **Why it helps:** SK enforces "do exactly what was asked / keep it simple" (coding-behavior principles 2–3), which inevitably produces *deliberate* shortcuts — but today those shortcuts are invisible the moment the session ends ("later means never"). A grep-able marker plus a harvest command turns intentional debt into an auditable, reviewable list instead of silent rot. It pairs directly with `/sk:refactor` (the ledger becomes the refactor backlog) and gives `/sk:retro` real data to report. No equivalent exists in SK today.
- *New files:* `pkg/.claude/commands/sk/debt.md` (+ root mirror). Document the marker convention in `coding-behavior.md`. *Effort:* S.

**R3. Add a quantified finding-footer convention to review commands.**
- **What:** End every review command (`/sk:code-review`, `/sk:ui-review`, `/sk:perf-review`, `/sk:security-review`) with a single mandatory summary line carrying a comparable number — e.g. `Found: 2 critical, 5 warning, 3 suggestion` or `Clean — ship`. Borrow ponytail's "always close with a quantified delta" discipline.
- **Why it helps:** SK's review commands already produce well-structured tables, but a reader has to scan the whole report to gauge severity. A forced one-line footer makes the verdict glanceable, makes two reviews of the same code *comparable* (did the second pass actually reduce findings?), and gives downstream automation (CI gates, `/sk:ship`) a single line to parse for a pass/fail signal. Trivial to add, improves every review's legibility.
- *Files:* the four review commands (+ root mirror). *Effort:* XS.

**R4. Add an honesty guardrail to `/sk:retro` and `/sk:changelog`.**
- **What:** Add an explicit boundary to both commands: never state a metric (velocity, time saved, % faster, coverage delta, lines removed) unless it's backed by a real measured baseline. If there's no baseline, either cite the source or omit the number — never estimate-and-present-as-fact. Inspired by ponytail's `ponytail-gain` skill, which *refuses* to print savings numbers because "the unbuilt version was never written, so there's no baseline."
- **Why it helps:** Retrospective and changelog commands are exactly where an LLM is tempted to invent plausible-sounding numbers ("improved performance by ~30%") that have no measurement behind them — which quietly erodes trust in every SK report. Encoding "don't fabricate metrics" as a hard rule keeps SK's generated artifacts credible and is a differentiator for a serious-engineering toolkit.
- *Files:* `retro.md`, `changelog.md` (+ root mirror). *Effort:* XS.

### Tier 2 — New skills/commands (high value, moderate effort)

**R5. Add `plan-arbiter` capability.**
- **What:** A mechanism that takes *two or more competing plans* (e.g. SK's `/sk:plan` output vs. a `/sk:council` recommendation vs. a Codex second opinion) and resolves them into one executable direction via a **ranked tiebreaker** — correctness → grounding in real code → simplicity → validation robustness → execution cost — rather than averaging them into a mushy blend. Could ship as a new skill or a final "arbitration" mode of `/sk:council`.
- **Why it helps:** SK's `/sk:council` already generates multi-persona debate, but it stops at *surfacing* perspectives — the human is left to reconcile them. Real decision-making needs a "two plans enter, one leaves" step with explicit, ordered criteria, so the choice is principled and reproducible rather than vibes-based. Blending competing plans usually produces the worst of both (incoherent architecture); a ranked tiebreaker preserves the integrity of the winning approach while consciously grafting the best ideas from the runner-up.
- *Files:* new skill or a mode in `pkg/.claude/commands/sk/council.md` (+ root mirror). *Effort:* M.

**R6. Add `agent-watchdog` capability to `verification-before-completion`.**
- **What:** Extend the skill so that before declaring "done" it first *reconstructs the original contract* — the user's actual request, stated constraints, and acceptance criteria — and then audits the **evidence** (the diff, test output, CI status, screenshots) against that contract item-by-item. Treat the user's intent as ground truth, not the agent's own summary of what it did.
- **Why it helps:** SK's current `verification-before-completion` checks "did the tests pass" but not "did we build the thing that was asked for, and *only* that." The most common silent failure in agentic coding is scope drift — the agent solves a subtly different problem, adds unrequested features, or drops a requirement, then reports success because its tests (which it also wrote) pass. Auditing real evidence against the reconstructed original ask catches scope creep and unfulfilled requirements that a tests-pass check structurally cannot.
- *Files:* `pkg/.claude/skills/verification-before-completion/SKILL.md` (+ root mirror). *Effort:* S–M.

**R7. Add a budget-governance skill (`stay-within-limits`).**
- **What:** A governor for long/parallel runs: cap subagent fan-out into bounded waves (~3 at a time), check usage between waves, pause before hitting quota limits, and on pause emit a **self-contained resume prompt** that restates the remaining plan so a fresh session can pick up cleanly. Wire it into `/sk:orchestrate` and `subagent-driven-development`.
- **Why it helps:** SK's `/sk:orchestrate` and subagent flows can spin up many parallel agents — which is exactly where a long autonomous run silently burns through a usage window and dies mid-task with no clean handoff, losing work and context. Bounded waves + usage checks + a resume prompt make long runs survivable and restartable instead of fragile. This directly hardens SK's most resource-intensive existing feature.
- *Files:* new skill referenced from `orchestrate.md` and `subagent-driven-development/SKILL.md` (+ root mirror). *Effort:* M.

**R8. Add an autonomy-contract skill (`plow-ahead`) as the complement to `escalation-rules`.**
- **What:** A skill that grants the agent explicit permission to *proceed through minor ambiguity* by stating an assumption and continuing — stopping only for genuine blockers (missing credentials, destructive/irreversible operations, security decisions, or choices the user reserved) — while keeping a running decision log and ending with a recap of every assumption made.
- **Why it helps:** SK has `escalation-rules` (when to *stop and ask*) but no codified counterpart for *when to keep going*. Without it, agents either over-ask (interrupting the user for trivial choices, killing flow) or over-assume (silently making consequential decisions). An explicit autonomy contract with a mandatory decision log gives the user "don't keep asking me" *with accountability* — they can review every assumption afterward. Together with `escalation-rules` it gives SK both poles of the stop/go decision.
- *Files:* new skill (+ root mirror); cross-reference from `escalation-rules`. *Effort:* S–M.

**R9. Strengthen `/sk:debug` with feedback-loop-first gating.**
- **What:** Add mattpocock's `diagnosing-bugs` doctrine to SK's already-solid debug flow: before investigating, require a tight pass/fail reproduction loop — and if one genuinely can't be built, *halt and request access/artifacts* rather than guessing. Add a requirement to state 3–5 ranked, falsifiable hypotheses before instrumenting, and adopt a `[DEBUG-xxxx]` unique-prefix convention for debug logs so they're trivially grep-able and removable afterward.
- **Why it helps:** SK's `/sk:debug` already has reproduce/isolate/hypothesis steps, but it doesn't *gate* on the feedback loop — so an agent can slide into speculative "try a fix and see" debugging when it can't actually observe the failure. "Build the right feedback loop, and the bug is 90% fixed": forcing the loop to exist first prevents the most common debugging time-sink. Ranked falsifiable hypotheses stop premature commitment to the first guess, and tagged debug logs prevent instrumentation from being left behind in the codebase.
- *Files:* `pkg/.claude/commands/sk/debug.md` (+ root mirror). *Effort:* S.

### Tier 3 — Bigger bets (high value, higher effort)

**R10. Externalize `/sk:ui-review` knowledge into a data layer.**
- **What:** Move `/sk:ui-review`'s knowledge out of one long inline checklist into queryable `references/` data files: category-specific anti-patterns with severity, paired good/bad code snippets per WCAG rule, and a product-type → design-token/palette mapping (with contrast pre-validated). The command loads only the rows relevant to the current product/component. Optionally add a persistent `docs/design/DESIGN.md` master the review reads from. Modeled on `ui-ux-pro-max`'s CSV corpus — but shipped as markdown tables, not a Python search engine.
- **Why it helps:** A static checklist is the same length and depth for every project and can't grow without bloating the prompt. A data layer lets the corpus be large (hundreds of product-specific rules) while the prompt stays small (only matched rows load), and it lets the review ask a *new class* of question — "does this match the canonical palette/style for a B2B SaaS?" — instead of only generic "is contrast ≥ 4.5:1?". Paired good/bad snippets also ground every finding in a concrete before/after fix rather than abstract advice. Keep SK's critique-first framing; borrow the corpus, not the generation-first model.
- *Files:* `pkg/.claude/commands/sk/ui-review.md` + new `references/` (+ root mirror). *Effort:* L (curation-heavy).

**R11. Add an anti-over-engineering lens (ponytail-style decision ladder).**
- **What:** Encode an explicit simplicity ladder — does it need to exist (YAGNI)? → stdlib? → native platform feature? → an already-installed dependency? → a one-liner? → minimal code — with a hard carve-out that the non-negotiables (input validation, error handling, security, accessibility, anything explicitly requested) are *never* simplified away. Ship either as a standalone skill or as a strengthening of `coding-behavior.md` principle 3 and `/sk:code-review` section 4f.
- **Why it helps:** SK already *states* "keep it simple" as a principle, but a principle without a procedure is easy to skip. A concrete ladder the agent walks before writing code converts the value into a repeatable check, and the explicit non-negotiables prevent the lazy-code lens from cutting corners that matter (the classic failure of naive "minimal code" prompting). This sharpens SK's existing simplicity stance from aspiration into mechanism.
- *Files:* new skill or edits to `coding-behavior.md` + `code-review.md` (+ root mirror). *Effort:* M.

**R12. Write an internal skill-authoring guide (not shipped).**
- **What:** Capture mattpocock's skill-craft discipline as SK's own contributor doc: the **no-op test** (run each sentence in isolation — if it doesn't change agent behavior, delete the whole sentence), the **leading-words** rule (front-load a semantic anchor the model already understands), and the named failure modes to audit against (premature completion, duplication, sediment/stale layers, sprawl, no-ops). Then use it to audit and trim SK's existing skills and commands.
- **Why it helps:** SK ships 32 commands + 11 skills + 5 agents and will keep growing; without an authoring standard, files accrete redundant and no-op instructions ("sediment") that cost context and dilute the signal the model actually acts on. A craft guide gives every future SK file a consistent quality bar and a concrete trimming procedure — improving not one feature but the authoring of all of them. Lives in SK's own `docs/`, not `pkg/` (it's for SK contributors, not end users).
- *Files:* `docs/skill-authoring-guide.md` (SK's own docs, not shipped). *Effort:* S–M.

---

## What NOT to adopt

- **Hosted/commercial plan-rendering** (BuilderIO `visual-plan`/`visual-recap` interactive canvas + coordinate-anchored comment-to-patch loop) — conflicts with SK's fully-open, zero-dep ethos and is unreplicable without building a renderer. Adopt the *discipline* (R13/R14), not the renderer.
- **Generation-first design-system output** (ui-ux-pro-max) — SK's review commands are critique-first by design; don't invert them.
- **Full multi-host fan-out** (ponytail's 14-agent adapter build) — SK is deliberately Claude-native; cross-agent packaging is a large bet with unclear demand. Revisit only if Codex/Cursor parity becomes a goal.
- **Unicode status emojis** (BuilderIO `/quick-recap`) — would violate this project's Windows-Unicode rule; use ASCII `[OK]/[WARN]/[BLOCKED]` if adopting the status-line idea.

---

## Suggested Sequencing

1. **Sprint 1 (XS–S):** R1, R3, R4, R9, R13 — pure edits to existing files (incl. the adversarial pass in `/sk:plan`), immediate quality lift.
2. **Sprint 2 (S–M):** R2 (`/sk:debt`), R6, R8, R14 (`/sk:recap`) — new self-contained capabilities.
3. **Sprint 3 (M–L):** R5, R7, R10, R11 — deeper additions tied to orchestration and review.
4. **Ongoing:** R12 authoring guide, applied as skills are touched.

> R13 (adversarial plan-review pass) is the single highest-value item from the `visual-plan`/`visual-recap` pair — pure instruction, no dependency, fits the existing `spec-reviewer` agent.

Remember the **pkg/ ⇄ root .claude/ sync rule** (per `CLAUDE.md`): every command/skill/agent change must land in both trees.
