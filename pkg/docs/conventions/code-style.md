# Code Style Conventions

**Last updated:** YYYY-MM-DD

## Language & Framework

<!-- Specify your primary language/framework -->

- **Language:** <!-- TypeScript / Python / Go / etc. -->
- **Framework:** <!-- Next.js / FastAPI / Django / Flask / Express / etc. -->
- **Runtime:** <!-- Node 20+ / Python 3.12+ / etc. -->

## Naming Conventions

### Files & Directories

<!-- Adapt to your language. Examples for TypeScript and Python shown. -->

**TypeScript / JavaScript:**
```
Components/       PascalCase      UserProfile.tsx, PaymentForm.tsx
Utilities/        camelCase       formatCurrency.ts, parseResponse.ts
Tests/            .test suffix    UserProfile.test.tsx
```

**Python:**
```
Modules/          snake_case      user_profile.py, payment_form.py
Tests/            test_ prefix    test_user_profile.py, test_payment.py
Classes/          PascalCase      class UserProfile
```

### Code Naming

| Element | TypeScript | Python |
|---------|-----------|--------|
| Variables | `camelCase` | `snake_case` |
| Functions | `camelCase` verb-first | `snake_case` verb-first |
| Classes | `PascalCase` | `PascalCase` |
| Interfaces/Types | `PascalCase` | `PascalCase` |
| Constants | `SCREAMING_SNAKE` | `SCREAMING_SNAKE` |
| DB tables | `snake_case`, plural | `snake_case`, plural |
| DB columns | `snake_case` | `snake_case` |
| API endpoints | `kebab-case`, plural nouns | `kebab-case`, plural nouns |
| Env variables | `SCREAMING_SNAKE` | `SCREAMING_SNAKE` |

### Boolean Naming

Always use `is`, `has`, `can`, `should`, `will` prefixes:

```
# Good
is_active = True          # Python
const isActive = true;    // TypeScript

# Bad
active = True
const active = true;
```

## Patterns & Anti-Patterns

### Preferred Patterns

```
# Early returns over nested conditionals
def process_user(user):            # Python
    if not user:
        return None
    if not user.is_active:
        return {"error": "inactive"}
    return do_work(user)
```

```typescript
// Same pattern in TypeScript
function processUser(user: User) {
  if (!user) return null;
  if (!user.isActive) return { error: 'inactive' };
  return doWork(user);
}
```

### Anti-Patterns to Avoid

```
# Magic numbers/strings
if retries > 3: ...              # What is 3?
if retries > MAX_RETRIES: ...    # Better

# God functions (>50 lines): break into composed smaller functions

# Catch-and-ignore
try:
    risky_op()
except Exception:
    pass                         # Bad: at minimum, log the error
```

## Error Handling

<!-- Adapt to your language -->

**Python:**
```python
class NotFoundError(AppError):
    def __init__(self, entity: str, id: str):
        super().__init__(f"{entity} not found: {id}", status_code=404)
```

**TypeScript:**
```typescript
class NotFoundError extends AppError {
  constructor(entity: string, id: string) {
    super(`${entity} not found: ${id}`, 404);
  }
}
```

## Import Order

<!-- Follow your language's conventions -->

**Python:**
```python
# 1. Standard library
import os
from datetime import datetime

# 2. Third-party packages
from fastapi import APIRouter
from pydantic import BaseModel

# 3. Local imports
from app.models import User
from .utils import format_price
```

**TypeScript:**
```typescript
// 1. External packages
import { useState } from 'react';
import { z } from 'zod';

// 2. Internal aliases (@/)
import { Button } from '@/components/ui';

// 3. Relative imports
import { formatPrice } from './utils';
```

## Comments Philosophy

```
# Don't explain WHAT (the code already does that)
counter += 1  # Increment counter by 1  <-- bad

# Explain WHY when it's not obvious
MAX_RETRIES = 3  # Payment gateway has transient 503s during deploys

# Explain TRADE-OFFS
# Using in-memory cache instead of Redis because this data
# is per-request and doesn't survive process restarts
cache = {}
```
