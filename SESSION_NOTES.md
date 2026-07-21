# Session progress notes (updated 2026-07-19)

For picking up in a fresh conversation. Read this first, then check the specific files mentioned.

## Live site & deployment

- **Public URL: `https://radhikadesign.vercel.app`** — this is the one to share. Confirmed genuinely public (no login wall), all fixes deployed.
- **Do NOT use `https://radhika-design.vercel.app`** (hyphenated) — it has a persistent Vercel anti-squatting SSO wall that blocks anyone not logged into the Vercel account. Re-pointing its alias to the latest deploy didn't clear the wall; this looks like a permanent quirk on that specific short alias, not something fixable via CLI.
- Vercel project name: `radhika-design` (renamed a few times over the session: `radhika-portfolio-redesign` → `radhika-portfolio` → `radhika-design`).
- GitHub repo: `radhikavijaywork-1005/radhika-portfolio`.
- **GitHub → Vercel auto-deploy is NOT connected.** Every `git push` needs a manual `vercel --prod --yes` afterward, or changes won't go live. Attempted `vercel git connect` twice, fails with "Failed to connect ... make sure you have access" both times — needs the user to authorize Vercel's GitHub App interactively in a browser at `vercel.com/radhikavijaywork-9632s-projects/radhika-design/settings/git`. This has bitten the user once already (pushed commits sat live-but-undeployed for hours before being caught).
- **Standard deploy flow**: `npm run build` (sanity check) → `git add <files>` → `git commit` → `git push origin main` → `vercel --prod --yes` → `curl` the live URL to confirm the change actually landed. Don't skip the curl check — deploys can silently succeed without actually reflecting the intended change if the build was stale.

## Critical fix: SPA routing on Vercel

Added `vercel.json` with a catch-all rewrite (`/(.*)` → `/index.html`). Without this, **any direct link or page refresh on `/about` or `/work/paywall-experiments` 404'd** on the live site — this was broken from the very first deploy, not a regression. Static files in `public/` (robots.txt, sitemap.xml, og-image.png, apple-touch-icon.png) still serve correctly with the rewrite in place — verified via curl content-type checks.

## Real bugs found and fixed this session (not false alarms)

- **Theme state was never actually shared across components.** `useTheme()` (`src/hooks/useTheme.js`) used a local `useState` — every component calling it (Nav, Hero, AboutMe, CaseStudyPaywall, ThemeToggle, HeroCalm, HeroOrganic) got its own independent, unsynced copy. Clicking the toggle flipped the `.dark` class on `<html>` (so CSS-driven visuals updated fine everywhere), but any JS-conditional logo swap (`theme === "dark" ? X : Y`) stayed frozen at whatever it was on that component's initial mount — this is why logos appeared to "switch randomly" when toggling theme. **Fixed** by wrapping the hook in a proper React Context (`src/context/ThemeContext.jsx`, mirrors the existing `SoundContext.jsx` pattern) and updating all 7 consumers to import from there instead of the raw hook. Verified by clicking the real toggle and confirming the header monogram + hero STAGE logo both flip in sync on the same click, both directions.
- **Mobile nav drawer rendered transparent**, page content bleeding through it. Root cause: `.nav` has `backdrop-filter: blur(0px)` for its scroll effect — even at 0px, a non-`none` `backdrop-filter` creates a new containing block for `position: fixed` descendants (same rule as `filter`/`transform`). So the drawer and its backdrop were being sized relative to the ~100px header instead of the full viewport. **Fixed** by portaling the drawer to `document.body` via `createPortal` so it's never inside `.nav`'s subtree, regardless of what CSS the header has now or later.
- **STAGE logo in About → Experience section showed the full "STAGE" wordmark instead of just the icon mark, but only in dark mode.** `logos.stage` was conditionally swapping to `stage-icon-white.svg` (a 92×24 wordmark, meant for the dark hero) instead of staying on `experience/stage.svg` (the actual icon-mark asset the user provided specifically for this section). **Fixed** by making the Experience section always use `experience/stage.svg` regardless of theme (it's colorful/branded, not monochrome, so it doesn't need a dark-mode swap like the hero wordmark does).
- **P'ART logo invisible in dark mode** — the asset is solid near-black artwork (`#2b2b2b`, confirmed via direct pixel sampling) with no light variant, so on the dark badge background it just disappeared. Fixed with `filter: invert(1) brightness(0.85)` scoped to `.dark .about-experience__logo--part` only.

