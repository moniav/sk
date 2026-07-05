# SK Full-System Review — Commands, Agents, Skills, CLI, Docs

**Date:** 2026-07-05
**Scope:** All 42 commands, 5 agents, 18 skills, cli.mjs, package.json, Readme.md, pkg/CLAUDE.md, pkg/docs/ tree
**Method:** 4 parallel deep-review agents (commands / agents+skills / CLI+packaging / doc system), findings verified against shipped files
**Goal:** Make SK the go-to system for starting new Claude Code projects

---

## Overall Verdict

SK is a mature, unusually coherent system. Strengths worth protecting:

- Consistent command structure ("Read Context" + skip-empty-template guard everywhere)
- Honesty guardrails (no invented metrics) across retro/perf/changelog/recap/debt
- The behavioral skill family (TDD, verification, plow-ahead, escalation, error-recovery, stay-within-limits) composes cleanly — orthogonal axes, correct cross-references
- Zero sync drift between root `.claude/` and `pkg/.claude/` (byte-identical)
- No broken cross-references anywhere (agents, skills, templates all resolve)
- pkg/docs ↔ dogfood docs structure matches 1:1
- Readme accuracy is high; packaging (`files`, `bin`, `engines`, zero-dep) is correct

The gaps cluster into: (1) agents aren't real Claude Code subagents, (2) update/uninstall lifecycle bugs in cli.mjs, (3) state (`.current`) managed by prose instead of enforced, (4) heavy prose duplication in the dev/commit cluster, (5) missed native features (AskUserQuestion, plan mode, parallel subagent fan-out), (6) day-one false positives in docs-audit.

---

## P0 — Bugs to fix before anything else

### 1. Agents have no YAML frontmatter (highest-leverage single fix)
All 5 files in `pkg/.claude/agents/` open with `# Agent: …` instead of frontmatter. They don't register as Claude Code subagents: no auto-delegation (no `description` trigger), no tool restriction, no per-agent `model`. They only work as prompt-template files read by the orchestrator.

**Fix:** Add `name` (must match file stem — `quality-reviewer`, not the H1 display name), `description`, `tools`, `model` to each:
- `implementer` — tools: full; model: sonnet
- `spec-reviewer` — tools: Read, Grep, Glob (read-only); model: haiku
- `quality-reviewer` — read-only; model: sonnet
- `architecture-reviewer` — read-only
- `dependency-analyzer` — read-only

Read-only matters: spec-reviewer's own rule ("examine ACTUAL code, do not trust the report") is undermined if it can Edit. The haiku/sonnet split in `subagent-driven-development/SKILL.md:53-57` currently has nothing to bind to.

### 2. cli.mjs: CLAUDE.md ownership dead-end (lines 49–57, 592, 659)
Greenfield install creates CLAUDE.md with no sidecar → first `update` sees CLAUDE.md exists → writes `CLAUDE.sk.md` sidecar instead → **the live CLAUDE.md never updates again**, and `remove` then treats it as user-owned and orphans it.

**Fix:** Track ownership explicitly (manifest flag or hash), not by sidecar absence.

### 3. cli.mjs: no version manifest → no pruning, no migrations
- `update` is overlay-only (`cpSync force:true`, lines 453–538) — renamed/removed commands linger forever as ghost `/sk:*` entries (no delete pass).
- `.sk-source` persists the ephemeral npx cache path (lines 93, 101–105, 240) — later `update` may reuse a stale cached version instead of `@latest`.
- No record of installed version anywhere; no changelog surfaced on update.

**Fix:** Write `.claude/.sk-version` (version + file inventory) on install/update. Diff inventory on update to prune orphans. Don't persist `__dirname` as source for npm installs — only save explicit `--from` paths.

### 4. cli.mjs: `install` is not idempotent (lines 176–195)
Re-running `install` (easy mistake instead of `update`) shoves ALL live docs — tasks, ADRs, architecture — into `docs/old/<timestamp>/` and re-lays blank templates. `.current` is orphaned.

**Fix:** Detect existing install → redirect to `update` or refuse with a clear message.

### 5. docs-audit false positives on day one
- `docs-audit.md` §2b flags evergreen docs missing `Lifecycle` as "unstamped," but the shipped indexes for architecture/system/conventions/flows/decisions carry no `Lifecycle` field (only `features/README.md` does). `doc-lifecycle.md:12-15` says they merely "may adopt" it. A fresh install's first audit flags ~6 of its own untouched scaffold files.
- Shipped indexes carry literal `Last updated: YYYY-MM-DD`, which audit Step 1 counts as "unfilled stubs" — dozens of false stubs on first run.

**Fix:** Reconcile audit spec with doc-lifecycle spec; have `/sk:init-docs` stamp today's date on scaffolded indexes.

