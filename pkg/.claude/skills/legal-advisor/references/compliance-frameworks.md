# Compliance Frameworks Reference

## Table of Contents
- [HIPAA](#hipaa)
- [GDPR](#gdpr)
- [PCI DSS](#pci-dss)
- [SOC 2](#soc-2)
- [CCPA/CPRA](#ccpacpra)
- [COPPA](#coppa)
- [BIPA](#bipa)
- [ADA / Section 508](#ada--section-508)
- [SOX](#sox)
- [EU AI Act](#eu-ai-act)

---

## HIPAA

**Health Insurance Portability and Accountability Act**

### When It Applies
- You handle Protected Health Information (PHI)
- You are a Covered Entity (healthcare provider, health plan, clearinghouse)
- You are a Business Associate (process PHI on behalf of a Covered Entity)

### Key Requirements
1. **Privacy Rule** — limits who can access PHI, minimum necessary standard
2. **Security Rule** — administrative, physical, and technical safeguards
3. **Breach Notification Rule** — notify within 60 days of discovering a breach
4. **Business Associate Agreement (BAA)** — required with every vendor touching PHI

### Technical Controls Required
- Encryption at rest (AES-256) and in transit (TLS 1.2+)
- Access controls with unique user IDs
- Audit logging of all PHI access
- Automatic session timeout
- Data backup and disaster recovery plan
- Integrity controls (prevent unauthorized alteration)

### Common Gaps Found in Codebases
- PHI in application logs (must be excluded or encrypted)
- No audit trail for data access
- PHI in error messages or stack traces
- Missing BAA with cloud provider (AWS, GCP, Azure all offer BAAs)
- Development/staging environments with real PHI
- No data retention/destruction policy

### Documents Needed
- BAA with each vendor/subprocessor
- Security Risk Assessment (SRA) — annual
- Policies: access control, encryption, incident response, data retention
- Training documentation for workforce members
- Breach notification procedures

---

## GDPR

**General Data Protection Regulation (EU)**

### When It Applies
- You process personal data of EU/EEA residents
- You offer goods or services to EU residents (even free)
- You monitor behavior of EU residents (analytics, profiling)
- Physical presence in EU is NOT required

### Key Requirements
1. **Lawful Basis** — must have one of: consent, contract, legal obligation, vital interests, public task, legitimate interests
2. **Data Subject Rights** — access, rectification, erasure, portability, restriction, objection
3. **Data Protection by Design** — privacy built into systems, not bolted on
4. **Data Processing Records** — Article 30 register
5. **Data Protection Impact Assessment (DPIA)** — for high-risk processing
6. **Data Breach Notification** — 72 hours to supervisory authority
7. **Data Protection Officer (DPO)** — required for large-scale processing

### Technical Controls Required
- Consent management with granular opt-in/opt-out
- Data subject access request (DSAR) fulfillment mechanism
- Right-to-delete implementation (cascade through all systems)
- Data portability export (machine-readable format)
- Purpose limitation enforcement
- Data minimization in collection forms
- Cross-border transfer mechanisms (SCCs, adequacy decisions)

### Common Gaps Found in Codebases
- No consent tracking or management
- Analytics/tracking without consent (Google Analytics, Mixpanel)
- No mechanism to handle deletion requests
- Data retained indefinitely with no retention policy
- No cookie consent banner or improperly configured one
- Third-party scripts loaded before consent
- No Data Processing Agreements with processors

### Documents Needed
- Privacy Policy (GDPR-compliant)
- Cookie Policy
- Data Processing Agreement (DPA) template
- Article 30 Records of Processing
- DPIA template
- Data breach response procedure
- Consent records architecture
- Cross-border transfer documentation

---

## PCI DSS

**Payment Card Industry Data Security Standard**

### When It Applies
- You accept, process, store, or transmit credit card data
- Even if using Stripe/Braintree — you still have PCI obligations (just reduced)

### SAQ Levels (Self-Assessment Questionnaire)
| Level | Description | If You... |
|-------|------------|-----------|
| SAQ A | Fully outsourced | Use Stripe Checkout, PayPal hosted, etc. — card data never touches your servers |
| SAQ A-EP | E-commerce, partial outsource | Use Stripe.js/Elements — your page loads but card data goes direct to processor |
| SAQ D | Full assessment | Handle card data on your servers (avoid this) |

### Key Requirements (if SAQ A-EP or higher)
1. Secure network (firewall, no default passwords)
2. Protect cardholder data (encryption, masking)
3. Vulnerability management (patching, antivirus)
4. Access control (need-to-know, unique IDs)
5. Monitoring and testing (logging, penetration tests)
6. Information security policy

### Common Gaps Found in Codebases
- Card numbers in application logs
- PAN stored in database (even encrypted — prefer tokenization)
- Test card numbers in committed code
- No TLS on payment pages
- Shared accounts for payment system access

### Documents Needed
- Completed SAQ (appropriate level)
- Network diagram showing cardholder data flow
- Attestation of Compliance (AOC)
- Incident response plan
- Vendor compliance documentation

---

## SOC 2

**Service Organization Control 2**

### When It Applies
- You're a SaaS or service provider handling customer data
- Enterprise customers require it
- You want to demonstrate security maturity

### Trust Service Criteria
| Criteria | Focus |
|----------|-------|
| Security (required) | Protection against unauthorized access |
| Availability | System uptime and performance |
| Processing Integrity | Accurate and complete processing |
| Confidentiality | Protection of confidential information |
| Privacy | Collection, use, retention of personal information |

### Type I vs Type II
- **Type I** — Controls are suitably designed (point-in-time)
- **Type II** — Controls are operating effectively (over 3-12 months)

### Key Controls Needed
- Access management (SSO, MFA, RBAC)
- Change management process
- Incident response plan
- Vulnerability management
- Encryption (at rest and in transit)
- Logging and monitoring
- Vendor management
- Employee security training
- Business continuity / disaster recovery

### Common Gaps Found in Codebases
- No centralized logging
- No access review process
- Missing MFA on critical systems
- No change management documentation
- No security incident response plan
- Shared credentials in .env files

---

## CCPA/CPRA

**California Consumer Privacy Act / California Privacy Rights Act**

### When It Applies
- You do business in California AND meet any of:
  - Annual revenue > $25M
  - Buy/sell/share personal info of 100K+ consumers/households
  - 50%+ revenue from selling personal information

### Key Rights
- Right to know what data is collected
- Right to delete
- Right to opt-out of sale/sharing
- Right to non-discrimination
- Right to correct inaccurate data (CPRA)
- Right to limit use of sensitive data (CPRA)

### Documents Needed
- Privacy Policy with CCPA-specific disclosures
- "Do Not Sell My Personal Information" link
- Data inventory and mapping
- Consumer request handling procedures

---

## COPPA

**Children's Online Privacy Protection Act**

### When It Applies
- You knowingly collect data from children under 13
- Your site/app is directed at children under 13
- You have actual knowledge users are under 13

### Key Requirements
- Verifiable parental consent before collection
- Clear privacy policy describing practices
- Parents can review/delete child's data
- Data minimization — collect only what's necessary
- Reasonable security measures

---

## BIPA

**Biometric Information Privacy Act (Illinois)**

### When It Applies
- You collect biometric identifiers (fingerprint, face, iris, voice)
- Of Illinois residents

### Key Requirements
- Written informed consent before collection
- Published retention and destruction schedule
- Cannot sell or profit from biometric data
- Private right of action (users can sue directly)
- Statutory damages: $1,000-$5,000 per violation

---

## ADA / Section 508

### When It Applies
- ADA: any public-facing website/app of a business
- Section 508: federal agencies and contractors

### Key Standard: WCAG 2.1 AA
- Perceivable (alt text, captions, contrast)
- Operable (keyboard nav, no seizure triggers)
- Understandable (readable, predictable)
- Robust (compatible with assistive tech)

---

## SOX

**Sarbanes-Oxley Act**

### When It Applies
- Publicly traded companies (US)
- Companies preparing for IPO

### Section 404: Internal Controls
- IT general controls (access, change management)
- Application controls (input validation, processing)
- Audit trails for financial data
- Segregation of duties

---

## EU AI Act

### When It Applies
- You deploy or develop AI systems used in the EU
- Risk-based classification

### Risk Levels
| Level | Examples | Requirements |
|-------|----------|-------------|
| Unacceptable | Social scoring, real-time biometric surveillance | Prohibited |
| High | Healthcare AI, hiring tools, credit scoring | Conformity assessment, human oversight, transparency |
| Limited | Chatbots, deepfakes | Transparency obligations |
| Minimal | Spam filters, game AI | No specific requirements |
