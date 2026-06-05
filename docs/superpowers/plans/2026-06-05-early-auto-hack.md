# Early Auto Hack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add minimal passive hacking automation that deploys worker loops onto rooted servers.

**Architecture:** `auto-hack.js` is the controller that discovers servers, selects a target, copies workers, and starts max threads. `worker.js` is a small infinite action loop. Export pure helper functions from both scripts so behavior can be tested locally without running infinite loops.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner.

---

## Task 1: Worker Action Choice

**Files:**
- Create: `src/bin/worker.js`
- Create: `tests/auto-hack.test.js`

- [ ] Write failing tests for `chooseWorkerAction`.
- [ ] Run `node --test tests/auto-hack.test.js` and confirm failure.
- [ ] Implement `worker.js` with `chooseWorkerAction(snapshot)` and `main(ns)`.
- [ ] Run `node --test tests/auto-hack.test.js` and confirm pass.

## Task 2: Auto Hack Controller

**Files:**
- Create: `src/bin/auto-hack.js`
- Modify: `tests/auto-hack.test.js`
- Modify: `manifest.json`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `LOG.md`
- Modify: `DECISIONS.md`

- [ ] Write failing tests for deployment planning.
- [ ] Run `node --test tests/auto-hack.test.js` and confirm failure.
- [ ] Implement `auto-hack.js` with `planWorkerDeployments` and `main(ns)`.
- [ ] Add new scripts to `manifest.json`.
- [ ] Add new scripts to `npm run check`.
- [ ] Add README usage for `run src/bin/auto-hack.js`.
- [ ] Update project memory.
- [ ] Run `npm test` and `npm run check`.
- [ ] Commit with `feat: add early auto hack deployment`.
