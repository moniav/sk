# Testing Conventions

**Last updated:** YYYY-MM-DD

## Test Pyramid

```
         /  E2E  \          <- Few: Critical user journeys only
        /----------\
       / Integration \      <- Some: API routes, DB queries, service interactions
      /----------------\
     /    Unit Tests     \  <- Many: Pure functions, business logic, utilities
    /----------------------\
```

## Naming Pattern

<!-- Use your language's testing conventions -->

**TypeScript (Vitest / Jest):**
```typescript
describe('PaymentService', () => {
  describe('processPayment', () => {
    it('should charge the correct amount for a valid card', () => {});
    it('should throw InsufficientFundsError when balance is too low', () => {});
  });
});
```

**Python (pytest):**
```python
class TestPaymentService:
    def test_charges_correct_amount_for_valid_card(self):
        ...

    def test_raises_insufficient_funds_when_balance_too_low(self):
        ...
```

Format: `should [expected behavior] when [condition]` (or `test_[behavior]_when_[condition]` for Python)

## Test Structure (AAA)

**TypeScript:**
```typescript
it('should apply discount for premium users', () => {
  // Arrange
  const user = createTestUser({ tier: 'premium' });
  const cart = createTestCart({ total: 100 });

  // Act
  const result = calculateTotal(cart, user);

  // Assert
  expect(result.total).toBe(80);
  expect(result.discountApplied).toBe(true);
});
```

**Python:**
```python
def test_applies_discount_for_premium_users():
    # Arrange
    user = create_test_user(tier="premium")
    cart = create_test_cart(total=100)

    # Act
    result = calculate_total(cart, user)

    # Assert
    assert result.total == 80
    assert result.discount_applied is True
```

## What to Test

| Layer | Test | Don't Test |
|-------|------|-----------|
| Utils/Helpers | All pure functions | Framework internals |
| Services | Business logic, edge cases | External API responses (mock them) |
| API Routes | Request/response contracts | Auth middleware (test separately) |
| Components | User interactions, conditional rendering | Styling, layout |

## Test Utilities

Keep test helpers in `tests/helpers/` or `tests/conftest.py`:

**TypeScript:**
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

**Python:**
```python
# tests/conftest.py
import pytest

@pytest.fixture
def test_user():
    return User(id="test-user-1", email="test@example.com", role="user")
```
