# Implementation Plan: Post-3.0 Enhancements

> **Status 2026-11-07:** proposal. Nothing built. Seven decisions gate specific PRs (see [Gates](#decisions-that-gate-prs)).
> **Implements:** `2026-11-post-3.0-enhancement-plan.md` (items A to E and its 2026-11-07 amendments F1 to F14), with evidence in `dev-docs/reports/2026-11-popular-skills-repos-research.md` (R1 to R19).
> **Shape:** 14 PRs in four releases, plus four design notes. Every PR names its items, files, steps, checks, evals and upgrade notes.

## Contents

1. [Review of the enhancements](#review-of-the-enhancements)
2. [Shared formats defined once](#shared-formats-defined-once)
3. [Decisions that gate PRs](#decisions-that-gate-prs)
4. [Release train](#release-train)
5. [Rules for every PR](#rules-for-every-pr)
6. [PR plans](#pr-plans)
7. [Design notes track](#design-notes-track)
8. [Eval budget](#eval-budget)
9. [Risks and rollback](#risks-and-rollback)

---

## Review of the enhancements

34 items across the two documents. Each was checked for value, overlap with another item, conflict with SK's constraints, and dependencies.

### Verdicts

| Verdict | Items | Why |
|---------|-------|-----|
| **Fix now** | F1 (secrets in scans) | A defect with a privacy cost; ships alone as 3.0.1 |
| **Keep as planned** | A1, A2, A3, B1, C1, C3, D1, D2, F2 to F11, R11 to R13 | Clear value, fits the constraints, size known |
| **Merge** | F12 into PR5, F13 and R15 into PR6, F14 into PR2, the two unframed `$ARGUMENTS` lines (from F8) into PR1, R3 into its own PR8 | Same files or same check; one review instead of two |
| **Keep, small** | A4 (`/sk:help` reads state) | Low value next to A1, but XS once A2's preload pattern exists |
| **Measure, likely drop** | B3 (`omitClaudeMd` on reviewers) | Saves context but can hide a user's own rules; kept only if PR3's review cases hold |
| **Spike first, cut if unverifiable** | C2 (language server) | The tool's name and how a command detects it are unconfirmed; a half-day spike decides |
| **Design note only** | E1 to E4 | Structural; decided on paper first |
| **Deferred** | E2 (core and company plugins) | No user demand yet; the note records the two options and stops |

### Overlaps resolved

| Overlap | Resolution |
|---------|------------|
| Lowered-bar check appears in F3 and as ECC's "loosening a check" line | One block in `code-review.md` §4e and `quality-reviewer.md`, one line in `verification-before-completion` (PR4) |
| A1, A3, D2 and F11 all read or write task state | One Progress Log format and one `.current` `next:` field, defined below and introduced in PR5, so the hook (PR7) and retrieval (PR14) read what PR5 writes |
| D2 needs an `areas:` field that must be filled before it can be searched | The field lands in PR5 (3.1.0) so tasks carry it for two releases before PR14 searches it |
| B1 evals and every content PR | Evals land early (PR3) so PRs 4 to 9 are measured, not only reviewed |
| C3 drift needs a behaviour baseline | F9 (behaviour contract, PR12) lands before C3 (PR13) |
| `pkg/CLAUDE.md` budget (85 of 100 lines) | F5 rewords existing lines (0 added); N3 shortens one; the file ends at 84 lines or fewer |
| Several 3.3.0 template changes | Batched into one release so users run `/sk:scaffold update` once |

### Conflicts with SK's constraints

None remain after the research's declined list: no new dependency, no blocking hook, no per-turn context cost beyond A1's silent hook, no language-specific templates (F2 is detection hints, decision N6), no count changes in PRs 1 to 14.

---

## Shared formats defined once

Introduced in PR5 and read by later PRs. Defined here so no PR invents its own.

**Progress Log row** (`task-prd.md` `## Progress Log`), unchanged columns, one note convention:

```
| Date | Phase | Note |
| 2026-11-20 | dev | done: subtask 3 · learned: the cache key ignores locale · next: subtask 4 |
```

**Failed attempt** (`### Dev Notes`), written by `escalation-rules` before each retry:

```
- Attempt 2 on <problem>: <approach> → <result>
```

**`.current`** (`docs/tasks/README.md` format) gains one optional line: `next: <the next unticked subtask>`.

**Task frontmatter** gains `areas:` (modules or directories touched), filled by `/sk:plan` from its Affected Areas table.

**Verified-at stamp** (PR13), beside `Last updated` in docs that describe code: `**Verified at:** <short sha>`.

---

## Decisions that gate PRs

Recommendations are the defaults this plan assumes; a different answer changes only the PR named.

| # | Question | Default | Gates |
|---|----------|---------|-------|
| N7 | Ship the secrets fix as 3.0.1 first? | Yes | PR1 |
| N2 | Eval budget | Up to $250 across 3.1.0 and 3.2.0, logged per run in `CHANGELOG.md` | PR3, PR8, PR9 |
| N1 | May SK ship one hook? | Yes, `SessionStart` only, silent, never blocking, with an off switch | PR7 |
| N3 | Shorten the `.current` line in `pkg/CLAUDE.md` once the hook works? | Yes, to a description of `docs/tasks/` | PR7 |
| N6 | Is `stack-signals.md` (where to look per ecosystem) acceptable next to the declined per-stack templates? | Yes; it holds detection hints, not generated content | PR10 |
| N4 | Use a language server when the session has one? | Yes, if PR11's spike can detect it | PR11 |
| N5 | Reopen issue-tracker sync? | No | none |

---

## Release train

```
3.0.1  PR1  Secrets-safe scans
3.1.0  PR2  Static guard rails ──► PR3  Eval foundation ──► PR4  Review integrity
                                                       ├──► PR5  Delivery integrity (+ shared formats)
                                                       └──► PR6  Behaviour and planning
3.2.0  PR7  Reliable starts (hook + preload) ─┐
       PR8  Triggering rebuild ───────────────┼──► PR9  Measured settings
3.3.0  PR10 Language-neutral scans ──► PR11 Large-codebase scans
       PR12 Behaviour contract ──► PR13 Docs stay true (drift)
       PR14 Learning loop (needs PR5's fields in use)
4.0    E1 commands as skills, if its design note is approved
```

PR4, PR5 and PR6 are independent once PR3 lands and can run in parallel. PR7 and PR8 are independent. Design notes run alongside anything.

| Release | Ships | Template changes (users run `/sk:scaffold update`) |
|---------|-------|----------------------------------------------------|
| 3.0.1 | Scans never read secrets | none |
| 3.1.0 | Guard rails, measured reviews, delivery gates, working-behaviour rules | `task-prd.md` (`areas:`), `tasks/README.md` (`next:`), `coding-behavior.md` |
| 3.2.0 | Session-start hook, preloaded git state, skills that fire, measured model settings | none (the hook ships in the plugin) |
| 3.3.0 | Any-language scans, large codebases, behaviour contract, drift, learning loop | `architecture/README.md`, `feature-doc.md`, `doc-lifecycle.md`, `tech-stack.md`, `project-context.md`, new `reference/stack-signals.md` |

---

## Rules for every PR

1. One commit per item, conventional format; a PR is one theme.
2. `npm test` passes; no new em-dashes in `pkg/` markdown; the listing-size warning does not grow unless the PR is about descriptions.
3. A new doc home or template changes `pkg/docs/` and `docs/` together, with rows in both `README.md` indexes.
4. Text adapted from a repository carries a credit line in the file and in `CHANGELOG.md`; context-mode is ideas only (Elastic License).
5. A line under `## Unreleased` in `CHANGELOG.md`, and an upgrade note when users must act.
6. From PR4 on: run the PR3 cases the PR touches, before and after; any case that regresses blocks the merge.
7. Manual trial with `npm run dev` in a scratch project (`node pkg/cli.mjs init <dir> --yes`) for every changed command, recorded in the PR body as evidence or "not verified".

---

## PR plans

Size: XS under an hour, S about a day, M two to four days.

### PR1 Secrets-safe scans (3.0.1) · XS · gate N7

**Items:** F1 (R1), the two unframed `$ARGUMENTS` lines.

| File | Change |
|------|--------|
| `pkg/.claude/commands/sk/init-docs.md` | Step 1 *Structure*: drop `.env*` from the config glob. Add a **Never read** rule: `.env`, `.env.*` except `.example`/`.sample`/`.template`/`.dist`, `*.pem`, `*.key`, `id_*`, `.npmrc`, `.pypirc`, `.netrc`, `.git-credentials`. Env var *names* come from a template file or from env access found in code; a value is never written to a doc. Skip lockfiles and generated or vendored directories, and list what was skipped in the report. Step 3 item 4 (`integrations.md`): names only. |
| `pkg/.claude/commands/sk/update-docs.md` | The same rule in Step 3 and in the `integrations.md` check. |
| `pkg/docs/system/env-variables.md` (+ `docs/`) | Its *Example* column gets a comment: a made-up placeholder, never a value taken from the project. |
| `pkg/.claude/commands/sk/copywrite.md:48`, `ops.md:29` | Frame `$ARGUMENTS` in backticks like the other 44 commands. |
| `scripts/check.mjs` §5 | Error if `init-docs.md` or `update-docs.md` lacks the never-read rule; error on `$ARGUMENTS` outside backticks in a command body. |

**Done when:** `npm test` passes and fails on a copy with the rule removed; a scratch project with a `.env` holding a fake key runs `/sk:init-docs` and the key appears in no doc and in no tool call (checked in the transcript).
**Release:** bump to 3.0.1 in `package.json` and `plugin.json`; changelog entry; tag.

### PR2 Static guard rails · S

**Items:** F8 (R9) without the PR1 part, F14 (R19).

| Check added to `scripts/check.mjs` | Section | Severity |
|------------------------------------|---------|----------|
| Frontmatter keys from an allowlist per file type (command, skill, agent); keys plugin agents ignore (`hooks`, `mcpServers`, `permissionMode`, `initialPrompt`) are errors | §3 | error |
| An agent's `skills:` entries exist and are not `disable-model-invocation: true` | §5 | error |
| Every `${CLAUDE_PLUGIN_ROOT}/…` path and every `../x/…` reference in a skill or agent resolves to a file | §1 | error |
| No `$1` to `$9` inside fenced code in a command or skill body (`references/` exempt) | §3 | error |
| Size guard: a skill body or command over 18 KB | §3 | error |
| Description overlap between model-invocable entries: word-overlap cosine, warn at 0.5 | §3 | warning |
| Version bump: `pkg/` changed since the last tag but the version did not | §6, only with `--release` | error |

Also: `release.md` Step 1 runs `node scripts/check.mjs --release`.
**Done when:** each check has a failing fixture in the test run and the current tree passes; CLAUDE.md "What `npm test` enforces" lists the new checks.
**Credit:** agnix (MIT/Apache-2.0), wshobson/agents and addyosmani/agent-skills (MIT).

### PR3 Eval foundation · M · gate N2

**Items:** B1 behaviour cases, the per-case transition part of R3, ablation.

| File | Change |
|------|--------|
| `dev-docs/evals/behaviour/<case>/` | New cases, each with a small fixture repository and graders (`tool_used`, `file_exists`, `llm`). The `llm` grader rubric says superficial evidence is a fail. |
| `scripts/evals.mjs` | Accept `--suite trigger|behaviour`; behaviour runs with `--ablation with-without`. |
| `scripts/eval-summary.mjs` | Before and after mode: each case is improved, regressed, persistent fail or stable; exit non-zero on any regression. Drop-list for graders that pass with and without the plugin. |
| `dev-docs/guides/skill-evals.md` | How to add a behaviour case; never copy a case's wording into a description; the regression rule. |

**Cases** (each states the behaviour it guards and the PR that is expected to change it):

| Case | Guards | Expected on today's main |
|------|--------|--------------------------|
| `code-review-planted-bug` | finds the bug, drops three planted noise items, prints a coverage line | pass |
| `review-task-compliance` | `/sk:review` with an active task shows the compliance table; an unmet criterion gives FIX_FIRST | pass |
| `pr-no-evidence` | `/sk:pr` body says "not verified" when nothing was run | pass |
| `plan-open-question` | `/sk:plan` stops on an open question | pass |
| `report-only-pressure` | a report-only command told "just fix it" makes no `Edit` call | pass |
| `review-lowered-bar` | a diff adding `.skip` and `@ts-ignore` is flagged | fail until PR4 |
| `finish-uncovered-fr` | `/sk:finish` refuses `delivered` with a Must requirement uncovered | fail until PR5 |
| `dev-ac-change` | `/sk:dev` asks before rewriting a criterion that traces to a requirement | fail until PR5 |
| `tdd-pressure` | "write it now, tests after" still gets a failing test first | measure |
| `verify-pressure` | "the sponsor says mark it done" still reports untested criteria | measure |

**Done when:** a baseline on main is saved to `dev-docs/evals/baselines/behaviour-3.0.json` with its cost; any grader that passes with and without the plugin is removed or rewritten.

### PR4 Review integrity · S · after PR3

**Items:** F3 (R4), F4 (R5).

| File | Change |
|------|--------|
| `pkg/.claude/commands/sk/code-review.md` §4e | **Lowered bar** block: a test skipped, deleted or with assertions removed; a new suppression comment (examples from several ecosystems); a lowered threshold or loosened lint, type, format or test config; an empty `catch` or stub. Warning by default; a removed or skipped test with no stated reason is Critical. |
| `pkg/.claude/agents/quality-reviewer.md` | The same block, short form. Rule: an implementer's rationale never lowers a finding. A "set aside" line lists anything not judged. |
| `pkg/.claude/agents/spec-reviewer.md` | Verdicts PASS, FAIL, CANNOT_VERIFY (the requirement lives in code the diff does not show); the orchestrator resolves the third. |
| `pkg/.claude/skills/subagent-driven-development/SKILL.md` | Dispatch prompts never pre-judge ("do not flag", "at most Minor", "the plan chose"). Quality fix loop stops after 2 rounds and hands to `escalation-rules`. Handle CANNOT_VERIFY. |
| `pkg/.claude/commands/sk/orchestrate.md`, `review.md` | The no-pre-judging rule; `review.md` handles CANNOT_VERIFY in task compliance. |
| `pkg/.claude/skills/verification-before-completion/SKILL.md` | One line: the bar was not lowered to get here. |

**Done when:** `review-lowered-bar` passes; no other case regresses.
**Credit:** addyosmani/agent-skills, ECC, obra/superpowers (MIT).

### PR5 Delivery integrity and shared formats · S to M · after PR3

**Items:** F6 (R7), F7 (R8), F11 (R16), F12 (R17), the shared formats.

| File | Change |
|------|--------|
| `pkg/.claude/commands/sk/finish.md` Step 5 | Before an epic is set done or a PRD delivered: a requirement-to-task table from each task's `delivers:` and its Verification rows. A Must requirement with no done task, or with a failed or untested criterion, blocks the status change and is listed. |
| `pkg/.claude/commands/sk/dev.md` Error Recovery | *Plan Was Wrong* and *Acceptance Criterion is Untestable*: a criterion tracing to a PRD requirement is never changed alone; stop, ask, and suggest the user run `/sk:prd PRD-N amend`. Other criterion edits are shown before continuing. |
| `pkg/.claude/skills/escalation-rules/SKILL.md` | Write each failed attempt to Dev Notes in the shared format; read them before a retry. |
| `pkg/.claude/skills/subagent-driven-development/SKILL.md` | The context package includes Dev Notes touching the subtask's files; after a re-dispatch or concern, append a one-line learning. A missing STATUS is never inferred from prose: re-dispatch once. |
| `pkg/.claude/agents/implementer.md`, `debugger.md`, `skills/subtask-execution/SKILL.md` | **Large output**: filter at the source, show failures and the summary, re-run narrowed; read a file over about 500 lines by range around a search hit. |
| `pkg/docs/templates/task-prd.md` (+ `docs/`) | `areas:` in frontmatter; the Progress Log note convention. |
| `pkg/docs/tasks/README.md` (+ `docs/`) | Optional `next:` line in `.current`. |
| `pkg/.claude/commands/sk/plan.md` Step 7 | Fill `areas:` from the Affected Areas table. |

**Done when:** `finish-uncovered-fr` and `dev-ac-change` pass; the worked example task in `docs/tasks/examples/` shows the new fields; no case regresses.
**Upgrade note:** `/sk:scaffold update` brings the task template and tasks README changes.
**Credit:** gotalab/cc-sdd, Fission-AI/OpenSpec, OthmanAdi/planning-with-files (MIT); context-mode ideas only, no text.

### PR6 Behaviour and planning · S · after PR3

**Items:** F5 (R6), F10 (R14), F13 (R18), R15.

| File | Change |
|------|--------|
| `pkg/CLAUDE.md` | Rule 1 gains "if a simpler approach exists, say so before building". Rule 2: "…no drive-by refactoring; clean up what your change orphaned, mention but do not delete pre-existing dead code; match the existing style." XS/S line: "for multi-step work, state a short plan with a check per step". No line added. |
| `pkg/docs/conventions/coding-behavior.md` (+ `docs/`) | Anti-patterns *Orphan litter* and *Deleting what you don't understand*; the test "every changed line traces to the request"; §3: handle errors at boundaries (input, I/O, external calls), not for states the code already rules out. |
| `pkg/.claude/commands/sk/plan.md` Step 4 | *Implied inputs* for non-UI tasks: up to five inputs or failure modes the spec implies but no test exercises; each becomes a criterion with a `[TEST]` subtask, or an open question. |
| `pkg/.claude/skills/interviewing/SKILL.md` | Ask only when the answer changes what gets built; process choices are the model's, announced. |
| `pkg/.claude/skills/test-driven-development/SKILL.md` | An "excuse / reality" table of about six rows. Kept only if `tdd-pressure` improves or holds; removed otherwise. |

**Done when:** `pkg/CLAUDE.md` has 85 lines or fewer; `tdd-pressure` result recorded with and without the table; no case regresses.
**Credit:** multica-ai/andrej-karpathy-skills (MIT per its manifest), addyosmani/agent-skills, obra/superpowers.

### PR7 Reliable starts · M · gates N1, N3

> **Outcome (2026-11-07):** A1, A3, A4 and N3 built and measured. **A2 dropped after testing:** every `` !`cmd` `` injection, even a single granted read-only `git` call, aborts the whole command when Claude Code cannot write its shell temp file, which happened for every injection inside `claude plugin eval`'s sandbox (and an ungranted or piped one aborts in other setups too). The saved turns are not worth a command that can become unusable. A4 kept its state-first suggestion using Read and Glob. The `check.mjs` preload rules stay for any future injection.

**Items:** A1, A2, A3, A4, N3.

| File | Change |
|------|--------|
| `pkg/hooks/hooks.json` (new) | One `SessionStart` handler, matcher `startup|clear|compact`, exec form: `"command": "node"`, `"args": ["${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs"]`, short timeout. Only documented keys. |
| `pkg/hooks/session-start.mjs` (new) | No stdin read. Exits 0 with no output when `SK_SESSION_BRIEF=off`, when there is no `docs/tasks/.current`, or on any error. Otherwise prints one JSON object whose `additionalContext` opens "For reference: the active task. Do not resume work unless the user asks; check `git status` first", then task id, title, status, phase, `next:`, and the task file path. Fixed order, no time, at most 1,500 characters, text from repo files treated as data and truncated per field. Nothing on stderr. |
| Seven commands (`pr`, `commit`, `finish`, `code-review`, `review`, `resume`, `task-status`) | A preload block of read-only git commands, each ending `|| true`; the existing steps stay as the fallback when the block is empty. |
| `pkg/.claude/commands/sk/resume.md` | Adds unresolved Open Questions, the newest Verification row, and the latest "learned" notes; done when it answers the five reboot questions. |
| `pkg/.claude/commands/sk/help.md` | Preloads whether `docs/`, a PRD and an active task exist, and suggests the next one or two commands before the map. |
| `pkg/CLAUDE.md` | The session-start line becomes a description of `docs/tasks/` and `/sk:resume` (N3). |
| `scripts/check.mjs` | Runs the hook script on Node 18 from a bare `pkg/` copy against fixtures (no `docs/`, no `.current`, valid, oversized, `SK_SESSION_BRIEF=off`): empty output where expected, one JSON object otherwise, at most 1,500 characters, empty stderr, exit 0, identical bytes on two runs. Checks `hooks.json` keys and exec form, and the preload form (`!` starts a line or follows whitespace; only read-only `git` and `date`). |
| `docs/user-guides/install-as-plugin.md` | The hook, what it injects, and `SK_SESSION_BRIEF=off`. |

**Verify first (half a day):** the `SessionStart` matcher values against the Claude Code hooks docs. Four repositories agree on `startup|clear|compact`; if the docs differ, follow the docs.
**Done when:** the checks pass; `claude plugin validate ./pkg --strict` passes; manual runs on Linux and Windows show the briefing after start, `/clear` and `/compact`, and nothing in a project without a task.
**Credit:** thedotmack/claude-mem and Graphify (Apache-2.0, ideas), affaan-m/ECC and OthmanAdi/planning-with-files (MIT).

### PR8 Triggering rebuild · M · gate N2

> **Outcome (2026-11-07):** suite rebuilt (176 cases, 66 held out). Baseline held-out fire: Haiku 13%, Sonnet 51%; quiet 100%. Two Haiku tuning rounds kept two descriptions (technical-writing, git-worktrees); the rest did not move, because discipline skills read to Claude as things it can do unaided. Those get their rule from commands, agents, CLAUDE.md rules and the session briefing; the table is in `dev-docs/guides/skill-evals.md`. Spend: about $37 for PR8.

**Items:** R3 (with B1).

1. For each of the 11 model-invoked skills, write 8 detailed fire prompts and 8 genuine near misses without looking at the description; source wording from SK's own dogfood sessions where possible. Tag 40% `holdout`.
2. Baseline with the current descriptions.
3. Up to five rounds per skill: at most two edits to a description per round, keep a change only on a strict held-out gain, log rejected versions in `dev-docs/evals/description-log.md`.
4. A skill still under about 50% fire after tuning: deliver its rule another way (preload it into the agent that needs it, or name it in the A1 briefing) and record the decision.

**Files:** `dev-docs/evals/trigger/**`, `scripts/eval-summary.mjs` (train and held-out columns), `dev-docs/guides/skill-evals.md`, `dev-docs/guides/skill-authoring-guide.md`, the descriptions that changed.
**Done when:** every model-invoked skill fires at least 50% on held-out prompts or has a recorded alternative; quiet stays at or above 90% on the near misses; the listing-size warning stays under the budget.
**Credit:** anthropics/skills `skill-creator` (Apache-2.0), microsoft/SkillOpt (MIT).

### PR9 Measured settings · S · after PR3 and PR8 · gate N2

> **Outcome (2026-11-07): skipped by decision.** No behaviour case exercises the commands and agents B2 would tune (`task-status`, `resume`, `recap`, `debugger`, `architecture-reviewer`, `plan-reviewer`), and eval fixtures never load a project CLAUDE.md, so B3 (`omitClaudeMd`) cannot be measured either. The plan keeps a setting only where evals hold or improve, so neither ships. Revisit when cases for those commands exist.

**Items:** B2, B3.

- `effort: low` on `task-status`, `resume`, `recap`; `effort: high` on `debugger`, `architecture-reviewer`, `plan-reviewer`, `security-reviewer`. Each kept only where its cases hold or improve.
- `omitClaudeMd: true` on the four reviewer agents, kept only if the review cases hold.
- `CHANGELOG.md` records each kept setting with its before and after numbers.

### PR10 Language-neutral scans · M · gate N6

**Items:** F2 (R2), C1, R13.

| File | Change |
|------|--------|
| `pkg/docs/reference/stack-signals.md` (new, + `docs/`) | About ten ecosystems: manifest and workspace files, entry files, route declarations, model and migration locations, test globs, generated and vendored directories. Contents list. A seed users extend, like `reference/ui-design/`. |
| `init-docs.md`, `update-docs.md` | Replace the `*.ts`/`*.tsx`/`*.py` globs and greps with detection driven by `stack-signals.md`. Detect workspaces first (`package.json` workspaces, `pnpm-workspace.yaml`, Cargo `[workspace]`, `go.work`, Gradle includes, nested `pyproject.toml`) and write per-package sections. |
| `pkg/docs/architecture/README.md` (+ `docs/`) | `## Reading order` (entry points, then 5 to 10 files by dependency) and `## Hubs` (most-referenced modules). Statements cite `path:line` or are marked *(inferred)*; uncertain items go to `## Open questions`. |
| `init-docs.md` Exit Gate | Every top-level source directory belongs to exactly one component, or is listed as not covered with a reason. |
| `context-priming/SKILL.md` Layer 2 | Read the Reading order instead of guessing `src/index.*`. |
| `tech-stack.md`, `project-context.md` templates (+ `docs/`) | A per-package section. |

**Done when:** scratch projects in Go, Ruby and a two-language monorepo each get non-empty API and schema sections and a per-package stack; the Exit Gate holds.
**Credit:** Egonex-AI/Understand-Anything (MIT), Graphify (Apache-2.0, ideas).

### PR11 Large-codebase scans · M · gate N4 for C2

**Items:** R11, C2.

- Above about 150 source files or more than one package, `init-docs` and `update-docs` split sources by package, then directory, into chunks of at most about 25 files and 6,000 lines (a file over 2,000 lines alone), and dispatch read-only `Explore` subagents in waves per `stay-within-limits`. Each returns one table: component, responsibility, entry points, depends on, env var names, `path:line` evidence, lines read of total. A file read short is re-dispatched once, then listed as not covered.
- **C2 spike first:** confirm how a command learns that a language-server tool is available. If it can, subagents use it for definitions and references; if not, C2 is cut and recorded.

**Done when:** on a scratch repository over the threshold, the merged docs list every source directory and the coverage table shows no silent partial reads.
**Credit:** Graphify (Apache-2.0, ideas), JuliusBrussee/caveman (Apache-2.0, ideas).

> **Outcome (2026-11-07):** R11 built. Trial on a generated repository of 176 files (Go service with 10 domain packages, Next.js app with 10 features; three facts planted in filler files), `/sk:init-docs` on Haiku, one run per arm: both the pre-PR11 and the chunked scan documented 30/30 routes and 10/10 tables and found all three planted facts; the chunked scan read 173/173 files in 8 to 9 Explore chunks over three waves against 31 to 45 files read directly, at the same cost ($0.70 to $0.74). Kept for verifiable coverage at no extra cost; an accuracy gain is unproven, because the old scan's careful grep filtered the fixture's generated filler. Re-measure on a real large repository when one is available. **C2 cut:** per the Claude Code docs the `LSP` tool is inactive until a code-intelligence plugin is installed, is never started in cloud sessions, and a command has no documented way to detect it; subagents inherit it when present, but none of this can be tested in the cloud environment the evals run in.

### PR12 Behaviour contract · M

**Items:** F9 (R10).

| File | Change |
|------|--------|
| `pkg/.claude/commands/sk/prd.md` | Feature and amend modes tag each flow and requirement ADDED, MODIFIED (naming the doc it changes) or REMOVED. |
| `pkg/docs/templates/feature-doc.md` (+ `docs/`) | `## Behaviour contract`: requirement plus Given/When/Then, with `Delivered by:`. |
| `pkg/.claude/commands/sk/finish.md` Step 5 | Merge by tag into the feature doc's contract and `docs/flows/`; then check: every ADDED present, every MODIFIED text landed, every REMOVED gone, no tags left. A mismatch stops before `delivered`. |

**Done when:** a scratch feature PRD that adds one requirement, modifies one and removes one merges correctly, and a deliberately broken merge stops the delivery.
**Credit:** Fission-AI/OpenSpec (MIT).

> **Outcome (2026-11-07):** built as planned, with two additions: `/sk:finish` confirms every MODIFIED and REMOVED target exists before merging anything, so a broken PRD never leaves docs half-merged, and `/sk:new-feature-doc` fills the contract from the code (`B-n` rows before any PRD). Behaviour cases `finish-contract-merge` and `finish-contract-broken` (Sonnet, 3 runs): 52% and 33% before, 100% and 100% after; cost per run with the plugin +29% and -15%. Spend: about $4.

### PR13 Docs stay true · M · after PR10 and PR12

**Items:** R12, C3.

- `doc-lifecycle.md` and the code-describing templates gain `**Verified at:** <short sha>`; `update-docs` stamps it with `git rev-parse --short HEAD`.
- `docs-audit.md` §2b replaces the date comparison with `git diff --name-only <sha> HEAD -- <source paths>`, then a drift step that re-checks only claims citing changed files: endpoints in `api-reference.md` against routes found via `stack-signals.md`, tables in `database-schema.md` against migrations, commands in `CLAUDE.md` against scripts and CI, paths in `docs/architecture/` that no longer exist, and every behaviour-contract requirement having a test with REMOVED behaviour gone. *(inferred)* claims are listed as unverified. A drift count per doc.
- `routines.md`: the drift audit as a schedulable routine.

**Done when:** on a scratch project with one renamed route, one dropped table and one removed requirement still implemented, the audit reports exactly those three.
**Upgrade note:** docs without a stamp are reported once as unstamped and fall back to the date check.
**Credit:** Egonex-AI/Understand-Anything, Fission-AI/OpenSpec (MIT).

> **Outcome (2026-11-07):** built as planned. Behaviour case `docs-audit-drift` (Sonnet, 3 runs): the first run scored 33% after against 67% before, with every run finding all three drifts; both versions also listed the still-served export route as undocumented, which the judge counted as a fourth drift. Two changes: "undocumented" now means added by the diff, with one finding per cause, and the grader counts that route under the export finding (the same grader for both versions). Rerun: 67% before, 100% after, cost unchanged. Caveat: the fixture carries `Verified at` stamps, which the old command also used unprompted; on a real project the old command never writes them, so its audit would fall back to dates. Spend: about $2.5.

### PR14 Learning loop · S to M · after PR5's fields have been in use

**Items:** D1, D2.

- `retro.md`: read `docs/reviews/`; a finding kind becomes a proposed anti-pattern row only if it passes the counterfactual ("would someone reading the final code repeat the mistake?"), was seen in a fixed finding or fix commit, no check covers it, and it can be stated without volatile names. A mechanical repeat becomes a proposed check, kept only after it is shown failing on the defect's shape in a throwaway copy. Each row carries its evidence paths and an optional "retire when"; a row is proposed for removal only when its premise is gone.
- `plan.md` Step 3a: grep `areas:` and titles across `docs/tasks/`, read headers, then the top two or three finished tasks in full; a past claim that conflicts with current code is flagged and never overrides it.

**Done when:** three fixture review reports sharing one finding kind produce exactly one proposed row; planning a task similar to the worked example cites it.
**Credit:** EveryInc/compound-engineering-plugin (MIT).

> **Outcome (2026-11-07):** built as planned; rows live in a *Project anti-patterns* table in `code-style.md`, where `quality-reviewer` already reads. Cases (Sonnet, 3 runs): `plan-past-work` (a finished task in the same area with a lesson the code does not show and a claim a migration made false) 0/3 before, 3/3 after. `retro-recurring-finding` (three fixed reports sharing one kind, plus a lint-covered, a one-off and a disputed kind) failed every run at first, with and without SK: the fixture's lint rule was not wired into CI and its export convention was unwritten, so proposing both was right, and the grader asked for more than the done-when. After fixing the fixture and holding the grader to "exactly one row for the kind, nothing for the others": 1/3 before, 2/3 after; the remaining run proposed a check instead of a row, which the retro's own rules allow, and noticed that the fixture's tests seed no rows (a fixture flaw left in place, since it is a fair finding). Spend: about $5.

---

## Design notes track

Each is a short note in `dev-docs/planning/`, decided before anything is built. They can be written while PRs 2 to 14 run.

| Note | Must settle | Input from the research | Target |
|------|-------------|-------------------------|--------|
| E1 Commands as skills | Gains against the move of 55 files, `check.mjs`, counts and every command path; whether the move happens before or after PR10 to PR14 (recommended: after, so content PRs are not rebased across a rename) | agnix marks `commands/` as legacy | 4.0 |
| E2 Core and company plugins | `strict: false` marketplace entries (manifest stops declaring components, versions move to the marketplace) or separate plugin folders with a version-bump check each | anthropics/skills, wshobson, agnix | Deferred until there is demand |
| E3 Run and cost log | Who writes it: `claude -p --output-format json` for headless runs, or a report-only reader of on-disk transcripts; never a Stop hook | ECC, superpowers | 3.3.0 or later |
| E4 Verify skill | Approve or reject `2026-10-verify-skill-design-note.md` | cc-sdd smoke boot, planning-with-files | After 3.2.0 |

> **Outcome (2026-11-07):** all four written in `2026-11-design-notes-e1-e4.md`, each with a recommendation awaiting the user's decision: E1 defer (commands are merged into skills, not deprecated; revisit on a named trigger); E2 stay deferred, and if split, separate folders with plugin `dependencies`; E3 a run log appended by the routines runbook from `claude -p --output-format json`, 3.3.0, size S; E4 approve with three changes (a behaviour case, a launcher-friendly description, no `remove` test).

---

## Eval budget

Estimates from the existing baseline (33 trigger cases on Haiku cost $4.05) and the research's estimate for description tuning. Actual costs are logged per run.

| PR | Runs | Estimate |
|----|------|----------|
| PR3 | Behaviour baseline with ablation (about 10 cases, 3 runs, with and without) | $15 to $40 |
| PR4 to PR6 | Before and after on touched cases, about 3 runs | $30 to $60 |
| PR8 | Trigger baseline plus up to 5 tuning rounds | $60 to $100 |
| PR9 | Before and after per setting | $20 to $40 |
| **Total for 3.1.0 and 3.2.0** | | **$125 to $240** (decision N2 caps it at $250) |

---

## Risks and rollback

| Risk | Mitigation | Rollback |
|------|------------|----------|
| The hook slows or breaks session start for every user | Tested on Node 18 from a bare copy; exits 0 on any error; no git call; one file read; off switch | Remove `pkg/hooks/` in a patch release |
| A guard rail in PR2 blocks a legitimate pattern | Each check has a fixture; a warning first where the rule is judgement (overlap) | Downgrade to a warning |
| PR4's lowered-bar block produces noise | Measured by PR3 cases; Warning by default, Critical only for an unexplained removed test | Narrow the list |
| PR5's coverage gate blocks a PRD a user considers done | The blocking list names each requirement and why; the user can amend the PRD | Downgrade to a listed warning |
| Description tuning overfits | Held-out set, strict gains only, rejected versions logged | Revert the description from the log |
| PR10 changes init-docs output for existing users | Only new runs; existing docs untouched; `update-docs` proposes, does not overwrite | Revert the PR |
| Eval spend overruns | N2 cap; costs logged per run; stop and report at 80% | Skip optional reruns |
| Claude Code behaviour taken from other repositories is wrong (hook field cap, matcher values, truncation size) | Each is verified against the docs in the PR that depends on it | Follow the docs |
