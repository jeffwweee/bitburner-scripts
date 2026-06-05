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
