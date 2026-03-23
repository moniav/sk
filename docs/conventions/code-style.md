# Code Style Conventions

**Last updated:** 2026-03-23

## Language & Framework

- **Language:** JavaScript (ES modules)
- **Framework:** None — single-file CLI
- **Runtime:** Node.js >= 18

## Naming Conventions

### Files & Directories

```
CLI:              cli.mjs (single entry point)
Commands:         kebab-case.md (code-review.md, new-task.md)
Skills:           kebab-case dirs with SKILL.md (test-driven-development/SKILL.md)
Agents:           kebab-case.md (implementer.md, quality-reviewer.md)
Templates:        kebab-case.md (task-prd.md, epic.md)
```

### Code Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | camelCase, verb-first | `runInstall`, `countFiles`, `findSource` |
| Constants | camelCase (for ANSI helpers) | `c.green`, `c.bold` |
| Variables | camelCase | `targetArg`, `cmdCount`, `backedUp` |

### Boolean Naming

Use `is`, `has`, `can` prefixes or past-tense verbs:

```javascript
const backedUp = false;
const hasCommands = existsSync(skCommandsDir);
```

## Patterns

### CLI Output Pattern

Always use ASCII-safe output with the ANSI color helper:

```javascript
// Good
console.log(c.green("  [OK]") + " File copied");
console.log(c.red("[ERROR]") + " Something failed");
console.log(c.yellow("[WARN]") + " Proceed with caution");

// Bad — Unicode symbols break on Windows cp1255
console.log("✓ File copied");
console.log("❌ Something failed");
```

### Interactive Prompts

Use the `ask()` helper for user input:

```javascript
const answer = await ask("  Proceed? (y/n) ");
if (answer.toLowerCase() !== "y") {
  console.log("  Aborted.");
  process.exit(0);
}
```

### File Operations

Always check existence before operating, use recursive options:

```javascript
mkdirSync(dir, { recursive: true });
cpSync(src, dest, { recursive: true, force: true });
```

## Error Handling

- Use `process.exit(1)` for fatal errors after printing a clear message
- Check `existsSync()` before file operations
- No try/catch blocks — let unexpected errors surface naturally

## Import Order

```javascript
// Node.js built-ins only (no third-party imports)
import { existsSync, mkdirSync, cpSync, ... } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { createInterface } from "readline";
```

## Comments Philosophy

- Markdown command files are self-documenting (no code comments needed)
- `cli.mjs` uses section-separator comments (`// --- Section ---`, `// ====`)
- Usage/header comments at top of `cli.mjs`
