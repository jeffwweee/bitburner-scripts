import { formatMoney } from "../lib/format.js";
import { discoverServers } from "../lib/network.js";
import { rankTargets } from "../lib/targets.js";

const TOP_TARGET_COUNT = 5;
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

function getPlayerHackingSkill(ns) {
  return ns.getHackingLevel();
}

function getAvailableOpeners(ns) {
  return PORT_OPENERS.filter((opener) => ns.fileExists(opener.file, "home"));
}

function rootEligibleServers(ns, discoveredServers, playerSkill) {
  const availableOpeners = getAvailableOpeners(ns);
  const summary = {
    rooted: [],
    skippedSkill: 0,
    skippedPorts: 0
  };

  for (const server of discoveredServers) {
    const host = server.host;

    if (host === "home" || ns.hasRootAccess(host)) {
      continue;
    }

    if (ns.getServerRequiredHackingLevel(host) > playerSkill) {
      summary.skippedSkill += 1;
      continue;
    }

    if (ns.getServerNumPortsRequired(host) > availableOpeners.length) {
      summary.skippedPorts += 1;
      continue;
    }

    for (const opener of availableOpeners) {
      opener.open(ns, host);
    }

    ns.nuke(host);
    summary.rooted.push(host);
  }

  return summary;
}

function printRootSummary(ns, summary) {
  ns.tprint(
    `Root access: ${summary.rooted.length} gained, ${summary.skippedSkill} skipped by skill, ${summary.skippedPorts} skipped by ports.`
  );

  for (const host of summary.rooted) {
    ns.tprint(`- rooted ${host}`);
  }
}

function buildTargetSnapshot(ns, host, playerSkill) {
  return {
    host,
    maxMoney: ns.getServerMaxMoney(host),
    minSecurity: ns.getServerMinSecurityLevel(host),
    requiredSkill: ns.getServerRequiredHackingLevel(host),
    playerSkill,
    hasRoot: ns.hasRootAccess(host)
  };
}

function formatTarget(target) {
  const status = target.eligible ? "ready" : "locked";

  return `${target.host} (${status}) skill=${target.requiredSkill} max=${formatMoney(target.maxMoney)} score=${target.score.toFixed(2)}`;
}

export async function main(ns) {
  const playerSkill = getPlayerHackingSkill(ns);
  const discoveredServers = discoverServers((host) => ns.scan(host), "home");
  const rootSummary = rootEligibleServers(ns, discoveredServers, playerSkill);
  const rankedTargets = rankTargets(
    discoveredServers.map((server) =>
      buildTargetSnapshot(ns, server.host, playerSkill)
    )
  );
  const bestTargets = rankedTargets
    .filter((target) => target.maxMoney > 0)
    .slice(0, TOP_TARGET_COUNT);
  const suggestedTarget = bestTargets.find((target) => target.eligible);

  ns.tprint(`Hacking skill: ${playerSkill}`);
  ns.tprint(`Discovered servers: ${discoveredServers.length}`);
  printRootSummary(ns, rootSummary);
  ns.tprint("Best targets:");

  for (const target of bestTargets) {
    ns.tprint(`- ${formatTarget(target)}`);
  }

  if (bestTargets.length === 0) {
    ns.tprint("- No money-bearing targets discovered yet.");
  }

  ns.tprint("Suggested next commands:");
  ns.tprint("- run scan.js");

  if (suggestedTarget) {
    ns.tprint(`- run hack-once.js ${suggestedTarget.host}`);
  } else {
    ns.tprint("- run hack-once.js <target>");
  }
}