### 6. `docs/marketing/` is a dangling write target
`copywrite.md:75` saves to `docs/marketing/{…}` — never scaffolded by `init-docs.md` (lines 151–155), not in `update-docs.md` scope, and flagged out-of-lane by `docs-audit.md:66`.

**Fix:** Either scaffold + exempt `marketing/`, or redirect copy output under `docs/business/`.

### 7. Smaller concrete bugs
- `init-docs.md:189-206` — broken list numbering (duplicates 20/21, section 3f restarts at 17)
- `code-review.md:82-101` — subsections ordered 4a-4d, 4f, then 4e
- `init-docs.md:20` — `pom.xml` listed twice
- `security-review.md:15` / `legal-scan.md:51` reference `docs/system/env-variables.md`, which init-docs never generates (conditional, so soft)
- `ui-review.md:16` references `docs/design/DESIGN.md` — same soft issue
- cli.mjs GUIDE.md dead code (lines 275–277, 515–517, 582, 616, 671–675) — file doesn't exist, never ships
- cli.mjs partial-install residue: dirs created (219–224) before source validated (228) — empty skeleton left on failure with no rollback
- cli.mjs hardcoded `dirs` list (201–217) stale vs actual pkg/docs (missing reference/, research/, reviews/)
- cli.mjs summary fileCount (332–333) counts `docs/old/` backups
- package.json: `author`, `repository.url`, `homepage`, `bugs` empty — bare npm page, no repo link
- `resume.md:11-40` says "run in parallel" but 1a gates sequentially on `.current` — wording conflict

---

## P1 — Strategic enhancements (what makes SK a go-to)

### 8. Make `.current` / task state a contract, not prose
`.current` is written/deleted by prose in dev/implement/test/finish/orchestrate but never touched by plan/new-task/new-epic/brainstorm — so `/sk:resume` (which leads on it, `resume.md:16`) is blind to freshly planned work. No template ships `.current`; its format exists only in prose across 11 commands.

**Fix:** (a) define a `.current` schema/template, (b) standardize updates across every lifecycle command, and ideally (c) move bookkeeping to a `PostToolUse`/`Stop` hook so state stays correct regardless of which command ran. Biggest reliability gap for daily-driver use.

### 9. Factor duplicated DEV/commit prose into shared skills
`implement.md:68-150` re-implements `dev.md:52-166` + `test.md`; `finish.md:48-61` re-implements `commit.md:39-104`. Hundreds of near-identical lines maintained in parallel — guaranteed drift. Extract `execute-subtasks`, `dev-exit-gate`, `git-commit-flow` skills that dev/implement/orchestrate/finish/commit all load.

### 10. Doc-to-code freshness (the differentiator vs "ad-hoc markdown")
Staleness is time-only today (180-day rule). Add optional `Source:` frontmatter listing code paths a doc describes so `/sk:docs-audit` and `/sk:update-docs` can flag a doc stale when its underlying code changed (git log/mtime), not just after 6 months. This is the feature that makes the doc system demonstrably better than CLAUDE.md + ad-hoc markdown.

### 11. Frontmatter pass over all 42 commands
- No command has `argument-hint` — ops/legal-scan/copywrite take real `$ARGUMENTS` menus that are invisible in the slash UI.
- No command sets `allowed-tools` — read-only analyzers (code-review, security-review, perf-review, ui-review, deps, docs-audit, task-status, recap, debt) should be scoped to Read/Grep/Glob/Bash(git…) to enforce their own "read-only" claims.
- No command sets `disable-model-invocation` — all 42 are auto-invocable by the model; heavyweight interactive flows (kickoff, new-epic, orchestrate, legal-scan) can auto-fire mid-conversation. Gate them deliberately.

### 12. Use native Claude Code features instead of re-deriving them
- **AskUserQuestion** for structured choice menus: kickoff rounds (24–55), implement scope (22–30), new-flow format, update-docs scope, commit staging, council composition.
- **Plan mode** instead of prose "stay read-only until approved" (`plan.md:121`, refactor, implement checkpoints) — let the harness enforce the gate.
- **Parallel context reads**: most "Read Context" steps list 4–8 files but don't say to batch them in one parallel turn.

### 13. Missing commands: `/sk:release`, `/sk:pr`, umbrella `/sk:review`
- `/sk:release` — version bump + changelog prepend + tag + `gh release create` (changelog.md generates notes but nothing ships them).
- `/sk:pr` — standalone diff → title/body → `gh pr create` (currently buried as optional tail of commit/finish).
- `/sk:review` — fan out code/security/perf/ui/deps analyzers as parallel Agent calls (the pattern orchestrate/council already use). The obvious "before I ship" command.

