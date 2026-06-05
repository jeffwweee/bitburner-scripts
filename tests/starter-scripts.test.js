import test from "node:test";
import assert from "node:assert/strict";

import { main as bootstrapMain } from "../src/bin/bootstrap.js";
import { main as hackOnceMain } from "../src/bin/hack-once.js";

function createHackOnceNs(overrides = {}) {
  const calls = [];
  const ns = {
    args: ["n00dles"],
    tprint: (message) => calls.push(["tprint", message]),
    serverExists: () => true,
    hasRootAccess: () => true,
    getServerRequiredHackingLevel: () => 1,
    getHackingLevel: () => 50,
    getServerMaxMoney: () => 1000,
    getServerSecurityLevel: () => 1,
    getServerMinSecurityLevel: () => 1,
    getServerMoneyAvailable: () => 1000,
    weaken: async (target) => calls.push(["weaken", target]),
    grow: async (target) => calls.push(["grow", target]),
    hack: async (target) => calls.push(["hack", target]),
    ...overrides
  };

  return { ns, calls };
}

function createBootstrapNs({ playerSkill = 50, rootedHosts = [] } = {}) {
  const calls = [];
  const rooted = new Set(rootedHosts);
  const serverStats = new Map([
    [
      "home",
      {
        maxMoney: 0,
        minSecurity: 1,
        requiredSkill: 1
      }
    ],
    [
      "locked-target",
      {
        maxMoney: 100000,
        minSecurity: 1,
        requiredSkill: 1
      }
    ],
    [
      "ready-target",
      {
        maxMoney: 1000,
        minSecurity: 1,
        requiredSkill: 1
      }
    ]
  ]);

  return {
    calls,
    ns: {
      tprint: (message) => calls.push(message),
      getHackingLevel: () => playerSkill,
      scan: (host) => (host === "home" ? ["locked-target", "ready-target"] : ["home"]),
      getServerMaxMoney: (host) => serverStats.get(host).maxMoney,
      getServerMinSecurityLevel: (host) => serverStats.get(host).minSecurity,
      getServerRequiredHackingLevel: (host) => serverStats.get(host).requiredSkill,
      hasRootAccess: (host) => rooted.has(host)
    }
  };
}

test("hack-once returns before action when target lacks root access", async () => {
  const { ns, calls } = createHackOnceNs({
    hasRootAccess: () => false
  });

  await hackOnceMain(ns);

  assert.deepEqual(
    calls.filter(([name]) => ["weaken", "grow", "hack"].includes(name)),
    []
  );
  assert.match(calls[0][1], /root access/i);
});

test("hack-once returns before action when hacking skill is too low", async () => {
  const { ns, calls } = createHackOnceNs({
    getServerRequiredHackingLevel: () => 75,
    getHackingLevel: () => 50
  });

  await hackOnceMain(ns);

  assert.deepEqual(
    calls.filter(([name]) => ["weaken", "grow", "hack"].includes(name)),
    []
  );
  assert.match(calls[0][1], /hacking skill/i);
});

test("hack-once returns before action when target has no max money", async () => {
  const { ns, calls } = createHackOnceNs({
    getServerMaxMoney: () => 0
  });

  await hackOnceMain(ns);

  assert.deepEqual(
    calls.filter(([name]) => ["weaken", "grow", "hack"].includes(name)),
    []
  );
  assert.match(calls[0][1], /money/i);
});

test("bootstrap suggests the first eligible money-bearing target", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home", "ready-target"]
  });

  await bootstrapMain(ns);

  assert.equal(calls.at(-1), "- run hack-once.js ready-target");
});

test("bootstrap uses placeholder when no money-bearing target is eligible", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home"]
  });

  await bootstrapMain(ns);

  assert.equal(calls.at(-1), "- run hack-once.js <target>");
});
