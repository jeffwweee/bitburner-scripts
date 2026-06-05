import test from "node:test";
import assert from "node:assert/strict";

import { discoverServers } from "../src/lib/network.js";

test("discoverServers traverses from home without revisiting nodes", () => {
  const scanMap = new Map([
    ["home", ["n00dles", "foodnstuff"]],
    ["n00dles", ["home"]],
    ["foodnstuff", ["home", "sigma-cosmetics"]],
    ["sigma-cosmetics", ["foodnstuff"]]
  ]);

  const result = discoverServers((host) => scanMap.get(host) ?? [], "home");

  assert.deepEqual(result.map((server) => server.host), [
    "home",
    "n00dles",
    "foodnstuff",
    "sigma-cosmetics"
  ]);
  assert.equal(result[3].depth, 2);
});
