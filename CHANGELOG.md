# Changelog

## 1.8.0 (2026-06-27)

Documentation-system enhancement: coherence enforcement + a multi-audience doc surface
spanning engineering, end-user, business/GTM, legal, and operations. The shipped template
now scaffolds feature docs, end-user guides, a business home, a legal home, and an operations
home; tracks doc freshness; and can audit its own coherence. Eight new commands (34 → 42) and
five new skills (13 → 18).

### Features

- **Docs audit** — `/sk:docs-audit` reports doc coherence (orphans, staleness, broken links, out-of-lane docs) read-only by default, with `file:line` citations and a quantified-footer tally. Configurable staleness threshold (default 180 days); exempts `templates/`, `_archive/`, and placeholder links.
- **Feature docs** — `/sk:new-feature-doc` writes per-feature/subsystem docs into `docs/features/` from a new `feature-doc` template, verified against the code (no aspirational docs).
- **User guides** — `/sk:new-user-guide` writes customer-facing, task-oriented guides into `docs/user-guides/` from a new `user-guide` template, over the `technical-writing` skill with a customer audience; verifies each capability against the code (no unshipped features).
- **Doc lifecycle convention** — evergreen docs carry a `Lifecycle` field (`current`/`stale`/`deprecated`/`archived`) alongside `Last updated`, documented in `conventions/doc-lifecycle.md`. Named `Lifecycle` (not `status`) to avoid colliding with task/epic `status`, ADR `Status`, and review `status`.
- **Two front doors** — `/sk:init-docs` now scaffolds `docs/START-HERE.md` (role-based human router) alongside `docs/README.md` (agent index), plus domain homes `docs/features/`, `docs/user-guides/`, `docs/business/`, `docs/legal/`, `docs/operations/`, and `docs/_archive/`.
- **Legal home** — `docs/legal/` is now a first-class, scaffolded home (agreements/policies/scans). Fixes a latent gap: the `legal-advisor` skill / `/sk:legal-scan` already wrote there, but the doc system never created or indexed it, and the START-HERE legal lane pointed at `decisions/`.
- **Operations home + expert** — `docs/operations/` (runbooks, incidents, postmortems) for *running* software, not just building it, driven by a new **`operations-advisor`** skill behind **`/sk:ops`** (modes: `incident`, `postmortem`, `runbook`, `reliability`/`slo`, `readiness`, `scan`) — the SRE twin of `legal-advisor`/`legal-scan`. Ships a `postmortem` template; `/sk:debug` hands production incidents to it.
- **PDF export** — a `create-pdf` skill turns any Markdown/HTML doc into a clean, paginated PDF (margins, page numbers, TOC, optional cover + DRAFT watermark). Cross-platform with automatic engine detection (pandoc → weasyprint → wkhtmltopdf → headless Chrome/Edge) + a bundled print stylesheet. Fires on "make/export a PDF"; pairs with the business/legal/operations/user-guide homes.
- **`/sk:legal-scan` reframed** as the legal **expert** it already is (requirements, framework deep-dives, document drafting, contract review, entity guidance) — description sharpened, no behavior change.
- **GTM front doors** — `/sk:positioning`, `/sk:competitor`, and `/sk:pricing` wrap three new skills (`product-marketing-context`, `competitor-analysis`, `pricing-strategy`) and write to the single `docs/business/` home, each with a template (positioning, competitor-profile, pricing-strategy). Skills are user-invoked (no per-turn context cost).
- **Business docs** — `/sk:new-business-doc` creates structured business artifacts (business plan, financial-model summary, cap table, investor update, decision memo) from lean templates that link out to live sources rather than embedding numbers.

### Improvements

- **Lifecycle-aware maintenance** — `/sk:update-docs` gains `Features` and `User Guides` scope options and a lifecycle pass (bumps `Last updated`, downgrades drifted docs to `stale`, moves retired docs to `_archive/`). No separate user-help command — kept the menu lean.
- **CLAUDE.md is never overwritten** — install/update preserve an existing project `CLAUDE.md` and write the SK template alongside as `CLAUDE.sk.md` for manual merge; `remove` keeps a user-owned `CLAUDE.md`. Greenfield installs still create one. (Previously install/update force-overwrote it.)

### Docs