### 14. Missing agents: debugger, security-reviewer, perf-reviewer
`/sk:debug`, `/sk:security-review`, `/sk:perf-review` exist as commands but have no dispatchable agent, so `/sk:orchestrate`'s fan-out can't include them. Also consider a docs-writer agent. `architecture-reviewer` is wired only into `plan.md` — add it to the dev review loop so mid-implementation drift gets caught.

### 15. Skill invocation hygiene
- `legal-advisor` and `copywriting`: set `disable-model-invocation: true` — they're the two fattest descriptions (~95/~115 words per turn) and their whole GTM family is already command-gated. Auto-triggering legal-doc generation is also a liability.
- Trim descriptions 30–40% on: create-pdf, error-recovery, escalation-rules, test-driven-development, verification-before-completion, subagent-driven-development.
- `context-priming`: merge into CLAUDE.md or delete — duplicates native exploration + `/init`.
- Clarify in docs: subagent-driven-development is sequential; orchestrate is the parallel path (currently easy to confuse).

### 16. Distribution: go hybrid (plugin + init scaffold)
No plugin awareness exists today. SK is two payloads with opposite lifecycles:
- **Commands + agents + skills** — shared, versioned, never user-edited → maps 1:1 onto the Claude Code plugin model; would get versioned updates, no-clobber, and orphan cleanup for free (structurally fixing bugs 2–4 above).
- **docs/ scaffold + CLAUDE.md template** — copied-then-owned per project → stays as a thin `npx shipkit-cld init`.

Recommended end-state: plugin for the executable surface, npx init for the per-project scaffold.

### 17. Minimal install tier
Fresh install lays down all 17 doc sections + ~40 stub files; "delete lanes you don't need" is manual prose. Give `/sk:init-docs` (and the CLI) a `minimal` profile (system + conventions + tasks) that grows on demand — small projects shouldn't start buried in empty homes.

### 18. Auto-generate indexes instead of hand-maintained tables
`docs/README.md` master index and `tasks/README.md` board are hand-maintained prose tables that will drift from frontmatter (the real source of truth). Generate them the way `user-guides/README.md` already does. Consider a machine-readable manifest so Claude finds docs without scanning the tree.

### 19. Robustness preflight
- Git commands run unguarded in resume/commit/finish/recap/changelog/retro — add "not a repo / no commits" degradation.
- `main` hardcoded as base in finish.md:52, changelog.md:28, code-review.md:28, recap.md:23 — detect via `git symbolic-ref refs/remotes/origin/HEAD`.
- Monorepo unhandled in kickoff/init-docs/deps — ask which package.
- new-task/new-epic append to `docs/tasks/README.md` with no create-if-missing fallback.
- docs-audit / create-pdf detection snippets are bash-only — add PowerShell fallback notes (Windows-primary users).

### 20. Task lifecycle robustness
- Status enum lacks `cancelled` / `blocked` / `abandoned`; stale in-flight tasks are never reaped — have resume or docs-audit surface them.
- Dogfood `docs/tasks/` holds only `examples/` — SK's own flagship lifecycle is untested in its own repo. Land one real epic + task + `.current`.

### 21. Consolidation opportunities (optional)
- Thin doc creators (`new-feature-doc`, `new-user-guide`, `new-business-doc`, ~40–70 lines each) could merge into `/sk:new-doc <type>` — weigh against slash-menu discoverability.
- `council.md` (394 lines) embeds four near-identical Agent prompt blocks — template them.
- Root `.claude/` vs `pkg/.claude/` are hand-kept twins with no sync mechanism — add a sync script or generate root from pkg (a check in CI/pre-commit would prevent silent divergence).

### 22. Readme / npm presence
- Convert the 5 Mermaid diagrams to static images (npm doesn't render Mermaid). [already tracked in memory]
- Fill package.json `author` / `repository` / `homepage` / `bugs`.

---

## Suggested sequencing

| Wave | Items | Why first |
|------|-------|-----------|
| 1. Correctness | #1 agent frontmatter, #2–4 cli.mjs lifecycle, #5 audit false positives, #6 marketing/, #7 small bugs | Broken/misleading today; cheap fixes |
| 2. Daily-driver reliability | #8 .current contract, #11 command frontmatter pass, #15 skill hygiene, #19 preflight | What makes SK trustworthy every session |
| 3. Leverage | #9 dedupe prose, #12 native features, #13 new commands, #14 new agents | Less maintenance, more capability |
| 4. Differentiation | #10 doc-to-code freshness, #17 minimal tier, #18 auto-indexes, #16 plugin split, #20 lifecycle states | What makes SK the obvious choice over ad-hoc |

---

*Generated from a 4-agent parallel review; all findings verified against shipped files in pkg/.*
