---
name: interviewing
description: Shared procedure for questioning the user until no decision is left open — rounds of numbered questions, each with a recommended answer. Loaded by /sk:plan, /sk:brainstorm, /sk:prd and the executive grill mode; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Interviewing

Adapted from the `grilling` skill in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): the design tree, the frontier, rounds with a recommended answer, and facts-versus-decisions.

How to question the user until a plan, an idea or a decision has nothing left open, without wasting their time.

## Decisions are the user's. Facts are yours.

Before asking anything, sort what you do not know:

- **A fact** can be found: in the code, the docs, the config, the git history, a command's output, a primary source on the web. Find it yourself. Never ask the user for something you could look up.
- **A decision** is a choice only the user can make: scope, a trade-off, a preference, a risk they accept. Put it to them.

If a fact will take a while to find, start finding it and ask the questions that do not depend on it in the meantime.

## Ask in rounds

Think of the open decisions as a tree: some can only be asked once others are answered.

1. **A round is every question that can be answered now.** Do not hold back a question that is ready, and do not ask one whose answer depends on another question in the same round.
2. **Number the questions and give each a recommended answer** with one clause of reasoning, so the user can reply "1 yes, 2 b, 3 your call".
3. **Wait for the answers.** Then work out what they unblocked and ask the next round.
4. **Ground every question in this project:** its goals, its code, its earlier decisions. A question that could be asked of any project is usually one you could have answered yourself.

Format a round like this:

```
1. <Short title>: <the question, with the options if there are distinct ones>
   Recommended: <answer>, because <one clause>.

2. <Short title>: <the question>
   Recommended: <answer>, because <one clause>.
```

When a round is four questions or fewer and each has distinct options, use AskUserQuestion with the recommended option first. Otherwise use the numbered list.

## When it is done

Done when no decision is left open: every branch has an answer from the user, or an explicit "your call" that you then decide and state.
Nothing is assumed silently. An assumption you had to make is listed, with why.

A question the user does not answer is not dropped. Record it as open in the place the calling command names (the task's Open Questions table, the executive's `STATE.md`), and ask it again next time.

Before acting on the result, state the decisions back in a short list and get a yes.
