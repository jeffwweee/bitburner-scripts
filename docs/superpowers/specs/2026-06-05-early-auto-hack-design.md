# Early Auto Hack Design

## Purpose

Add minimal early-game passive hacking automation after bootstrap has rooted available servers.

## Goals

- Copy a worker script to rooted servers.
- Use each rooted server's available RAM to run as many worker threads as possible.
- Point all workers at the best currently eligible money-bearing target.
- Keep the worker loop simple: weaken if security is high, grow if money is low, otherwise hack.
- Preserve readable scripts over RAM-optimized batching.

## Non-Goals

- Do not implement timed HWGW batching yet.
- Do not manage purchased servers yet.
- Do not reserve RAM on `home` yet.
- Do not choose a different target per worker server yet.
- Do not use formulas or late-game APIs.

## Scripts

`src/bin/worker.js`:

- Accepts one target argument.
- Loops forever.
- Weaken when security is greater than minimum security plus 5.
- Grow when money is below 75 percent of max money.
- Hack otherwise.
- Sleeps briefly between actions.

`src/bin/auto-hack.js`:

- Discovers servers from `home`.
- Builds eligible target snapshots.
- Chooses the highest-ranked eligible money target.
- Finds rooted worker hosts with RAM.
- Copies `worker.js` to each worker host.
- Stops old `worker.js` instances on each worker host.
- Calculates max threads from free RAM and worker RAM cost.
- Starts `worker.js` with the chosen target on each host.
- Prints deployment summary.

## Testing

Local tests should cover:

- Worker action choice for weaken, grow, and hack.
- Deployment planning excludes unrooted hosts and hosts without enough RAM.
- Deployment planning calculates max threads from free RAM and script RAM.
- Deployment planning chooses the first eligible ranked target.

## Import Manifest

Add both new scripts to `manifest.json`:

- `src/bin/auto-hack.js`
- `src/bin/worker.js`
