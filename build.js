// build.js
// Simple build script to produce Firefox & Chrome bundles.

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const SRC_FILES = ["background.js", "manifest.json"];

// Ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log("Copied", src, "→", dest);
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("Wrote JSON", file);
}

function buildFirefox() {
  const outDir = path.join(DIST, "firefox");
  ensureDir(outDir);

  // Copy JS files
  for (const f of SRC_FILES) {
    if (f === "manifest.json") continue; // handled separately
    copyFile(path.join(ROOT, f), path.join(outDir, f));
  }

  // Manifest as-is
  const manifest = readJSON(path.join(ROOT, "manifest.json"));
  writeJSON(path.join(outDir, "manifest.json"), manifest);
}

function buildChrome() {
  const outDir = path.join(DIST, "chrome");
  ensureDir(outDir);

  // Copy JS files
  for (const f of SRC_FILES) {
    if (f === "manifest.json") continue; // handled separately
    copyFile(path.join(ROOT, f), path.join(outDir, f));
  }

  // Adapt manifest for Chrome
  const manifest = readJSON(path.join(ROOT, "manifest.json"));

  // Chrome doesn't use "applications"
  if (manifest.applications) {
    delete manifest.applications;
  }

  writeJSON(path.join(outDir, "manifest.json"), manifest);
}

function main() {
  ensureDir(DIST);
  buildFirefox();
  buildChrome();
  console.log("Build complete.");
}

main();

