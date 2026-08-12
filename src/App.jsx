import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import "./App.css";
import CustomCursor from "./components/CustomCursor";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Work from "./components/Work";
import Playground from "./components/Playground";
import Quote from "./components/Quote";
import Footer from "./components/Footer";
import { skills } from "./data/content";

// Every other route used to be a static import, which meant visiting Home
// downloaded the code for both case studies, About, and all 13 /preview/*
// experiments before Home could even render — a single ~460KB-gzip JS
// bundle blocking first paint on every page. Lazy-loading everything but
// Home splits each route into its own chunk, fetched only when actually
// visited.
const CaseStudyPaywall = lazy(() => import("./pages/CaseStudyPaywall"));
const CaseStudyTripAssurance = lazy(() => import("./pages/CaseStudyTripAssurance"));
const AboutMe = lazy(() => import("./pages/AboutMe"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PreviewMotion = lazy(() => import("./pages/PreviewMotion"));
const PreviewFuturistic = lazy(() => import("./pages/PreviewFuturistic"));
const PreviewSand = lazy(() => import("./pages/PreviewSand"));
const PreviewTexture = lazy(() => import("./pages/PreviewTexture"));
const PreviewVine = lazy(() => import("./pages/PreviewVine"));
const PreviewLeaf = lazy(() => import("./pages/PreviewLeaf"));
const PreviewWorkRows = lazy(() => import("./pages/PreviewWorkRows"));
const PreviewWorkStack = lazy(() => import("./pages/PreviewWorkStack"));
const PreviewHeroCalm = lazy(() => import("./pages/PreviewHeroCalm"));
const PreviewHeroOrganic = lazy(() => import("./pages/PreviewHeroOrganic"));
const PreviewPortraitMotion = lazy(() => import("./pages/PreviewPortraitMotion"));
const PreviewHeroPortraitMotion = lazy(() => import("./pages/PreviewHeroPortraitMotion"));
const PreviewDotPortrait = lazy(() => import("./pages/PreviewDotPortrait"));
const PreviewPlayground = lazy(() => import("./pages/PreviewPlayground"));
const PlaygroundEntry = lazy(() => import("./pages/PlaygroundEntry"));
const PlaygroundSahay = lazy(() => import("./pages/PlaygroundSahay"));

function Home() {
  return (
    <main>
      <Hero />
      <Marquee items={skills} />
      <Work />
      <Playground />
      <Quote />
    </main>
  );
}

// Remembers each pathname's scroll position (module-level, so it survives
// route changes for the life of the tab) — lets a "back" navigation return
// you to the same spot on a page (e.g. the Playground card you clicked
// into) instead of always resetting to the top. Matches the reference
// portfolio's own detail-page "Back" behavior.
const scrollPositions = new Map();

function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  // Runs on cleanup, right before the *next* pathname's effect fires — so
  // this captures the scroll position of the page being left, keyed to
  // that page, not the one being entered.
  useEffect(() => {
    return () => {
      scrollPositions.set(pathname, window.scrollY);
    };
  }, [pathname]);

  useEffect(() => {
    if (navigationType === "POP" && scrollPositions.has(pathname)) {
      const y = scrollPositions.get(pathname);
      const raf = requestAnimationFrame(() => {
        window.scrollTo({ top: y, left: 0, behavior: "smooth" });
      });
      return () => cancelAnimationFrame(raf);
    }

    // `html { scroll-behavior: smooth }` is global (index.css), so it's
    // there for intentional in-page anchor links (nav -> #work). Without
    // explicitly overriding it here, this route-change reset inherits that
    // smooth animation too — the new page's content swaps in instantly
    // while the scroll position is still mid-animation from wherever you
    // were on the previous page, which reads as "stuck at the bottom."
    // `behavior: "instant"` bypasses the CSS setting for just this call.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Framer Motion's whileInView IntersectionObservers can end up stuck
    // reporting nothing as intersecting right after a fresh load or an
    // instant/programmatic scroll reset — a 1px scroll nudge forces the
    // browser to recompute and fire the pending callbacks for content
    // that's already on screen, instead of leaving it stuck at its
    // "hidden" variant until the user happens to scroll.
    const raf = requestAnimationFrame(() => {
      window.scrollBy({ top: 1, behavior: "instant" });
      window.scrollBy({ top: -1, behavior: "instant" });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, navigationType]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const isPreview = pathname.startsWith("/preview/");

  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      {!isPreview && <Nav />}
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/work/paywall-experiments" element={<CaseStudyPaywall />} />
          <Route path="/work/trip-assurance" element={<CaseStudyTripAssurance />} />
          <Route path="/preview/motion" element={<PreviewMotion />} />
          <Route path="/preview/futuristic" element={<PreviewFuturistic />} />
          <Route path="/preview/sand" element={<PreviewSand />} />
          <Route path="/preview/texture" element={<PreviewTexture />} />
          <Route path="/preview/vine" element={<PreviewVine />} />
          <Route path="/preview/leaf" element={<PreviewLeaf />} />
          <Route path="/preview/work-rows" element={<PreviewWorkRows />} />
          <Route path="/preview/work-stack" element={<PreviewWorkStack />} />
          <Route path="/preview/hero-calm" element={<PreviewHeroCalm />} />
          <Route path="/preview/hero-organic" element={<PreviewHeroOrganic />} />
          <Route path="/preview/portrait-motion" element={<PreviewPortraitMotion />} />
          <Route path="/preview/hero-portrait-motion" element={<PreviewHeroPortraitMotion />} />
          <Route path="/preview/dot-portrait" element={<PreviewDotPortrait />} />
          <Route path="/preview/playground" element={<PreviewPlayground />} />
          {/* Sahay outgrew the generic PlaygroundEntry template (Ask,
              Search, the hierarchy section, the flow demo video), so it
              gets its own dedicated route/component. A static path
              matches ahead of the dynamic :slug one below regardless of
              declaration order, but it's listed first here for clarity. */}
          <Route path="/playground/sahay" element={<PlaygroundSahay />} />
          <Route path="/playground/:slug" element={<PlaygroundEntry />} />
          {/* Any other unmatched URL — without this, <Routes> matched
              nothing and rendered blank between the nav and footer instead
              of an actual 404. */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {!isPreview && <Footer />}
    </>
  );
}

export default App;
