import { discoverServers } from "../lib/network.js";
import { rankTargets } from "../lib/targets.js";

const WORKER_SCRIPT = "src/bin/worker.js";

function buildTargetSnapshot(ns, host, playerSkill) {
  return {
    host,
    maxMoney: ns.getServerMaxMoney(host),
    minSecurity: ns.getServerMinSecurityLevel(host),
    requiredSkill: ns.getServerRequiredHackingLevel(host),
    playerSkill,
    hasRoot: ns.hasRootAccess(host)
  };
}

function buildWorkerSnapshot(ns, host) {
  return {
    host,
    hasRoot: ns.hasRootAccess(host),
    maxRam: ns.getServerMaxRam(host),
    usedRam: ns.getServerUsedRam(host),
    runningScripts: ns.ps(host)
  };
}

function findDeploymentTarget(targets) {
  return targets.find((target) => target.eligible && target.maxMoney > 0) ?? null;
}

export function planWorkerDeployments({
  workerScript = WORKER_SCRIPT,
  workerScriptRam,
  targets,
  workers
}) {
  const target = findDeploymentTarget(targets);
  const deployments = [];
  const skipped = [];

  if (!target) {
    return {
      target: null,
      deployments,
      skipped
    };
  }

  for (const worker of workers) {
    if (!worker.hasRoot) {
      skipped.push({ host: worker.host, reason: "no-root" });
      continue;
    }

    const reclaimableWorkerRam = (worker.runningScripts ?? [])
      .filter((script) => script.filename === workerScript)
      .reduce((total, script) => total + script.threads * workerScriptRam, 0);
    const freeRam = Math.max(
      worker.maxRam - worker.usedRam + reclaimableWorkerRam,
      0
    );
    const threads = Math.floor(freeRam / workerScriptRam);

    if (threads < 1) {
      skipped.push({ host: worker.host, reason: "insufficient-ram" });
      continue;
    }

    deployments.push({
      host: worker.host,
      threads,
      target: target.host,
      script: workerScript
    });
  }

  return {
    target: target.host,
    deployments,
    skipped
  };
}

export function planWorkerStops({ workerScript = WORKER_SCRIPT, workers }) {
  return workers
    .filter((worker) => worker.hasRoot)
    .map((worker) => ({
      host: worker.host,
      script: workerScript
    }));
}

async function deployWorker(ns, deployment) {
  await ns.scp(deployment.script, deployment.host, "home");
  ns.scriptKill(deployment.script, deployment.host);
  return ns.exec(
    deployment.script,
    deployment.host,
    deployment.threads,
    deployment.target
  );
}

function shouldStopWorkers(ns) {
  return ns.args.includes("--stop");
}

export async function main(ns) {
  const discoveredServers = discoverServers((host) => ns.scan(host), "home");
  const workers = discoveredServers.map((server) =>
    buildWorkerSnapshot(ns, server.host)
  );

  if (shouldStopWorkers(ns)) {
    const stops = planWorkerStops({
      workerScript: WORKER_SCRIPT,
      workers
    });

    for (const stop of stops) {
      ns.scriptKill(stop.script, stop.host);
    }

    ns.tprint(`Stopped ${WORKER_SCRIPT} on ${stops.length} rooted hosts.`);
    return;
  }

  const playerSkill = ns.getHackingLevel();
  const rankedTargets = rankTargets(
    discoveredServers.map((server) =>
      buildTargetSnapshot(ns, server.host, playerSkill)
    )
  );
  const workerScriptRam = ns.getScriptRam(WORKER_SCRIPT, "home");
  const plan = planWorkerDeployments({
    workerScript: WORKER_SCRIPT,
    workerScriptRam,
    targets: rankedTargets,
    workers
  });

  if (!plan.target) {
    ns.tprint("No eligible money-bearing target found. Run bootstrap.js first.");
    return;
  }

  let started = 0;

  for (const deployment of plan.deployments) {
    const pid = await deployWorker(ns, deployment);

    if (pid !== 0) {
      started += 1;
      ns.tprint(
        `Started ${deployment.script} on ${deployment.host} with ${deployment.threads} threads targeting ${deployment.target}.`
      );
    } else {
      ns.tprint(`Failed to start worker on ${deployment.host}.`);
    }
  }

  ns.tprint(
    `Auto hack deployed: ${started}/${plan.deployments.length} workers targeting ${plan.target}.`
  );
}
