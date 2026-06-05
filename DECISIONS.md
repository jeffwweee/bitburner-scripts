# Decisions

- **2026-06-05** — Use lightweight JavaScript scaffold first.
  - **Rationale:** Bitburner runs Netscript JavaScript directly, and the fresh run benefits more from clarity than build complexity.
  - **Decided by:** Jeffrey and Codex
- **2026-06-05** — Use a manifest-driven in-game importer.
  - **Rationale:** Bitburner can download files over HTTP but cannot run a real Git pull, so `import-repo.js` downloads a GitHub-hosted manifest and then imports listed `src/` files.
  - **Decided by:** Jeffrey and Codex
