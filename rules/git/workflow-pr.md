---
name: git-workflow-pr
title: Git Workflow — PR to main
description: Always commit to dev, open a PR to merge into main, never push directly to main
category: git
tags: [git, workflow, github, pull-request]
author: juanjimpad
version: 1.0.0
metadata:
  type: feedback
---

Always commit and push to `dev`. Never push directly to `main`.

**Why:** The user manages main through PRs they approve. A direct push to main would skip their review and break the workflow.

**How to apply:**
1. Commit + push to `dev`
2. Create PR with `gh pr create --base main --head dev`
3. The user approves and merges on GitHub — never merge from Claude