## Mobile responsiveness — full pass (this was the bulk of the session)

Nav rebuilt twice: first as a full-height slide-in drawer, then restyled to match the user's kishore.design reference — a rounded dropdown card below the header with each link in its own bordered row, active page highlighted, X icon when open, no dark dimming overlay. Icon sized/colored to match the theme/sound icons (28×28, `var(--ink-soft)`, was 32×32 in `var(--ink)`).

Everything else that got mobile-specific fixes this session:
- Home hero: illustration hidden below 640px, meta line font shrunk, "Previously worked at Adani" hidden on mobile (kept a real desktop spacing regression in mind — see gotcha below).
- Footer: copyright line shrunk to 12px, social links reordered first and enlarged to 15px.
- About page: Experience rows now stack company/role consistently instead of wrapping unpredictably by content length; body text (bio paragraphs, hero subhead) reduced 18px → 16px on mobile; gallery caption trailing sentence removed; quote illustration now hides on mobile to match Home's treatment; **portrait now hidden entirely below 640px** (matches Home hero treatment — most recent fix, 2026-07-19).
- Selected Work cards: padding reduced (40px → 16px), the 3 stat pills forced to one row with horizontal scroll instead of stacking.
- Paywall case study: hero's 3 phones now stay in one row (was wrapping to 2 lines); the person-photo/speech-bubble card removed entirely on mobile (not just the photo); Phase 1 variant cards shrunk 210px → 130px so ~2.5 fit per screen; several cards that had zero mobile padding override normalized to 20px; border-radius normalized to a consistent 12px across every phone/screenshot image site-wide (was inconsistent 8–24px depending on element — verified against the actual site standard, which is Selected Work's `.work-card__visual` at 12px, `.work-card__link` outer card at 24px); Phase 1/2/3 tag size reduced for mobile; next-case-study preview thumbnail now shows by default on touch devices instead of only on hover (which touch can never trigger).
- Achievement/Highlights cards: photo auto-cycle now triggers on hovering *anywhere on the card* (was previously only the photo strip itself — lifted `hovered` state up to the parent `AchievementCard`); also auto-cycles by default on touch devices (`matchMedia("(hover: none)")`) since they can't hover at all.

**Two known baked-in exceptions, not bugs**: Dashboard.png/sheet.png/future.png screenshots and the existing-flow SVG have their rounded corners baked directly into the asset pixels/vector, not applied via CSS — confirmed by sampling actual pixel alpha values. Forcing their CSS radius to match the 12px standard would create a mismatched double-edge, so they're intentionally left alone.

## SEO

