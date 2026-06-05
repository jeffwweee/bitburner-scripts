function getSpendFloor(money, reserveRatio) {
  return money * Math.max(reserveRatio, 0);
}

function canAffordAfterReserve(currentMoney, cost, reserveFloor) {
  return currentMoney - cost >= reserveFloor;
}

export function planProgramPurchases({
  money,
  reserveRatio,
  ownedPrograms,
  programCatalog
}) {
  const reserveFloor = getSpendFloor(money, reserveRatio);
  const purchases = [];
  let remainingMoney = money;

  for (const program of programCatalog) {
    if (ownedPrograms.has(program.file)) {
      continue;
    }

    if (!canAffordAfterReserve(remainingMoney, program.cost, reserveFloor)) {
      continue;
    }

    purchases.push(program);
    remainingMoney -= program.cost;
  }

  return {
    purchases,
    remainingMoney
  };
}

function nextPurchasedServerName(existingNames, namePrefix) {
  for (let index = 0; ; index += 1) {
    const candidate = `${namePrefix}${index}`;

    if (!existingNames.has(candidate)) {
      return candidate;
    }
  }
}

export function planPurchasedServers({
  money,
  reserveRatio,
  purchasedServers,
  purchasedServerLimit,
  serverRam,
  serverCost,
  namePrefix
}) {
  const reserveFloor = getSpendFloor(money, reserveRatio);
  const existingNames = new Set(purchasedServers);
  const purchases = [];
  let remainingMoney = money;

  while (
    existingNames.size < purchasedServerLimit &&
    canAffordAfterReserve(remainingMoney, serverCost, reserveFloor)
  ) {
    const hostname = nextPurchasedServerName(existingNames, namePrefix);
    const purchase = {
      hostname,
      ram: serverRam,
      cost: serverCost
    };

    purchases.push(purchase);
    existingNames.add(hostname);
    remainingMoney -= serverCost;
  }

  return {
    purchases,
    remainingMoney
  };
}

export function nextPurchasedServerRam(currentRam, maxServerRam) {
  if (currentRam >= maxServerRam) {
    return null;
  }

  return Math.min(currentRam * 2, maxServerRam);
}

function getUpgradeCost(upgradeCosts, hostname, ram) {
  return upgradeCosts[`${hostname}:${ram}`] ?? Number.POSITIVE_INFINITY;
}

export function planPurchasedServerUpgrades({
  money,
  reserveRatio,
  purchasedServers,
  maxServerRam,
  upgradeCosts
}) {
  const reserveFloor = getSpendFloor(money, reserveRatio);
  const candidates = purchasedServers
    .map((server) => {
      const ram = nextPurchasedServerRam(server.ram, maxServerRam);

      if (ram === null) {
        return null;
      }

      return {
        hostname: server.hostname,
        ram,
        cost: getUpgradeCost(upgradeCosts, server.hostname, ram)
      };
    })
    .filter((candidate) => candidate !== null)
    .filter((candidate) => Number.isFinite(candidate.cost))
    .sort((left, right) => left.cost - right.cost || left.ram - right.ram);
  const upgrades = [];
  let remainingMoney = money;

  for (const candidate of candidates) {
    if (!canAffordAfterReserve(remainingMoney, candidate.cost, reserveFloor)) {
      continue;
    }

    upgrades.push(candidate);
    remainingMoney -= candidate.cost;
  }

  return {
    upgrades,
    remainingMoney
  };
}

export function planHomeUpgrades({
  money,
  reserveRatio,
  ramCost,
  coreCost,
  canUpgradeRam,
  canUpgradeCores
}) {
  const reserveFloor = getSpendFloor(money, reserveRatio);
  const candidates = [
    canUpgradeRam ? { type: "ram", cost: ramCost } : null,
    canUpgradeCores ? { type: "cores", cost: coreCost } : null
  ].filter((candidate) => candidate !== null && Number.isFinite(candidate.cost));
  const upgrades = [];
  let remainingMoney = money;

  for (const candidate of candidates) {
    if (!canAffordAfterReserve(remainingMoney, candidate.cost, reserveFloor)) {
      continue;
    }

    upgrades.push(candidate);
    remainingMoney -= candidate.cost;
  }

  return {
    upgrades,
    remainingMoney
  };
}
