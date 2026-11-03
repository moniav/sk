---
name: copywriting
description: Write high-converting SaaS marketing copy — landing pages, headlines, emails, ad copy, CTAs, product descriptions, social posts. Invoked via /sk:copywrite.
disable-model-invocation: true
---

# Copywriting

> Turn features into outcomes, outcomes into desire, desire into action.

## Voice comes from the project first

If `docs/business/brand-voice.md` exists, read it before writing. Its voice, tone by context, vocabulary and banned phrases override everything below.

Otherwise the default voice is: clear over clever, specific over vague, benefit before feature, confident without hype, written the way a sharp colleague talks.

Also follow `../technical-writing/references/plain-writing-rules.md` (relative to this file). Marketing copy breaks those rules more than any other text.

## Before writing

Read `docs/system/project-context.md` and `docs/business/positioning.md` if they exist. Then ask only for what is still missing:

1. **Product:** what it does and who it is for
2. **Goal:** the one action the reader should take
3. **Format:** landing page, email, ad, social post, and so on
4. **Existing copy:** rewrite it, or start fresh

If the brief already answers these, start writing.

## Rules for every piece

- **One job per section.** State the problem, present the solution, build trust, or ask for the action. Not two at once.
- **The customer's words.** The phrases customers use for their pain, not internal product terms.
- **A number or a named outcome wherever a claim is made.** "Used by 2,400 product teams", not "trusted by thousands". Never invent the number: if there is none, ask, or leave a marked placeholder.
- **Answer the objection where it arises.** "No credit card required" belongs next to the sign-up button.
- **Urgency and scarcity only when they are real.**
- **CTA = action verb + what they get.** "Start your free trial", "Book a 15-minute demo". Not "Submit", "Learn more" or "Get started". Match the ask to the commitment.

## By format

**Landing page.** Read `references/landing-page.md` in this skill's directory first: the 5-second test, each section's job and common mistake, and the page-level rules. Hero (headline with the single strongest outcome and the customer, a one or two sentence subheadline, primary CTA with one line of proof beside it and the risk reversal under it), then in this order: proof bar, problem, how it works in three steps, benefits, demo of the real product, proof with names and numbers, pricing when the page sells a plan, FAQ answering real objections, final CTA. Check the hero against the 5-second test before delivering it, and add the page-level rules that apply as build notes. Headline formulas and page structures are in `references/frameworks.md`.

**Landing page audit.** Score an existing page against the audit checklist in `references/landing-page.md`, with evidence for each check, then offer to rewrite what failed.

**Email.** Subject line of four to seven words that the body delivers on. One idea and one CTA per email. Short paragraphs. For a sequence, state the trigger, the timing and the goal of each email; blueprints are in `references/frameworks.md`.

**Ads.** Front-load the value. Give three to five headline variants and two or three description variants, mixing outcome-led, problem-led and proof-led angles, so there is something to test. Check the platform's current character limits before finalising.

**Feature or product description.** `**[Feature]**: [what it does] so you can [outcome the user cares about].` Group features by the user's goal, not by product architecture.

**Social post.** One idea. A hook line, short paragraphs, a takeaway or a soft CTA. In a thread, each post stands alone and leads to the next.

## Output

Deliver copy that is ready to use, not an outline, under clear section labels so it can be copied straight out. Number the variants. Put any note on why an approach was chosen after the copy, briefly.

## Out of scope

Visual design specs: layout grids, colour, type and spacing (`/sk:ui-review` checks the built page). Keyword research, defining brand positioning from nothing (use the positioning command first), and translation.
