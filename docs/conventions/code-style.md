# Code Style Conventions

**Last updated:** YYYY-MM-DD

## Language & Framework

<!-- Specify your primary language/framework -->

- **Language:** TypeScript / Python / etc.
- **Framework:** Next.js / FastAPI / etc.
- **Runtime:** Node 20+ / Python 3.12+ / etc.

## Naming Conventions

### Files & Directories

```
# Components (PascalCase)
UserProfile.tsx
PaymentForm.tsx

# Utilities & helpers (camelCase)
formatCurrency.ts
parseResponse.ts

# Constants (SCREAMING_SNAKE_CASE for values, camelCase for files)
config.ts → export const MAX_RETRIES = 3

# Test files (co-located, .test suffix)
UserProfile.test.tsx
formatCurrency.test.ts
```

### Code Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Variables | camelCase | `userData`, `isLoading` |
| Functions | camelCase, verb-first | `getUserById()`, `validateInput()` |
| Classes | PascalCase | `PaymentProcessor` |
| Interfaces/Types | PascalCase, no `I` prefix | `UserProfile`, `ApiResponse` |
| Constants | SCREAMING_SNAKE | `MAX_TIMEOUT`, `API_BASE_URL` |
| Enums | PascalCase + PascalCase members | `UserRole.Admin` |
| DB tables | snake_case, plural | `user_profiles`, `payment_transactions` |
| DB columns | snake_case | `created_at`, `first_name` |
| API endpoints | kebab-case, plural nouns | `/api/user-profiles`, `/api/transactions` |
| Env variables | SCREAMING_SNAKE | `DATABASE_URL`, `API_KEY` |

### Boolean Naming

Always use `is`, `has`, `can`, `should`, `will` prefixes:

```typescript
// ✅ Good
const isActive = true;
const hasPermission = checkPermission(user);
const canEdit = user.role === 'admin';

// ❌ Bad
const active = true;
const permission = checkPermission(user);
const edit = user.role === 'admin';
```

## Patterns & Anti-Patterns

### Preferred Patterns

```typescript
// ✅ Early returns over nested conditionals
function processUser(user: User) {
  if (!user) return null;
  if (!user.isActive) return { error: 'inactive' };
  
  return doWork(user);
}

// ✅ Destructuring for clarity
function createOrder({ userId, items, shippingAddress }: CreateOrderInput) {
  // ...
}

// ✅ Const assertions for type safety
const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
} as const;
```

### Anti-Patterns to Avoid

```typescript
// ❌ Magic numbers/strings
if (retries > 3) { ... }     // What is 3?
// ✅
if (retries > MAX_RETRIES) { ... }

// ❌ God functions (>50 lines)
// ✅ Break into composed smaller functions

// ❌ Catch-and-ignore
try { riskyOp() } catch (e) { }
// ✅ At minimum, log the error
try { riskyOp() } catch (e) { logger.error('riskyOp failed', e); }
```

## Error Handling

```typescript
// Custom error classes for domain errors
class NotFoundError extends AppError {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`, 404);
  }
}

// Always type your errors
function getUser(id: string): Result<User, NotFoundError | AuthError> {
  // ...
}
```

## Import Order

```typescript
// 1. External packages
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal aliases (@/)
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';

// 3. Relative imports
import { formatPrice } from './utils';
import type { CartItem } from './types';
```

## Comments Philosophy

```typescript
// ❌ Don't explain WHAT (the code already does that)
// Increment counter by 1
counter++;

// ✅ Explain WHY when it's not obvious
// We retry 3x because the payment gateway has transient 503s during deploys
const MAX_RETRIES = 3;

// ✅ Explain TRADE-OFFS
// Using in-memory cache here instead of Redis because this data
// is per-request and doesn't need to survive process restarts
const cache = new Map();
```
