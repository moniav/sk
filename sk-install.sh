#!/bin/bash
# sk-install.sh — Install ShipKit docs system into your project
# Usage: bash sk-install.sh [target-directory]
#
# Run this script from the extracted sk/ folder, pointing at your project:
#   bash sk-install.sh /path/to/my-project
#
# Or copy this script into your project root and run:
#   bash sk-install.sh .

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo -e "${BOLD}${CYAN}  ┌─────────────────────────────────────┐${NC}"
echo -e "${BOLD}${CYAN}  │     sk — ShipKit Documentation      │${NC}"
echo -e "${BOLD}${CYAN}  │     Plan → Dev → Test lifecycle      │${NC}"
echo -e "${BOLD}${CYAN}  └─────────────────────────────────────┘${NC}"
echo ""

# Resolve target to absolute path
TARGET="$(cd "$TARGET" 2>/dev/null && pwd || echo "$TARGET")"

echo -e "${BLUE}[INFO]${NC} Installing into: $TARGET"
echo ""

# Check if target exists
if [ ! -d "$TARGET" ]; then
    echo -e "${YELLOW}[WARN]${NC} Target directory does not exist. Create it? (y/n)"
    read -r answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        mkdir -p "$TARGET"
    else
        echo "Aborted."
        exit 1
    fi
fi

# Back up existing docs/ before installing
if [ -d "$TARGET/docs" ] && [ "$(ls -A "$TARGET/docs" 2>/dev/null)" ]; then
    TIMESTAMP=$(date +%Y-%m-%dT%H-%M-%S)
    BACKUP_DIR="$TARGET/docs/old/$TIMESTAMP"
    echo -e "${YELLOW}[WARN]${NC} Existing docs/ found — backing up to docs/old/$TIMESTAMP/"
    mkdir -p "$BACKUP_DIR"
    for item in "$TARGET/docs/"*; do
        [ "$(basename "$item")" = "old" ] && continue
        mv "$item" "$BACKUP_DIR/"
    done
    BACKED_UP=true
    echo -e "  ${GREEN}✓${NC} Existing docs moved to docs/old/$TIMESTAMP/"
    echo ""
fi

# --- Create directory structure ---
echo -e "${BLUE}[1/4]${NC} Creating directory structure..."

mkdir -p "$TARGET/docs"/{architecture,conventions,sop,tasks/examples,flows,decisions,system,templates}
mkdir -p "$TARGET/docs/lifecycle"
mkdir -p "$TARGET/.claude/commands/sk"

echo -e "  ${GREEN}✓${NC} docs/ tree created"
echo -e "  ${GREEN}✓${NC} .claude/commands/sk/ created"

# --- Copy files ---
echo -e "${BLUE}[2/4]${NC} Copying documentation files..."

# Determine source — either running from within the SK package or alongside it
if [ -f "$SCRIPT_DIR/CLAUDE.md" ] && [ -d "$SCRIPT_DIR/docs" ]; then
    SOURCE="$SCRIPT_DIR"
elif [ -f "./CLAUDE.md" ] && [ -d "./docs" ]; then
    SOURCE="."
else
    echo -e "${YELLOW}[WARN]${NC} Cannot find SK source files. Make sure you run this from the extracted sk/ folder."
    echo "  Expected: CLAUDE.md, GUIDE.md, docs/, .claude/ in the same directory as this script"
    exit 1
fi

# Copy docs
cp -r "$SOURCE/docs/"* "$TARGET/docs/" 2>/dev/null || true
echo -e "  ${GREEN}✓${NC} docs/ content copied"

# Copy commands
cp -r "$SOURCE/.claude/commands/sk/"* "$TARGET/.claude/commands/sk/" 2>/dev/null || true
echo -e "  ${GREEN}✓${NC} .claude/commands/sk/ copied"

# Copy root files
cp "$SOURCE/CLAUDE.md" "$TARGET/CLAUDE.md" 2>/dev/null || true
cp "$SOURCE/GUIDE.md" "$TARGET/GUIDE.md" 2>/dev/null || true
echo -e "  ${GREEN}✓${NC} CLAUDE.md + GUIDE.md copied"

# --- Validate ---
echo -e "${BLUE}[3/4]${NC} Validating installation..."

ERRORS=0

check_file() {
    if [ -f "$TARGET/$1" ]; then
        echo -e "  ${GREEN}✓${NC} $1"
    else
        echo -e "  ${YELLOW}✗${NC} $1 — MISSING"
        ERRORS=$((ERRORS + 1))
    fi
}

check_file "CLAUDE.md"
check_file "docs/README.md"
check_file "docs/lifecycle/README.md"
check_file "docs/conventions/code-style.md"
check_file "docs/templates/task-prd.md"
check_file "docs/templates/epic.md"
check_file ".claude/commands/sk/plan.md"
check_file ".claude/commands/sk/dev.md"
check_file ".claude/commands/sk/test.md"
check_file ".claude/commands/sk/implement.md"

if [ $ERRORS -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}[WARN]${NC} $ERRORS files missing. Installation may be incomplete."
else
    echo ""
    echo -e "${GREEN}[OK]${NC} All core files present."
fi

# --- Summary ---
echo -e "${BLUE}[4/4]${NC} Installation complete!"
echo ""

# Count files
FILE_COUNT=$(find "$TARGET/docs" "$TARGET/.claude/commands/sk" -type f 2>/dev/null | wc -l | tr -d ' ')

echo -e "${BOLD}${GREEN}  ✅ SK installed — $FILE_COUNT files${NC}"
if [ "$BACKED_UP" = true ]; then
    echo -e "${YELLOW}  [NOTE]${NC} Previous docs preserved in docs/old/"
fi
echo ""
echo -e "${BOLD}  Structure:${NC}"
echo "  $TARGET/"
echo "  ├── CLAUDE.md                  ← Agent reads this first"
echo "  ├── GUIDE.md                   ← Human quick-start guide"
echo "  ├── .claude/commands/sk/       ← 12 slash commands"
echo "  │   ├── implement.md           /sk:implement"
echo "  │   ├── plan.md                /sk:plan"
echo "  │   ├── dev.md                 /sk:dev"
echo "  │   ├── test.md                /sk:test"
echo "  │   ├── new-task.md            /sk:new-task"
echo "  │   ├── new-epic.md            /sk:new-epic"
echo "  │   └── ...                    (8 more)"
echo "  └── docs/                      ← Documentation hub"
echo "      ├── lifecycle/             Plan → Dev → Test"
echo "      ├── conventions/           Code style, structure, git, testing"
echo "      ├── system/                Tech stack, schema, APIs"
echo "      ├── tasks/                 Task board + examples"
echo "      ├── templates/             Starter templates"
echo "      └── ..."
echo ""
echo -e "${BOLD}  Next steps:${NC}"
echo "  1. Edit ${CYAN}docs/system/tech-stack.md${NC} — add your real stack"
echo "  2. Edit ${CYAN}docs/conventions/code-style.md${NC} — match your patterns"
echo "  3. Edit ${CYAN}CLAUDE.md${NC} — add your project commands"
echo "  4. Run ${CYAN}/sk:init-docs${NC} in Claude Code to auto-populate from codebase"
echo "  5. Run ${CYAN}/sk:new-task${NC} to create your first task"
echo ""
