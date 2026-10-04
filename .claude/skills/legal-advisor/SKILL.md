---
name: legal-advisor
description: Legal & compliance advisor — scans codebase and business context for regulatory requirements (HIPAA, GDPR, PCI, SOC 2) and drafts tailored agreements and policies. Invoked via /sk:legal-scan.
disable-model-invocation: true
---

# Legal Advisor

> Scan. Assess. Generate. Legal foundations for a project, as drafts for an attorney to review.

## Constraints (apply to every mode)

1. **Not legal advice.** Every generated file starts with the disclaimer header in `references/output-layout.md`. Never claim a document is complete or ready to sign.
2. **Everything is saved.** Every output is written as a Markdown file under `docs/legal/`, and `docs/legal/README.md` is created or updated on every run. Never leave a legal document only in the conversation.
3. **Evidence is cited.** Every finding names the `file:line` or the pattern that triggered it. A finding with no evidence is not reported.
4. **The code is the source.** Detect from the codebase before asking. Ask the user only what the code cannot reveal, and never ask something the scan already answered.
5. **Mark what an attorney must decide.** Jurisdiction-sensitive sections carry `[⚖️ ATTORNEY REVIEW — varies by state/country]`. Do not guess dollar amounts for liability caps or penalties.
6. **Regulations change.** State the date of the assessment, and tell the user to confirm current requirements with an authoritative source.

## Modes

The reference files are in this skill's directory, next to this file. Read only the ones the mode needs.

| Mode | What it produces | Read | Saved to |
|------|------------------|------|----------|
| `scan` (default) | Compliance matrix, risk register, document checklist | `references/scan-workflow.md`, `references/detection-signals.md`, `references/compliance-frameworks.md` | `docs/legal/scans/compliance-scan-YYYY-MM-DD.md` |
| `compliance <framework>` | Deep-dive on one framework (HIPAA, GDPR, PCI, SOC 2, CCPA, COPPA, ...) | `references/scan-workflow.md`, `references/compliance-frameworks.md`, `references/detection-signals.md` | `docs/legal/scans/compliance-<framework>-YYYY-MM-DD.md` |
| `founders-agreement` | Founders agreement draft | `references/document-modes.md`, `references/entity-formation.md` | `docs/legal/agreements/founders-agreement.md` |
| `operating-agreement` | LLC operating agreement draft | `references/document-modes.md`, `references/entity-formation.md` | `docs/legal/agreements/operating-agreement.md` |
| `ip-assignment` | IP assignment agreement draft | `references/document-modes.md`, `references/entity-formation.md` | `docs/legal/agreements/ip-assignment.md` |
| `privacy-policy` | Privacy policy from detected data practices | `references/document-modes.md`, `references/detection-signals.md`, `references/compliance-frameworks.md` | `docs/legal/policies/privacy-policy.md` |
| `terms-of-service` | Terms of service for the detected product type | `references/document-modes.md` | `docs/legal/policies/terms-of-service.md` |
| `contract-review <file>` | Clause-by-clause risk assessment | `references/document-modes.md` | `docs/legal/reviews/contract-review-YYYY-MM-DD-<name>.md` |
| `entity-guide` | Entity structure recommendation | `references/document-modes.md`, `references/entity-formation.md` | `docs/legal/scans/entity-guide-YYYY-MM-DD.md` |

## Every run

1. **Read the project context first,** where it exists: `docs/system/project-context.md`, `tech-stack.md`, `api-reference.md`, `integrations.md`, `database-schema.md`, `env-variables.md`. Skip files that are empty or still templates.
2. **Follow the mode's reference file.** It gives the steps, the interview questions and the output format.
3. **Save and index** as `references/output-layout.md` describes: create `docs/legal/` and its subdirectories if they are missing, write the file with the disclaimer header, then add or update its row in `docs/legal/README.md`.
4. **Close** by saying what was saved and where, and offer the next step: generate a document from the checklist, deep-dive a framework, or create tasks for the remediation items.

## Done when

- [ ] The output file exists under `docs/legal/` and starts with the disclaimer header
- [ ] `docs/legal/README.md` lists it
- [ ] Every finding cites its evidence
- [ ] Every jurisdiction-sensitive section is marked for attorney review
