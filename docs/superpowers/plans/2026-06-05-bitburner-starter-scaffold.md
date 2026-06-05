# Bitburner Starter Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a fresh Bitburner scripts repository with project memory, lightweight local tooling, starter helpers, runnable early-game scripts, and handoff documentation.

**Architecture:** Keep runnable Netscript entrypoints in `src/bin/` and reusable helpers in `src/lib/`. Helpers should be pure where possible so Node's built-in test runner can verify behavior outside the game. Project memory follows the referenced `_template` layout and records current focus, decisions, and verification evidence for future agents.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner, Markdown project documentation, JSON project state.

---

## File Structure

- Create `README.md`: project purpose, scope, references, status, and quick commands.
- Create `STATE.json`: machine-readable project lifecycle and current focus.
- Create `LOG.md`: chronological project activity.
- Create `DECISIONS.md`: durable decisions.
- Create `docs/agent-handoff.md`: multi-session conventions.
- Create `docs/script-conventions.md`: Bitburner script structure and naming conventions.
- Create `plans/.gitkeep`: keeps the top-level plan folder from the template available.
- Create `evidence/.gitkeep`: keeps verification evidence folder available.
- Create `references/bitburner-links.md`: curated official links and source priority.
- Create `src/bin/bootstrap.js`: first-run game script.
- Create `src/bin/scan.js`: network scan game script.
- Create `src/bin/hack-once.js`: small manual hack/grow/weaken runner.
- Create `src/lib/network.js`: network traversal and fake-scan test seam.
- Create `src/lib/format.js`: display formatting helpers.
- Create `src/lib/targets.js`: basic server target scoring.
- Create `tests/network.test.js`: tests traversal behavior.
- Create `tests/format.test.js`: tests formatting behavior.
- Create `tests/targets.test.js`: tests target scoring behavior.
- Create `package.json`: local test/check scripts.
- Create `jsconfig.json`: editor support for ES modules.
- Create `.editorconfig`: consistent editor settings.
- Create `.gitignore`: excludes dependency and runtime noise.

## Task 1: Project Memory Scaffold

**Files:**
- Create: `README.md`
- Create: `STATE.json`
- Create: `LOG.md`
- Create: `DECISIONS.md`
- Create: `docs/agent-handoff.md`
- Create: `docs/script-conventions.md`
- Create: `plans/.gitkeep`
- Create: `evidence/.gitkeep`
- Create: `references/bitburner-links.md`

- [ ] **Step 1: Create project memory files**

Use the committed design spec as the source of truth. Populate `README.md` with:

```markdown
# Bitburner Scripts

## Purpose

Fresh Bitburner scripts for a new gameplay run, built from first principles.

## Desired Outcome

A maintainable script workspace that helps automate the run incrementally while preserving enough project memory for future sessions and agents.

## Scope

- Early-game discovery and hacking scripts.
- Small reusable helpers.
- Local tests for pure helper logic.
- Multi-session project memory.

## Non-Goals

- Importing another player's automation.
- Late-game corporation, gang, sleeve, Bladeburner, or BitNode-specific automation before gameplay reaches it.
- Heavy bundling or deployment tooling in the first scaffold.

## Key Context

Official in-game documentation and generated NS API docs are primary references. The wiki is secondary gameplay context.

## Current Status

Initial scaffold in progress.
```

Populate `STATE.json` with schema version `2`, project slug `bitburner-scripts`, phase `build`, current focus `starter scaffold`, and gates through `shaping` marked complete/open as appropriate.

- [ ] **Step 2: Record initial decision and log entries**

Add a `DECISIONS.md` entry:

```markdown
- **2026-06-05** — Use lightweight JavaScript scaffold first.
  - **Rationale:** Bitburner runs Netscript JavaScript directly, and the fresh run benefits more from clarity than build complexity.
  - **Decided by:** Jeffrey and Codex
```

Add a `LOG.md` entry noting scaffold implementation began from the committed design spec.

- [ ] **Step 3: Add handoff and reference docs**

`docs/agent-handoff.md` should tell future agents to read `STATE.json`, `README.md`, `LOG.md`, `DECISIONS.md`, and latest plans before editing.

