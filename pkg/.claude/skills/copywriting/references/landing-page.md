# Landing Page Reference

Read this file when writing, rewriting or auditing a landing page. The copy rules are in `../SKILL.md`; headline formulas and page structures are in `frameworks.md` beside this file.

Adapted from the SaaS landing page guide published by Higgsfield ([source](https://claude.ai/artifact/TkJ6e7Whsw6fhcuErqDWCH)), rewritten; its vendor build prompt and example figures are not included. Product visuals adapted from the `stageshow` skill in [benjitaylor/skills](https://github.com/benjitaylor/skills) (MIT), rewritten.

## Contents
1. [The 5-second test](#the-5-second-test)
2. [Section jobs](#section-jobs)
3. [Page-level rules](#page-level-rules)
4. [Product visuals](#product-visuals)
5. [After the first draft](#after-the-first-draft)
6. [Audit checklist](#audit-checklist)

---

## The 5-second test

A visitor who sees only the hero for five seconds can answer:

1. **What is it?** In plain words, no category jargon.
2. **Is it for me?** The customer is named, or obvious.
3. **What do I click?** One button whose label says what happens.

To run it, read only the headline, the subheadline and the button label. If any of the three answers needs the rest of the page, rewrite the hero.

## Section jobs

A landing page has one job: move the visitor to one action. Each section either moves them toward it or removes an obstacle; a section that does neither is cut.

| Section | Job | Common mistake |
|---------|-----|----------------|
| Hero | Pass the 5-second test | Vague headline; no product in sight |
| Proof strip | Make signing up feel safe | Logos or numbers that are not real |
| Problem | Show the pain is understood, in the customer's words | Talking about the company instead of the customer |
| How it works | Make it look easy | More than three steps |
| Benefits | Turn features into outcomes | Feature names and jargon |
| Demo | Prove it is real | Stock photos or abstract art instead of the product |
| Pricing | Make the choice easy | More than three plans; no recommended plan |
| FAQ | Remove the objections that are left | Questions nobody asks |
| Final CTA | Catch the reader who scrolled to the end | No button at the bottom |

Not every page needs every section (a waitlist page has no pricing). Keep this order for the sections it does have.

## Page-level rules

These go beyond the words. Put them in the deliverable as build notes for whoever makes the page.

- **One page, one action.** One primary CTA with the same label everywhere it repeats. No nav links, secondary offers or footer clutter competing with it. A second action ("Book a demo" beside "Start my free trial") only when buyers genuinely split.
- **The product above the fold.** A real screenshot, short clip or interactive preview in the hero. If none exists yet, a marked placeholder or a product illustration built to the rules in *Product visuals* below, never stock imagery.
- **Proof beside the button.** A line of proof (customer count, rating, a named quote) within sight of each primary CTA, not only in the proof strip.
- **Risk reversal under the button.** "No card required · Cancel any time · Set up in 2 minutes": only the parts that are true.
- **Least friction to sign up.** Ask only for what is needed to start, often an email alone. No card for a trial. Social or SSO sign-in where the audience uses it.
- **Pricing on the page.** Two or three plans, one marked as recommended. Designing the plans is `/sk:pricing`'s job.
- **Mobile first, fast.** Hero, CTA and one line of proof fit the first phone screen, and the page loads fast on a phone connection. `/sk:ui-review` checks the built page.
- **One number, one change.** Name the metric the page exists for (trial starts, waitlist joins). When testing, change one thing at a time so a result can be attributed.

Never invent logos, numbers, reviews or customer names. Leave a marked placeholder instead: `[PROOF: customer count]`.

## Product visuals

A real screenshot is often too busy to read at hero size, and before launch there may be nothing to capture. A product illustration (the real interface, simplified) sits between the two. It fails in five ways:

| Failure | Looks like | Fix |
|---------|------------|-----|
| Too much | Real text in every row, numbers everywhere | Real words only where the story is (usually 3 to 7 strings); quiet placeholder bars for the rest |
| Wireframe | Two gray blocks and a button | Keep what identifies the product: its chrome, its title, the rows that give the action a reason |
| Boxed | A whole window shrunk onto a backdrop with even margins | Crop to the panel where the story happens and let the window run off one or two edges |
| Flat | Every element the same weight | One focal object, at most one or two smaller supporting ones overlapping its edge |
| Bland | A gray window whatever the brand | The product's own colors, icons and type |

- **One thing happens.** A still shows the moment after an action (the row archived, the total updated); an animation shows one action and its result in a few seconds.
- **The poster frame tells the story alone.** Thumbnails, screenshots and visitors with reduced motion see one frame of an animation. Choose the frame where the result is on screen, never one caught mid-change.
- **No invented marks.** No made-up logos, no stock AI sparkles, no letter in a colored square standing in for a brand.
- **Built for a phone too.** At phone width it is redesigned for the column (a tighter crop, fewer elements), not shrunk.

Building such visuals in React, with a component kit and a script that films and checks them, is what the `stageshow` skill in benjitaylor/skills does; install it beside SK when a page needs them.

## After the first draft

Offer two follow-ups:

1. **Hero rewrite against the 5-second test.** Three hero variants, each stating the outcome and the customer, with the three answers written out under each.
2. **Weakest section redo.** Name the section most likely to lose readers, say why in one line, and rewrite it.

## Audit checklist

For an existing page. Mark each check Pass, Fail or Not checked, with the evidence: the quoted copy, or what is missing. Then list the failures worst first, by how many visitors each is likely to lose, with the fix for each.

| # | Check |
|---|-------|
| 1 | Passes the 5-second test |
| 2 | Headline states the outcome and the customer |
| 3 | One primary action; the same button repeats, including at the bottom |
| 4 | Button label says what happens |
| 5 | Product visible above the fold |
| 6 | Proof sits beside the button |
| 7 | Features written as benefits |
| 8 | Risk reversal under the button |
| 9 | Two or three pricing plans, one highlighted (when pricing is on the page) |
| 10 | FAQ answers real objections |
| 11 | Sign-up asks only for what is needed to start |
| 12 | Works and loads fast on mobile |
| 13 | Copy, screenshots and visuals look like one company |
| 14 | The hero visual reads as the real product, shows one thing happening, and (when animated) its poster frame tells the story alone |

Checks 5, 11, 12, 13 and 14 need the live page or its code. From copy alone, mark them Not checked and say what would settle each.
