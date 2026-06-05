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

function createBootstrapNs({
  playerSkill = 50,
  rootedHosts = [],
  availablePrograms = []
} = {}) {
  const calls = [];
  const rooted = new Set(rootedHosts);
  const programs = new Set(availablePrograms);
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
        requiredSkill: 1,
        requiredPorts: 1
      }
    ],
    [
      "ready-target",
      {
        maxMoney: 1000,
        minSecurity: 1,
        requiredSkill: 1,
        requiredPorts: 0
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
      getServerNumPortsRequired: (host) => serverStats.get(host).requiredPorts ?? 0,
      hasRootAccess: (host) => rooted.has(host),
      fileExists: (file) => programs.has(file),
      brutessh: (host) => calls.push(`brutessh ${host}`),
      ftpcrack: (host) => calls.push(`ftpcrack ${host}`),
      relaysmtp: (host) => calls.push(`relaysmtp ${host}`),
      httpworm: (host) => calls.push(`httpworm ${host}`),
      sqlinject: (host) => calls.push(`sqlinject ${host}`),
      nuke: (host) => {
        calls.push(`nuke ${host}`);
        rooted.add(host);
      }
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

  assert.ok(calls.includes("- run src/bin/scan.js"));
  assert.ok(calls.includes("- run src/bin/auto-hack.js"));
  assert.equal(calls.at(-1), "- run src/bin/hack-once.js ready-target");
});

test("bootstrap uses placeholder when no money-bearing target is eligible", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home"],
    playerSkill: 0
  });

  await bootstrapMain(ns);

  assert.equal(calls.at(-1), "- run src/bin/hack-once.js <target>");
});

test("bootstrap nukes eligible zero-port servers before suggesting targets", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home"]
  });

  await bootstrapMain(ns);

  assert.ok(calls.includes("nuke ready-target"));
  assert.equal(calls.at(-1), "- run src/bin/hack-once.js ready-target");
});

test("bootstrap opens available ports before nuking eligible servers", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home", "ready-target"],
    availablePrograms: ["BruteSSH.exe"],
    playerSkill: 50
  });

  await bootstrapMain(ns);

  assert.ok(calls.includes("brutessh locked-target"));
  assert.ok(calls.includes("nuke locked-target"));
});

test("bootstrap skips rooting servers above the current hacking skill", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home", "ready-target"],
    playerSkill: 0
  });

  await bootstrapMain(ns);

  assert.equal(calls.includes("nuke locked-target"), false);
});

test("bootstrap skips rooting servers without enough port tools", async () => {
  const { ns, calls } = createBootstrapNs({
    rootedHosts: ["home", "ready-target"],
    playerSkill: 50
  });

  await bootstrapMain(ns);

  assert.equal(calls.includes("nuke locked-target"), false);
});
