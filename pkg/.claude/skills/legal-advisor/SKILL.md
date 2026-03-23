---
name: legal-advisor
description: >
  Scans your codebase and business context to surface legal, compliance, and
  regulatory requirements — then generates tailored document drafts. Use this skill
  when the user asks about legal requirements, compliance needs, privacy policy,
  terms of service, founders agreement, operating agreement, HIPAA, GDPR, PCI,
  SOC 2, or any legal/regulatory question related to their project. Also triggers
  when starting a new project and legal foundations haven't been established, when
  preparing for fundraising, when adding payment processing or health data, or when
  the user says "what legal stuff do I need" or "am I compliant".
---

# Legal Advisor

> Scan. Assess. Generate. — Legal foundations for your project.

**Disclaimer:** This skill assists with legal workflows but does not provide legal advice.
All generated documents are starting templates that must be reviewed by a qualified attorney
before use. Regulatory requirements change frequently — verify current requirements with
authoritative sources. Never rely solely on AI-generated legal documents for binding agreements.

## Sub-Commands

| Command | What It Does |
|---------|-------------|
| `scan` (default) | Full codebase scan → compliance matrix + risk register + document checklist |
| `compliance` | Deep-dive on a specific framework (HIPAA, GDPR, PCI, SOC 2, etc.) |
| `founders-agreement` | Generate founders agreement based on project context |
| `operating-agreement` | Generate LLC operating agreement |
| `privacy-policy` | Generate privacy policy from detected data practices |
| `terms-of-service` | Generate ToS based on product type |
| `contract-review` | Review a contract file against common red flags |
| `entity-guide` | Recommend entity structure based on business context |

If no sub-command is given, run `scan`.

## Phase 1: Codebase Scan

Scan the project automatically to detect legal signals. Use Grep and Glob — do not ask the user to describe their stack when the code already tells you.

### Data Type Detection

Search for these patterns and classify what the project handles:

**Personally Identifiable Information (PII):**
```
Grep patterns: email, phone, address, ssn, social_security, date_of_birth,
  passport, driver_license, national_id, ip_address, geolocation, name
  (in schema/model files)
```

**Protected Health Information (PHI):**
```
Grep patterns: patient, diagnosis, medication, prescription, treatment,
  health_record, medical, hl7, fhir, icd_code, npi, provider, lab_result,
  vital_sign, allergy, immunization, PHI, HIPAA, covered_entity
```

**Financial / Payment Data:**
```
Grep patterns: card_number, cvv, pan, account_number, routing_number,
  stripe, braintree, adyen, payment_intent, charge, subscription,
  billing, invoice, plaid, bank_account
```

**Children's Data:**
```
Grep patterns: age, under_13, parental_consent, coppa, child, minor,
  guardian, age_gate, age_verification
```

**Biometric Data:**
```
Grep patterns: fingerprint, face_recognition, facial, voice_print,
  retina, biometric, face_id, touch_id
```

**Employee / HR Data:**
```
Grep patterns: salary, ssn, employee_id, payroll, w2, w4, i9,
  performance_review, compensation, benefits
```

### Integration Detection

```
Grep patterns: stripe, twilio, sendgrid, aws, gcp, azure, firebase,
  analytics, segment, mixpanel, amplitude, intercom, zendesk, slack,
  oauth, saml, ldap, sso
```

### Infrastructure Detection

```
Grep/Glob: Dockerfile, docker-compose, terraform, .env, kubernetes,
  helm, cloudformation, serverless.yml, vercel.json, netlify.toml,
  encryption, bcrypt, argon2, jwt, ssl, tls, certificate
```

### Geography Detection

```
Grep: i18n, locale, en-US, en-GB, de-DE, fr-FR, GDPR, CCPA,
  timezone, currency, EUR, GBP, VAT, tax_rate
```

## Phase 2: Business Context Interview

After scanning, ask the user to fill gaps the code can't reveal:

1. **Entity structure** — "What type of business entity is this? (LLC, C-Corp, sole prop, partnership, not yet formed)"
2. **Founders** — "How many founders? What are their roles and equity split?"
3. **Stage** — "What stage? (idea, MVP, launched, revenue, raising capital)"
4. **Market** — "Who are your users? (consumers, businesses, both) Which countries?"
5. **Industry** — "Any regulated industry? (healthcare, finance, education, cannabis, alcohol, firearms)"
6. **Revenue model** — "How do you make money? (SaaS, marketplace, transactional, ads, freemium)"

Only ask questions the codebase scan didn't already answer. If the scan found Stripe + EU locales + health data fields, don't ask "do you handle payments in Europe with health data?"

