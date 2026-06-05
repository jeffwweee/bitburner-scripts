import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_LOOP_INTERVAL_MS,
  buildAutomationCycle
} from "../src/bin/server.js";

test("server default loop interval is five minutes", () => {
  assert.equal(DEFAULT_LOOP_INTERVAL_MS, 5 * 60 * 1000);
});

test("buildAutomationCycle runs purchaser, bootstrap, then auto-hack", () => {
  assert.deepEqual(buildAutomationCycle(), [
    "src/bin/auto-purchaser.js",
    "src/bin/bootstrap.js",
    "src/bin/auto-hack.js"
  ]);
});