`docs/script-conventions.md` should define:

- `src/bin/` contains scripts copied into Bitburner.
- `src/lib/` contains shared helpers.
- Keep game runtime calls at the script edge when possible.
- Prefer readable scripts before RAM-optimized variants.

`references/bitburner-links.md` should include the official site, official source repo, generated API docs/source repo reference, and wiki.

- [ ] **Step 4: Verify files exist**

Run: `rg --files`

Expected: output includes all project memory files listed for this task.

- [ ] **Step 5: Commit**

```bash
git add README.md STATE.json LOG.md DECISIONS.md docs/agent-handoff.md docs/script-conventions.md plans/.gitkeep evidence/.gitkeep references/bitburner-links.md
git commit -m "docs: scaffold project memory"
```

## Task 2: Local Tooling Scaffold

**Files:**
- Create: `package.json`
- Create: `jsconfig.json`
- Create: `.editorconfig`
- Create: `.gitignore`

- [ ] **Step 1: Create tooling files**

Create `package.json`:

```json
{
  "name": "bitburner-scripts",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test",
    "check": "node --check src/bin/bootstrap.js && node --check src/bin/scan.js && node --check src/bin/hack-once.js"
  }
}
```

Create `jsconfig.json`:

```json
{
  "compilerOptions": {
    "checkJs": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "target": "ES2022"
  },
  "include": ["src/**/*.js", "tests/**/*.js"]
}
```

Create `.editorconfig` with UTF-8, LF, 2-space JavaScript/JSON/Markdown indentation.

Create `.gitignore` excluding `node_modules/`, `.tmp/`, `.cache/`, coverage folders, and local Bitburner exports.

- [ ] **Step 2: Run baseline tooling command**

Run: `npm test`

Expected: command succeeds with no tests found or zero discovered suites depending on the installed Node version.

- [ ] **Step 3: Commit**

```bash
git add package.json jsconfig.json .editorconfig .gitignore
git commit -m "chore: add local JavaScript tooling"
```

## Task 3: Formatting Helpers

**Files:**
- Create: `src/lib/format.js`
- Create: `tests/format.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/format.test.js`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";

import { formatMoney, formatRam, formatDuration } from "../src/lib/format.js";

test("formatMoney compacts dollar values", () => {
  assert.equal(formatMoney(0), "$0.00");
  assert.equal(formatMoney(1532), "$1.53k");
  assert.equal(formatMoney(2_500_000), "$2.50m");
});

test("formatRam displays gigabytes and terabytes", () => {
  assert.equal(formatRam(8), "8.00GB");
  assert.equal(formatRam(2048), "2.00TB");
});

