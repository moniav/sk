---
description: Create a new Standard Operating Procedure for a recurring task
disable-model-invocation: true
---

# New SOP

Create a step-by-step procedure in `docs/sop/` for a recurring development task.

## When to Use

Create an SOP when:
- You do the same multi-step task more than twice
- A task involves risk (data migration, deployment, secret rotation)
- The steps must be done in a specific order
- You want Claude Code to execute the task consistently

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — Dense project summary (if it exists)
2. `docs/sop/README.md` — Existing SOPs (avoid duplicates)
3. `docs/templates/sop-procedure.md` — SOP template
4. `docs/conventions/` — Relevant conventions the SOP should enforce

**Skip files that are empty or contain only template placeholders.**

## Step 2: Gather Information

Ask the user:
- **Procedure name**: Short (e.g., "Add a new API endpoint")
- **When to follow this**: One sentence trigger condition
- **Criticality**: High (mistakes cause damage) | Medium | Low
- **Current process**: How do they do it today? What goes wrong?

## Step 3: Analyze the Procedure

If the procedure involves code:
1. **Find existing examples** — Grep for how this was done before in the codebase
2. **Identify the pattern** — What files are touched? What order?
3. **Note the gotchas** — What could go wrong? What's easy to forget?
4. **Check conventions** — What do `docs/conventions/` say about this?

## Step 4: Write the SOP

Save to `docs/sop/kebab-case-name.md` using `docs/templates/sop-procedure.md`.

### Writing Rules

1. **Steps are executable** — Each step has an exact command or action
2. **Steps are ordered** — Cannot be done in a different order
3. **Verification built in** — Include "how to check it worked" after risky steps
4. **Rollback documented** — What to do if something goes wrong
5. **Common pitfalls listed** — Real mistakes people make, with prevention
6. **File paths are exact** — Verified against the codebase
7. **Code examples are real** — Adapted from actual project code, not generic

### Standard SOP Structure

```markdown
# SOP: [Name]

**Last updated:** YYYY-MM-DD
**Criticality:** High | Medium | Low

## Purpose
One sentence: When do you follow this SOP?

## Pre-flight Checklist
- [ ] Prerequisites and preconditions

## Steps
### 1. [Step Name]
What to do, with exact commands.

### 2. [Step Name]
Next step, with verification.

### 3. Verify
How to confirm it all worked.

### 4. Update Docs
Which docs to update.

## Rollback
How to undo if something goes wrong.

## Common Pitfalls
| Pitfall | Prevention |
```

## Step 5: Update SOP Index

Add to `docs/sop/README.md`:

```markdown
| [Procedure Name](./name.md) | When to use | Medium |
```

## Step 6: Validate

- [ ] Every step has an exact action (not vague guidance)
- [ ] Steps can be followed by Claude Code without asking for clarification
- [ ] Rollback procedure exists for risky operations
- [ ] Common pitfalls come from real project experience
- [ ] File paths verified against codebase
- [ ] Added to `docs/sop/README.md`
