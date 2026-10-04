---
description: "Legal & compliance expert — detect regulatory requirements; deep-dive frameworks (HIPAA/GDPR/SOC2/PCI); draft agreements, policies & contracts; review contracts; entity guidance"
argument-hint: "[scan|compliance <framework>|privacy-policy|terms-of-service|founders-agreement|operating-agreement|contract-review <file>|entity-guide|ip-assignment]"
disable-model-invocation: true
---

# Legal Scan — Legal & Compliance Expert

Detect which regulations apply to the project, deep-dive a framework, draft legal documents from the project's own context, review a contract, or advise on entity structure. Everything produced is a draft for an attorney to review, not legal advice.

**Mode:** `$ARGUMENTS` (default: `scan`)

| Argument | What it does |
|----------|--------------|
| *(empty)* or `scan` | Full codebase scan: compliance matrix, risk register, document checklist |
| `compliance <framework>` | Deep-dive on one framework (HIPAA, GDPR, PCI, SOC2, CCPA, COPPA, ...) |
| `founders-agreement` | Draft a founders agreement |
| `operating-agreement` | Draft an LLC operating agreement, single or multi-member |
| `ip-assignment` | Draft an IP assignment agreement |
| `privacy-policy` | Draft a privacy policy from detected data practices |
| `terms-of-service` | Draft terms of service for the detected product type |
| `contract-review <file>` | Review a contract file for red flags |
| `entity-guide` | Recommend an entity structure |

If the argument matches none of these, show the table and ask which mode is meant.

## Steps

1. Read `.claude/skills/legal-advisor/SKILL.md`. It holds the constraints that apply to every mode, and its Modes table names the reference files to read for this mode and where the output is saved. The `references/` files are in that skill's directory, next to its `SKILL.md`.
2. Follow the skill's "Every run" steps for the chosen mode.

**Reply:** the mode that ran, the file or files saved with their paths, the top findings or the sections marked for attorney review, anything that could not be determined and why, and the offered next step.
