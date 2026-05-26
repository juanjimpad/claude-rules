#!/usr/bin/env python3
"""Generate rules/index.json from the frontmatter of every rules/**/*.md file."""

import json
import os
import re
import sys

RULES_DIR = os.path.join(os.path.dirname(__file__), "..", "rules")
OUTPUT = os.path.join(RULES_DIR, "index.json")


def parse_frontmatter(content: str) -> dict:
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    if not match:
        return {}
    fm = match.group(1)

    def field(name):
        m = re.search(rf"^{name}:\s*(.+)$", fm, re.MULTILINE)
        return m.group(1).strip() if m else ""

    # tags: [a, b, c]  or  tags: [a, b, c] with quotes
    tags_m = re.search(r"^tags:\s*\[(.+)\]$", fm, re.MULTILINE)
    tags = [t.strip().strip('"').strip("'") for t in tags_m.group(1).split(",")] if tags_m else []

    return {
        "name":        field("name"),
        "title":       field("title"),
        "description": field("description"),
        "category":    field("category"),
        "tags":        tags,
        "author":      field("author"),
        "version":     field("version"),
    }


def main():
    rules = []

    for root, _, files in os.walk(RULES_DIR):
        for filename in sorted(files):
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, encoding="utf-8") as f:
                content = f.read()

            meta = parse_frontmatter(content)
            if not meta.get("name"):
                print(f"SKIP (no frontmatter): {filepath}", file=sys.stderr)
                continue

            rel = os.path.relpath(filepath, RULES_DIR).replace("\\", "/")
            rule_id = rel.removesuffix(".md")

            rules.append({"id": rule_id, **meta})

    rules.sort(key=lambda r: r["id"])

    with open(OUTPUT, "w", encoding="utf-8", newline="\n") as f:
        json.dump(rules, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"Generated {OUTPUT} with {len(rules)} rule(s).")


if __name__ == "__main__":
    main()
