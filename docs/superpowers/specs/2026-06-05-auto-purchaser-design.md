# Auto Purchaser Design

## Purpose

Add a conservative early-game purchase automation script named `auto-purchaser.js`.

## Goals

- Buy available Dark Web hacking programs when affordable.
- Buy starter purchased servers for additional worker RAM.
- Keep a cash reserve so automation does not spend everything.
- Print a clear purchase summary.
- Suggest `bootstrap` and `auto-hack` after purchases.

## Non-Goals

- Do not replace or upgrade purchased servers yet.
- Do not buy home RAM yet.
- Do not buy TOR/router automatically unless the API support is explicit and tested later.
- Do not use late-game APIs.

## Defaults

- Cash reserve: 20 percent.
- Starter purchased server RAM: 8GB.
- Purchased server prefix: `bb-worker-`.

## Purchase Order

1. Hacking programs, in early-game unlock order:
   - `BruteSSH.exe`
   - `FTPCrack.exe`
   - `relaySMTP.exe`
   - `HTTPWorm.exe`
   - `SQLInject.exe`
2. Purchased servers at 8GB, while below the purchased server limit and affordable after reserve.

## Structure

`src/lib/purchases.js` will expose pure planning helpers so purchase decisions can be tested locally.

`src/bin/auto-purchaser.js` will:

- read player money and purchase state from `ns`,
- call planning helpers,
- execute planned program/server purchases,
- print a summary and next commands.

## Testing

Local tests should cover:

- reserve-aware affordability,
- only missing programs are planned,
- program purchases stop when money after reserve is insufficient,
- purchased servers are planned below the server limit,
- server purchases stop when affordability or server limit is reached.
