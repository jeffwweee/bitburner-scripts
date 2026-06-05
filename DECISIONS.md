# Decisions

- **2026-06-05** — Use lightweight JavaScript scaffold first.
  - **Rationale:** Bitburner runs Netscript JavaScript directly, and the fresh run benefits more from clarity than build complexity.
  - **Decided by:** Jeffrey and Codex
- **2026-06-05** — Use a manifest-driven in-game importer.
  - **Rationale:** Bitburner can download files over HTTP but cannot run a real Git pull, so `import-repo.js` downloads a GitHub-hosted manifest and then imports listed `src/` files.
  - **Decided by:** Jeffrey and Codex
- **2026-06-05** — Bootstrap should gain root access before ranking targets.
  - **Rationale:** After imports, updates, patches, and fresh runs, bootstrap should make all currently eligible servers usable before suggesting hack targets.
  - **Decided by:** Jeffrey and Codex
- **2026-06-05** — Start hacking automation with a simple deployed worker loop.
  - **Rationale:** Early-game passive money and hacking XP need robust RAM usage more than timed batching, so `auto-hack.js` fills rooted servers with `worker.js` threads against the best eligible target.
  - **Decided by:** Jeffrey and Codex
