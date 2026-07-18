# Session progress notes (2026-07-17 → 2026-07-18)

For picking up in a fresh conversation. Read this first, then check the specific files mentioned.

## Currently in progress / unresolved

- **Hover-overflow bug (unconfirmed)**: user reported "the tag is overflowing the section" on Experience row hover, but two direct checks (1554px and 1280px viewports) couldn't reproduce it. Waiting on a screenshot from the user before touching this again — don't guess at a fix.

## SEO basics added (2026-07-18) — pre-launch

Domain used throughout: `https://radhikavijaydesign.vercel.app/` (confirmed by user — **update everywhere below if the final domain differs**, i.e. `index.html` canonical/OG/Twitter tags, `public/robots.txt`, `public/sitemap.xml`).

- `index.html`: added canonical link, robots meta, full Open Graph + Twitter card tags, Person JSON-LD (with `sameAs` pulled from real social links in `src/data/content.js`).
- `public/og-image.png`: 1200×630 generated from the actual hero illustration (`hero-sketch.png`) + name/title text, via a one-off PIL script (not a component — regenerate manually if the hero art or copy changes).
- `public/robots.txt` and `public/sitemap.xml`: added. Sitemap covers the 3 real routes (`/`, `/about`, `/work/paywall-experiments`); `/preview/*` (internal design-exploration pages) explicitly disallowed in robots.txt and excluded from the sitemap.
- `src/hooks/useDocumentTitle.js`: new hook, wired into `AboutMe.jsx` and `CaseStudyPaywall.jsx` so the browser tab title (and Google's JS-executing crawler) sees per-page titles. **Known limitation**: since this is a client-rendered SPA with one static `index.html`, social-media link-preview scrapers (LinkedIn/Twitter/Facebook, which don't execute JS) will show the *same* OG title/description/image for all 3 pages regardless of which URL is shared. Fixing that properly needs prerendering/SSG per route — out of scope for this pass, flagged here in case it matters later (e.g. if she wants to share the case-study link specifically and have its own preview card).

## Resolved false alarms (don't re-investigate these)

- **STAGE "white" logo "bug"**: appeared to render as black/invisible text against the dark hero background. Turned out to be a **stale browser cache**, not a code or asset bug — `stage-icon-white.svg`'s embedded raster is genuinely correct (confirmed by decoding the base64 PNG directly and by loading the file with a cache-busting query param, both showed clean white "STAGE" text). A hard reload fixed it with zero code changes. If this resurfaces, tell the user to hard-refresh before assuming it's a real regression.

## Explicitly deferred by the user (do not start unprompted)

- **Aesthetic direction exploration**: user shared mood references (Gladeye.com, dot-matrix/halftone photo treatment, leaf/floral shadow overlays, film-grain textures) wanting more of that vibe site-wide. Explicitly told to hold off — priority is finishing and shipping the current build first (she's applying for jobs).
- **`CASE_STUDY_REVIEW.md`**: contains a prioritized fix list for the STAGE paywall case study (methodology/sample-size rigor, Variant 3-5 evidence gap, "250%" stat reframe, missing contact CTA, accessibility/localization). Never actioned — "we will visit and fix these later."
- **Hero section polish**: user says it "doesn't look clean and polished and mature enough" — flagged but not yet scoped or started.
- **Curious Soul gallery carousel**: user still needs to supply the actual photos and caption text — blocked on her, not an open task for the assistant.

## Done this session (About page + site-wide)

- Achievements section (renamed to **"Highlights ~"**): pin-corner card treatment matching Figma node 393:3025 (540×567px cards, exact padding/typography verified via computed styles), auto-cycling/draggable photo carousel per achievement (hover-to-cycle, native scroll-snap + mouse drag), background pattern rebuilt from the user's own `pattern.png` (chroma-keyed black→transparent via PIL, recolored to subtle sage-green, single `background-size: cover` — not tiled, tiling left a seam).
- Experience section: single continuous dotted connector line (not per-row segments) spanning the whole timeline in forest green, verified against kishore.design/about directly; logo badges for all 4 companies (STAGE, Adani, P'ART, The Design Bridge) with soft shadow treatment; category tags added (B2C OTT / B2C Travel / Freelance / B2B Research) styled as plain uppercase-free small text with a bullet separator (no pill — explicitly rejected pill treatment).
- About-page portrait: swapped to user's new B&W photo, arch/torn-paper mask treatment reverted back to a simple version per user's explicit "revert" request (do not rebuild the complex arch-mask again without being asked).
- About/Home quote section: made pixel-identical (30px/19px, same wavy rule, same `quote-section` zigzag-line-above-footer class) — previously had drifted to smaller/muted styling.
- Global font fix: **DM Sans "Light" (300) was never actually loading** — the Google Fonts URL in `index.html` only requested weights 400/500/600/700. Fixed by adding `300` to the weight axis. This was silently breaking every `font-weight: 300` declaration site-wide (About bio text, achievement captions, etc.) — they were rendering as Regular, not Light.
- Sound: hover sound **disabled entirely** (`playHover` is now a no-op in `src/hooks/useSound.js`) — matches kishore.design's click-only pattern per explicit user request. Click sound (`playClick`) unaffected.
- Header/footer typography unified: nav links and footer text are both 14px / weight 400 DM Sans (footer was previously 13px/weight 500 on links).
- Logo/monogram click target expanded (`.nav__mark` in `src/App.css`): was ~22×44px, now ~58×72px via padding + matching negative margin (no layout shift).
- Hero STAGE/Adani wordmarks: reverted a mistaken swap to icon-only marks back to full wordmark logos (`stage-icon.png`, new `adani-wordmark.svg` supplied by user) — the user was upset a prior "improvement" silently dropped the readable company name text.

## Recurring technical gotchas hit this session (useful if similar bugs appear)

- **SVG intrinsic-sizing bug**: multiple Figma-exported SVGs had `width="100%" height="100%"` with no matching viewBox-based intrinsic ratio, causing severe distortion when used as `<img>` or CSS masks (looked like noise/static instead of the intended line art). Fix: strip the percentage width/height attributes, let `viewBox` drive sizing. Hit this on `pin-corners.svg` and the About-page arrow SVGs.
- **Framer Motion `whileInView` + instant/programmatic scroll = content stuck invisible.** Not a real bug — always nudge-scroll (`scrollBy(0,-5)` then `scrollBy(0,5)`) and wait ~1-1.5s before screenshotting.
- **Bash `cd` side effects break `vite build`** — a prior `cd` into a subdirectory earlier in the session persists and breaks relative path resolution (`UNRESOLVED_ENTRY` error). Always prefix build commands with `cd /Users/radhikavijay/Projects/radhika-portfolio-redesign &&`.
- **Reference site for editorial/timeline patterns**: kishore.design/about is the user's explicit style reference for the Experience section (connector line style, badge treatment). Confirmed by opening the actual live site, not guessing from memory.
