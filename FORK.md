# Fork Notice

This repository is a fork of **RuFlo / claude-flow**.

## Fork identity

- **Fork project name:** Anvill
- **CLI display name direction:** `anvill`
- **Current phase:** controlled rebrand and grounding pass

## Attribution and license

- Upstream attribution to RuFlo / claude-flow is intentionally preserved.
- The upstream **MIT License** is preserved in this repository.
- This pass does not remove historical references that are required for compatibility.

## Controlled rebrand scope (phase 1)

This phase introduces Anvill in public-facing docs and visible CLI identity while preserving compatibility:

- Keep existing package/import/runtime compatibility where possible.
- Keep existing `claude-flow` aliases functional.
- **Package rename is deferred**; npm package name can remain `claude-flow` until references and tests are fully migrated.
- Defer deep internal renames until they are validated by tests.

## Migration placeholders (planned)

Future migration targets are documented now but not enforced in runtime yet:

- Config directory target: `.anvill/`
- Policy file target: `ANVILL.md`

Current behavior remains compatible with existing `.claude-flow/` and `CLAUDE.md` conventions in this phase.
