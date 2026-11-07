---
tags: [trigger, quiet, create-pdf, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

We need our Express API to generate invoices as PDFs on the fly for customers. Should I use pdfkit or puppeteer? What are the tradeoffs for a service doing ~5k a day?
