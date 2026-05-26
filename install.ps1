# Claude Rules Installer for Windows
# Usage: .\install.ps1 [category/rule-name]
# Example: .\install.ps1 git/workflow-pr
# Run with no args to install the /install-rule skill only.

param([string]$RuleId = "")

$BASE_URL   = "https://raw.githubusercontent.com/juanjimpad/claude-rules/main/rules"
$SKILLS_URL = "https://raw.githubusercontent.com/juanjimpad/claude-rules/main/skills"
$MEMORY_DIR = "$env:USERPROFILE\.claude\memory"
$MEMORY_INDEX = "$env:USERPROFILE\.claude\MEMORY.md"
$COMMANDS_DIR = "$env:USERPROFILE\.claude\commands"

# Install /install-rule skill if not already present
if (-not (Test-Path "$COMMANDS_DIR\install-rule.md")) {
    New-Item -ItemType Directory -Force $COMMANDS_DIR | Out-Null
    Invoke-WebRequest -Uri "$SKILLS_URL/install-rule.md" -OutFile "$COMMANDS_DIR\install-rule.md" -UseBasicParsing
    Write-Host "OK Skill installed: /install-rule"
}

if (-not $RuleId) {
    Write-Host "Usage: .\install.ps1 <category/rule-name>"
    Write-Host "Example: .\install.ps1 git/workflow-pr"
    Write-Host ""
    Write-Host "Tip: inside Claude Code you can now run /install-rule"
    exit 0
}

# Download rule
$TMP = [System.IO.Path]::GetTempFileName()
try {
    Invoke-WebRequest -Uri "$BASE_URL/$RuleId.md" -OutFile $TMP -UseBasicParsing
} catch {
    Write-Host "Rule '$RuleId' not found."
    Remove-Item $TMP -Force
    exit 1
}

if ((Get-Item $TMP).Length -eq 0) {
    Write-Host "Rule '$RuleId' not found."
    Remove-Item $TMP -Force
    exit 1
}

$content = Get-Content $TMP -Raw

# Extract frontmatter fields
$title       = ($content | Select-String -Pattern "(?m)^title:\s*(.+)$").Matches[0].Groups[1].Value.Trim()
$description = ($content | Select-String -Pattern "(?m)^description:\s*(.+)$").Matches[0].Groups[1].Value.Trim()
$name        = ($content | Select-String -Pattern "(?m)^name:\s*(.+)$").Matches[0].Groups[1].Value.Trim()

# Install rule
New-Item -ItemType Directory -Force $MEMORY_DIR | Out-Null
$destFile = "$MEMORY_DIR\$name.md"
Copy-Item $TMP $destFile -Force
Remove-Item $TMP -Force

# Update MEMORY.md index
if (-not (Test-Path $MEMORY_INDEX)) { New-Item -ItemType File $MEMORY_INDEX | Out-Null }
$indexContent = Get-Content $MEMORY_INDEX -Raw -ErrorAction SilentlyContinue
if (-not ($indexContent -match [regex]::Escape($name))) {
    Add-Content $MEMORY_INDEX "- [$title](memory/$name.md) — $description"
}

Write-Host "OK Rule installed: $title"
Write-Host "   -> $destFile"
