---
description: Write a customer-facing user guide — task-oriented, verified against code (project)
---

# New User Guide

Create an end-user guide in `docs/user-guides/` for the people who *use* the product
(non-engineers). A thin front door over the **technical-writing** skill with a
customer-audience framing.

**Use when:** Documenting how a customer accomplishes a task with the product. For
developer/feature docs use `/sk:new-feature-doc`; for marketing copy use `/sk:copywrite`.

## Step 1: Load the Skill

Read the technical-writing skill: `.claude/skills/technical-writing/SKILL.md`. Apply it
with a **customer audience**: plain language, task-first, no internal jargon or system
internals.

## Step 2: Read Context

**ALWAYS start by reading:**
1. `docs/system/project-context.md` — what the product does (if it exists)
2. `docs/user-guides/README.md` — existing guides (avoid duplication)
3. `docs/features/README.md` — feature docs, to ground claims in real behavior

**Skip files that are empty or contain only template placeholders.**

## Step 3: Define the Job & Audience

Confirm with the user:
1. **Audience** — who is this for? (end customer, admin, first-time user…)
2. **Job** — the single task the reader wants to accomplish.

One guide = one job. Split multi-job requests into multiple guides.

## Step 4: Verify Against Code (no unshipped features)

Before writing any step, confirm the capability **actually exists** in the product:

1. Use **Grep**/**Read** to locate the feature behind each step (UI route, handler,
   setting, API).
2. If a step describes behavior not present in the code, **flag it and leave it out** —
   do not document unshipped features.

## Step 5: Write the Guide

Create `docs/user-guides/{task-name}.md` from `docs/templates/user-guide.md`.

- Fill `Last updated` (today), `Lifecycle: current`, and `Audience`.
- Lead with the outcome; write numbered steps; include a *"what you'll see"* confirmation
  per step and a troubleshooting table.
- Customer voice throughout — no implementation detail.

## Step 6: Update Index

Add a row to `docs/user-guides/README.md`:

```markdown
| [Guide Title](./task-name.md) | <audience> | current |
```

## Validation

- [ ] Every step maps to a capability verified in the code (Step 4)
- [ ] No unshipped features documented
- [ ] Written for a non-engineer (no jargon, task-first)
- [ ] `Last updated` + `Lifecycle` + `Audience` filled in
- [ ] Added to `docs/user-guides/README.md`

> **Keeping guides current:** when product features change, re-sync with
> `/sk:update-docs` (scope: `user-guides`).
