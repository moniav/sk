# Testing Conventions

**Last updated:** 2026-03-23

## Testing Approach

SK has no automated test suite. Testing is manual:

```bash
# Test install into a temp directory
node cli.mjs /tmp/sk-test

# Test update
node cli.mjs update /tmp/sk-test

# Test update from local source
node cli.mjs update /tmp/sk-test --from /path/to/sk

# Test remove
node cli.mjs remove /tmp/sk-test

# Test commands: open a target project in Claude Code and run /sk:* commands
```

## What to Verify

| Scenario | Check |
|----------|-------|
| Fresh install | All files copied, validation passes, no errors |
| Install with existing docs | Backup created in `docs/old/`, new files copied |
| Update | Commands/templates overwritten, user content preserved |
| Update with `--from` | Uses specified source path |
| Remove | Commands/agents/skills removed, `docs/` preserved |
| Target doesn't exist | Prompts to create directory |
| Non-SK directory | Appropriate error message |

## Command Testing

Test new or modified slash commands in a real target project:

1. Install SK into a test project: `node cli.mjs /path/to/test-project`
2. Open that project in Claude Code
3. Run the command (e.g., `/sk:plan`)
4. Verify output and behavior
