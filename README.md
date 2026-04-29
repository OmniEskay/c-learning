# C Learning Site

An offline C programming course website with a terminal/industrial aesthetic. Runs entirely as static files — no build step, no backend.

## Quick start

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Then open `http://localhost:8080`.

## Structure

```
c-learning/
├── index.html                        # Home + progress dashboard
├── styles/main.css
├── scripts/
│   ├── main.js                       # Navigation, progress tracking, quiz logic
│   ├── spaced-repetition.js          # SR scheduling engine
│   ├── streaks.js                    # Streak + milestone tracking
│   └── tooltips.js                   # Inline glossary tooltips
├── pages/
│   ├── phase1/  intro, setup, hello-world, syntax, control-flow, functions
│   ├── phase2/  arrays-strings, pointers, structures, file-io
│   ├── phase3/  memory-management, dynamic-data-structures, recursion, error-handling
│   └── phase4/  project-calculator, project-student-records, project-file-management, project-mini-shell
├── tools/error-decoder.html          # GCC error → plain English
├── reference/glossary.html           # Full C glossary
└── data/progress.json                # Progress schema (data stored in localStorage)
```

## Course outline

| Phase | Topics |
|-------|--------|
| 1 — Foundations | Intro, setup, hello world, syntax, control flow, functions |
| 2 — Core C | Arrays & strings, pointers, structures, file I/O |
| 3 — Advanced | Memory management, dynamic data structures, recursion, error handling |
| 4 — Projects | Calculator, student records, file management, mini shell |

## Features

- Progress tracking and streaks via `localStorage`
- Spaced repetition for quiz review
- Hover tooltips linking to the glossary
- GCC error decoder tool
- No internet required after initial load (fonts/highlight.js loaded from CDN on first visit)
