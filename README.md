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

2. Añade la entrada correspondiente en `rules/index.json`
3. Abre una PR

## Estructura

```
rules/          ← reglas en markdown
web/            ← marketplace web
install.sh      ← instalador universal
```
