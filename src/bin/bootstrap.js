import { formatMoney } from "../lib/format.js";
import { discoverServers } from "../lib/network.js";
import { rankTargets } from "../lib/targets.js";

const TOP_TARGET_COUNT = 5;

function getPlayerHackingSkill(ns) {
  return ns.getHackingLevel();
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
  const rankedTargets = rankTargets(
    discoveredServers.map((server) =>
      buildTargetSnapshot(ns, server.host, playerSkill)
    )
  );
  const bestTargets = rankedTargets
    .filter((target) => target.maxMoney > 0)
    .slice(0, TOP_TARGET_COUNT);

  ns.tprint(`Hacking skill: ${playerSkill}`);
  ns.tprint(`Discovered servers: ${discoveredServers.length}`);
  ns.tprint("Best targets:");

  for (const target of bestTargets) {
    ns.tprint(`- ${formatTarget(target)}`);
  }

  if (bestTargets.length === 0) {
    ns.tprint("- No money-bearing targets discovered yet.");
  }

  ns.tprint("Suggested next commands:");
  ns.tprint("- run scan.js");

  if (bestTargets[0]) {
    ns.tprint(`- run hack-once.js ${bestTargets[0].host}`);
  } else {
    ns.tprint("- run hack-once.js <target>");
  }
}