## Phase 3: Compliance Matrix

Map detected signals to frameworks. Read `references/compliance-frameworks.md` for the full framework details.

### Output Format

```markdown
## Compliance Matrix — [Project Name]

| Framework | Applies? | Evidence | Priority |
|-----------|----------|----------|----------|
| HIPAA | ✅ Yes | PHI fields in Patient model, no BAA on file | 🔴 Critical |
| GDPR | ✅ Yes | EU locales, user PII, no consent mechanism | 🔴 Critical |
| PCI DSS | ⚠️ Likely | Stripe integration (tokenized — good), but check data flow | 🟡 Medium |
| COPPA | ❌ No | No age-related fields or children's features detected | — |
| SOC 2 | ⚠️ Recommended | B2B SaaS pattern detected, enterprise will ask for this | 🟡 Plan |
| ADA/508 | ⚠️ Check | Web app detected, no a11y testing found | 🟡 Medium |
```

## Phase 4: Risk Register

```markdown
## Risk Register

### 🔴 Critical — Address Before Launch

| # | Risk | Evidence Found | Action |
|---|------|---------------|--------|
| 1 | [specific risk] | [file:line or pattern found] | [specific action] |

### 🟡 Important — Address Within 30 Days

| # | Risk | Evidence Found | Action |
|---|------|---------------|--------|

### 🟢 Advisory — Plan for Next Quarter

| # | Risk | Evidence Found | Action |
|---|------|---------------|--------|
```

## Phase 5: Document Checklist

Based on all findings, generate a prioritized checklist:

```markdown
## Legal Document Checklist

### Must Have (before launch)
- [ ] Privacy Policy — you collect PII (email, name, address)
- [ ] Terms of Service — public-facing app with user accounts
- [ ] [Framework]-specific docs based on findings

### Must Have (before revenue)
- [ ] Founders Agreement — 2+ contributors in git history
- [ ] Operating Agreement — if LLC
- [ ] IP Assignment — ensure company owns the code

### Should Have (within 90 days)
- [ ] Cookie Policy — analytics/tracking detected
- [ ] DMCA Policy — if user-generated content
- [ ] Contractor Agreement template — if using contractors

### Plan For (next milestone)
- [ ] SOC 2 preparation — if selling to enterprise
- [ ] D&O Insurance — if raising capital
- [ ] Employee handbook — if hiring
```

After presenting the checklist, offer: "Want me to generate any of these documents? I can draft them based on your project context. Use a sub-command like `founders-agreement` or `privacy-policy`."

---

## Sub-Command: `founders-agreement`

Read `references/entity-formation.md` for the full template.

**Gather from context + interview:**
- Founder names and roles
- Equity split and vesting schedule
- IP assignment terms (who built what before forming?)
- Decision-making (unanimous vs majority vs domain-based)
- Departure terms (voluntary/involuntary, what happens to equity)
- Non-compete/non-solicit scope
- Expense and compensation policy
- Deadlock resolution mechanism

**Generate** a complete founders agreement draft with all sections filled from project context. Mark sections that need attorney review with `[⚖️ ATTORNEY REVIEW]`.

## Sub-Command: `operating-agreement`

Read `references/entity-formation.md` for the full template.

**For single-member LLC:**
- Member name and address
- Management structure
- Capital contributions
- Profit/loss allocation
- Dissolution terms

**For multi-member LLC:**
- All member names, addresses, ownership percentages
- Capital contributions (cash, IP, services)
- Profit/loss distribution method
- Management structure (member-managed vs manager-managed)
- Voting rights and thresholds
- Transfer restrictions and right of first refusal
- Buy-sell provisions (death, disability, departure)
- Non-compete provisions
- Dissolution triggers and process

## Sub-Command: `privacy-policy`

Generate from scan results. The policy must accurately reflect what the code actually does:

- What data is collected (from scan Phase 1)
- How it's used (inferred from integrations)
- Who it's shared with (third-party integrations found)
- How it's stored and protected (infrastructure scan)
- User rights (based on applicable frameworks — GDPR, CCPA, etc.)
- Cookie/tracking usage (analytics integrations found)
- Data retention (look for TTL, cleanup jobs, or flag as missing)
- Contact information (ask user)

## Sub-Command: `terms-of-service`

Generate based on detected product type:

- **SaaS:** Service availability, SLA, subscription terms, data ownership
- **Marketplace:** Buyer/seller terms, dispute resolution, commission
- **API/Platform:** Rate limits, usage restrictions, API terms
- **Consumer app:** Account terms, content policies, termination

