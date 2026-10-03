---
name: technical-writing
description: Writes technical documentation, such as READMEs, API docs, guides, onboarding and architecture overviews, checked against the code. Use when creating or substantially rewriting developer documentation. Not for marketing copy.
---

# Technical Writing

Write documentation that developers actually read and find useful.

## When This Activates

- Creating or rewriting a README
- Writing API documentation
- Creating onboarding/getting-started guides
- Writing architecture or design documents
- Documenting runbooks or operational procedures
- When the user asks to "document X" or "write docs for X"

## Core Principles

1. **Start with the user's goal** — What is the reader trying to accomplish? Lead with that.
2. **Show, don't just tell** — Code examples > descriptions. Working examples > theoretical explanations.
3. **Progressive disclosure** — Quick start first, details later. Don't frontload complexity.
4. **Be precise** — Vague docs are worse than no docs. Specify versions, exact commands, expected outputs.
5. **Stay current** — Only document what actually exists in the code right now.

## Document Structures

### README
```
# Project Name
One-line description.

## Quick Start
3-5 steps to get running.

## Usage
Common use cases with code examples.

## API / Commands
Reference for available interfaces.

## Configuration
What can be configured and how.

## Contributing (if open source)
How to set up dev environment and submit changes.
```

### API Documentation
```
## Endpoint / Function Name
One-line purpose.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|

**Returns:** What it returns, with example.

**Example:**
[Working code example]

**Errors:** What can go wrong.
```

### Getting Started Guide
```
## Prerequisites
What you need before starting (be specific about versions).

## Installation
Exact steps, copy-pasteable commands.

## First [thing]
Walk through the simplest possible use case.

## Next Steps
Where to go from here (link to other docs).
```

### Architecture Document
```
## Overview
What the system does (1-2 paragraphs).

## Key Components
What the major pieces are and what they do.

## Data Flow
How data moves through the system.

## Key Decisions
Why it's built this way (link to ADRs).
```

## Writing Rules

- **Use active voice** — "The server processes requests" not "Requests are processed by the server"
- **Use present tense** — "This function returns" not "This function will return"
- **One idea per sentence** — If a sentence has "and" or "but", consider splitting it
- **Code examples must work** — Verify against the actual codebase. Never invent API that doesn't exist.
- **No filler** — Cut "In order to", "It should be noted that", "As mentioned above"
- **Heading hierarchy matters** — Don't skip levels. Use headings to enable scanning.
- **Link don't duplicate** — Reference other docs rather than copying content

## Anti-Patterns to Avoid

- Writing docs that describe the code structure instead of how to USE the code
- Documenting implementation details that will change (document behavior instead)
- Over-documenting simple things while under-documenting complex things
- Using jargon without explanation in docs meant for newcomers
- Writing a wall of text with no code examples
- Documenting aspirational features ("will support X") — only document what exists now
