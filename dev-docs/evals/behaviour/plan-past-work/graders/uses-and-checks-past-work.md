---
type: llm
---
TASK-3 (password reset, done) holds two lessons the new task needs and one claim that is no longer true: links come from APP_URL, never the request Host header; mail goes through the queue (`enqueue`), not `sendNow`; and "tokens live in the `reset_tokens` table", which migration 002 renamed to `tokens`.
PASS if the plan (in the task file or the response) cites TASK-3, carries over the APP_URL rule for the link, and does not plan against `reset_tokens`: it uses `tokens` and notes that TASK-3's claim is out of date.
FAIL if it never mentions TASK-3, builds the link from the Host header or leaves the link source unstated, or plans to use the `reset_tokens` table.
