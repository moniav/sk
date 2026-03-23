# Detection Signals Reference

Quick-reference for the codebase scan phase. Organized by what to search for and what it means.

## Scan Strategy

Run these scans in parallel using Grep and Glob. Focus on:
1. Schema/model files (database models, API schemas, form definitions)
2. Configuration files (env, docker, terraform, CI/CD)
3. Package manifests (package.json, requirements.txt, Gemfile, go.mod)
4. Route/endpoint definitions
5. Frontend forms and data collection points

## Signal → Framework Mapping

### PII Signals → Privacy Laws (GDPR, CCPA, state privacy laws)

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `email`, `phone`, `address` | Models, schemas, forms | High if in user-facing models |
| `ssn`, `social_security`, `national_id` | Models, forms | Very High — sensitive PII |
| `date_of_birth`, `dob`, `birthday` | Models, forms | High |
| `ip_address`, `user_agent` | Logging, analytics | Medium — may be operational |
| `geolocation`, `latitude`, `longitude` | Models, API calls | High if tied to users |
| `first_name`, `last_name`, `full_name` | Models, forms | High if combined with other PII |
| `passport`, `driver_license` | Models, forms, upload handlers | Very High — government ID |
| `profile_photo`, `avatar`, `upload.*photo` | Models, routes | Medium — image data |

### PHI Signals → HIPAA

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `patient`, `diagnosis`, `icd` | Models, schemas | Very High |
| `medication`, `prescription`, `rx` | Models, schemas | Very High |
| `health_record`, `medical_record` | Models, schemas | Very High |
| `hl7`, `fhir`, `dicom` | Imports, API calls | Very High — healthcare protocols |
| `provider`, `npi`, `dea_number` | Models | High if healthcare context |
| `lab_result`, `vital_sign` | Models, schemas | Very High |
| `allergy`, `immunization` | Models, schemas | Very High |
| `hipaa`, `phi`, `covered_entity`, `baa` | Config, docs, code comments | High — explicit reference |
| `protected_health` | Anywhere | Very High |

### Payment Signals → PCI DSS

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `stripe`, `@stripe/stripe-js` | package.json, imports | High — payment processor |
| `braintree`, `adyen`, `square` | package.json, imports | High |
| `payment_intent`, `charge`, `refund` | API routes, models | High |
| `card_number`, `pan`, `cvv`, `cvc` | Models, forms | Critical — raw card data |
| `plaid`, `bank_account`, `routing_number` | Imports, models | High — financial data |
| `subscription`, `billing`, `invoice` | Models, routes | Medium — may involve payments |
| `checkout`, `cart`, `order` | Routes, components | Medium — e-commerce signals |

### Children's Data Signals → COPPA

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `under_13`, `under_sixteen`, `minor` | Models, validation | Very High |
| `parental_consent`, `guardian` | Models, forms | Very High |
| `coppa` | Anywhere | Very High — explicit reference |
| `age_gate`, `age_verification` | Routes, components | High |
| `child`, `kid`, `student` (in user context) | Models | Medium — context-dependent |

### Biometric Signals → BIPA, GDPR Art. 9

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `fingerprint`, `face_recognition` | Imports, models | Very High |
| `biometric`, `face_id`, `touch_id` | Auth, models | Very High |
| `voice_print`, `voiceprint` | Models, processing | Very High |
| `facial_encoding`, `face_embedding` | ML models, processing | Very High |
| `opencv`, `dlib`, `face-api` | package.json, imports | High |

### AI/ML Signals → EU AI Act

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `training_data`, `model_training` | ML pipeline files | High |
| `tensorflow`, `pytorch`, `sklearn` | Imports, manifests | Medium — ML present |
| `openai`, `anthropic`, `llm` | Imports, config | Medium — AI integration |
| `embedding`, `vector`, `rag` | Code, config | Medium |
| `score`, `predict`, `classify` (in user context) | Models, API | High if affects decisions |
| `hiring`, `credit_score`, `loan` + ML | Models | Very High — high-risk AI |

### Infrastructure Signals → Various

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `Dockerfile`, `docker-compose` | Root | Deployment present |
| `terraform`, `cloudformation` | IaC files | Infrastructure managed |
| `.env`, `dotenv`, `process.env` | Config | Environment config — check for secrets |
| `bcrypt`, `argon2`, `scrypt` | Auth code | Password hashing present (good) |
| `jwt`, `jsonwebtoken` | Auth | Token-based auth |
| `encryption`, `aes`, `rsa` | Crypto code | Encryption present (good) |
| `http://` (not `https://`) | Config, API calls | Potential unencrypted traffic |

### Geography Signals → Jurisdiction

| Search Pattern | Files to Check | Confidence |
|---------------|---------------|------------|
| `i18n`, `locale`, `intl` | Config, imports | Internationalization present |
| `en-GB`, `de-DE`, `fr-FR`, `eu` locales | i18n files | EU presence → GDPR likely |
| `GDPR`, `CCPA`, `LGPD` | Code, docs | Explicit compliance references |
| `EUR`, `GBP`, `JPY` | Currency handling | International transactions |
| `VAT`, `tax_rate`, `withholding` | Billing, models | Tax compliance signals |
| `timezone`, `America/`, `Europe/` | Config | Geographic distribution |

### Third-Party Integration Signals

| Search Pattern | What It Means |
|---------------|--------------|
| `google-analytics`, `gtag`, `GA_` | Tracking — needs cookie consent |
| `segment`, `mixpanel`, `amplitude` | Analytics — needs consent + DPA |
| `intercom`, `zendesk`, `freshdesk` | Support — data sharing with processor |
| `sendgrid`, `mailgun`, `ses` | Email — CAN-SPAM, anti-spam compliance |
| `twilio`, `vonage` | Communications — TCPA, consent for SMS |
| `aws`, `gcp`, `azure` | Cloud — check BAA, DPA, data residency |
| `firebase` | Google cloud — check data processing terms |
| `sentry`, `datadog`, `newrelic` | Monitoring — may log PII in errors |
| `oauth`, `saml`, `auth0`, `okta` | Auth — SSO compliance, access control |
| `cloudflare`, `fastly`, `akamai` | CDN — data transit through third parties |

## Scan Output Format

For each signal detected, record:

```json
{
  "signal": "what was found",
  "file": "path/to/file",
  "line": 42,
  "category": "PHI|PII|Payment|Children|Biometric|AI|Infra|Geo|Integration",
  "framework": "HIPAA|GDPR|PCI|COPPA|BIPA|EU_AI_Act|SOC2|etc",
  "confidence": "high|medium|low",
  "context": "brief description of surrounding code"
}
```

Group by framework, sort by confidence, and present in the Compliance Matrix.
