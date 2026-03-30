#!/bin/bash
set -euo pipefail

SKILLS_DIR="$HOME/.cursor/skills"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/skills"

SKILL_NAMES=(
  "orchestrator-harness"
  "role-planner"
  "role-designer"
  "role-developer"
)

echo "=== Cursor Agent Harness Installer ==="
echo ""

if [ ! -d "$SOURCE_DIR" ]; then
  echo "Error: skills/ directory not found. Run this script from the repo root."
  exit 1
fi

mkdir -p "$SKILLS_DIR"

installed=0
skipped=0

for skill in "${SKILL_NAMES[@]}"; do
  target="$SKILLS_DIR/$skill"
  if [ -d "$target" ]; then
    echo "  [skip] $skill (already exists)"
    skipped=$((skipped + 1))
  else
    cp -r "$SOURCE_DIR/$skill" "$target"
    echo "  [installed] $skill"
    installed=$((installed + 1))
  fi
done

echo ""
echo "Done: $installed installed, $skipped skipped."
echo "Open a new Cursor chat to start using the harness system."

if [ "$skipped" -gt 0 ]; then
  echo ""
  echo "Tip: To force reinstall, run: bash install.sh --force"
  if [ "${1:-}" = "--force" ]; then
    echo ""
    echo "Force mode: overwriting existing skills..."
    for skill in "${SKILL_NAMES[@]}"; do
      target="$SKILLS_DIR/$skill"
      rm -rf "$target"
      cp -r "$SOURCE_DIR/$skill" "$target"
      echo "  [overwritten] $skill"
    done
    echo "Done: all skills reinstalled."
  fi
fi
