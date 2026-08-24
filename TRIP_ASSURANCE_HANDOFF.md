# Trip Assurance Case Study — Handoff Prompt

Paste this as your first message in the new session.

---

I'm finishing the "Trip Assurance" case study page on my portfolio site. Key files:

- **Page component**: `src/pages/CaseStudyTripAssurance.jsx`
- **Styles**: `src/pages/CaseStudyTripAssurance.css` (also imports/reuses shared classes from `src/pages/CaseStudyPaywall.css` — e.g. `.cs-phase1-card`, `.cs-variant-row--scroll`, `.cs-variant`, `.cs-hero-phone`, `.cs-overview-fact`, `.cs-stat-row`)
- **Content data**: `src/data/caseStudyTripAssurance.js`
- **Route**: currently NOT wired into `src/App.jsx` (removed intentionally — page was half-built and got linked before it was ready). Add the route back locally for dev only when previewing; do not leave it committed/deployed until I say the case study is done.
- Dev server: `npm run dev` (Vite, runs on :5173). Build check: `npm run build`.

**References to check against** (pull via the Figma MCP tool by node ID — much cheaper than navigating Chrome to Figma's web UI):
- Figma: https://www.figma.com/design/tfJYACuH7VXBy3axHIC0ic/Radhika_Portfolio_Playground?node-id=155-13804&m=dev (full case study frame)
- Behance (my published version of this case study, use for content/structure reference): https://www.behance.net/gallery/220285963/Reducing-Waitlist-Uncertainty-with-Trip-Assurance

**Design system already established on this page** (keep using these patterns, don't reinvent):
- Dark evidence-strip band: `background: #1a1210`, `border-radius: 24px`, tiles inside use `border-radius: 12px` and `border: 1px solid #120d0b`
- Border-radius scale: 8px (small tags/chips), 12px (medium cards/images), 24px (large padded panels) — matches Paywall's own scale
- Bracket connectors (grouping labels under/above rows, e.g. "Pre payment Flow"): `.cs-flow-stepper__bracket`, `--above`/`--below` modifiers, `.cs-flow-stepper__bracket-line`, `.cs-flow-stepper__bracket-label` — plain 3-sided box (two legs + one bar), not a simple underline
- Step arrows: use the `FlowArrow` component (SVG, rotated per direction) defined near the top of the JSX file — NOT Unicode arrow characters (→ ↓ ←), those render inconsistently across glyphs
- Screenshot rows with captions (draggable, not auto-scrolling): `useDragScroll` hook + `.cs-variant-row--scroll` + `.cs-variant` + `.cs-variant__title` — this is Paywall's pattern, reused as-is
- Accent color for this case study: `--maroon: #1c74a8` (blue, not literal maroon) — scoped via `.cs-trip` class wrapper

**What's done so far**: Overview, Problem (with auto-scrolling evidence strip), Research (WL flow diagram with brackets, User Survey evidence strip — just fixed corner-radius/cropping bug, Insights cards), Competitor Study (logo header with bracket groups + two draggable screenshot rows for Make My Trip / Railofy).

**What's NOT done / needs your pass**: Everything from Decisions phase 1 (partially built) through the end — Solution 2 (manual booking), Overall Impact, Testimonials, Feedback Insights, Challenges, Future Scope. Go through each section, compare against both the Figma file and the Behance case study, and bring it up to the same quality/pattern bar as what's already built. Don't just copy Figma pixel-for-pixel — match our established component patterns (listed above) first, Figma layout second.

**How to work efficiently** (please follow these — token budget matters):
1. Batch multiple fixes before verifying — don't screenshot after every single CSS tweak.
2. Prefer `getBoundingClientRect()` / `getComputedStyle()` via the JS exec tool for verifying layout — much cheaper than a full screenshot round-trip. Only take an actual screenshot when you genuinely need to see something visually (color, image content, overall composition).
3. Use the Figma MCP tool (`get_screenshot`/`get_metadata` by node ID) instead of navigating Chrome to Figma's web app.
4. When you need an asset from me, ask once, and tell me to drag it from Finder (not paste/screenshot) so it carries a file path you can use directly.
5. If unsure about scope, ask a single clarifying question up front rather than building something and finding out it's wrong after.

Start with: read `caseStudyTripAssurance.js` and the current JSX/CSS in full, then pull the Figma sections for Decisions phase 2 onward, and give me a short plan (what's missing, section by section) before making changes.
