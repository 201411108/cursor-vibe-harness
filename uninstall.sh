#!/bin/bash
set -euo pipefail

SKILLS_DIR="$HOME/.cursor/skills"

SKILL_NAMES=(
  "orchestrator-harness"
  "role-planner"
  "role-designer"
  "role-developer"
)

echo "=== Cursor Agent Harness Uninstaller ==="
echo ""

removed=0

for skill in "${SKILL_NAMES[@]}"; do
  target="$SKILLS_DIR/$skill"
  if [ -d "$target" ]; then
    rm -rf "$target"
    echo "  [removed] $skill"
    removed=$((removed + 1))
  else
    echo "  [not found] $skill"
  fi
done

echo ""
echo "Done: $removed skills removed."
