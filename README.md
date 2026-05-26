# 🧠 Claude Rules

Marketplace of behavior rules for Claude Code. Install them on any machine with a single command.

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
### `coding/english-code` — Code and Comments in English

All code, variable names, comments, and commit messages must be in English, regardless of the conversation language

```bash
curl -sL https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh | bash -s coding/english-code
```

All code must be written in English, regardless of the language used in the conversation.

**Why:** English is the universal language of programming. Mixed-language codebases are harder to maintain, search, and collaborate on. Non-English identifiers and comments break tooling assumptions and make the code inaccessible to most developers.

**How to apply:**

- Variable names, function names, class names, constants → English
- Inline comments and docstrings → English
- Commit messages → English
- Error messages in code → English
- File names and directory names → English

This applies even if the user writes in Spanish, French, or any other language. Respond to the user in their language, but always write the code in English.

---

### `git/workflow-pr` — Git Workflow — PR to main

Always commit to dev, open a PR to merge into main, never push directly to main

```bash
curl -sL https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh | bash -s git/workflow-pr
```

Always commit and push to `dev`. Never push directly to `main`.

**Why:** The user manages main through PRs they approve. A direct push to main would skip their review and break the workflow.

**How to apply:**
1. Commit + push to `dev`
2. Create PR with `gh pr create --base main --head dev`
3. The user approves and merges on GitHub — never merge from Claude

---
<!-- rules-end -->

## Structure

```
rules/          ← rules in markdown
web/            ← marketplace web UI
install.sh      ← universal installer
install.ps1     ← Windows installer
scripts/        ← repo maintenance scripts
```
