---
description: "Legal & compliance expert — detect regulatory requirements; deep-dive frameworks (HIPAA/GDPR/SOC2/PCI); draft agreements, policies & contracts; review contracts; entity guidance"
argument-hint: "[scan|compliance <framework>|privacy-policy|terms-of-service|founders-agreement|operating-agreement|contract-review <file>|entity-guide|ip-assignment]"
disable-model-invocation: true
---

# Legal Scan — Legal & Compliance Expert

Your project's legal advisor. Far more than a scanner: detect what regulations apply, do
framework compliance deep-dives, generate legal documents, review contracts, and advise on
entity structure — all backed by the `legal-advisor` skill. (Drafts only — not legal advice;
have an attorney review before relying on anything.)

**Use this when:** You need to know what legal/compliance requirements apply, generate legal
documents (privacy policy, founders/operating agreement, ToS, IP assignment…), review a
contract for red flags, or get a compliance deep-dive on a specific framework.

## Arguments

`$ARGUMENTS` determines the mode:

| Argument | What It Does |
|----------|-------------|
| *(empty)* or `scan` | Full codebase scan → compliance matrix + risk register + document checklist |
| `compliance <framework>` | Deep-dive on a specific framework (HIPAA, GDPR, PCI, SOC2, CCPA, COPPA, etc.) |
| `founders-agreement` | Generate founders agreement from project context |
| `operating-agreement` | Generate LLC operating agreement (single or multi-member) |
| `privacy-policy` | Generate privacy policy from detected data practices |
| `terms-of-service` | Generate ToS based on detected product type |
| `contract-review <file>` | Review a contract file for red flags and risk |
| `entity-guide` | Recommend entity structure for your business |
| `ip-assignment` | Generate IP assignment agreement |

**Mode: $ARGUMENTS** (default: scan)

## Step 1: Load Skill

Read `${CLAUDE_PLUGIN_ROOT}/.claude/skills/legal-advisor/SKILL.md` — this is the core skill with the full framework.

Based on the mode, also read the relevant reference:
The `references/` files named in this command are in that skill's directory, next to its `SKILL.md`.

- For `scan`, `compliance`, `entity-guide`: read `references/detection-signals.md` and `references/compliance-frameworks.md`
- For `founders-agreement`, `operating-agreement`, `ip-assignment`: read `references/entity-formation.md`
- For `privacy-policy`, `terms-of-service`: read `references/compliance-frameworks.md` (for framework-specific requirements)
- For `contract-review`: no extra references needed — the SKILL.md has the review checklist

All document modes save under `docs/legal/`. If that home doesn't exist yet (minimal
install), create it (with `agreements/`, `policies/`, `scans/` subdirs and a stub README) first.

## Step 2: Read Project Context

**ALWAYS start by reading (if they exist):**
1. `docs/system/project-context.md` — Project summary
2. `docs/system/tech-stack.md` — Framework, language, dependencies
3. `docs/system/api-reference.md` — API endpoints and data flows
4. `docs/system/integrations.md` — External service connections
5. `docs/system/database-schema.md` — Database schema and data models
6. `docs/system/env-variables.md` — Environment configuration

These files give you a head start before scanning code.

## Step 3: Execute Mode

### Mode: `scan` (default)

Full codebase analysis. Follow the SKILL.md phases 1-5:

**3a. Automated Codebase Scan**

Use `references/detection-signals.md` as your search playbook. Run Grep searches in parallel across these categories:

1. **PII signals** — email, phone, ssn, address, dob in models/schemas
2. **PHI signals** — patient, diagnosis, medication, FHIR, HL7
3. **Payment signals** — stripe, card_number, payment_intent, billing
4. **Children's data** — age_gate, parental_consent, under_13
5. **Biometric signals** — fingerprint, face_recognition, voice_print
6. **AI/ML signals** — training_data, model, predict, classify
7. **Integration signals** — analytics, tracking, third-party SDKs
8. **Infrastructure signals** — encryption, auth, logging patterns
9. **Geography signals** — locales, currencies, GDPR/CCPA references

For each signal found, record: file, line, category, implied framework, confidence level.

