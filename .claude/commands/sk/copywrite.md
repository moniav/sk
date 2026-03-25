---
description: Write marketing copy — landing pages, emails, ads, CTAs, social posts (project)
---

# Copywriting — SaaS Marketing Copy

Write high-converting marketing copy for SaaS and tech products. Produces ready-to-use copy across all formats.

## Step 1: Load the Skill

Read the copywriting skill: `.claude/skills/copywriting/SKILL.md`

Follow all instructions in the skill for voice, principles, and output format.

## Step 2: Gather Context

Check if `docs/system/project-context.md` exists — read it for product context.

Then confirm with the user:

1. **Product** — What does it do? Who is it for? (skip if project context covers this)
2. **Format** — What type of copy? Options:

| Format | What you'll get |
|--------|----------------|
| **Landing page** | Full page: hero, problem, solution, proof, CTA |
| **Hero section** | Headline + subheadline + CTA + social proof line |
| **Email** | Single email with subject line + body |
| **Email sequence** | Multi-email flow with timing and goals |
| **Ad copy** | 3-5 headline + description variants |
| **Product description** | Feature blocks framed as benefits |
| **Social post** | LinkedIn or Twitter/X post |
| **CTA options** | 5-10 CTA variants for a specific action |
| **Full page rewrite** | Rewrite existing copy (user provides current) |

3. **Goal** — What action should the reader take? (sign up, buy, book demo, etc.)
4. **Audience** — Any specifics beyond the default SaaS buyer?

If the user provided $ARGUMENTS, use that as the brief and only ask what's missing.

## Step 3: Load Frameworks (if needed)

For landing pages, email sequences, or full rewrites, also read:
`.claude/skills/copywriting/references/frameworks.md`

Use the relevant headline formulas, page structures, and persuasion frameworks — don't use them all, pick what fits.

## Step 4: Write the Copy

Produce **ready-to-use copy**, not outlines or suggestions.

**Rules:**
- Structure output with clear section headers — the user should be able to copy-paste
- For headlines and CTAs, provide 3-5 numbered variants
- Apply psychology principles naturally — don't label them
- Every section earns its place — cut anything that doesn't advance the goal
- Be specific: real numbers, concrete outcomes, named pain points
- Match CTA intensity to commitment level

## Step 5: Present & Iterate

Present the copy with section labels. Then ask:

> **How does this feel?** I can adjust tone, try different angles, or rework specific sections.

If the user wants changes:
- Rework the specific sections they flag
- Offer A/B variants if they're unsure between approaches
- Tighten or expand based on feedback

## Step 6: Save Output (Optional)

Ask: **"Save this copy to `docs/marketing/{format}-{topic}.md`?"**

If yes, save with a brief header noting the product, audience, and date.
