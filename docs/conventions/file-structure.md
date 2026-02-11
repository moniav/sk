# File Structure Conventions

**Last updated:** YYYY-MM-DD

## Project Root

```
project/
├── .claude/                   # Claude Code agent configuration
│   └── commands/sk/           # Slash commands (/sk:plan, /sk:dev, etc.)
├── docs/                      # All project documentation
├── src/                       # Application source code
│   ├── app/                   # Routes / pages (framework-specific)
│   ├── components/            # Shared UI components
│   │   ├── ui/                # Primitive/base components
│   │   └── [feature]/         # Feature-specific components
│   ├── lib/                   # Core utilities & shared logic
│   │   ├── api/               # API client & request helpers
│   │   ├── db/                # Database client, schema, migrations
│   │   ├── auth/              # Authentication logic
│   │   └── utils/             # General utilities
│   ├── hooks/                 # Custom React hooks (if applicable)
│   ├── types/                 # Shared TypeScript types
│   ├── config/                # App configuration & env parsing
│   └── services/              # Business logic / domain services
├── tests/                     # Integration & E2E tests
├── scripts/                   # Build, deploy, maintenance scripts
├── public/                    # Static assets
└── [config files]             # package.json, tsconfig, etc.
```

## Rules

### Co-location Principle

Keep related files together. A feature's components, hooks, types, and tests should live near each other:

```
src/features/payments/
├── PaymentForm.tsx
├── PaymentForm.test.tsx
├── usePaymentSubmit.ts
├── types.ts
├── utils.ts
└── index.ts                   # Public API - only export what others need
```

### Barrel Exports

Each feature directory gets an `index.ts` that defines its public API:

```typescript
// src/features/payments/index.ts
export { PaymentForm } from './PaymentForm';
export type { PaymentMethod } from './types';
// Don't export internal utils, hooks, etc.
```

### When to Create a New Directory

- **3+ related files** → Group them in a directory
- **Shared by 2+ features** → Move to `lib/` or `components/ui/`
- **Single use** → Keep it next to the consumer

### File Size Limits

| File Type | Soft Limit | Action |
|-----------|-----------|--------|
| Component | 200 lines | Extract sub-components |
| Utility | 100 lines | Split by concern |
| Test file | 300 lines | Split by scenario |
| Route handler | 50 lines | Extract to service |
