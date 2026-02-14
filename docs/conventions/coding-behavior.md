# Coding Behavior

**Last updated:** 2026-02-14

> How to think during implementation -- behavioral guardrails that prevent common LLM coding failures.
> **Claude Code:** Internalize these principles. They apply to every task, every phase.

## 1. Surface Assumptions Before Writing Code

**Principle:** Never start implementing with unverified assumptions. State what you believe to be true, confirm it, then proceed.

### Good Example
```
Before implementing:
- "I assume the users table has a unique constraint on email -- confirming by reading schema."
- "I assume we want server-side validation only -- checking AC for client-side mention."
- "The task says 'handle errors' -- I'll verify which specific errors need handling."
```

### Bad Example
```
Before implementing:
- (starts coding immediately)
- (assumes email is unique without checking)
- (adds client-side AND server-side validation because "it's best practice")
- (handles every possible error type because "it's safer")
```

### Anti-Patterns
- **Assuming context:** Acting on beliefs about the codebase without verifying them first
- **Silent interpretation:** Choosing one interpretation of ambiguous requirements without flagging it
- **Best-practice bloat:** Adding things "because they're good practice" when not in the requirements
- **Cargo-culting:** Copying patterns from other projects without checking if they apply here

## 2. Do Exactly What Was Asked (No More, No Less)

**Principle:** Implement what the acceptance criteria specify. Resist the urge to add "while I'm here" improvements. Scope creep from helpful intentions is still scope creep.

### Good Example
```markdown
Task: "Add a DELETE /api/users/:id endpoint"

Implementation:
- [x] Add DELETE route
- [x] Add authorization check
- [x] Return 204 on success
- [x] Return 404 if user not found
(Done. Exactly what was asked.)
```

### Bad Example
```markdown
Task: "Add a DELETE /api/users/:id endpoint"

Implementation:
- [x] Add DELETE route
- [x] Add authorization check
- [x] Return 204 on success
- [x] Return 404 if user not found
- [x] Refactor all other user routes to use new middleware (drive-by)
- [x] Add soft-delete option with restore endpoint (speculative)
- [x] Add bulk delete endpoint (not requested)
- [x] Update user list component to show delete button (UI not in scope)
```

### Anti-Patterns
- **Drive-by refactoring:** "While I'm in this file, let me also clean up..."
- **Speculative features:** "They'll probably need this next, so I'll add it now"
- **Gold plating:** Adding extra error handling, logging, or configuration beyond what's needed
- **Premature abstraction:** Creating generic utilities for a single use case

## 3. Keep the Solution as Simple as Possible

**Principle:** The right solution is the simplest one that satisfies all acceptance criteria. Complexity must be justified by a specific requirement, not by "what if" scenarios.

### Good Example
```python
# Task: "Return user's full name"
# AC: "GET /api/users/:id returns fullName field"

def get_full_name(user):
    return f"{user.first_name} {user.last_name}"
```

### Bad Example
```python
# Task: "Return user's full name"
# AC: "GET /api/users/:id returns fullName field"

class NameFormatter:
    """Flexible name formatting with i18n support."""

    FORMATS = {
        "western": "{first} {last}",
        "eastern": "{last} {first}",
        "formal": "{title} {last}",
    }

    def __init__(self, locale="en", format_key="western"):
        self.locale = locale
        self.format_key = format_key
        self.template = self.FORMATS.get(format_key, self.FORMATS["western"])

    def format(self, user):
        return self.template.format(
            first=user.first_name,
            last=user.last_name,
            title=getattr(user, "title", ""),
        )
```

### Anti-Patterns
- **Over-engineering:** Building for requirements that don't exist yet
- **Abstraction addiction:** Creating classes/interfaces/patterns for single-use logic
- **Configuration obsession:** Making everything configurable instead of hardcoding known values
- **Framework mentality:** Designing a framework when a function would do

## 4. Verify Goals After Implementation (Not Just "It Runs")

**Principle:** After implementing, re-read each acceptance criterion and verify it is met with specific evidence. "It works" is not verification. "POST /api/users returns 201 with {id, email, name}" is.

### Good Example
```markdown
Verification:
- [x] AC-1: "POST /api/users returns 201" -- Tested: sent valid payload, got 201 with {id, email, name}
- [x] AC-2: "Invalid email returns 400" -- Tested: sent {email: "bad"}, got 400 with {error: "Invalid email format"}
- [x] AC-3: "Duplicate email returns 409" -- Tested: sent existing email, got 409 with {error: "Email already exists"}
```

### Bad Example
```markdown
Verification:
- [x] AC-1: "POST /api/users returns 201" -- Works fine
- [x] AC-2: "Invalid email returns 400" -- Handled
- [x] AC-3: "Duplicate email returns 409" -- Done
```

### Anti-Patterns
- **Vague confirmation:** "It works" / "Looks good" / "Tests pass" without specifics
- **Assumption of correctness:** Marking criteria as met without actually testing them
- **Partial verification:** Testing the happy path but skipping error cases mentioned in AC
- **Output blindness:** Running a test but not reading the output to confirm it matches expectations