- `index.html`: canonical, full OG + Twitter card tags, Person JSON-LD, apple-touch-icon (was missing — generated a 180×180 PNG matching the existing sage-circle-italic-R favicon design), theme-color, image alt text on OG/Twitter tags. All domain references point to `radhikadesign.vercel.app` (kept in sync every time the domain changed).
- `public/robots.txt` / `public/sitemap.xml`: present, correctly serving even with the SPA rewrite in place, `/preview/*` excluded.
- **Google Search Console fully set up (2026-07-19)**: property verified via HTML meta tag (`google-site-verification` in `index.html`), sitemap submitted successfully, homepage indexing explicitly requested. Still need to request indexing for `/about` and `/work/paywall-experiments` individually — hit the daily quota after just the homepage, so those two are still waiting on a manual follow-up via Search Console's URL Inspection tool.
- **Known limitation, unresolved**: no prerendering/SSG, so social media scrapers (LinkedIn/WhatsApp/Slack — anything that doesn't execute JS) will show the same Home-page OG card no matter which route is shared. Real users and Google's crawler (which does run JS) see correct per-page titles via `useDocumentTitle`. Fixing the scraper-preview gap properly needs prerendering — flagged as a bigger optional project, not started.

## Explicitly deferred by the user (do not start unprompted)

- **Aesthetic direction exploration** (Gladeye.com references, halftone/leaf-shadow treatments) — hold off, shipping the current build took priority.
- **`CASE_STUDY_REVIEW.md`** fix list for the STAGE paywall case study — never actioned.
- Curious Soul gallery carousel — user supplies her own photos/captions; she's been actively editing this in parallel throughout the session (gallery filenames, `SplitText`/`TypewriterText` components, portrait tilt effects). Don't overwrite her in-progress work in `AboutMe.jsx`/`AboutMe.css` without checking current state first.

## Resolved false alarms (don't re-investigate these)

- STAGE white logo appearing invisible in dark mode — was stale browser cache, twice, in two different contexts. Zero code changes needed either time.
- Reported "hover sound still happening" and "Highlights images cropping" — both traced to a genuine but *transient* Vite dev-server syntax error in `AboutMe.jsx` (mismatched JSX tag) that the user's own concurrent editing had introduced and then fixed a minute later. Confirmed via the dev server log timestamps. Not a persistent bug — if visual glitches appear again, check whether the dev server terminal is mid-error first.
- Border-radius / mobile fixes "not showing up" on the user's end despite correct code — root cause turned out to be a completely different issue each time (stale Vite HMR needing a server restart once; the hyphenated `radhika-design.vercel.app` alias being pinned to an old deployment another time). Always verify via direct `curl`/computed-style checks before assuming the report is wrong.

## Recurring technical gotchas (useful for future sessions, some are environment-specific to this browser automation setup)

- **SVG intrinsic-sizing bug**: Figma-exported SVGs with `width="100%" height="100%"` and no matching viewBox ratio distort badly as `<img>`/masks. Strip the percentage attributes, let `viewBox` drive sizing.
- **Framer Motion `whileInView` + instant/programmatic scroll = content stuck invisible**, and more generally, **rAF-driven animations (Framer Motion, `smooth` scrollTo) often appear completely frozen when tested via this session's browser automation** — confirmed multiple times that this is an artifact of how the automated tab handles timers/rendering, not a real code bug (e.g. hover-triggered CSS transitions test as 0/0/0 via synthetic dispatch even when the underlying React state logic is correct). Prefer verifying via computed styles / direct state inspection over relying on animated visual behavior in this environment.
- **`resize_window` doesn't actually resize the viewport in this environment** — confirmed repeatedly, `window.innerWidth` stays at the real window size regardless. Workaround: inject an iframe sized to the target mobile width into a fresh tab, with `document.documentElement/body { overflow: hidden }` set on the *outer* page first (otherwise the outer page becomes scrollable and steals wheel-scroll events meant for the iframe).
- **Programmatic `scrollTo`/`scrollIntoView` frequently doesn't move the page** in this environment, especially on longer pages. Real wheel scroll (the `computer` tool's `scroll` action) or repeated `Page Down` key presses work more reliably.
- **`ref`-based clicks via the `computer` tool sometimes silently don't register** (no error, but nothing happens — confirmed via before/after state checks). Coordinate-based `left_click` or a native `element.click()` via `javascript_tool` are more reliable when a ref-click doesn't seem to do anything.
- **Bash `cd` side effects break `vite build`** — always prefix build commands with the full project path.
- **kishore.design/about** is the user's explicit style reference (confirmed by opening the live site directly, not from memory) — used for the Experience timeline connector line and, more recently, the mobile nav dropdown card style (rounded card, bordered rows, active-page highlight, X icon).
