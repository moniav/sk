# Popular Skills Repos: Best Practices for SK

> **Date:** 2026-11-07. **Status:** research, nothing built.
> **Scope:** 16 popular repositories SK had not reviewed before, read at the commits below, each finding checked against SK's own files.
> **Feeds:** `dev-docs/planning/2026-11-post-3.0-enhancement-plan.md` (amended the same day; see its "Amendments" section).

## Contents

1. [Headline](#headline)
2. [Defects found in SK](#defects-found-in-sk)
3. [Themes across repositories](#themes-across-repositories)
4. [Recommendations](#recommendations)
5. [Effect on the post-3.0 plan](#effect-on-the-post-30-plan)
6. [Considered and declined](#considered-and-declined)
7. [Licences and credit](#licences-and-credit)
8. [Sources](#sources)
9. [Method](#method)

## Headline

SK's design holds up: every large memory or analysis system studied (claude-mem, ECC instincts, graphify, context-mode) needs a daemon, a second model, Python or a database, which confirms SK's choice of docs in the repository plus prompts.
The gains are in four places:

1. **Three defects in SK today** (next section): scans can read secrets, scans only understand TypeScript and Python, and 7 of 11 model-invoked skills never fire in evals.
2. **Guarding the bar.** Three independent repositories found that agents lower a check to make it pass, and that orchestrators coach their own reviewers. SK's reviewers look for neither.
3. **Specs that stay true.** SK marks an epic done and a PRD delivered without checking that every requirement was built and proven, and delivered requirements have no living home.
4. **Sharper versions of planned work.** The hook, eval, learning-loop and brownfield items in the post-3.0 plan each gain concrete design rules from repositories that already shipped them.

## Defects found in SK

| # | Defect | Evidence | Fix |
|---|--------|----------|-----|
| X1 | `/sk:init-docs` can read real secrets into the model and into generated docs | `init-docs.md:45` globs `.env*` as config; `init-docs.md:114` builds `integrations.md` "from env vars"; nothing forbids reading `.env` | R1 |
| X2 | Scans only understand TypeScript and Python, breaking the language-agnostic rule | `init-docs.md:49-51` and `update-docs.md:66,70,72` grep `*.ts`, `*.tsx`, `*.py` only; a Go, Ruby, Java or Rust project gets empty API and schema sections | R2 |
| X3 | Most model-invoked skills never fire | `node scripts/eval-summary.mjs dev-docs/evals/baselines/wave2-haiku.json`: 23% fire overall; 0% for `escalation-rules`, `plow-ahead`, `stay-within-limits`, `subagent-driven-development`, `technical-writing`, `verification-before-completion`; quiet 100% but the quiet cases are far misses | R3 |

Also minor: `copywrite.md:48` and `ops.md:29` use `$ARGUMENTS` unframed, unlike the other 44 commands (R9).

## Themes across repositories

**1. Agents lower the bar to pass a check.** addyosmani/agent-skills (`floor-guard.md`), ECC (`config-protection.js`) and superpowers each found the same failure: a skipped or deleted test, a removed assertion, a new `@ts-ignore` or `# noqa`, a lowered threshold, an empty `catch`. SK has one line on it, in `implement.md:127`. Reviewers do not check it.

**2. Reviewers must not be steerable.** superpowers v6 found orchestrators telling reviewers "do not flag" or "at most Minor", and the flaw shipped; one fix loop ran 18 rounds. Its answers: no pre-judging in dispatch prompts, an implementer's rationale never lowers severity, a third verdict "cannot verify from the diff", and a cap on fix rounds. SK's `spec-reviewer` is binary and `subagent-driven-development` has no round limit.

**3. Requirements must stay true after delivery.** OpenSpec merges each change's ADDED, MODIFIED and REMOVED requirements into living specs and refuses to archive if the merge does not check out. cc-sdd refuses GO until every requirement maps to a completed task. SK writes `delivers:` FR ids into every task (`plan.md:179`) but nothing reads them, and a later PRD that changes behaviour can only overwrite or duplicate a flow.

**4. A learning loop needs a bar, a retrieval path and a way out.** compound-engineering writes a lesson only if it passes a counterfactual ("would someone reading the final code repeat the mistake?"), keeps a check only after seeing it fail on the defect's shape, retrieves by grepping frontmatter then reading the top few, and retires a rule only when its premise is gone ("age alone is not staleness").

**5. Hooks have hard-won design rules.** claude-mem, ECC, planning-with-files and context-mode agree: register `SessionStart` on `startup|clear|compact`; text for the model goes in `additionalContext` (`systemMessage` is user-only); cap the output (claude-mem: Claude Code replaces fields over 10,000 characters with a stub); exit 0 on every error and never exit 2 (read as "block"); write nothing to stderr; frame injected text as reference, not instructions (ECC issue #1534: after compaction the model re-ran commands from an injected summary); keep the bytes deterministic for the prompt cache; give users an off switch.

**6. Large codebases need chunked, verified reading.** graphify caps each scan chunk at about 25 files and 6,000 lines, gives a file over 2,000 lines its own chunk (Read stops at 2,000), and re-dispatches files a subagent only partly read. Understand-Anything stamps docs with the commit they describe and finds drift with a path-scoped `git diff`, and assigns every file to exactly one layer with a count check.

**7. Evals must discriminate.** anthropics/skills tunes descriptions on 20 realistic queries (half genuine near misses) with a 40% held-out set and keeps the best held-out score; it runs every case with and without the skill and drops graders that pass both ways. SkillOpt keeps a change only on a strict held-out gain and records rejected edits. superpowers measured that deleting its TDD rebuttal table dropped test-first behaviour under pressure from 8/10 to 5/10.

**8. Silent failures need static checks.** agnix and wshobson list failures Claude Code does not report: unknown frontmatter keys are ignored, a gated skill preloaded into an agent is skipped, `$1` inside a code block is substituted, a broken `${CLAUDE_PLUGIN_ROOT}` path just fails to load.

## Recommendations

Ranked within each group by value for effort. Size: XS under an hour, S a day, M several days.
"Plan" names the post-3.0 item it joins, or "new".

### Fix the defects

| ID | Change | SK files | Source | Size | Plan |
|----|--------|----------|--------|------|------|
| R1 | Never read secrets in a scan: env names only from `.env.example`/`.sample`/`.template` or from env access in code; never Read `.env`, `.env.*`, `*.pem`, `*.key`, `id_*`, `.npmrc`, `.pypirc`, `.netrc`; never write a value into a doc; skip lockfiles and generated or vendored directories and list them | `init-docs.md`, `update-docs.md`; a `check.mjs` assertion that both carry the rule | graphify `detect.py` | XS | new (F1) |
| R2 | Replace the TS/Python-only globs and greps with language-neutral detection, using a ~100-line `stack-signals.md` reference (entry files, route declarations, models and migrations, test globs, generated directories for about ten ecosystems), loaded only by the scanning commands. Hints, not templates | `init-docs.md`, `update-docs.md`, new reference under a scanning skill | Understand-Anything `frameworks/`, `languages/` | S | new (F2); also used by C3 |
| R3 | Rebuild the trigger suite: per model-invoked skill, 8 detailed fire prompts and 8 genuine near misses written without looking at the description (dogfood sessions are a good source), 40% held out; tune descriptions with few edits per round, keeping only strict held-out gains and logging rejected versions; never copy a case's wording into a description. A skill still under ~50% after tuning gets its rule delivered another way (preloaded into an agent, or the A1 hook) | `dev-docs/evals/trigger/**`, `scripts/eval-summary.mjs` (train and held-out columns), `dev-docs/guides/skill-evals.md`, `skill-authoring-guide.md` | anthropics/skills `skill-creator`; SkillOpt | M, about $15-20 per round on Haiku | B1 |

### High value, small

| ID | Change | SK files | Source | Size | Plan |
|----|--------|----------|--------|------|------|
| R4 | **Lowered-bar check.** Reviewers flag: a test skipped, deleted or with assertions removed; a new suppression comment; a lowered threshold or loosened lint, type, format or test config; an empty `catch` or stub. Warning by default; a removed or skipped test with no stated reason is Critical | `code-review.md` §4e, `quality-reviewer.md`, `verification-before-completion/SKILL.md` (one line) | addyosmani `floor-guard.md`; ECC `config-protection.js`; superpowers | S | new (F3) |
| R5 | **Reviewer integrity.** No pre-judging in reviewer dispatch prompts; an implementer's rationale never lowers a finding; `spec-reviewer` gains CANNOT_VERIFY; the quality fix loop stops after 2 rounds and hands to `escalation-rules` | `subagent-driven-development/SKILL.md`, `orchestrate.md`, `review.md`, `spec-reviewer.md`, `quality-reviewer.md` | superpowers v6.0 to v6.4 | S | new (F4) |
| R6 | **Working Behavior.** Rule 2: clean up what your change orphaned, mention but do not delete pre-existing dead code, match the existing style. Rule 1: if a simpler approach exists, say so before building. XS/S line: "for multi-step work, state a short plan with a check per step". Error handling at boundaries, not for impossible states. No extra lines in `pkg/CLAUDE.md` | `pkg/CLAUDE.md`, `pkg/docs/conventions/coding-behavior.md` (and `docs/` copy) | andrej-karpathy-skills; addyosmani `using-agent-skills` | XS | new (F5) |
| R7 | **Requirement coverage gate.** Before an epic is done or a PRD delivered, build a requirement-to-task table from `delivers:` and each task's Verification table; any Must requirement not covered, or with a failed or untested criterion, blocks the status change and is listed | `finish.md` Step 5 | cc-sdd `kiro-validate-impl` check F; OpenSpec verify | S | new (F6) |
| R8 | **Spec changes are never silent.** In `/sk:dev`, changing an acceptance criterion that traces to a PRD requirement stops and asks, suggesting the user run `/sk:prd PRD-N amend`; other criterion edits are shown before continuing | `dev.md` Error Recovery | OpenSpec `apply-change` step 6; cc-sdd | S | new (F7) |
| R9 | **Static checks** in `npm test`: frontmatter key allowlist per file type (including keys plugin agents ignore); an agent's `skills:` exist and are not gated; every `${CLAUDE_PLUGIN_ROOT}/…` and `../x/…` reference resolves; no `$1`-`$9` inside code in bodies; `$ARGUMENTS` framed (and fix `copywrite.md:48`, `ops.md:29`); a size guard per skill and command (about 18 KB); a description-overlap warning between model-invocable entries | `scripts/check.mjs`, two commands | agnix; wshobson; addyosmani `run-evals.js`; superpowers v7.0.1 | S | new (F8) |

### Medium

| ID | Change | SK files | Source | Size | Plan |
|----|--------|----------|--------|------|------|
| R10 | **Living behaviour contract.** Feature and amend PRDs tag each flow and requirement ADDED, MODIFIED (naming what it changes) or REMOVED; `/sk:finish` merges by tag into a "Behaviour contract" section of the feature doc, then checks the merge before marking delivered | `prd.md`, `finish.md` Step 5.6, `templates/feature-doc.md` (both trees) | OpenSpec delta specs and archive | M | new (F9); gives C3 behaviour to check |
| R11 | **Chunked scans with a coverage check.** Above a size threshold, `init-docs` and `update-docs` split sources by package then directory into chunks of at most ~25 files and ~6,000 lines (a file over 2,000 lines alone), dispatch read-only `Explore` subagents in waves, each returning a table with `path:line` evidence and lines read; files read short are re-dispatched once, then listed as not covered | `init-docs.md`, `update-docs.md` | graphify; caveman-explore; context-mode ADR-0016 | M | C1, C2 |
| R12 | **Verified-at stamp.** Docs that describe code carry `Verified at: <short sha>`; `update-docs` stamps it; `docs-audit` finds drift with `git diff --name-only <sha> HEAD -- <source paths>` instead of comparing dates | `doc-lifecycle.md`, architecture, project-context and flow templates (both trees), `update-docs.md`, `docs-audit.md` | Understand-Anything `understand-diff` | S | C3 |
| R13 | **Architecture docs a model can navigate.** Template gains `Reading order` (entry points, then 5-10 files in dependency order) and `Hubs` (most-referenced modules); exit gate: every top-level source directory belongs to exactly one component or is listed as not covered; statements cite `path:line` or are marked *(inferred)* | `pkg/docs/architecture/README.md` (both trees), `init-docs.md`, `context-priming/SKILL.md` | Understand-Anything `tour-builder`, `architecture-analyzer`; graphify | S | C1 |
| R14 | **Implied inputs.** For non-UI tasks, `/sk:plan` lists up to five inputs or failure modes the spec implies but no test exercises; each becomes a criterion with a test subtask, or an open question | `plan.md` Step 4 | superpowers `writing-plans` "Review Focus" | S | new (F10) |
| R15 | **TDD rebuttal table** of about six "excuse / reality" rows, kept only if a pressure eval shows it helps | `test-driven-development/SKILL.md` | superpowers v6.2.0 (measured 8/10 vs 5/10) | XS + eval | B1 |
| R16 | **Memory that survives compaction.** Failed attempts are written to the task file and read before a retry; the next implementer receives Dev Notes touching its files | `escalation-rules/SKILL.md`, `subagent-driven-development/SKILL.md` | planning-with-files; cc-sdd `kiro-impl` | S | new (F11) |
| R17 | **Large output.** Filter at the source, show failures and the summary, re-run narrowed; read files over ~500 lines by range around a search hit. In agent bodies and `subtask-execution`, not in CLAUDE.md | `implementer.md`, `debugger.md`, `subtask-execution/SKILL.md` | context-mode (ideas only; see licences) | XS | new (F12) |
| R18 | **Fewer filler questions.** Ask only when the answer changes what gets built; process choices are the model's, announced | `interviewing/SKILL.md` | superpowers v7.0 (filler questions 41 to 23) | XS | new (F13) |
| R19 | **Version bump check** at release: fail when `pkg/` changed since the last tag but the version did not | `check.mjs` or `release.md` | wshobson `check_version_bumps.py` | XS | new (F14) |

## Effect on the post-3.0 plan

| Item | Change from this research | Source |
|------|---------------------------|--------|
| A1 hook | Matcher `startup\|clear\|compact`, no PostCompact fallback (PostCompact cannot carry context); `resume` optional (claude-mem omits it, planning-with-files includes it). Output via `additionalContext`, never `systemMessage`. Cap about 1,500 characters; nothing on stderr; never exit 2; no stdin read; exit at once without `.current`. Opening line frames it as reference: "do not resume work unless the user asks; check `git status` first". Deterministic bytes (no time, fixed order); task file path, not contents. `SK_SESSION_BRIEF=off` opt-out. `check.mjs`: allowed `hooks.json` keys, exec form with bare `node` and `args`, size cap, empty stderr, identical output on two runs. Windows run in done-when | claude-mem, ECC, planning-with-files, context-mode, agnix |
| A2 git preload | Add agnix CC-SK-028 (the `!` must start a line or follow whitespace) to the planned check | agnix |
| A3 resume | Done when it answers the five reboot questions: where am I, where am I going, what is the goal, what have I learned, what have I done | planning-with-files |
| B1 evals | Run with ablation (with and without the plugin) and drop graders that pass both ways; "superficial evidence is a fail" in LLM graders; pressure cases for TDD and verification; a lowered-bar case (a diff adding `.skip`); R3 rebuilds the trigger suite | anthropics/skills, addyosmani, superpowers |
| B2 effort | Add `security-reviewer` to the measured agents | wshobson |
| C1 to C3 | R11, R12, R13 and R2 make them concrete; C3 also checks REMOVED behaviour is gone once R10 exists | graphify, Understand-Anything, OpenSpec |
| D1 learning | Counterfactual drop rule; admission bar (seen in a fixed finding or fix commit, no check covers it, statable without volatile names); a check kept only after it fails on the defect's shape in a throwaway copy; rows carry evidence paths and an optional "retire when"; removed only when the premise is gone | compound-engineering |
| D2 past tasks | Add an `areas:` frontmatter field to the task template; grep `areas:` and titles, read headers, then the top two or three in full; flag a past claim that conflicts with current code, never let it override present evidence | compound-engineering |
| E1 skills | agnix treats `.claude/commands/` as legacy, supporting the move | agnix |
| E2 split | Choose between one tree with `strict: false` marketplace entries (the manifest must then stop declaring components, and versions move to the marketplace) or separate plugin folders with a version-bump check each | anthropics/skills, wshobson, agnix |
| E3 cost log | Not a Stop hook: its payload has no usage, it fires per response and double-counts on resume (ECC logged 2,340 zero rows). Headless runs log from `claude -p --output-format json`; otherwise a report-only reader of on-disk transcripts | ECC, superpowers |
| N3 | Reword the CLAUDE.md line as a description of `docs/tasks/`, not a command | compound-engineering |

## Considered and declined

| Idea | Repository | Why not |
|------|------------|---------|
| Observer model compressing every tool call into memory | claude-mem | A second model per batch, a worker process and a database; every user pays |
| "Instincts" with confidence and decay | ECC | Needs a background model and Python; R16 and D1 keep the useful part |
| Blocking hooks (config protection, Read gates, gated Stop) | ECC, context-mode, planning-with-files | Declined in the post-3.0 plan; R4 catches the same failure in review |
| Knowledge-graph runtimes, tree-sitter, dashboards | graphify, Understand-Anything | Python, WASM, React; R11 to R13 take the ideas with plain prompts |
| Sandboxed output with a search index | context-mode | Node 24, SQLite, Elastic License; R17 takes the idea in prose |
| Terse output style, memory compression | caveman | About 3% gain at a 1,160-token cost; compression sends files to a provider |
| Training loop for skills, transcript harvester | SkillOpt | Needs scored tasks, Python and many runs; R3 takes the rules |
| Per-turn plan injection and progress nudges | planning-with-files | Every user pays every turn |
| Plan attestation by hash | planning-with-files | Its author says it is not proof of approval |
| Multi-tool adapters | wshobson, addyosmani | ADR-003: SK is Claude Code only |
| EARS requirements, parallel markers, feature-flag red phase | cc-sdd | SK uses Given/When/Then, sequential implementers, and its TDD skill already requires a failing test |
| A constraints interview and tool installs | addyosmani | Per-stack; SK's conventions already hold the bar |
| Semantic search over past work | Grok review, compound-engineering | Needs embeddings; D2 grep is enough |

## Licences and credit

| Repository | Licence | Obligation if text is adapted |
|------------|---------|-------------------------------|
| anthropics/skills (`skill-creator`) | Apache-2.0 (no top-level licence) | Credit line; keep NOTICE terms |
| claude-mem, graphify, caveman | Apache-2.0 | Credit line; keep NOTICE terms |
| mksglu/context-mode | Elastic License 2.0 | **Ideas only; copy no text** |
| andrej-karpathy-skills | No licence file; manifest and frontmatter say MIT | Credit line |
| All others listed below | MIT (agnix: MIT or Apache-2.0) | Credit line in the file and in `CHANGELOG.md` |

## Sources

Stars from GitHub search on 2026-11-07. Commits are the ones read.

| Repository | Stars | Commit | Licence | Used for |
|------------|-------|--------|---------|----------|
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 298,756 | `d2ef268` | MIT | hook rules, cost logging, config protection |
| [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | 230,390 | `2c60614` | see licences | working behaviour rules |
| [anthropics/skills](https://github.com/anthropics/skills) | 188,287 | `2c5958e` | Apache-2.0 | description tuning, grading |
| [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | 143,680 | `16218bf` | Apache-2.0 | chunked scans, secrets, claim tags |
| [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | 118,058 | `c310c9d` | Apache-2.0 | read-only explorer format |
| [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem) | 114,158 | `68905cc` | Apache-2.0 | hook matchers, output cap |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 113,787 | `301b02b` | MIT | lowered bar, overlap check, pressure evals |
| [Egonex-AI/Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | 91,156 | `a6ea402` | MIT | commit stamps, reading order, layers |
| [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | 74,198 | `0fa4a97` | MIT | delta specs, verify, scope pauses |
| [wshobson/agents](https://github.com/wshobson/agents) | 42,269 | `4bde316` | MIT | version bumps, argument framing, tiers |
| [mksglu/context-mode](https://github.com/mksglu/context-mode) | 33,629 | `0491ccb` | Elastic-2.0 | output discipline (ideas only) |
| [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) | 27,932 | `8eef6dc` | MIT | hook output, attempts on disk |
| [EveryInc/compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) | 25,964 | `2921168` | MIT | learning loop |
| [microsoft/SkillOpt](https://github.com/microsoft/SkillOpt) | 18,931 | `eb959c3` | MIT | held-out gating |
| [gotalab/cc-sdd](https://github.com/gotalab/cc-sdd) | 3,755 | `e2a0c67` | MIT | coverage gate, carried learnings |
| [agent-sh/agnix](https://github.com/agent-sh/agnix) | 472 | `a3cdab5` | MIT or Apache-2.0 | static checks |
| [obra/superpowers](https://github.com/obra/superpowers) | not in search results | `22f0b46` (v7.0.2) | MIT | reviewer integrity, implied inputs, TDD table |

## Method

- Candidates from GitHub search by stars for Claude skills, Claude Code plugins, subagents, agent skills and spec-driven development, filtered to those relevant to a development lifecycle and not reviewed before (earlier reports: `enhancement-report-external-skills.md`, `superpowers-workflow-analysis.md`, and the October and November plans).
- Five parallel research passes, one per theme, each shallow-cloning its repositories into a scratch directory, reading them as data without running anything, and checking each finding against SK's files.
- Claims that change a recommendation were re-checked directly: X1 and X2 against `init-docs.md` and `update-docs.md`, X3 by running `eval-summary.mjs`, the `$ARGUMENTS` lines by grep.
- Not verified: claims about Claude Code behaviour taken from these repositories (the 10,000-character hook field cap, skill truncation at 20,000 characters after compaction, PostCompact not carrying context). Each is marked where used and must be checked against the Claude Code docs before an item depends on it.