test("formatDuration displays milliseconds as seconds or minutes", () => {
  assert.equal(formatDuration(1200), "1.2s");
  assert.equal(formatDuration(125000), "2m 5s");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/format.test.js`

Expected: FAIL because `src/lib/format.js` does not exist.

- [ ] **Step 3: Implement helper**

Create `src/lib/format.js` with exported `formatMoney`, `formatRam`, and `formatDuration`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/format.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.js tests/format.test.js
git commit -m "feat: add display formatting helpers"
```

## Task 4: Network Helpers

**Files:**
- Create: `src/lib/network.js`
- Create: `tests/network.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/network.test.js`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";

import { discoverServers } from "../src/lib/network.js";

test("discoverServers traverses from home without revisiting nodes", () => {
  const scanMap = new Map([
    ["home", ["n00dles", "foodnstuff"]],
    ["n00dles", ["home"]],
    ["foodnstuff", ["home", "sigma-cosmetics"]],
    ["sigma-cosmetics", ["foodnstuff"]]
  ]);

  const result = discoverServers((host) => scanMap.get(host) ?? [], "home");

  assert.deepEqual(result.map((server) => server.host), [
    "home",
    "n00dles",
    "foodnstuff",
    "sigma-cosmetics"
  ]);
  assert.equal(result[3].depth, 2);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/network.test.js`

Expected: FAIL because `src/lib/network.js` does not exist.

- [ ] **Step 3: Implement helper**

Create `src/lib/network.js` exporting `discoverServers(scan, start = "home")`. Return objects with `host`, `parent`, and `depth`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/network.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/network.js tests/network.test.js
git commit -m "feat: add network discovery helper"
```

## Task 5: Target Scoring Helpers

**Files:**
- Create: `src/lib/targets.js`
- Create: `tests/targets.test.js`

- [ ] **Step 1: Write failing tests**

Create `tests/targets.test.js`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";

import { scoreServer, rankTargets } from "../src/lib/targets.js";

test("scoreServer rejects unavailable or empty targets", () => {
  assert.equal(scoreServer({ host: "home", maxMoney: 0, requiredSkill: 1, playerSkill: 50 }).eligible, false);
  assert.equal(scoreServer({ host: "foodnstuff", maxMoney: 1000, requiredSkill: 100, playerSkill: 10 }).eligible, false);
});

test("rankTargets prefers eligible richer easier servers", () => {
  const ranked = rankTargets([
    { host: "a", maxMoney: 1000, minSecurity: 1, requiredSkill: 1, playerSkill: 50, hasRoot: true },
    { host: "b", maxMoney: 100000, minSecurity: 5, requiredSkill: 20, playerSkill: 50, hasRoot: true }
  ]);

  assert.equal(ranked[0].host, "b");
  assert.equal(ranked[0].eligible, true);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/targets.test.js`

Expected: FAIL because `src/lib/targets.js` does not exist.

- [ ] **Step 3: Implement helper**

Create `src/lib/targets.js` with `scoreServer(server)` and `rankTargets(servers)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/targets.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/targets.js tests/targets.test.js
git commit -m "feat: add early target scoring"
```

## Task 6: Runnable Starter Scripts

**Files:**
- Create: `src/bin/bootstrap.js`
- Create: `src/bin/scan.js`
- Create: `src/bin/hack-once.js`
- Modify: `package.json`

- [ ] **Step 1: Create `scan.js`**

Use `discoverServers`, `formatMoney`, and `formatRam`. Print host, depth, root status, RAM, required hacking skill, and max money.

- [ ] **Step 2: Create `hack-once.js`**

Accept target as `ns.args[0]`. Validate it exists. If security is above minimum by more than 5, weaken once. Else if money is below 75 percent of max, grow once. Else hack once.

- [ ] **Step 3: Create `bootstrap.js`**

Print current player hacking skill, discovered server count, best ranked targets, and suggested next commands.

- [ ] **Step 4: Update `package.json` check script if needed**

Ensure all runnable files are covered by `node --check`.

- [ ] **Step 5: Run syntax check**

Run: `npm run check`

Expected: PASS.

- [ ] **Step 6: Run full tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/bin/bootstrap.js src/bin/scan.js src/bin/hack-once.js package.json
git commit -m "feat: add starter Bitburner scripts"
```

## Task 7: Final Verification And Evidence

**Files:**
- Create: `evidence/2026-06-05-scaffold-verification.md`
- Modify: `LOG.md`
- Modify: `STATE.json`

- [ ] **Step 1: Run final verification**

Run:

```bash
npm test
npm run check
git status --short
```

Expected:

- `npm test` passes.
- `npm run check` passes.
- `git status --short` shows only planned verification/log/state edits before final commit.

- [ ] **Step 2: Record evidence**

Create `evidence/2026-06-05-scaffold-verification.md` with command names and summarized results.

- [ ] **Step 3: Update project memory**

Update `LOG.md` with completed scaffold work.

Update `STATE.json`:

- `summary`: scaffold complete.
- `currentFocus`: first in-game verification.
- `gates.build`: `complete`.
- `gates.review`: `open`.
- `refs.latestBuildEvidence`: `evidence/2026-06-05-scaffold-verification.md`.

- [ ] **Step 4: Commit**

```bash
git add evidence/2026-06-05-scaffold-verification.md LOG.md STATE.json
git commit -m "docs: record scaffold verification"
```

## Final Acceptance

- `npm test` passes.
- `npm run check` passes.
- `rg --files` shows project memory, references, source, and tests.
- Git history contains small commits for design, memory, tooling, helpers, scripts, and verification.
- The repo can be handed to a future agent by reading `STATE.json`, `README.md`, `LOG.md`, `DECISIONS.md`, and this plan.
