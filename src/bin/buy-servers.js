import {
  nextPurchasedServerRam,
  planPurchasedServerUpgrades,
  planPurchasedServers
} from "../lib/purchases.js";

const RESERVE_RATIO = 0.2;
const STARTER_SERVER_RAM = 8;
const SERVER_NAME_PREFIX = "bb-worker-";

function collectPurchasedServers(ns) {
  return ns.getPurchasedServers().map((hostname) => ({
    hostname,
    ram: ns.getServerMaxRam(hostname)
  }));
}

function collectUpgradeCosts(ns, purchasedServers, maxServerRam) {
  const upgradeCosts = {};

  for (const server of purchasedServers) {
    const nextRam = nextPurchasedServerRam(server.ram, maxServerRam);

    if (nextRam === null) {
      continue;
    }

    upgradeCosts[`${server.hostname}:${nextRam}`] =
      ns.getPurchasedServerUpgradeCost(server.hostname, nextRam);
  }

  return upgradeCosts;
}

function printServerPurchaseSummary(ns, purchases) {
  if (purchases.length === 0) {
    ns.tprint("Purchased servers: no new servers.");
    return;
  }

  for (const purchase of purchases) {
    ns.tprint(
      `Purchased servers: bought ${purchase.hostname} with ${purchase.ram}GB RAM.`
    );
  }
}

function printServerUpgradeSummary(ns, upgrades) {
  if (upgrades.length === 0) {
    ns.tprint("Purchased servers: no upgrades.");
    return;
  }

  for (const upgrade of upgrades) {
    ns.tprint(
      `Purchased servers: upgraded ${upgrade.hostname} to ${upgrade.ram}GB RAM.`
    );
  }
}

export async function main(ns) {
  const serverCost = ns.getPurchasedServerCost(STARTER_SERVER_RAM);
  const serverPlan = planPurchasedServers({
    money: ns.getServerMoneyAvailable("home"),
    reserveRatio: RESERVE_RATIO,
    purchasedServers: ns.getPurchasedServers(),
    purchasedServerLimit: ns.getPurchasedServerLimit(),
    serverRam: STARTER_SERVER_RAM,
    serverCost,
    namePrefix: SERVER_NAME_PREFIX
  });
  const boughtServers = [];

  for (const purchase of serverPlan.purchases) {
    const hostname = ns.purchaseServer(purchase.hostname, purchase.ram);

    if (hostname) {
      boughtServers.push({ ...purchase, hostname });
    }
  }

  const purchasedServers = collectPurchasedServers(ns);
  const maxServerRam = ns.getPurchasedServerMaxRam();
  const upgradePlan = planPurchasedServerUpgrades({
    money: ns.getServerMoneyAvailable("home"),
    reserveRatio: RESERVE_RATIO,
    purchasedServers,
    maxServerRam,
    upgradeCosts: collectUpgradeCosts(ns, purchasedServers, maxServerRam)
  });
  const upgradedServers = [];

  for (const upgrade of upgradePlan.upgrades) {
    if (ns.upgradePurchasedServer(upgrade.hostname, upgrade.ram)) {
      upgradedServers.push(upgrade);
    }
  }

  printServerPurchaseSummary(ns, boughtServers);
  printServerUpgradeSummary(ns, upgradedServers);
}
