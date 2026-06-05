# Bootstrap Root Access Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `bootstrap.js` gain root access on eligible discovered servers before ranking targets.

**Architecture:** Add small local helper functions inside `src/bin/bootstrap.js` for port-tool detection and rooting. Extend `tests/starter-scripts.test.js` with fake `ns` behavior so rooting decisions are verified locally.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner.

---

## Task 1: Bootstrap Rooting

**Files:**
- Modify: `src/bin/bootstrap.js`
- Modify: `tests/starter-scripts.test.js`
- Modify: `LOG.md`
- Modify: `DECISIONS.md`

- [ ] Write failing tests for zero-port rooting, port-opener rooting, low-skill skip, and insufficient-port skip.
- [ ] Run `node --test tests/starter-scripts.test.js` and confirm the new tests fail before implementation.
- [ ] Implement the bootstrap rooting pass.
- [ ] Run `node --test tests/starter-scripts.test.js` and confirm it passes.
- [ ] Run `npm test` and `npm run check`.
- [ ] Record the behavior in `LOG.md` and `DECISIONS.md`.
- [ ] Commit with `feat: root eligible servers during bootstrap`.
