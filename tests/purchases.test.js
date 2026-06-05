import test from "node:test";
import assert from "node:assert/strict";

import {
  planProgramPurchases,
  planPurchasedServers
} from "../src/lib/purchases.js";

const programCatalog = [
  { file: "BruteSSH.exe", cost: 500000 },
  { file: "FTPCrack.exe", cost: 1500000 },
  { file: "relaySMTP.exe", cost: 5000000 }
];

test("planProgramPurchases buys missing affordable programs after reserve", () => {
  const plan = planProgramPurchases({
    money: 3000000,
    reserveRatio: 0.2,
    ownedPrograms: new Set(["BruteSSH.exe"]),
    programCatalog
  });

  assert.deepEqual(plan.purchases, [
    { file: "FTPCrack.exe", cost: 1500000 }
  ]);
  assert.equal(plan.remainingMoney, 1500000);
});

test("planProgramPurchases stops before spending reserved cash", () => {
  const plan = planProgramPurchases({
    money: 2000000,
    reserveRatio: 0.2,
    ownedPrograms: new Set(),
    programCatalog
  });

  assert.deepEqual(plan.purchases, [
    { file: "BruteSSH.exe", cost: 500000 }
  ]);
  assert.equal(plan.remainingMoney, 1500000);
});

test("planPurchasedServers buys starter servers below limit while affordable", () => {
  const plan = planPurchasedServers({
    money: 1000000,
    reserveRatio: 0.2,
    purchasedServers: ["bb-worker-0"],
    purchasedServerLimit: 3,
    serverRam: 8,
    serverCost: 300000,
    namePrefix: "bb-worker-"
  });

  assert.deepEqual(plan.purchases, [
    { hostname: "bb-worker-1", ram: 8, cost: 300000 },
    { hostname: "bb-worker-2", ram: 8, cost: 300000 }
  ]);
  assert.equal(plan.remainingMoney, 400000);
});

test("planPurchasedServers stops when purchased server limit is reached", () => {
  const plan = planPurchasedServers({
    money: 1000000,
    reserveRatio: 0.2,
    purchasedServers: ["bb-worker-0", "bb-worker-1"],
    purchasedServerLimit: 2,
    serverRam: 8,
    serverCost: 300000,
    namePrefix: "bb-worker-"
  });

  assert.deepEqual(plan.purchases, []);
});
