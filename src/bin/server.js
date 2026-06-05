export const DEFAULT_LOOP_INTERVAL_MS = 5 * 60 * 1000;

const AUTOMATION_CYCLE = [
  "src/bin/auto-purchaser.js",
  "src/bin/bootstrap.js",
  "src/bin/auto-hack.js"
];

export function buildAutomationCycle() {
  return [...AUTOMATION_CYCLE];
}

async function waitForProcess(ns, pid) {
  while (ns.isRunning(pid)) {
    await ns.sleep(1000);
  }
}

async function runScript(ns, script) {
  const pid = ns.run(script);

  if (pid === 0) {
    ns.tprint(`Server loop: failed to start ${script}.`);
    return;
  }

  ns.tprint(`Server loop: started ${script}.`);
  await waitForProcess(ns, pid);
}

export async function main(ns) {
  const intervalMs = Number(ns.args[0] ?? DEFAULT_LOOP_INTERVAL_MS);
  const cycle = buildAutomationCycle();

  while (true) {
    for (const script of cycle) {
      await runScript(ns, script);
    }

    ns.tprint(`Server loop: sleeping ${Math.round(intervalMs / 1000)}s.`);
    await ns.sleep(intervalMs);
  }
}
