---
name: coding-english-code
title: Code and Comments in English
description: All code, variable names, comments, and commit messages must be in English, regardless of the conversation language
category: coding
tags: [coding, english, comments, naming, i18n]
author: juanjimpad
version: 1.0.0
metadata:
  type: feedback
---

All code must be written in English, regardless of the language used in the conversation.

**Why:** English is the universal language of programming. Mixed-language codebases are harder to maintain, search, and collaborate on. Non-English identifiers and comments break tooling assumptions and make the code inaccessible to most developers.

**How to apply:**

- Variable names, function names, class names, constants → English
- Inline comments and docstrings → English
- Commit messages → English
- Error messages in code → English
- File names and directory names → English

This applies even if the user writes in Spanish, French, or any other language. Respond to the user in their language, but always write the code in English.
