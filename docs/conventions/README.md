# Conventions

> Code standards, naming patterns, file organization, and development practices for SK.
> **Claude Code:** Always follow these conventions. When in doubt, check here first.

**Last updated:** 2026-03-23

## Quick Reference

| Convention | Doc | Summary |
|-----------|-----|---------|
| Code Style | [code-style.md](./code-style.md) | JS/ES modules, ANSI colors, ASCII-only output |
| File Structure | [file-structure.md](./file-structure.md) | pkg/ vs root separation, dual-edit rule |
| Git Workflow | [git-workflow.md](./git-workflow.md) | Conventional commits, version-number releases |
| Testing | [testing.md](./testing.md) | Manual CLI testing, command testing in target projects |
| Coding Behavior | [coding-behavior.md](./coding-behavior.md) | Implementation approach, thinking discipline |
| Doc Lifecycle | [doc-lifecycle.md](./doc-lifecycle.md) | Freshness tracking — `Lifecycle` field, staleness, `/sk:docs-audit` |

## Universal Rules

These apply everywhere, no exceptions:

1. **Zero dependencies** — `cli.mjs` uses only Node.js stdlib
2. **Dual editing** — Edit both root `.claude/` and `pkg/.claude/` for commands/agents/skills
3. **ASCII-only output** — No Unicode symbols in CLI output (Windows compatibility)
4. **Language agnostic** — Commands never assume a specific language or framework
5. **Self-contained** — Skills and agents must work if other files are missing
