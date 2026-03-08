# Project Directives

## Build & Verification Commands

- **Backend typecheck**: `bun tsc --noEmit`
- **Regenerate types** (if routes changed): `bunx nitro prepare` (run before `bun tsc`)
- **Unit tests**: `bun test`
- **Test coverage**: `bun test --coverage`
- **Linter**: `bunx biome check`
- **Runtime**: always use `bun`/`bunx`, never `npm`/`npx`

## Development Workflow

1. Always verify the build before committing (`bun tsc --noEmit`)
2. Run `bunx nitro prepare` before `bun tsc` if routes were added/modified
3. Run tests before committing: `bun test`
4. Run `bunx biome check --write` to auto-fix formatting and lint
5. Fix remaining lint errors. `biome-ignore` is exceptional — only when justified, with an explanation in the comment

## Commit Strategy

- **Conventional Commits**: `type(scope): description` — types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`
- **Scopes**: domain name for business changes (`feat(image): ...`), technical name otherwise (`chore(deps): ...`). Omit scope if too broad
- **Commit after each verified task**: all checks pass (build + tests + lint) before committing
- **Fine granularity, functional coherence**: each commit = one logical change

## Backend Patterns (TypeScript/Nitro)

- Domain architecture: `server/domain/{domain}/types.ts`, `primitives.ts`, `command.ts`
- Branded types with `ts-brand` + Zod validation constructors in `primitives.ts`
- Discriminated unions for expected business outcomes only (not technical errors). `throw` for impossible states
- **Naming**: function names carry the business concept, not the technical pattern
- Formatter: Biome (spaces, single quotes, no semicolons, line width 100)
- Logging: `createLogger(tag)` from `~/system/logger` — never use raw `console.log/error`

## Backend Testing

- **Framework**: `bun:test` (native, zero dependencies)
- **Test files co-located** next to the file under test (no `__test__/` directories)
- **Suffixes**: `*.unit.test.ts` (unit), `*.int.test.ts` (integration), `*.feat.test.ts` (feature)
- **Infrastructure**: `server/test/setup.ts` preloaded via `bunfig.toml`

## Code Style

- **Never type return values** — let TypeScript infer
- **Full variable names** — `migration` not `m`
- **Destructure in callbacks** — `({ version }) => version`
- **Inline single-line guards** — `if (...) return ...` on one line
- **`as const` on all literal returns**
- **Use `Date` type** — not `string` for dates
- **Never `switch`** — use `match()` from `ts-pattern` with `.exhaustive()`
- **Never `for`/`while` loops** — use `map`/`filter`/`reduce`
- **Arrays never optional** — `[]` is the neutral state

## API Token

The API token is used for authentication when `NITRO_API_TOKEN` is set.

## External Dependencies

- `uv` must be installed locally for development (Python package runner)
- `rembg` is invoked via `uv run --with rembg` (no global install needed)
