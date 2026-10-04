# Document modes

Steps for the modes that draft or review a document. Templates for agreements and the entity selection guide are in `entity-formation.md`.

Every draft is filled from the project's own context, marks jurisdiction-sensitive sections with `[⚖️ ATTORNEY REVIEW]`, and is saved as `output-layout.md` describes.

## Contents

- founders-agreement
- operating-agreement
- ip-assignment
- privacy-policy
- terms-of-service
- contract-review
- entity-guide

## founders-agreement

1. Read the Founders Agreement template in `entity-formation.md`.
2. List contributors from git history: `git shortlog -sne --all`.
3. Ask for what is missing:
   - Legal names of all founders, and their roles
   - Equity split and vesting schedule
   - Capital contributions (cash, IP, services)
   - IP each founder built before the company formed
   - How decisions are made (unanimous, majority, by domain) and how a deadlock is resolved
   - Departure terms, voluntary and involuntary, and what happens to equity
   - Non-compete and non-solicit scope (unenforceable in some jurisdictions; mark it)
   - Expense and compensation policy
4. Fill the template.

## operating-agreement

1. Read the Operating Agreement template in `entity-formation.md`.
2. Establish whether the LLC is single-member or multi-member.
3. Ask for what is missing:
   - **Single-member:** member name and address, management structure, capital contribution, profit and loss allocation, dissolution terms
   - **Multi-member:** every member's name, address and ownership percentage; capital contributions (cash, IP, services); profit and loss distribution; member-managed or manager-managed; voting rights and thresholds; transfer restrictions and right of first refusal; buy-sell provisions for death, disability and departure; dissolution triggers
4. Fill the template.

## ip-assignment

1. Read the IP Assignment template in `entity-formation.md`.
2. Find when the code began and who wrote it: `git log --reverse --format='%an|%ae|%ai'`, first line.
3. Ask: who created code before the company formed, which open source components must be declared, and whether any prior employer could claim the work.
4. Fill the template with the specific repositories, assets and IP being assigned.

## privacy-policy

The policy must describe what the code actually does.

1. Run the PII, PHI, payment and tracking searches from `detection-signals.md`.
2. List every point where data is collected: forms, API endpoints, analytics, cookies.
3. List every third party that receives data. Each integration is a potential data processor.
4. Determine which frameworks apply (GDPR, CCPA, COPPA and so on) from `compliance-frameworks.md`.
5. Look for retention behaviour: TTLs, cleanup jobs. If there is none, say so in the draft rather than inventing a period.
6. Ask for: the company's legal name and contact details, retention periods, cookie and tracking decisions, how a data subject makes a request.
7. Draft the policy: what is collected, how it is used, who it is shared with, how it is stored and protected, the user's rights under each applicable framework, cookies and tracking, retention, contact.

## terms-of-service

1. Detect the product type from the codebase:
   - **SaaS:** subscriptions, dashboards, team features. Cover service availability, subscription terms, data ownership.
   - **Marketplace:** buyers and sellers, listings, transactions. Cover both parties' terms, disputes, commission.
   - **API or platform:** API keys, rate limits, developer docs. Cover usage restrictions and limits.
   - **Consumer app:** accounts, content, social features. Cover account terms, content policy, termination.
   - **E-commerce:** products, cart, checkout, shipping. Cover orders, returns, delivery.
2. Ask for: acceptable-use boundaries, liability preferences, governing law, arbitration or courts.
3. Draft terms for that product type.

## contract-review

1. Read the contract file named in the arguments.
2. Go through it clause by clause, looking for:
   - Indemnification that is one-way or uncapped
   - Unlimited liability, or no limitation of liability at all
   - IP assignment broad enough to take core IP
   - Auto-renewal with a long or awkward termination notice
   - Non-compete terms that overreach
   - Data-handling obligations the project cannot meet (check them against what the code does)
   - Governing law and jurisdiction
   - Ambiguous scope of work
   - Payment terms and late fees
3. Report every clause with a risk rating:

```markdown
## Contract Review — [Document Name]

| Clause | Section | Risk | Finding | Recommendation |
|--------|---------|------|---------|----------------|
| Indemnification | §4.2 | 🔴 | Unlimited, one-way | Negotiate mutual, with a cap |
| IP Assignment | §7.1 | 🔴 | Assigns all work product | Narrow to deliverables |
| Term | §9 | 🟡 | Auto-renews, 90-day notice | Ask for 30-day notice |
```

## entity-guide

1. Read the Entity Selection Guide in `entity-formation.md`.
2. Ask for: number of founders, whether they plan to raise venture capital, revenue expectations for year one and year three, where the founders live, whether the industry is regulated, personal liability concerns.
3. Recommend a structure, with a comparison table. Starting points:

| Situation | Usual recommendation | Why |
|-----------|----------------------|-----|
| Solo, early, US | Single-member LLC | Liability protection, simple, flexible tax treatment |
| Two or more founders, staying small | Multi-member LLC | Flexible equity, pass-through tax, governed by the operating agreement |
| Planning to raise venture capital | Delaware C-Corp | Investors expect it; supports stock options |
| Side project with no revenue | Sole proprietorship | Nothing to form; convert later |
| Founders in different countries | Depends on residency | May need a US entity and a foreign holding structure |

4. Cover where to form it (Delaware, Wyoming or the home state) and the tax implications in outline.
5. List the next steps to form the entity.
