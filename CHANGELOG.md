# Changelog

## 1.5.0 (2026-03-23)

### Features

- **Orchestrate command** — `/sk:orchestrate` for parallel agent team execution with dependency-aware Plan > Dev > Test (`f35b2eb`)
- **Council command** — `/sk:council` convenes multi-persona advisory debates and produces decision reports (`f35b2eb`)
- **Technical diagrams skill** — consistent SVG diagram generation for architecture and flow docs (`f35b2eb`)
- **Legal advisor skill** — umbrella skill for legal/compliance scanning with enhanced frontmatter (`07f3545`)
- **Legal scan command** — `/sk:legal-scan` for detecting regulatory requirements and generating legal documents (`d887936`)
- **Package separation** — self-contained `pkg/` directory, cleanly separated from project root (`78749a7`)

### Fixes

- Move commands, agents, and skills into `pkg/` for self-contained package (`9e70ba8`)
- Enforce `docs/legal/` output structure for legal-advisor (`b3a5dbe`)

### Docs

- Add Superpowers analysis and unified SK v2 system design (`427d383`)
- Update README for pkg/ separation, new features, and update flow (`482d467`)
- Add analysis reports and enable skill-creator plugin (`10f8bff`)

## 1.4.1 (2025-12-01)

- Previous release
