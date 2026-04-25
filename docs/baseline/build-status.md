# Anvill baseline build/smoke status (source checkout)

Date: 2026-04-25

## Goal

Establish a reproducible CLI smoke baseline from a fresh source checkout, without requiring prebuilt `dist` artifacts.

## Commands attempted and outcomes

### 1) Existing package entrypoint smoke

Command:

```bash
node ./bin/cli.js --help
```

Result:

- **Previously failed** in fresh checkout with:
  - `Cannot find module .../v3/@claude-flow/cli/dist/src/index.js`.
- **Currently may pass** in environments where compatible build artifacts are already present.

Interpretation:

- The package/bin path expects built artifacts from `v3/@claude-flow/cli/dist`.
- This is a packaging-mode path, not a guaranteed source-checkout path.

### 2) Package-local build

Command:

```bash
cd v3/@claude-flow/cli && npm run build
```

Result:

- **Failed** with pre-existing workspace resolution/build issues, including:
  - `TS2307: Cannot find module '@claude-flow/shared'`
  - TS6305 dependent workspace declarations not built
  - missing optional/workspace packages in this environment

Interpretation:

- Build failure is **pre-existing** and not introduced by this PR.
- The build pipeline currently assumes wider workspace/package availability.

### 3) Package-local CLI tests (targeted)

Command:

```bash
cd v3/@claude-flow/cli && npx vitest run __tests__/cli.test.ts
```

Result:

- **Now passes** for targeted CLI tests in this environment after test-runner resolution hardening.

Mitigation in this PR:

- Vitest config now externalizes workspace/optional packages for test-time import analysis where paths are not executed in these tests:
  - `@claude-flow/*`
  - `@ruvector/*`
  - existing `agentic-flow` / `agentdb` handling retained.

## New supported minimal smoke path

Use source-checkout runner:

```bash
npm run dev:cli -- --help
npm run dev:cli -- --version
npm run dev:cli -- init --help
```

Or run the grouped baseline check:

```bash
npm run smoke:cli
```

This path executes CLI from TypeScript source via `tsx` and does not require prebuilt `dist` artifacts.

### 4) Source smoke before startup-boundary fix

Command:

```bash
npm run dev:cli -- --help
```

Previous failure (before this PR updates):

- `sharp` native module loading error from startup import chain.

Cause:

- Commands index eagerly imported core command modules during startup; importing `start/status/task/session` in this checkout triggered a transitive dependency path that loaded `sharp`.

Fix in this PR:

- Commands registry startup path was made fully lazy in `v3/@claude-flow/cli/src/commands/index.ts`.
- Top-level help already uses lightweight metadata and now no longer depends on eager command imports.

## What remains to fix later

1. Make package-mode `node ./bin/cli.js ...` work in fresh checkout without prior manual build, or enforce/document build prerequisites explicitly.
2. Resolve workspace build order/linking for `@claude-flow/shared` and other local packages in CI/dev bootstrap.
3. Reduce broader workspace TS6305 failures by building dependent packages before `@claude-flow/cli`.
4. Keep top-level help/import path optional-dependency-safe (no heavy/native deps required for `--help`, `--version`, `init --help`).
