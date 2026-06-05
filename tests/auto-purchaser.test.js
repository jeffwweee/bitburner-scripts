import test from "node:test";
import assert from "node:assert/strict";

import { buildPurchaseCycle } from "../src/bin/auto-purchaser.js";

test("buildPurchaseCycle runs small purchase scripts in priority order", () => {
  assert.deepEqual(buildPurchaseCycle(), [
    "src/bin/buy-programs.js",
    "src/bin/buy-servers.js",
    "src/bin/upgrade-home.js"
  ]);
});
