# Dynamic Import Manifest Design

## Purpose

Add a stable in-game importer that can refresh the Bitburner scripts from the public GitHub repository without changing the importer every time new script files are added.

## Context

Bitburner does not provide a real in-game `git pull`. It can download files from HTTP URLs with `wget` / `ns.wget()`. The local repo will be published publicly at `jeffwweee/bitburner-scripts`, so the importer can read from GitHub raw URLs.

## Goals

- Add a root `import-repo.js` script that can be copied into Bitburner once and run repeatedly.
- Add a root `manifest.json` that lists files to import.
- Keep downloaded paths identical to repo paths so relative imports keep working.
- Make adding future files a manifest edit, not an importer edit.
- Keep importer behavior safe, visible, and easy to debug in-game.

## Non-Goals

- Do not implement PC-side Git automation.
- Do not implement private repository authentication.
- Do not overwrite `import-repo.js` from inside itself.
- Do not import docs, tests, or tooling into Bitburner yet.

## Manifest

`manifest.json` will live at the repo root:

```json
{
  "version": 1,
  "baseUrl": "https://raw.githubusercontent.com/jeffwweee/bitburner-scripts/main",
  "files": [
    "src/bin/bootstrap.js",
    "src/bin/scan.js",
    "src/bin/hack-once.js",
    "src/lib/format.js",
    "src/lib/network.js",
    "src/lib/targets.js"
  ]
}
```

Only `src/` files are imported for now.

## Importer

`import-repo.js` will:

1. Download `manifest.json` from GitHub raw to a temporary in-game file.
2. Parse the manifest with `JSON.parse`.
3. Validate `version === 1`.
4. Validate each file path:
   - must be a non-empty string,
   - must start with `src/`,
   - must not contain `..`,
   - must not be `import-repo.js`.
5. Download each manifest file from `${baseUrl}/${path}` to the same in-game path.
6. Print per-file success/failure and a final summary.
7. Print the next suggested command: `run src/bin/bootstrap.js`.

## Helper Boundary

Importer validation and URL planning should live in `src/lib/import-manifest.js` so it can be tested locally. The runnable `import-repo.js` remains a thin Netscript wrapper around `ns.wget`, `ns.read`, and `ns.tprint`.

## Error Handling

- If manifest download fails, print an error and stop.
- If manifest JSON cannot be parsed, print an error and stop.
- If validation fails, print the validation issue and stop.
- If individual file downloads fail, continue downloading remaining files and report failures in the summary.

## Testing

Local tests should cover:

- Valid manifest returns planned downloads.
- Invalid version is rejected.
- Paths outside `src/` are rejected.
- Paths containing `..` are rejected.
- `import-repo.js` is rejected if listed.

The runnable importer will be syntax-checked with `node --check import-repo.js`.
