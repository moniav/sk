---
description: Security scan — OWASP Top 10, secrets detection, dependency audit
argument-hint: "[scope: branch | file or directory | all (optional)]"
allowed-tools: Read, Grep, Glob, Bash(git status *), Bash(git diff *), Bash(git log *), Bash(git show *), Bash(git rev-parse *), Bash(git symbolic-ref *), Bash(git merge-base *), Bash(git ls-files *), Bash(git blame *), Bash(git branch --show-current), Bash(date *)
disallowed-tools: Edit, NotebookEdit
disable-model-invocation: true
---

# Security Review — Vulnerability Analysis

Analyze the codebase for security vulnerabilities covering OWASP Top 10, hardcoded secrets, and dependency risks.

**Arguments:** `$ARGUMENTS`
If they already answer a question this command would ask, use them and skip that question. If empty, use the defaults below and ask only for what cannot be inferred.

Copy the steps below into your todo list before starting. A step you decide not to do stays on the list as "skip: <reason>".

**Report-only.** This command does not modify project files. The only file it may write is its report under `docs/reviews/security/`.

## Rules

- **Evidence.** Every finding cites `file:line` and says how far it was proven: stated, pointed at the line, traced the path, ran it.
- **Severity scale.** Critical (exploit risk, fix immediately), High (significant risk, fix before release), Medium (moderate risk, fix soon), Low (minor risk, fix when convenient), Info (observation, not a vulnerability).
- **Exit gate.** Done when the Step 5 tables are presented with a location and proof level on every finding, every Critical and High finding has a Step 6 remediation entry, the one-line tally closes Step 6, and the Step 7 questions have been asked.

## Step 1: Read Context

Read first, skipping any file that is empty or contains only template placeholders:
1. `docs/system/project-context.md` (if it exists)
2. `docs/system/tech-stack.md`
3. `docs/system/api-reference.md`
4. `docs/system/env-variables.md` (if it exists)
5. `docs/system/integrations.md` (if it exists)

## Step 2: Determine Scope

Ask the user what to scan:

| Scope | What gets analyzed |
|-------|-------------------|
| **Full codebase** | All source files, configs, and dependencies |
| **Changed files** | Only files modified (staged + unstaged) |
| **Specific area** | User-specified directory or feature area |

## Step 3: Secret Detection

**Search patterns:**
- API keys: `key`, `apikey`, `api_key`, `API_KEY` followed by string values
- Passwords: `password`, `passwd`, `pwd`, `secret` in assignments
- Tokens: `token`, `bearer`, `jwt`, `auth` with hardcoded values
- Connection strings: `mongodb://`, `postgres://`, `mysql://`, `redis://` with credentials
- AWS: `AKIA`, `aws_access_key`, `aws_secret`
- Private keys: `BEGIN RSA PRIVATE KEY`, `BEGIN EC PRIVATE KEY`, `BEGIN OPENSSH PRIVATE KEY`
- Generic secrets: high-entropy strings in config files, base64-encoded blobs

**Verify protections:**
- `.gitignore` includes `.env`, `.env.*`, `*.pem`, `*.key`
- Environment variables used instead of hardcoded values

**Check git history for leaked secrets:**
```bash
git log --all --diff-filter=D -- "*.env" "*.pem" "*.key"
git log --all -S "password" --oneline -- "*.json" "*.yaml" "*.yml" "*.toml"
```

## Step 4: OWASP Top 10 Analysis

Check every category below. A category with nothing to report gets an Info row saying what was checked.

- **A01 Broken Access Control:** authentication on protected routes, authorization on resource access (no IDOR), CORS not `*` in production, rate limiting on sensitive endpoints, directory traversal protection on file operations
- **A02 Cryptographic Failures:** HTTPS enforced, passwords hashed with bcrypt/scrypt/argon2 (not MD5/SHA), sensitive data encrypted at rest, no sensitive data in URLs or logs, secure random generation (not `Math.random` for security)
- **A03 Injection:** SQL (parameterized queries, ORM usage), XSS (output encoding, CSP headers, sanitized input), command injection (no `exec`/`eval` with user input), path traversal, template injection
- **A04 Insecure Design:** input validation at system boundaries, business logic validates state transitions, deny by default, resource limits on uploads, queries and batch operations
- **A05 Security Misconfiguration:** debug mode off in production config, default credentials changed, security headers set (X-Frame-Options, X-Content-Type-Options, etc.), no stack traces shown to users, unnecessary features/endpoints disabled
- **A06 Vulnerable Components:** see the audit commands below
- **A07 Authentication Failures:** session cookies are httpOnly, secure and sameSite, password requirements enforced, brute force protection (lockout, rate limiting, CAPTCHA), MFA available for sensitive operations, secure password reset flow
- **A08 Data Integrity Failures:** deserialization of untrusted data is validated, CI/CD pipeline has integrity checks, lock files committed, no unsigned or unverified auto-updates
- **A09 Logging & Monitoring Failures:** authentication events, authorization failures and input validation failures are logged, no PII or secrets in log output, logs are structured
- **A10 SSRF:** user-supplied URLs validated against an allowlist, internal addresses blocked (127.0.0.1, 10.x, 169.254.x), URL scheme restricted (https only, no file://), redirects limited or disabled for server-side requests

### A06: Vulnerable Components

Run the appropriate dependency audit tool:
- If `package.json` exists: run `npm audit`
- If `requirements.txt`/`pyproject.toml` exists: run `pip audit` (or `safety check`)
- If `Cargo.toml` exists: run `cargo audit`
- If `go.mod` exists: run `govulncheck ./...`

Include the output in the findings.
Also check for known CVEs in major dependencies and whether dependencies are reasonably up to date.

## Step 5: Present Findings

Use these five sections, in this order.
High, Medium and Low use the same columns as Critical.

### Critical (exploit risk — fix immediately)

| # | Category | Location | Finding | Proof | Remediation |
|---|----------|----------|---------|-------|-------------|
| 1 | A03-Injection | `path:42` | Description | traced the path | Specific fix |

### High (significant risk — fix before release)

### Medium (moderate risk — fix soon)

### Low (minor risk — fix when convenient)

### Info (observations, not vulnerabilities)

| # | Category | Observation |
|---|----------|-------------|
| 1 | A06-Components | Description |

## Step 6: Remediation Plan

For each Critical and High finding:

1. **What to fix**: the specific code change needed
2. **Where to fix**: exact file and location
3. **How to verify**: how to confirm the fix works
4. **Priority**: order of remediation based on exploitability

If there are no critical or high findings, say so and name the areas that need ongoing vigilance.

**End with a one-line tally** so the result is glanceable and comparable across reviews:

`Found: N critical, N high, N medium, N low` (or `Clean — no critical/high findings` if none).

## Step 7: Persist Report (Optional)

Ask: **"Save this security review to `docs/reviews/security/YYYY-MM-DD-{scope}.md`?"**

If yes, save using the template from `docs/templates/review-report.md`. For Critical/High findings, suggest creating tasks: **"Create tasks for the N critical/high findings?"**

**Reply:** the Step 5 findings tables (every finding with `file:line` and proof level), the Step 6 remediation plan for Critical and High findings, the one-line tally `Found: N critical, N high, N medium, N low`, and the report path if it was saved.
