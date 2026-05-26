Install a rule from the Claude Rules Marketplace into the current user's Claude memory.

**Marketplace index:** https://raw.githubusercontent.com/juanjimpad/claude-rules/main/rules/index.json
**Rule base URL:** https://raw.githubusercontent.com/juanjimpad/claude-rules/main/rules

---

## Argument received: $ARGUMENTS

---

### If no argument was provided (empty string):

1. Use WebFetch to download the index JSON from the marketplace.
2. Display the available rules as a clean list with columns: **ID**, **Title**, **Description**, **Category**.
3. Tell the user: "Run `/install-rule <id>` to install a rule. Example: `/install-rule git/workflow-pr`"

---

### If a rule ID was provided:

1. Use WebFetch to fetch `https://raw.githubusercontent.com/juanjimpad/claude-rules/main/rules/$ARGUMENTS.md`
   - If the fetch fails or returns empty content, tell the user the rule was not found and suggest listing rules with `/install-rule` (no args).

2. Extract these fields from the YAML frontmatter at the top of the file:
   - `name:` → the filename slug (e.g. `git-workflow-pr`)
   - `title:` → human-readable title
   - `description:` → one-line description

3. Determine the Claude memory directory:
   - On **Windows**: `C:\Users\<username>\.claude\memory\` — use `$env:USERPROFILE\.claude\memory\`
   - On **macOS/Linux**: `~/.claude/memory/`

4. Write the full rule file content to `<memory_dir>/<name>.md` using the Write tool.

5. Read `<memory_dir>\..\MEMORY.md` (i.e. `~/.claude/MEMORY.md`). If it doesn't exist, create it empty.
   - Check if an entry for `<name>` already exists.
   - If not, append this line:
     ```
     - [<title>](memory/<name>.md) — <description>
     ```

6. Confirm success: "✓ Rule installed: **<title>**"
   Show the installed file path.
   If this was a feedback/memory rule, mention it will be active in future conversations.