**3b. Business Context Interview**

After scanning, ask only what the code didn't reveal:
- Entity type (LLC, C-Corp, sole prop, not yet formed)
- Number of founders and equity situation
- Business stage (idea, MVP, launched, raising capital)
- Target market and jurisdictions
- Industry vertical (if not obvious from code)
- Revenue model

**3c. Generate Compliance Matrix**

Map all findings to frameworks using `references/compliance-frameworks.md`:

```markdown
## Compliance Matrix — [Project Name]

| Framework | Applies? | Evidence | Priority |
|-----------|----------|----------|----------|
| HIPAA | ✅/❌/⚠️ | [what was found] | 🔴/🟡/🟢 |
| GDPR | ... | ... | ... |
```

**3d. Generate Risk Register**

Group by severity (Critical → Important → Advisory):
- Every finding cites the file:line that triggered it
- Each risk has a specific remediation action

**3e. Generate Document Checklist**

Prioritized by urgency:
- Must Have (before launch)
- Must Have (before revenue)
- Should Have (within 90 days)
- Plan For (next milestone)

Offer to generate any document from the checklist.

---

### Mode: `compliance <framework>`

Deep-dive on one framework (e.g., `/sk:legal-scan compliance HIPAA`).

1. Read `references/compliance-frameworks.md` — the specific framework section
2. Run targeted scans for that framework's signals
3. Produce:
   - **Applicability assessment** — does this framework apply and why?
   - **Gap analysis** — what's in place vs what's missing
   - **Remediation roadmap** — prioritized steps with effort estimates
   - **Evidence inventory** — what documentation and controls are needed
   - **Technical requirements** — specific code/infrastructure changes needed

---

### Mode: `founders-agreement`

1. Read `references/entity-formation.md` — Founders Agreement template
2. Scan git history for contributors: `git shortlog -sne --all`
3. Interview:
   - Legal names of all founders
   - Roles and responsibilities
   - Equity split and vesting preferences
   - Capital contributions (cash, IP, sweat equity)
   - Pre-existing IP being contributed
   - Decision-making preferences (unanimous vs majority vs domain-based)
   - Non-compete preferences (note: unenforceable in some states)
   - Departure terms philosophy
4. Fill template with project-specific details
5. Mark all jurisdiction-sensitive sections with `[⚖️ ATTORNEY REVIEW]`
6. Save to `docs/legal/agreements/founders-agreement.md`

---

### Mode: `operating-agreement`

1. Read `references/entity-formation.md` — Operating Agreement template
2. Determine: single-member or multi-member LLC
3. Interview:
   - Member names, addresses, ownership percentages
   - Capital contributions
   - Management structure (member-managed vs manager-managed)
   - Profit/loss distribution method
   - Transfer restrictions and buy-sell provisions
4. Fill template
5. Save to `docs/legal/agreements/operating-agreement.md`

---

### Mode: `privacy-policy`

1. Run the PII/PHI/payment/tracking scan from Phase 1
2. Identify all data collection points (forms, APIs, analytics, cookies)
3. Map third-party data sharing (every integration = potential data processor)
4. Determine applicable frameworks (GDPR, CCPA, COPPA, etc.)
5. Interview for:
   - Company legal name and contact info
   - Data retention periods
   - Cookie/tracking policy decisions
   - Data subject rights process
6. Generate policy that accurately reflects what the code actually does
7. Save to `docs/legal/policies/privacy-policy.md`

---

### Mode: `terms-of-service`

1. Detect product type from codebase:
   - **SaaS** — subscription models, dashboards, team features
   - **Marketplace** — buyers + sellers, listings, transactions
   - **API/Platform** — API keys, rate limits, developer docs
   - **Consumer app** — user accounts, content, social features
   - **E-commerce** — products, cart, checkout, shipping
2. Interview for:
   - Acceptable use boundaries
   - Liability preferences
   - Governing law jurisdiction
   - Dispute resolution preference (arbitration vs courts)
3. Generate ToS tailored to product type
4. Save to `docs/legal/policies/terms-of-service.md`

---

### Mode: `contract-review <file>`

