# RECT — Shikaku Puzzle

> Status: wip — created 2026-06-19

A clean, mobile-first [Shikaku](https://en.wikipedia.org/wiki/Shikaku) logic puzzle.
Divide the grid into rectangles — each contains exactly one number, and that number
equals the rectangle's area. Single self-contained HTML file, no build step.

## Run
Just open `index.html` in a browser. No install, no server, no dependencies.

```bash
# optional local server (for nicer reload / mobile testing on LAN)
python -m http.server 8000   # then open http://localhost:8000
```

## How to play
- **Desktop:** click + drag to draw a rectangle. Right-click a rectangle to remove it.
- **Mobile:** tap a cell to set the start, tap a second cell to place the rectangle
  (tap the same cell to cancel). Long-press a rectangle to remove it, or use Erase mode.
- A rectangle is correct when it holds exactly one number and its area equals that number.
- The level auto-completes when the whole grid is correctly partitioned.

## Features
- Infinite numbered levels; grid grows 4×4 → 15×15 as you progress (seeded, reproducible).
- Current level persists in the URL hash (`#level=42`) and `localStorage`.
- Timer, unlimited Undo, up to 3 Hints/level (each costs a ★), Erase mode.
- Recursive guillotine generation + backtracking solver guarantees every puzzle is solvable.

## Tech
- One `index.html`: HTML5 Canvas (2D, devicePixelRatio-aware), Pointer Events, Geist font via Google Fonts.
- No external JS, no server, no accounts, no tracking.

## PWA
Installable and offline-capable: `manifest.webmanifest`, a service worker (`sw.js`,
network-first for the HTML, cache-first for assets/fonts), and PNG/SVG icons.
When deploying a new version, bump `CACHE` in `sw.js` (e.g. `rect-v3` → `rect-v4`)
so returning visitors get the update.

## Deploy
GitHub Pages serves the files as-is at `https://sokiicz.github.io/rect/`.
No `base` config needed (single static file, all paths relative).
SEO is in place: canonical, OG/Twitter (incl. image), `robots.txt`, and `sitemap.xml`.

## Env vars
None. (`D:/ai/Apps/Secrets/rect.txt` exists but is unused — no secrets in this app.)
