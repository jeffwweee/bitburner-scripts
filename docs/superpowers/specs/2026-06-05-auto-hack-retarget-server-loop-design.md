# Auto Hack Retarget And Server Loop Design

## Purpose

Make `auto-hack.js` reliably retarget existing worker scripts and add a long-running `server.js` orchestrator for periodic automation.

## Goals

- Re-running `auto-hack.js` should kill old workers and redeploy them to the current best target.
- Existing worker RAM should be counted as reclaimable during deployment planning.
- `auto-hack.js --stop` should stop workers on all discovered rooted hosts and exit.
- Add `server.js` to periodically run the one-shot automation flow.

## Non-Goals

- Do not make `auto-hack.js` itself a loop.
- Do not add timed HWGW batching.
- Do not add daemon process supervision beyond a simple sleep loop.

## Auto Hack Retargeting

For each worker host, deployment planning will compute:

```text
effectiveFreeRam = maxRam - usedRam + existingWorkerRam
threads = floor(effectiveFreeRam / workerScriptRam)
```

`existingWorkerRam` is derived from `ns.ps(host)` entries where `filename === "src/bin/worker.js"`.

Before starting a new worker, deployment will:

1. `ns.scriptKill("src/bin/worker.js", host)`
2. `ns.scp("src/bin/worker.js", host, "home")`
3. `ns.exec("src/bin/worker.js", host, threads, target)`

## Stop Mode

`run src/bin/auto-hack.js --stop` will:

- discover servers,
- kill `src/bin/worker.js` on rooted hosts,
- print how many hosts were stopped,
- exit without selecting a target or starting workers.

## Server Loop

`src/bin/server.js` will be the long-running orchestrator:

- default interval: 5 minutes,
- loop forever,
- run `auto-purchaser.js`, `bootstrap.js`, then `auto-hack.js`,
- sleep until the next cycle.

The scripts remain one-shot commands; only `server.js` loops.

## Testing

Local tests should cover:

- existing worker RAM is reclaimable in deployment planning,
- stop mode planning lists rooted hosts that should be killed,
- server cycle plan returns purchaser, bootstrap, and auto-hack in order,
- default interval is 5 minutes.
