---
name: git-workflow-pr
title: Git Workflow — PR para main
description: Commits siempre a dev, PR para pasar a main, nunca push directo a main
category: git
tags: [git, workflow, github, pull-request]
author: juanjimpad
version: 1.0.0
metadata:
  type: feedback
---

Siempre commits y push a `dev`. Nunca hacer push directo a `main`.

**Why:** El usuario gestiona main a través de PRs aprobadas por él. Un push directo a main se saltaría su revisión y rompería el flujo de trabajo.

**How to apply:**
1. Commit + push a `dev`
2. Crear PR con `gh pr create --base main --head dev`
3. El usuario aprueba y mergea en GitHub — nunca hacer el merge desde Claude
