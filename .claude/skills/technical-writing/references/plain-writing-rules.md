# Plain writing rules

Rules for any text a person will read: docs, commit messages, PR bodies, changelogs, announcements, replies.
Apply them while drafting. A cleanup pass afterwards misses most of these.

Rule numbers are stable. Other files cite them, so a removed rule leaves a gap rather than renumbering.

If the project has `docs/business/brand-voice.md`, it overrides anything here, and it is where the optional style rules (S1 to S4) are switched on.

Adapted from the `unslop` skill in cursor/plugins (pstack), MIT licensed: https://github.com/cursor/plugins/tree/main/pstack/skills/unslop

## Contents

- Content (1-3)
- Wording (4-9)
- Filler and chat residue (10-14)
- Plain speech (15-20)
- Punctuation (21)
- Optional style rules (S1-S4)
- Self-check

## Content

1. **Say what happened, not how significant it is.** Cut "pivotal", "a testament to", "evolving landscape", "sets the stage for". State the fact.
2. **Name the source or drop the claim.** "Experts believe" and "industry reports suggest" are not sources.
3. **No trailing -ing commentary.** "...highlighting the need for", "...ensuring reliability", "...reflecting a broader trend" add nothing. Delete the clause, or replace it with the specific consequence.

## Wording

4. **Plain words.** Not "utilize", "leverage", "facilitate", "delve", "crucial", "robust", "seamless", "enhance", "showcase", "underscore". Use "use", "help", "important", or the specific thing meant.
5. **"Is" and "has".** Not "serves as", "stands as", "boasts", "features".
6. **State the point.** Not "it's not just X, it's Y".
7. **Use the natural count.** Do not pad a list to three items or trim it to three.
8. **One word per thing.** Pick a term and repeat it. Cycling through synonyms makes the reader wonder whether they are different things.
9. **No abstract metaphor nouns.** "Substrate", "primitive", "surface", "north star", "flywheel", "scaffolding", "paradigm": write the concrete word ("base", "building block", "interface", "goal").

## Filler and chat residue

10. **Cut filler.** "In order to" is "to". "Due to the fact that" is "because". "It is important to note that" is nothing.
11. **Hedge once, where the doubt is.** Not "could potentially possibly".
12. **No chatbot phrases.** "Great question", "I hope this helps", "Let me know if", "Certainly".
13. **No generic endings.** "The future looks bright" and "in conclusion, X is a powerful tool" say nothing. End on the last fact or the next step.
14. **No knowledge disclaimers.** "While specific details are limited" means: find the detail, or leave the topic out.

## Plain speech

15. **Say what it does, not how it feels.** "A column rename fails the build", not "types that follow your schema". If the sentence could appear unchanged in another project's docs, it says nothing about this one: cut it.
16. **One idea per sentence.** If the reader has to backtrack, split it.
17. **Active voice, named actor.** "The loader parses the file", not "the file is parsed". Passive is fine when the actor is unknown or irrelevant.
18. **A stronger verb or a number instead of an adverb.** "Cuts build time from 40s to 12s", not "significantly improves build time".
19. **Literal over figurative.** "A parameter worth varying", not "a dial worth turning". No personified code.
20. **Whole sentences.** No arrows, dropped articles or symbol shorthand that the reader has to decode. "The parser rejects a bad date, exits with code 2 and writes nothing", not "bad date → exit 2, no write".

## Punctuation

21. **No em dash.** Use a comma, a colon, a full stop, or restructure the sentence. Do not substitute a hyphen or an en dash.

Do not "correct" punctuation inside quoted material, third-party text or text the user supplied.

## Optional style rules

Off unless `brand-voice.md` turns them on.

- **S1. Sentence-case headings.** "Getting started", not "Getting Started".
- **S2. Straight quotes** in source text. (Typographic quotes in a rendered PDF are a rendering step, not a source-text choice.)
- **S3. A colon only before a list or an example,** never as a mid-sentence connector.
- **S4. Bold sparingly.** Not on every proper noun, and not as a label that restates its own line ("**Performance:** Performance improved...").

## Self-check

Before sending, read the text once asking: which sentences would a reader skip? Cut those. Then check rules 4, 10, 15 and 21, which are the ones most often missed.
