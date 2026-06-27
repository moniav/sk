# Conventions

> Code standards, naming patterns, file organization, and development practices.
> **Claude Code:** Always follow these conventions. When in doubt, check here first.

**Last updated:** YYYY-MM-DD

## Quick Reference

| Convention | Doc | Summary |
|-----------|-----|---------|
| Code Style | [code-style.md](./code-style.md) | Naming, formatting, language patterns |
| File Structure | [file-structure.md](./file-structure.md) | Where things go, how to organize |
| Git Workflow | [git-workflow.md](./git-workflow.md) | Branching, commits, PR process |
| Testing | [testing.md](./testing.md) | Test patterns, coverage, naming |
| Coding Behavior | [coding-behavior.md](./coding-behavior.md) | Implementation approach, thinking discipline |
| Doc Lifecycle | [doc-lifecycle.md](./doc-lifecycle.md) | Freshness tracking — `Lifecycle` field, staleness, `/sk:docs-audit` |

## Universal Rules

These apply everywhere, no exceptions:

1. **Naming is communication** — Names should explain intent, not implementation
2. **Explicit over implicit** — Don't rely on convention when you can be clear
3. **Consistency over preference** — Match the existing pattern, even if you'd do it differently
4. **Small surface area** — Export the minimum, expose the minimum, accept the minimum
5. **Think, then code** — Surface assumptions and verify goals before and after implementation
