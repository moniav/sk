# Changelog

## Unreleased

- **Executive team** — run the company with persistent 1:1 partners: `/sk:ceo`
  (strategy/goals; `grill` mode stress-tests you against your own docs and re-asks
  what you couldn't answer; `product` mode ends in proceed/park/kill verdicts),
  `/sk:cto` (reversibility-first tech direction; brownfield due-diligence sweep),
  `/sk:cmo` (brand voice is law; publishes nothing), `/sk:coo` ("runs the same on a
  day nobody is watching"), and `/sk:founder` — the Monday packet as an approval
  console with decisions ranked one-way-doors-first (the only path delegation-policy
  edits happen). Shared `executive-meeting` skill: office memory (`STATE.md` rewritten
  every meeting + capped notes), founding/due-diligence modes, dissent duty with
  recorded disagreements, citation discipline, asks ledger, headless weekly briefs.
  Per-seat decision rights in the delegation policy; `executive-charter` template for
  custom seats; `metrics.md` dictionary template (numbers need definitions + sources);
  kickoff/init-docs offer the team on-ramp; `/sk:resume` points at unread packets.
  The founder is never gated — direct work is always allowed and observed, not
  approved. Design + founder journeys: `dev-docs/planning/executive-team-design.md`.
- **Experimental Claude Code plugin channel** — SK installs natively via
  `/plugin marketplace add moniav/sk` → `/plugin install sk@shipkit`. The plugin is
  named `sk`, preserving every `/sk:*` invocation; `plugin.json` points at
  `pkg/.claude/*` directly (no build step); the repo is its own marketplace;
  commit-SHA versioning during the preview. The npm channel remains primary — the
  docs scaffold still requires `npx shipkit-cld`, and some in-command `.claude/`
  path references assume a project install (fix plan:
  `dev-docs/planning/plugin-split-plan.md`, decision: ADR-002). New user guide:
  `docs/user-guides/install-as-plugin.md`.

## 1.9.0 (2026-07-05)

Full-system hardening and leverage release, driven by a four-wave review of every
command, agent, skill, and the CLI (`dev-docs/reports/2026-07-05-full-system-review.md`).
Six new commands (42 → 48), four new skills (18 → 22), three new agents (5 → 8),
three new templates (19 → 22) — and the agents are now *real* Claude Code subagents.

### Features

- **Real subagents** — all agent definitions now carry YAML frontmatter (`name`, `description`, `tools`, `model`): they register natively, auto-delegate, and reviewers are tool-restricted to read-only (`Read`/`Grep`/`Glob`). The haiku/sonnet role split is enforced in the agent files.
- **New agents** — `debugger` (root-cause loop: reproduce → isolate → hypothesize → verify; reports the mechanism + minimal fix, cannot edit), `security-reviewer` and `perf-reviewer` (severity/impact-ranked findings, honest "clean" verdicts). `architecture-reviewer` now also runs as a conditional stage 3 in the dev review loop (SDD + orchestrate) for cross-module subtasks.
- **`/sk:review`** — the "before I ship" command: fans out security + perf + quality reviewers as parallel subagents over the branch diff, merges into one report with a SHIP / FIX_FIRST / BLOCK verdict.
- **`/sk:pr`** — standalone PR creation (gh preflight, auto-push, PR-template aware).
- **`/sk:release`** — version bump (semver inferred from conventional commits or passed explicitly), changelog prepend, tag, optional GitHub release, registry publish only on explicit confirmation.
- **Marketing engine** — a `brand-voice.md` template (tone by context, vocabulary, banned phrases, claims discipline) that **overrides the copywriting default** everywhere public words get written; a `campaign.md` template + **`/sk:campaign`** (plan/status/close — goal-linked objectives, asset checklists, results filled honestly at close with "we don't know" as a valid entry); **`/sk:announce`** turns a changelog entry into a tiered announcement pack (major/minor/patch → post/email/social) claiming only what shipped; `/sk:copywrite` gains a blog/long-form format with SEO structure; weekly social-pack and monthly newsletter rows join the routines table (drafts only — publishing is never autonomous).
- **Fleet coordination** — tasks/epics gain `claimed_by`/`claimed_at` frontmatter with a documented claim convention (claim before working, respect fresh claims, >24h-stale claims are takeover-eligible, release on done) so multiple agents can pull from one board without collision; dev/implement/orchestrate claim, test/finish release, resume/task-status surface claim state. Blank fields = single-agent, zero overhead.
- **Goals layer** — a `goals.md` template (via `/sk:new-business-doc` → `docs/business/goals.md`) defines goal IDs (`G{N}`) with outcomes, measures, and explicit anti-goals; epics link via a `goal:` frontmatter field (`/sk:new-epic` asks); `/sk:task-status` flags goal-orphaned epics and rolls up work per goal — so agents prioritize against strategy, not recency.
- **Decision journal** — `docs/decisions/decision-log.md`: append-only one-line journal for the small decisions agents make (ADRs stay for the big ones); headless runs append every policy-covered decision with session provenance; `/sk:retro` gains an agent-performance dimension (escalations, first-pass review rate, auto-passed vs asked gates) sourced only from countable artifacts, feeding widen/tighten recommendations for the delegation policy.
- **Autonomy layer** — a **delegation policy** (`docs/conventions/delegation-policy.md`, shipped as an editable conservative default) defines what agents may decide alone vs must escalate (decision-rights matrix, complexity ceiling, escalate-by-artifact rule); a **`headless-operation` skill** makes commands runnable unattended (no questions — resolve via policy or escalate via `blocked` board items and "Needs human review" report sections; output as dated report files; hard limits regardless of policy; provenance stamps); and **`/sk:routines`** sets up scheduled maintenance (nightly/weekly docs-audit, deps, debt, retro, security-review, per-PR review) targeting Claude Code scheduled agents, CI cron, or a documented runbook. The `git-commit-flow` skill consults the policy at its push/PR gates.
- **`research` skill** — canonical web-research procedure shared by kickoff, brainstorm, plan, migrate, deps, and debug: checks `docs/research/` for reusable prior findings first (freshness windows per fact type), honest depth tiers (Quick inline vs Deep parallel-subagent fan-out that keeps raw search noise out of the main context), a source hierarchy with a primary-source rule (versions/API facts must come from fetched official pages, never model memory), and cited findings. The research-doc template gains a **Sources** section (URL, accessed date, supports) + validity horizon. `/sk:migrate` now *must* fetch the official migration guide for the exact version jump; `/sk:debug` searches the exact error message when hypotheses run dry; `/sk:plan` gains an optional targeted-research step.
- **Doc-to-code freshness** — evergreen docs may declare the code they describe via `Source:` (feature docs' `Code:` / component docs' `Location:` count too); `/sk:docs-audit` flags **code-drift** when the code's last commit is newer than the doc, and `/sk:update-docs` uses drift as its priority queue.
- **Minimal install profile** — `npx shipkit-cld --minimal` lays down core doc homes only (system, conventions, tasks, templates, sop); the profile is manifest-tracked, updates respect it, and every doc-creator command grows its home on demand. `/sk:init-docs` asks full vs minimal.
- **Install manifest** — `.claude/.sk-manifest.json` records version, CLAUDE.md ownership, profile, and the exact files SK manages. Unlocks: updates prune files SK no longer ships, `remove` deletes only SK's files (user-added agents/skills survive), and version is shown on install/update.

### Improvements

- **Shared-skill dedupe** — new `git-commit-flow` and `subtask-execution` skills are the single source of truth for the commit flow and the DEV loop; `dev`, `implement`, `commit`, and `finish` defer to them instead of maintaining ~250 lines of parallel prose. Both are command-loaded (no per-turn context cost).
- **`.current` contract** — canonical format + create/update/delete lifecycle documented in `docs/tasks/README.md`; now written from the moment work is scoped (`new-task`, `new-epic`, `brainstorm`, `plan`), so `/sk:resume` sees freshly planned work.
- **Command frontmatter pass** — `argument-hint` on the 15 argument-taking commands, read-only `allowed-tools` pre-approval on the 9 analyzers, and `disable-model-invocation` on the 6 expensive/multi-agent flows (kickoff, init-docs, migrate, update, orchestrate, council).
- **Robustness preflight** — git-dependent commands degrade gracefully outside a repo; the base branch is detected (`git symbolic-ref`) instead of hardcoding `main`; monorepos prompt for a target package; `new-task`/`new-epic` create the task board if missing.
- **Task lifecycle states** — status enum gains `blocked` / `cancelled` / `abandoned`; `/sk:resume`, `/sk:task-status`, and `/sk:docs-audit` surface possibly-abandoned in-flight work. Board tables are now derived from frontmatter and regenerated wholesale by `/sk:task-status`.
- **Skill hygiene** — `legal-advisor` and `copywriting` are command-gated (no auto-fire, one-line descriptions); six core skills' descriptions trimmed 30–40% — a permanent per-turn context saving in every project.
- **Native-feature adoption** — structured choices go through AskUserQuestion; `plan` leans on plan mode for its read-only gate.

### Fixes

- **CLAUDE.md update dead-end** — a greenfield-installed CLAUDE.md now refreshes in place on update (ownership tracked in the manifest) and is removed on uninstall; previously the first update silently diverted all future updates to the `CLAUDE.sk.md` sidecar forever and `remove` orphaned the file.
- **Stale npx source** — updates no longer pin to a cached npx path; `@latest` actually updates to latest. `--from` paths are still remembered.
- **Re-install footgun** — running install over an existing installation redirects to update instead of displacing live docs into `docs/old/`.
- **Day-one audit false positives** — a fresh install's own scaffold is no longer flagged as "unstamped"/"unfilled stubs"; `/sk:init-docs` stamps dates on the indexes it creates.
- **`/sk:copywrite`** saves under `docs/business/copy/` (indexed) instead of the never-scaffolded `docs/marketing/`.
- Assorted: `code-review` section order, `init-docs` list numbering + duplicate `pom.xml`, GUIDE.md dead code removed from the CLI, partial-install residue on missing source, PowerShell date fallback in `docs-audit`.

### Docs

- README Mermaid diagrams replaced with pre-rendered SVGs (`assets/`) — npm can't render Mermaid.
- `package.json` repository/homepage/bugs/author filled in.
- Add `docs/decisions/ADR-002-plugin-distribution.md` (SK-internal: hybrid plugin + npx-init distribution; implementation planned in `dev-docs/planning/plugin-split-plan.md`).

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
