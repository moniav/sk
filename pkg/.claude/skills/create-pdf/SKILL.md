---
name: create-pdf
description: >
  Turn a Markdown or HTML file into a clean, paginated, publication-quality PDF —
  margins, page numbers, running headers, TOC, optional cover page and watermark.
  Use whenever the user asks to make/create/export/generate a PDF or produce a
  printable/shareable document. Cross-platform with automatic engine detection.
---

# Create PDF

Produce a finished, shareable PDF from a Markdown (or HTML) source — not a throwaway dump.
SK is framework-agnostic, so this skill **detects what's installed and picks the best engine**,
falling back as needed. Works on Windows, macOS, and Linux.

## Step 1: Confirm inputs

- **Source file** — the `.md` (or `.html`) to convert. If unclear, ask which file.
- **Output path** — default: same name with `.pdf`, next to the source (or an `exports/`
  folder if converting a `docs/` file and the user prefers). Confirm if ambiguous.
- **Options** (sensible defaults, ask only if it matters): paper `Letter` | `A4`; 1in margins;
  page numbers on; table of contents for docs with >2 headings; optional cover page; optional
  diagonal `DRAFT` watermark.

## Step 2: Detect an available engine

Probe with **Bash**, in this priority order, and use the first that exists:

```bash
command -v pandoc       # best quality + TOC + headers (needs a PDF engine: xelatex/tectonic/weasyprint/wkhtmltopdf)
command -v weasyprint   # HTML/CSS -> PDF, excellent CSS pagination
command -v wkhtmltopdf  # HTML -> PDF
command -v md-to-pdf    # npm (uses headless Chromium); npx md-to-pdf also works if node present
# Headless browser fallback (almost always present):
command -v chromium || command -v chromium-browser || command -v google-chrome || command -v chrome
# Windows: Microsoft Edge is always installed:
#   "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
#   "C:\Program Files\Google\Chrome\Application\chrome.exe"
```

If **nothing** is found, tell the user the one-line install for their platform (e.g.
`pip install weasyprint`, `npm i -g md-to-pdf`, `winget install Pandoc.Pandoc`) and stop —
don't fabricate a PDF.

## Step 3: Convert

### Path A — Pandoc (preferred)
```bash
pandoc INPUT.md -o OUTPUT.pdf \
  --pdf-engine=xelatex \           # or: --pdf-engine=weasyprint / wkhtmltopdf if no LaTeX
  --toc --toc-depth=3 \
  -V geometry:margin=1in -V papersize=letter -V mainfont="DejaVu Serif" \
  -V linkcolor=blue --metadata title="TITLE"
```
Drop `--toc` for short docs. Use `--pdf-engine=weasyprint` (or `wkhtmltopdf`) when no LaTeX is installed.

### Path B — HTML/CSS engines (weasyprint / wkhtmltopdf)
1. Convert MD → HTML (pandoc if present, else any markdown renderer; as a last resort a
   minimal converter).
2. Apply the print stylesheet `references/print.css` (1in margins via `@page`, page numbers,
   running header, page-break rules, curly quotes, cover/watermark classes).
```bash
weasyprint INPUT.html OUTPUT.pdf -s references/print.css
# or
wkhtmltopdf --enable-local-file-access --margin-top 25mm --footer-center "[page]/[topage]" INPUT.html OUTPUT.pdf
```

### Path C — Headless browser fallback (Chrome / Edge)
Wrap the rendered HTML with `references/print.css`, then:
```bash
"<chrome-or-edge>" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="OUTPUT.pdf" "file:///ABSOLUTE/PATH/INPUT.html"
```
On Windows, call `msedge.exe`/`chrome.exe` by full path. Chrome's `--print-to-pdf` honours the
CSS `@page` rules in `print.css`, so margins/page numbers come from there.

## Step 4: Typographic polish (when generating the HTML yourself)

- Straight quotes → curly (`"` → " ", `'` → ' '); `--` → en-dash, `---` → em-dash.
- Avoid orphan headings: `h1,h2,h3 { break-after: avoid; }` (in `print.css`).
- Cover page: title + date on its own page (`.cover` class). Watermark: `.draft` class.

## Step 5: Verify (don't claim success blind)

```bash
ls -l OUTPUT.pdf            # exists and size > 0
# If pdfinfo is available, confirm page count:
command -v pdfinfo && pdfinfo OUTPUT.pdf | grep Pages
```
Report the path, size, and page count. If the file is missing or 0 bytes, the conversion
failed — surface the engine's error, don't pretend it worked.

## Notes

- **Windows console:** keep any status text ASCII (`[OK]`/`[ERROR]`) — the *PDF content*
  itself is full-Unicode-safe; only the terminal has the cp1255 limitation.
- **Never invent output.** If no engine is available or conversion errors, say so and give the
  install command — a missing PDF is a failure, not a silent pass.
