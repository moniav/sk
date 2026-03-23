# Git Workflow

**Last updated:** 2026-03-23

## Branch Naming

SK development primarily uses `main` for direct commits (small CLI tool). For larger features:

```
main                           # Production-ready code
├── feat/short-desc            # New commands, skills, features
├── fix/short-desc             # Bug fixes
├── docs/short-desc            # Documentation only
└── chore/short-desc           # Tooling, deps, config
```

## Commit Messages

Format: `type(scope): description`

```
feat: add /sk:legal-scan command for legal-advisor skill
fix: enforce docs/legal/ output structure for legal-advisor
docs: update README for pkg/ separation, new features, and update flow
chore: update version to 1.4.1
feat: separate pkg/ from project root
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`

Rules:
- Imperative mood ("add" not "added")
- Lowercase, no period at end
- Under 72 characters
- Version bumps use the version number as message (e.g., `1.4.1`)

## Release Process

1. Update version in `package.json`
2. Commit: version number as message (e.g., `1.4.1`)
3. `npm publish`
4. Tag: `git tag vX.Y.Z && git push --tags`
