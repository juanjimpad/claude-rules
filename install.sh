#!/bin/bash
set -e

RULE_ID="$1"
BASE_URL="https://raw.githubusercontent.com/juanjimpad/claude-rules/main/rules"
SKILLS_URL="https://raw.githubusercontent.com/juanjimpad/claude-rules/main/skills"
MEMORY_DIR="${HOME}/.claude/memory"
MEMORY_INDEX="${HOME}/.claude/MEMORY.md"
COMMANDS_DIR="${HOME}/.claude/commands"

# Install /install-rule skill if not already present
if [ ! -f "${COMMANDS_DIR}/install-rule.md" ]; then
  mkdir -p "$COMMANDS_DIR"
  curl -sL "${SKILLS_URL}/install-rule.md" -o "${COMMANDS_DIR}/install-rule.md"
  echo "✓ Skill installed: /install-rule"
fi

if [ -z "$RULE_ID" ]; then
  echo "Usage: install.sh <category/rule-name>"
  echo "Example: install.sh git/workflow-pr"
  echo ""
  echo "Tip: inside Claude Code you can also run /install-rule"
  exit 1
fi

# Download rule
TMP=$(mktemp)
curl -sL "${BASE_URL}/${RULE_ID}.md" -o "$TMP"

if [ ! -s "$TMP" ]; then
  echo "Rule '${RULE_ID}' not found."
  rm "$TMP"
  exit 1
fi

# Extract metadata
TITLE=$(grep -m1 '^title:' "$TMP" | sed 's/title: *//')
DESCRIPTION=$(grep -m1 '^description:' "$TMP" | sed 's/description: *//')
NAME=$(grep -m1 '^name:' "$TMP" | sed 's/name: *//')

# Install rule
mkdir -p "$MEMORY_DIR"
FILENAME="${MEMORY_DIR}/${NAME}.md"
cp "$TMP" "$FILENAME"
rm "$TMP"

# Update MEMORY.md index
touch "$MEMORY_INDEX"
if ! grep -q "$NAME" "$MEMORY_INDEX"; then
  echo "- [${TITLE}](memory/${NAME}.md) — ${DESCRIPTION}" >> "$MEMORY_INDEX"
fi

echo "✓ Rule installed: ${TITLE}"
echo "  → ${FILENAME}"
