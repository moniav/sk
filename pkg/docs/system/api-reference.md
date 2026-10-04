# API Reference

**Last updated:** YYYY-MM-DD

## Endpoints

<!-- Document your API endpoints here as you build them -->

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| - | - | No endpoints documented yet | - |

## Request/Response Conventions

### Success Responses

```json
// 200 OK: Resource retrieved or updated
{ "data": { ... } }

// 201 Created: Resource created
{ "data": { "id": "...", ... } }

// 204 No Content: Resource deleted (empty body)
```

### Error Responses

```json
// 400 Bad Request: Validation error
{
  "error": "Validation failed",
  "details": {
    "email": "Required",
    "password": "Must be at least 8 characters"
  }
}

// 401 Unauthorized: Not authenticated
{ "error": "Authentication required" }

// 403 Forbidden: Not authorized
{ "error": "Insufficient permissions" }

// 404 Not Found
{ "error": "Resource not found" }

// 409 Conflict: Duplicate resource
{ "error": "Email already registered" }

// 500 Internal Server Error
{ "error": "Internal server error" }
```

## Authentication

<!-- Describe your auth mechanism: JWT, session, API key, etc. -->

## Rate Limiting

<!-- Describe rate limits if applicable -->
