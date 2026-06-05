import test from "node:test";
import assert from "node:assert/strict";

import {
  FACTION_SERVERS,
  main as factionHackMain
} from "../src/bin/faction-hack.js";

function createNs({
  existingHosts = FACTION_SERVERS,
  rootedHosts = ["home"],
  programs = ["NUKE.exe"],
  playerSkill = 100
} = {}) {
  const calls = [];
  const rooted = new Set(rootedHosts);
  const programSet = new Set(programs);
  const hostSet = new Set(existingHosts);
  const requiredSkills = new Map(
    FACTION_SERVERS.map((host, index) => [host, 50 + index * 50])
  );

  return {
    calls,
    ns: {
      tprint: (message) => calls.push(["tprint", message]),
      serverExists: (host) => hostSet.has(host),
      hasRootAccess: (host) => rooted.has(host),
      getHackingLevel: () => playerSkill,
      getServerRequiredHackingLevel: (host) => requiredSkills.get(host) ?? 1,
      getServerNumPortsRequired: () => 0,
      fileExists: (file) => programSet.has(file),
      brutessh: (host) => calls.push(["brutessh", host]),
      ftpcrack: (host) => calls.push(["ftpcrack", host]),
      relaysmtp: (host) => calls.push(["relaysmtp", host]),
      httpworm: (host) => calls.push(["httpworm", host]),
      sqlinject: (host) => calls.push(["sqlinject", host]),
      nuke: (host) => {
        calls.push(["nuke", host]);
        rooted.add(host);
        return true;
      },
      hack: async (host) => calls.push(["hack", host])
    }
  };
}

test("faction-hack roots and hacks eligible faction servers", async () => {
  const { ns, calls } = createNs({
    existingHosts: ["CSEC"],
    playerSkill: 100
  });

  await factionHackMain(ns);

  assert.deepEqual(
    calls.filter(([name]) => ["nuke", "hack"].includes(name)),
    [
      ["nuke", "CSEC"],
      ["hack", "CSEC"]
    ]
  );
});

test("faction-hack skips faction servers above current hacking skill", async () => {
  const { ns, calls } = createNs({
    existingHosts: ["run4theh111z"],
    playerSkill: 1
  });

  await factionHackMain(ns);

  assert.deepEqual(
    calls.filter(([name]) => ["nuke", "hack"].includes(name)),
    []
  );
});

test("faction-hack reports when NUKE.exe is missing", async () => {
  const { ns, calls } = createNs({
    existingHosts: ["CSEC"],
    programs: []
  });

  await factionHackMain(ns);

  assert.deepEqual(
    calls.filter(([name]) => ["nuke", "hack"].includes(name)),
    []
  );
  assert.ok(calls.some(([, message]) => /NUKE\.exe/i.test(message)));
});
