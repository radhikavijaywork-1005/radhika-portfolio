import { useNavigate } from "react-router-dom";

// Used to scroll the current page back to top before navigating, on the
// theory that a continuous "scroll up, then swap" motion would read
// smoother than an instant cut. In practice it did the opposite — from
// deep in a long page (e.g. scrolled down to AI Playground) it added a
// visible, janky extra step before the page even switched. Checked how
// the reference site (kishore.design) actually handles this: clicking a
// nav link mid-scroll does a plain instant route swap straight to the
// top of the new page, no pre-navigation scroll animation at all. That's
// what reads as smooth — speed and one less moving part, not an
// animated wind-up. ScrollToTop (App.jsx) already resets the new page to
// its top instantly on every route change, so this hook is now just a
// navigate() call.
export function useSmoothNavigate() {
  return useNavigate();
}
