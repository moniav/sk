# Scan workflow

Steps and output formats for the `scan` and `compliance <framework>` modes.

## Contents

- Scan: five phases
- Compliance matrix format
- Risk register format
- Document checklist format
- Compliance deep-dive

## Scan: five phases

### Phase 1: scan the codebase

Use `detection-signals.md` as the search playbook. Run the Grep and Glob searches in parallel across its categories: PII, PHI, payment data, children's data, biometric data, employee data, AI and ML, third-party integrations, infrastructure and security, geography.

For each signal found, record the file, the line, the category, the framework it implies and how confident the match is. A field name in a schema or model file is strong evidence; the same word in a comment or a test fixture is weak.

### Phase 2: ask what the code cannot show

Ask only for what the scan did not answer:

1. **Entity:** LLC, C-Corp, sole proprietorship, partnership, or not yet formed
2. **Founders:** how many, their roles, the equity situation
3. **Stage:** idea, MVP, launched, revenue, raising capital
4. **Market:** consumers, businesses or both, and in which countries
5. **Industry:** whether it is regulated (healthcare, finance, education, and so on)
6. **Revenue model:** SaaS, marketplace, transactional, advertising, freemium

If the scan found a payment integration, EU locales and health data fields, do not ask whether the product handles payments, Europe or health data.

### Phase 3: compliance matrix

Map the signals to frameworks using `compliance-frameworks.md`. Use the format below.

### Phase 4: risk register

Group risks by severity. Every row cites the evidence and gives one specific action. Use the format below.

### Phase 5: document checklist

List the documents the project needs, by urgency. Use the format below. Then offer to generate any of them.

## Compliance matrix format

```markdown
## Compliance Matrix — [Project Name]

| Framework | Applies? | Evidence | Priority |
|-----------|----------|----------|----------|
| HIPAA | ✅ Yes | PHI fields in Patient model, no BAA on file | 🔴 Critical |
| GDPR | ✅ Yes | EU locales, user PII, no consent mechanism | 🔴 Critical |
| PCI DSS | ⚠️ Likely | Payment integration (tokenized), check the data flow | 🟡 Medium |
| COPPA | ❌ No | No age-related fields or children's features detected | - |
| SOC 2 | ⚠️ Recommended | B2B SaaS pattern; enterprise buyers will ask | 🟡 Plan |
```

## Risk register format

```markdown
## Risk Register

### 🔴 Critical — Address Before Launch

| # | Risk | Evidence Found | Action |
|---|------|----------------|--------|
| 1 | [specific risk] | [file:line or pattern found] | [specific action] |

### 🟡 Important — Address Within 30 Days

| # | Risk | Evidence Found | Action |
|---|------|----------------|--------|

### 🟢 Advisory — Plan for Next Quarter

| # | Risk | Evidence Found | Action |
|---|------|----------------|--------|
```

## Document checklist format

Each line states why the document is needed, from the findings.

```markdown
## Legal Document Checklist

### Must Have (before launch)
- [ ] Privacy Policy — you collect PII (email, name, address)
- [ ] Terms of Service — public-facing app with user accounts
- [ ] [Framework]-specific documents from the matrix

### Must Have (before revenue)
- [ ] Founders Agreement — 2+ contributors in git history
- [ ] Operating Agreement — if LLC
- [ ] IP Assignment — so the company owns the code

### Should Have (within 90 days)
- [ ] Cookie Policy — analytics or tracking detected
- [ ] DMCA Policy — if user-generated content
- [ ] Contractor Agreement template — if using contractors

### Plan For (next milestone)
- [ ] SOC 2 preparation — if selling to enterprise
- [ ] D&O Insurance — if raising capital
- [ ] Employee handbook — if hiring
```

## Compliance deep-dive

For `compliance <framework>`:

1. Read that framework's section in `compliance-frameworks.md`.
2. Run the targeted searches for that framework's signals from `detection-signals.md`.
3. Produce:
   - **Applicability:** whether the framework applies, and the evidence for and against
   - **Gap analysis:** what is in place and what is missing
   - **Remediation roadmap:** steps in priority order
   - **Evidence inventory:** the documentation and controls an auditor would ask for
   - **Technical requirements:** the specific code and infrastructure changes
