import { planProgramPurchases } from "../lib/purchases.js";

const RESERVE_RATIO = 0.2;
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

function printProgramSummary(ns, purchases) {
  if (purchases.length === 0) {
    ns.tprint("Programs: no purchases.");
    return;
  }

  for (const purchase of purchases) {
    ns.tprint(`Programs: bought ${purchase.file}.`);
  }
}

export async function main(ns) {
  const programPlan = planProgramPurchases({
    money: ns.getServerMoneyAvailable("home"),
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

  printProgramSummary(ns, boughtPrograms);
}
