# Bitburner Scripts

## Purpose

Fresh Bitburner scripts for a new gameplay run, built from first principles.

## Desired Outcome

A maintainable script workspace that helps automate the run incrementally while preserving enough project memory for future sessions and agents.

## Scope

- Early-game discovery and hacking scripts.
- Small reusable helpers.
- Local tests for pure helper logic.
- Multi-session project memory.

## Non-Goals

- Importing another player's automation.
- Late-game corporation, gang, sleeve, Bladeburner, or BitNode-specific automation before gameplay reaches it.
- Heavy bundling or deployment tooling in the first scaffold.

## Key Context

Official in-game documentation and generated NS API docs are primary references. The wiki is secondary gameplay context.

## In-Game Import

After this public repo is pushed to GitHub, copy the importer into Bitburner:

```bash
wget https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/import-repo.js import-repo.js
run import-repo.js
run src/bin/auto-purchaser.js
run src/bin/bootstrap.js
run src/bin/auto-hack.js
```

`import-repo.js` downloads `manifest.json`, then downloads every listed `src/` file into the same in-game path.

Run `bootstrap.js` first to gain root access on eligible servers, then run `auto-hack.js` to copy workers to rooted servers and fill available RAM with passive weaken/grow/hack loops.
Run `auto-purchaser.js` before bootstrap when you want to buy affordable hacking programs and starter worker servers while keeping a cash reserve.

After import, `import-repo.js` prints optional terminal aliases:

```bash
alias bb-import="run import-repo.js"
alias bb-bootstrap="run src/bin/bootstrap.js"
alias bb-scan="run src/bin/scan.js"
alias bb-auto="run src/bin/auto-hack.js"
alias bb-buy="run src/bin/auto-purchaser.js"
alias bb-hack-once="run src/bin/hack-once.js"
```

## Current Status

Starter scaffold complete with early passive hacking automation.
