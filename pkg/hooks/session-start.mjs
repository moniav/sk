#!/usr/bin/env node
// SK session-start briefing. Runs on SessionStart (startup, /clear, /compact).
//
// When docs/tasks/.current names an active task, it adds a short reference note to
// the session: the task, its status and phase, the next subtask and the task file.
// Otherwise it prints nothing. It never blocks: every path exits 0, nothing is
// written to stderr, and stdin is not read. Set SK_SESSION_BRIEF=off to disable it.
//
// Rules this script keeps (from repositories that shipped such hooks):
// - output goes in hookSpecificOutput.additionalContext, which the model reads;
// - at most MAX characters, the same bytes for the same files (no clock), fixed order;
// - text taken from the repository is treated as data: one line per field, truncated.

import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const MAX = 1500;
const FIELD = 160;

function clean(value) {
  // Repository text is data: no control characters, no line breaks, bounded length.
  const flat = String(value ?? "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > FIELD ? flat.slice(0, FIELD - 1) + "…" : flat;
}

function readPointer(path) {
  const fields = {};
  for (const line of readFileSync(path, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([a-z_]+):\s*(.*?)\s*(?:#.*)?$/);
    if (m && m[2]) fields[m[1]] = m[2];
  }
  return fields;
}

function frontmatterField(text, key) {
  const end = text.startsWith("---") ? text.indexOf("\n---", 3) : -1;
  if (end === -1) return "";
  const m = text.slice(0, end).match(new RegExp(`^${key}:\\s*(.*?)\\s*(?:#.*)?$`, "m"));
  return m ? m[1].replace(/^["']|["']$/g, "") : "";
}

function briefing(projectDir) {
  const tasksDir = join(projectDir, "docs", "tasks");
  const pointer = join(tasksDir, ".current");
  if (!existsSync(pointer)) return "";
  const cur = readPointer(pointer);
  const id = clean(cur.task);
  if (!/^(TASK|EPIC)-\d+$/.test(id)) return "";

  let file = "";
  let status = "";
  let title = clean(cur.name);
  const match = readdirSync(tasksDir).filter((f) => f.startsWith(`${id}-`) && f.endsWith(".md")).sort()[0];
  if (match) {
    file = `docs/tasks/${match}`;
    const text = readFileSync(join(tasksDir, match), "utf-8");
    status = clean(frontmatterField(text, "status"));
    title = clean(frontmatterField(text, "title")) || title;
  }

  const facts = [
    `${id}${title ? ` "${title}"` : ""}`,
    status && `status: ${status}`,
    cur.phase && `phase: ${clean(cur.phase)}`,
    cur.subtask && `subtask: ${clean(cur.subtask)}`,
    cur.next && `next: ${clean(cur.next)}`,
    cur.last && `last: ${clean(cur.last)}`,
  ].filter(Boolean);

  // Discipline skills rarely fire on their own (they read as things Claude can do unaided),
  // so the briefing names the one that applies to the task's phase.
  const phase = clean(cur.phase).toLowerCase();
  const discipline =
    phase === "dev"
      ? "In this phase: write and run a failing test before changing code (test-driven-development), and show command output before calling anything done (verification-before-completion)."
      : phase === "test"
        ? "In this phase: every criterion ends passed, failed or untested, with fresh command output as evidence (verification-before-completion)."
        : "";
  const lines = [
    "For reference only: the active SK task in this project, from docs/tasks/.current. Do not resume work unless the user asks; check `git status` first.",
    facts.join(" · "),
    discipline,
    file ? `Task file: ${file}. /sk:resume gives the full briefing.` : "/sk:resume gives the full briefing.",
  ];
  const text = lines.filter(Boolean).join("\n");
  return text.length > MAX ? text.slice(0, MAX - 1) + "…" : text;
}

try {
  if (process.env.SK_SESSION_BRIEF !== "off") {
    const text = briefing(process.env.CLAUDE_PROJECT_DIR || process.cwd());
    if (text) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: text } }));
    }
  }
} catch {
  // A briefing is a convenience; a failure must never disturb the session.
}
process.exitCode = 0;
