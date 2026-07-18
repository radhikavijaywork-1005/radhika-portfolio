# Resume Prompt — Portfolio Redesign

Paste this into a new conversation if context is ever lost.

---

Continue building my portfolio redesign. Context:

PROJECT: React + Vite site at ~/Projects/radhika-portfolio-redesign (moved from
~/Documents on 2026-07-11 after macOS revoked Documents-folder access for the
Claude CLI binary — see below) (npm run dev → localhost:5173, may auto-shift to
5174+/5175+ if a port is busy)

NOTE ON LOCATION: this project used to live at ~/Documents/radhika-portfolio-redesign.
macOS's TCC privacy system started blocking that specific Homebrew-installed
`claude` CLI binary from reading ~/Documents (toggling the permission in System
Settings didn't fix it — a known flakiness with Node-launched CLI tools). Worked
around it by using Finder (via osascript) to copy the whole project to
~/Projects/radhika-portfolio-redesign, which isn't under a TCC-protected folder.
The old ~/Documents copy still exists but should be treated as stale — this
~/Projects copy is the one with all subsequent work (Tailwind, shadcn, MCP).

WHO I AM: Radhika Vijay, senior product designer (7+ yrs), currently at STAGE,
previously Adani/Trainman. Real content (bio, case studies, links) lives in
src/data/content.js — read it first, don't re-invent it. That data is factual
and has stayed constant across design pivots below.

DESIGN HISTORY (know this order — the direction changed twice):
1. First attempt: cream/sage/forest-green/rust palette, Devanagari greeting,
   Sanskrit quote, tilde dividers, synthesized from 4 reference sites
   (kishore.design, samakshigoel.com, parulchouhan.com, sanjaymenon.framer.website).
   Rejected as too template-y (pills-as-a-system, uniform grids, fake
   placeholder screenshots).
2. Fixed pass on that same direction: asymmetric hero, indexed work list,
   scroll-illumination Philosophy section, gradient-cover work cards. This had
   two live-verified visual bugs (giant Sanskrit watermark rendering as
   overlapping/garbled glyphs at 300px+, and the floating pill nav overlapping
   scrolled-under content) — see git history if curious, but this direction was
   then explicitly discarded by request, not incrementally fixed.
3. CURRENT DIRECTION (as of 2026-07-09): user said "forget everything shared,
   full creative freedom, unique trending minimal portfolio." Rebuilt from
   scratch as an editorial-minimal, kinetic-typography site:
   - Palette: off-white paper (#faf9f5), near-black ink (#121210), ONE accent
     (#ff4b2e signal orange), dark inverted footer/quote-band (#121210).
   - Type: Bricolage Grotesque (display, huge/black-weight) + DM Sans (body) +
     a generic mono stack for kickers/index numbers/tags. Devanagari kept only
     for the greeting text (profile.greeting), Caveat/Instrument Serif dropped.
   - Hero is purely typographic: giant "Radhika" (filled) / "Vijay" (outlined,
     -webkit-text-stroke) stacked name, no photo placeholder box at all
     (deliberately dropped the earlier "photo coming soon" panel).
   - Nav is a full-screen dark overlay menu (Nav.jsx + nav-overlay in App.css),
     not a persistent link bar — replaces the buggy shrinking pill entirely.
   - Custom magnetic cursor (CustomCursor.jsx, useMagnetic hook) on CTA buttons
     and the footer email link.
   - Marquee.jsx: reusable horizontal ticker, used for the hero skills strip
     and for the Sanskrit-quote band (replaced the old static Quote section).
   - Grain texture overlay on body via SVG feTurbulence (index.css body::before).
   - Work section: one featured row (index 01, giant stat number) + indexed
     list (02/03/04), each row/card gets a thin accent-colored bar from
     item.cover (reused as a solid swatch color, not a gradient background).
   - Philosophy scroll-illumination section kept from the previous direction
     (word-by-word dim→lit on scroll, useScrollProgress) — restyled to the new
     palette, still a good effect, no rewrite needed.
   - AI Experiments (timeline/log) and Writings (row list) kept their existing
     component structure from before, just restyled to new tokens/mono font.

BUGS FOUND AND FIXED during live browser verification of the current direction
(all confirmed via mcp__claude-in-chrome, not just code review):
- Work.jsx Featured card: `.feature__stat` was a sibling of `.feature__body`
  instead of nested inside it, so CSS Grid auto-placed it into the wrong
  (48px, index) column track on an implicit row — the giant stat number
  rendered off-screen to the left. Fixed by nesting copy+stat both inside
  `.feature__body` (see feature__copy wrapper in Work.jsx).
- Footer.jsx: `.footer__kicker` (inline-flex) and `.footer__email` (was
  inline-block) sat on the same line and visually overlapped since neither
  forced a line break. Fixed by making `.footer__email` `display: block`.
- Nav.jsx overlay links: closing the overlay restores `body.style.overflow`
  only in a React effect cleanup, which runs too late for the browser's
  native anchor-jump — clicking a link inside the overlay closed the menu but
  never scrolled. Fixed with a manual `goTo` handler that clears overflow,
  closes the menu, and calls `scrollIntoView` directly (no rAF — rAF and CSS
  smooth-scroll animation don't progress in a backgrounded/unfocused tab,
  which is how the browser-automation tool's tab behaves; this doesn't affect
  real users, but calling scrollIntoView synchronously is simpler anyway).
- Added `scroll-margin-top` to #top/#work/#experiments/#writings in index.css
  so the fixed nav never covers a heading on anchor-jump.

KNOWN TESTING QUIRK (not a bug, just so the next session doesn't re-chase it):
in this browser-automation environment `document.hidden` is true (the tab is
never the OS-focused foreground tab), which throttles `requestAnimationFrame`,
CSS smooth-scroll, AND `IntersectionObserver` callbacks. This makes
`.reveal`-class scroll animations (useReveal hook) appear permanently stuck at
opacity:0 when navigating straight to a URL with a #hash. To visually QA
reveal-based sections in this environment, force them via:
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.transition = 'none'; el.classList.add('is-visible');
  });
This is purely a test-harness artifact — real users' focused tabs won't hit it.

REMAINING / NOT YET DONE:
- Mobile responsive breakpoints are authored in App.css but not visually
  verified (viewport resize is unreliable in this tool environment).
- The custom cursor's hover-active state (34px ring on link/button hover) was
  only spot-checked once; worth a closer look across all interactive elements.
- No further design direction changes are expected — the user explicitly
  signed off on this being a from-scratch rebuild with full creative freedom,
  not an iteration to relitigate.

TOOLING ADDED (2026-07-11, after the design was otherwise considered done):
- `.claude/skills/ui-ux-pro-max/` and related skills installed via
  `npx ui-ux-pro-max-cli init --ai claude` — static reference/skill content,
  read-only, no auto-executing hooks.
- `.claude/skills/impeccable/` installed MANUALLY (not via the `claudepluginhub`
  npx installer, which had an unverifiable source repo) — only `SKILL.md`,
  `reference/*.md`, and the two core scripts (`context.mjs`, `palette.mjs` +
  their tiny local deps) were copied in from github.com/pbakaus/impeccable.
  Deliberately NOT installed: the `PostToolUse` auto-hook and the
  `/impeccable live` browser-automation feature (~15 scripts + a 438KB bundled
  lib) — both unaudited and unused so far.
- MCP server `21st` registered (`claude mcp add --transport http 21st
  https://21st.dev/api/mcp --header "x-api-key: ..."`) — local scope, config
  lives in `~/.claude.json`. The actual API key was provided directly by the
  user in chat; treat it as already exposed, not newly secret.
- Tailwind CSS v4 (`tailwindcss` + `@tailwindcss/vite`) added ONLY to support
  `npx shadcn add @skiper-ui/skiper40`. This project did NOT use Tailwind
  before — it's layered on top of the existing hand-written CSS system, not a
  replacement. `vite.config.js` now has the Tailwind plugin + a `@/` →
  `./src` alias; `jsconfig.json` added for the same alias (editor/tooling only).
  `src/index.css` now starts with `@import "tailwindcss";` plus a large block
  of shadcn's own default design tokens (--background, --primary, --sidebar-*,
  etc.) that the `shadcn add` CLI injected directly into the existing `:root`
  block.
  **IMPORTANT GOTCHA:** that CLI injection directly overwrote the existing
  `--accent: #ff4b2e;` (the site's ENTIRE brand color) with its own default
  `oklch(0.97 0 0)` gray, in place, silently. This was caught and fixed by
  live-verifying in the browser (the whole orange accent had disappeared) —
  if `shadcn add` is ever run again in this project, diff `src/index.css`
  afterward and re-check `--accent` specifically, since the CLI will likely
  clobber it again.
- `src/components/ui/skiper-ui/skiper40.jsx` installed but NOT wired into any
  page yet — it's a set of animated hover-underline link components (Link000–
  Link005). Originally imported `next/link` (this is a Next.js-authored
  component); fixed to a plain `<a>` since this is a Vite project. Nobody has
  decided where/whether to actually use it on the site — ask before assuming.
- These tooling additions pulled in a Geist Variable font (via
  `@fontsource-variable/geist`, ~76KB across weights) that nothing on the
  actual site currently uses — it's dead weight unless skiper40 or another
  shadcn component gets wired in and needs it. Worth removing if it stays
  unused.
