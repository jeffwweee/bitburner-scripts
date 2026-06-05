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

test("rankTargets prefers faster money over slow raw max money", () => {
  const rankedTargets = rankTargets([
    {
      host: "slow-rich",
      maxMoney: 1000000,
      minSecurity: 1,
      requiredSkill: 20,
      playerSkill: 50,
      hasRoot: true,
      weakenTime: 8 * 60 * 1000
    },
    {
      host: "fast-steady",
      maxMoney: 100000,
      minSecurity: 1,
      requiredSkill: 20,
      playerSkill: 50,
      hasRoot: true,
      weakenTime: 30 * 1000
    }
  ]);

  assert.equal(rankedTargets[0].host, "fast-steady");
});

test("rankTargets marks targets over the max weaken time ineligible", () => {
  const rankedTargets = rankTargets(
    [
      {
        host: "max-hardware",
        maxMoney: 1000000,
        minSecurity: 1,
        requiredSkill: 20,
        playerSkill: 50,
        hasRoot: true,
        weakenTime: 8 * 60 * 1000
      }
    ],
    { maxWeakenTime: 5 * 60 * 1000 }
  );

  assert.equal(rankedTargets[0].eligible, false);
  assert.equal(rankedTargets[0].score, 0);
});
