# Bitburner Starter Scaffold Design

## Purpose

Create a fresh Bitburner scripts repository that supports multi-session and multi-agent work from the first commit. The repo should preserve project memory, make the current gameplay strategy visible, and provide a small starter script/tooling structure that can grow with the playthrough.

## Context

The repository is currently empty except for Git metadata. It should be scaffolded according to the project memory template at `C:\Users\Jeffrey\Desktop\Dev\SourceCode\agency-ely-v2\projects\_template`.

Primary Bitburner references:

- Official game site: `https://bitburner-official.github.io/`
- Official source repository: `https://github.com/bitburner-official/bitburner-src`
- Wiki: `https://bitburner.fandom.com/wiki/Bitburner_Wiki`

The official source repository identifies the in-game documentation as the best up-to-date reference and the generated NS API documentation as the API source of truth. The wiki is useful secondary context, especially for gameplay summaries.

## Goals

- Create project memory files that future agents can read quickly.
- Establish a script layout that separates runnable scripts from reusable helpers.
- Include starter scripts for a fresh playthrough without importing another player's automation.
- Add lightweight local tooling for checks and helper tests.
- Record conventions for handoff, gameplay state, and future development decisions.

## Non-Goals

- Do not clone or port someone else's Bitburner script collection.
- Do not build late-game automation on day one.
- Do not require a heavy bundler unless later scripts need one.
- Do not assume access to BitNode-specific APIs before the current run earns them.
- Do not treat the wiki as more authoritative than official docs or source-derived API docs.

## Architecture

The scaffold will combine the template's project memory structure with a Bitburner-specific source layout.

Top-level project memory:

- `README.md`: purpose, desired outcome, scope, references, current status.
- `STATE.json`: machine-readable lifecycle, goals, focus, gates, and repo metadata.
- `LOG.md`: chronological session log.
- `DECISIONS.md`: durable decisions and rationale.
- `docs/`: handoff notes, conventions, and design/spec material.
- `plans/`: implementation plans and future work breakdowns.
- `evidence/`: command output, screenshots, or verification notes.
- `references/`: curated links and notes from official docs/source/wiki.

Bitburner code:

- `src/bin/`: runnable Netscript entrypoints copied into the game.
- `src/lib/`: shared helpers that are small, pure where possible, and easy to test locally.
- `tests/`: Node-based unit tests for helpers that do not depend on the live game runtime.

This keeps gameplay scripts approachable while allowing future agents to reason about discrete helpers instead of one large automation file.

## Starter Components

Initial runnable scripts should be modest:

- `src/bin/bootstrap.js`: first-run orchestration and status output.
- `src/bin/scan.js`: network discovery and server summary.
- `src/bin/hack-once.js`: small manual hack/grow/weaken runner for early experimentation.

Initial helpers should focus on low-risk foundations:

- `src/lib/network.js`: server traversal from `home`.
- `src/lib/format.js`: RAM, money, and duration formatting.
- `src/lib/targets.js`: basic target scoring that can evolve later.

The first implementation should favor clear code over maximum RAM optimization. RAM-focused variants can be added once the player has enough gameplay context to know where optimization matters.

## Tooling

The scaffold should include:

- `package.json` with scripts for `test` and `check`.
- A lightweight JavaScript editor configuration, such as `jsconfig.json`.
- `.editorconfig` and `.gitignore`.
- Node's built-in test runner for local helper tests.

No dependency install should be required for the first scaffold unless a later plan chooses TypeScript, bundling, or linting packages.

## Data Flow

Future scripts should follow this pattern:

1. A runnable script in `src/bin/` receives the `ns` object.
2. It calls small helpers in `src/lib/`.
3. Helpers either operate on plain data or accept a narrow `ns` capability.
4. Output is printed with clear labels so gameplay logs remain useful.

This makes it possible to test pure helper behavior locally while keeping game-specific calls at the edges.

## Error Handling

Scripts should fail politely:

- Validate command arguments before acting.
- Print actionable messages for missing servers, unavailable tools, or insufficient RAM.
- Avoid destructive actions unless the script name and usage make them explicit.
- Keep bootstrap scripts idempotent where reasonable.

## Testing

Local tests should cover pure helper behavior:

- Network traversal helpers can be tested with fake scan maps.
- Formatting helpers can be tested with deterministic values.
- Target scoring can be tested against representative server snapshots.

In-game verification should be recorded in `evidence/` when scripts are run in Bitburner.

## Agent Handoff

Future sessions should begin by reading:

1. `STATE.json`
2. `README.md`
3. `LOG.md`
4. `DECISIONS.md`
5. The latest relevant plan in `plans/`

Agents should update `LOG.md` after meaningful work, update `STATE.json` when project focus or gates change, and add `DECISIONS.md` entries when choosing conventions or gameplay strategy that future agents should not re-litigate.

## Open Questions For Implementation

- Whether to use `.js` only or introduce `.ts` once the first script set stabilizes.
- Whether deployment to the game should be manual at first or scripted later.
- Whether to add a local Bitburner type package once the repo needs richer editor support.
