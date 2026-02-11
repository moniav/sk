# sk-install.ps1 — Install ShipKit docs system into your project (Windows)
# Usage: .\sk-install.ps1 [-Target "C:\path\to\my-project"]
#
# Run from the extracted sk\ folder:
#   .\sk-install.ps1 -Target "C:\Users\me\projects\my-app"
#
# Or from within your project:
#   .\sk-install.ps1

param(
    [string]$Target = "."
)

$ErrorActionPreference = "Stop"

# --- Banner ---
Write-Host ""
Write-Host "  ┌─────────────────────────────────────┐" -ForegroundColor Cyan
Write-Host "  │     sk — ShipKit Documentation      │" -ForegroundColor Cyan
Write-Host "  │     Plan → Dev → Test lifecycle      │" -ForegroundColor Cyan
Write-Host "  └─────────────────────────────────────┘" -ForegroundColor Cyan
Write-Host ""

# Resolve paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Target = (Resolve-Path -Path $Target -ErrorAction SilentlyContinue)?.Path ?? $Target

Write-Host "[INFO] Installing into: $Target" -ForegroundColor Blue
Write-Host ""

# Check target exists
if (-not (Test-Path $Target)) {
    $answer = Read-Host "[WARN] Target directory does not exist. Create it? (y/n)"
    if ($answer -eq "y" -or $answer -eq "Y") {
        New-Item -ItemType Directory -Path $Target -Force | Out-Null
    } else {
        Write-Host "Aborted."
        exit 1
    }
}

# Back up existing docs\ before installing
$BackedUp = $false
if ((Test-Path "$Target\docs") -and (Get-ChildItem "$Target\docs" -ErrorAction SilentlyContinue).Count -gt 0) {
    $Timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
    $BackupDir = Join-Path $Target "docs\old\$Timestamp"
    Write-Host "[WARN] Existing docs\ found — backing up to docs\old\$Timestamp\" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
    foreach ($item in Get-ChildItem "$Target\docs" -Exclude "old") {
        Move-Item -Path $item.FullName -Destination $BackupDir -Force
    }
    $BackedUp = $true
    Write-Host "  [OK] Existing docs moved to docs\old\$Timestamp\" -ForegroundColor Green
    Write-Host ""
}

# --- Create directory structure ---
Write-Host "[1/4] Creating directory structure..." -ForegroundColor Blue

$dirs = @(
    "docs\architecture",
    "docs\conventions",
    "docs\sop",
    "docs\tasks\examples",
    "docs\flows",
    "docs\decisions",
    "docs\system",
    "docs\templates",
    "docs\lifecycle",
    ".claude\commands\sk"
)

