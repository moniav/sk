---
tags: [trigger, fire, create-pdf, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Our auditors asked for the architecture decision records as one document they can file. Combine docs/decisions/*.md in order and give me a PDF with a contents page at the front.
