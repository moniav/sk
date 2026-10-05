---
description: Create an Architecture Decision Record for a significant technical decision
argument-hint: "[decision topic]"
disable-model-invocation: true
---

# New ADR

Record a significant technical decision in `docs/decisions/`.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Write the text to the rules in `${CLAUDE_PLUGIN_ROOT}/.claude/skills/technical-writing/references/plain-writing-rules.md` (`docs/business/brand-voice.md` overrides them if it exists).

## When to Use

Apply the three-gate test in `${CLAUDE_PLUGIN_ROOT}/.claude/skills/architecture-design/SKILL.md` (section 5): hard to reverse, surprising without context, a real trade-off. When one gate fails, say so and record the decision where it was made instead. Typical cases:
- Choosing between multiple viable technologies or approaches
- Deviating from an established pattern in the codebase
- Making a decision that's hard to reverse
- Adopting a new tool, library, or framework
- Changing how a cross-cutting concern (auth, errors, logging) works

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/decisions/README.md` — Existing decisions (check for conflicts/supersedes)
3. `docs/templates/adr-decision.md` — ADR template
4. `docs/architecture/README.md` — Current architecture context
5. `docs/system/tech-stack.md` — Current stack

**Skip files that are empty or contain only template placeholders.**

## Step 2: Gather Information

Ask the user:
- **What decision was made?** One sentence.
- **What options were considered?** At least 2 alternatives.
- **Why this choice?** Key reasons and trade-offs.
- **Does this supersede an existing ADR?**

## Step 3: Generate Metadata

1. **Find next number**: Scan `docs/decisions/` for `NNN-*.md`, increment highest
2. **Filename**: `NNN-kebab-case-title.md` (e.g., `002-use-redis-for-caching.md`)
3. **Status**: `Accepted` (default) or `Proposed` (if still under discussion)

## Step 4: Research Options

For each option considered, document:
- What it is (one sentence)
- Pros (concrete benefits for this project)
- Cons (concrete drawbacks for this project)
- Reference existing patterns in the codebase if relevant

## Step 5: Create ADR

Save to `docs/decisions/NNN-kebab-case-title.md` using `docs/templates/adr-decision.md`.
If `docs/decisions/` doesn't exist yet (minimal install), create it with a stub README index first.

**Key writing rules:**
- Be specific to THIS project, not generic
- Mention concrete code/file impacts
- Acknowledge trade-offs honestly
- Link to related ADRs

## Step 6: Update Decision Log

Add to `docs/decisions/README.md`:

```markdown
| NNN | [Decision title](./NNN-title.md) | Accepted | YYYY-MM-DD |
```

If superseding an existing ADR:
1. Update the old ADR's status to `Superseded`
2. Add `Superseded by: ADR-NNN` to the old ADR
3. Update the decision log table for both entries

## Step 7: Update Related Docs

- `docs/system/tech-stack.md` — if a new technology was chosen
- `docs/architecture/README.md` — if architecture was affected
- Relevant task files — if this decision impacts current work

**Never delete old ADRs** — mark as superseded with a link to the replacement.
