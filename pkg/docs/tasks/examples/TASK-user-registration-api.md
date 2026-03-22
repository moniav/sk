---
schema: v1
type: task
id: TASK-1
title: "User Registration API"
phase: done
status: done
priority: P0
epic: E1
created: 2025-02-10
updated: 2025-02-11
---

# Task: User Registration API

> **Note:** This is a worked example showing a TypeScript/Node.js implementation. Your project's file paths and tools will differ — the format and lifecycle process are what matter.

---

## What

Users need to create accounts with email and password so they can access protected features. This task delivers the registration API endpoint with validation, password hashing, and duplicate detection.

## Acceptance Criteria

- [x] **AC-1:** POST `/api/auth/register` accepts `{ email, password, name }` and returns `201` with user object (no password hash)
- [x] **AC-2:** Duplicate email returns `409` with clear error message
- [x] **AC-3:** Password must be >= 8 chars with at least 1 number — invalid input returns `400` with field-level errors
- [x] **AC-4:** Password is stored as bcrypt hash, never as plaintext
- [x] **AC-5:** A welcome email job is queued (not sent synchronously)

---

## [PLAN]

### Approach

Use Zod for input validation, bcrypt for hashing, and the existing queue system for email dispatch. Add a `users` table if it doesn't exist. Endpoint follows the existing API pattern in `src/app/api/`.

### Affected Areas

| Area | Change Type | Files |
|------|-----------|-------|
| Database | New table | `src/lib/db/schema.ts`, new migration |
| API | New endpoint | `src/app/api/auth/register/route.ts` |
| Services | New service | `src/services/auth.ts` |
| Queue | New job type | `src/lib/queue/jobs/welcome-email.ts` |
| Docs | Update | `docs/system/database-schema.md`, `docs/system/api-reference.md` |

### Dependencies

- [x] Database connection configured
- [x] Queue system operational

### Open Questions

| Question | Answer |
|----------|--------|
| What hashing algorithm? | bcrypt, cost factor 12 |
| Email verification required at signup? | No, separate task (TASK-email-verify) |

---

## Phase Analysis

### Codebase Scan Results

- Existing API pattern in `src/app/api/` uses route handlers with Zod validation
- Queue system in `src/lib/queue/` supports typed job definitions
- No existing auth module — this is the first auth feature

### Technical Decisions

- bcrypt over argon2: simpler setup, sufficient for registration use case
- Unique constraint on email column + catch DB error for duplicate detection (faster than SELECT-first)

### Dev Notes

- Bcrypt cost factor 12 takes ~250ms — acceptable for registration but would be too slow for hot paths
- Zod schema reusable for client-side validation later
- Used `UNIQUE` constraint on email column for duplicate detection

---

## [DEV]

### Subtasks

- [x] **ST-1** `[DEV]` — Create `users` table migration (id, email, password_hash, name, created_at, updated_at)
- [x] **ST-2** `[DEV]` — Create Zod schema for registration input validation
- [x] **ST-3** `[DEV]` — Implement `AuthService.register()` — validate, hash, insert, queue email
- [x] **ST-4** `[DEV]` — Create POST `/api/auth/register` route handler
- [x] **ST-5** `[DEV]` — Create `welcome-email` queue job (just the job definition, email content is separate)
- [x] **ST-6** `[TEST]` — Unit tests for AuthService.register (happy path, duplicate, invalid input)
- [x] **ST-7** `[TEST]` — Integration test for the API endpoint
- [x] **ST-8** `[DOCS]` — Update database-schema.md and api-reference.md

### Implementation Notes

- Used `UNIQUE` constraint on email column + caught DB error for duplicate detection (faster than SELECT first)
- Bcrypt cost factor 12 takes ~250ms — acceptable for registration but would be too slow for hot paths
- Zod schema reusable for client-side validation later

---

## [TEST]

### Test Plan

| What to Test | How | Expected Result |
|-------------|-----|-----------------|
| Valid registration | POST with valid email/password/name | 201 + user object |
| Duplicate email | POST with existing email | 409 + error message |
| Weak password | POST with "abc" | 400 + password validation error |
| Missing fields | POST with empty body | 400 + field-level errors |
| SQL injection in email | POST with `'; DROP TABLE--` | 400 (Zod rejects) or safe query |

### Verification

- [x] **AC-1** verified: Postman test returns 201 with `{id, email, name, createdAt}`, no hash
- [x] **AC-2** verified: Second registration with same email returns `409 {"error": "Email already registered"}`
- [x] **AC-3** verified: "short" returns 400 with `{"errors": {"password": "Must be at least 8 characters with 1 number"}}`
- [x] **AC-4** verified: Inspected DB row — password_hash starts with `$2b$12$`
- [x] **AC-5** verified: Queue dashboard shows `welcome-email` job created after registration
- [x] All existing tests still pass
- [x] No regressions

---

## Progress Log

| Date | Phase | Note |
|------|-------|------|
| 2025-02-10 | PLAN | Task created, broke down into subtasks |
| 2025-02-10 | PLAN | Resolved open questions (bcrypt, no email verify) |
| 2025-02-10 | DEV | ST-1 through ST-5 complete |
| 2025-02-11 | TEST | ST-6, ST-7 complete, all tests passing |
| 2025-02-11 | DOCS | ST-8 complete, schema and API docs updated |
| 2025-02-11 | DONE | All ACs verified, task complete |
