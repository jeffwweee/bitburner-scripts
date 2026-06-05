# Script Conventions

## Layout

- `src/bin/` contains runnable Netscript scripts copied into Bitburner.
- `src/lib/` contains shared helpers used by runnable scripts and local tests.

## Runtime Boundaries

Keep Bitburner game calls near the script edge when possible. Runnable scripts receive `ns`, collect game state, and pass plain data or narrow capabilities into helpers.

## Development Priority

Prefer readable scripts before RAM-optimized variants. Add RAM-focused versions only after gameplay context shows where optimization matters.
