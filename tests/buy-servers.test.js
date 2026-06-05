import test from "node:test";
import assert from "node:assert/strict";

import { main as buyServers } from "../src/bin/buy-servers.js";

function createNs(overrides = {}) {
  const calls = [];
  const { cloud: cloudOverrides = {}, ...nsOverrides } = overrides;
  const ns = {
    args: [],
    cloud: {
      getServerCost: (ram) => {
        calls.push(["getServerCost", ram]);
        return 300000;
      },
      getServerLimit: () => 1,
      getServerNames: () => [],
      getRamLimit: () => 64,
      purchaseServer: (hostname, ram) => {
        calls.push(["purchaseServer", hostname, ram]);
        return hostname;
      },
      getServerUpgradeCost: (hostname, ram) => {
        calls.push(["getServerUpgradeCost", hostname, ram]);
        return 1000000;
      },
      upgradeServer: (hostname, ram) => {
        calls.push(["upgradeServer", hostname, ram]);
        return true;
      },
      ...cloudOverrides
    },
    getServerMoneyAvailable: () => 1000000,
    getServerMaxRam: () => 8,
    tprint: () => {},
    getPurchasedServerCost: () => {
      throw new Error("legacy getPurchasedServerCost should not be called");
    },
    getPurchasedServers: () => {
      throw new Error("legacy getPurchasedServers should not be called");
    },
    getPurchasedServerLimit: () => {
      throw new Error("legacy getPurchasedServerLimit should not be called");
    },
    getPurchasedServerMaxRam: () => {
      throw new Error("legacy getPurchasedServerMaxRam should not be called");
    },
    purchaseServer: () => {
      throw new Error("legacy purchaseServer should not be called");
    },
    getPurchasedServerUpgradeCost: () => {
      throw new Error("legacy getPurchasedServerUpgradeCost should not be called");
    },
    upgradePurchasedServer: () => {
      throw new Error("legacy upgradePurchasedServer should not be called");
    },
    ...nsOverrides
  };

  return { ns, calls };
}

test("buy-servers purchases through the Bitburner 3 cloud API", async () => {
  const { ns, calls } = createNs();

  await buyServers(ns);

  assert.deepEqual(calls, [
    ["getServerCost", 8],
    ["purchaseServer", "bb-worker-0", 8]
  ]);
});

test("buy-servers upgrades through the Bitburner 3 cloud API", async () => {
  const { ns, calls } = createNs({
    cloud: {
      getServerNames: () => ["bb-worker-0"],
      getServerLimit: () => 1
    },
    getServerMoneyAvailable: () => 2000000
  });

  await buyServers(ns);

  assert.deepEqual(calls, [
    ["getServerCost", 8],
    ["getServerUpgradeCost", "bb-worker-0", 16],
    ["upgradeServer", "bb-worker-0", 16]
  ]);
});
