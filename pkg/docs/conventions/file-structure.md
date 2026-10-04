# File Structure Conventions

**Last updated:** YYYY-MM-DD

## Project Root

<!-- Adapt to your project. Two common layouts shown. -->

**TypeScript / Node.js:**
```
project/
├── .claude/                   # Claude Code agent configuration
│   └── commands/sk/           # Slash commands (/sk:plan, /sk:dev, etc.)
├── docs/                      # All project documentation
├── src/                       # Application source code
│   ├── app/                   # Routes / pages (framework-specific)
│   ├── components/            # Shared UI components
│   ├── lib/                   # Core utilities & shared logic
│   ├── types/                 # Shared types
│   ├── config/                # App configuration & env parsing
│   └── services/              # Business logic / domain services
├── tests/                     # Integration & E2E tests
├── scripts/                   # Build, deploy, maintenance scripts
└── package.json               # Manifest
```

**Python:**
```
project/
├── .claude/                   # Claude Code agent configuration
│   └── commands/sk/           # Slash commands (/sk:plan, /sk:dev, etc.)
├── docs/                      # All project documentation
├── src/ or app/               # Application source code
│   ├── api/                   # Route handlers / endpoints
│   ├── models/                # DB models / schemas
│   ├── services/              # Business logic
│   ├── utils/                 # Shared utilities
│   └── config/                # App configuration
├── tests/                     # All tests
│   ├── unit/
│   ├── integration/
│   └── conftest.py            # Shared fixtures (pytest)
├── scripts/                   # Build, deploy, maintenance scripts
└── pyproject.toml             # Manifest
```

## Rules

### Co-location Principle

Keep related files together. A feature's modules, tests, and types should live near each other:

```
# TypeScript example              # Python example
src/features/payments/             app/payments/
├── PaymentForm.tsx                ├── routes.py
├── PaymentForm.test.tsx           ├── service.py
├── usePaymentSubmit.ts            ├── models.py
├── types.ts                       ├── schemas.py
├── utils.ts                       ├── test_payments.py
└── index.ts                       └── __init__.py
```

### When to Create a New Directory

- **3+ related files:** Group them in a directory
- **Shared by 2+ features:** Move to `lib/` or `utils/`
- **Single use:** Keep it next to the consumer

### File Size Limits

| File Type | Soft Limit | Action |
|-----------|-----------|--------|
| Component / Module | 200 lines | Extract sub-components / helpers |
| Utility | 100 lines | Split by concern |
| Test file | 300 lines | Split by scenario |
| Route handler | 50 lines | Extract to service |
