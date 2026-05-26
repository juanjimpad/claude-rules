---
name: git-workflow-pr
title: Git Workflow — PR to main
description: Always work on a feature branch, open a PR to main, never push directly to main
category: git
tags: [git, workflow, github, pull-request]
author: juanjimpad
version: 2.0.0
metadata:
  type: feedback
---

Never push directly to `main`. Always work on a short-lived feature branch and open a PR.

**Why:** `main` has branch protection enabled on GitHub — direct pushes are blocked. All changes must go through a PR the user approves.

**How to apply:**

1. Create a feature branch: `git checkout -b feat/short-description`
2. Commit and push: `git push origin feat/short-description`
3. Create PR with `gh pr create --base main --head feat/short-description`
4. The user approves and merges on GitHub — never merge from Claude
5. Delete the branch after merge