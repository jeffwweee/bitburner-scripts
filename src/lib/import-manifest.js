const SUPPORTED_VERSION = 1;

function assertManifestObject(manifest) {
  if (!manifest || typeof manifest !== "object") {
    throw new Error("Manifest must be an object.");
  }
}

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

export function planManifestDownloads(manifest, cacheBust = "") {
  assertManifestObject(manifest);

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