foreach ($dir in $dirs) {
    $fullPath = Join-Path $Target $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

Write-Host "  [OK] docs\ tree created" -ForegroundColor Green
Write-Host "  [OK] .claude\commands\sk\ created" -ForegroundColor Green

# --- Find source files ---
$Source = $null
if ((Test-Path "$ScriptDir\CLAUDE.md") -and (Test-Path "$ScriptDir\docs")) {
    $Source = $ScriptDir
} elseif ((Test-Path ".\CLAUDE.md") -and (Test-Path ".\docs")) {
    $Source = (Get-Location).Path
} else {
    Write-Host "[WARN] Cannot find SK source files." -ForegroundColor Yellow
    Write-Host "  Make sure you run this from the extracted sk\ folder."
    Write-Host "  Expected: CLAUDE.md, GUIDE.md, docs\, .claude\ in the same directory"
    exit 1
}

# --- Copy files ---
Write-Host "[2/4] Copying documentation files..." -ForegroundColor Blue

# Copy docs
Copy-Item -Path "$Source\docs\*" -Destination "$Target\docs\" -Recurse -Force
Write-Host "  [OK] docs\ content copied" -ForegroundColor Green

# Copy commands
Copy-Item -Path "$Source\.claude\commands\sk\*" -Destination "$Target\.claude\commands\sk\" -Recurse -Force
Write-Host "  [OK] .claude\commands\sk\ copied" -ForegroundColor Green

# Copy root files
Copy-Item -Path "$Source\CLAUDE.md" -Destination "$Target\CLAUDE.md" -Force
if (Test-Path "$Source\GUIDE.md") {
    Copy-Item -Path "$Source\GUIDE.md" -Destination "$Target\GUIDE.md" -Force
}
Write-Host "  [OK] CLAUDE.md + GUIDE.md copied" -ForegroundColor Green

# --- Validate ---
Write-Host "[3/4] Validating installation..." -ForegroundColor Blue

$errors = 0

function Check-File {
    param([string]$RelPath)
    $fullPath = Join-Path $Target $RelPath
    if (Test-Path $fullPath) {
        Write-Host "  [OK] $RelPath" -ForegroundColor Green
    } else {
        Write-Host "  [!!] $RelPath — MISSING" -ForegroundColor Yellow
        $script:errors++
    }
}

Check-File "CLAUDE.md"
Check-File "docs\README.md"
Check-File "docs\lifecycle\README.md"
Check-File "docs\conventions\code-style.md"
Check-File "docs\templates\task-prd.md"
Check-File "docs\templates\epic.md"
Check-File ".claude\commands\sk\plan.md"
Check-File ".claude\commands\sk\dev.md"
Check-File ".claude\commands\sk\test.md"
Check-File ".claude\commands\sk\implement.md"

Write-Host ""
if ($errors -gt 0) {
    Write-Host "[WARN] $errors files missing. Installation may be incomplete." -ForegroundColor Yellow
} else {
    Write-Host "[OK] All core files present." -ForegroundColor Green
}

# --- Summary ---
Write-Host "[4/4] Installation complete!" -ForegroundColor Blue
Write-Host ""

# Count files
$fileCount = (Get-ChildItem -Path "$Target\docs", "$Target\.claude\commands\sk" -Recurse -File -ErrorAction SilentlyContinue).Count

Write-Host "  [SUCCESS] SK installed — $fileCount files" -ForegroundColor Green
if ($BackedUp) {
    Write-Host "  [NOTE] Previous docs preserved in docs\old\" -ForegroundColor Yellow
}
Write-Host ""
Write-Host "  Structure:" -ForegroundColor White
Write-Host "  $Target\"
Write-Host "  ├── CLAUDE.md                  <- Agent reads this first"
Write-Host "  ├── GUIDE.md                   <- Human quick-start guide"
Write-Host "  ├── .claude\commands\sk\       <- 12 slash commands"
Write-Host "  │   ├── implement.md           /sk:implement"
Write-Host "  │   ├── plan.md                /sk:plan"
Write-Host "  │   ├── dev.md                 /sk:dev"
Write-Host "  │   ├── test.md                /sk:test"
Write-Host "  │   ├── new-task.md            /sk:new-task"
Write-Host "  │   ├── new-epic.md            /sk:new-epic"
Write-Host "  │   └── ...                    (8 more)"
Write-Host "  └── docs\                      <- Documentation hub"
Write-Host "      ├── lifecycle\             Plan -> Dev -> Test"
Write-Host "      ├── conventions\           Code style, structure, git, testing"
Write-Host "      ├── system\                Tech stack, schema, APIs"
Write-Host "      ├── tasks\                 Task board + examples"
Write-Host "      ├── templates\             Starter templates"
Write-Host "      └── ..."
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host "  1. Edit docs\system\tech-stack.md — add your real stack"
Write-Host "  2. Edit docs\conventions\code-style.md — match your patterns"
Write-Host "  3. Edit CLAUDE.md — add your project commands"
Write-Host "  4. Run /sk:init-docs in Claude Code to auto-populate from codebase"
Write-Host "  5. Run /sk:new-task to create your first task"
Write-Host ""
