---
tags: [trigger, quiet, create-pdf, holdout]
max_turns: 4
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
---

Our docs site has a 'Download as PDF' button in site/_includes/footer.html pointing at /assets/handbook.pdf, but it 404s since we moved assets to /static. Fix the link.
