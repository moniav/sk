# Git Workflow

**Last updated:** YYYY-MM-DD

## Branch Naming

```
main                           # Production-ready code
├── feat/[ticket]-short-desc   # New features
├── fix/[ticket]-short-desc    # Bug fixes
├── refactor/short-desc        # Code improvements (no behavior change)
├── docs/short-desc            # Documentation only
└── chore/short-desc           # Tooling, deps, config
```

## Commit Messages

Format: `type(scope): description`

```
feat(auth): add Google OAuth login
fix(payments): handle timeout on Stripe webhook
refactor(api): extract validation middleware
docs(sop): add database migration procedure
chore(deps): upgrade framework to latest version
```

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `perf`

Rules:
- Imperative mood ("add" not "added")
- Lowercase, no period at end
- Under 72 characters
- Body for context when needed (separated by blank line)

## PR Process

1. Branch from `main`
2. Keep PRs focused — one feature/fix per PR
3. Self-review diff before requesting review
4. Update relevant docs in same PR
5. Squash merge to `main`
