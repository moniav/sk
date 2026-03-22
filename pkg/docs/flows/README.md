# Flow Diagrams

> Visual diagrams for key system processes using Mermaid syntax.
> These render natively in GitHub, VS Code, and most markdown viewers.

**Last updated:** YYYY-MM-DD

## Diagram Index

<!-- Add your flow diagrams here as you create them with /sk:new-flow -->

| Flow | Type | Description |
|------|------|-------------|
| — | — | No flows created yet |

## Suggested Flows

Create these as your project develops, using the [flow template](../templates/flow-diagram.md):

| Flow | Type | Description |
|------|------|-------------|
| User Authentication | Sequence | Login, signup, token refresh |
| Request Lifecycle | Flowchart | From HTTP request to response |
| Data Pipeline | Flowchart | How data moves through the system |
| Deployment | Flowchart | CI/CD pipeline stages |
| Error Handling | Flowchart | How errors propagate and get handled |

## Mermaid Cheat Sheet

### Sequence Diagram (for interactions between components)

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as Database
    
    C->>A: POST /api/login
    A->>D: SELECT user WHERE email = ?
    D-->>A: User record
    A->>A: Verify password hash
    alt Valid credentials
        A-->>C: 200 + JWT token
    else Invalid credentials
        A-->>C: 401 Unauthorized
    end
```

### Flowchart (for processes and decisions)

```mermaid
flowchart TD
    A[Request Received] --> B{Authenticated?}
    B -->|Yes| C{Authorized?}
    B -->|No| D[401 Unauthorized]
    C -->|Yes| E[Process Request]
    C -->|No| F[403 Forbidden]
    E --> G{Success?}
    G -->|Yes| H[200 Response]
    G -->|No| I[500 Error + Log]
```

### State Diagram (for entity lifecycles)

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Pending: Submit
    Pending --> Approved: Approve
    Pending --> Rejected: Reject
    Rejected --> Draft: Revise
    Approved --> Active: Publish
    Active --> Archived: Archive
    Archived --> [*]
```

### Entity Relationship (for data models)

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER {
        uuid id PK
        string email
        string name
    }
    ORDER ||--|{ LINE_ITEM : contains
    ORDER {
        uuid id PK
        uuid user_id FK
        decimal total
        string status
    }
    LINE_ITEM {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
    }
```

> Create new flow diagrams using the [flow template](../templates/flow-diagram.md)
