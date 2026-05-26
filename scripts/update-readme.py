#!/usr/bin/env python3
"""Replace the <!-- rules-start/end --> block in README.md with the current rules."""

import os
import re

REPO_ROOT = os.path.join(os.path.dirname(__file__), "..")
RULES_DIR = os.path.join(REPO_ROOT, "rules")
README = os.path.join(REPO_ROOT, "README.md")
INSTALL_BASE = "https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh"


def parse_frontmatter(content: str) -> tuple[dict, str]:
    match = re.match(r"^---\n(.*?)\n---\n(.*)", content, re.DOTALL)
    if not match:
        return {}, content
    fm = match.group(1)
    body = match.group(2).strip()

    def field(name):
        m = re.search(rf"^{name}:\s*(.+)$", fm, re.MULTILINE)
        return m.group(1).strip() if m else ""

    return {
        "title":       field("title"),
        "description": field("description"),
    }, body


def build_rules_block() -> str:
    entries = []

    for root, _, files in os.walk(RULES_DIR):
        for filename in sorted(files):
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(root, filename)
            with open(filepath, encoding="utf-8") as f:
                content = f.read()

            meta, body = parse_frontmatter(content)
            if not meta.get("title"):
                continue

            rel = os.path.relpath(filepath, RULES_DIR).replace("\\", "/")
            rule_id = rel.removesuffix(".md")

            entry = f"### `{rule_id}` — {meta['title']}\n\n"
            if meta["description"]:
                entry += f"{meta['description']}\n\n"
            entry += f"```bash\ncurl -sL {INSTALL_BASE} | bash -s {rule_id}\n```\n\n"
            if body:
                entry += f"{body}\n\n"
            entry += "---"
            entries.append(entry)

    return "\n\n".join(entries)


def main():
    with open(README, encoding="utf-8") as f:
        readme = f.read()

    block = build_rules_block()
    new_readme = re.sub(
        r"<!-- rules-start -->.*?<!-- rules-end -->",
        f"<!-- rules-start -->\n{block}\n<!-- rules-end -->",
        readme,
        flags=re.DOTALL,
    )

    if new_readme == readme:
        print("README.md unchanged.")
        return

    with open(README, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_readme)

    print("README.md updated.")


if __name__ == "__main__":
    main()
