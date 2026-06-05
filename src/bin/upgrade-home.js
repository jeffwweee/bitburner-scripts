import { planHomeUpgrades } from "../lib/purchases.js";

const RESERVE_RATIO = 0.2;

function hasHomeUpgradeApi(ns, name) {
  return ns.singularity && typeof ns.singularity[name] === "function";
}

function readHomeUpgradeCost(ns, name) {
  try {
    return {
      available: true,
      cost: ns.singularity[name]()
    };
  } catch {
    return {
      available: false,
      cost: Number.POSITIVE_INFINITY
    };
  }
}

function collectHomeUpgradeState(ns) {
  const hasRamApis =
    hasHomeUpgradeApi(ns, "getUpgradeHomeRamCost") &&
    hasHomeUpgradeApi(ns, "upgradeHomeRam");
  const hasCoreApis =
    hasHomeUpgradeApi(ns, "getUpgradeHomeCoresCost") &&
    hasHomeUpgradeApi(ns, "upgradeHomeCores");
  const ram = hasRamApis
    ? readHomeUpgradeCost(ns, "getUpgradeHomeRamCost")
    : { available: false, cost: Number.POSITIVE_INFINITY };
  const cores = hasCoreApis
    ? readHomeUpgradeCost(ns, "getUpgradeHomeCoresCost")
    : { available: false, cost: Number.POSITIVE_INFINITY };

  return {
    money: ns.getServerMoneyAvailable("home"),
    ramCost: ram.cost,
    coreCost: cores.cost,
    canUpgradeRam: hasRamApis && ram.available,
    canUpgradeCores: hasCoreApis && cores.available
  };
}

function printHomeUpgradeSummary(ns, upgrades, canUseHomeApis) {
  if (!canUseHomeApis) {
    ns.tprint("Home upgrades: unavailable in this BitNode/source-file state.");
    return;
  }

  if (upgrades.length === 0) {
    ns.tprint("Home upgrades: no upgrades.");
    return;
  }

  for (const upgrade of upgrades) {
    ns.tprint(`Home upgrades: upgraded ${upgrade.type}.`);
  }
}

export async function main(ns) {
  const state = collectHomeUpgradeState(ns);
  const plan = planHomeUpgrades({
    money: state.money,
    reserveRatio: RESERVE_RATIO,
    ramCost: state.ramCost,
    coreCost: state.coreCost,
    canUpgradeRam: state.canUpgradeRam,
    canUpgradeCores: state.canUpgradeCores
  });
  const upgrades = [];

  for (const upgrade of plan.upgrades) {
    if (upgrade.type === "ram" && ns.singularity.upgradeHomeRam()) {
      upgrades.push(upgrade);
    }

    if (upgrade.type === "cores" && ns.singularity.upgradeHomeCores()) {
      upgrades.push(upgrade);
    }
  }

  printHomeUpgradeSummary(
    ns,
    upgrades,
    state.canUpgradeRam || state.canUpgradeCores
  );
}
