import test from "node:test";
import assert from "node:assert/strict";

import { planManifestDownloads } from "../src/lib/import-manifest.js";

const validManifest = {
  version: 1,
  baseUrl: "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main",
  files: ["src/bin/bootstrap.js", "src/lib/format.js"]
};

test("planManifestDownloads returns download entries for valid manifests", () => {
  assert.deepEqual(planManifestDownloads(validManifest), [
    {
      url: "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/src/bin/bootstrap.js",
      target: "src/bin/bootstrap.js"
    },
    {
      url: "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/src/lib/format.js",
      target: "src/lib/format.js"
    }
  ]);
});

test("planManifestDownloads appends cache bust values to download URLs", () => {
  assert.deepEqual(planManifestDownloads(validManifest, "abc 123"), [
    {
      url: "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/src/bin/bootstrap.js?cacheBust=abc%20123",
      target: "src/bin/bootstrap.js"
    },
    {
      url: "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/src/lib/format.js?cacheBust=abc%20123",
      target: "src/lib/format.js"
    }
  ]);
});

test("planManifestDownloads rejects unsupported manifest versions", () => {
  assert.throws(
    () => planManifestDownloads({ ...validManifest, version: 2 }),
    /version/i
  );
});

test("planManifestDownloads rejects paths outside src", () => {
  assert.throws(
    () => planManifestDownloads({ ...validManifest, files: ["README.md"] }),
    /src/i
  );
});

test("planManifestDownloads rejects parent directory traversal", () => {
  assert.throws(
    () => planManifestDownloads({ ...validManifest, files: ["src/../README.md"] }),
    /\.\./
  );
});

test("planManifestDownloads rejects import-repo.js entries", () => {
  assert.throws(
    () => planManifestDownloads({ ...validManifest, files: ["import-repo.js"] }),
    /import-repo/
  );
});
