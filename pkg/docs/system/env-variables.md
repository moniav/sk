# Environment Variables

**Last updated:** YYYY-MM-DD

## Required Variables

<!-- Variables the application will not start without -->

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| `DATABASE_URL` | Primary database connection | `postgresql://user:pass@localhost:5432/db` | Yes |
| `APP_ENV` | Runtime environment | `development` / `production` | Yes |

## Optional Variables

<!-- Variables with sensible defaults -->

| Variable | Purpose | Default | Required |
|----------|---------|---------|----------|
| `PORT` | Server port | `3000` | No |
| `LOG_LEVEL` | Logging verbosity | `info` | No |

## Third-Party Service Keys

<!-- API keys, secrets, tokens for external services -->

| Variable | Service | Where to Get It |
|----------|---------|----------------|
| - | No service keys configured yet | - |

## Local Development

```bash
# Copy the example env file
cp .env.example .env

# Fill in your local values
# Never commit .env: it's in .gitignore
```

## Adding New Variables

1. Add to `.env.example` with a placeholder value
2. Add to this doc with purpose and example
3. Add validation in config loader (e.g., `src/config/` or `config.py`)
4. Update deployment configs if needed
