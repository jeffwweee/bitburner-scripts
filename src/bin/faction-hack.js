export const FACTION_SERVERS = [
  "CSEC",
  "avmnite-02h",
  "I.I.I.I",
  "run4theh111z"
];

const PORT_OPENERS = [
  {
    file: "BruteSSH.exe",
    open: (ns, host) => ns.brutessh(host)
  },
  {
    file: "FTPCrack.exe",
    open: (ns, host) => ns.ftpcrack(host)
  },
  {
    file: "relaySMTP.exe",
    open: (ns, host) => ns.relaysmtp(host)
  },
  {
    file: "HTTPWorm.exe",
    open: (ns, host) => ns.httpworm(host)
  },
  {
    file: "SQLInject.exe",
    open: (ns, host) => ns.sqlinject(host)
  }
];

function getAvailableOpeners(ns) {
  return PORT_OPENERS.filter((opener) => ns.fileExists(opener.file, "home"));
}

function canRoot(ns, host, playerSkill, availableOpeners) {
  return (
    ns.fileExists("NUKE.exe", "home") &&
    ns.getServerRequiredHackingLevel(host) <= playerSkill &&
    ns.getServerNumPortsRequired(host) <= availableOpeners.length
  );
}

function tryRoot(ns, host, playerSkill, availableOpeners) {
  if (ns.hasRootAccess(host)) {
    return true;
  }

  if (!canRoot(ns, host, playerSkill, availableOpeners)) {
    return false;
  }

  for (const opener of availableOpeners) {
    opener.open(ns, host);
  }

  ns.nuke(host);
  return ns.hasRootAccess(host);
}

async function hackFactionServer(ns, host, playerSkill, availableOpeners) {
  if (!ns.serverExists(host)) {
    ns.tprint(`Faction hack: ${host} not discovered yet.`);
    return false;
  }

  if (ns.getServerRequiredHackingLevel(host) > playerSkill) {
    ns.tprint(`Faction hack: ${host} requires more hacking skill.`);
    return false;
  }

  if (!tryRoot(ns, host, playerSkill, availableOpeners)) {
    ns.tprint(`Faction hack: could not root ${host}.`);
    return false;
  }

  ns.tprint(`Faction hack: hacking ${host}.`);
  await ns.hack(host);
  return true;
}

export async function main(ns) {
  if (!ns.fileExists("NUKE.exe", "home")) {
    ns.tprint("Faction hack: NUKE.exe is missing on home.");
    return;
  }

  const playerSkill = ns.getHackingLevel();
  const availableOpeners = getAvailableOpeners(ns);
  let hacked = 0;

  for (const host of FACTION_SERVERS) {
    if (await hackFactionServer(ns, host, playerSkill, availableOpeners)) {
      hacked += 1;
    }
  }

  ns.tprint(`Faction hack: completed ${hacked}/${FACTION_SERVERS.length}.`);
}
