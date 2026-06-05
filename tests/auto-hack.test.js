import test from "node:test";
import assert from "node:assert/strict";

import { planWorkerDeployments } from "../src/bin/auto-hack.js";
import { chooseWorkerAction } from "../src/bin/worker.js";

test("chooseWorkerAction weakens when security is too high", () => {
  assert.equal(
    chooseWorkerAction({
      currentSecurity: 12,
      minSecurity: 5,
      currentMoney: 1000,
      maxMoney: 1000
    }),
    "weaken"
  );
});

test("chooseWorkerAction grows when money is low", () => {
  assert.equal(
    chooseWorkerAction({
      currentSecurity: 7,
      minSecurity: 5,
      currentMoney: 700,
      maxMoney: 1000
    }),
    "grow"
  );
});

test("chooseWorkerAction hacks when security and money are ready", () => {
  assert.equal(
    chooseWorkerAction({
      currentSecurity: 7,
      minSecurity: 5,
      currentMoney: 900,
      maxMoney: 1000
    }),
    "hack"
  );
});

test("planWorkerDeployments fills rooted servers with max worker threads", () => {
  const plan = planWorkerDeployments({
    workerScript: "src/bin/worker.js",
    workerScriptRam: 1.75,
    targets: [
      { host: "foodnstuff", eligible: true, maxMoney: 100000, score: 10 }
    ],
    workers: [
      { host: "home", hasRoot: true, maxRam: 16, usedRam: 4 },
      { host: "n00dles", hasRoot: true, maxRam: 4, usedRam: 0 },
      { host: "sigma-cosmetics", hasRoot: false, maxRam: 8, usedRam: 0 },
      { host: "joesguns", hasRoot: true, maxRam: 1, usedRam: 0 }
    ]
  });

  assert.equal(plan.target, "foodnstuff");
  assert.deepEqual(plan.deployments, [
    {
      host: "home",
      threads: 6,
      target: "foodnstuff",
      script: "src/bin/worker.js"
    },
    {
      host: "n00dles",
      threads: 2,
      target: "foodnstuff",
      script: "src/bin/worker.js"
    }
  ]);
  assert.deepEqual(plan.skipped, [
    { host: "sigma-cosmetics", reason: "no-root" },
    { host: "joesguns", reason: "insufficient-ram" }
  ]);
});

test("planWorkerDeployments reports when no eligible target exists", () => {
  const plan = planWorkerDeployments({
    workerScript: "src/bin/worker.js",
    workerScriptRam: 1.75,
    targets: [{ host: "foodnstuff", eligible: false, maxMoney: 100000, score: 0 }],
    workers: [{ host: "home", hasRoot: true, maxRam: 16, usedRam: 4 }]
  });

  assert.equal(plan.target, null);
  assert.deepEqual(plan.deployments, []);
});
