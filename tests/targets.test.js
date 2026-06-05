import test from "node:test";
import assert from "node:assert/strict";

import { scoreServer, rankTargets } from "../src/lib/targets.js";

test("scoreServer rejects unavailable or empty targets", () => {
  assert.equal(
    scoreServer({
      host: "home",
      maxMoney: 0,
      requiredSkill: 1,
      playerSkill: 50
    }).eligible,
    false
  );
  assert.equal(
    scoreServer({
      host: "foodnstuff",
      maxMoney: 1000,
      requiredSkill: 100,
      playerSkill: 10
    }).eligible,
    false
  );
});

test("rankTargets prefers eligible richer easier servers", () => {
  const rankedTargets = rankTargets([
    {
      host: "a",
      maxMoney: 1000,
      minSecurity: 1,
      requiredSkill: 1,
      playerSkill: 50,
      hasRoot: true
    },
    {
      host: "b",
      maxMoney: 100000,
      minSecurity: 5,
      requiredSkill: 20,
      playerSkill: 50,
      hasRoot: true
    }
  ]);

  assert.equal(rankedTargets[0].host, "b");
  assert.equal(rankedTargets[0].eligible, true);
});
