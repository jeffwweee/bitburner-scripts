# Command Alias Guidance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix command suggestions and print common Bitburner alias commands after import.

**Architecture:** Keep bootstrap output literals close to `bootstrap.js`. Export a small alias-command helper from `import-repo.js` so alias guidance can be tested locally while keeping the importer self-contained.

**Tech Stack:** JavaScript ES modules, Bitburner Netscript, Node.js built-in test runner.

---

## Task 1: Command Guidance

**Files:**
- Modify: `src/bin/bootstrap.js`
- Modify: `import-repo.js`
- Modify: `tests/starter-scripts.test.js`
- Create: `tests/import-repo.test.js`
- Modify: `README.md`
- Modify: `LOG.md`

- [ ] Add failing tests for full bootstrap command paths and importer alias commands.
- [ ] Implement full-path bootstrap suggestions.
- [ ] Implement importer alias command output.
- [ ] Update README and LOG.
- [ ] Run `npm test` and `npm run check`.
- [ ] Commit with `feat: print in-game command aliases`.
