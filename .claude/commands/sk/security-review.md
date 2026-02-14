---
description: Security scan — OWASP Top 10, secrets detection, dependency audit (project)
---

# Security Review — Vulnerability Analysis

Analyze the codebase for security vulnerabilities covering OWASP Top 10, hardcoded secrets, and dependency risks.

## Step 1: Read Context

**ALWAYS start by reading:**
1. `docs/system/tech-stack.md` — Framework, language, dependencies
2. `docs/system/api-reference.md` — API endpoints and auth patterns
3. `docs/system/env-variables.md` — Expected environment variables (if exists)
4. `docs/system/integrations.md` — External service connections (if exists)

## Step 2: Determine Scope

Ask the user what to scan:

| Scope | What gets analyzed |
|-------|-------------------|
| **Full codebase** | All source files, configs, and dependencies |
| **Changed files** | Only files modified (staged + unstaged) |
| **Specific area** | User-specified directory or feature area |

## Step 3: Secret Detection

Scan for hardcoded secrets and credentials:

**Search patterns:**
- API keys — `key`, `apikey`, `api_key`, `API_KEY` followed by string values
- Passwords — `password`, `passwd`, `pwd`, `secret` in assignments
- Tokens — `token`, `bearer`, `jwt`, `auth` with hardcoded values
- Connection strings — `mongodb://`, `postgres://`, `mysql://`, `redis://` with credentials
- AWS — `AKIA`, `aws_access_key`, `aws_secret`
- Private keys — `BEGIN RSA PRIVATE KEY`, `BEGIN EC PRIVATE KEY`, `BEGIN OPENSSH PRIVATE KEY`
- Generic secrets — high-entropy strings in config files, base64-encoded blobs

**Verify protections:**
- `.gitignore` includes `.env`, `.env.*`, `*.pem`, `*.key`
- No secrets in committed files (check git history if suspicious)
- Environment variables used instead of hardcoded values

## Step 4: OWASP Top 10 Analysis

Review the codebase against each OWASP category:

### A01: Broken Access Control
- Authentication required on protected routes
- Authorization checks on resource access (no IDOR)
- CORS configuration is restrictive (not `*` in production)
- Rate limiting on sensitive endpoints
- Directory traversal protection on file operations

### A02: Cryptographic Failures
- HTTPS enforced (no HTTP for sensitive data)
- Passwords hashed with bcrypt/scrypt/argon2 (not MD5/SHA)
- Sensitive data encrypted at rest
- No sensitive data in URLs or logs
- Secure random generation (not Math.random for security)

### A03: Injection
- SQL injection — parameterized queries, ORM usage
- XSS — output encoding, CSP headers, sanitized user input
- Command injection — no `exec`/`eval` with user input
- Path traversal — validated file paths, no user-controlled directory access
- Template injection — safe template rendering

### A04: Insecure Design
- Input validation at system boundaries (Zod, Pydantic, etc.)
- Business logic validates state transitions
- Fail-secure defaults (deny by default)
- Resource limits on uploads, queries, batch operations

### A05: Security Misconfiguration
- Debug mode disabled in production config
- Default credentials changed
- Security headers set (X-Frame-Options, X-Content-Type-Options, etc.)
- Error messages don't expose stack traces to users
- Unnecessary features/endpoints disabled

### A06: Vulnerable Components
- Run dependency audit:
  ```bash
  # Node.js
  npm audit
  # Python
  pip audit  # or safety check
  # Rust
  cargo audit
  ```
- Check for known CVEs in major dependencies
- Verify dependencies are reasonably up to date

### A07: Authentication Failures
- Session management is secure (httpOnly, secure, sameSite cookies)
- Password requirements enforced
- Brute force protection (lockout, rate limiting, CAPTCHA)
- Multi-factor authentication available for sensitive operations
- Secure password reset flow

### A08: Data Integrity Failures
- Deserialization of untrusted data is validated
- CI/CD pipeline has integrity checks
- Package integrity verified (lock files committed)
- No unsigned or unverified auto-updates

### A09: Logging & Monitoring Failures
- Authentication events logged (login, logout, failed attempts)
- Authorization failures logged
- No PII or secrets in log output
- Logs are structured and searchable
- Input validation failures logged

### A10: Server-Side Request Forgery (SSRF)
- User-supplied URLs validated against allowlist
- Internal network addresses blocked (127.0.0.1, 10.x, 169.254.x)
- URL scheme restricted (https only, no file://)
- Redirects limited or disabled for server-side requests

## Step 5: Present Findings

Format as a structured security report:

### Critical (exploit risk — fix immediately)

| # | Category | Location | Finding | Remediation |
|---|----------|----------|---------|-------------|
| 1 | A03-Injection | `path:42` | Description | Specific fix |

### High (significant risk — fix before release)

| # | Category | Location | Finding | Remediation |
|---|----------|----------|---------|-------------|
| 1 | A01-Access | `path:88` | Description | Specific fix |

### Medium (moderate risk — fix soon)

| # | Category | Location | Finding | Remediation |
|---|----------|----------|---------|-------------|
| 1 | A05-Config | `path:15` | Description | Specific fix |

### Low (minor risk — fix when convenient)

| # | Category | Location | Finding | Remediation |
|---|----------|----------|---------|-------------|
| 1 | A09-Logging | `path:30` | Description | Specific fix |

### Info (observations, not vulnerabilities)

| # | Category | Observation |
|---|----------|-------------|
| 1 | A06-Components | Description |

## Step 6: Remediation Plan

For each Critical and High finding:

1. **What to fix** — specific code change needed
2. **Where to fix** — exact file and location
3. **How to verify** — how to confirm the fix works
4. **Priority** — order of remediation based on exploitability

If no critical or high findings, acknowledge the codebase's security posture and highlight areas for ongoing vigilance.
