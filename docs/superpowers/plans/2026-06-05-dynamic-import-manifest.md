# Dynamic Import Manifest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a manifest-driven in-game importer that downloads the current script set from the public GitHub repository.

**Architecture:** Keep validation and download planning in `src/lib/import-manifest.js` so it is testable locally. Keep `import-repo.js` self-contained because the first install path is manually copying only that file into Bitburner; it may duplicate the tiny validation/planning logic locally.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner, GitHub raw URLs.

---

## File Structure

- Create `manifest.json`: root import manifest for in-game script files.
- Create `src/lib/import-manifest.js`: manifest validation and download planning.
- Create `tests/import-manifest.test.js`: local tests for manifest validation.
- Create `import-repo.js`: in-game importer copied manually into Bitburner.
- Modify `package.json`: include `node --check import-repo.js`.
- Modify `README.md`: add in-game import instructions.
- Modify `LOG.md`: record importer addition.
- Modify `DECISIONS.md`: record manifest-driven importer decision.

## Task 1: Manifest Helper

**Files:**
- Create: `manifest.json`
- Create: `src/lib/import-manifest.js`
- Create: `tests/import-manifest.test.js`

- [ ] **Step 1: Write failing tests**

Create tests that import `planManifestDownloads` and verify:

- A valid manifest returns planned `{ url, target }` entries.
- Unsupported `version` is rejected.
- Paths outside `src/` are rejected.
- Paths containing `..` are rejected.
- `import-repo.js` is rejected if listed.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/import-manifest.test.js`

Expected: FAIL because `src/lib/import-manifest.js` does not exist.

- [ ] **Step 3: Implement helper and manifest**

Create `manifest.json`:

```json
{
  "version": 1,
  "baseUrl": "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main",
  "files": [
    "src/bin/bootstrap.js",
    "src/bin/scan.js",
    "src/bin/hack-once.js",
    "src/lib/format.js",
    "src/lib/network.js",
    "src/lib/targets.js",
    "src/lib/import-manifest.js"
  ]
}
```

Create `src/lib/import-manifest.js` exporting `planManifestDownloads(manifest)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/import-manifest.test.js`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add manifest.json src/lib/import-manifest.js tests/import-manifest.test.js
git commit -m "feat: add import manifest helper"
```

## Task 2: In-Game Importer

**Files:**
- Create: `import-repo.js`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `LOG.md`
- Modify: `DECISIONS.md`

- [ ] **Step 1: Create importer**

Create `import-repo.js` that:

- Exports `async function main(ns)`.
- Is self-contained and does not import `src/lib/import-manifest.js`.
- Downloads `manifest.json` from `https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/manifest.json`.
- Saves the manifest to a temporary file.
- Parses the manifest.
- Validates and plans manifest downloads with local helper functions equivalent to `planManifestDownloads`.
- Downloads each planned file with `await ns.wget(url, target)`.
- Prints per-file status and final summary.
- Prints `run src/bin/bootstrap.js` as the next command.

- [ ] **Step 2: Update check script**

Update `package.json` so `npm run check` also checks `import-repo.js`.

- [ ] **Step 3: Update docs and project memory**

Add README instructions:

```bash
wget https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/import-repo.js import-repo.js
run import-repo.js
run src/bin/bootstrap.js
```

Add `LOG.md` and `DECISIONS.md` entries for the manifest-driven importer.

- [ ] **Step 4: Verify**

Run:

```bash
npm test
npm run check
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add import-repo.js package.json README.md LOG.md DECISIONS.md
git commit -m "feat: add manifest-driven importer"
```

## Final Acceptance

- `npm test` passes.
- `npm run check` passes.
- `manifest.json` lists all in-game source files.
- `import-repo.js` can be copied into Bitburner and run repeatedly.
