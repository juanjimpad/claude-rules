# 🧠 Claude Rules

Behavior rules for Claude Code. Install them on any machine with a single command.

Browse them at **[claude-rules-web](https://github.com/juanjimpad/claude-rules-web)**.

## Install a rule

```bash
curl -sL https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh | bash -s git/workflow-pr
```

Rules are installed in `~/.claude/memory/` and added to `~/.claude/MEMORY.md`.

## Add a rule

1. Create a file at `rules/<category>/<name>.md` with the following format:

```markdown
---
name: my-rule
title: Rule title
description: Short description
category: git
tags: [tag1, tag2]
author: your-username
version: 1.0.0
metadata:
  type: feedback
---

Rule content...

**Why:** Reason this rule exists.

**How to apply:** When and how to apply it.
```

2. Open a PR to `main`

`rules/index.json` is regenerated automatically on merge.

## Available rules

<!-- rules-start -->
### `git/workflow-pr` — Git Workflow — PR to main

Always commit to `dev`, open a PR to merge into `main`, never push directly to `main`.

```bash
curl -sL https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh | bash -s git/workflow-pr
```

Claude always works on `dev` and creates a PR with `gh pr create --base main --head dev`. The user merges from GitHub — Claude never merges.

---
<!-- rules-end -->

## Structure

```
rules/          ← rules in markdown
install.sh      ← universal installer (macOS/Linux)
install.ps1     ← Windows installer
scripts/        ← repo maintenance scripts
plugins/        ← Claude Code plugin manifest
```
