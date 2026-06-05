# Bootstrap Root Access Design

## Purpose

Teach `bootstrap.js` to gain root access on all currently available servers before ranking targets. This makes bootstrap useful after first import, script updates, patches, and fresh/new-game runs.

## Goals

- Discover servers from `home`.
- Skip `home` and already-rooted servers.
- Skip servers above the player's hacking level.
- Skip servers needing more open ports than available tools can provide.
- Run available port openers and `nuke` eligible servers.
- Print a concise root-access summary before target ranking.

## Non-Goals

- Do not buy port-opening programs.
- Do not attempt late-game automation.
- Do not add a separate rooter script yet.
- Do not weaken/grow/hack as part of rooting.

## Behavior

`bootstrap.js` will count available tools on `home`:

- `BruteSSH.exe` -> `ns.brutessh(host)`
- `FTPCrack.exe` -> `ns.ftpcrack(host)`
- `relaySMTP.exe` -> `ns.relaysmtp(host)`
- `HTTPWorm.exe` -> `ns.httpworm(host)`
- `SQLInject.exe` -> `ns.sqlinject(host)`

For each discovered server, bootstrap will root it when hacking level and port tools are sufficient, then continue with the existing target ranking. This should make `n00dles` hackable early because it normally requires zero open ports.

## Testing

Update starter script tests to verify:

- Bootstrap nukes an eligible zero-port server.
- Bootstrap uses available port openers before nuking a server that needs ports.
- Bootstrap skips servers when hacking skill is too low or port tools are insufficient.
