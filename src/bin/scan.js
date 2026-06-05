import { formatMoney, formatRam } from "../lib/format.js";
import { discoverServers } from "../lib/network.js";

function formatRootStatus(ns, host) {
  return ns.hasRootAccess(host) ? "root=yes" : "root=no";
}

function formatServerSummary(ns, server) {
  const host = server.host;
  const maxRam = ns.getServerMaxRam(host);
  const requiredSkill = ns.getServerRequiredHackingLevel(host);
  const maxMoney = ns.getServerMaxMoney(host);

  return [
    host,
    `depth=${server.depth}`,
    formatRootStatus(ns, host),
    `ram=${formatRam(maxRam)}`,
    `skill=${requiredSkill}`,
    `max=${formatMoney(maxMoney)}`
  ].join(" ");
}

export async function main(ns) {
  const discoveredServers = discoverServers((host) => ns.scan(host), "home");

  for (const server of discoveredServers) {
    ns.tprint(formatServerSummary(ns, server));
  }
}
