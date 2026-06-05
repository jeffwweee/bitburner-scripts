import test from "node:test";
import assert from "node:assert/strict";

import { buildAliasCommands } from "../import-repo.js";

test("buildAliasCommands returns common Bitburner aliases", () => {
  assert.deepEqual(buildAliasCommands(), [
    'alias bb-import="run import-repo.js"',
    'alias bb-bootstrap="run src/bin/bootstrap.js"',
    'alias bb-scan="run src/bin/scan.js"',
    'alias bb-auto="run src/bin/auto-hack.js"',
    'alias bb-hack-once="run src/bin/hack-once.js"'
  ]);
});
