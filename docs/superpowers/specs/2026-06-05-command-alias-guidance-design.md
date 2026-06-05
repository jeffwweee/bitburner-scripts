# Command Alias Guidance Design

## Purpose

Make in-game command guidance consistent with the repository layout and make common script aliases easy to set after importing.

## Goals

- Fix `bootstrap.js` suggested commands to use full paths under `src/bin/`.
- Include `auto-hack.js` in the suggested bootstrap flow.
- Have `import-repo.js` print copy-paste terminal alias commands for common workflows.
- Keep alias setup transparent instead of relying on brittle terminal automation.

## Alias Commands

`import-repo.js` should print:

- `alias bb-import="run import-repo.js"`
- `alias bb-bootstrap="run src/bin/bootstrap.js"`
- `alias bb-scan="run src/bin/scan.js"`
- `alias bb-auto="run src/bin/auto-hack.js"`
- `alias bb-hack-once="run src/bin/hack-once.js"`

## Testing

- Bootstrap tests should verify suggested commands include full `src/bin/` paths.
- Importer tests should verify alias commands are generated exactly.
