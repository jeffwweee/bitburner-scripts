export const PURCHASE_CYCLE = [
  "src/bin/buy-programs.js",
  "src/bin/buy-servers.js",
  "src/bin/upgrade-home.js"
];

export function buildPurchaseCycle() {
  return [...PURCHASE_CYCLE];
}

async function waitForProcess(ns, pid) {
  while (ns.isRunning(pid)) {
    await ns.sleep(1000);
  }
}

async function runPurchaseScript(ns, script) {
  const pid = ns.run(script);

  if (pid === 0) {
    ns.tprint(`Auto purchaser: failed to start ${script}.`);
    return;
  }

  ns.tprint(`Auto purchaser: started ${script}.`);
  await waitForProcess(ns, pid);
}

export async function main(ns) {
  for (const script of buildPurchaseCycle()) {
    await runPurchaseScript(ns, script);
  }

  ns.tprint("Next:");
  ns.tprint("- run src/bin/bootstrap.js");
  ns.tprint("- run src/bin/auto-hack.js");
}
