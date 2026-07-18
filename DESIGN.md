---
name: Radhika Vijay — Portfolio
description: A senior product designer's portfolio, grounded in a living nature palette and handmade personal touches, sharp enough to prove real technical craft.
colors:
  paper: "#fffdf2"
  cream-deep: "#faf6e8"
  card: "#fffefb"
  forest: "#1c3a31"
  forest-soft: "#3d5850"
  sage: "#b3c1b4"
  sage-deep: "#92a693"
  rust: "#b65c38"
  rust-soft: "#e8c4b0"
  ink: "#21201b"
  ink-soft: "#5c5a4e"
  line: "rgba(28, 58, 31, 0.14)"
  line-strong: "rgba(28, 58, 31, 0.28)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, Noto Sans Devanagari, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.02em"
    lineHeight: 1.04
  body:
    fontFamily: "DM Sans, Noto Sans Devanagari, sans-serif"
    fontSize: "16px"
    lineHeight: 1.5
  accent:
    fontFamily: "Instrument Serif, Noto Sans Devanagari, serif"
    fontStyle: italic
    fontWeight: 400
  hand:
    fontFamily: "Caveat, cursive"
    fontWeight: 600
  mono:
    fontFamily: "ui-monospace, SF Mono, JetBrains Mono, Menlo, monospace"
rounded:
  chip: "999px"
  card: "20px"
spacing:
  section: "clamp(88px, 11vw, 160px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.chip}"
    padding: "16px 26px"
  button-primary-hover:
    backgroundColor: "{colors.rust}"
---

## Overview

**Creative North Star: The Living Notebook.** Not a polished museum piece —
a working designer's notebook that happens to be beautifully kept. Nature
palette (cream, sage, forest, rust) because it's grounded and warm, not
because it's trendy. Hand-touches (Caveat annotations, a squiggled arrow)
because they're honest marginalia, not decoration bolted on. The whole
system should feel like it belongs to one specific, real person — never
templated, never generic-startup-cool.

Mood: playful, grounded, sharp. Warm enough to feel human, precise enough to
prove real craft. Devanagari greeting and the Sanskrit quote are personal
signal, not an ornamental "ethnic" skin — they stay load-bearing, not
decorative.

Anti-references: the project's own prior orange/black high-contrast
editorial-minimal pass — technically clean but impersonal, disconnected from
who she actually is. Avoid cold high-contrast palettes chosen for trend
rather than truth, pills as a repeated system, uniform card grids, and fake
mockup screenshots standing in for real product screens.

## Colors

- **Paper** (`#fffdf2`) / **Cream Deep** (`#faf6e8`) — the base surface. Warm,
  slightly aged, like real paper rather than a sterile white.
- **Forest** (`#1c3a31`) / **Forest Soft** (`#3d5850`) — primary dark, used
  for headings, the nav overlay, footer, and any inverted section.
- **Sage** (`#b3c1b4`) / **Sage Deep** (`#92a693`) — the ambient/secondary
  tone: gradients, tilt-scene blobs, muted backgrounds.
- **Rust** (`#b65c38`) / **Rust Soft** (`#e8c4b0`) — the single accent. Used
  sparingly: the accent word in hero copy, hover states, one status dot.
  Never rename this token `--accent` in CSS — Tailwind/shadcn (installed
  alongside for one imported component) claims that name and will silently
  overwrite it on a future `shadcn add` run.
- **Ink** (`#21201b`) / **Ink Soft** (`#5c5a4e`) — body text and secondary
  text respectively.

## Typography

- **Display** — Bricolage Grotesque, weight 800, tight tracking. Headings
  and any numeral/stat emphasis.
- **Body** — DM Sans. All running copy.
- **Accent** — Instrument Serif italic, in rust. Used for single emphasized
  words/phrases (the cycling role title, an accent word mid-sentence) —
  never a whole paragraph.
- **Hand** — Caveat. Reserved for genuine marginalia: a single annotation
  near the hero, never a system-wide treatment.
- **Mono** — a generic mono stack for kickers, tags, index numbers,
  timestamps. Signals "technical" without needing a loaded webfont.
- **Devanagari** (Noto Sans Devanagari) — the greeting and the Sanskrit
  quote. Kept at readable sizes; a lesson from a prior pass is that
  Devanagari conjuncts break down into overlapping glyph blobs at very
  large watermark sizes (300px+) if line-height/kerning aren't verified live
  in-browser first.

## Elevation

Mostly flat with one deliberate exception: the hero's 3D-tilt card, which
gets a real soft shadow (`0 30px 60px -20px rgba(28,58,31,0.35)`) to sell
the sense that it's lifted off the page and responding to the cursor.
Everywhere else, depth comes from color layering (sage blobs, grain texture)
rather than drop shadows — the notebook metaphor is about layered paper and
ink, not glassy elevation.

## Components

- **button-primary** — ink pill, rust on hover, mono uppercase label. The
  one primary CTA style; no secondary button variant yet.
- **kicker** — mono, uppercase, a small rust dot before it. Used for
  section eyebrows and the hero status line.
- **hero tilt-card** — a perspective-driven 3D card (CSS `perspective` +
  `rotateX/rotateY` bound to cursor position, layered children at different
  `translateZ` for parallax) with an animated ambient canvas background
  (soft drifting sage/rust gradient blobs, Canvas2D, no WebGL dependency).
  This is the site's signature interactive moment — see kishore.design's
  hero for the ambient-depth reference, though that site's is a WebGL
  shader; this project intentionally uses Canvas2D for lower risk.
- **work-row / feature-card** — indexed list (01/02/03), not a uniform
  grid. A thin accent-colored bar (from each project's own `cover` value)
  marks each row on hover.
- **nav-overlay** — full-screen forest-green takeover menu with staggered
  link reveal, replacing a persistent link bar.
- **marquee** — horizontal auto-scrolling ticker (skills strip, Sanskrit
  quote band).

## Do's and Don'ts

**Do** treat every visual flourish as traceable to something true about her
(heritage, AI-builder identity, real shipped metrics). **Do** let real
numbers (28%, 57%) carry visual weight — they're the actual proof this
portfolio exists to deliver. **Do** keep interactive/playful moments scoped
and intentional (one tilt hero, one hand-annotation) rather than a repeated
system. **Do** verify any large-scale Devanagari text live in-browser before
shipping it.

**Don't** reach for pills as a recurring system. **Don't** build uniform
card grids where an indexed list would show more editorial judgment.
**Don't** fake a product screenshot with a gradient standing in for a real
UI. **Don't** chase a reference site's specific technique (a WebGL shader,
a Next.js-only component) if a simpler, more reliable implementation gets
the same felt effect. **Don't** rename any custom color token `--accent` in
CSS.
