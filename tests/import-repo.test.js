import test from "node:test";
import assert from "node:assert/strict";

import { buildAliasCommands } from "../import-repo.js";

test("buildAliasCommands returns common Bitburner aliases", () => {
  assert.deepEqual(buildAliasCommands(), [
    'alias bb-import="run import-repo.js"',
    'alias bb-bootstrap="run src/bin/bootstrap.js"',
    'alias bb-scan="run src/bin/scan.js"',
    'alias bb-auto="run src/bin/auto-hack.js"',
    'alias bb-buy="run src/bin/auto-purchaser.js"',
    'alias bb-buy-programs="run src/bin/buy-programs.js"',
    'alias bb-buy-servers="run src/bin/buy-servers.js"',
    'alias bb-upgrade-home="run src/bin/upgrade-home.js"',
    'alias bb-server="run src/bin/server.js"',
    'alias bb-hack-once="run src/bin/hack-once.js"'
  ]);
});
