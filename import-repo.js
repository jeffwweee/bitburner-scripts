const MANIFEST_URL =
  "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main/manifest.json";
const MANIFEST_TARGET = "tmp/bitburner-scripts-manifest.json";
const SUPPORTED_VERSION = 1;

function normalizeBaseUrl(baseUrl) {
  if (typeof baseUrl !== "string" || baseUrl.length === 0) {
    throw new Error("Manifest baseUrl must be a non-empty string.");
  }

  return baseUrl.replace(/\/+$/, "");
}

function appendCacheBust(url, cacheBust) {
  if (!cacheBust) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}cacheBust=${encodeURIComponent(cacheBust)}`;
}

function assertValidPath(path) {
  if (typeof path !== "string" || path.length === 0) {
    throw new Error("Manifest file path must be a non-empty string.");
  }

  if (path === "import-repo.js") {
    throw new Error("Manifest must not include import-repo.js.");
  }

  if (!path.startsWith("src/")) {
    throw new Error(`Manifest file path must start with src/: ${path}`);
  }

  if (path.includes("..")) {
    throw new Error(`Manifest file path must not include ..: ${path}`);
  }
}

function planManifestDownloads(manifest, cacheBust = "") {
  if (!manifest || typeof manifest !== "object") {
    throw new Error("Manifest must be an object.");
  }

  if (manifest.version !== SUPPORTED_VERSION) {
    throw new Error(`Unsupported manifest version: ${manifest.version}`);
  }

  if (!Array.isArray(manifest.files)) {
    throw new Error("Manifest files must be an array.");
  }

  const baseUrl = normalizeBaseUrl(manifest.baseUrl);

  return manifest.files.map((path) => {
    assertValidPath(path);

    return {
      url: appendCacheBust(`${baseUrl}/${path}`, cacheBust),
      target: path
    };
  });
}

function readManifest(ns) {
  const manifestText = ns.read(MANIFEST_TARGET);

  if (!manifestText) {
    throw new Error(`Downloaded manifest is empty: ${MANIFEST_TARGET}`);
  }

  return JSON.parse(manifestText);
}

export async function main(ns) {
  const cacheBust = String(Date.now());
  const manifestUrl = appendCacheBust(MANIFEST_URL, cacheBust);

  ns.tprint(`Downloading manifest: ${manifestUrl}`);

  if (!(await ns.wget(manifestUrl, MANIFEST_TARGET))) {
    ns.tprint("Import failed: could not download manifest.");
    return;
  }

  let downloads;

  try {
    downloads = planManifestDownloads(readManifest(ns), cacheBust);
  } catch (error) {
    ns.tprint(`Import failed: ${error.message}`);
    return;
  }

  let downloaded = 0;
  let failed = 0;

  for (const file of downloads) {
    if (await ns.wget(file.url, file.target)) {
      downloaded += 1;
      ns.tprint(`OK ${file.target}`);
    } else {
      failed += 1;
      ns.tprint(`FAIL ${file.target}`);
    }
  }

  ns.tprint(`Import complete: ${downloaded} downloaded, ${failed} failed.`);
  ns.tprint("Next: run src/bin/bootstrap.js");
}
