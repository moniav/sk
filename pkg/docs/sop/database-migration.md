# SOP: Database Migration

**Last updated:** YYYY-MM-DD
**Criticality:** High — mistakes can cause data loss

## Pre-flight Checklist

- [ ] Read the current schema in `docs/system/database-schema.md`
- [ ] Verify migration is necessary (can the goal be achieved without schema changes?)
- [ ] Check for pending migrations that haven't been applied

## Steps

### 1. Create the Migration File

```bash
# Using your migration tool (adjust for your stack)
# Node/TS:  npx drizzle-kit generate:pg --name add_user_preferences
# Node/TS:  npx prisma migrate dev --name add_user_preferences
# Python:   alembic revision --autogenerate -m "add_user_preferences"
# Django:   python manage.py makemigrations --name add_user_preferences
```

### 2. Write the Migration

```sql
-- Always include both UP and DOWN
-- UP: What the migration does
ALTER TABLE users ADD COLUMN preferences jsonb DEFAULT '{}';

-- DOWN: How to reverse it
ALTER TABLE users DROP COLUMN preferences;
```

### 3. Validate Locally

```bash
# Apply migration to local DB
# npm run db:migrate / alembic upgrade head / python manage.py migrate

# Run the full test suite
# npm test / pytest / python -m unittest

# Verify with a quick smoke test
# npm run dev / uvicorn main:app --reload / python manage.py runserver
```

### 4. Update Documentation

- [ ] Update `docs/system/database-schema.md` with new schema
- [ ] Update any affected API docs in `docs/system/api-reference.md`
- [ ] Update relevant architecture docs if relationships changed

### 5. Deploy

- [ ] Migration reviewed in PR
- [ ] Applied to staging first
- [ ] Verified on staging
- [ ] Applied to production
- [ ] Verified on production

## Rollback Procedure

If something goes wrong:

1. Run the DOWN migration immediately
2. Verify application is stable
3. Investigate root cause before retrying

## Common Pitfalls

| Pitfall | Prevention |
|---------|-----------|
| Dropping a column that's still referenced | Search codebase for column name first |
| Large table migrations locking DB | Use `ALTER TABLE ... ADD COLUMN` (non-blocking in Postgres) |
| Missing default values | Always specify defaults for new non-nullable columns |
| Forgetting the DOWN migration | Template enforces it |
