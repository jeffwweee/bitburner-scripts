# Auto Hack Retarget And Server Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `auto-hack.js` retargeting and add a periodic `server.js` automation loop.

**Architecture:** Keep `auto-hack.js` one-shot with explicit `--stop`. Add pure planning helpers for reclaimable RAM and stop mode. Add `server.js` as a simple long-running coordinator that runs existing one-shot scripts by `ns.run`.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner.

---

## Task 1: Auto Hack Retargeting

**Files:**
- Modify: `src/bin/auto-hack.js`
- Modify: `tests/auto-hack.test.js`

- [ ] Add failing tests for reclaimable worker RAM and stop planning.
- [ ] Implement reclaimable worker RAM in deployment planning.
- [ ] Implement `--stop`.
- [ ] Run focused tests.

## Task 2: Server Loop

**Files:**
- Create: `src/bin/server.js`
- Create: `tests/server.test.js`
- Modify: `manifest.json`
- Modify: `package.json`
- Modify: `import-repo.js`
- Modify: `README.md`
- Modify: `LOG.md`
- Modify: `DECISIONS.md`

- [ ] Add failing tests for server cycle plan and default interval.
- [ ] Implement `server.js`.
- [ ] Add manifest/check/alias/docs updates.
- [ ] Run `npm test` and `npm run check`.
- [ ] Commit with `feat: retarget auto hack workers`.
