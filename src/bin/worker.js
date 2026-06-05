const SECURITY_BUFFER = 5;
const MONEY_GROW_THRESHOLD = 0.75;
const LOOP_DELAY_MS = 1000;

export function chooseWorkerAction(snapshot) {
  if (snapshot.currentSecurity > snapshot.minSecurity + SECURITY_BUFFER) {
    return "weaken";
  }

  if (
    snapshot.maxMoney > 0 &&
    snapshot.currentMoney < snapshot.maxMoney * MONEY_GROW_THRESHOLD
  ) {
    return "grow";
  }

  return "hack";
}

function readTargetSnapshot(ns, target) {
  return {
    currentSecurity: ns.getServerSecurityLevel(target),
    minSecurity: ns.getServerMinSecurityLevel(target),
    currentMoney: ns.getServerMoneyAvailable(target),
    maxMoney: ns.getServerMaxMoney(target)
  };
}

async function runAction(ns, action, target) {
  if (action === "weaken") {
    await ns.weaken(target);
    return;
  }

  if (action === "grow") {
    await ns.grow(target);
    return;
  }

  await ns.hack(target);
}

export async function main(ns) {
  const [target] = ns.args;

  if (typeof target !== "string" || target.length === 0) {
    ns.tprint("Usage: run src/bin/worker.js <target>");
    return;
  }

  while (true) {
    const action = chooseWorkerAction(readTargetSnapshot(ns, target));
    await runAction(ns, action, target);
    await ns.sleep(LOOP_DELAY_MS);
  }
}