## Sub-Command: `compliance`

Deep-dive on a specific framework. Read `references/compliance-frameworks.md` and produce:

1. **Applicability assessment** — does this framework actually apply to you?
2. **Gap analysis** — what's missing vs what's already in place?
3. **Remediation roadmap** — prioritized steps to achieve compliance
4. **Evidence inventory** — what documentation/controls you need

## Sub-Command: `contract-review`

Accept a contract file path. Analyze for:

- Unfavorable indemnification clauses
- Unlimited liability exposure
- Broad IP assignment (are you giving away your core IP?)
- Auto-renewal with difficult termination
- Non-compete overreach
- Data handling obligations you can't meet
- Governing law and jurisdiction concerns
- Missing limitation of liability
- Ambiguous scope of work

Output a clause-by-clause risk assessment with 🔴🟡🟢 ratings.

## Sub-Command: `entity-guide`

Based on business context, recommend entity structure:

| Scenario | Recommendation | Why |
|----------|---------------|-----|
| Solo, early stage, US | Single-member LLC | Liability protection, tax flexibility, simple |
| 2+ founders, staying small | Multi-member LLC | Flexible equity, pass-through tax, operating agreement governs |
| Planning to raise VC | Delaware C-Corp | VCs require it, stock options, established case law |
| Side project, no revenue | Sole proprietorship | No formation needed, convert later |
| International founders | Depends on residency | May need US entity + foreign holding structure |

Include state-specific considerations (Delaware vs Wyoming vs home state) and tax implications overview.

---

## Output Directory: `docs/legal/`

All outputs MUST be saved as markdown files to `docs/legal/` or its subdirectories. Create the directory if it doesn't exist. Use this structure:

```
docs/legal/
├── README.md                          ← Index of all legal documents (create/update on every run)
├── scans/
│   ├── compliance-scan-YYYY-MM-DD.md  ← Full scan report (compliance matrix + risk register + checklist)
│   └── compliance-FRAMEWORK-YYYY-MM-DD.md ← Framework-specific deep-dive
├── agreements/
│   ├── founders-agreement.md
│   ├── operating-agreement.md
│   └── ip-assignment.md
├── policies/
│   ├── privacy-policy.md
│   ├── terms-of-service.md
│   ├── cookie-policy.md
│   └── acceptable-use-policy.md
└── reviews/
    └── contract-review-YYYY-MM-DD-{name}.md
```

### README.md Format

Maintain `docs/legal/README.md` as an index. Create it on first run, update it on every subsequent run:

```markdown
# Legal Documents

⚖️ All documents in this directory are AI-generated drafts. They must be
reviewed by a qualified attorney before use.

## Scans & Assessments
| Document | Date | Status |
|----------|------|--------|
| [Compliance Scan](scans/compliance-scan-YYYY-MM-DD.md) | YYYY-MM-DD | Draft |

## Agreements
| Document | Date | Status |
|----------|------|--------|
| [Founders Agreement](agreements/founders-agreement.md) | YYYY-MM-DD | Draft |

## Policies
| Document | Date | Status |
|----------|------|--------|
| [Privacy Policy](policies/privacy-policy.md) | YYYY-MM-DD | Draft |

## Reviews
| Document | Date | Status |
|----------|------|--------|
| [Vendor Contract Review](reviews/contract-review-YYYY-MM-DD-vendor.md) | YYYY-MM-DD | Draft |
```

### File Naming Rules

- Scan reports include the date: `compliance-scan-2024-03-15.md`
- Agreements use stable names (overwrite on regeneration): `founders-agreement.md`
- Reviews include date and subject: `contract-review-2024-03-15-acme-vendor.md`
- All filenames are kebab-case, lowercase

## Important Constraints

1. **Every generated document** must include the disclaimer header:
   > ⚖️ DRAFT — NOT LEGAL ADVICE. This document was generated by AI as a starting
   > template. It must be reviewed and customized by a qualified attorney before use.
   > Laws vary by jurisdiction. Last generated: [date].

2. **Never claim completeness** — always note what sections need attorney customization
3. **Mark jurisdiction-sensitive sections** with `[⚖️ ATTORNEY REVIEW — varies by state/country]`
4. **Don't guess at specific dollar amounts** for liability caps, penalties, etc.
5. **Scan evidence must be cited** — every finding references the file/pattern that triggered it
6. **Always save to `docs/legal/`** — never output legal documents only to the conversation
7. **Always update `docs/legal/README.md`** — keep the index current after every run
