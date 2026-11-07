# Stack Signals

> Where to look in a codebase, per ecosystem. Read by `/sk:init-docs`, `/sk:update-docs` and `/sk:docs-audit` to find packages, entry points, routes, data models, tests and code to skip, so a scan works in any language.
> These are detection hints, not templates: nothing here is written into your docs. Add rows for your own stack.

**Last updated:** YYYY-MM-DD

## Contents

1. [Workspaces and packages](#workspaces-and-packages)
2. [Ecosystems](#ecosystems)
3. [Always skip](#always-skip)
4. [How to use this](#how-to-use-this)

## Workspaces and packages

A repository holds several packages when any of these exist. Document each package, plus the root for what they share.

| Signal | Packages are |
|--------|--------------|
| `package.json` with `"workspaces"`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, `turbo.json` | the folders those globs name (often `packages/*`, `apps/*`) |
| `Cargo.toml` with `[workspace]` | its `members` |
| `go.work` | its `use` directories |
| `settings.gradle` or `settings.gradle.kts` with `include` | the included projects |
| `pom.xml` with `<modules>` | each module |
| `*.sln` | each referenced `*.csproj` |
| `mix.exs` with `apps_path` (umbrella) | each app under `apps/` |
| More than one manifest below the root (`pyproject.toml`, `composer.json`, `Gemfile`, `Package.swift`) | each folder holding one |

## Ecosystems

Detect an ecosystem by its manifest, then use its row. Patterns are for Grep, case-sensitive unless marked.

### JavaScript and TypeScript
- **Manifest:** `package.json` (`dependencies`, `devDependencies`, `scripts`)
- **Entry points:** `main`/`bin`/`exports` in `package.json`; `src/index.*`, `src/main.*`, `server.*`, `app.*`; Next.js `app/` or `pages/`
- **Routes:** `app\.(get|post|put|patch|delete)\(`, `router\.(get|post|put|patch|delete)\(`, `@(Get|Post|Put|Patch|Delete)\(` (NestJS), `export (async )?function (GET|POST|PUT|PATCH|DELETE)` (Next.js route handlers), files under `pages/api/`
- **Data:** `prisma/schema.prisma`, `drizzle/`, `migrations/`, `*.entity.ts` (TypeORM), `mongoose.Schema`
- **Tests:** `**/*.test.*`, `**/*.spec.*`, `__tests__/`

### Python
- **Manifest:** `pyproject.toml`, `requirements*.txt`, `setup.py`, `Pipfile`
- **Entry points:** `[project.scripts]`; `manage.py` (Django); `main.py`, `app.py`, `wsgi.py`, `asgi.py`
- **Routes:** `@(app|router|bp|api)\.(get|post|put|patch|delete|route)\(`, `path\(` and `re_path\(` in `urls.py` (Django)
- **Data:** `models.py`, `class \w+\((Base|db\.Model|models\.Model|SQLModel)`, `alembic/versions/`, `*/migrations/`
- **Tests:** `test_*.py`, `*_test.py`, `tests/`, `conftest.py`

### Go
- **Manifest:** `go.mod`
- **Entry points:** `cmd/*/main.go`, `main.go` (`package main`)
- **Routes:** `\.(HandleFunc|Handle)\(`, `\.(GET|POST|PUT|PATCH|DELETE)\(` (gin, echo), `r\.(Get|Post|Put|Patch|Delete)\(` (chi)
- **Data:** `migrations/`, `*.sql`, `gorm:"`, `sqlc.yaml`
- **Tests:** `*_test.go`

### Rust
- **Manifest:** `Cargo.toml`
- **Entry points:** `src/main.rs`, `src/bin/*.rs`, `src/lib.rs`
- **Routes:** `#\[(get|post|put|patch|delete)\(` (actix, rocket), `\.route\(` (axum)
- **Data:** `migrations/` (sqlx, diesel), `schema.rs`, `#\[derive\([^)]*(FromRow|Queryable)`
- **Tests:** `tests/`, `#\[cfg\(test\)\]`, `#\[test\]`

### Java and Kotlin
- **Manifest:** `pom.xml`, `build.gradle`, `build.gradle.kts`
- **Entry points:** `public static void main`, `@SpringBootApplication`, `fun main\(`
- **Routes:** `@(Get|Post|Put|Patch|Delete|Request)Mapping`, `@Path\(` (JAX-RS)
- **Data:** `@Entity`, `src/main/resources/db/migration/` (Flyway), `db/changelog/` (Liquibase)
- **Tests:** `src/test/`, `*Test.java`, `*Test.kt`

### C# and .NET
- **Manifest:** `*.csproj`, `*.sln`, `Directory.Packages.props`
- **Entry points:** `Program.cs`, `Startup.cs`
- **Routes:** `\[Http(Get|Post|Put|Patch|Delete)`, `\[Route\(`, `app\.Map(Get|Post|Put|Patch|Delete)\(`
- **Data:** `DbContext`, `Migrations/`, `DbSet<`
- **Tests:** `*.Tests/`, `*Tests.cs`, `[Fact]`, `[Test]`

### Ruby
- **Manifest:** `Gemfile`, `*.gemspec`
- **Entry points:** `config.ru`, `config/application.rb` (Rails), `bin/*`
- **Routes:** `config/routes.rb`; `(get|post|put|patch|delete) ['"]/` (Sinatra)
- **Data:** `app/models/`, `db/migrate/`, `db/schema.rb`
- **Tests:** `spec/`, `test/`, `*_spec.rb`, `*_test.rb`

### PHP
- **Manifest:** `composer.json`
- **Entry points:** `public/index.php`, `artisan` (Laravel), `bin/console` (Symfony)
- **Routes:** `routes/*.php` with `Route::(get|post|put|patch|delete)`, `#\[Route\(` (Symfony)
- **Data:** `app/Models/`, `database/migrations/`, `src/Entity/`
- **Tests:** `tests/`, `*Test.php`

### Elixir
- **Manifest:** `mix.exs`
- **Entry points:** `lib/*/application.ex`
- **Routes:** `lib/*_web/router.ex` with `(get|post|put|patch|delete) "`
- **Data:** `schema "`, `priv/repo/migrations/`
- **Tests:** `test/`, `*_test.exs`

### Swift
- **Manifest:** `Package.swift`, `*.xcodeproj`
- **Entry points:** `@main`, `main.swift`, `App.swift`
- **Routes:** `app\.(get|post|put|patch|delete)\(` (Vapor)
- **Data:** `@Model` (SwiftData), `Migrations/`, `.xcdatamodeld`
- **Tests:** `Tests/`, `*Tests.swift`

## Always skip

Never read for documentation, and list as skipped: `node_modules/`, `vendor/`, `.venv/`, `venv/`, `target/`, `build/`, `dist/`, `out/`, `bin/` and `obj/` (.NET), `.next/`, `coverage/`, `__pycache__/`, `*.min.*`, generated clients and code marked "generated", lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `poetry.lock`, `Cargo.lock`, `go.sum`, `Gemfile.lock`, `composer.lock`), and secret files (`.env`, `.env.*` except `.env.example`, `.env.sample`, `.env.template`, `.env.dist`; `*.pem`, `*.key`).

## How to use this

1. Find the packages (first table). One package: the root is the package.
2. For each package, find its ecosystem by manifest and read that section.
3. Glob the entry points, Grep the route and data patterns in that package's source, and find its tests, skipping the folders above.
4. An ecosystem not listed: read the manifest and the README, find the entry point by name (`main`, `app`, `server`, `index`), and note the gap in the report so the row can be added here.