1. Read the contract file specified
2. Analyze clause by clause for:
   - Unfavorable indemnification
   - Unlimited liability exposure
   - Broad IP assignment (are you giving away core IP?)
   - Auto-renewal with difficult termination
   - Non-compete overreach
   - Data handling obligations you can't meet
   - Governing law and jurisdiction concerns
   - Missing limitation of liability
   - Ambiguous scope of work
   - Payment terms and late fees
3. Output clause-by-clause risk assessment:

```markdown
## Contract Review — [Document Name]

| Clause | Section | Risk | Finding | Recommendation |
|--------|---------|------|---------|----------------|
| Indemnification | §4.2 | 🔴 | Unlimited, one-way | Negotiate mutual + cap |
| IP Assignment | §7.1 | 🔴 | Assigns all work product | Narrow to deliverables |
| Term | §9 | 🟡 | Auto-renews, 90-day notice | Add 30-day notice option |
```

---

### Mode: `entity-guide`

1. Read `references/entity-formation.md` — Entity Selection Guide
2. Interview:
   - Number of founders/owners
   - Planning to raise venture capital?
   - Revenue expectations (year 1, year 3)
   - Where founders are located (state, country)
   - Industry (any regulated?)
   - Personal liability concerns
3. Present recommendation with comparison table
4. Include state selection guidance (Delaware vs Wyoming vs home state)
5. Outline next steps for formation

---

### Mode: `ip-assignment`

1. Read `references/entity-formation.md` — IP Assignment template
2. Scan for pre-existing code: `git log --reverse --format='%an|%ae|%ai' | head -1`
3. Interview:
   - Who created code before company formation?
   - Any open source components to declare?
   - Any prior employer IP concerns?
4. Fill template with specific repos, assets, and IP being assigned
5. Save to `docs/legal/agreements/ip-assignment.md`

## Step 4: Save All Outputs to `docs/legal/`

Every output MUST be saved as a markdown file. Create directories as needed.

**Directory structure:**
```
docs/legal/
├── README.md                              ← Index (create/update every run)
├── scans/
│   ├── compliance-scan-YYYY-MM-DD.md      ← Full scan reports
│   └── compliance-FRAMEWORK-YYYY-MM-DD.md ← Framework deep-dives
├── agreements/
│   ├── founders-agreement.md
│   ├── operating-agreement.md
│   └── ip-assignment.md
├── policies/
│   ├── privacy-policy.md
│   ├── terms-of-service.md
│   └── cookie-policy.md
└── reviews/
    └── contract-review-YYYY-MM-DD-{name}.md
```

**File mapping by mode:**

| Mode | Save to |
|------|---------|
| `scan` | `docs/legal/scans/compliance-scan-YYYY-MM-DD.md` |
| `compliance HIPAA` | `docs/legal/scans/compliance-hipaa-YYYY-MM-DD.md` |
| `founders-agreement` | `docs/legal/agreements/founders-agreement.md` |
| `operating-agreement` | `docs/legal/agreements/operating-agreement.md` |
| `ip-assignment` | `docs/legal/agreements/ip-assignment.md` |
| `privacy-policy` | `docs/legal/policies/privacy-policy.md` |
| `terms-of-service` | `docs/legal/policies/terms-of-service.md` |
| `contract-review` | `docs/legal/reviews/contract-review-YYYY-MM-DD-{name}.md` |
| `entity-guide` | `docs/legal/scans/entity-guide-YYYY-MM-DD.md` |

**After saving each file:**
1. Update `docs/legal/README.md` — add or update the entry in the index table
2. If `docs/legal/README.md` doesn't exist, create it with the index template from the skill

## Step 5: Disclaimer

Every generated file MUST start with:

```markdown
---
⚖️ DRAFT — NOT LEGAL ADVICE. This document was generated by AI as a starting
template. It must be reviewed and customized by a qualified attorney before use.
Laws vary by jurisdiction and change frequently. Last generated: [DATE].
---
```

## Step 6: Follow Up

1. Confirm what was saved and where
2. Offer next steps:
   - "Want me to generate any documents from the checklist?"
   - "Want a deep-dive on any specific framework?"
   - "Want to create tasks for the remediation items?"
