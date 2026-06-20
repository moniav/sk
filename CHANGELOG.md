# Changelog

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

- **Update propagation** — `npx shipkit-cld update` now refreshes `docs/reference/` and `docs/commands-reference.md` (SK-shipped reference content), so `/sk:ui-review`'s reference corpus and the command list reach updated projects, not just fresh installs. User content (tasks, conventions, system, architecture, decisions, flows) remains preserved.

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
