# Auto Purchaser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `auto-purchaser.js` for conservative early-game program and purchased-server purchases.

**Architecture:** Put pure spending-plan logic in `src/lib/purchases.js`. Keep `src/bin/auto-purchaser.js` as the Netscript wrapper that gathers state, executes purchases, and prints a summary.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner.

---

## Task 1: Purchase Planning Helpers

**Files:**
- Create: `src/lib/purchases.js`
- Create: `tests/purchases.test.js`

- [ ] Write failing tests for program and server purchase planning.
- [ ] Run `node --test tests/purchases.test.js` and confirm failure.
- [ ] Implement reserve-aware purchase planning.
- [ ] Run `node --test tests/purchases.test.js` and confirm pass.

## Task 2: Auto Purchaser Script

**Files:**
- Create: `src/bin/auto-purchaser.js`
- Modify: `manifest.json`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `LOG.md`
- Modify: `DECISIONS.md`

- [ ] Implement `auto-purchaser.js` around the helper plan.
- [ ] Add the new script and helper to `manifest.json`.
- [ ] Add `auto-purchaser.js` to `npm run check`.
- [ ] Update README, LOG, and DECISIONS.
- [ ] Run `npm test` and `npm run check`.
- [ ] Commit with `feat: add early auto purchaser`.
