# Task Board

> All active work, organized by lifecycle phase.
> See [Development Lifecycle](../lifecycle/README.md) for how the Plan → Dev → Test cycle works.
> See [SOP: Creating a Task](../sop/creating-a-task.md) for step-by-step guide.

**Last updated:** YYYY-MM-DD

## How to Use This Board

1. **New work?** → Follow the [Creating a Task SOP](../sop/creating-a-task.md)
2. **L/XL complexity?** → Create an Epic using [epic template](../templates/epic.md)
3. **M complexity?** → Create a Task using [task template](../templates/task-prd.md)
4. **XS/S complexity?** → Just do it, still follow Plan→Dev→Test mentally

## Active Epics

| Epic | Tasks | Progress | Priority | Link |
|------|-------|----------|----------|------|
| <!-- User Auth --> | <!-- 3/5 done --> | <!-- 🟡 --> | <!-- P0 --> | [Link](./EPIC-name.md) |

## Task Pipeline

### 🎯 Planning

| Task | Parent Epic | Priority | Link |
|------|-------------|----------|------|
| <!-- Define user roles --> | <!-- Auth --> | <!-- P1 --> | [Link](./TASK-name.md) |

### 🔨 In Progress

| Task | Parent Epic | Priority | Subtask Progress | Link |
|------|-------------|----------|-----------------|------|
| <!-- Registration API --> | <!-- Auth --> | <!-- P0 --> | <!-- 5/8 --> | [Link](./TASK-name.md) |

### 🧪 Testing

| Task | Parent Epic | Criteria Met | Link |
|------|-------------|-------------|------|
| <!-- Login API --> | <!-- Auth --> | <!-- 3/4 --> | [Link](./TASK-name.md) |

### ✅ Recently Completed

| Task | Completed | Link |
|------|-----------|------|
| <!-- User Registration API --> | <!-- 2025-02-11 --> | [Example](./examples/TASK-user-registration-api.md) |

## Backlog

| Task | Priority | Notes |
|------|----------|-------|
| <!-- Email verification --> | <!-- P2 --> | <!-- After core auth is done --> |

## Examples

See [examples/](./examples/) for completed tasks showing the full lifecycle in action:
- [TASK-user-registration-api](./examples/TASK-user-registration-api.md) — A worked example of a complete task
