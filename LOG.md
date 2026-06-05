# Log

## 2026-06-05

- Scaffold implementation began from the committed Bitburner starter scaffold design spec.
- Starter scaffold completed with project memory, local JavaScript tooling, tested helpers, and runnable early-game Bitburner scripts.
- Final local verification passed: `npm test` reported 11 passing tests and `npm run check` completed without syntax errors.
- Added a manifest-driven importer so Bitburner can refresh public GitHub scripts with one in-game command.
- Added bootstrap root access automation for eligible discovered servers.
- Added early auto-hack deployment that fills rooted server RAM with worker loops targeting the best eligible server.
- Fixed suggested command paths and added importer alias guidance for common scripts.
- Added `auto-purchaser.js` for conservative program and starter purchased-server purchases.
- Fixed `auto-hack.js` retargeting by reclaiming old worker RAM and added `--stop`.
- Added `server.js` as a five-minute automation loop over purchaser, bootstrap, and auto-hack.
