# Testing Conventions

**Last updated:** YYYY-MM-DD

## Test Pyramid

```
         /  E2E  \          ← Few: Critical user journeys only
        /----------\
       / Integration \      ← Some: API routes, DB queries, service interactions
      /----------------\
     /    Unit Tests     \  ← Many: Pure functions, business logic, utilities
    /----------------------\
```

## Naming Pattern

```typescript
describe('PaymentService', () => {
  describe('processPayment', () => {
    it('should charge the correct amount for a valid card', () => {});
    it('should throw InsufficientFundsError when balance is too low', () => {});
    it('should retry up to 3 times on gateway timeout', () => {});
  });
});
```

Format: `should [expected behavior] when [condition]`

## Test Structure (AAA)

```typescript
it('should apply discount for premium users', () => {
  // Arrange — set up test data
  const user = createTestUser({ tier: 'premium' });
  const cart = createTestCart({ total: 100 });

  // Act — execute the thing being tested
  const result = calculateTotal(cart, user);

  // Assert — verify the outcome
  expect(result.total).toBe(80);
  expect(result.discountApplied).toBe(true);
});
```

## What to Test

| Layer | Test | Don't Test |
|-------|------|-----------|
| Utils/Helpers | All pure functions | Framework internals |
| Services | Business logic, edge cases | External API responses (mock them) |
| API Routes | Request/response contracts | Auth middleware (test separately) |
| Components | User interactions, conditional rendering | Styling, layout |

## Test Utilities

Keep test helpers in `tests/helpers/`:

```typescript
// tests/helpers/factories.ts
export function createTestUser(overrides?: Partial<User>): User {
  return {
    id: 'test-user-1',
    email: 'test@example.com',
    role: 'user',
    ...overrides,
  };
}
```
