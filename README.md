# 🧠 Claude Rules

Marketplace de reglas de comportamiento para Claude Code. Instálalas en cualquier máquina con un solo comando.

## Instalar una regla

```bash
curl -sL https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh | bash -s git/workflow-pr
```

Las reglas se instalan en `~/.claude/memory/` y se añaden al índice `~/.claude/MEMORY.md`.

## Añadir una regla

1. Crea un archivo en `rules/<categoria>/<nombre>.md` con el siguiente formato:

```markdown
---
name: mi-regla
title: Título de la regla
description: Descripción corta
category: git
tags: [tag1, tag2]
author: tu-usuario
version: 1.0.0
metadata:
  type: feedback
---

Contenido de la regla...

**Why:** Razón por la que existe esta regla.

**How to apply:** Cuándo y cómo aplicarla.
```

2. Abre una PR a `main`

El `rules/index.json` se regenera automáticamente al mergear.

## Reglas disponibles

<!-- rules-start -->
### `git/workflow-pr` — Git Workflow: PR para main

Commits siempre a `dev`, PR para pasar a `main`, nunca push directo a `main`.

```bash
curl -sL https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh | bash -s git/workflow-pr
```

Claude siempre trabajará en `dev` y creará un PR con `gh pr create --base main --head dev`. El merge lo hace el usuario desde GitHub, nunca Claude.

---
<!-- rules-end -->

## Estructura

```
rules/          ← reglas en markdown
web/            ← marketplace web
install.sh      ← instalador universal
install.ps1     ← instalador para Windows
scripts/        ← scripts de mantenimiento del repo
```
