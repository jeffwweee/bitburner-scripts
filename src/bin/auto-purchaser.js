import {
  planProgramPurchases,
  planPurchasedServers
} from "../lib/purchases.js";

const RESERVE_RATIO = 0.2;
const STARTER_SERVER_RAM = 8;
const SERVER_NAME_PREFIX = "bb-worker-";
const PROGRAM_CATALOG = [
  { file: "BruteSSH.exe", cost: 500000 },
  { file: "FTPCrack.exe", cost: 1500000 },
  { file: "relaySMTP.exe", cost: 5000000 },
  { file: "HTTPWorm.exe", cost: 30000000 },
  { file: "SQLInject.exe", cost: 250000000 }
];

function getOwnedPrograms(ns) {
  return new Set(
    PROGRAM_CATALOG.filter((program) => ns.fileExists(program.file, "home")).map(
      (program) => program.file
    )
  );
}

function getMoney(ns) {
  return ns.getServerMoneyAvailable("home");
}

function printProgramSummary(ns, purchases) {
  if (purchases.length === 0) {
    ns.tprint("Programs: no purchases.");
    return;
  }

  for (const purchase of purchases) {
    ns.tprint(`Programs: bought ${purchase.file}.`);
  }
}

function printServerSummary(ns, purchases) {
  if (purchases.length === 0) {
    ns.tprint("Purchased servers: no purchases.");
    return;
  }

  for (const purchase of purchases) {
    ns.tprint(
      `Purchased servers: bought ${purchase.hostname} with ${purchase.ram}GB RAM.`
    );
  }
}

export async function main(ns) {
  const startingMoney = getMoney(ns);
  const programPlan = planProgramPurchases({
    money: startingMoney,
    reserveRatio: RESERVE_RATIO,
    ownedPrograms: getOwnedPrograms(ns),
    programCatalog: PROGRAM_CATALOG
  });
  const boughtPrograms = [];

  for (const purchase of programPlan.purchases) {
    if (ns.purchaseProgram(purchase.file)) {
      boughtPrograms.push(purchase);
    }
  }

  const serverCost = ns.getPurchasedServerCost(STARTER_SERVER_RAM);
  const serverPlan = planPurchasedServers({
    money: getMoney(ns),
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

  printProgramSummary(ns, boughtPrograms);
  printServerSummary(ns, boughtServers);
  ns.tprint("Next:");
  ns.tprint("- run src/bin/bootstrap.js");
  ns.tprint("- run src/bin/auto-hack.js");
}