- Add `docs/decisions/ADR-001-doc-system-model.md` (SK-internal: the multi-audience doc model).
- Separate SK product-development docs into `dev-docs/` (planning/reports/guides); root `docs/` is now a clean dogfood instance. Documented the `docs/` vs `dev-docs/` split in `CLAUDE.md`.
- Update `Readme.md`, `commands-reference.md`, template list, and command count (34 → 37).

## 1.7.0 (2026-06-20)

Enhancements adapted from a review of four external Claude Code skill collections
(BuilderIO/skills, ui-ux-pro-max-skill, mattpocock/skills, ponytail). All 14
recommendations from `docs/enhancement-report-external-skills.md` implemented.

### Features

- **Recap command** — `/sk:recap` produces a reviewer-facing recap of a diff (narrative, schema/API deltas, file tree, 3–8 diff blocks) for the gap between "done" and PR review
- **Debt command** — `/sk:debt` harvests `// sk-debt: <ceiling>, <upgrade trigger>` markers into a ranked ledger, flagging debt with no exit plan
- **Plow-ahead skill** — an autonomy contract (proceed on minor ambiguity, stop on real blockers, log decisions); complement to `escalation-rules`
- **Stay-within-limits skill** — budget governance for long/parallel runs (bounded waves, usage checks, self-contained resume prompts); wired into `/sk:orchestrate`
- **Plan-arbiter mode** — `/sk:council` can now resolve competing plans via a ranked tiebreaker instead of blending them
- **UI design reference corpus** — `docs/reference/ui-design/{anti-patterns,visual-design}.md` plus an aesthetic / AI-slop audit step in `/sk:ui-review`

### Improvements

- **Adversarial plan review** — `/sk:plan` runs a self-review pass (four failure classes) before the exit gate; `spec-reviewer` gains a plan-review mode
- **Contract auditing** — `verification-before-completion` now audits the diff against the original ask (catches scope drift, not just failing tests)
- **Feedback-loop-first debugging** — `/sk:debug` gates on a repro loop, requires ranked falsifiable hypotheses, and uses `[DEBUG-xxxx]` tagged logs
- **Quantified review footers** — `code-review`, `ui-review`, `perf-review`, `security-review` end with a one-line tally
- **Honesty guardrails** — `retro` and `changelog` no longer fabricate unmeasured metrics
- **Simplicity ladder** — explicit YAGNI → stdlib → native → existing-dep ladder with non-negotiables carve-out in `coding-behavior.md`
- **Skill invocation discipline** — `context-priming` marked `disable-model-invocation`; classification rule documented in `CLAUDE.md`

### Fixes

- **Update propagation** — `npx shipkit-cld update` now refreshes all SK-shipped docs that previously went stale: `docs/reference/`, `docs/commands-reference.md`, `docs/README.md`, and `docs/conventions/coding-behavior.md`. The last is refreshed as an individual file so the user's own `code-style.md`/`testing.md` in the same directory are preserved. User content (tasks, conventions, system, architecture, decisions, flows) remains untouched.

### Docs

- Add `docs/enhancement-report-external-skills.md` (competitive analysis + recommendations)
- Add `docs/skill-authoring-guide.md` (internal authoring craft guide)
- Update `commands-reference.md`, `Readme.md`, and command count (32 → 34)

## 1.5.0 (2026-03-23)

### Features

- **Orchestrate command** — `/sk:orchestrate` for parallel agent team execution with dependency-aware Plan > Dev > Test (`f35b2eb`)
- **Council command** — `/sk:council` convenes multi-persona advisory debates and produces decision reports (`f35b2eb`)
- **Technical diagrams skill** — consistent SVG diagram generation for architecture and flow docs (`f35b2eb`)
- **Legal advisor skill** — umbrella skill for legal/compliance scanning with enhanced frontmatter (`07f3545`)
- **Legal scan command** — `/sk:legal-scan` for detecting regulatory requirements and generating legal documents (`d887936`)
- **Package separation** — self-contained `pkg/` directory, cleanly separated from project root (`78749a7`)

### Fixes

- Move commands, agents, and skills into `pkg/` for self-contained package (`9e70ba8`)
- Enforce `docs/legal/` output structure for legal-advisor (`b3a5dbe`)

### Docs

- Add Superpowers analysis and unified SK v2 system design (`427d383`)
- Update README for pkg/ separation, new features, and update flow (`482d467`)
- Add analysis reports and enable skill-creator plugin (`10f8bff`)

## 1.4.1 (2025-12-01)

- Previous release
