const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const expectedStrings = [
  packageJson.name,
  "--target cursor",
  "--target codex",
  "--target claude",
  "agent-workflow.manifest.json",
  ".agent-workflow/state.json",
  "role-orchestrator",
];

const missing = expectedStrings.filter((token) => !readme.includes(token));

if (missing.length > 0) {
  console.error("README is missing expected tokens:");
  for (const token of missing) {
    console.error(`- ${token}`);
  }
  process.exit(1);
}

console.log("README command references are in sync.");
