import test from "node:test";
import assert from "node:assert/strict";

import {
  planProgramPurchases,
  planPurchasedServerUpgrades,
  planPurchasedServers,
  planHomeUpgrades
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

test("planPurchasedServerUpgrades upgrades existing servers while affordable", () => {
  const plan = planPurchasedServerUpgrades({
    money: 5000000,
    reserveRatio: 0.2,
    purchasedServers: [
      { hostname: "bb-worker-0", ram: 8 },
      { hostname: "bb-worker-1", ram: 16 },
      { hostname: "bb-worker-2", ram: 64 }
    ],
    maxServerRam: 64,
    upgradeCosts: {
      "bb-worker-0:16": 1000000,
      "bb-worker-1:32": 2000000
    }
  });

  assert.deepEqual(plan.upgrades, [
    { hostname: "bb-worker-0", ram: 16, cost: 1000000 },
    { hostname: "bb-worker-1", ram: 32, cost: 2000000 }
  ]);
  assert.equal(plan.remainingMoney, 2000000);
});

test("planPurchasedServerUpgrades preserves reserved cash", () => {
  const plan = planPurchasedServerUpgrades({
    money: 3000000,
    reserveRatio: 0.2,
    purchasedServers: [
      { hostname: "bb-worker-0", ram: 8 },
      { hostname: "bb-worker-1", ram: 16 }
    ],
    maxServerRam: 64,
    upgradeCosts: {
      "bb-worker-0:16": 2000000,
      "bb-worker-1:32": 1000000
    }
  });

  assert.deepEqual(plan.upgrades, [
    { hostname: "bb-worker-1", ram: 32, cost: 1000000 }
  ]);
  assert.equal(plan.remainingMoney, 2000000);
});

test("planHomeUpgrades buys home ram before cores when affordable", () => {
  const plan = planHomeUpgrades({
    money: 10000000,
    reserveRatio: 0.2,
    ramCost: 3000000,
    coreCost: 2000000,
    canUpgradeRam: true,
    canUpgradeCores: true
  });

  assert.deepEqual(plan.upgrades, [
    { type: "ram", cost: 3000000 },
    { type: "cores", cost: 2000000 }
  ]);
  assert.equal(plan.remainingMoney, 5000000);
});

test("planHomeUpgrades skips unavailable home upgrade APIs", () => {
  const plan = planHomeUpgrades({
    money: 10000000,
    reserveRatio: 0.2,
    ramCost: 3000000,
    coreCost: 2000000,
    canUpgradeRam: false,
    canUpgradeCores: false
  });

  assert.deepEqual(plan.upgrades, []);
  assert.equal(plan.remainingMoney, 10000000);
});
