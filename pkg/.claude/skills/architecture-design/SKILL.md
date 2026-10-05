---
name: architecture-design
description: How to propose a technical architecture from flows and requirements, question every decision, and record the hard-to-reverse ones as ADRs. Loaded by /sk:prd, /sk:plan, /sk:cto and /sk:new-adr; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Architecture Design

Propose, then question. An architecture that was never argued with is a guess with a diagram.

## 1. Facts first

In an existing codebase, map what exists before proposing anything: components, data model, patterns, integrations, and the decisions in `docs/decisions/`. Use an Explore subagent for a wide codebase so the raw reading stays out of the conversation. Never ask the user what the code can tell you. Greenfield: there is nothing to verify, so propose and say so.

## 2. Propose each part with a recommendation

Draft every part below, then grill the decisions in rounds (`../interviewing/SKILL.md`): numbered questions, each with your recommended answer.

| Part | Decide |
|------|--------|
| **Components and boundaries** | New, changed, reused; which component owns which data |
| **Stack** (greenfield, or a new kind of component) | Language, framework, database, hosting: chosen from the flows and the NFR numbers, with the boring option as the default |
| **Data model** | Entities named from the glossary, relationships, tenancy, ID format, soft or hard delete, retention, PII fields |
| **Interfaces** | The endpoints, events and jobs each flow step needs; sync or async; which must be idempotent |
| **Integrations** | Each third party, what happens when it fails, the fallback |
| **Access control** | A role × action matrix from the personas and flows |
| **Consistency and concurrency** | Transactions, idempotency keys, double submit, concurrent edits, retries and ordering for background work |
| **Security and privacy** | The threats on the primary flows (spoofing, tampering, exposure, abuse) and the mitigation for each |
| **Observability, deployment, migration** | What is logged and alerted, feature flags, rollout order, migration and backfill from today's data |

## 3. Challenge every decision

For each decision ask, and write the answer down:
- What is the alternative, and why not?
- What breaks at 10× the NFR volume?
- How hard is it to reverse once data or callers depend on it?
- Which existing pattern in this codebase does it follow, or deviate from, and why?

## 4. Traceability

Map every flow step to a component and an interface. A step without a row is a gap to close now, not later.

## 5. ADRs, sparingly

Write an ADR (`docs/decisions/`, from `docs/templates/adr-decision.md`) only when all three hold:

1. **Hard to reverse**: changing it later costs real work.
2. **Surprising without context**: a later reader would ask why.
3. **A real trade-off**: there were genuine alternatives.

Context, decision and why may be one paragraph; options and consequences only when they add something. Qualifying kinds: architectural shape, cross-context integration, lock-in technology, boundary and ownership, deliberate deviation from the obvious path, invisible constraints, non-obvious rejections. Everything else stays in the document that made the decision.

Adapted from the `domain-modeling` skill in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT).

## 6. Independent review

Dispatch the **architecture-reviewer** agent (`sk:architecture-reviewer` under the plugin) with the architecture and the requirements, plus the paths to the existing architecture docs. Put each concern to the user with your recommended answer, and quote its verdict where the decision is logged.
