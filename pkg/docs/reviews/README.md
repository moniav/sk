# Review Reports

> Persistent records of code, security, performance, UI, and dependency reviews.

**Last updated:** 2026-03-22

## Purpose

Review commands (`/sk:code-review`, `/sk:security-review`, etc.) produce actionable findings. This directory persists those findings so they can be tracked over time.

## Structure

| Directory | Command | What's Tracked |
|-----------|---------|----------------|
| [code/](./code/) | `/sk:code-review` | Code quality findings |
| [security/](./security/) | `/sk:security-review` | OWASP, secrets, CVEs |
| [performance/](./performance/) | `/sk:perf-review` | Bottlenecks, caching |
| [ui/](./ui/) | `/sk:ui-review` | A11y, responsive, UX |
| [deps/](./deps/) | `/sk:deps` | Vulnerabilities, outdated |

## Finding Status Values

| Status | Meaning |
|--------|---------|
| ⬜ Open | Not yet addressed |
| 🔄 In Progress | Task created, work underway |
| ✅ Fixed | Resolved with reference to task/commit |
| ⏭️ Deferred | Acknowledged, intentionally delayed |

## Naming Convention

`YYYY-MM-DD-{scope}.md` (e.g., `2026-03-22-profile-feature.md`)

## Template

Use `docs/templates/review-report.md` when saving review output.
