# Tech Stack

**Last updated:** YYYY-MM-DD

## Core

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Language | TypeScript | 5.x | Primary language |
| Runtime | Node.js | 20.x | Server runtime |
| Framework | Next.js | 15.x | Full-stack web framework |
| Database | PostgreSQL | 16.x | Primary data store |
| ORM | Drizzle | 0.3x | Type-safe DB queries |
| Cache | Redis | 7.x | Session store, caching |
| Auth | NextAuth | 5.x | Authentication |

## Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Hosting | Vercel | Application hosting |
| Database | Supabase / Neon | Managed Postgres |
| Storage | S3 / R2 | File uploads |
| Email | Resend | Transactional email |
| Monitoring | Sentry | Error tracking |
| Analytics | PostHog | Product analytics |

## Dev Tools

| Tool | Purpose |
|------|---------|
| pnpm | Package manager |
| Biome / ESLint | Linting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| GitHub Actions | CI/CD |

## Key Dependencies

<!-- List non-obvious dependencies that have project-wide impact -->

| Package | Why We Use It | Notes |
|---------|--------------|-------|
| `zod` | Runtime validation | Used for all API input validation |
| `date-fns` | Date handling | Preferred over dayjs/moment |
