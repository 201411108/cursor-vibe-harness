#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const os = require("os");

const SOURCE_DIR = path.join(__dirname, "..", "skills");
const TEMPLATES_DIR = path.join(__dirname, "..", "templates");

const SKILL_NAMES = [
  "orchestrator-harness",
  "role-planner",
  "role-designer",
  "role-developer",
];

const SPECS_SUBDIRS = ["features", "changes", "decisions"];

const args = process.argv.slice(2);
const command = args.find((a) => !a.startsWith("-")) || "install";
const force = args.includes("--force");
const global = args.includes("--global");

function getSkillsDir() {
  if (global) {
    return path.join(os.homedir(), ".cursor", "skills");
  }
  return path.join(process.cwd(), ".cursor", "skills");
}

function getScopeLabel() {
  return global ? "global (~/.cursor/skills/)" : `project (${process.cwd()})`;
}

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function rmDirSync(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function install() {
  const skillsDir = getSkillsDir();
  const scope = getScopeLabel();

  console.log("\n  Cursor Agent Harness Installer\n");
  console.log(`  Scope: ${scope}\n`);

  fs.mkdirSync(skillsDir, { recursive: true });

  let installed = 0;
  let skipped = 0;

  for (const skill of SKILL_NAMES) {
    const target = path.join(skillsDir, skill);
    const source = path.join(SOURCE_DIR, skill);

    if (fs.existsSync(target) && !force) {
      console.log(`  [skip] ${skill} (already exists)`);
      skipped++;
    } else {
      if (force) rmDirSync(target);
      copyDirSync(source, target);
      console.log(`  [installed] ${skill}`);
      installed++;
    }
  }

  console.log(`\n  Done: ${installed} installed, ${skipped} skipped.`);
  console.log("  Open a new Cursor chat to start using the harness system.\n");

  if (skipped > 0 && !force) {
    console.log("  Tip: Use --force to overwrite existing skills.\n");
  }
}

function uninstall() {
  const skillsDir = getSkillsDir();
  const scope = getScopeLabel();

  console.log("\n  Cursor Agent Harness Uninstaller\n");
  console.log(`  Scope: ${scope}\n`);

  let removed = 0;

  for (const skill of SKILL_NAMES) {
    const target = path.join(skillsDir, skill);
    if (fs.existsSync(target)) {
      rmDirSync(target);
      console.log(`  [removed] ${skill}`);
      removed++;
    } else {
      console.log(`  [not found] ${skill}`);
    }
  }

  console.log(`\n  Done: ${removed} skills removed.\n`);
}

function list() {
  const globalDir = path.join(os.homedir(), ".cursor", "skills");
  const projectDir = path.join(process.cwd(), ".cursor", "skills");

  console.log("\n  Cursor Agent Harness Skills\n");

  console.log("  [global] ~/.cursor/skills/");
  for (const skill of SKILL_NAMES) {
    const target = path.join(globalDir, skill);
    const status = fs.existsSync(target) ? "installed" : "-";
    console.log(`    ${skill} (${status})`);
  }

  console.log(`\n  [project] ${process.cwd()}/.cursor/skills/`);
  for (const skill of SKILL_NAMES) {
    const target = path.join(projectDir, skill);
    const status = fs.existsSync(target) ? "installed" : "-";
    console.log(`    ${skill} (${status})`);
  }

  console.log();
}

function init() {
  const specsDir = path.join(process.cwd(), ".cursor", "specs");

  console.log("\n  Cursor Agent Harness - Specs Init\n");
  console.log(`  Project: ${process.cwd()}\n`);

  if (fs.existsSync(specsDir) && !force) {
    console.log("  [skip] .cursor/specs/ already exists.");
    console.log("  Tip: Use --force to reinitialize.\n");
    return;
  }

  fs.mkdirSync(specsDir, { recursive: true });

  for (const sub of SPECS_SUBDIRS) {
    const subDir = path.join(specsDir, sub);
    fs.mkdirSync(subDir, { recursive: true });
    const gitkeep = path.join(subDir, ".gitkeep");
    if (!fs.existsSync(gitkeep)) {
      fs.writeFileSync(gitkeep, "");
    }
  }

  const readmeSrc = path.join(TEMPLATES_DIR, "specs-readme.md");
  const readmeDest = path.join(specsDir, "README.md");
  if (fs.existsSync(readmeSrc)) {
    fs.copyFileSync(readmeSrc, readmeDest);
  }

  console.log("  [created] .cursor/specs/");
  console.log("  [created] .cursor/specs/features/");
  console.log("  [created] .cursor/specs/changes/");
  console.log("  [created] .cursor/specs/decisions/");
  console.log("  [created] .cursor/specs/README.md");
  console.log("\n  Done. Specs folder is ready as your Single Source of Truth.\n");

  console.log("  Templates available in the package:");
  console.log("    feature-template.md   - Feature spec template");
  console.log("    change-template.md    - Change record template");
  console.log("    decision-template.md  - Decision record (ADR) template\n");
}

function help() {
  console.log(`
  cursor-agent-harness <command> [options]

  Commands:
    install    Install skills to current project (default: local)
    uninstall  Remove installed skills
    init       Initialize .cursor/specs/ folder in current project (SSoT)
    list       Show skill installation status (both global & project)

  Options:
    --global   Install to global ~/.cursor/skills/ instead of project
    --force    Overwrite existing skills / reinitialize specs
    --help     Show this help message

  Examples:
    npx cursor-agent-harness install              # project install (default)
    npx cursor-agent-harness install --global     # global install
    npx cursor-agent-harness install --force      # overwrite existing
    npx cursor-agent-harness uninstall            # remove from project
    npx cursor-agent-harness uninstall --global   # remove from global
    npx cursor-agent-harness init                 # init specs folder
    npx cursor-agent-harness list                 # check both scopes
`);
}

switch (command) {
  case "install":
    install();
    break;
  case "uninstall":
    uninstall();
    break;
  case "init":
    init();
    break;
  case "list":
    list();
    break;
  case "--help":
  case "help":
    help();
    break;
  default:
    console.error(`  Unknown command: ${command}`);
    help();
    process.exit(1);
}
