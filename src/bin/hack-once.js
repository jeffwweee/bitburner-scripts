function getTarget(ns) {
  const [target] = ns.args;

  return typeof target === "string" && target.length > 0 ? target : null;
}

function shouldWeaken(ns, target) {
  const currentSecurity = ns.getServerSecurityLevel(target);
  const minimumSecurity = ns.getServerMinSecurityLevel(target);

  return currentSecurity > minimumSecurity + 5;
}

function shouldGrow(ns, target) {
  const currentMoney = ns.getServerMoneyAvailable(target);
  const maxMoney = ns.getServerMaxMoney(target);

  return maxMoney > 0 && currentMoney < maxMoney * 0.75;
}

function canActOnTarget(ns, target) {
  if (!ns.hasRootAccess(target)) {
    ns.tprint(`Error: no root access on ${target}. Run scan.js, then gain root before hacking.`);
    return false;
  }

  const requiredSkill = ns.getServerRequiredHackingLevel(target);
  const playerSkill = ns.getHackingLevel();

  if (requiredSkill > playerSkill) {
    ns.tprint(`Error: ${target} requires hacking skill ${requiredSkill}; current skill is ${playerSkill}.`);
    return false;
  }

  if (ns.getServerMaxMoney(target) <= 0) {
    ns.tprint(`Error: ${target} has no available money. Choose a money-bearing target from scan.js.`);
    return false;
  }

  return true;
}

export async function main(ns) {
  const target = getTarget(ns);

  if (!target) {
    ns.tprint("Usage: run hack-once.js <target>");
    return;
  }

  if (!ns.serverExists(target)) {
    ns.tprint(`Error: server does not exist: ${target}`);
    ns.tprint("Usage: run hack-once.js <target>");
    return;
  }

  if (!canActOnTarget(ns, target)) {
    return;
  }

  if (shouldWeaken(ns, target)) {
    ns.tprint(`Selected action: weaken ${target}`);
    await ns.weaken(target);
    return;
  }

  if (shouldGrow(ns, target)) {
    ns.tprint(`Selected action: grow ${target}`);
    await ns.grow(target);
    return;
  }

  ns.tprint(`Selected action: hack ${target}`);
  await ns.hack(target);
}
