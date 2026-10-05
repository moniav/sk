---
name: prototype
description: Builds several genuinely different, clickable versions of one user flow behind a picker so the user can flip through them and choose. Loaded by /sk:prd during the user-flows stage; not invoked directly.
disable-model-invocation: true
user-invocable: false
---

# Prototype a Flow

Answer "how should this flow look and behave?" by building it several different ways and letting the user click through each, instead of deciding it in prose.

Adapted from the `prototype` and `break-ui` skills in [emilkowalski/skill](https://github.com/emilkowalski/skill) (MIT).

## Rules

1. **One flow per run.** If the brief spans several flows, prototype the primary one and offer the rest as further runs.
2. **Divergence is the point.** Each variant is a different answer to the same flow, on a named axis: layout, density, number of steps, interaction model (wizard, single page, inline editing, chat), or where the decision happens. Two variants that differ only in colour or copy are one variant; replace one.
3. **Every variant works end to end.** The user can click from the trigger to the end state, including the decided failure paths. No dead buttons, no "imagine this step", no lorem ipsum: use product-shaped names, numbers and copy from the PRD's Glossary and personas.
4. **A worst-case toggle on every variant.** Alongside the demo data, a worst-case dataset from [worst-case-data.md](references/worst-case-data.md), switched by the picker. What breaks under it is a finding.
5. **Never touch production code.** Prototypes are documentation. They live in `docs/prd/`, import nothing from the app, and nothing in the app imports them.
6. **The choice is the user's.** Present the variants honestly and stop. Do not pre-pick.

## Steps

### 1. Scope

Restate the flow in one sentence: who, from which trigger, to which end state, and which steps are the open question. Read that flow's section in the PRD, including its edge-case table.

### 2. Recon

- **Existing product:** read the styling system, design tokens (colours, radii, spacing, fonts) and one or two existing screens near where this flow will live. Variants use these so each looks like it could ship.
- **Greenfield:** a restrained neutral look: system font stack, greys, one accent colour.
- Note anything the PRD fixes: RTL as the default direction, mobile first, accessibility level.

### 3. Choose directions

Default 3 variants, up to 5 if the user asks or the space is wide. Before building, list them: a name that describes the direction ("Guided", "One page", "Inline") and its axis. Show the list to the user in one line each, then build.

### 4. Build

One self-contained HTML file: `docs/prd/PRD-{N}-prototypes/F-{n}-{slug}.html`, with inline CSS and JavaScript, openable directly in a browser with no build step and no network.

- Each variant is a full-size screen sequence in realistic surroundings (the page around a dialog, the list around a card). Never show variants as side-by-side thumbnails.
- State is in memory only. Simulate the server with small in-file functions, including the failures the flow's edge-case table names (a toggle or a "simulate failure" control in the picker bar).
- The picker follows [picker.md](references/picker.md).

### 5. Verify

Open the file with a browser tool if one is available: flip through every variant on both datasets, click every path, and check the console is clean. Screenshot each variant. Without a browser tool, read the file back and trace each variant's path from trigger to end state, and say that it was not run.

### 6. Present and stop

| # | Variant | Axis | Wins when | Costs |
|---|---------|------|-----------|-------|

One honest line on when each wins and what it costs. List what broke on the worst-case data, per variant. Give the file path and the picker keys. Then wait.

If asked which you would pick, answer from the personas' frequency of use and the PRD's success metric, not from looks.

### 7. Record

When the user picks (or asks for another round around one direction, then repeat from step 3):
- Write the chosen variant and the reason on the flow's **Prototype** line in the PRD, with the file path.
- Turn what the choice decided (number of steps, where validation happens, what is shown on failure) into FRs and edge-case rows.
- Keep the file: it records the alternatives considered. Delete it only if the user asks.
