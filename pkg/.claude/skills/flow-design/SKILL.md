---
name: flow-design
description: How to walk a user flow and then attack every step until each edge and failure case has a decided behaviour. Loaded by /sk:prd, /sk:plan (UI tasks) and /sk:new-flow; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Flow Design

The worst-case rows draw on the `break-ui` skill in [emilkowalski/skill](https://github.com/emilkowalski/skill) and the scenario probing on `domain-modeling` in [mattpocock/skills](https://github.com/mattpocock/skills) (both MIT).

A flow is settled when a reader can follow it from trigger to end state and knows what happens at every step when things go wrong. "Handle errors" is not a decision; the message, the recovery path and what is preserved are.

## 1. List the flows

One flow per persona per job. Propose the full list and ask what is missing. Always check the flows that get forgotten:

first use and empty state · sign-up and invite · roles and permissions · settings · notifications · billing and plan limits · export · delete and account closure · admin and support · the existing flows this change touches

## 2. Walk each flow

Primary flows first. For each: **persona, trigger, preconditions, end state**, then the numbered steps as *user does / system does*. Draw it as a Mermaid `flowchart` (add `%%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%` above 15 nodes). Where several components take part in a step, add a `sequenceDiagram` for that step: it is where timeouts, retries and double submits become visible.

For every entity with a status (order, case, subscription), draw a `stateDiagram-v2`. Each transition is a requirement; a state that cannot be reached or left is a question.

## 3. Attack each step

Go through the table for every step. Put the rows that apply to the user as a round, each with your recommended behaviour.

| Attack | Ask |
|--------|-----|
| Bad input | Invalid, duplicate, too long, wrong format: what exactly happens, and what is kept? |
| Empty and first use | Nothing exists yet: what does the user see and do? |
| Limits | 0, exactly 1, many, the plan limit, the largest value accepted? |
| Permissions | Who may do this? What does someone without the right see? Cross-tenant? |
| Dependency down | The API, payment provider, email or model fails or times out: then what? |
| Abandon and return | They leave halfway: is progress kept? For how long? |
| Concurrency | Double click, two tabs, two users on the same record? |
| Undo | Reversible? Until when? Who is told? |
| Notification | Who needs to know this happened, through which channel, how soon? |
| Language and access | RTL and mixed-direction text, translation, keyboard and screen reader |
| Audit and compliance | Logged, retained, consented to, deletable on request? |

Each decided behaviour becomes a row in the flow's edge-case table (case, step, behaviour, requirement id), or an explicit non-goal.

## 4. Prototype when the question is how it should look or behave

For the primary flow, and for any step where the open question is look or behaviour rather than logic, read `../prototype/SKILL.md` and follow it. Offer it; the user may decline per flow. Record the chosen variant and why, and turn what the choice decided into requirements.

## 5. Settled when

- Every step has a system response, including its failure response.
- Every row of the attack table that applies has a decided behaviour or a stated non-goal.
- Every decided behaviour has a requirement id.
- Terms in the flow match the glossary.
