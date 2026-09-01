# Domain purchase & deploy pipeline — session notes (2026-08-24 to 2026-08-27)

For picking up in a fresh conversation. Covers: Trip Assurance fix, Paywall Future Scope fix, the hero "make it 3D" saga (abandoned), the Vercel deploy-block root cause, and the in-progress custom domain purchase.

## Trip Assurance case study — fixed, live
- Was 404ing on production (`DEPLOYMENT_NOT_FOUND`) — root cause was uncommitted local changes never pushed. Fixed: committed everything, pushed, redeployed.
- Metrics corrected on the homepage Work grid card: "28% opt in" / "30% ATV" (was showing "80%" — wrong figure).
- Local dev shows the real `CaseStudyTripAssurance` component; a Vercel-only redirect to a Figma prototype was added at one point while the case study was mid-build, then later removed once the real page was ready (see commit "Remove stray Figma redirect for /work/trip-assurance" — production now serves the real page, not Figma).
- Character Chatbot case study route/nav entry was pulled from production (still in progress) — don't re-add without checking it's actually ready.

## Paywall case study — Future Scope section fixed, live
- Bug: `.cs-future-list__item` has `gap: 0` (shared CSS with `CaseStudyTripAssurance.jsx`, which uses an icon with its own `margin-right` instead of relying on gap) — Paywall's number-badge variant (`.cs-future-list__n`) had no margin, so numbers sat flush against the text. Fixed by adding `margin-right: 14px` to `.cs-future-list__n` specifically (scoped, doesn't touch TA).
- Mockup was 280px, larger than the Phase 1/2/3 mockups (240px) earlier in the same case study. Fixed by scoping `.cs-paywall .cs-future-img-wrap { width: 240px; }`.
- Both fixes deployed to production and confirmed live.

## Hero "make it 3D" — abandoned, reverted to original
Multiple attempts, all unsuccessful, user explicitly said to stop:
1. Three.js particle-cloud portrait generated from portrait/depth/density maps — rendered as noise/blob, never looked like a face.
2. CSS shadow-drift + background-glow parallax layered on the existing flat illustration — user said "still just 2D."
3. Vertex-displacement of the flat illustration (alpha channel as heightmap) — tore the line-art into jagged fringes (hard edges + big displacement = shredded look). Reverted immediately.
4. Abstract faceted 3D gem (React Three Fiber + drei) — genuinely 3D and rotating, but user said "not even my face, just a ball."
5. Extruded 3D plaque (BoxGeometry, portrait texture on front face, solid color edges/back) — user said "leave it, not getting what I actually want."

**Current state: reverted to the original pre-experiment version** — flat illustration (`PortraitLiquid` liquid-ripple shader) + CSS `rotateX/rotateY` tilt via `useTiltEffect`. This is what's live in production. Don't restart this without a concrete reference (image/sketch) from the user first — abstract "make it 3D" requests without source 3D geometry are not solvable well from a single flat illustration.

## Deploy pipeline — root cause found and fixed
- Vercel **blocks CLI deploys** when the git commit's author email doesn't match a verified email on the GitHub account connected to the project. Shows as deployment status "Blocked" with message "commit email ... could not be matched to a Git account."
- This repo's commits were authored as `radhikavijay5895@gmail.com`; the connected GitHub account (`radhikavijaywork-1005`) needs `radhikavijaywork@gmail.com`.
- **Fixed permanently**: local `git config user.email` is now set to `radhikavijaywork@gmail.com` for this repo. Future commits should deploy without hitting this block.
- Vercel project is `radhika-design` under team `radhikavijaywork-9632s-projects` (Hobby plan) — the `.vercel/project.json` in the main working directory should point here. If it ever points to a different `orgId`, deploys will fail with "not a member of the team" — check `.vercel/project.json` matches `vercel project ls` output before deploying.
- **To ship only specific commits without deploying unrelated local WIP**: use a `git worktree` from `origin/main`, cherry-pick just the desired commit(s), deploy from that isolated worktree, then push just that commit to `origin/main` and remove the worktree. (Done successfully for the Paywall fix while Booking Failures case study was still WIP locally.)

## Custom domain — decision made, not yet purchased
- User wants a professional custom domain instead of `radhikadesign.vercel.app`.
- Decided: **`radhikavijay.com`** — plain full name, `.com`, no hyphens/extra words. Reasoning: at senior level (7+ yrs), full name alone carries more weight than name+specialty (e.g. `radhikavijaydesign.com`); `.com` is more universally trusted than `.design` and doesn't box her into one specialty term.
- `radhika.design` and `radhikadesign.com` were both already taken (checked, not purchasable).
- Registrar comparison (real cart data, not just marketing pages — marketing/list prices are misleading, e.g. GoDaddy's "transfer price" ≠ actual renewal price):
  - **Hostinger** (cart already built, ready to pay): `radhikavijay.com`, 1 year, no 3-year lock-in required — **₹1,081.40 total for year 1** (₹899 domain + ₹17.44 ICANN fee + ₹164.96 tax), renews ~₹1,681/yr after. Free domain privacy included. Supports UPI/Indian cards directly.
  - GoDaddy: real cart showed ₹1,029 subtotal (excl. tax, so ~₹1,214 with GST) for year 1, **renews at ₹1,599 + tax (~₹1,887/yr)** — more expensive than Hostinger on both counts once real fees/tax are included. (Earlier estimate that GoDaddy was cheaper, based on their "transfer price" page, was wrong — corrected once the real cart was checked.)
  - Porkbun: $11.08/yr flat forever, cheapest raw number, but USD-only payment (forex markup applies) and no INR/UPI support.
  - **Recommendation given: Hostinger**, cart is ready, user has not completed the purchase yet.
- **Once purchased**: adding it to Vercel is a standard DNS-only operation — Project Settings → Domains → add `radhikavijay.com` → configure DNS at Hostinger (either point nameservers to Vercel's `ns1/ns2.vercel-dns.com`, or add the specific A/CNAME records Vercel provides) → free auto SSL. **`radhikadesign.vercel.app` keeps working unchanged** — adding a custom domain is additive, not a replacement; nothing needs to be deleted. User explicitly wants to keep the `.vercel.app` link alive alongside the new custom domain.
